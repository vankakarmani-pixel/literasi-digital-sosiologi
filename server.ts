import express, { Request, Response } from 'express';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

app.use(express.json());

interface PlayerData {
  id: string;
  name: string;
  classGrade: string;
  avatarId: number;
  x: number;
  y: number;
  direction: 'up' | 'down' | 'left' | 'right';
  isMoving: boolean;
  scores: {
    skills: number;
    culture: number;
    safety: number;
    ethics: number;
    total: number;
  };
  completedMissions: string[];
  lastSeen: number;
  isHost: boolean;
}

interface RoomData {
  code: string;
  players: Map<string, PlayerData>;
  sockets: Map<string, WebSocket>;
  coopBridge: {
    p1EthicalKeyFound: boolean;
    p2FirewallCleaned: boolean;
    bridgeBuilt: boolean;
  };
  chatMessages: Array<{
    id: string;
    senderId: string;
    senderName: string;
    text: string;
    timestamp: number;
    emote?: string;
  }>;
  created: number;
}

const rooms = new Map<string, RoomData>();

function getOrCreateRoom(roomCode: string): RoomData {
  const code = roomCode.toUpperCase().trim();
  let room = rooms.get(code);
  if (!room) {
    room = {
      code,
      players: new Map(),
      sockets: new Map(),
      coopBridge: {
        p1EthicalKeyFound: false,
        p2FirewallCleaned: false,
        bridgeBuilt: false,
      },
      chatMessages: [],
      created: Date.now(),
    };
    rooms.set(code, room);
  }
  return room;
}

function broadcastToRoom(room: RoomData, message: object, excludePlayerId?: string) {
  const payload = JSON.stringify(message);
  for (const [playerId, socket] of room.sockets.entries()) {
    if (playerId !== excludePlayerId && socket.readyState === WebSocket.OPEN) {
      socket.send(payload);
    }
  }
}

wss.on('connection', (ws: WebSocket) => {
  let currentRoomCode: string | null = null;
  let currentPlayerId: string | null = null;

  ws.on('message', (data: string) => {
    try {
      const msg = JSON.parse(data.toString());
      const { type, payload } = msg;

      switch (type) {
        case 'join_room': {
          const { roomCode, player } = payload;
          const room = getOrCreateRoom(roomCode);
          currentRoomCode = room.code;
          currentPlayerId = player.id;

          const isHost = room.players.size === 0;
          const fullPlayer: PlayerData = {
            ...player,
            isHost,
            lastSeen: Date.now(),
          };

          room.players.set(player.id, fullPlayer);
          room.sockets.set(player.id, ws);

          // Send current state to newly joined player
          ws.send(JSON.stringify({
            type: 'room_state',
            payload: {
              roomCode: room.code,
              players: Array.from(room.players.values()),
              coopBridge: room.coopBridge,
              chatMessages: room.chatMessages.slice(-30),
              isHost,
            },
          }));

          // Notify others in room
          broadcastToRoom(room, {
            type: 'player_joined',
            payload: { player: fullPlayer },
          }, player.id);
          break;
        }

        case 'player_move': {
          if (!currentRoomCode || !currentPlayerId) return;
          const room = rooms.get(currentRoomCode);
          if (!room) return;

          const player = room.players.get(currentPlayerId);
          if (player) {
            player.x = payload.x;
            player.y = payload.y;
            player.direction = payload.direction;
            player.isMoving = payload.isMoving;
            player.lastSeen = Date.now();

            broadcastToRoom(room, {
              type: 'player_moved',
              payload: {
                id: currentPlayerId,
                x: payload.x,
                y: payload.y,
                direction: payload.direction,
                isMoving: payload.isMoving,
              },
            }, currentPlayerId);
          }
          break;
        }

        case 'update_score': {
          if (!currentRoomCode || !currentPlayerId) return;
          const room = rooms.get(currentRoomCode);
          if (!room) return;

          const player = room.players.get(currentPlayerId);
          if (player) {
            player.scores = payload.scores;
            player.completedMissions = payload.completedMissions || player.completedMissions;
            player.lastSeen = Date.now();

            broadcastToRoom(room, {
              type: 'player_score_updated',
              payload: {
                id: currentPlayerId,
                scores: player.scores,
                completedMissions: player.completedMissions,
              },
            });
          }
          break;
        }

        case 'update_profile': {
          if (!currentRoomCode || !currentPlayerId) return;
          const room = rooms.get(currentRoomCode);
          if (!room) return;

          const player = room.players.get(currentPlayerId);
          if (player) {
            if (payload.avatarId !== undefined) player.avatarId = payload.avatarId;
            if (payload.customLook !== undefined) (player as any).customLook = payload.customLook;
            player.lastSeen = Date.now();

            broadcastToRoom(room, {
              type: 'player_profile_updated',
              payload: {
                id: currentPlayerId,
                avatarId: player.avatarId,
                customLook: (player as any).customLook,
              },
            });
          }
          break;
        }

        case 'send_chat': {
          if (!currentRoomCode || !currentPlayerId) return;
          const room = rooms.get(currentRoomCode);
          if (!room) return;

          const player = room.players.get(currentPlayerId);
          if (!player) return;

          const chatItem = {
            id: `chat-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            senderId: currentPlayerId,
            senderName: player.name,
            text: (payload.text || '').slice(0, 150),
            timestamp: Date.now(),
            emote: payload.emote,
          };

          room.chatMessages.push(chatItem);
          if (room.chatMessages.length > 50) {
            room.chatMessages.shift();
          }

          broadcastToRoom(room, {
            type: 'chat_received',
            payload: chatItem,
          });
          break;
        }

        case 'coop_action': {
          if (!currentRoomCode) return;
          const room = rooms.get(currentRoomCode);
          if (!room) return;

          if (payload.action === 'key_found') {
            room.coopBridge.p1EthicalKeyFound = true;
          } else if (payload.action === 'firewall_cleaned') {
            room.coopBridge.p2FirewallCleaned = true;
          }

          if (room.coopBridge.p1EthicalKeyFound && room.coopBridge.p2FirewallCleaned) {
            room.coopBridge.bridgeBuilt = true;
          }

          broadcastToRoom(room, {
            type: 'coop_updated',
            payload: room.coopBridge,
          });
          break;
        }

        case 'ping': {
          ws.send(JSON.stringify({ type: 'pong' }));
          break;
        }
      }
    } catch (err) {
      console.error('WebSocket message parsing error:', err);
    }
  });

  ws.on('close', () => {
    if (currentRoomCode && currentPlayerId) {
      const room = rooms.get(currentRoomCode);
      if (room) {
        room.players.delete(currentPlayerId);
        room.sockets.delete(currentPlayerId);

        broadcastToRoom(room, {
          type: 'player_left',
          payload: { id: currentPlayerId },
        });

        if (room.players.size === 0) {
          // Cleanup after 10 minutes of inactivity
          setTimeout(() => {
            const current = rooms.get(currentRoomCode!);
            if (current && current.players.size === 0) {
              rooms.delete(currentRoomCode!);
            }
          }, 10 * 60 * 1000);
        }
      }
    }
  });
});

// REST API for Teacher Dashboard and Room Inspection
app.get('/api/rooms/:roomId/scores', (req: Request, res: Response) => {
  const code = req.params.roomId.toUpperCase();
  const room = rooms.get(code);
  if (!room) {
    return res.status(404).json({ error: 'Ruang tidak ditemukan' });
  }

  const playersList = Array.from(room.players.values()).map(p => ({
    name: p.name,
    classGrade: p.classGrade,
    skills: p.scores.skills,
    culture: p.scores.culture,
    safety: p.scores.safety,
    ethics: p.scores.ethics,
    total: p.scores.total,
    completedMissions: p.completedMissions,
    isHost: p.isHost,
  }));

  res.json({
    roomCode: code,
    playerCount: playersList.length,
    players: playersList,
    coopBridge: room.coopBridge,
  });
});

app.get('/api/rooms/:roomId/export-csv', (req: Request, res: Response) => {
  const code = req.params.roomId.toUpperCase();
  const room = rooms.get(code);
  if (!room) {
    return res.status(404).send('Ruang tidak ditemukan');
  }

  const players = Array.from(room.players.values());
  const csvRows = [
    ['No', 'Nama Siswa', 'Kelas', 'Digital Skills', 'Digital Culture', 'Digital Safety', 'Digital Ethics', 'Total Skor', 'Status Literasi Digital'],
    ...players.map((p, idx) => {
      let status = 'Perlu Pendampingan';
      if (p.scores.total >= 3500) status = 'Warga Siber Bijak & Teladan';
      else if (p.scores.total >= 2500) status = 'Agen Literasi Digital Mandiri';
      else if (p.scores.total >= 1500) status = 'Warganet Berkembang';

      return [
        idx + 1,
        `"${p.name.replace(/"/g, '""')}"`,
        `"${p.classGrade.replace(/"/g, '""')}"`,
        p.scores.skills,
        p.scores.culture,
        p.scores.safety,
        p.scores.ethics,
        p.scores.total,
        `"${status}"`,
      ];
    }),
  ];

  const csvContent = csvRows.map(row => row.join(',')).join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="Hasil_Sosiologi_Kota_Siber_${code}.csv"`);
  res.status(200).send(csvContent);
});

// Create or check room
app.post('/api/rooms/create', (req: Request, res: Response) => {
  const code = (req.body.code || Math.random().toString(36).substring(2, 8)).toUpperCase();
  const room = getOrCreateRoom(code);
  res.json({ roomCode: room.code, activeCount: room.players.size });
});

// Mount Vite or serve static
async function startServer() {
  const port = 3000;
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  server.listen(port, '0.0.0.0', () => {
    console.log(`Kota Siber Game Server running on http://0.0.0.0:${port}`);
  });
}

startServer();
