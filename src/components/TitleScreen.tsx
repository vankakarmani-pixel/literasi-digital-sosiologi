import React, { useEffect } from 'react';
import { Play, Sparkles, Shield, Users, BookOpen, Compass, ChevronRight } from 'lucide-react';
import { sound } from '../game/audio';

interface Props {
  onStart: () => void;
  onOpenGuide: () => void;
}

export const TitleScreen: React.FC<Props> = ({ onStart, onOpenGuide }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        sound.playVictoryFanfare();
        onStart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onStart]);

  return (
    <div className="relative w-full h-full min-h-screen bg-slate-950 flex flex-col items-center justify-between p-6 sm:p-10 select-none overflow-hidden text-slate-100">
      
      {/* Pixel Art Landscape Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{
          backgroundImage: "url('/assets/aistudio/9d37952b14c2083b328c68a6b2708d9d_25680f90.jpg')",
          imageRendering: 'pixelated',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/65 via-slate-950/55 to-slate-950/80 backdrop-blur-[1px] pointer-events-none" />

      {/* Top Banner Tag */}
      <div className="relative z-10 flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/40 text-cyan-300 text-xs font-mono tracking-wider shadow-lg">
        <Sparkles className="w-4 h-4 text-cyan-400" />
        SOSIOLOGI SMA FASE F · PERUBAHAN SOSIAL & LITERASI DIGITAL
      </div>

      {/* Hero Centerpiece: Bespoke Title Lockup */}
      <div className="relative z-10 max-w-3xl text-center space-y-6 my-auto">
        
        {/* Inline SVG Cyber Emblem */}
        <div className="mx-auto w-24 h-24 relative flex items-center justify-center">
          <svg className="w-full h-full animate-spin" style={{ animationDuration: '24s' }} viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="#06b6d4" strokeWidth="2" strokeDasharray="6 4" opacity="0.6" />
            <circle cx="50" cy="50" r="34" fill="none" stroke="#8b5cf6" strokeWidth="1.5" strokeDasharray="12 6" opacity="0.8" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-cyan-950/80 border-2 border-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/30 text-2xl">
              🛡️
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold font-cyber tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-cyan-400 drop-shadow-[0_0_35px_rgba(6,182,212,0.4)]">
            KOTA SIBER
          </h1>
          <p className="text-xl sm:text-2xl font-cyber font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-cyan-300 to-indigo-300">
            AGEN PERUBAHAN SOSIAL
          </p>
        </div>

        {/* Tagline */}
        <p className="text-sm sm:text-base text-slate-300 font-sans italic max-w-xl mx-auto px-4">
          “Saring sebelum sharing, jaga jejakmu, lindungi masyarakat siber!”
        </p>

        {/* 4 Pillars Badge Preview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-2xl mx-auto text-xs font-mono">
          <div className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 flex flex-col items-center">
            <span className="font-bold">1. Digital Skills</span>
            <span className="text-[10px] text-slate-400">Verifikasi Fakta</span>
          </div>
          <div className="p-2 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-300 flex flex-col items-center">
            <span className="font-bold">2. Digital Culture</span>
            <span className="text-[10px] text-slate-400">Pecah Echo Chamber</span>
          </div>
          <div className="p-2 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 flex flex-col items-center">
            <span className="font-bold">3. Digital Safety</span>
            <span className="text-[10px] text-slate-400">Brankas Anti-Doxxing</span>
          </div>
          <div className="p-2 rounded-xl bg-pink-950/40 border border-pink-500/30 text-pink-300 flex flex-col items-center">
            <span className="font-bold">4. Digital Ethics</span>
            <span className="text-[10px] text-slate-400">Anti-Cyberbullying</span>
          </div>
        </div>

        {/* CTA Start Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => {
              sound.playVictoryFanfare();
              onStart();
            }}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl font-cyber font-extrabold text-base sm:text-lg text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 shadow-xl shadow-cyan-500/40 transition hover:scale-105 active:scale-95 flex items-center justify-center gap-3 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-slate-950" />
            MULAI PETUALANGAN [ENTER / SPASI]
          </button>

          <button
            onClick={() => {
              sound.playBlip();
              onOpenGuide();
            }}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl font-mono text-xs text-slate-300 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-cyan-400" />
            PANDUAN MATERI SOSIOLOGI
          </button>
        </div>

      </div>

      {/* Flat Control Hint Line */}
      <div className="relative z-10 text-center text-[11px] font-mono text-slate-500">
        WASD / Panah: Bergerak · E: Interaksi · ESC: Menu / Keluar · Kompatibel Laptop, Tablet & Smartphone
      </div>

    </div>
  );
};
