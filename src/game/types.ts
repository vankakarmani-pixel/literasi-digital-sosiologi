export type Direction = 'up' | 'down' | 'left' | 'right';

export interface AvatarInfo {
  id: number;
  name: string;
  gender: 'Laki-laki' | 'Perempuan';
  style: string;
  hairColor: string;
  shirtColor: string;
  skinColor: string;
  accessory: string;
  description: string;
  spriteCol: number; // 0 to 6
  spriteRow: number; // 0 to 6
}

export interface CustomLook {
  hairStyle: 'rapi' | 'kuncir' | 'poni' | 'curly' | 'twintail' | 'undercut' | 'hijab';
  hairColor: string;
  outfit: 'seragam_sma' | 'batik_sma' | 'hoodie_cyber' | 'jas_lab' | 'streetwear' | 'gaun_pastel';
  shirtColor: string;
  face: 'senyum' | 'kalem' | 'kacamata' | 'visor_siber' | 'masker' | 'blush';
  accessory: 'none' | 'headphone' | 'dasi' | 'smartwatch' | 'pin_cekfakta' | 'bando';
}

export type PlantStage = 'empty' | 'seed' | 'sprout' | 'bud' | 'bloomed' | 'wilted';

export interface BotanicalPlot {
  id: string;
  name: string;
  pillar: 'Digital Skills' | 'Digital Ethics' | 'Digital Safety' | 'Digital Culture';
  stage: PlantStage;
  vitality: number; // 0 - 100
  growthProgress: number; // 0 - 100
  flowerColor: string;
  lastAction?: string;
  feedbackMessage?: string;
  sociologicalFact?: string;
  isRemediated?: boolean;
}

export interface PlayerProfile {
  id: string;
  name: string;
  classGrade: string;
  avatarId: number;
  roomCode: string;
  isHost?: boolean;
  currentRoom?: string; // 'town' or interior room id
  customLook?: CustomLook;
}

export interface PillarScores {
  skills: number;   // Max 1000: Digital Skills (Verifikasi Fakta)
  culture: number;  // Max 1000: Digital Culture (Memecah Echo Chamber)
  safety: number;   // Max 1000: Digital Safety (Privasi & Anti-Doxxing)
  ethics: number;   // Max 1000: Digital Ethics (Anti-Cyberbullying)
  total: number;    // Max 4000
}

export interface RemotePlayer {
  id: string;
  name: string;
  classGrade: string;
  avatarId: number;
  x: number;
  y: number;
  direction: Direction;
  isMoving: boolean;
  scores: PillarScores;
  completedMissions: string[];
  lastSeen: number;
  isHost: boolean;
  currentRoom?: string;
  customLook?: CustomLook;
}

export interface NPCData {
  id: string;
  name: string;
  title: string;
  x: number;
  y: number;
  avatarColor: string;
  icon: string;
  associatedMission: string;
  dialogueIntro: string[];
  dialogueActionText: string;
  dialogueCompleted: string[];
  spriteCol?: number;
  spriteRow?: number;
  roomLocation?: string; // 'town' or interior room id
}

export interface BuildingDoor {
  id: string;
  buildingName: string;
  x: number;
  y: number;
  w: number;
  h: number;
  targetRoomId: string;
  spawnInside: { x: number, y: number };
}

export interface InteriorFurniture {
  id: string;
  name: string;
  type: 'desk' | 'server' | 'shelf' | 'computer' | 'sofa' | 'plant' | 'rug' | 'podium' | 'safe' | 'terminal';
  x: number;
  y: number;
  w: number;
  h: number;
  color?: string;
  label?: string;
  interactiveAction?: string;
}

export interface InteriorRoom {
  id: string;
  name: string;
  subtitle: string;
  theme: 'tech' | 'cyber' | 'cozy' | 'civic' | 'auditorium';
  w: number;
  h: number;
  floorColor: string;
  wallColor: string;
  exitDoor: {
    x: number;
    y: number;
    w: number;
    h: number;
    targetOutside: { x: number; y: number };
  };
  furniture: InteriorFurniture[];
  obstacles: Rect[];
  npcs: NPCData[];
  interactiveItems: InteractiveItem[];
}

export interface InteractiveItem {
  id: string;
  name: string;
  type: 'raw_fact_image' | 'opinion_card' | 'leaked_data' | 'terminal';
  x: number;
  y: number;
  radius: number;
  icon: string;
  color: string;
  collected?: boolean;
  description: string;
  missionId: string;
}

export interface HazardScanner {
  id: string;
  x: number;
  y: number;
  radius: number;
  angle: number;
  sweepRange: number;
  speed: number;
  direction: number;
  length: number;
  beamColor: string;
}

export interface LocationZone {
  id: string;
  name: string;
  subtitle: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  accent: string;
  icon: string;
}

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface QuestStep {
  id: string;
  title: string;
  pillar: 'Digital Skills' | 'Digital Culture' | 'Digital Safety' | 'Digital Ethics' | 'Kolaborasi';
  description: string;
  completed: boolean;
  targetNpc?: string;
  targetLocation?: string;
  points: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
  emote?: string;
}

export interface CoopState {
  p1EthicalKeyFound: boolean;
  p2FirewallCleaned: boolean;
  bridgeBuilt: boolean;
}
