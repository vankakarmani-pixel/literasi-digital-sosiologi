import React, { useState } from 'react';
import { Search, CheckCircle2, AlertTriangle, ShieldCheck, Cpu, Sliders, Eye, FileText, ArrowRight } from 'lucide-react';
import { sound } from '../../game/audio';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (score: number) => void;
  fragmentsCollected: number;
}

export const Mission1CekFaktaModal: React.FC<Props> = ({ isOpen, onClose, onComplete, fragmentsCollected }) => {
  const [step, setStep] = useState<number>(1);
  const [sliderVal, setSliderVal] = useState<number>(50);
  const [selectedDisinfoType, setSelectedDisinfoType] = useState<string>('');
  const [selectedMotivation, setSelectedMotivation] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verifiedSuccess, setVerifiedSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleStartAnalysis = () => {
    sound.playTerminalBeep();
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setStep(2);
      sound.playBlip(700);
    }, 1200);
  };

  const handleFinishMission = () => {
    if (!selectedDisinfoType || !selectedMotivation) return;
    sound.playVictoryFanfare();
    setVerifiedSuccess(true);
    setTimeout(() => {
      onComplete(1000);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-950 border-2 border-emerald-500/70 rounded-2xl shadow-2xl shadow-emerald-500/20 text-slate-100 p-6 flex flex-col gap-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-emerald-800/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-400">
              <Search className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-xs font-mono tracking-wider text-emerald-400 uppercase font-semibold">
                MISI 1 · DIGITAL SKILLS (KECAKAPAN DIGITAL)
              </span>
              <h2 className="text-xl font-bold font-cyber text-emerald-300">
                Operasi Cek Fakta & Mesin TurnBackHoax
              </h2>
            </div>
          </div>
          <button
            onClick={() => { sound.playBlip(); onClose(); }}
            className="text-slate-400 hover:text-white px-3 py-1 rounded-lg hover:bg-slate-800 text-sm font-mono transition"
          >
            [ESC / TUTUP]
          </button>
        </div>

        {/* Step Indicator */}
        <div className="grid grid-cols-3 gap-2 text-xs font-mono">
          <div className={`p-2 rounded-lg border text-center transition ${step >= 1 ? 'border-emerald-500 bg-emerald-950/60 text-emerald-300' : 'border-slate-800 bg-slate-900 text-slate-500'}`}>
            1. Pindai Metadata EXIF
          </div>
          <div className={`p-2 rounded-lg border text-center transition ${step >= 2 ? 'border-emerald-500 bg-emerald-950/60 text-emerald-300' : 'border-slate-800 bg-slate-900 text-slate-500'}`}>
            2. Reverse Image Search
          </div>
          <div className={`p-2 rounded-lg border text-center transition ${step >= 3 ? 'border-emerald-500 bg-emerald-950/60 text-emerald-300' : 'border-slate-800 bg-slate-900 text-slate-500'}`}>
            3. Verifikasi & Teori Sosiologi
          </div>
        </div>

        {/* Fragment Warning */}
        {fragmentsCollected < 3 && step === 1 && (
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <p className="font-semibold">Fragmen Bukti TKP Belum Lengkap ({fragmentsCollected}/3)</p>
              <p className="text-amber-300/80">Kunjungi Taman Interaksi Sosial untuk mengumpulkan 3 serpihan gambar blur sebelum melakukan verifikasi menyeluruh.</p>
            </div>
          </div>
        )}

        {/* STEP 1: EXIF & METADATA SCANNING */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-900/50 space-y-3">
              <h3 className="font-semibold text-emerald-300 flex items-center gap-2 text-sm">
                <Cpu className="w-4 h-4 text-emerald-400" />
                Input Berkas Bukti TKP: "foto_kerusuhan_viral_hd.jpg"
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded-lg bg-black/60 border border-slate-800 space-y-1">
                  <p className="text-slate-400 font-sans">Klaim Viral di Grup Warga:</p>
                  <p className="text-rose-400 font-semibold">"Awas! Kerusuhan besar antar-etnis pecah siang ini di jalan utama Kota Siber!"</p>
                  <p className="text-slate-500 text-[11px] mt-1">Disaksikan oleh 45.000 warganet dalam 2 jam.</p>
                </div>

                <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30 space-y-1">
                  <p className="text-slate-400 font-sans">Hasil Pembacaan Metadata Terminal:</p>
                  <p className="text-emerald-300">Software: Adobe Firefly AI Generator v2.4</p>
                  <p className="text-emerald-300">Creation Date: 2017-04-12 14:02 UTC (Bukan hari ini!)</p>
                  <p className="text-emerald-300">Lokasi Asli: Simulasi Damkar Luar Negeri</p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
                <span className="text-emerald-400 font-semibold block">Konsep Sosiologi (Disinformasi & Moral Panic):</span>
                <p>
                  Stanley Cohen menyebut disinformasi semacam ini memicu <span className="text-amber-300 font-semibold">Kepanikan Moral</span>. Pelaku memanfaatkan rasa takut masyarakat untuk mengkambinghitamkan (scapegoating) kelompok tertentu agar terjadi disintegrasi sosial.
                </p>
              </div>
            </div>

            <button
              onClick={handleStartAnalysis}
              disabled={isVerifying}
              className="w-full py-3 px-4 rounded-xl font-bold font-cyber text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 shadow-lg shadow-emerald-500/30 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isVerifying ? (
                <>
                  <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  Memindai Indeks Citra Google & Yandex Lens...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" /> Lanjutkan ke Reverse Image Search <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        )}

        {/* STEP 2: REVERSE IMAGE SEARCH & COMPARISON SLIDER */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-emerald-900/50 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-emerald-400 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4" /> Geser Slider untuk Melihat Bukti Rekayasa
                </span>
                <span className="text-slate-400">Transparansi Filter: {sliderVal}%</span>
              </div>

              {/* Interactive Image Compare Mockup */}
              <div className="relative h-56 rounded-xl overflow-hidden border border-slate-700 bg-slate-950 flex items-center justify-center">
                {/* Background image: Original real photo representation */}
                <div 
                  className="absolute inset-0 bg-cover bg-center flex flex-col justify-end p-4"
                  style={{
                    background: `linear-gradient(135deg, #064e3b 0%, #022c22 100%)`,
                    opacity: 1,
                  }}
                >
                  <div className="p-3 bg-black/75 rounded-lg border border-emerald-500/30 w-fit text-xs">
                    <span className="text-emerald-400 font-bold font-mono">[FOTO ASLI 2017]</span>
                    <p className="text-slate-200">Latihan Penanganan Bencana Asap oleh Petugas Resmi.</p>
                  </div>
                </div>

                {/* Overlay image: Manipulated Hoax */}
                <div 
                  className="absolute inset-0 bg-cover bg-center flex flex-col justify-end p-4 border-r-2 border-rose-500 transition-all pointer-events-none"
                  style={{
                    width: `${sliderVal}%`,
                    background: `linear-gradient(135deg, #881337 0%, #4c0519 100%)`,
                    overflow: 'hidden',
                  }}
                >
                  <div className="p-3 bg-black/85 rounded-lg border border-rose-500/50 w-64 text-xs whitespace-nowrap">
                    <span className="text-rose-400 font-bold font-mono">[HOAKS VIRAL DIEDIT]</span>
                    <p className="text-rose-200">Ditambahkan efek kobaran api & spanduk provokatif palsu!</p>
                  </div>
                </div>

                <div className="absolute top-3 right-3 px-2 py-1 bg-black/80 rounded border border-slate-700 text-[11px] font-mono text-slate-300">
                  TurnBackHoax Archive #SOC-2026
                </div>
              </div>

              {/* Range Slider */}
              <input
                type="range"
                min="0"
                max="100"
                value={sliderVal}
                onChange={(e) => {
                  setSliderVal(Number(e.target.value));
                  if (Math.random() > 0.7) sound.playFootstep();
                }}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />

              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span>← 100% Foto Asli Arsip</span>
                <span>50/50 Layer Perbandingan</span>
                <span>100% Hoaks Rekayasa AI →</span>
              </div>
            </div>

            <button
              onClick={() => { sound.playBlip(750); setStep(3); }}
              className="w-full py-3 px-4 rounded-xl font-bold font-cyber text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 shadow-lg shadow-emerald-500/30 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-5 h-5" /> Validasi Temuan & Klasifikasi Sosiologis <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* STEP 3: SOCIOLOGICAL CLASSIFICATION */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-emerald-900/50 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-emerald-300 block mb-2 font-mono">
                  1. Berdasarkan analisis UNESCO & Sosiologi Siber, jenis gangguan informasi apakah ini?
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {[
                    { id: 'disinformasi', title: 'DISINFORMASI', desc: 'Informasi salah yang SENGAJA disebar untuk menimbulkan kerugian sosial & provokasi.' },
                    { id: 'misinformasi', title: 'MISINFORMASI', desc: 'Informasi keliru yang disebar tanpa niat jahat (pengguna tidak tahu jika salah).' },
                    { id: 'malinformasi', title: 'MALINFORMASI', desc: 'Informasi fakta nyata yang dibocorkan sengaja untuk menyerang privasi seseorang.' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => { sound.playBlip(); setSelectedDisinfoType(item.id); }}
                      className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                        selectedDisinfoType === item.id
                          ? 'border-emerald-400 bg-emerald-950/70 text-emerald-200 ring-2 ring-emerald-500/30'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className="font-bold font-mono text-sm block mb-1 text-white">{item.title}</span>
                      <p className="text-[11px] leading-relaxed">{item.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-semibold text-emerald-300 block mb-2 font-mono">
                  2. Dampak Sosiologis apa yang dicegah dengan verifikasi ini?
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {[
                    { id: 'disintegrasi', title: 'Mencegah Disintegrasi Sosial & Stereotipe', desc: 'Menghentikan konflik horizontal antarkelompok warganet yang tersulut emosi.' },
                    { id: 'monopoli', title: 'Menambah Jumlah Pengikut Akun Anonim', desc: 'Membantu penyebar berita mendapatkan engagement tinggi tanpa filter.' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => { sound.playBlip(); setSelectedMotivation(item.id); }}
                      className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                        selectedMotivation === item.id
                          ? 'border-emerald-400 bg-emerald-950/70 text-emerald-200 ring-2 ring-emerald-500/30'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className="font-bold font-mono text-sm block mb-1 text-white">{item.title}</span>
                      <p className="text-[11px] leading-relaxed">{item.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {verifiedSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-950 border border-emerald-400 text-center space-y-1">
                <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto animate-bounce" />
                <h4 className="font-bold text-emerald-300 font-cyber text-lg">VERIFIKASI TUNTAS!</h4>
                <p className="text-xs text-emerald-200">
                  Kamu berhasil menyelamatkan warganet dari provokasi hoaks! (+1000 Digital Skills)
                </p>
              </div>
            ) : (
              <button
                onClick={handleFinishMission}
                disabled={!selectedDisinfoType || !selectedMotivation}
                className="w-full py-3 px-4 rounded-xl font-bold font-cyber text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 shadow-lg shadow-emerald-500/30 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
              >
                <CheckCircle2 className="w-5 h-5" /> Publikasikan Hasil Cek Fakta ke Warga Siber (+1000 XP)
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
