import React, { useState } from 'react';
import { User, Users, Play, Sparkles, Shield, ChevronRight } from 'lucide-react';
import { AVATAR_LIST } from '../../game/avatarSprites';
import { sound } from '../../game/audio';
import { PlayerProfile, AvatarInfo, CustomLook } from '../../game/types';

interface Props {
  isOpen: boolean;
  onStartGame: (profile: PlayerProfile) => void;
}

const CLASS_OPTIONS = [
  'XI IPS 1',
  'XI IPS 2',
  'XI IPS 3',
  'XI MIPA 1',
  'XI MIPA 2',
  'XI MIPA 3',
  'XI SOSIAL 1',
  'XI SOSIAL 2',
  'XII IPS 1',
  'XII IPS 2',
  'XII MIPA 1',
];

export const ProfileSetupModal: React.FC<Props> = ({ isOpen, onStartGame }) => {
  const [name, setName] = useState('');
  const [classGrade, setClassGrade] = useState('XI IPS 1');
  const [selectedAvatarId, setSelectedAvatarId] = useState(1);
  const [genderFilter, setGenderFilter] = useState<'All' | 'Laki-laki' | 'Perempuan'>('All');
  const [roomMode, setRoomMode] = useState<'create' | 'join'>('create');
  const [roomCode, setRoomCode] = useState('SOC202');
  const [avatarTab, setAvatarTab] = useState<'preset' | 'custom'>('preset');
  const [customLook, setCustomLook] = useState<CustomLook>({
    hairStyle: 'rapi',
    hairColor: '#1e293b',
    outfit: 'seragam_sma',
    shirtColor: '#f8fafc',
    face: 'senyum',
    accessory: 'none',
  });

  if (!isOpen) return null;

  const filteredAvatars = AVATAR_LIST.filter(a => {
    if (genderFilter === 'All') return true;
    return a.gender === genderFilter;
  });

  const selectedAvatar = AVATAR_LIST.find(a => a.id === selectedAvatarId) || AVATAR_LIST[0];

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    sound.playVictoryFanfare();
    sound.startAmbientBGM();

    const cleanRoomCode = roomCode.trim().toUpperCase() || 'SOC202';
    const profile: PlayerProfile = {
      id: `p-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim(),
      classGrade,
      avatarId: selectedAvatarId,
      roomCode: cleanRoomCode,
      isHost: roomMode === 'create',
      customLook: avatarTab === 'custom' ? customLook : undefined,
    };

    onStartGame(profile);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-slate-950 border-2 border-cyan-500/80 rounded-3xl shadow-2xl shadow-cyan-500/30 text-slate-100 p-6 md:p-8 flex flex-col gap-6">
        
        {/* Title Header */}
        <div className="text-center space-y-1 border-b border-cyan-900/60 pb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 text-xs font-mono mb-1">
            <Sparkles className="w-3.5 h-3.5" /> SOSIOLOGI SMA FASE F · LITERASI DIGITAL
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold font-cyber tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400">
            KOTA SIBER: AGEN PERUBAHAN SOSIAL
          </h1>
          <p className="text-xs md:text-sm text-slate-400 font-sans italic">
            “Saring sebelum sharing, jaga jejakmu, lindungi masyarakat siber!”
          </p>
        </div>

        <form onSubmit={handleStart} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left column: Student Data & Room */}
            <div className="space-y-4">
              <h2 className="text-sm font-bold font-cyber text-cyan-300 flex items-center gap-2">
                <User className="w-4 h-4 text-cyan-400" /> 1. DATA IDENTITAS SISWA
              </h2>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-mono text-slate-300 mb-1 font-semibold">
                    NAMA SISWA LENGKAP:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Ahmad Rizki"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-sans text-sm transition"
                  />
                </div>

                <div>
                  <label className="block font-mono text-slate-300 mb-1 font-semibold">
                    KELAS (FASE F):
                  </label>
                  <select
                    value={classGrade}
                    onChange={(e) => setClassGrade(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400 font-mono text-sm transition cursor-pointer"
                  >
                    {CLASS_OPTIONS.map((c) => (
                      <option key={c} value={c} className="bg-slate-900 text-white">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Room Mode Toggle */}
              <div className="pt-2 space-y-3">
                <h2 className="text-sm font-bold font-cyber text-cyan-300 flex items-center gap-2">
                  <Users className="w-4 h-4 text-cyan-400" /> 2. KELAS MULTIPLAYER ONLINE
                </h2>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => { sound.playBlip(); setRoomMode('create'); }}
                    className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                      roomMode === 'create'
                        ? 'border-cyan-400 bg-cyan-950/70 text-cyan-200 font-bold ring-1 ring-cyan-500/50'
                        : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    BUAT RUANG BARU
                  </button>
                  <button
                    type="button"
                    onClick={() => { sound.playBlip(); setRoomMode('join'); }}
                    className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                      roomMode === 'join'
                        ? 'border-cyan-400 bg-cyan-950/70 text-cyan-200 font-bold ring-1 ring-cyan-500/50'
                        : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    GABUNG RUANG
                  </button>
                </div>

                <div>
                  <label className="block font-mono text-slate-300 text-xs mb-1 font-semibold">
                    KODE RUANG KELAS (6 Digit):
                  </label>
                  <input
                    type="text"
                    maxLength={8}
                    required
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    placeholder="Contoh: SOC202"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-cyan-300 font-mono text-base tracking-widest uppercase focus:outline-none focus:border-cyan-400 transition"
                  />
                  <p className="text-[11px] text-slate-400 font-mono mt-1">
                    *Gunakan kode yang sama dengan guru dan teman sekelasmu untuk bermain bersama di map yang sama.
                  </p>
                </div>
              </div>

              {/* Selected Avatar Info Card */}
              <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-xs flex items-center gap-3">
                <div className="w-14 h-16 rounded-xl bg-white/95 border border-cyan-400 overflow-hidden flex items-center justify-center shadow-md shrink-0">
                  <div
                    style={{
                      width: '46px',
                      height: '52px',
                      backgroundImage: `url('/assets/aistudio/33f8eb398132004e22b6aff6281b9125_757073bf.jpg')`,
                      backgroundSize: '700% 700%',
                      backgroundPosition: `${(selectedAvatar.spriteCol / 6) * 100}% ${(selectedAvatar.spriteRow / 6) * 100}%`,
                      imageRendering: 'pixelated',
                    }}
                  />
                </div>
                <div>
                  <span className="font-bold text-cyan-300 font-mono block">
                    {selectedAvatar.name} ({selectedAvatar.gender})
                  </span>
                  <p className="text-slate-300 text-[11px]">{selectedAvatar.style}</p>
                  <p className="text-slate-400 text-[10px] mt-0.5">{selectedAvatar.description}</p>
                </div>
              </div>
            </div>

            {/* Right column: Avatar Selector / Customizer */}
            <div className="space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-700">
                  <button
                    type="button"
                    onClick={() => { sound.playBlip(); setAvatarTab('preset'); }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                      avatarTab === 'preset'
                        ? 'bg-cyan-500 text-slate-950 shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    16 AVATAR SIAP PAKAI
                  </button>
                  <button
                    type="button"
                    onClick={() => { sound.playBlip(); setAvatarTab('custom'); }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                      avatarTab === 'custom'
                        ? 'bg-pink-500 text-slate-950 shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    ✨ KUSTOM RAMBUT & BAJU
                  </button>
                </div>

                {avatarTab === 'preset' && (
                  <div className="flex gap-1 text-[11px] font-mono">
                    {(['All', 'Laki-laki', 'Perempuan'] as const).map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => { sound.playBlip(); setGenderFilter(g); }}
                        className={`px-2 py-0.5 rounded transition cursor-pointer ${
                          genderFilter === g
                            ? 'bg-cyan-600 text-white font-bold'
                            : 'bg-slate-900 text-slate-400 hover:text-white'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {avatarTab === 'preset' ? (
                /* Avatar grid with live pixel art sprites */
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-80 overflow-y-auto p-1">
                  {filteredAvatars.map((av) => {
                    const isSelected = selectedAvatarId === av.id;
                    const bgX = (av.spriteCol / 6) * 100;
                    const bgY = (av.spriteRow / 6) * 100;

                    return (
                      <button
                        key={av.id}
                        type="button"
                        onClick={() => {
                          sound.playBlip(600 + av.id * 30);
                          setSelectedAvatarId(av.id);
                        }}
                        className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 transition text-center cursor-pointer ${
                          isSelected
                            ? 'border-cyan-400 bg-cyan-950/80 text-cyan-200 ring-2 ring-cyan-400/50 scale-102 shadow-lg shadow-cyan-500/20'
                            : 'border-slate-800 bg-slate-900/80 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {/* Pixel Art Sprite Preview from uploaded sprite sheet */}
                        <div className="relative w-12 h-14 rounded-lg bg-white/95 border border-slate-700 overflow-hidden flex items-center justify-center shadow">
                          <div
                            style={{
                              width: '46px',
                              height: '52px',
                              backgroundImage: `url('/assets/aistudio/33f8eb398132004e22b6aff6281b9125_757073bf.jpg')`,
                              backgroundSize: '700% 700%',
                              backgroundPosition: `${bgX}% ${bgY}%`,
                              imageRendering: 'pixelated',
                            }}
                          />
                          {isSelected && (
                            <div className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 border border-slate-950" />
                          )}
                        </div>

                        <span className="font-mono font-bold text-[11px] leading-tight text-white line-clamp-1">
                          {av.name.split(' ')[0]}
                        </span>
                        <span className="text-[10px] text-slate-400 font-sans line-clamp-1">
                          {av.style.split('&')[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                /* Custom Look Editor */
                <div className="p-3 rounded-2xl bg-slate-900/90 border border-pink-500/40 space-y-3 text-xs max-h-80 overflow-y-auto">
                  {/* Outfit */}
                  <div>
                    <label className="block text-[11px] font-mono text-pink-300 font-bold mb-1">
                      PILIH SERAGAM / PAKAIAN:
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        { id: 'seragam_sma', label: 'Seragam Putih SMA' },
                        { id: 'batik_sma', label: 'Batik SMA Nusantara' },
                        { id: 'hoodie_cyber', label: 'Hoodie Cyber Toska' },
                        { id: 'jas_lab', label: 'Jas Lab Peneliti' },
                      ].map((o) => (
                        <button
                          key={o.id}
                          type="button"
                          onClick={() => { sound.playBlip(); setCustomLook(p => ({ ...p, outfit: o.id as any })); }}
                          className={`p-2 rounded-lg border text-left cursor-pointer transition ${
                            customLook.outfit === o.id
                              ? 'border-pink-400 bg-pink-950/70 text-pink-200 font-bold'
                              : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          {o.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Hair Style */}
                  <div>
                    <label className="block text-[11px] font-mono text-cyan-300 font-bold mb-1">
                      GAYA RAMBUT:
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        { id: 'rapi', label: 'Rapi Belah Samping' },
                        { id: 'kuncir', label: 'Kuncir Kuda Bouncy' },
                        { id: 'poni', label: 'Poni Lurus Imut' },
                        { id: 'twintail', label: 'Kuncir Dua (Twintail)' },
                        { id: 'hijab', label: 'Hijab Pelajar Rapi' },
                        { id: 'undercut', label: 'Undercut Modern' },
                      ].map((h) => (
                        <button
                          key={h.id}
                          type="button"
                          onClick={() => { sound.playBlip(); setCustomLook(p => ({ ...p, hairStyle: h.id as any })); }}
                          className={`p-2 rounded-lg border text-left cursor-pointer transition ${
                            customLook.hairStyle === h.id
                              ? 'border-cyan-400 bg-cyan-950/70 text-cyan-200 font-bold'
                              : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          {h.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Face */}
                  <div>
                    <label className="block text-[11px] font-mono text-emerald-300 font-bold mb-1">
                      EKSPRESI WAJAH:
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { id: 'senyum', label: 'Senyum Ceria' },
                        { id: 'blush', label: 'Pipi Merona' },
                        { id: 'kacamata', label: 'Kacamata' },
                        { id: 'visor_siber', label: 'Visor Siber' },
                        { id: 'masker', label: 'Masker' },
                        { id: 'kalem', label: 'Tenang' },
                      ].map((f) => (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => { sound.playBlip(); setCustomLook(p => ({ ...p, face: f.id as any })); }}
                          className={`p-1.5 rounded-lg border text-center cursor-pointer transition ${
                            customLook.face === f.id
                              ? 'border-emerald-400 bg-emerald-950/70 text-emerald-200 font-bold'
                              : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full py-4 px-6 rounded-2xl font-extrabold font-cyber text-slate-950 text-base md:text-lg bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 shadow-xl shadow-cyan-500/30 transition flex items-center justify-center gap-3 cursor-pointer disabled:opacity-40 active:scale-98"
          >
            <Play className="w-5 h-5 fill-slate-950" /> MASUK KE KOTA SIBER SEKARANG <ChevronRight className="w-5 h-5" />
          </button>
        </form>

      </div>
    </div>
  );
};
