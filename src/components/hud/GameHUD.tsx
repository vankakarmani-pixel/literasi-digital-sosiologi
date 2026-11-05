import React, { useState } from 'react';
import { Volume2, VolumeX, MessageSquare, Smile, FileSpreadsheet, Award, MapPin, CheckSquare, Square, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import { sound } from '../../game/audio';
import { PillarScores, RemotePlayer } from '../../game/types';
import { LOCATIONS, NPCS } from '../../game/worldData';

interface Props {
  playerName: string;
  classGrade: string;
  roomCode: string;
  isHost: boolean;
  currentRoom: string;
  scores: PillarScores;
  completedMissions: string[];
  collectedItemIds: string[];
  remotePlayers: RemotePlayer[];
  nearInteractableText: string | null;
  onOpenTeacherDashboard: () => void;
  onOpenCertificate: () => void;
  onToggleChat: () => void;
  onToggleEmote: () => void;
  onExitRoom?: () => void;
  onOpenBotany?: () => void;
  onOpenCustomizer?: () => void;
}

export const GameHUD: React.FC<Props> = ({
  playerName,
  classGrade,
  roomCode,
  isHost,
  currentRoom,
  scores,
  completedMissions,
  collectedItemIds,
  remotePlayers,
  nearInteractableText,
  onOpenTeacherDashboard,
  onOpenCertificate,
  onToggleChat,
  onToggleEmote,
  onExitRoom,
  onOpenBotany,
  onOpenCustomizer,
}) => {
  const [isMuted, setIsMuted] = useState(sound.getMuted());
  const [questExpanded, setQuestExpanded] = useState(true);
  const [copiedRoom, setCopiedRoom] = useState(false);

  const toggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const handleCopyRoom = () => {
    sound.playBlip();
    navigator.clipboard.writeText(roomCode);
    setCopiedRoom(true);
    setTimeout(() => setCopiedRoom(false), 2000);
  };

  // Count items for active quests
  const rawFragments = collectedItemIds.filter(id => id.startsWith('frag_')).length;
  const opinionCards = collectedItemIds.filter(id => id.startsWith('card_')).length;
  const leakedData = collectedItemIds.filter(id => id.startsWith('data_')).length;

  const roomNames: Record<string, string> = {
    interior_cekfakta: 'Markas CekFakta',
    interior_gelembung: 'Ruang Gelembung Algoritma',
    interior_privasi: 'Kantor Keamanan Privasi',
    interior_balai_kota: 'Balai Kota Siber',
    interior_kampanye: 'Gedung Kampanye Digital',
    interior_wisma: 'Wisma Komunitas Agen',
    interior_botani: 'Rumah Kaca Botani Siber',
    interior_klinik: 'Klinik Detoksifikasi Siber',
    interior_kamar_estetik: 'Kamar Siswa & Studio Estetik',
  };

  const isInside = currentRoom !== 'town';

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3 select-none z-20">
      
      {/* TOP BAR */}
      <div className="flex items-start justify-between gap-3 pointer-events-auto">
        
        {/* Left: Player ID & Room Code */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-950/85 border border-cyan-500/50 backdrop-blur-md shadow-lg shadow-cyan-950/50">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-400 flex items-center justify-center font-bold text-xs text-cyan-300 font-cyber">
              KS
            </div>
            <div className="text-xs">
              <span className="font-bold text-white font-cyber block leading-tight">{playerName}</span>
              <span className="text-[10px] text-cyan-400 font-mono">{classGrade}</span>
            </div>

            <div className="border-l border-slate-800 pl-2.5 ml-1 flex items-center gap-1.5">
              <button
                onClick={handleCopyRoom}
                className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[10px] font-mono text-cyan-300 flex items-center gap-1 cursor-pointer transition"
                title="Salin Kode Ruang"
              >
                <span>ROOM: {roomCode}</span>
                {copiedRoom ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
              </button>

              <span className="text-[10px] font-mono text-slate-400 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">
                👥 {remotePlayers.length + 1} Agen
              </span>
            </div>
          </div>

          {/* Location badge if inside a building */}
          {isInside && (
            <div className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-cyan-950/90 border border-cyan-400/80 text-xs font-mono backdrop-blur-md shadow-lg text-cyan-200">
              <div className="flex items-center gap-1.5">
                <span className="animate-pulse text-base">🚪</span>
                <span>Di Dalam: <strong className="text-white">{roomNames[currentRoom] || 'Ruangan'}</strong></span>
              </div>
              {onExitRoom && (
                <button
                  onClick={onExitRoom}
                  className="px-2 py-0.5 rounded bg-cyan-800 hover:bg-cyan-700 text-[10px] text-white font-bold cursor-pointer transition"
                >
                  Keluar ke Kota [E]
                </button>
              )}
            </div>
          )}

          {/* Quick Pillar Score Readout */}
          <div className="hidden sm:flex items-center gap-1.5 p-1.5 rounded-xl bg-slate-950/80 border border-slate-800 backdrop-blur-md text-[11px] font-mono">
            <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-300">
              Skills: {scores.skills}
            </span>
            <span className="px-2 py-0.5 rounded bg-purple-950/60 border border-purple-500/30 text-purple-300">
              Culture: {scores.culture}
            </span>
            <span className="px-2 py-0.5 rounded bg-rose-950/60 border border-rose-500/30 text-rose-300">
              Safety: {scores.safety}
            </span>
            <span className="px-2 py-0.5 rounded bg-pink-950/60 border border-pink-500/30 text-pink-300">
              Ethics: {scores.ethics}
            </span>
            <span className="px-2 py-0.5 rounded bg-cyan-950/90 border border-cyan-400/50 text-cyan-200 font-bold">
              Total: {scores.total}
            </span>
          </div>
        </div>

        {/* Right: Controls & Quest HUD */}
        <div className="flex flex-col items-end gap-2">
          
          {/* Action Button cluster */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-slate-950/85 border border-cyan-500/50 backdrop-blur-md shadow-lg shadow-cyan-950/50">
            <button
              onClick={toggleSound}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 transition cursor-pointer"
              title={isMuted ? 'Nyalakan Suara' : 'Matikan Suara'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
            </button>

            <button
              onClick={() => { sound.playCozyClick(); onOpenBotany?.(); }}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-950/90 hover:bg-emerald-900 border border-emerald-400 text-emerald-200 font-pixel font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow"
              title="Eksperimen Tanaman & Bunga Siber"
            >
              <span>🌱 KEBUN BOTANI</span>
            </button>

            <button
              onClick={() => { sound.playCozyClick(); onOpenCustomizer?.(); }}
              className="px-2.5 py-1.5 rounded-lg bg-pink-950/90 hover:bg-pink-900 border border-pink-400 text-pink-200 font-pixel font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow"
              title="Kustomisasi Rambut, Baju & Wajah"
            >
              <span>✨ KUSTOM</span>
            </button>

            <button
              onClick={() => { sound.playBlip(); onOpenCertificate(); }}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 text-xs font-mono flex items-center gap-1.5 transition cursor-pointer"
            >
              <Award className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">HASIL PETUALANGAN</span>
            </button>

            <button
              onClick={() => { sound.playBlip(); onOpenTeacherDashboard(); }}
              className="px-2.5 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-400 text-cyan-200 font-bold text-xs font-mono flex items-center gap-1.5 transition cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>[HASIL SISWA]</span>
            </button>
          </div>

          {/* Dynamic Quest Panel */}
          <div className="w-64 sm:w-72 rounded-2xl bg-slate-950/90 border border-cyan-500/50 backdrop-blur-md shadow-xl text-slate-100 overflow-hidden">
            <div
              onClick={() => setQuestExpanded(!questExpanded)}
              className="p-2.5 bg-gradient-to-r from-slate-900 to-cyan-950/40 border-b border-cyan-900/50 flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
                  MISI AKTIF LITERASI SIBER
                </span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-900 text-cyan-200 font-mono">
                  {completedMissions.length} / 5
                </span>
              </div>
              {questExpanded ? <ChevronUp className="w-4 h-4 text-cyan-400" /> : <ChevronDown className="w-4 h-4 text-cyan-400" />}
            </div>

            {questExpanded && (
              <div className="p-3 space-y-2 text-xs font-mono max-h-60 overflow-y-auto">
                {/* Mission 1 */}
                <div className={`p-1.5 rounded border transition ${
                  completedMissions.includes('mission1') ? 'border-emerald-500/40 bg-emerald-950/30 text-emerald-300' : 'border-slate-800'
                }`}>
                  <div className="flex items-center gap-1.5 font-bold">
                    {completedMissions.includes('mission1') ? <CheckSquare className="w-3.5 h-3.5 text-emerald-400" /> : <Square className="w-3.5 h-3.5 text-slate-500" />}
                    <span>1. Operasi Cek Fakta</span>
                  </div>
                  <p className="text-[10px] text-slate-400 ml-5">
                    Bukti TKP: {rawFragments}/3 · Temui Inspektur Fakta
                  </p>
                </div>

                {/* Mission 2 */}
                <div className={`p-1.5 rounded border transition ${
                  completedMissions.includes('mission2') ? 'border-purple-500/40 bg-purple-950/30 text-purple-300' : 'border-slate-800'
                }`}>
                  <div className="flex items-center gap-1.5 font-bold">
                    {completedMissions.includes('mission2') ? <CheckSquare className="w-3.5 h-3.5 text-purple-400" /> : <Square className="w-3.5 h-3.5 text-slate-500" />}
                    <span>2. Pecah Gelembung Algoritma</span>
                  </div>
                  <p className="text-[10px] text-slate-400 ml-5">
                    Kartu Opini: {opinionCards}/3 · Filter Terminal
                  </p>
                </div>

                {/* Mission 3 */}
                <div className={`p-1.5 rounded border transition ${
                  completedMissions.includes('mission3') ? 'border-rose-500/40 bg-rose-950/30 text-rose-300' : 'border-slate-800'
                }`}>
                  <div className="flex items-center gap-1.5 font-bold">
                    {completedMissions.includes('mission3') ? <CheckSquare className="w-3.5 h-3.5 text-rose-400" /> : <Square className="w-3.5 h-3.5 text-slate-500" />}
                    <span>3. Lorong Jejak Digital</span>
                  </div>
                  <p className="text-[10px] text-slate-400 ml-5">
                    Data Bocor: {leakedData}/3 · Kunci Brankas Privasi
                  </p>
                </div>

                {/* Mission 4 */}
                <div className={`p-1.5 rounded border transition ${
                  completedMissions.includes('mission4') ? 'border-pink-500/40 bg-pink-950/30 text-pink-300' : 'border-slate-800'
                }`}>
                  <div className="flex items-center gap-1.5 font-bold">
                    {completedMissions.includes('mission4') ? <CheckSquare className="w-3.5 h-3.5 text-pink-400" /> : <Square className="w-3.5 h-3.5 text-slate-500" />}
                    <span>4. Kampanye Anti-Bullying</span>
                  </div>
                  <p className="text-[10px] text-slate-400 ml-5">
                    Temui Agen Etika · Aktifkan Tameng
                  </p>
                </div>

                {/* Mission 5: Coop */}
                <div className={`p-1.5 rounded border transition ${
                  completedMissions.includes('coop') ? 'border-indigo-500/40 bg-indigo-950/30 text-indigo-300' : 'border-slate-800'
                }`}>
                  <div className="flex items-center gap-1.5 font-bold">
                    {completedMissions.includes('coop') ? <CheckSquare className="w-3.5 h-3.5 text-indigo-400" /> : <Square className="w-3.5 h-3.5 text-slate-500" />}
                    <span>5. Jembatan Toleransi Siber</span>
                  </div>
                  <p className="text-[10px] text-slate-400 ml-5">
                    Arena Kolaborasi Multiplayer
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* FLOATING CENTER INTERACTION PROMPT */}
      {nearInteractableText && (
        <div className="self-center mb-8 pointer-events-none animate-bounce">
          <div className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-cyber font-extrabold text-sm shadow-2xl shadow-cyan-500/60 flex items-center gap-2 border-2 border-white">
            <span>⚡</span>
            <span>{nearInteractableText}</span>
          </div>
        </div>
      )}

      {/* BOTTOM CONTROLS CLUSTER */}
      <div className="flex items-end justify-between pointer-events-auto">
        
        {/* Chat & Emote Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => { sound.playBlip(); onToggleChat(); }}
            className="p-3 rounded-2xl bg-slate-950/85 hover:bg-slate-900 border-2 border-cyan-500/50 text-cyan-300 shadow-xl backdrop-blur-md flex items-center gap-2 text-xs font-mono font-bold cursor-pointer transition active:scale-95"
          >
            <MessageSquare className="w-5 h-5" />
            <span className="hidden sm:inline">[CHAT]</span>
          </button>

          <button
            onClick={() => { sound.playBlip(); onToggleEmote(); }}
            className="p-3 rounded-2xl bg-slate-950/85 hover:bg-slate-900 border-2 border-cyan-500/50 text-cyan-300 shadow-xl backdrop-blur-md flex items-center gap-2 text-xs font-mono font-bold cursor-pointer transition active:scale-95"
          >
            <Smile className="w-5 h-5" />
            <span className="hidden sm:inline">[EMOTE]</span>
          </button>
        </div>

        {/* Keyboard Hint (Desktop only) */}
        <div className="hidden md:flex items-center gap-3 p-2 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] font-mono text-slate-400 backdrop-blur-sm">
          <span>WASD / Arah: Bergerak</span>
          <span>·</span>
          <span>E: Interaksi</span>
          <span>·</span>
          <span>ENTER: Lanjut Dialog</span>
          <span>·</span>
          <span>ESC: Tutup Menu</span>
        </div>

      </div>

    </div>
  );
};
