import React, { useState } from 'react';
import { HeartHandshake, Shield, MessageSquare, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { sound } from '../../game/audio';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (score: number) => void;
}

export const Mission4CyberbullyingModal: React.FC<Props> = ({ isOpen, onClose, onComplete }) => {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [shieldActive, setShieldActive] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const toxicComments = [
    '"Halah, cari perhatian doang lu!"',
    '"Gak pantas ada di grup ini, mending minggat!"',
    '"Karya jelek gini kok dipajang, memalukan!"',
  ];

  const handleAction = (choice: 'A' | 'B' | 'C') => {
    setSelectedAction(choice);

    if (choice === 'A') {
      sound.playAlarm();
      setFeedback('EFEK NEGATIF: Membalas dengan cacian justru memicu "Flame War" (perang komentar) dan memperluas eskalasi konflik antarkelompok!');
      setShieldActive(false);
    } else if (choice === 'C') {
      sound.playAlarm();
      setFeedback('EFEK NEGATIF: Ini adalah "Bystander Effect" (efek penonton pasif). Mendiamkan atau ikut menertawakan melegitimasi kekerasan simbolik di ruang siber!');
      setShieldActive(false);
    } else if (choice === 'B') {
      sound.playShieldActivate();
      setShieldActive(true);
      setFeedback('TINDAKAN TEPAT! Kamu menerapkan Etika Digital: Intervensi aktif dengan empati, melaporkan akun perundung ke moderator, dan mendampingi korban.');
      setIsSuccess(true);

      setTimeout(() => {
        sound.playVictoryFanfare();
        setTimeout(() => {
          onComplete(1000);
          onClose();
        }, 1800);
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-950 border-2 border-pink-500/70 rounded-2xl shadow-2xl shadow-pink-500/20 text-slate-100 p-6 flex flex-col gap-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-pink-800/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-pink-950 border border-pink-500/40 text-pink-400">
              <HeartHandshake className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-xs font-mono tracking-wider text-pink-400 uppercase font-semibold">
                MISI 4 · DIGITAL ETHICS (ETIKA DIGITAL)
              </span>
              <h2 className="text-xl font-bold font-cyber text-pink-300">
                Aksi Solidaritas & Tameng Anti-Cyberbullying
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

        {/* Visual Scene of Victim Under Attack */}
        <div className="relative p-6 rounded-2xl bg-gradient-to-b from-pink-950/40 to-slate-950 border border-pink-800/60 flex flex-col items-center justify-center min-h-[180px] overflow-hidden">
          
          {/* Toxic comments floating */}
          {!shieldActive ? (
            <div className="w-full flex flex-col gap-2 mb-4">
              {toxicComments.map((comment, idx) => (
                <div
                  key={idx}
                  className="px-3 py-1.5 rounded-lg bg-rose-950/80 border border-rose-500/60 text-rose-300 text-xs font-mono text-center animate-pulse shadow-md"
                >
                  ⚡ {comment}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-pink-950/70 border border-pink-400 text-center space-y-2 animate-in zoom-in duration-300">
              <Shield className="w-10 h-10 text-pink-400 mx-auto animate-bounce" />
              <h4 className="font-bold text-pink-200 font-cyber">TAMENG ETIKA DIGITAL AKTIF!</h4>
              <p className="text-xs text-pink-300 font-mono">
                "Kamu tidak sendirian. Ruang siber ini milik kita bersama, dibangun atas dasar rasa hormat dan kemanusiaan."
              </p>
            </div>
          )}

          <div className="flex items-center gap-3 mt-2">
            <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-pink-500 flex items-center justify-center font-bold text-sm">
              😭
            </div>
            <div className="text-xs">
              <p className="font-bold text-white">Siswa Korban Perundungan Siber</p>
              <p className="text-slate-400">Status Mental: {shieldActive ? 'Merasa Didukung & Terlindungi' : 'Mengalami Viktimisasi & Tertekan'}</p>
            </div>
          </div>
        </div>

        {/* Action Choices */}
        <div className="space-y-3">
          <span className="text-xs font-semibold text-pink-300 font-mono block">
            Pilih Langkah Sosiologis yang Harus Diambil Agen:
          </span>

          <div className="space-y-2">
            <button
              onClick={() => handleAction('A')}
              className={`w-full p-3 rounded-xl border text-left transition flex items-start gap-3 cursor-pointer ${
                selectedAction === 'A'
                  ? 'border-rose-500 bg-rose-950/60 text-rose-200'
                  : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
              }`}
            >
              <span className="font-mono font-bold text-sm px-2 py-0.5 rounded bg-slate-800">A</span>
              <div className="text-xs">
                <span className="font-bold block text-white">Membalas dan Menyerang Balik Pelaku dengan Kata Kasar</span>
                <p className="text-slate-400 text-[11px] mt-0.5">"Gantian serang akun mereka sampai kapok!"</p>
              </div>
            </button>

            <button
              onClick={() => handleAction('B')}
              className={`w-full p-3 rounded-xl border text-left transition flex items-start gap-3 cursor-pointer ${
                selectedAction === 'B'
                  ? 'border-pink-500 bg-pink-950/80 text-pink-100 ring-2 ring-pink-500/40'
                  : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-pink-500/40'
              }`}
            >
              <span className="font-mono font-bold text-sm px-2 py-0.5 rounded bg-pink-900 text-pink-300">B</span>
              <div className="text-xs">
                <span className="font-bold block text-pink-300">Laporkan (Report) Pelaku, Dampingi Korban, dan Aktifkan Tameng Etika</span>
                <p className="text-slate-300 text-[11px] mt-0.5">Kirim pesan dukungan empati privat, dokumentasikan bukti, laporkan pelanggaran norma.</p>
              </div>
            </button>

            <button
              onClick={() => handleAction('C')}
              className={`w-full p-3 rounded-xl border text-left transition flex items-start gap-3 cursor-pointer ${
                selectedAction === 'C'
                  ? 'border-amber-500 bg-amber-950/60 text-amber-200'
                  : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
              }`}
            >
              <span className="font-mono font-bold text-sm px-2 py-0.5 rounded bg-slate-800">C</span>
              <div className="text-xs">
                <span className="font-bold block text-white">Ikut Menertawakan atau Diam Saja sebagai Penonton (Bystander)</span>
                <p className="text-slate-400 text-[11px] mt-0.5">"Bukan urusanku, lagipula cuma bercandaan medsos biasa."</p>
              </div>
            </button>
          </div>
        </div>

        {/* Sociological Feedback Callout */}
        {feedback && (
          <div className={`p-3.5 rounded-xl border text-xs font-mono ${
            shieldActive
              ? 'bg-emerald-950/50 border-emerald-500 text-emerald-200'
              : 'bg-rose-950/50 border-rose-500 text-rose-200'
          }`}>
            {feedback}
          </div>
        )}

      </div>
    </div>
  );
};
