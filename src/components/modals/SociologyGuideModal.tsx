import React from 'react';
import { BookOpen, CheckCircle2, Shield, Layers, Search, HeartHandshake } from 'lucide-react';
import { sound } from '../../game/audio';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const SociologyGuideModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-950 border-2 border-cyan-500/70 rounded-2xl shadow-2xl shadow-cyan-500/20 text-slate-100 p-6 flex flex-col gap-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cyan-800/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-400">
              <BookOpen className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-xs font-mono tracking-wider text-cyan-400 uppercase font-semibold">
                MODUL PEMBELAJARAN SOSIOLOGI SMA FASE F
              </span>
              <h2 className="text-xl font-bold font-cyber text-cyan-300">
                Perubahan Sosial & 4 Pilar Literasi Digital
              </h2>
            </div>
          </div>
          <button
            onClick={() => { sound.playBlip(); onClose(); }}
            className="text-slate-400 hover:text-white px-3 py-1 rounded-lg hover:bg-slate-800 text-sm font-mono transition cursor-pointer"
          >
            [ESC / TUTUP]
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 text-xs font-sans leading-relaxed text-slate-300">
          
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <h3 className="font-bold text-sm text-cyan-300 font-cyber">1. Pengantar Teori Sosiologi Siber</h3>
            <p>
              Perkembangan teknologi informasi melahirkan pergeseran dari interaksi tatap muka ke <span className="text-white font-semibold">Masyarakat Jaringan (Network Society - Manuel Castells)</span>. Seringkali masyarakat mengalami <span className="text-amber-400 font-semibold">Cultural Lag (William F. Ogburn)</span> dan <span className="text-rose-400 font-semibold">Anomie Digital (Emile Durkheim)</span>, yakni kegamangan norma ketika teknologi berkembang jauh lebih cepat daripada kedewasaan etika penggunanya.
            </p>
          </div>

          <div className="space-y-2.5">
            <h3 className="font-bold text-sm text-cyan-300 font-cyber">2. Empat Pilar Literasi Digital dalam Gameplay:</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 space-y-1">
                <div className="flex items-center gap-2 font-bold text-emerald-300 font-mono text-xs">
                  <Search className="w-4 h-4 text-emerald-400" />
                  PILAR 1: DIGITAL SKILLS
                </div>
                <p className="text-[11px] text-slate-300">
                  Kemampuan teknis memverifikasi fakta, menganalisis metadata EXIF foto, melakukan reverse image search, dan membedakan disinformasi dengan data empiris.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 space-y-1">
                <div className="flex items-center gap-2 font-bold text-purple-300 font-mono text-xs">
                  <Layers className="w-4 h-4 text-purple-400" />
                  PILAR 2: DIGITAL CULTURE
                </div>
                <p className="text-[11px] text-slate-300">
                  Kesadaran memecah gelembung algoritma (Filter Bubble & Echo Chamber), menghargai kemajemukan opini warganet, dan menjunjung nilai Pancasila di ruang publik siber.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 space-y-1">
                <div className="flex items-center gap-2 font-bold text-rose-300 font-mono text-xs">
                  <Shield className="w-4 h-4 text-rose-400" />
                  PILAR 3: DIGITAL SAFETY
                </div>
                <p className="text-[11px] text-slate-300">
                  Menjaga jejak digital pasif dan aktif, melindungi data pribadi dari aksi doxxing, menyetel enkripsi/2FA, dan mencegah kejahatan rekayasa sosial (phishing).
                </p>
              </div>

              <div className="p-3 rounded-xl bg-pink-950/40 border border-pink-500/30 space-y-1">
                <div className="flex items-center gap-2 font-bold text-pink-300 font-mono text-xs">
                  <HeartHandshake className="w-4 h-4 text-pink-400" />
                  PILAR 4: DIGITAL ETHICS
                </div>
                <p className="text-[11px] text-slate-300">
                  Menegakkan netiquette (tata krama siber), mencegah perundungan siber (cyberbullying), berempati kepada korban, dan berani bersuara (bystander intervention).
                </p>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-[11px] text-cyan-200">
            <span className="font-bold block mb-1">Panduan untuk Bapak/Ibu Guru:</span>
            Ajak seluruh siswa masuk menggunakan <span className="font-bold underline">Kode Ruang Kelas yang sama</span> (misal: SOC202). Guru dapat membuka menu <span className="font-mono bg-cyan-900 px-1 py-0.5 rounded font-bold">[HASIL SISWA]</span> untuk memantau skor 4 pilar seluruh siswa secara langsung dan mengunduh berkas rekap nilai dalam format CSV untuk penilaian rapor Kurikulum Merdeka.
          </div>

        </div>

        <button
          onClick={() => { sound.playBlip(); onClose(); }}
          className="w-full py-3 rounded-xl font-cyber font-bold text-xs text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition cursor-pointer"
        >
          Tutup Panduan & Mulai Game
        </button>

      </div>
    </div>
  );
};
