import React, { useState, useEffect, useRef } from 'react';
import { Sprout, Droplets, AlertTriangle, Sparkles, RefreshCw, X, Award, Info, Heart, Shield, Check, Flower2 } from 'lucide-react';
import { sound } from '../../game/audio';
import { BotanicalPlot, PlantStage } from '../../game/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onRewardScore: (pillar: 'skills' | 'ethics' | 'safety' | 'culture', points: number) => void;
}

interface WaterOption {
  id: string;
  type: 'positive' | 'negative';
  label: string;
  pillar: 'Digital Skills' | 'Digital Ethics' | 'Digital Safety' | 'Digital Culture';
  pillarKey: 'skills' | 'ethics' | 'safety' | 'culture';
  subtext: string;
  sociologyExplanation: string;
}

const WATER_OPTIONS: WaterOption[] = [
  // Positive Actions
  {
    id: 'pos_skills',
    type: 'positive',
    label: '💧 Air Verifikasi CekFakta & Forensik EXIF',
    pillar: 'Digital Skills',
    pillarKey: 'skills',
    subtext: 'Memeriksa sumber resmi, cross-check gambar pembanding, dan menyaring info sebelum membagikan.',
    sociologyExplanation: 'Nalar Kritis & Verifikasi: Dalam sosiologi pengetahuan, memeriksa kebenaran empiris melindungi masyarakat dari kepanikan moral (moral panic) dan manipulasi opini publik.',
  },
  {
    id: 'pos_ethics',
    type: 'positive',
    label: '🌸 Air Empati & Pembelaan Anti-Bullying',
    pillar: 'Digital Ethics',
    pillarKey: 'ethics',
    subtext: 'Menegur perundung dengan sopan dan memberi dukungan moral kepada korban perundungan siber.',
    sociologyExplanation: 'Solidaritas Sosial & Etika Warganet: Tindakan pembelaan (bystander intervention) merajut kembali rasa aman bersama dan mencegah alienasi sosial pada remaja.',
  },
  {
    id: 'pos_safety',
    type: 'positive',
    label: '🛡️ Air Kunci Enkripsi 2FA & Privasi Data',
    pillar: 'Digital Safety',
    pillarKey: 'safety',
    subtext: 'Mengunci data pribadi, mengaktifkan otentikasi dua faktor, dan menolak membocorkan NIK/KTP.',
    sociologyExplanation: 'Kedaulatan Privasi: Menjaga batasan antara ruang privat dan ruang publik adalah hak mendasar individu agar tidak rentan terhadap eksploitasi dan kejahatan siber.',
  },
  {
    id: 'pos_culture',
    type: 'positive',
    label: '🌈 Air Dialog Inklusif (Pemecah Echo Chamber)',
    pillar: 'Digital Culture',
    pillarKey: 'culture',
    subtext: 'Membaca sudut pandang kelompok yang berbeda secara adil dan meruntuhkan bias konfirmasi.',
    sociologyExplanation: 'Ruang Publik Rasional (Habermas): Keragaman opini dan keterbukaan dialog adalah syarat mutlak terciptanya demokrasi deliberatif dan masyarakat yang majemuk.',
  },

  // Negative Actions
  {
    id: 'neg_skills',
    type: 'negative',
    label: '☠️ Racun Hoaks & Clickbait Sensasional',
    pillar: 'Digital Skills',
    pillarKey: 'skills',
    subtext: 'Memforward broadcast provokatif tanpa membaca isi atau memeriksa validitas beritanya.',
    sociologyExplanation: 'Disintegrasi Sosial: Hoaks yang dibagikan secara ceroboh menyebarkan kecurigaan antarkelompok dan memicu konflik horizontal di dunia nyata.',
  },
  {
    id: 'neg_ethics',
    type: 'negative',
    label: '☣️ Asam Cyberbullying & Ujaran Kebencian',
    pillar: 'Digital Ethics',
    pillarKey: 'ethics',
    subtext: 'Menyerang kekurangan fisik atau latar belakang seseorang di kolom komentar media sosial.',
    sociologyExplanation: 'Deindividuasi & Anomie: Anonimitas di internet melunturkan rasa malu dan empati. Korban dapat mengalami trauma psikologis parah dan isolasi sosial.',
  },
  {
    id: 'neg_safety',
    type: 'negative',
    label: '⚠️ Limbah Doxxing & Oversharing Dokumen',
    pillar: 'Digital Safety',
    pillarKey: 'safety',
    subtext: 'Membocorkan nomor telepon, alamat rumah, atau kartu identitas orang lain ke forum warganet.',
    sociologyExplanation: 'Pelanggaran Hak Ruang Privat: Doxxing adalah bentuk kekerasan psikologis terencana yang melanggar hukum (UU ITE) dan mencabut hak rasa aman individu.',
  },
  {
    id: 'neg_culture',
    type: 'negative',
    label: '🛑 Gelembung Fanatisme & Polarisasi Ekstrem',
    pillar: 'Digital Culture',
    pillarKey: 'culture',
    subtext: 'Hanya mau berteman dengan satu kubu dan menghujat semua pihak yang berbeda pandangan.',
    sociologyExplanation: 'Keterbelahan Masyarakat (Echo Chamber): Gelembung algoritma yang dipelihara memupuk sektarianisme dan memusnahkan toleransi kebinekaan.',
  },
];

const INITIAL_PLOTS: BotanicalPlot[] = [
  {
    id: 'plot-1',
    name: 'Bunga Nalar Kritis (Digital Skills)',
    pillar: 'Digital Skills',
    stage: 'sprout',
    vitality: 50,
    growthProgress: 35,
    flowerColor: '#38bdf8',
    feedbackMessage: 'Bibit bunga membutuhkan air verifikasi fakta agar dapat mekar!',
    sociologicalFact: 'Literasi digital membentengi kognisi siswa dari disinformasi.',
  },
  {
    id: 'plot-2',
    name: 'Mawar Empati & Kebaikan (Digital Ethics)',
    pillar: 'Digital Ethics',
    stage: 'sprout',
    vitality: 50,
    growthProgress: 35,
    flowerColor: '#f43f5e',
    feedbackMessage: 'Tunas empati siap menyerap energi positif netiquette warganet!',
    sociologicalFact: 'Bystander aktif adalah kunci pencegahan perundungan di sekolah.',
  },
  {
    id: 'plot-3',
    name: 'Kaktus Kedaulatan Data (Digital Safety)',
    pillar: 'Digital Safety',
    stage: 'sprout',
    vitality: 50,
    growthProgress: 35,
    flowerColor: '#10b981',
    feedbackMessage: 'Tanaman proteksi privasi siap membentuk perisai dari kebocoran data.',
    sociologicalFact: 'Data pribadi adalah aset berharga yang wajib dilindungi UU PDP.',
  },
  {
    id: 'plot-4',
    name: 'Teratai Kebinekaan (Digital Culture)',
    pillar: 'Digital Culture',
    stage: 'sprout',
    vitality: 50,
    growthProgress: 35,
    flowerColor: '#a855f7',
    feedbackMessage: 'Teratai budaya siber butuh pertukaran gagasan yang sehat dan terbuka.',
    sociologicalFact: 'Masyarakat majemuk tumbuh kuat jika merayakan keberagaman sudut pandang.',
  },
];

export const BotanicalGardenModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onRewardScore,
}) => {
  const [plots, setPlots] = useState<BotanicalPlot[]>(INITIAL_PLOTS);
  const [selectedPlotId, setSelectedPlotId] = useState<string>('plot-1');
  const [isWateringAnimation, setIsWateringAnimation] = useState(false);
  const [wateringType, setWateringType] = useState<'positive' | 'negative' | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const selectedPlot = plots.find(p => p.id === selectedPlotId) || plots[0];

  // Canvas animation for the selected plant
  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const render = () => {
      t += 0.05;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height - 50;

      // Draw Pixel Art Flower Pot
      ctx.save();
      // Pot shadow
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.beginPath();
      ctx.ellipse(cx, cy + 25, 60, 15, 0, 0, Math.PI * 2);
      ctx.fill();

      // Pot body (terracotta cozy pixel style)
      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.moveTo(cx - 45, cy - 20);
      ctx.lineTo(cx + 45, cy - 20);
      ctx.lineTo(cx + 35, cy + 25);
      ctx.lineTo(cx - 35, cy + 25);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Pot rim
      ctx.fillStyle = '#d97706';
      ctx.fillRect(cx - 50, cy - 28, 100, 12);
      ctx.strokeRect(cx - 50, cy - 28, 100, 12);

      // Soil
      ctx.fillStyle = '#451a03';
      ctx.fillRect(cx - 42, cy - 18, 84, 8);

      // Plant rendering based on stage and vitality
      const sway = Math.sin(t * 2) * 4;
      const isBloomed = selectedPlot.stage === 'bloomed';
      const isWilted = selectedPlot.stage === 'wilted';

      if (selectedPlot.stage === 'seed') {
        // Just small seed mound
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(cx, cy - 16, 4, 0, Math.PI * 2);
        ctx.fill();
      } else if (isWilted) {
        // Drooping withered blackened stem
        ctx.strokeStyle = '#57534e';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(cx, cy - 18);
        ctx.bezierCurveTo(cx - 10, cy - 60, cx + 25, cy - 80, cx + 35, cy - 60);
        ctx.stroke();

        // Wilted drooping flower head
        ctx.fillStyle = '#44403c';
        ctx.beginPath();
        ctx.arc(cx + 38, cy - 55, 14, 0, Math.PI * 2);
        ctx.fill();

        // Falling dry leaves
        ctx.fillStyle = '#78716c';
        ctx.fillRect(cx + 10, cy - 40, 6, 8);
        ctx.fillRect(cx - 15, cy - 10, 8, 4);

        // Sad smoke puffs
        const smokeY = (t * 20) % 50;
        ctx.fillStyle = 'rgba(120, 113, 108, 0.4)';
        ctx.beginPath();
        ctx.arc(cx + 38, cy - 75 - smokeY, 6 + smokeY * 0.15, 0, Math.PI * 2);
        ctx.fill();
      } else if (isBloomed) {
        // Tall lush vibrant stem with blooming petals & sparkles
        const stemHeight = 110;
        ctx.strokeStyle = '#15803d';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(cx, cy - 18);
        ctx.quadraticCurveTo(cx + sway * 0.6, cy - 70, cx + sway, cy - 18 - stemHeight);
        ctx.stroke();

        // Lush green leaves left and right
        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.ellipse(cx - 24 + sway * 0.4, cy - 60, 20, 9, -0.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.ellipse(cx + 24 + sway * 0.4, cy - 75, 20, 9, 0.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Radiant Blooming Petals
        const headX = cx + sway;
        const headY = cy - 18 - stemHeight;

        // Glowing aura
        const glowRad = 45 + Math.sin(t * 4) * 6;
        const grad = ctx.createRadialGradient(headX, headY, 5, headX, headY, glowRad);
        grad.addColorStop(0, `${selectedPlot.flowerColor}80`);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(headX, headY, glowRad, 0, Math.PI * 2);
        ctx.fill();

        // 8 Flower petals around center
        const petalCount = 8;
        const petalDist = 20;
        for (let i = 0; i < petalCount; i++) {
          const angle = (i * Math.PI * 2) / petalCount + t * 0.3;
          const px = headX + Math.cos(angle) * petalDist;
          const py = headY + Math.sin(angle) * petalDist;

          ctx.fillStyle = selectedPlot.flowerColor;
          ctx.beginPath();
          ctx.arc(px, py, 13, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#ffffff60';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // Flower Center
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(headX, headY, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ca8a04';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Sparkle particles floating
        for (let s = 0; s < 4; s++) {
          const sparkAngle = t * 1.5 + (s * Math.PI) / 2;
          const dist = 35 + Math.sin(t * 3 + s) * 15;
          const sx = headX + Math.cos(sparkAngle) * dist;
          const sy = headY + Math.sin(sparkAngle) * dist;

          ctx.fillStyle = '#ffffff';
          ctx.fillRect(sx - 2, sy - 2, 5, 5);
          ctx.fillStyle = '#fef08a';
          ctx.fillRect(sx - 1, sy - 1, 3, 3);
        }
      } else {
        // Sprout / Growing stage
        const stemHeight = 65;
        ctx.strokeStyle = '#16a34a';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(cx, cy - 18);
        ctx.quadraticCurveTo(cx + sway * 0.4, cy - 45, cx + sway * 0.6, cy - 18 - stemHeight);
        ctx.stroke();

        // Small young leaves
        ctx.fillStyle = '#4ade80';
        ctx.beginPath();
        ctx.ellipse(cx - 16 + sway * 0.3, cy - 45, 14, 7, -0.4, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(cx + 16 + sway * 0.3, cy - 52, 14, 7, 0.4, 0, Math.PI * 2);
        ctx.fill();

        // Growing flower bud
        ctx.fillStyle = selectedPlot.flowerColor;
        ctx.beginPath();
        ctx.arc(cx + sway * 0.6, cy - 18 - stemHeight, 10, 0, Math.PI * 2);
        ctx.fill();
      }

      // Live Watering Animation Overlays
      if (isWateringAnimation) {
        const isPos = wateringType === 'positive';
        for (let d = 0; d < 12; d++) {
          const dropY = ((t * 80 + d * 25) % 160) + (cy - 160);
          const dropX = cx - 35 + (d * 7) + Math.sin(dropY * 0.1) * 6;

          ctx.fillStyle = isPos ? '#38bdf8' : '#7e22ce';
          ctx.beginPath();
          ctx.arc(dropX, dropY, isPos ? 3.5 : 4.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isOpen, selectedPlot, isWateringAnimation, wateringType]);

  if (!isOpen) return null;

  const handleApplyWater = (option: WaterOption) => {
    if (isWateringAnimation) return;

    setIsWateringAnimation(true);
    setWateringType(option.type);

    if (option.type === 'positive') {
      sound.playWatering();
      setTimeout(() => {
        sound.playBloom();
        setIsWateringAnimation(false);
        setPlots(prev =>
          prev.map(p => {
            if (p.id !== selectedPlotId) return p;
            return {
              ...p,
              stage: 'bloomed',
              vitality: 100,
              growthProgress: 100,
              lastAction: option.label,
              feedbackMessage: `MEKAR SEMPURNA! ${option.subtext}`,
              sociologicalFact: option.sociologyExplanation,
            };
          })
        );
        onRewardScore(option.pillarKey, 150);
      }, 1000);
    } else {
      sound.playWatering();
      setTimeout(() => {
        sound.playWilt();
        setIsWateringAnimation(false);
        setPlots(prev =>
          prev.map(p => {
            if (p.id !== selectedPlotId) return p;
            return {
              ...p,
              stage: 'wilted',
              vitality: 15,
              growthProgress: 30,
              lastAction: option.label,
              feedbackMessage: `BUNGA LAYU & KERACUNAN! ${option.subtext}`,
              sociologicalFact: option.sociologyExplanation,
            };
          })
        );
      }, 1000);
    }
  };

  const handleRemediate = () => {
    sound.playWatering();
    sound.playBloom();
    setPlots(prev =>
      prev.map(p => {
        if (p.id !== selectedPlotId) return p;
        return {
          ...p,
          stage: 'bloomed',
          vitality: 90,
          growthProgress: 90,
          feedbackMessage: 'Tanaman pulih berkat intervensi edukasi sosiologi dan restorasi netiquette!',
          sociologicalFact: 'Restorative Action: Meminta maaf, mengoreksi hoaks, dan memperbaiki hubungan sosial dapat mengembalikan keharmonisan komunitas.',
        };
      })
    );
    onRewardScore('ethics', 100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[94vh] overflow-y-auto stardew-box rounded-3xl p-5 md:p-8 flex flex-col gap-6 font-pixel">
        
        {/* Header Bar */}
        <div className="stardew-wood-header -mx-5 -mt-5 md:-mx-8 md:-mt-8 p-4 rounded-t-2xl flex items-center justify-between border-b-4 border-[#5c2c0e]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-900 border-2 border-amber-400 flex items-center justify-center shadow">
              <Sprout className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold tracking-wide flex items-center gap-2">
                Taman Eksperimen Botani Siber · Rumah Kaca Fase F
              </h2>
              <p className="text-xs text-amber-200 font-sans">
                Eksperimen Interaksi Sosial: Efek Air Positif vs Racun Negatif terhadap Ekosistem Siber
              </p>
            </div>
          </div>

          <button
            onClick={() => { sound.playCozyClick(); onClose(); }}
            className="w-9 h-9 rounded-xl bg-amber-950/80 hover:bg-amber-900 border-2 border-amber-600 flex items-center justify-center text-amber-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Plot Selector Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {plots.map(p => {
            const isSel = p.id === selectedPlotId;
            return (
              <button
                key={p.id}
                onClick={() => { sound.playCozyClick(); setSelectedPlotId(p.id); }}
                className={`p-3 rounded-2xl border-3 text-left transition flex flex-col gap-1.5 cursor-pointer ${
                  isSel
                    ? 'border-[#8b4513] bg-[#faedcd] shadow-md scale-[1.02]'
                    : 'border-[#d4a373] bg-[#fff8e7] hover:bg-[#faedcd]/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#78350f]">{p.pillar}</span>
                  <span className="text-xs">
                    {p.stage === 'bloomed' ? '🌸 Mekar' : p.stage === 'wilted' ? '🥀 Layu' : '🌱 Tunas'}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[#451a03] truncate">{p.name}</h4>
                <div className="w-full bg-[#e2d4b7] h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      p.stage === 'bloomed' ? 'bg-emerald-500' : p.stage === 'wilted' ? 'bg-red-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${p.vitality}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Main Experiment Arena */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left: Animated Plant Pot & Status (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center bg-[#fff8e7] border-3 border-[#8b4513] rounded-2xl p-4 shadow-inner">
            <div className="w-full flex items-center justify-between pb-2 border-b border-[#d4a373]">
              <span className="text-sm font-bold text-[#78350f]">Status Bunga:</span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  selectedPlot.stage === 'bloomed'
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-400'
                    : selectedPlot.stage === 'wilted'
                    ? 'bg-rose-100 text-rose-800 border-rose-400 animate-pulse'
                    : 'bg-amber-100 text-amber-800 border-amber-400'
                }`}
              >
                {selectedPlot.stage === 'bloomed'
                  ? '✨ MEKAR & SEHAT (+XP)'
                  : selectedPlot.stage === 'wilted'
                  ? '⚠️ LAYU & TOKSIK'
                  : '🌱 TUMBUH NORMAL'}
              </span>
            </div>

            {/* Canvas */}
            <canvas
              ref={canvasRef}
              width={340}
              height={260}
              className="w-full max-w-[340px] h-[260px] my-2"
            />

            {/* Vitality details */}
            <div className="w-full space-y-2 text-xs text-[#5c2c0e] font-sans bg-[#faedcd]/80 p-3 rounded-xl border border-[#d4a373]">
              <p className="font-semibold text-sm font-pixel text-[#451a03]">
                {selectedPlot.feedbackMessage}
              </p>
              {selectedPlot.sociologicalFact && (
                <div className="p-2.5 rounded-lg bg-[#fff8e7] border border-[#d4a373] text-[11px] leading-relaxed text-[#5c2c0e]">
                  <strong className="text-[#8b4513] font-pixel block mb-0.5">Analisis Sosiologi:</strong>
                  {selectedPlot.sociologicalFact}
                </div>
              )}
            </div>

            {/* Remedy Button if Wilted */}
            {selectedPlot.stage === 'wilted' && (
              <button
                onClick={handleRemediate}
                className="mt-3 w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-emerald-700 hover:bg-emerald-800 text-white shadow-md flex items-center justify-center gap-2 transition cursor-pointer active:scale-95"
              >
                <RefreshCw className="w-4 h-4" /> Pulihkan Tanaman dengan Aksi Restorasi (+100 XP)
              </button>
            )}
          </div>

          {/* Right: Water & Fertilizer Options (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div>
              <h3 className="text-base font-bold text-[#451a03] flex items-center gap-2 mb-1">
                <Droplets className="w-5 h-5 text-sky-600" /> Pilih Air & Nutrisi Informasi untuk Disiramkan:
              </h3>
              <p className="text-xs text-[#78350f] font-sans">
                Setiap tetes informasi membawa konsekuensi sosial. Ujilah dampak tindakan positif vs racun negatif!
              </p>
            </div>

            {/* Positive Water Options */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-emerald-800 tracking-wider flex items-center gap-1.5 uppercase">
                <Sparkles className="w-3.5 h-3.5" /> Pilihan Literasi Positif (Memicu Bunga Mekar):
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {WATER_OPTIONS.filter(o => o.type === 'positive').map(opt => (
                  <button
                    key={opt.id}
                    disabled={isWateringAnimation}
                    onClick={() => handleApplyWater(opt)}
                    className="p-3 rounded-xl border-2 border-emerald-600 bg-emerald-50 hover:bg-emerald-100 text-left transition flex flex-col justify-between cursor-pointer active:scale-95 shadow-sm disabled:opacity-50"
                  >
                    <div>
                      <h5 className="text-xs font-bold text-emerald-950 font-pixel">{opt.label}</h5>
                      <p className="text-[11px] text-emerald-800 font-sans mt-0.5 leading-snug line-clamp-2">
                        {opt.subtext}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 mt-2 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Siramkan (+150 XP)
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Negative Water Options */}
            <div className="space-y-2 pt-2 border-t border-[#d4a373]">
              <span className="text-xs font-bold text-rose-800 tracking-wider flex items-center gap-1.5 uppercase">
                <AlertTriangle className="w-3.5 h-3.5" /> Eksperimen Racun Digital (Dampak Bunga Layu):
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {WATER_OPTIONS.filter(o => o.type === 'negative').map(opt => (
                  <button
                    key={opt.id}
                    disabled={isWateringAnimation}
                    onClick={() => handleApplyWater(opt)}
                    className="p-3 rounded-xl border-2 border-rose-600 bg-rose-50 hover:bg-rose-100 text-left transition flex flex-col justify-between cursor-pointer active:scale-95 shadow-sm disabled:opacity-50"
                  >
                    <div>
                      <h5 className="text-xs font-bold text-rose-950 font-pixel">{opt.label}</h5>
                      <p className="text-[11px] text-rose-800 font-sans mt-0.5 leading-snug line-clamp-2">
                        {opt.subtext}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-rose-700 mt-2 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Uji Dampak Toksik (Bunga Layu)
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer info banner */}
        <div className="p-3 rounded-2xl bg-[#faedcd] border-2 border-[#8b4513] text-xs text-[#5c2c0e] font-sans flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-[#8b4513] shrink-0" />
            <span>
              <strong>Pelajaran Sosiologi:</strong> Masyarakat digital menyerupai ekosistem hayati. Ketika warganet saling memelihara empati dan verifikasi fakta, seluruh komunitas siber akan mekar berkembang.
            </span>
          </div>
          <button
            onClick={() => { sound.playCozyClick(); onClose(); }}
            className="shrink-0 ml-4 px-4 py-2 rounded-xl bg-[#8b4513] hover:bg-[#70360d] text-amber-100 font-pixel font-bold text-xs transition cursor-pointer shadow"
          >
            Kembali ke Petualangan [ESC]
          </button>
        </div>

      </div>
    </div>
  );
};
