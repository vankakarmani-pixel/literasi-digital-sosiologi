import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, X, Check, RefreshCw, Palette, User, Shirt, Glasses, Smile, CheckCircle2 } from 'lucide-react';
import { sound } from '../../game/audio';
import { CustomLook, AvatarInfo } from '../../game/types';
import { AVATAR_LIST, drawCharacterSprite } from '../../game/avatarSprites';

interface Props {
  isOpen: boolean;
  currentLook?: CustomLook;
  currentAvatarId: number;
  onSave: (newAvatarId: number, newLook: CustomLook) => void;
  onClose: () => void;
}

const HAIR_STYLES = [
  { id: 'rapi', label: 'Rapi SMA Belah Samping' },
  { id: 'kuncir', label: 'Kuncir Kuda Bouncy' },
  { id: 'poni', label: 'Poni Lurus Imut' },
  { id: 'curly', label: 'Curly Bertekstur' },
  { id: 'twintail', label: 'Kuncir Dua (Twintail)' },
  { id: 'undercut', label: 'Undercut Modern' },
  { id: 'hijab', label: 'Hijab Pelajar Rapi' },
];

const HAIR_COLORS = [
  { id: '#1e293b', label: 'Hitam Alami', bg: 'bg-slate-900' },
  { id: '#78350f', label: 'Cokelat Hangat', bg: 'bg-amber-900' },
  { id: '#ca8a04', label: 'Pirang Golden', bg: 'bg-yellow-600' },
  { id: '#ec4899', label: 'Pink Pastel', bg: 'bg-pink-500' },
  { id: '#06b6d4', label: 'Biru Neon Cyber', bg: 'bg-cyan-500' },
  { id: '#8b5cf6', label: 'Ungu Lavender', bg: 'bg-purple-500' },
  { id: '#f97316', label: 'Oranye Senja', bg: 'bg-orange-500' },
  { id: '#e2e8f0', label: 'Silver Abu-abu', bg: 'bg-slate-200' },
];

const OUTFITS = [
  { id: 'seragam_sma', label: 'Seragam Putih Abu-abu (Dasi & OSIS)' },
  { id: 'batik_sma', label: 'Seragam Batik SMA Nusantara' },
  { id: 'hoodie_cyber', label: 'Hoodie Cyber Neon Toska' },
  { id: 'jas_lab', label: 'Jas Lab Peneliti Forensik' },
  { id: 'streetwear', label: 'Streetwear Hitam Techwear' },
];

const FACES = [
  { id: 'senyum', label: 'Senyum Ceria' },
  { id: 'blush', label: 'Pipi Merona (Blush Imut)' },
  { id: 'kacamata', label: 'Kacamata Analitik Kritis' },
  { id: 'visor_siber', label: 'Visor Hologram Cyber' },
  { id: 'masker', label: 'Masker Siber Higienis' },
  { id: 'kalem', label: 'Tenang & Kalem' },
];

const ACCESSORIES = [
  { id: 'none', label: 'Tanpa Aksesori' },
  { id: 'headphone', label: 'Headphone Studio di Leher' },
  { id: 'smartwatch', label: 'Smartwatch Radar di Tangan' },
  { id: 'pin_cekfakta', label: 'Lencana Pin CekFakta Emas' },
  { id: 'bando', label: 'Bando / Pita Pink Lucu' },
];

export const CharacterCustomizerModal: React.FC<Props> = ({
  isOpen,
  currentLook,
  currentAvatarId,
  onSave,
  onClose,
}) => {
  const [avatarId, setAvatarId] = useState(currentAvatarId || 1);
  const [activeTab, setActiveTab] = useState<'hair' | 'outfit' | 'face' | 'accessories' | 'preset'>('hair');
  const [look, setLook] = useState<CustomLook>(
    currentLook || {
      hairStyle: 'rapi',
      hairColor: '#1e293b',
      outfit: 'seragam_sma',
      shirtColor: '#f8fafc',
      face: 'senyum',
      accessory: 'none',
    }
  );

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Live Canvas Preview of Animated Character
  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let timer = 0;

    const render = () => {
      timer += 0.05;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2 + 15;

      // Draw floor shadow
      ctx.save();
      ctx.fillStyle = '#faedcd';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = '#d4a373';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw character with full custom layers
      drawCharacterSprite(
        ctx,
        cx,
        cy,
        avatarId,
        'down',
        true, // walking anim for preview
        timer,
        'Preview Agen',
        'XI SMA',
        true,
        undefined,
        undefined,
        look
      );

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isOpen, avatarId, look]);

  if (!isOpen) return null;

  const handleSave = () => {
    sound.playVictoryFanfare();
    onSave(avatarId, look);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto stardew-box rounded-3xl p-5 md:p-7 flex flex-col gap-5 font-pixel">
        
        {/* Header Bar */}
        <div className="stardew-wood-header -mx-5 -mt-5 md:-mx-7 md:-mt-7 p-4 rounded-t-2xl flex items-center justify-between border-b-4 border-[#5c2c0e]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-900 border-2 border-amber-400 flex items-center justify-center shadow">
              <Sparkles className="w-6 h-6 text-yellow-300" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold tracking-wide">
                Kustomisasi Penampilan Agen Siber (Hair, Outfit, Face)
              </h2>
              <p className="text-xs text-amber-200 font-sans">
                Atur gaya rambut, seragam SMA / batik / streetwear, ekspresi wajah, dan aksesori kesukaanmu!
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

        {/* Customizer Body */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* Left: Live Character Preview (4 cols) */}
          <div className="md:col-span-4 flex flex-col items-center bg-[#fff8e7] border-3 border-[#8b4513] rounded-2xl p-4 shadow-inner">
            <span className="text-xs font-bold text-[#78350f] mb-2 uppercase tracking-wider">
              Pratinjau Animasi Karakter:
            </span>

            <canvas
              ref={canvasRef}
              width={200}
              height={220}
              className="w-[200px] h-[220px] rounded-xl border-2 border-[#8b4513] shadow-md bg-[#faedcd]"
            />

            <div className="mt-3 text-center space-y-1 font-sans text-xs text-[#5c2c0e]">
              <p className="font-bold font-pixel text-sm text-[#451a03]">
                {look.outfit === 'seragam_sma'
                  ? 'Siswa/Siswi SMA Berdasi'
                  : look.outfit === 'batik_sma'
                  ? 'Seragam Batik Nusantara'
                  : look.outfit === 'jas_lab'
                  ? 'Peneliti Forensik CekFakta'
                  : 'Streetwear Siber'}
              </p>
              <p className="text-[11px] text-[#78350f]">
                {look.face === 'blush'
                  ? 'Pipi Merona Imut'
                  : look.face === 'kacamata'
                  ? 'Kacamata Analitik'
                  : look.face === 'visor_siber'
                  ? 'Cyber Visor Hologram'
                  : 'Senyum Ramah'}
              </p>
            </div>
          </div>

          {/* Right: Customization Tabs & Options (8 cols) */}
          <div className="md:col-span-8 flex flex-col gap-4">
            
            {/* Tab Buttons */}
            <div className="flex flex-wrap gap-2 border-b-2 border-[#d4a373] pb-2">
              <button
                onClick={() => { sound.playCozyClick(); setActiveTab('hair'); }}
                className={`px-3 py-1.5 rounded-xl border-2 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'hair'
                    ? 'border-[#8b4513] bg-[#8b4513] text-amber-100 shadow'
                    : 'border-[#d4a373] bg-[#fff8e7] text-[#78350f] hover:bg-[#faedcd]'
                }`}
              >
                <Palette className="w-3.5 h-3.5" /> Rambut & Gaya
              </button>
              <button
                onClick={() => { sound.playCozyClick(); setActiveTab('outfit'); }}
                className={`px-3 py-1.5 rounded-xl border-2 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'outfit'
                    ? 'border-[#8b4513] bg-[#8b4513] text-amber-100 shadow'
                    : 'border-[#d4a373] bg-[#fff8e7] text-[#78350f] hover:bg-[#faedcd]'
                }`}
              >
                <Shirt className="w-3.5 h-3.5" /> Pakaian & Seragam
              </button>
              <button
                onClick={() => { sound.playCozyClick(); setActiveTab('face'); }}
                className={`px-3 py-1.5 rounded-xl border-2 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'face'
                    ? 'border-[#8b4513] bg-[#8b4513] text-amber-100 shadow'
                    : 'border-[#d4a373] bg-[#fff8e7] text-[#78350f] hover:bg-[#faedcd]'
                }`}
              >
                <Smile className="w-3.5 h-3.5" /> Wajah & Ekspresi
              </button>
              <button
                onClick={() => { sound.playCozyClick(); setActiveTab('accessories'); }}
                className={`px-3 py-1.5 rounded-xl border-2 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'accessories'
                    ? 'border-[#8b4513] bg-[#8b4513] text-amber-100 shadow'
                    : 'border-[#d4a373] bg-[#fff8e7] text-[#78350f] hover:bg-[#faedcd]'
                }`}
              >
                <Glasses className="w-3.5 h-3.5" /> Aksesori
              </button>
              <button
                onClick={() => { sound.playCozyClick(); setActiveTab('preset'); }}
                className={`px-3 py-1.5 rounded-xl border-2 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'preset'
                    ? 'border-[#8b4513] bg-[#8b4513] text-amber-100 shadow'
                    : 'border-[#d4a373] bg-[#fff8e7] text-[#78350f] hover:bg-[#faedcd]'
                }`}
              >
                <User className="w-3.5 h-3.5" /> Base Avatar (49 Karakter)
              </button>
            </div>

            {/* TAB CONTENT: HAIR */}
            {activeTab === 'hair' && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-[#78350f] mb-2 uppercase">Pilih Model Rambut:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {HAIR_STYLES.map(h => (
                      <button
                        key={h.id}
                        onClick={() => { sound.playCozyClick(); setLook(prev => ({ ...prev, hairStyle: h.id as any })); }}
                        className={`p-2.5 rounded-xl border-2 text-left text-xs transition cursor-pointer ${
                          look.hairStyle === h.id
                            ? 'border-[#8b4513] bg-[#faedcd] font-bold text-[#451a03] shadow'
                            : 'border-[#d4a373] bg-[#fff8e7] text-[#78350f] hover:bg-[#faedcd]/60'
                        }`}
                      >
                        {h.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-[#78350f] mb-2 uppercase">Pilih Warna Rambut:</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {HAIR_COLORS.map(c => (
                      <button
                        key={c.id}
                        onClick={() => { sound.playCozyClick(); setLook(prev => ({ ...prev, hairColor: c.id })); }}
                        className={`p-2 rounded-xl border-2 flex items-center gap-2 text-xs transition cursor-pointer ${
                          look.hairColor === c.id
                            ? 'border-[#8b4513] bg-[#faedcd] font-bold text-[#451a03] ring-2 ring-[#8b4513]'
                            : 'border-[#d4a373] bg-[#fff8e7] text-[#78350f] hover:bg-[#faedcd]/60'
                        }`}
                      >
                        <span className={`w-4 h-4 rounded-full border border-black/30 shrink-0 ${c.bg}`} />
                        <span className="truncate">{c.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: OUTFIT */}
            {activeTab === 'outfit' && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-[#78350f] uppercase">Pilih Pakaian / Seragam Sekolah:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {OUTFITS.map(o => (
                    <button
                      key={o.id}
                      onClick={() => { sound.playCozyClick(); setLook(prev => ({ ...prev, outfit: o.id as any })); }}
                      className={`p-3 rounded-xl border-2 text-left text-xs transition cursor-pointer ${
                        look.outfit === o.id
                          ? 'border-[#8b4513] bg-[#faedcd] font-bold text-[#451a03] shadow'
                          : 'border-[#d4a373] bg-[#fff8e7] text-[#78350f] hover:bg-[#faedcd]/60'
                      }`}
                    >
                      <span className="block font-bold">{o.label}</span>
                      <span className="text-[11px] text-[#78350f] font-sans">
                        {o.id === 'seragam_sma'
                          ? 'Khas siswa SMA berprestasi dengan dasi rapi'
                          : o.id === 'batik_sma'
                          ? 'Identitas budaya Nusantara yang beretika'
                          : o.id === 'jas_lab'
                          ? 'Pakaian formal laboratorium CekFakta'
                          : 'Gaya modern warganet kritis'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: FACE */}
            {activeTab === 'face' && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-[#78350f] uppercase">Pilih Ekspresi & Wajah:</h4>
                <div className="grid grid-cols-2 gap-2.5">
                  {FACES.map(f => (
                    <button
                      key={f.id}
                      onClick={() => { sound.playCozyClick(); setLook(prev => ({ ...prev, face: f.id as any })); }}
                      className={`p-3 rounded-xl border-2 text-left text-xs transition cursor-pointer ${
                        look.face === f.id
                          ? 'border-[#8b4513] bg-[#faedcd] font-bold text-[#451a03] shadow'
                          : 'border-[#d4a373] bg-[#fff8e7] text-[#78350f] hover:bg-[#faedcd]/60'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: ACCESSORIES */}
            {activeTab === 'accessories' && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-[#78350f] uppercase">Pilih Aksesori Karakter:</h4>
                <div className="grid grid-cols-2 gap-2.5">
                  {ACCESSORIES.map(a => (
                    <button
                      key={a.id}
                      onClick={() => { sound.playCozyClick(); setLook(prev => ({ ...prev, accessory: a.id as any })); }}
                      className={`p-3 rounded-xl border-2 text-left text-xs transition cursor-pointer ${
                        look.accessory === a.id
                          ? 'border-[#8b4513] bg-[#faedcd] font-bold text-[#451a03] shadow'
                          : 'border-[#d4a373] bg-[#fff8e7] text-[#78350f] hover:bg-[#faedcd]/60'
                      }`}
                    >
                      {a.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: PRESETS (49 AVATARS) */}
            {activeTab === 'preset' && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-[#78350f] uppercase">Pilih dari 49 Karakter Sprite Sheet Asli:</h4>
                <div className="grid grid-cols-4 md:grid-cols-6 gap-2 max-h-56 overflow-y-auto p-1">
                  {AVATAR_LIST.map(av => (
                    <button
                      key={av.id}
                      onClick={() => { sound.playCozyClick(); setAvatarId(av.id); }}
                      className={`p-2 rounded-xl border-2 text-center text-[11px] transition cursor-pointer ${
                        avatarId === av.id
                          ? 'border-[#8b4513] bg-[#faedcd] font-bold text-[#451a03] ring-2 ring-[#8b4513]'
                          : 'border-[#d4a373] bg-[#fff8e7] text-[#78350f] hover:bg-[#faedcd]/60'
                      }`}
                    >
                      <div className="font-bold truncate">{av.name.split(' ')[0]}</div>
                      <div className="text-[9px] text-[#78350f]">{av.gender}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Action Bottom Bar */}
        <div className="flex items-center justify-between pt-3 border-t-2 border-[#d4a373]">
          <button
            onClick={() => { sound.playCozyClick(); onClose(); }}
            className="px-4 py-2 rounded-xl bg-[#faedcd] hover:bg-[#e2d4b7] text-[#78350f] font-pixel text-xs border border-[#8b4513] transition cursor-pointer"
          >
            Batal [ESC]
          </button>

          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-[#8b4513] hover:bg-[#70360d] text-amber-100 font-pixel font-bold text-sm shadow-md flex items-center gap-2 transition cursor-pointer active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Terapkan Penampilan Baru
          </button>
        </div>

      </div>
    </div>
  );
};
