import React, { useState } from 'react';
import { Disc, CheckCircle2, Sparkles, Layers, ShieldAlert, Cpu, ArrowRight } from 'lucide-react';
import { sound } from '../../game/audio';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (score: number) => void;
  cardsCollected: number;
}

export const Mission2EchoChamberModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onComplete,
  cardsCollected,
}) => {
  const [insertedCards, setInsertedCards] = useState<string[]>([]);
  const [isShattering, setIsShattering] = useState<boolean>(false);
  const [bubbleBroken, setBubbleBroken] = useState<boolean>(false);

  if (!isOpen) return null;

  const availableCards = [
    {
      id: 'data_empiris',
      title: 'Kartu 1: Data Empiris & Statistik Independen',
      desc: 'Melawan klaim emosional dengan angka riset lapangan objektif.',
      color: '#c084fc',
    },
    {
      id: 'komunitas_lain',
      title: 'Kartu 2: Perspektif Kelompok Marginal / Budaya Lain',
      desc: 'Memperluas empati melintasi sekat kelompok primordial.',
      color: '#a855f7',
    },
    {
      id: 'dialog_kritis',
      title: 'Kartu 3: Dialog Terbuka & Verifikasi Timbal-Balik',
      desc: 'Menciptakan ruang publik demokratis (Jürgen Habermas).',
      color: '#9333ea',
    },
  ];

  const handleInsertCard = (cardId: string) => {
    if (insertedCards.includes(cardId)) return;
    sound.playTerminalBeep();
    setInsertedCards([...insertedCards, cardId]);
  };

  const handleShatterBubble = () => {
    sound.playAlarm();
    setIsShattering(true);

    setTimeout(() => {
      sound.playBubblePop();
      sound.playVictoryFanfare();
      setIsShattering(false);
      setBubbleBroken(true);

      setTimeout(() => {
        onComplete(1000);
        onClose();
      }, 2200);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-950 border-2 border-purple-500/70 rounded-2xl shadow-2xl shadow-purple-500/20 text-slate-100 p-6 flex flex-col gap-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-purple-800/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-950 border border-purple-500/40 text-purple-400">
              <Disc className="w-6 h-6 animate-spin" />
            </div>
            <div>
              <span className="text-xs font-mono tracking-wider text-purple-400 uppercase font-semibold">
                MISI 2 · DIGITAL CULTURE (BUDAYA DIGITAL)
              </span>
              <h2 className="text-xl font-bold font-cyber text-purple-300">
                Memecah Gelembung Algoritma (Filter Bubble)
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

        {/* Sociological Context Banner */}
        <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs space-y-2">
          <div className="flex items-center gap-2 text-purple-300 font-semibold font-mono">
            <Layers className="w-4 h-4 text-purple-400" />
            Fenomena Sosiologi: "Echo Chamber" & "Filter Bubble"
          </div>
          <p className="text-purple-200/90 leading-relaxed">
            Eli Pariser menjelaskan bahwa algoritma media sosial cenderung menyuguhkan informasi yang senada dengan preferensi masa lalu pengguna. Akibatnya, terbentuk <span className="text-white font-bold">ruang gema (echo chamber)</span> di mana masyarakat terjebak polarisasi, merasa kelompoknya paling benar, dan kehilangan kemampuan berdialog dengan kelompok lain.
          </p>
        </div>

        {/* Visual Simulated Bubble State */}
        <div className="relative p-6 rounded-2xl bg-gradient-to-b from-purple-950/60 to-slate-950 border border-purple-800/60 flex flex-col items-center justify-center text-center overflow-hidden">
          <div className={`w-32 h-32 rounded-full border-4 border-dashed border-purple-400/80 bg-purple-600/20 flex flex-col items-center justify-center p-3 relative transition-all duration-700 ${
            isShattering ? 'animate-ping scale-125 bg-purple-400/50' : bubbleBroken ? 'scale-0 opacity-0' : 'animate-pulse'
          }`}>
            <span className="text-[10px] font-mono text-purple-200 font-bold">ECHO CHAMBER</span>
            <p className="text-[9px] text-purple-300 italic mt-1 leading-tight">
              "Hanya kami yang benar! Mereka salah!"
            </p>
            <div className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded bg-rose-600 text-[9px] font-mono font-bold text-white">
              TERISOLASI
            </div>
          </div>

          <div className="mt-4 text-xs font-mono text-slate-300">
            Status Injeksi Spektrum Opini: <span className="text-purple-400 font-bold">{insertedCards.length} / 3 Terpasang</span>
          </div>
        </div>

        {/* Card Insertion Tray */}
        <div className="space-y-3">
          <span className="text-xs font-semibold text-purple-300 font-mono block">
            Pilih dan Masukkan Kartu Perspektif Beragam ke Filter Mesin:
          </span>

          <div className="space-y-2">
            {availableCards.map((card) => {
              const isInserted = insertedCards.includes(card.id);
              return (
                <div
                  key={card.id}
                  className={`p-3 rounded-xl border flex items-center justify-between transition ${
                    isInserted
                      ? 'border-emerald-500/60 bg-emerald-950/40 text-emerald-300'
                      : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-purple-600/60'
                  }`}
                >
                  <div className="space-y-0.5">
                    <p className="font-bold text-xs font-mono">{card.title}</p>
                    <p className="text-[11px] text-slate-400">{card.desc}</p>
                  </div>

                  <button
                    onClick={() => handleInsertCard(card.id)}
                    disabled={isInserted}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                      isInserted
                        ? 'bg-emerald-900 text-emerald-300 border border-emerald-500/40 cursor-default'
                        : 'bg-purple-600 hover:bg-purple-500 text-white shadow'
                    }`}
                  >
                    {isInserted ? '✓ Terpasang' : '+ Pasang ke Mesin'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Outcome Action */}
        {bubbleBroken ? (
          <div className="p-4 rounded-xl bg-purple-950 border border-purple-400 text-center space-y-1">
            <Sparkles className="w-8 h-8 text-purple-300 mx-auto animate-bounce" />
            <h4 className="font-bold text-purple-200 font-cyber text-lg">GELEMBUNG BERHASIL DIPECAHKAN!</h4>
            <p className="text-xs text-purple-300">
              Masyarakat siber kini menyadari pentingnya empati, dialog majemuk, dan sikap terbuka! (+1000 Digital Culture)
            </p>
          </div>
        ) : (
          <button
            onClick={handleShatterBubble}
            disabled={insertedCards.length < 3 || isShattering}
            className="w-full py-3 px-4 rounded-xl font-bold font-cyber text-slate-950 bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-300 hover:to-pink-300 shadow-lg shadow-purple-500/30 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
          >
            {isShattering ? (
              'Mengirim Frekuensi Penyeimbang Algoritma...'
            ) : (
              <>
                <Disc className="w-5 h-5" /> Aktifkan Algoritma Berimbang & Pecahkan Gelembung (+1000 XP)
              </>
            )}
          </button>
        )}

      </div>
    </div>
  );
};
