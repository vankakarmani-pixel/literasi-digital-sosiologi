import React, { useEffect, useRef, useState, useCallback } from 'react';
import { drawCharacterSprite } from '../game/avatarSprites';
import { MAP_WIDTH, MAP_HEIGHT, LOCATIONS, NPCS, INTERACTIVE_ITEMS, HAZARD_SCANNERS, COLLISION_OBSTACLES } from '../game/worldData';
import { INTERIOR_ROOMS, BUILDING_DOORS } from '../game/interiors';
import { Direction, RemotePlayer, NPCData, InteractiveItem, HazardScanner, Rect, CustomLook } from '../game/types';
import { sound } from '../game/audio';

interface Props {
  playerId: string;
  playerName: string;
  classGrade: string;
  avatarId: number;
  currentRoom: string;
  remotePlayers: RemotePlayer[];
  completedMissions: string[];
  collectedItemIds: string[];
  customLook?: CustomLook;
  onPlayerMove: (x: number, y: number, direction: Direction, isMoving: boolean) => void;
  onInteractNPC: (npc: NPCData) => void;
  onCollectItem: (item: InteractiveItem) => void;
  onNearInteractableChange: (text: string | null) => void;
  onRoomChange: (roomId: string, spawnX: number, spawnY: number) => void;
  onTriggerTerminalAction: (action: string) => void;
}

export const GameCanvas: React.FC<Props> = ({
  playerId,
  playerName,
  classGrade,
  avatarId,
  currentRoom,
  remotePlayers,
  completedMissions,
  collectedItemIds,
  customLook,
  onPlayerMove,
  onInteractNPC,
  onCollectItem,
  onNearInteractableChange,
  onRoomChange,
  onTriggerTerminalAction,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Player position in current space (town or interior room)
  const playerPos = useRef({ x: 1300, y: 1320 });
  const playerDir = useRef<Direction>('down');
  const isMoving = useRef(false);
  const walkTimer = useRef(0);
  const keysHeld = useRef<{ [key: string]: boolean }>({});
  const lastFootstep = useRef(0);
  const lastAlarmTime = useRef(0);

  // Virtual Joystick & Touch state for mobile
  const touchJoystick = useRef<{ active: boolean; startX: number; startY: number; currX: number; currY: number }>({
    active: false,
    startX: 0,
    startY: 0,
    currX: 0,
    currY: 0,
  });

  // Nearest interactable target
  const nearestTarget = useRef<{
    type: 'npc' | 'item' | 'door_in' | 'door_out' | 'terminal';
    target: any;
  } | null>(null);

  // Scanners for town stealth
  const scanners = useRef<HazardScanner[]>(JSON.parse(JSON.stringify(HAZARD_SCANNERS)));

  // Setup Keyboard Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      keysHeld.current[e.key.toLowerCase()] = true;
      keysHeld.current[e.code] = true;

      if (e.key === 'e' || e.key === 'E') {
        triggerInteraction();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysHeld.current[e.key.toLowerCase()] = false;
      keysHeld.current[e.code] = false;
    };

    const handleBlur = () => {
      keysHeld.current = {};
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  const triggerInteraction = useCallback(() => {
    if (!nearestTarget.current) return;
    const { type, target } = nearestTarget.current;

    if (type === 'door_in') {
      sound.playDoorEnter();
      playerPos.current = { x: target.spawnInside.x, y: target.spawnInside.y };
      onRoomChange(target.targetRoomId, target.spawnInside.x, target.spawnInside.y);
    } else if (type === 'door_out') {
      sound.playDoorExit();
      playerPos.current = { x: target.targetOutside.x, y: target.targetOutside.y };
      onRoomChange('town', target.targetOutside.x, target.targetOutside.y);
    } else if (type === 'npc') {
      sound.playBlip(750);
      onInteractNPC(target as NPCData);
    } else if (type === 'item') {
      const item = target as InteractiveItem;
      sound.playItemCollect();
      onCollectItem(item);
    } else if (type === 'terminal') {
      sound.playTerminalBeep();
      onTriggerTerminalAction(target.interactiveAction);
    }
  }, [onInteractNPC, onCollectItem, onRoomChange, onTriggerTerminalAction]);

  // Handle spawn position update when room changes externally
  useEffect(() => {
    if (currentRoom === 'town') {
      // Keep or reset to default
    } else {
      const room = INTERIOR_ROOMS[currentRoom];
      if (room) {
        playerPos.current = { x: room.exitDoor.x + 30, y: room.exitDoor.y - 50 };
      }
    }
  }, [currentRoom]);

  // Main 60fps Game Simulation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let lastTime = performance.now();

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const isInside = currentRoom !== 'town';
    const interior = isInside ? INTERIOR_ROOMS[currentRoom] : null;

    const checkCollision = (newX: number, newY: number, radius = 14): boolean => {
      if (isInside && interior) {
        // Inside room boundaries
        if (newX < radius + 40 || newX > interior.w - radius - 40) return true;
        if (newY < radius + 40 || newY > interior.h - radius - 40) return true;

        // Interior obstacles
        for (const obs of interior.obstacles) {
          if (
            newX + radius > obs.x &&
            newX - radius < obs.x + obs.w &&
            newY + radius > obs.y &&
            newY - radius < obs.y + obs.h
          ) {
            return true;
          }
        }
        return false;
      }

      // Outdoor Town boundaries
      if (newX < radius + 50 || newX > MAP_WIDTH - radius - 50) return true;
      if (newY < radius + 50 || newY > MAP_HEIGHT - radius - 50) return true;

      // Outdoor obstacles
      for (const box of COLLISION_OBSTACLES) {
        if (
          newX + radius > box.x &&
          newX - radius < box.x + box.w &&
          newY + radius > box.y &&
          newY - radius < box.y + box.h
        ) {
          return true;
        }
      }

      // Echo Chamber barrier before Mission 2
      if (!completedMissions.includes('mission2')) {
        const bubbleDist = Math.hypot(newX - 600, newY - 580);
        if (bubbleDist < 160) return true;
      }

      return false;
    };

    const loop = (currentTime: number) => {
      const rawDt = (currentTime - lastTime) / 1000;
      lastTime = currentTime;
      const dt = Math.min(rawDt, 0.05);

      // 1. UPDATE PLAYER MOVEMENT
      let dx = 0;
      let dy = 0;

      if (keysHeld.current['w'] || keysHeld.current['arrowup']) dy -= 1;
      if (keysHeld.current['s'] || keysHeld.current['arrowdown']) dy += 1;
      if (keysHeld.current['a'] || keysHeld.current['arrowleft']) dx -= 1;
      if (keysHeld.current['d'] || keysHeld.current['arrowright']) dx += 1;

      // Virtual Joystick touch input
      if (touchJoystick.current.active) {
        const jx = touchJoystick.current.currX - touchJoystick.current.startX;
        const jy = touchJoystick.current.currY - touchJoystick.current.startY;
        const dist = Math.hypot(jx, jy);
        if (dist > 10) {
          dx = jx / dist;
          dy = jy / dist;
        }
      }

      const moving = dx !== 0 || dy !== 0;
      isMoving.current = moving;

      if (moving) {
        const len = Math.hypot(dx, dy);
        const speed = 210 * dt;
        const nextX = playerPos.current.x + (dx / len) * speed;
        const nextY = playerPos.current.y + (dy / len) * speed;

        if (Math.abs(dx) > Math.abs(dy)) {
          playerDir.current = dx > 0 ? 'right' : 'left';
        } else {
          playerDir.current = dy > 0 ? 'down' : 'up';
        }

        if (!checkCollision(nextX, playerPos.current.y)) {
          playerPos.current.x = nextX;
        }
        if (!checkCollision(playerPos.current.x, nextY)) {
          playerPos.current.y = nextY;
        }

        walkTimer.current += dt;

        if (currentTime - lastFootstep.current > 320) {
          sound.playFootstep();
          lastFootstep.current = currentTime;
        }

        onPlayerMove(playerPos.current.x, playerPos.current.y, playerDir.current, true);
      } else {
        onPlayerMove(playerPos.current.x, playerPos.current.y, playerDir.current, false);
      }

      // 2. CHECK SCANNERS (Town Only)
      if (!isInside) {
        for (const scanner of scanners.current) {
          scanner.angle += scanner.speed * scanner.direction * dt;
          if (Math.abs(scanner.angle) > scanner.sweepRange) {
            scanner.direction *= -1;
          }

          const sDist = Math.hypot(playerPos.current.x - scanner.x, playerPos.current.y - scanner.y);
          if (sDist < scanner.length) {
            const angleToPlayer = Math.atan2(playerPos.current.y - scanner.y, playerPos.current.x - scanner.x);
            let angleDiff = Math.abs(angleToPlayer - scanner.angle);
            while (angleDiff > Math.PI) angleDiff = Math.abs(angleDiff - Math.PI * 2);

            if (angleDiff < 0.45 && !completedMissions.includes('mission3')) {
              if (currentTime - lastAlarmTime.current > 1200) {
                sound.playAlarm();
                lastAlarmTime.current = currentTime;
                playerPos.current.x = 520;
                playerPos.current.y = 1660;
              }
            }
          }
        }
      }

      // 3. CHECK NEAREST INTERACTABLE (Doors, NPCs, Terminals, Items)
      let closestDist = 70;
      let foundTarget: any = null;
      let promptText: string | null = null;

      if (isInside && interior) {
        // A. Check exit door
        const dDoor = Math.hypot(
          playerPos.current.x - (interior.exitDoor.x + interior.exitDoor.w / 2),
          playerPos.current.y - (interior.exitDoor.y + interior.exitDoor.h / 2)
        );
        if (dDoor < 65) {
          closestDist = dDoor;
          foundTarget = { type: 'door_out', target: interior.exitDoor };
          promptText = '[E] Keluar ke Kota Siber';
        }

        // B. Check interior terminals
        for (const furn of interior.furniture) {
          if (furn.interactiveAction) {
            const dFurn = Math.hypot(
              playerPos.current.x - (furn.x + furn.w / 2),
              playerPos.current.y - (furn.y + furn.h / 2)
            );
            if (dFurn < 75 && dFurn < closestDist) {
              closestDist = dFurn;
              foundTarget = { type: 'terminal', target: furn };
              promptText = `[E] Akses ${furn.name}`;
            }
          }
        }

        // C. Check interior NPCs
        for (const npc of interior.npcs) {
          const dNpc = Math.hypot(playerPos.current.x - npc.x, playerPos.current.y - npc.y);
          if (dNpc < 70 && dNpc < closestDist) {
            closestDist = dNpc;
            foundTarget = { type: 'npc', target: npc };
            promptText = `[E] Berbicara dengan ${npc.name}`;
          }
        }
      } else {
        // OUTSIDE IN TOWN:
        // A. Check building doors
        for (const door of BUILDING_DOORS) {
          const dDoor = Math.hypot(
            playerPos.current.x - (door.x + door.w / 2),
            playerPos.current.y - (door.y + door.h / 2)
          );
          if (dDoor < 65 && dDoor < closestDist) {
            closestDist = dDoor;
            foundTarget = { type: 'door_in', target: door };
            promptText = `[E] Masuk ke dalam ${door.buildingName}`;
          }
        }

        // B. Check outdoor NPCs
        for (const npc of NPCS) {
          const d = Math.hypot(playerPos.current.x - npc.x, playerPos.current.y - npc.y);
          const maxRange = npc.id === 'netizen_terjebak' && !completedMissions.includes('mission2') ? 200 : 70;
          if (d < maxRange && (!foundTarget || d < closestDist)) {
            closestDist = d;
            foundTarget = { type: 'npc', target: npc };
            promptText = `[E] Berbicara dengan ${npc.name}`;
          }
        }

        // C. Check collectible items
        for (const item of INTERACTIVE_ITEMS) {
          if (collectedItemIds.includes(item.id)) continue;
          const d = Math.hypot(playerPos.current.x - item.x, playerPos.current.y - item.y);
          if (d < 50 && d < closestDist) {
            closestDist = d;
            foundTarget = { type: 'item', target: item };
            promptText = `[E] Ambil: ${item.name}`;
          }
        }
      }

      nearestTarget.current = foundTarget;
      onNearInteractableChange(promptText);

      // 4. CAMERA SETUP
      const screenW = window.innerWidth;
      const screenH = window.innerHeight;

      let camX = 0;
      let camY = 0;

      if (isInside && interior) {
        camX = Math.max(0, Math.min(Math.max(0, interior.w - screenW), playerPos.current.x - screenW / 2));
        camY = Math.max(0, Math.min(Math.max(0, interior.h - screenH), playerPos.current.y - screenH / 2));
      } else {
        camX = Math.max(0, Math.min(MAP_WIDTH - screenW, playerPos.current.x - screenW / 2));
        camY = Math.max(0, Math.min(MAP_HEIGHT - screenH, playerPos.current.y - screenH / 2));
      }

      // 5. RENDER CANVAS
      ctx.clearRect(0, 0, screenW, screenH);
      ctx.save();
      ctx.translate(-camX, -camY);

      // ----------------------------------------------------
      // A. RENDER INTERIOR ROOM (When inside a building)
      // ----------------------------------------------------
      if (isInside && interior) {
        // Void background
        ctx.fillStyle = '#020617';
        ctx.fillRect(camX, camY, screenW, screenH);

        // Room Floor (Warm wooden planks or tech tiles)
        ctx.fillStyle = interior.floorColor;
        ctx.fillRect(0, 0, interior.w, interior.h);

        // Grid floor plank lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
        ctx.lineWidth = 1;
        for (let x = 40; x < interior.w - 40; x += 40) {
          ctx.beginPath();
          ctx.moveTo(x, 40);
          ctx.lineTo(x, interior.h - 40);
          ctx.stroke();
        }
        for (let y = 40; y < interior.h - 40; y += 40) {
          ctx.beginPath();
          ctx.moveTo(40, y);
          ctx.lineTo(interior.w - 40, y);
          ctx.stroke();
        }

        // Room Walls
        ctx.fillStyle = interior.wallColor;
        ctx.fillRect(0, 0, interior.w, 50); // North wall
        ctx.fillRect(0, 0, 40, interior.h); // West wall
        ctx.fillRect(interior.w - 40, 0, 40, interior.h); // East wall
        ctx.fillRect(0, interior.h - 40, interior.w, 40); // South wall

        // Wall trim borders
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.strokeRect(40, 50, interior.w - 80, interior.h - 90);

        // Room Banner
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 16px "Chakra Petch", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(interior.name.toUpperCase(), interior.w / 2, 32);

        // Render Interior Furniture & Objects (Pixel Art Style)
        for (const furn of interior.furniture) {
          ctx.save();
          const fx = Math.round(furn.x);
          const fy = Math.round(furn.y);
          const fw = Math.round(furn.w);
          const fh = Math.round(furn.h);

          // Pixel drop shadow
          ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
          ctx.fillRect(fx + 4, fy + 4, fw, fh);

          // Base chassis with pixel border
          ctx.fillStyle = furn.color || '#334155';
          ctx.fillRect(fx, fy, fw, fh);
          ctx.strokeStyle = '#0f172a';
          ctx.lineWidth = 2;
          ctx.strokeRect(fx, fy, fw, fh);

          // Top pixel highlight
          ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
          ctx.fillRect(fx + 2, fy + 2, fw - 4, 3);

          if (furn.type === 'terminal' || furn.type === 'computer') {
            // Pixel Computer Workstation: Monitor + Screen + Keyboard
            const monW = Math.min(fw - 16, 64);
            const monH = Math.min(fh - 22, 36);
            const monX = fx + Math.floor((fw - monW) / 2);
            const monY = fy + 6;

            // Monitor bezel
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(monX, monY, monW, monH);
            // Glowing pixel screen
            ctx.fillStyle = '#0ea5e9';
            ctx.fillRect(monX + 3, monY + 3, monW - 6, monH - 6);
            // Screen scanlines / code bars
            ctx.fillStyle = '#bae6fd';
            ctx.fillRect(monX + 6, monY + 7, Math.max(8, monW - 22), 2);
            ctx.fillRect(monX + 6, monY + 12, Math.max(6, monW - 30), 2);
            ctx.fillRect(monX + 6, monY + 17, Math.max(10, monW - 18), 2);

            // Pixel Keyboard
            const kbW = Math.min(fw - 24, 48);
            const kbX = fx + Math.floor((fw - kbW) / 2);
            const kbY = monY + monH + 4;
            if (kbY + 8 <= fy + fh) {
              ctx.fillStyle = '#1e293b';
              ctx.fillRect(kbX, kbY, kbW, 8);
              ctx.fillStyle = '#94a3b8';
              for (let kx = kbX + 3; kx < kbX + kbW - 4; kx += 5) {
                ctx.fillRect(kx, kbY + 2, 3, 2);
                ctx.fillRect(kx, kbY + 5, 3, 2);
              }
            }
          } else if (furn.type === 'server') {
            // Pixel Server Rack: Horizontal bays + vents + blinking LEDs
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(fx + 6, fy + 8, fw - 12, fh - 16);
            for (let bayY = fy + 12; bayY < fy + fh - 12; bayY += 12) {
              ctx.fillStyle = '#1e293b';
              ctx.fillRect(fx + 9, bayY, fw - 18, 8);
              const ledOn = Math.sin(currentTime * 0.006 + bayY + fx) > 0;
              ctx.fillStyle = ledOn ? '#22d3ee' : '#0369a1';
              ctx.fillRect(fx + 12, bayY + 2, 3, 3);
              ctx.fillStyle = !ledOn ? '#10b981' : '#047857';
              ctx.fillRect(fx + 18, bayY + 2, 3, 3);
            }
          } else if (furn.type === 'shelf') {
            // Pixel Bookshelf: Shelves + colorful pixel books
            const bookColors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#a855f7', '#ec4899'];
            for (let shelfY = fy + 8; shelfY < fy + fh - 10; shelfY += 18) {
              ctx.fillStyle = '#451a03';
              ctx.fillRect(fx + 4, shelfY + 12, fw - 8, 3);
              let bx = fx + 7;
              let idx = 0;
              while (bx < fx + fw - 10) {
                const bw = 5 + ((idx * 3) % 3);
                ctx.fillStyle = bookColors[(idx + Math.floor(fx)) % bookColors.length];
                ctx.fillRect(bx, shelfY, bw, 12);
                ctx.fillStyle = 'rgba(255,255,255,0.25)';
                ctx.fillRect(bx + 1, shelfY + 1, 1, 10);
                bx += bw + 1;
                idx++;
              }
            }
          } else if (furn.type === 'plant') {
            // Pixel Potted Plant: Terracotta pot + pixel leaves
            const cx = fx + Math.floor(fw / 2);
            const cy = fy + Math.floor(fh / 2);
            ctx.fillStyle = '#b45309';
            ctx.fillRect(cx - 10, cy + 2, 20, 14);
            ctx.fillStyle = '#d97706';
            ctx.fillRect(cx - 12, cy, 24, 4);
            // Pixel leaves
            ctx.fillStyle = '#15803d';
            ctx.fillRect(cx - 14, cy - 12, 12, 12);
            ctx.fillRect(cx + 2, cy - 12, 12, 12);
            ctx.fillStyle = '#22c55e';
            ctx.fillRect(cx - 8, cy - 16, 16, 14);
          } else if (furn.type === 'sofa') {
            // Pixel Sofa / Bed: Cushions + pillows
            ctx.fillStyle = 'rgba(0,0,0,0.2)';
            ctx.fillRect(fx + 6, fy + 6, fw - 12, fh - 12);
            ctx.fillStyle = '#fdf2f8';
            ctx.fillRect(fx + 10, fy + 10, 22, 16);
            if (fw > 80) {
              ctx.fillRect(fx + fw - 32, fy + 10, 22, 16);
            }
          } else if (furn.type === 'desk') {
            // Pixel Desk: Paper sheets + coffee mug
            ctx.fillStyle = '#f8fafc';
            ctx.fillRect(fx + 14, fy + 12, 18, 22);
            ctx.fillStyle = '#94a3b8';
            ctx.fillRect(fx + 17, fy + 16, 12, 2);
            ctx.fillRect(fx + 17, fy + 21, 10, 2);
            ctx.fillRect(fx + 17, fy + 26, 12, 2);
            // Coffee mug
            if (fw > 70) {
              ctx.fillStyle = '#e2e8f0';
              ctx.fillRect(fx + fw - 24, fy + 14, 10, 10);
              ctx.fillStyle = '#78350f';
              ctx.fillRect(fx + fw - 22, fy + 16, 6, 4);
            }
          }

          // Labels on furniture
          if (furn.label) {
            ctx.fillStyle = '#f8fafc';
            ctx.font = 'bold 9px "Chakra Petch", sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(furn.label, fx + fw / 2, fy + fh - 5);
          }

          ctx.restore();
        }

        // Exit Door Mat
        const ex = interior.exitDoor;
        ctx.save();
        ctx.fillStyle = '#10b98140';
        ctx.fillRect(ex.x, ex.y, ex.w, ex.h);
        ctx.strokeStyle = '#34d399';
        ctx.lineWidth = 2;
        ctx.strokeRect(ex.x, ex.y, ex.w, ex.h);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px "Chakra Petch", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('KELUAR [E]', ex.x + ex.w / 2, ex.y + ex.h / 2 + 4);
        ctx.restore();

        // Render Interior NPCs
        for (const npc of interior.npcs) {
          const isCompleted = completedMissions.includes(npc.associatedMission);
          drawCharacterSprite(
            ctx,
            npc.x,
            npc.y,
            1,
            'down',
            false,
            0,
            npc.name,
            npc.title,
            false,
            npc.spriteCol,
            npc.spriteRow
          );

          // Quest marker above head
          ctx.save();
          ctx.font = 'bold 16px "Chakra Petch", sans-serif';
          ctx.textAlign = 'center';
          ctx.fillStyle = isCompleted ? '#10b981' : '#fbbf24';
          ctx.fillText(isCompleted ? '✓' : '!', npc.x, npc.y - 36);
          ctx.restore();
        }
      }

      // ----------------------------------------------------
      // B. RENDER OUTDOOR PIXEL ART TOWN (Inspired by Images 2 & 3)
      // ----------------------------------------------------
      else {
        // Lush green grass base
        ctx.fillStyle = '#4ade80';
        ctx.fillRect(camX, camY, screenW, screenH);

        // Soft pastel green grass patches
        ctx.fillStyle = '#86efac';
        for (let x = Math.floor(camX / 200) * 200; x < camX + screenW + 200; x += 180) {
          for (let y = Math.floor(camY / 200) * 200; y < camY + screenH + 200; y += 180) {
            ctx.beginPath();
            ctx.roundRect(x + 20, y + 20, 100, 70, 20);
            ctx.fill();
          }
        }

        // River canal across town
        ctx.save();
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(1740, 1700, 140, 600); // river channel
        ctx.fillStyle = '#0ea5e9';
        ctx.fillRect(1770, 1700, 80, 600);

        // Stone Embankments along river
        ctx.fillStyle = '#64748b';
        ctx.fillRect(1730, 1700, 12, 600);
        ctx.fillRect(1878, 1700, 12, 600);

        // Wooden Bridge over river (Jembatan Toleransi Siber)
        ctx.fillStyle = '#b45309';
        ctx.fillRect(1720, 1850, 180, 60);
        ctx.fillStyle = '#d97706';
        ctx.fillRect(1725, 1855, 170, 50);
        // Bridge planks
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 2;
        for (let bx = 1730; bx < 1890; bx += 18) {
          ctx.beginPath();
          ctx.moveTo(bx, 1855);
          ctx.lineTo(bx, 1905);
          ctx.stroke();
        }
        ctx.restore();

        // 8 Major City Zones (Ground Plates & Pathways)
        for (const loc of LOCATIONS) {
          ctx.save();
          ctx.fillStyle = `${loc.color}20`;
          ctx.strokeStyle = `${loc.accent}80`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(loc.x, loc.y, loc.width, loc.height, 20);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = `${loc.accent}`;
          ctx.font = 'bold 15px "Chakra Petch", sans-serif';
          ctx.fillText(loc.name.toUpperCase(), loc.x + 20, loc.y + 35);
          ctx.restore();
        }

        // Pine Trees inspired by Image 2 & 3
        const pineTreeCoords = [
          { x: 1000, y: 1000 },
          { x: 1540, y: 1000 },
          { x: 1800, y: 1150 },
          { x: 2280, y: 1150 },
          { x: 860, y: 600 },
          { x: 420, y: 900 },
          { x: 780, y: 1700 },
          { x: 1600, y: 1800 },
        ];

        for (const pt of pineTreeCoords) {
          ctx.save();
          // Shadow
          ctx.fillStyle = 'rgba(0,0,0,0.25)';
          ctx.beginPath();
          ctx.ellipse(pt.x, pt.y + 30, 24, 10, 0, 0, Math.PI * 2);
          ctx.fill();

          // Trunk
          ctx.fillStyle = '#78350f';
          ctx.fillRect(pt.x - 6, pt.y + 10, 12, 20);

          // Tiered pine foliage (like pixel art tree in Image 2)
          ctx.fillStyle = '#15803d';
          ctx.beginPath();
          ctx.moveTo(pt.x, pt.y - 45);
          ctx.lineTo(pt.x + 30, pt.y + 12);
          ctx.lineTo(pt.x - 30, pt.y + 12);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = '#22c55e';
          ctx.beginPath();
          ctx.moveTo(pt.x, pt.y - 45);
          ctx.lineTo(pt.x + 18, pt.y - 5);
          ctx.lineTo(pt.x - 18, pt.y - 5);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }

        // Buildings: Cute Pixel Cottages inspired by Image 3
        const cottages = [
          { name: 'BALAI KOTA', x: 1200, y: 1100, w: 200, h: 90, roofColor: '#ea580c' },
          { name: 'MARKAS CEKFAKTA', x: 1850, y: 400, w: 220, h: 100, roofColor: '#059669' },
          { name: 'RUANG GELEMBUNG', x: 480, y: 400, w: 200, h: 100, roofColor: '#9333ea' },
          { name: 'KANTOR PRIVASI', x: 420, y: 1540, w: 200, h: 100, roofColor: '#dc2626' },
          { name: 'KAMPANYE DIGITAL', x: 1200, y: 1820, w: 220, h: 100, roofColor: '#db2777' },
          { name: 'WISMA KOMUNITAS', x: 2050, y: 1220, w: 180, h: 90, roofColor: '#d97706' },
          { name: 'RUMAH KACA BOTANI', x: 2050, y: 1500, w: 190, h: 90, roofColor: '#16a34a' },
          { name: 'KLINIK SIBER', x: 750, y: 1100, w: 190, h: 90, roofColor: '#0284c7' },
          { name: 'KAMAR SISWA ESTETIK', x: 750, y: 1500, w: 190, h: 90, roofColor: '#ec4899' },
        ];

        for (const cot of cottages) {
          ctx.save();
          // Shadow
          ctx.fillStyle = 'rgba(0,0,0,0.3)';
          ctx.fillRect(cot.x + 6, cot.y + 6, cot.w, cot.h);

          // Walls (cream/wood like image 3)
          ctx.fillStyle = '#fef3c7';
          ctx.fillRect(cot.x, cot.y + 30, cot.w, cot.h - 30);
          ctx.strokeStyle = '#78350f';
          ctx.lineWidth = 2;
          ctx.strokeRect(cot.x, cot.y + 30, cot.w, cot.h - 30);

          // Roof (tiled pixel roof)
          ctx.fillStyle = cot.roofColor;
          ctx.beginPath();
          ctx.moveTo(cot.x - 10, cot.y + 30);
          ctx.lineTo(cot.x + cot.w / 2, cot.y - 15);
          ctx.lineTo(cot.x + cot.w + 10, cot.y + 30);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Chimney
          ctx.fillStyle = '#475569';
          ctx.fillRect(cot.x + cot.w - 30, cot.y - 12, 16, 26);

          // Building Title
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 11px "Chakra Petch", sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(cot.name, cot.x + cot.w / 2, cot.y + 16);
          ctx.restore();
        }

        // Render Building Doors with glowing entrance pads
        for (const door of BUILDING_DOORS) {
          ctx.save();
          // Wooden door frame
          ctx.fillStyle = '#78350f';
          ctx.fillRect(door.x, door.y, door.w, door.h);

          // Door panel & brass knob
          ctx.fillStyle = '#b45309';
          ctx.fillRect(door.x + 4, door.y + 4, door.w - 8, door.h - 4);
          ctx.fillStyle = '#fde047';
          ctx.beginPath();
          ctx.arc(door.x + door.w - 12, door.y + door.h / 2, 3, 0, Math.PI * 2);
          ctx.fill();

          // Glowing entry doormat
          ctx.fillStyle = 'rgba(6, 182, 212, 0.4)';
          ctx.fillRect(door.x - 5, door.y + door.h, door.w + 10, 16);
          ctx.strokeStyle = '#22d3ee';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(door.x - 5, door.y + door.h, door.w + 10, 16);

          // Door sign
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 9px "Chakra Petch", sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('PINTU MASUK', door.x + door.w / 2, door.y - 6);
          ctx.restore();
        }

        // Collectible items in town (Real Pixel-Art Objects)
        for (const item of INTERACTIVE_ITEMS) {
          if (collectedItemIds.includes(item.id)) continue;
          const itemBob = Math.round(Math.sin(currentTime * 0.005 + item.x) * 3);
          const ix = Math.round(item.x);
          const iy = Math.round(item.y + itemBob);

          ctx.save();
          // Subtle ground shadow
          ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
          ctx.fillRect(ix - 10, Math.round(item.y) + 12, 20, 4);

          if (item.type === 'raw_fact_image') {
            // Pixel Polaroid Photo / Evidence
            ctx.fillStyle = '#f8fafc';
            ctx.fillRect(ix - 11, iy - 13, 22, 26);
            ctx.strokeStyle = '#0f172a';
            ctx.lineWidth = 2;
            ctx.strokeRect(ix - 11, iy - 13, 22, 26);
            // Photo inner sky & mountain
            ctx.fillStyle = '#0284c7';
            ctx.fillRect(ix - 8, iy - 10, 16, 14);
            ctx.fillStyle = '#10b981';
            ctx.fillRect(ix - 8, iy - 2, 16, 6);
          } else if (item.type === 'opinion_card') {
            // Pixel Opinion / Trading Card
            ctx.fillStyle = '#6b21a8';
            ctx.fillRect(ix - 10, iy - 13, 20, 26);
            ctx.strokeStyle = '#facc15';
            ctx.lineWidth = 2;
            ctx.strokeRect(ix - 10, iy - 13, 20, 26);
            ctx.fillStyle = '#e9d5ff';
            ctx.fillRect(ix - 6, iy - 8, 12, 4);
            ctx.fillStyle = '#c084fc';
            ctx.fillRect(ix - 6, iy - 1, 12, 2);
            ctx.fillRect(ix - 6, iy + 3, 9, 2);
            ctx.fillRect(ix - 6, iy + 7, 11, 2);
          } else if (item.type === 'leaked_data') {
            // Pixel Confidential Folder / Document
            ctx.fillStyle = '#d97706';
            ctx.fillRect(ix - 12, iy - 10, 24, 20);
            ctx.fillStyle = '#f59e0b';
            ctx.fillRect(ix - 12, iy - 13, 10, 4);
            ctx.strokeStyle = '#451a03';
            ctx.lineWidth = 2;
            ctx.strokeRect(ix - 12, iy - 10, 24, 20);
            // Red confidential stamp
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(ix - 7, iy - 4, 14, 6);
          } else {
            // Pixel Data Chip / Floppy Disk
            ctx.fillStyle = item.color || '#22d3ee';
            ctx.fillRect(ix - 11, iy - 11, 22, 22);
            ctx.strokeStyle = '#0f172a';
            ctx.lineWidth = 2;
            ctx.strokeRect(ix - 11, iy - 11, 22, 22);
            ctx.fillStyle = '#e2e8f0';
            ctx.fillRect(ix - 6, iy - 11, 12, 8);
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(ix - 7, iy + 1, 14, 8);
          }

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 9px "Chakra Petch", sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(item.name.split(' ')[0], ix, iy - 17);
          ctx.restore();
        }

        // Town Scanners
        for (const scanner of scanners.current) {
          ctx.save();
          ctx.fillStyle = '#7f1d1d';
          ctx.beginPath();
          ctx.arc(scanner.x, scanner.y, 10, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(scanner.x, scanner.y);
          ctx.arc(
            scanner.x,
            scanner.y,
            scanner.length,
            scanner.angle - 0.4,
            scanner.angle + 0.4
          );
          ctx.closePath();
          ctx.fillStyle = scanner.beamColor;
          ctx.fill();
          ctx.restore();
        }

        // Outdoor NPCs
        for (const npc of NPCS) {
          const isCompleted = completedMissions.includes(npc.associatedMission);
          drawCharacterSprite(
            ctx,
            npc.x,
            npc.y,
            1,
            'down',
            false,
            0,
            npc.name,
            npc.title,
            false,
            npc.spriteCol,
            npc.spriteRow
          );

          ctx.save();
          ctx.font = 'bold 16px "Chakra Petch", sans-serif';
          ctx.textAlign = 'center';
          ctx.fillStyle = isCompleted ? '#10b981' : '#fbbf24';
          ctx.fillText(isCompleted ? '✓' : '!', npc.x, npc.y - 36);
          ctx.restore();
        }
      }

      // ----------------------------------------------------
      // C. RENDER PLAYERS (Local + Remote)
      // ----------------------------------------------------
      // Remote Players in same room space
      for (const rp of remotePlayers) {
        if (rp.id === playerId) continue;
        const rpRoom = rp.currentRoom || 'town';
        if (rpRoom === currentRoom) {
          drawCharacterSprite(
            ctx,
            rp.x,
            rp.y,
            rp.avatarId,
            rp.direction,
            rp.isMoving,
            currentTime * 0.001,
            rp.name,
            rp.classGrade,
            false,
            undefined,
            undefined,
            rp.customLook
          );
        }
      }

      // Local Player
      drawCharacterSprite(
        ctx,
        playerPos.current.x,
        playerPos.current.y,
        avatarId,
        playerDir.current,
        isMoving.current,
        walkTimer.current,
        playerName,
        classGrade,
        true,
        undefined,
        undefined,
        customLook
      );

      ctx.restore();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [
    playerId,
    playerName,
    classGrade,
    avatarId,
    currentRoom,
    remotePlayers,
    completedMissions,
    collectedItemIds,
    onPlayerMove,
    onNearInteractableChange,
  ]);

  // Touch handlers for mobile virtual joystick
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    touchJoystick.current = {
      active: true,
      startX: touch.clientX,
      startY: touch.clientY,
      currX: touch.clientX,
      currY: touch.clientY,
    };
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchJoystick.current.active) return;
    const touch = e.touches[0];
    touchJoystick.current.currX = touch.clientX;
    touchJoystick.current.currY = touch.clientY;
  };

  const handleTouchEnd = () => {
    touchJoystick.current.active = false;
  };

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      <canvas ref={canvasRef} className="block w-full h-full cursor-crosshair" />

      {/* Touch virtual joystick on bottom-left for mobile/tablet */}
      <div
        className="md:hidden absolute bottom-6 left-6 z-30 w-32 h-32 rounded-full border-2 border-cyan-500/40 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center touch-none select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="w-12 h-12 rounded-full bg-cyan-400/70 border border-white shadow-lg pointer-events-none" />
      </div>

      {/* Touch Action Button on bottom-right for mobile */}
      <button
        onClick={triggerInteraction}
        className="md:hidden absolute bottom-8 right-6 z-30 w-18 h-18 rounded-full bg-gradient-to-tr from-cyan-500 to-teal-400 border-2 border-white/60 shadow-xl shadow-cyan-500/40 flex flex-col items-center justify-center font-cyber font-bold text-slate-950 active:scale-95 cursor-pointer touch-none"
      >
        <span className="text-xl">✋</span>
        <span className="text-[10px] leading-tight uppercase font-extrabold">[AKSI / MASUK]</span>
      </button>
    </div>
  );
};
