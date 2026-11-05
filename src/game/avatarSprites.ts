import { AvatarInfo, Direction, CustomLook } from './types';

export const SPRITE_SHEET_URL = '/assets/aistudio/33f8eb398132004e22b6aff6281b9125_757073bf.jpg';

// Preload and key out white background into an offscreen canvas
let transparentSpriteSheetCanvas: HTMLCanvasElement | null = null;
let isSpriteSheetLoaded = false;

if (typeof window !== 'undefined') {
  const rawImg = new Image();
  rawImg.src = SPRITE_SHEET_URL;
  rawImg.onload = () => {
    try {
      const offscreen = document.createElement('canvas');
      offscreen.width = rawImg.naturalWidth;
      offscreen.height = rawImg.naturalHeight;
      const oCtx = offscreen.getContext('2d');
      if (oCtx) {
        oCtx.drawImage(rawImg, 0, 0);
        const imgData = oCtx.getImageData(0, 0, offscreen.width, offscreen.height);
        const data = imgData.data;
        // Key out near-white background pixels
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          if (r > 232 && g > 232 && b > 232) {
            data[i + 3] = 0; // alpha = 0
          }
        }
        oCtx.putImageData(imgData, 0, 0);
        transparentSpriteSheetCanvas = offscreen;
        isSpriteSheetLoaded = true;
      }
    } catch {
      transparentSpriteSheetCanvas = rawImg as any;
      isSpriteSheetLoaded = true;
    }
  };
}

export const AVATAR_LIST: AvatarInfo[] = [
  // Siswa SMA Putra & Putri (Row 3 dari Sprite Sheet - Seragam Sekolah Khas SMA)
  {
    id: 1,
    name: 'Rian (SMA Seragam Putih)',
    gender: 'Laki-laki',
    style: 'Seragam Putih Abu-abu & Dasi Khas SMA',
    hairColor: '#1e293b',
    shirtColor: '#f8fafc',
    skinColor: '#fed7aa',
    accessory: 'Dasi SMA & Tablet',
    description: 'Siswa SMA aktif, kritis memeriksa sumber berita viral.',
    spriteCol: 0,
    spriteRow: 3,
  },
  {
    id: 2,
    name: 'Nadia (Siswi SMA Seragam)',
    gender: 'Perempuan',
    style: 'Seragam Putih SMA & Rambut Hitam Rapi',
    hairColor: '#0f172a',
    shirtColor: '#f8fafc',
    skinColor: '#fed7aa',
    accessory: 'Pin Literasi SMA',
    description: 'Siswi cerdas, fokus pada investigasi jejak digital.',
    spriteCol: 1,
    spriteRow: 3,
  },
  {
    id: 3,
    name: 'Siti (Siswi SMA Rambut Panjang)',
    gender: 'Perempuan',
    style: 'Seragam SMA Anggun & Buku Sosiologi',
    hairColor: '#1e1b4b',
    shirtColor: '#f8fafc',
    skinColor: '#ffedd5',
    accessory: 'Buku Catatan Sosiologi',
    description: 'Meneliti anomie dan perubahan nilai budaya warganet.',
    spriteCol: 2,
    spriteRow: 3,
  },
  {
    id: 4,
    name: 'Arya (Siswa SMA Dasi Panjang)',
    gender: 'Laki-laki',
    style: 'Seragam SMA Rapih & Smartwatch',
    hairColor: '#09090b',
    shirtColor: '#f8fafc',
    skinColor: '#fef08a',
    accessory: 'Smartwatch Radar',
    description: 'Pakar debat yang selalu menyajikan data empiris.',
    spriteCol: 3,
    spriteRow: 3,
  },
  {
    id: 5,
    name: 'Bima (Ethical Hacker Muda)',
    gender: 'Laki-laki',
    style: 'Kaos Hijau & Celana Kargo Siber',
    hairColor: '#334155',
    shirtColor: '#10b981',
    skinColor: '#fed7aa',
    accessory: 'Laptop Portabel',
    description: 'Ahli keamanan privasi dan pencegahan kebocoran data.',
    spriteCol: 3,
    spriteRow: 1,
  },
  {
    id: 6,
    name: 'Clara (Siswi Bando Biru Ungu)',
    gender: 'Perempuan',
    style: 'Bando Biru, Rambut Ungu & Rompi Pelajar',
    hairColor: '#4338ca',
    shirtColor: '#818cf8',
    skinColor: '#fed7aa',
    accessory: 'Bando Siber & Lanyard',
    description: 'Pelopor budaya digital sehat dan pemecah echo chamber.',
    spriteCol: 6,
    spriteRow: 3,
  },
  {
    id: 7,
    name: 'Faris (Siswa Kacamata Analis)',
    gender: 'Laki-laki',
    style: 'Kemeja Rapi, Kacamata & Dasi Hitam',
    hairColor: '#18181b',
    shirtColor: '#e2e8f0',
    skinColor: '#fef08a',
    accessory: 'Kacamata Analitik',
    description: 'Memeriksa keaslian metadata foto dan rekaman suara.',
    spriteCol: 2,
    spriteRow: 0,
  },
  {
    id: 8,
    name: 'Zahra (Siswi Kuncir Cokelat)',
    gender: 'Perempuan',
    style: 'Kuncir Cokelat & Kaos Hijau Toska',
    hairColor: '#78350f',
    shirtColor: '#14b8a6',
    skinColor: '#fed7aa',
    accessory: 'Earphone Nirkabel',
    description: 'Relawan pendamping korban perundungan siber.',
    spriteCol: 4,
    spriteRow: 0,
  },
  {
    id: 9,
    name: 'Kenji (Siswa Headphone Siber)',
    gender: 'Laki-laki',
    style: 'Rambut Poni, Headphone & Kaos Toska',
    hairColor: '#0f172a',
    shirtColor: '#06b6d4',
    skinColor: '#fed7aa',
    accessory: 'Headphone Studio',
    description: 'Memantau arus komunikasi data antarkelompok warganet.',
    spriteCol: 1,
    spriteRow: 4,
  },
  {
    id: 10,
    name: 'Maya (Siswi Jas Ungu Formal)',
    gender: 'Perempuan',
    style: 'Setelan Jas Ungu Elegan & Scarf Merah',
    hairColor: '#09090b',
    shirtColor: '#581c87',
    skinColor: '#451a03',
    accessory: 'Lencana Kehormatan',
    description: 'Diplomat ruang siber yang menjunjung etika warganet.',
    spriteCol: 4,
    spriteRow: 1,
  },
  {
    id: 11,
    name: 'Dimas (Siswa Techwear Hitam)',
    gender: 'Laki-laki',
    style: 'Kaos Hitam Streetwear & Rambut Pirang Gelap',
    hairColor: '#713f12',
    shirtColor: '#18181b',
    skinColor: '#fed7aa',
    accessory: 'Gelang Proteksi 2FA',
    description: 'Pelindung ruang privat dan penegak keamanan data.',
    spriteCol: 4,
    spriteRow: 4,
  },
  {
    id: 12,
    name: 'Alya (Siswi Gaun Hijau Bando)',
    gender: 'Perempuan',
    style: 'Gaun Hijau Cerah, Bando Merah & Kalung',
    hairColor: '#064e3b',
    shirtColor: '#10b981',
    skinColor: '#ffedd5',
    accessory: 'Bando Merah',
    description: 'Mengedukasi masyarakat agar bijak dalam bermedia sosial.',
    spriteCol: 0,
    spriteRow: 5,
  },
  {
    id: 13,
    name: 'Gilang (Siswa Kaos Putih Kacamata)',
    gender: 'Laki-laki',
    style: 'Kaos Putih Casual & Kacamata Bulat',
    hairColor: '#172554',
    shirtColor: '#f1f5f9',
    skinColor: '#fed7aa',
    accessory: 'Kacamata Bulat',
    description: 'Analis fakta sosial di forum digital remaja.',
    spriteCol: 0,
    spriteRow: 4,
  },
  {
    id: 14,
    name: 'Tiara (Siswi Rambut Abu-abu Pita)',
    gender: 'Perempuan',
    style: 'Rambut Bob Toska Lembut & Pita Pink',
    hairColor: '#64748b',
    shirtColor: '#f43f5e',
    skinColor: '#fef08a',
    accessory: 'Pita Pink Siber',
    description: 'Menjembatani komunikasi antarkomunitas yang terpolarisasi.',
    spriteCol: 4,
    spriteRow: 2,
  },
  {
    id: 15,
    name: 'Fajar (Siswa Kemeja Biru)',
    gender: 'Laki-laki',
    style: 'Kemeja Biru Langit & Rambut Rapi',
    hairColor: '#0f172a',
    shirtColor: '#38bdf8',
    skinColor: '#fef08a',
    accessory: 'Smart Badge Agen',
    description: 'Membimbing warganet agar tidak terjebak hoaks.',
    spriteCol: 2,
    spriteRow: 4,
  },
  {
    id: 16,
    name: 'Hana (Siswi Twin-Tail Pink)',
    gender: 'Perempuan',
    style: 'Kuncir Dua Merah Muda & Jaket Kuning',
    hairColor: '#be185d',
    shirtColor: '#f59e0b',
    skinColor: '#ffedd5',
    accessory: 'Gantungan Tablet Cute',
    description: 'Kampanye anti-cyberbullying yang ramah dan energetik.',
    spriteCol: 6,
    spriteRow: 1,
  },
];

export function getAvatarById(id: number): AvatarInfo {
  return AVATAR_LIST.find(a => a.id === id) || AVATAR_LIST[0];
}

/**
 * Procedural + Sprite Sheet Pixel Renderer
 * Crops and draws the exact pixel art character from the uploaded sprite sheet reference!
 */
export function drawCharacterSprite(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  avatarId: number,
  direction: Direction,
  isMoving: boolean,
  walkTimer: number,
  name: string,
  classGrade?: string,
  isLocalPlayer = false,
  customCol?: number,
  customRow?: number,
  customLook?: CustomLook
) {
  const avatar = getAvatarById(avatarId);
  const col = customCol !== undefined ? customCol : avatar.spriteCol;
  const row = customRow !== undefined ? customRow : avatar.spriteRow;

  ctx.save();
  ctx.translate(x, y);

  // Shadow under character
  ctx.beginPath();
  ctx.ellipse(0, 16, 12, 5, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.fill();

  // Subtle pulsing aura under local player
  if (isLocalPlayer) {
    ctx.beginPath();
    ctx.ellipse(0, 16, 16, 7, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(6, 182, 212, 0.28)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.8)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  // Walking cycle offsets
  const walkBob = isMoving ? Math.abs(Math.sin(walkTimer * 12)) * 3 : 0;
  const walkTilt = isMoving ? Math.sin(walkTimer * 12) * 0.05 : 0;

  // Render from Sprite Sheet if loaded
  if (isSpriteSheetLoaded && transparentSpriteSheetCanvas) {
    // 7 columns, 7 rows
    const cellW = transparentSpriteSheetCanvas.width / 7;
    const cellH = transparentSpriteSheetCanvas.height / 7;

    // Crop box inside the cell
    const sx = col * cellW + cellW * 0.08;
    const sy = row * cellH + cellH * 0.06;
    const sw = cellW * 0.84;
    const sh = cellH * 0.86;

    // Target size on canvas (pixel art scaled crisply)
    const targetW = 44;
    const targetH = 50;

    ctx.save();
    ctx.translate(0, -10 - walkBob);
    ctx.rotate(walkTilt);

    // Flip horizontally when moving left
    if (direction === 'left') {
      ctx.scale(-1, 1);
    }

    // Nearest-neighbor rendering for pixel sharpness
    ctx.imageSmoothingEnabled = false;

    ctx.drawImage(
      transparentSpriteSheetCanvas,
      sx,
      sy,
      sw,
      sh,
      -targetW / 2,
      -targetH / 2,
      targetW,
      targetH
    );

    // -----------------------------------------------------------------
    // PIXEL ART CUSTOMIZATION OVERLAYS (HAIR, OUTFIT, FACE, ACCESSORIES)
    // -----------------------------------------------------------------
    if (customLook) {
      // 1. Face Expression
      if (customLook.face === 'blush') {
        ctx.fillStyle = '#f472b6';
        ctx.fillRect(-8, -4, 3, 2);
        ctx.fillRect(5, -4, 3, 2);
      } else if (customLook.face === 'senyum') {
        ctx.fillStyle = '#991b1b';
        ctx.fillRect(-2, -1, 4, 1.5);
      } else if (customLook.face === 'kacamata') {
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(-9, -9, 7, 5);
        ctx.strokeRect(2, -9, 7, 5);
        ctx.beginPath();
        ctx.moveTo(-2, -7);
        ctx.lineTo(2, -7);
        ctx.stroke();
        // Lens reflection
        ctx.fillStyle = '#38bdf880';
        ctx.fillRect(-8, -8, 2, 2);
        ctx.fillRect(3, -8, 2, 2);
      } else if (customLook.face === 'visor_siber') {
        ctx.fillStyle = 'rgba(6, 182, 212, 0.85)';
        ctx.fillRect(-11, -9, 22, 4);
        ctx.strokeStyle = '#22d3ee';
        ctx.lineWidth = 1;
        ctx.strokeRect(-11, -9, 22, 4);
      } else if (customLook.face === 'masker') {
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(-7, -3, 14, 7);
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 1;
        ctx.strokeRect(-7, -3, 14, 7);
      }

      // 2. Custom Hair Style & Color Overlay
      if (customLook.hairColor) {
        ctx.fillStyle = customLook.hairColor;
        if (customLook.hairStyle === 'poni') {
          ctx.fillRect(-9, -17, 18, 4);
        } else if (customLook.hairStyle === 'kuncir') {
          ctx.fillRect(-12, -22, 6, 8);
          ctx.fillRect(-14, -26, 4, 5);
        } else if (customLook.hairStyle === 'twintail') {
          ctx.fillRect(-16, -14, 5, 12);
          ctx.fillRect(11, -14, 5, 12);
        } else if (customLook.hairStyle === 'hijab') {
          ctx.fillRect(-12, -20, 24, 7);
          ctx.fillRect(-13, -15, 5, 20);
          ctx.fillRect(8, -15, 5, 20);
          ctx.fillRect(-10, 3, 20, 5);
        } else if (customLook.hairStyle === 'undercut') {
          ctx.fillRect(-9, -21, 18, 6);
          ctx.fillStyle = '#0f172a80';
          ctx.fillRect(-12, -15, 4, 8);
        } else if (customLook.hairStyle === 'curly') {
          ctx.fillRect(-13, -19, 26, 6);
          ctx.fillRect(-14, -14, 4, 8);
          ctx.fillRect(10, -14, 4, 8);
        }
      }

      // 3. Custom Outfit
      if (customLook.outfit === 'seragam_sma') {
        // Red & White OSIS Pocket Badge + SMA Tie
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(-2, 4, 4, 8); // Tie
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(4, 5, 3, 3); // OSIS Pin
      } else if (customLook.outfit === 'batik_sma') {
        // Traditional Indonesian Batik motif dots
        ctx.fillStyle = '#78350f';
        ctx.fillRect(-6, 3, 2, 2);
        ctx.fillRect(-2, 7, 2, 2);
        ctx.fillRect(2, 3, 2, 2);
        ctx.fillRect(5, 7, 2, 2);
      } else if (customLook.outfit === 'hoodie_cyber') {
        // Neon cyan zipper line and hoodie collar
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, 2);
        ctx.lineTo(0, 15);
        ctx.stroke();
      } else if (customLook.outfit === 'jas_lab') {
        // White forensic researcher coat with pen
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(-9, 2, 4, 14);
        ctx.fillRect(5, 2, 4, 14);
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(6, 4, 1.5, 4); // Pen
      } else if (customLook.outfit === 'streetwear') {
        // Black techwear straps
        ctx.strokeStyle = '#09090b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-8, 3);
        ctx.lineTo(6, 12);
        ctx.stroke();
      }

      // 4. Custom Accessories
      if (customLook.accessory === 'headphone') {
        ctx.fillStyle = '#06b6d4';
        ctx.fillRect(-14, -13, 3, 8);
        ctx.fillRect(11, -13, 3, 8);
        ctx.strokeStyle = '#0891b2';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, -14, 12, Math.PI, 0);
        ctx.stroke();
      } else if (customLook.accessory === 'smartwatch') {
        ctx.fillStyle = '#22d3ee';
        ctx.fillRect(-13, 7, 3, 3);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-12, 8, 1, 1);
      } else if (customLook.accessory === 'pin_cekfakta') {
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(-5, 4, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-5.5, 3.5, 1, 1);
      } else if (customLook.accessory === 'bando') {
        ctx.fillStyle = '#ec4899';
        ctx.fillRect(-11, -18, 22, 2.5);
        ctx.fillRect(3, -21, 4, 4); // Ribbon knot
      }
    }

    ctx.restore();
  } else {
    // Fallback procedural renderer while image loads
    ctx.fillStyle = (customLook && customLook.shirtColor) || avatar.shirtColor;
    ctx.beginPath();
    ctx.roundRect(-10, -5 - walkBob, 20, 18, 4);
    ctx.fill();

    ctx.fillStyle = avatar.skinColor;
    ctx.beginPath();
    ctx.arc(0, -14 - walkBob, 9, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = (customLook && customLook.hairColor) || avatar.hairColor;
    ctx.fillRect(-9, -22 - walkBob, 18, 8);
  }

  ctx.restore();

  // FLOATING NAME TAG & CLASS ABOVE CHARACTER
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';

  const label = classGrade ? `${name} [${classGrade}]` : name;
  ctx.font = 'bold 11px "Chakra Petch", sans-serif';
  const textWidth = ctx.measureText(label).width;

  const tagY = y - 32;
  ctx.fillStyle = isLocalPlayer ? 'rgba(6, 182, 212, 0.9)' : 'rgba(15, 23, 42, 0.85)';
  ctx.beginPath();
  ctx.roundRect(x - textWidth / 2 - 6, tagY - 14, textWidth + 12, 17, 4);
  ctx.fill();

  ctx.strokeStyle = isLocalPlayer ? '#22d3ee' : '#64748b';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = isLocalPlayer ? '#082f49' : '#f8fafc';
  ctx.fillText(label, x, tagY);

  ctx.restore();
}
