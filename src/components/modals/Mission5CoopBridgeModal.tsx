import React, { useState } from 'react';
import { Users, Key, ShieldCheck, Sparkles, Cpu, RefreshCw, CheckCircle2 } from 'lucide-react';
import { sound } from '../../game/audio';
import { socket } from '../../game/socketClient';
import { CoopState } from '../../game/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (score: number) => void;
  coopState: CoopState;
  isHost: boolean;
}

export const Mission5CoopBridgeModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onComplete,
  coopState,
  isHost,
}) => {
  const [localKeyDone, setLocalKeyDone] = useState(coopState.p1EthicalKeyFound);
  const [localFirewallDone, setLocalFirewallDone] = useState(coopState.p2FirewallCleaned);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleActionP1 = () => {
    sound.playTerminalBeep();
    setIsProcessing(true);
    setTimeout(() => {
      sound.playItemCollect();
      setIsProcessing(false);
      setLocalKeyDone(true);
      socket.sendCoopAction('key_found');
      checkBridge(true, localFirewallDone);
    }, 1000);
  };

  const handleActionP2 = () => {
    sound.playTerminalBeep();
    setIsProcessing(true);
    setTimeout(() => {
      sound.playItemCollect();
      setIsProcessing(false);
      setLocalFirewallDone(true);
      socket.sendCoopAction('firewall_cleaned');
      checkBridge(localKeyDone, true);
    }, 1000);
  };

  const checkBridge = (p1: boolean, p2: boolean) => {
    if (p1 && p2) {
      sound.playVictoryFanfare();
      setTimeout(() => {
        onComplete(500);
        onClose();
      }, 2000);
    }
  };

  const bridgeBuilt = (localKeyDone && localFirewallDone) || coopState.bridgeBuilt;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-950 border-2 border-indigo-500/70 rounded-2xl shadow-2xl shadow-indigo-500/20 text-slate-100 p-6 flex flex-col gap-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-indigo-800/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-950 border border-indigo-500/40 text-indigo-400">
              <Users className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-xs font-mono tracking-wider text-indigo-400 uppercase font-semibold">
                ARENA MULTIPLAYER · SOLIDARITAS ORGANIK
              </span>
              <h2 className="text-xl font-bold font-cyber text-indigo-300">
                Membangun Jembatan Toleransi Siber
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

        {/* Sociological Context */}
        <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs space-y-2">
          <span className="font-semibold text-indigo-300 font-mono block">
            Konsep Emile Durkheim: "Solidaritas Organik" di Ruang Siber
          </span>
          <p className="text-indigo-200/90 leading-relaxed">
            Masyarakat modern tidak bisa bertahan hanya dengan ketergantungan mekanis yang seragam. Kita membutuhkan pembagian kerja sosial (division of labour) dan kolaborasi aktif antar-individu agar jembatan integrasi sosial dapat terhubung melintasi sekat digital.
          </p>
        </div>

        {/* Visual Bridge Status */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-indigo-950/60 to-slate-950 border border-indigo-700/50 flex flex-col items-center justify-center text-center">
          <div className="flex items-center justify-between w-full max-w-md px-4 mb-4">
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl bg-cyan-950 border-2 border-cyan-400 flex items-center justify-center mx-auto mb-1 text-cyan-300">
                🏛️
              </div>
              <span className="text-[11px] font-mono text-cyan-300">Distrik Alun-Alun</span>
            </div>

            {/* Bridge Cable */}
            <div className="flex-1 mx-4 h-2 bg-slate-800 rounded-full overflow-hidden relative">
              <div
                className={`h-full transition-all duration-700 ${
                  bridgeBuilt
                    ? 'w-full bg-gradient-to-r from-cyan-400 via-indigo-400 to-emerald-400 animate-pulse'
                    : localKeyDone || localFirewallDone
                    ? 'w-1/2 bg-amber-400'
                    : 'w-0'
                }`}
              />
            </div>

            <div className="text-center">
              <div className="w-12 h-12 rounded-xl bg-emerald-950 border-2 border-emerald-400 flex items-center justify-center mx-auto mb-1 text-emerald-300">
                🌐
              </div>
              <span className="text-[11px] font-mono text-emerald-300">Kawasan Global</span>
            </div>
          </div>

          <p className="text-xs font-mono text-indigo-300">
            {bridgeBuilt
              ? '✨ JEMBATAN TOLERANSI SIBER SUDAH TERHUBUNG PENUH!'
              : '⚡ Jembatan terputus akibat virus hoaks dan firewall prasangka.'}
          </p>
        </div>

        {/* Two Tasks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {/* Role 1 */}
          <div className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 ${
            localKeyDone ? 'bg-cyan-950/40 border-cyan-500 text-cyan-200' : 'bg-slate-900 border-slate-800 text-slate-300'
          }`}>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold font-mono text-cyan-400">Tugas 1: Kunci Etika Firewall</span>
                {localKeyDone && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
              </div>
              <p className="text-[11px] text-slate-400">
                Dekripsi protokol dialog damai untuk meruntuhkan tembok prasangka antardistrik.
              </p>
            </div>

            <button
              onClick={handleActionP1}
              disabled={localKeyDone || isProcessing}
              className={`w-full py-2 px-3 rounded-lg font-mono font-bold text-xs transition cursor-pointer ${
                localKeyDone
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50 cursor-default'
                  : 'bg-cyan-600 hover:bg-cyan-500 text-slate-950 shadow-md'
              }`}
            >
              {localKeyDone ? '✓ Kunci Etika Terpasang' : 'Pecahkan Kunci Firewall'}
            </button>
          </div>

          {/* Role 2 */}
          <div className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 ${
            localFirewallDone ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200' : 'bg-slate-900 border-slate-800 text-slate-300'
          }`}>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold font-mono text-emerald-400">Tugas 2: Disinfeksi Jalur Hoaks</span>
                {localFirewallDone && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              </div>
              <p className="text-[11px] text-slate-400">
                Bersihkan transmisi kabel serat optik dari malware provokasi dan ujaran kebencian.
              </p>
            </div>

            <button
              onClick={handleActionP2}
              disabled={localFirewallDone || isProcessing}
              className={`w-full py-2 px-3 rounded-lg font-mono font-bold text-xs transition cursor-pointer ${
                localFirewallDone
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50 cursor-default'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-slate-950 shadow-md'
              }`}
            >
              {localFirewallDone ? '✓ Jalur Komunikasi Bersih' : 'Disinfeksi Jalur Siber'}
            </button>
          </div>
        </div>

        {bridgeBuilt && (
          <div className="p-4 rounded-xl bg-indigo-950 border border-indigo-400 text-center space-y-1">
            <Sparkles className="w-8 h-8 text-indigo-300 mx-auto animate-bounce" />
            <h4 className="font-bold text-indigo-200 font-cyber text-lg">KOLABORASI KELAS BERHASIL!</h4>
            <p className="text-xs text-indigo-300">
              Kamu dan rekan sekelas berhasil mewujudkan Solidaritas Organik di ruang siber! (+500 Skor Kolaborasi)
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
