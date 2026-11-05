import React from 'react';
import { Award, CheckCircle2, ShieldCheck, Printer, ArrowLeft } from 'lucide-react';
import { sound } from '../../game/audio';
import { PillarScores } from '../../game/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  playerName: string;
  classGrade: string;
  roomCode: string;
  scores: PillarScores;
}

export const ResultsCertificateModal: React.FC<Props> = ({
  isOpen,
  onClose,
  playerName,
  classGrade,
  roomCode,
  scores,
}) => {
  if (!isOpen) return null;

  let statusText = 'Warganet Berkembang';
  let badgeColor = 'text-amber-400 border-amber-500/40 bg-amber-950/40';

  if (scores.total >= 3500) {
    statusText = 'Warga Negara Digital yang Bijak & Teladan';
    badgeColor = 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40';
  } else if (scores.total >= 2200) {
    statusText = 'Agen Literasi Digital Mandiri';
    badgeColor = 'text-cyan-400 border-cyan-500/40 bg-cyan-950/40';
  }

  const handlePrint = () => {
    sound.playBlip();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-950 border-2 border-cyan-500/80 rounded-3xl shadow-2xl shadow-cyan-500/25 text-slate-100 p-6 md:p-8 flex flex-col gap-6">
        
        {/* Certificate Border Frame */}
        <div className="border border-cyan-500/30 rounded-2xl p-6 bg-gradient-to-b from-slate-900 to-slate-950 space-y-5 text-center relative overflow-hidden">
          
          <div className="w-16 h-16 rounded-2xl bg-cyan-950 border-2 border-cyan-400 flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/20 text-cyan-300">
            <Award className="w-9 h-9" />
          </div>

          <div>
            <span className="text-[11px] font-mono tracking-widest text-cyan-400 uppercase font-bold">
              SERTIFIKAT KELAYAKAN AGEN SOSIOLOGI SIBER
            </span>
            <h2 className="text-2xl font-extrabold font-cyber text-white mt-1">
              HASIL PETUALANGAN KOTA SIBER
            </h2>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Refleksi Pembelajaran Sosiologi: Perubahan Sosial & 4 Pilar Literasi Digital (Fase F)
            </p>
          </div>

          {/* Student Identifiers */}
          <div className="flex justify-center gap-6 py-2 border-y border-slate-800 text-xs font-mono">
            <div>
              <span className="text-slate-500 block">NAMA:</span>
              <span className="font-bold text-white text-sm">{playerName}</span>
            </div>
            <div className="border-l border-slate-800 pl-6">
              <span className="text-slate-500 block">KELAS:</span>
              <span className="font-bold text-cyan-300 text-sm">{classGrade}</span>
            </div>
            <div className="border-l border-slate-800 pl-6">
              <span className="text-slate-500 block">KODE RUANG:</span>
              <span className="font-bold text-teal-300 text-sm">{roomCode}</span>
            </div>
          </div>

          {/* 4 Pillars Breakdown */}
          <div className="space-y-2 text-xs font-mono text-left max-w-md mx-auto">
            <div className="flex items-center justify-between p-2 rounded-lg bg-black/40 border border-slate-800">
              <span className="text-emerald-400">1. Digital Skills (Cek Fakta & EXIF):</span>
              <span className="font-bold text-white">{scores.skills} / 1000</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-black/40 border border-slate-800">
              <span className="text-purple-400">2. Digital Culture (Pecah Echo Chamber):</span>
              <span className="font-bold text-white">{scores.culture} / 1000</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-black/40 border border-slate-800">
              <span className="text-rose-400">3. Digital Safety (Brankas Anti-Doxxing):</span>
              <span className="font-bold text-white">{scores.safety} / 1000</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-black/40 border border-slate-800">
              <span className="text-pink-400">4. Digital Ethics (Tameng Cyberbullying):</span>
              <span className="font-bold text-white">{scores.ethics} / 1000</span>
            </div>
          </div>

          {/* Total & Status */}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <div className="text-xl font-bold font-cyber text-cyan-300">
              TOTAL SKOR: <span className="text-white text-2xl">{scores.total}</span> / 4000
            </div>
            <div className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold border ${badgeColor}`}>
              STATUS: {statusText}
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => { sound.playBlip(); onClose(); }}
            className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-xs font-mono text-slate-300 transition flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali Menjelajah Kota
          </button>

          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl font-cyber font-bold text-xs text-slate-950 bg-cyan-400 hover:bg-cyan-300 shadow-lg shadow-cyan-500/25 transition flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4" /> Cetak / Simpan PDF
          </button>
        </div>

      </div>
    </div>
  );
};
