import { PlayerProfile, RemotePlayer, Direction, PillarScores, CoopState, ChatMessage, CustomLook } from './types';

export type SocketCallback = (event: string, data: unknown) => void;

class SocketClient {
  private ws: WebSocket | null = null;
  private listeners: Map<string, Set<SocketCallback>> = new Map();
  private isConnected: boolean = false;
  private pendingRoomCode: string | null = null;
  private pendingProfile: PlayerProfile | null = null;
  private reconnectTimer: number | null = null;
  private lastMoveSent: number = 0;

  constructor() {
    this.connect();
  }

  private connect() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const wsUrl = `${protocol}//${host}/ws`;

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this.isConnected = true;
        this.emit('connection_status', { connected: true });

        // Auto rejoin if we had joined a room
        if (this.pendingRoomCode && this.pendingProfile) {
          this.joinRoom(this.pendingRoomCode, this.pendingProfile);
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          this.emit(msg.type, msg.payload);
        } catch (e) {
          console.error('Error parsing WS message', e);
        }
      };

      this.ws.onclose = () => {
        this.isConnected = false;
        this.emit('connection_status', { connected: false });
        this.scheduleReconnect();
      };

      this.ws.onerror = () => {
        this.isConnected = false;
        this.emit('connection_status', { connected: false });
      };
    } catch (e) {
      console.warn('WebSocket connection not ready, scheduling retry...', e);
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) return;
    this.reconnectTimer = window.setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, 3000);
  }

  public joinRoom(roomCode: string, profile: PlayerProfile) {
    this.pendingRoomCode = roomCode;
    this.pendingProfile = profile;

    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    this.send('join_room', {
      roomCode,
      player: {
        id: profile.id,
        name: profile.name,
        classGrade: profile.classGrade,
        avatarId: profile.avatarId,
        x: 1250,
        y: 1300,
        direction: 'down',
        isMoving: false,
        scores: {
          skills: 0,
          culture: 0,
          safety: 0,
          ethics: 0,
          total: 0,
        },
        completedMissions: [],
      },
    });
  }

  public sendMove(x: number, y: number, direction: Direction, isMoving: boolean) {
    const now = Date.now();
    // Throttle movement packets to ~20Hz (every 50ms)
    if (now - this.lastMoveSent < 50 && !isMoving) return;
    this.lastMoveSent = now;

    this.send('player_move', { x, y, direction, isMoving });
  }

  public updateScore(scores: PillarScores, completedMissions: string[]) {
    this.send('update_score', { scores, completedMissions });
  }

  public updateProfile(avatarId: number, customLook?: CustomLook) {
    this.send('update_profile', { avatarId, customLook });
  }

  public sendChat(text: string, emote?: string) {
    this.send('send_chat', { text, emote });
  }

  public sendCoopAction(action: 'key_found' | 'firewall_cleaned') {
    this.send('coop_action', { action });
  }

  private send(type: string, payload: unknown) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, payload }));
    }
  }

  public on(event: string, callback: SocketCallback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
    return () => this.off(event, callback);
  }

  public off(event: string, callback: SocketCallback) {
    this.listeners.get(event)?.delete(callback);
  }

  private emit(event: string, data: unknown) {
    const cbs = this.listeners.get(event);
    if (cbs) {
      cbs.forEach(cb => {
        try {
          cb(event, data);
        } catch (e) {
          console.error(`Error in event listener ${event}:`, e);
        }
      });
    }
  }

  public isSocketConnected(): boolean {
    return this.isConnected;
  }
}

export const socket = new SocketClient();
