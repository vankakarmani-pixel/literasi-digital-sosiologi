import React, { useState } from 'react';
import { ShieldCheck, Lock, Key, AlertOctagon, CheckCircle2, ShieldAlert } from 'lucide-react';
import { sound } from '../../game/audio';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (score: number) => void;
  leakedDataCollected: number;
}

export const Mission3PrivacySafeModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onComplete,
  leakedDataCollected,
}) => {
  const [pinCode, setPinCode] = useState<string>('');
  const [useTwoFactor, setUseTwoFactor] = useState<boolean>(false);
  const [purgeDigitalFootprint, setPurgeDigitalFootprint] = useState<boolean>(false);
  const [isLocking, setIsLocking] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleDigitClick = (num: string) => {
    if (pinCode.length < 4) {
      sound.playBlip(500 + pinCode.length * 80);
      setPinCode(pinCode + num);
    }
  };

  const handleClear = () => {
    sound.playBlip(400);
    setPinCode('');
  };

  const handleLockSafe = () => {
    if (pinCode.length !== 4 || !useTwoFactor || !purgeDigitalFootprint) return;

    sound.playTerminalBeep();
    setIsLocking(true);

    setTimeout(() => {
      sound.playVictoryFanfare();
      setIsLocking(false);
      setIsSuccess(true);

      setTimeout(() => {
        onComplete(1000);
        onClose();
      }, 2000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-950 border-2 border-rose-500/70 rounded-2xl shadow-2xl shadow-rose-500/20 text-slate-100 p-6 flex flex-col gap-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-rose-800/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-950 border border-rose-500/40 text-rose-400">
              <Lock className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-xs font-mono tracking-wider text-rose-400 uppercase font-semibold">
                MISI 3 · DIGITAL SAFETY (KEAMANAN DIGITAL)
              </span>
              <h2 className="text-xl font-bold font-cyber text-rose-300">
                Brankas Privasi & Pengamanan Jejak Doxxing
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

        {/* Leaked data status */}
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 text-xs space-y-2">
          <div className="flex items-center gap-2 text-rose-300 font-semibold font-mono">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            Jejak Digital Korban yang Berhasil Dipulihkan:
          </div>
          <div className="grid grid-cols-3 gap-2 text-center font-mono">
            <div className="p-2 rounded bg-black/50 border border-rose-500/30 text-rose-200">
              ✓ Berkas e-KTP & NIK
            </div>
            <div className="p-2 rounded bg-black/50 border border-rose-500/30 text-rose-200">
              ✓ Peta Rumah & Kontak
            </div>
            <div className="p-2 rounded bg-black/50 border border-rose-500/30 text-rose-200">
              ✓ Foto Privat Keluarga
            </div>
          </div>
          <p className="text-rose-300/80 mt-1">
            <span className="font-semibold text-rose-300">Teori Sosiologi Privasi:</span> Jejak digital pasif dan aktif yang bocor ke publik merusak integritas ruang privat (Private Sphere) dan membuka kerentanan viktimisasi siber.
          </p>
        </div>

        {/* Interactive Safe Lock Keypad */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Keypad */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center">
            <span className="text-xs font-mono text-slate-400 mb-2">Setel Kunci Sandi Enkripsi (4 Digit):</span>
            
            <div className="w-full py-2 px-4 mb-4 rounded-lg bg-black/80 border border-rose-500/40 text-center font-mono text-2xl tracking-[0.5em] text-rose-400 min-h-12 flex items-center justify-center">
              {pinCode ? pinCode.padEnd(4, '•') : '••••'}
            </div>

            <div className="grid grid-cols-3 gap-2 w-full max-w-[200px]">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((n) => (
                <button
                  key={n}
                  onClick={() => handleDigitClick(n)}
                  className="py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold font-mono text-sm border border-slate-700 transition active:scale-95 cursor-pointer"
                >
                  {n}
                </button>
              ))}
              <button
                onClick={handleClear}
                className="py-2.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-300 font-mono text-xs border border-rose-800 transition cursor-pointer"
              >
                HAPUS
              </button>
              <button
                onClick={() => handleDigitClick('0')}
                className="py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold font-mono text-sm border border-slate-700 transition active:scale-95 cursor-pointer"
              >
                0
              </button>
              <div className="flex items-center justify-center text-xs font-mono text-slate-500">
                <Key className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Privacy Protocol Checklist */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-3 text-xs">
            <span className="font-semibold text-rose-300 font-mono">
              Protokol Perlindungan Data Pribadi:
            </span>

            <div className="space-y-2">
              <label className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700 transition">
                <input
                  type="checkbox"
                  checked={useTwoFactor}
                  onChange={(e) => {
                    sound.playBlip(600);
                    setUseTwoFactor(e.target.checked);
                  }}
                  className="mt-0.5 accent-rose-500"
                />
                <div>
                  <span className="font-bold text-slate-200 block">Aktifkan 2FA (Two-Factor Authentication)</span>
                  <p className="text-slate-400 text-[11px]">Mencegah pembajakan akun meski password bocor.</p>
                </div>
              </label>

              <label className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700 transition">
                <input
                  type="checkbox"
                  checked={purgeDigitalFootprint}
                  onChange={(e) => {
                    sound.playBlip(650);
                    setPurgeDigitalFootprint(e.target.checked);
                  }}
                  className="mt-0.5 accent-rose-500"
                />
                <div>
                  <span className="font-bold text-slate-200 block">Hapus Data Sensitif dari Forum Terbuka</span>
                  <p className="text-slate-400 text-[11px]">Menggunakan hak dilupakan (Right to be Forgotten).</p>
                </div>
              </label>
            </div>

            <p className="text-[11px] text-slate-400 italic">
              *Pastikan PIN 4 digit terisi dan kedua opsi proteksi diaktifkan.
            </p>
          </div>
        </div>

        {/* Completion button */}
        {isSuccess ? (
          <div className="p-4 rounded-xl bg-rose-950 border border-rose-400 text-center space-y-1">
            <ShieldCheck className="w-8 h-8 text-rose-400 mx-auto animate-bounce" />
            <h4 className="font-bold text-rose-200 font-cyber text-lg">BRANKAS TERKUNCI SEMPURNA!</h4>
            <p className="text-xs text-rose-300">
              Data pribadi korban selamat dari ancaman doxxing dan kejahatan siber! (+1000 Digital Safety)
            </p>
          </div>
        ) : (
          <button
            onClick={handleLockSafe}
            disabled={pinCode.length !== 4 || !useTwoFactor || !purgeDigitalFootprint || isLocking}
            className="w-full py-3 px-4 rounded-xl font-bold font-cyber text-slate-950 bg-gradient-to-r from-rose-400 to-amber-400 hover:from-rose-300 hover:to-amber-300 shadow-lg shadow-rose-500/30 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
          >
            {isLocking ? (
              'Mengenkripsi Arsip Identitas Digital...'
            ) : (
              <>
                <ShieldCheck className="w-5 h-5" /> Kunci Brankas & Amankan Hak Privasi (+1000 XP)
              </>
            )}
          </button>
        )}

      </div>
    </div>
  );
};
