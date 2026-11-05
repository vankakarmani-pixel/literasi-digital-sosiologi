import { InteriorRoom, Rect, NPCData, InteractiveItem } from './types';
import { NPCS } from './worldData';

// Helper to find NPC
const getNpc = (id: string): NPCData => {
  const n = NPCS.find(item => item.id === id);
  if (!n) throw new Error(`NPC ${id} not found`);
  return { ...n };
};

export const INTERIOR_ROOMS: Record<string, InteriorRoom> = {
  interior_cekfakta: {
    id: 'interior_cekfakta',
    name: 'Markas CekFakta · Laboratorium Verifikasi',
    subtitle: 'Pusat Analisis Metadata, Deteksi Deepfake & TurnBackHoax',
    theme: 'tech',
    w: 900,
    h: 680,
    floorColor: '#042f2e',
    wallColor: '#0f172a',
    exitDoor: {
      x: 420,
      y: 630,
      w: 60,
      h: 40,
      targetOutside: { x: 1980, y: 720 },
    },
    furniture: [
      // Top server rack wall
      { id: 'srv1', name: 'Server TurnBackHoax Cluster', type: 'server', x: 80, y: 80, w: 180, h: 50, color: '#0d9488', label: 'SERVER AI' },
      { id: 'srv2', name: 'Arsip Database Citra Nasional', type: 'server', x: 640, y: 80, w: 180, h: 50, color: '#0d9488', label: 'ARSIP DATA' },
      
      // Main Center Supercomputer Terminal
      { id: 'term_fact', name: 'Superkomputer TurnBackHoax', type: 'terminal', x: 380, y: 150, w: 140, h: 80, color: '#10b981', label: 'MESIN CEKFAKTA [E]', interactiveAction: 'mission1' },

      // Research Desks
      { id: 'desk1', name: 'Meja Investigasi Forensik Digital', type: 'desk', x: 120, y: 280, w: 160, h: 70, color: '#134e4a', label: 'Meja Analis 1' },
      { id: 'desk2', name: 'Meja Pemindaian EXIF & Drone', type: 'desk', x: 620, y: 280, w: 160, h: 70, color: '#134e4a', label: 'Meja Analis 2' },

      // Meeting table
      { id: 'desk3', name: 'Meja Rapat Verifikasi Jurnalistik', type: 'desk', x: 340, y: 400, w: 220, h: 80, color: '#0f766e', label: 'Meja Verifikasi' },
      
      // Bookshelves & Plants
      { id: 'sh1', name: 'Rak Jurnal Sosiologi Media', type: 'shelf', x: 80, y: 480, w: 40, h: 100, color: '#334155' },
      { id: 'sh2', name: 'Rak Pedoman Cek Fakta UNESCO', type: 'shelf', x: 780, y: 480, w: 40, h: 100, color: '#334155' },
      
      // Door carpet rug
      { id: 'rug_door', name: 'Karpet Pintu Keluar', type: 'rug', x: 410, y: 610, w: 80, h: 50, color: '#10b981' },
    ],
    obstacles: [
      // Outer walls
      { x: 0, y: 0, w: 900, h: 60 },
      { x: 0, y: 0, w: 50, h: 680 },
      { x: 850, y: 0, w: 50, h: 680 },
      { x: 0, y: 640, w: 410, h: 40 },
      { x: 490, y: 640, w: 410, h: 40 },

      // Furniture collision
      { x: 80, y: 80, w: 180, h: 50 },
      { x: 640, y: 80, w: 180, h: 50 },
      { x: 380, y: 150, w: 140, h: 75 },
      { x: 120, y: 280, w: 160, h: 70 },
      { x: 620, y: 280, w: 160, h: 70 },
      { x: 340, y: 400, w: 220, h: 80 },
      { x: 80, y: 480, w: 40, h: 100 },
      { x: 780, y: 480, w: 40, h: 100 },
    ],
    npcs: [
      {
        ...getNpc('inspektur_fakta'),
        x: 450,
        y: 260,
        roomLocation: 'interior_cekfakta',
      },
    ],
    interactiveItems: [],
  },

  interior_gelembung: {
    id: 'interior_gelembung',
    name: 'Laboratorium Algoritma & Ruang Gema (Echo Chamber)',
    subtitle: 'Simulasi Sirkulasi Konten Tertutup & Pemecah Bias Konfirmasi',
    theme: 'cyber',
    w: 900,
    h: 680,
    floorColor: '#2e1065',
    wallColor: '#170535',
    exitDoor: {
      x: 420,
      y: 630,
      w: 60,
      h: 40,
      targetOutside: { x: 580, y: 720 },
    },
    furniture: [
      // Central Hologram Filter Terminal
      { id: 'term_echo', name: 'Terminal Filter Algoritma Berimbang', type: 'terminal', x: 370, y: 160, w: 160, h: 80, color: '#a855f7', label: 'MESIN FILTER [E]', interactiveAction: 'mission2' },

      // Holographic feed projectors
      { id: 'feed1', name: 'Proyektor Linimasa Bias', type: 'server', x: 100, y: 90, w: 180, h: 60, color: '#7e22ce', label: 'ECHO FEED A' },
      { id: 'feed2', name: 'Proyektor Sentimen Ekstrem', type: 'server', x: 620, y: 90, w: 180, h: 60, color: '#7e22ce', label: 'ECHO FEED B' },

      // Study desks
      { id: 'desk_g1', name: 'Konsol Analisis Polarisasi', type: 'desk', x: 140, y: 320, w: 160, h: 70, color: '#581c87', label: 'Konsol Polarisasi' },
      { id: 'desk_g2', name: 'Konsol Jaringan Sosial Netizen', type: 'desk', x: 600, y: 320, w: 160, h: 70, color: '#581c87', label: 'Konsol Warganet' },

      // Door rug
      { id: 'rug_door_g', name: 'Pintu Keluar Ruang Gema', type: 'rug', x: 410, y: 610, w: 80, h: 50, color: '#c084fc' },
    ],
    obstacles: [
      { x: 0, y: 0, w: 900, h: 60 },
      { x: 0, y: 0, w: 50, h: 680 },
      { x: 850, y: 0, w: 50, h: 680 },
      { x: 0, y: 640, w: 410, h: 40 },
      { x: 490, y: 640, w: 410, h: 40 },

      { x: 100, y: 90, w: 180, h: 60 },
      { x: 620, y: 90, w: 180, h: 60 },
      { x: 370, y: 160, w: 160, h: 80 },
      { x: 140, y: 320, w: 160, h: 70 },
      { x: 600, y: 320, w: 160, h: 70 },
    ],
    npcs: [
      {
        ...getNpc('netizen_terjebak'),
        x: 450,
        y: 280,
        roomLocation: 'interior_gelembung',
      },
    ],
    interactiveItems: [],
  },

  interior_privasi: {
    id: 'interior_privasi',
    name: 'Kantor Keamanan Siber & Ruang Brankas Privasi',
    subtitle: 'Zona Perlindungan Data Pribadi & Mitigasi Doxxing',
    theme: 'tech',
    w: 900,
    h: 680,
    floorColor: '#450a0a',
    wallColor: '#1c0505',
    exitDoor: {
      x: 420,
      y: 630,
      w: 60,
      h: 40,
      targetOutside: { x: 520, y: 1640 },
    },
    furniture: [
      // High Security Privacy Safe Vault
      { id: 'safe_vault', name: 'Brankas Privasi Berlapis (2FA)', type: 'safe', x: 370, y: 140, w: 160, h: 90, color: '#f43f5e', label: 'BRANKAS PRIVASI [E]', interactiveAction: 'mission3' },

      // Security radar monitor
      { id: 'radar_wall', name: 'Dinding Monitor Radar Hacker', type: 'server', x: 100, y: 90, w: 200, h: 50, color: '#b91c1c', label: 'RADAR DOXXING' },
      { id: 'id_vault', name: 'Lemari Berkas Kependudukan Aman', type: 'shelf', x: 600, y: 90, w: 200, h: 50, color: '#991b1b', label: 'ARSIP NIK/KTP' },

      // Investigation desks
      { id: 'desk_p1', name: 'Meja Konseling Korban Kejahatan Siber', type: 'desk', x: 160, y: 320, w: 180, h: 70, color: '#7f1d1d', label: 'Meja Konseling' },
      { id: 'desk_p2', name: 'Meja Enkripsi Kunci Asimetris', type: 'desk', x: 560, y: 320, w: 180, h: 70, color: '#7f1d1d', label: 'Meja Enkripsi' },

      // Door rug
      { id: 'rug_door_p', name: 'Pintu Keluar Kantor Privasi', type: 'rug', x: 410, y: 610, w: 80, h: 50, color: '#f43f5e' },
    ],
    obstacles: [
      { x: 0, y: 0, w: 900, h: 60 },
      { x: 0, y: 0, w: 50, h: 680 },
      { x: 850, y: 0, w: 50, h: 680 },
      { x: 0, y: 640, w: 410, h: 40 },
      { x: 490, y: 640, w: 410, h: 40 },

      { x: 370, y: 140, w: 160, h: 90 },
      { x: 100, y: 90, w: 200, h: 50 },
      { x: 600, y: 90, w: 200, h: 50 },
      { x: 160, y: 320, w: 180, h: 70 },
      { x: 560, y: 320, w: 180, h: 70 },
    ],
    npcs: [
      {
        ...getNpc('korban_doxxing'),
        x: 450,
        y: 280,
        roomLocation: 'interior_privasi',
      },
    ],
    interactiveItems: [],
  },

  interior_balai_kota: {
    id: 'interior_balai_kota',
    name: 'Balai Kota Siber · Aula Agung Sosiologi',
    subtitle: 'Pusat Kebijakan Publik & Teori Perubahan Sosial Durkheim',
    theme: 'civic',
    w: 980,
    h: 720,
    floorColor: '#082f49',
    wallColor: '#031726',
    exitDoor: {
      x: 460,
      y: 670,
      w: 60,
      h: 40,
      targetOutside: { x: 1300, y: 1240 },
    },
    furniture: [
      // Grand Stage & Podium
      { id: 'podium', name: 'Podium Orasi Guru Besar Sosiologi', type: 'podium', x: 420, y: 120, w: 140, h: 70, color: '#0284c7', label: 'MIMBAR SOSIOLOGI [E]', interactiveAction: 'dialog_prof' },
      
      // Indonesian flags & emblems
      { id: 'flag1', name: 'Bendera Merah Putih', type: 'plant', x: 340, y: 120, w: 40, h: 70, color: '#ef4444' },
      { id: 'flag2', name: 'Panji Literasi Digital', type: 'plant', x: 600, y: 120, w: 40, h: 70, color: '#38bdf8' },

      // Red carpet runner
      { id: 'carpet', name: 'Karpet Merah Kehormatan', type: 'rug', x: 450, y: 190, w: 80, h: 480, color: '#b91c1c' },

      // Meeting desks left & right
      { id: 'meet_l', name: 'Meja Musyawarah Dewan Warga', type: 'desk', x: 120, y: 280, w: 220, h: 90, color: '#0369a1', label: 'Fraksi Warganet A' },
      { id: 'meet_r', name: 'Meja Musyawarah Akademisi', type: 'desk', x: 640, y: 280, w: 220, h: 90, color: '#0369a1', label: 'Fraksi Warganet B' },

      // Archives
      { id: 'arc1', name: 'Arsip Teori Durkheim & Castells', type: 'shelf', x: 80, y: 450, w: 50, h: 120, color: '#334155' },
      { id: 'arc2', name: 'Arsip Riset Literasi SMA Nasional', type: 'shelf', x: 850, y: 450, w: 50, h: 120, color: '#334155' },
    ],
    obstacles: [
      { x: 0, y: 0, w: 980, h: 60 },
      { x: 0, y: 0, w: 50, h: 720 },
      { x: 930, y: 0, w: 50, h: 720 },
      { x: 0, y: 680, w: 450, h: 40 },
      { x: 530, y: 680, w: 450, h: 40 },

      { x: 420, y: 120, w: 140, h: 70 },
      { x: 340, y: 120, w: 40, h: 70 },
      { x: 600, y: 120, w: 40, h: 70 },
      { x: 120, y: 280, w: 220, h: 90 },
      { x: 640, y: 280, w: 220, h: 90 },
      { x: 80, y: 450, w: 50, h: 120 },
      { x: 850, y: 450, w: 50, h: 120 },
    ],
    npcs: [
      {
        ...getNpc('prof_sosio'),
        x: 490,
        y: 220,
        roomLocation: 'interior_balai_kota',
      },
    ],
    interactiveItems: [],
  },

  interior_kampanye: {
    id: 'interior_kampanye',
    name: 'Gedung Kampanye Digital · Auditorium Etika',
    subtitle: 'Pusat Gerakan Solidaritas Warganet & Anti-Cyberbullying',
    theme: 'auditorium',
    w: 900,
    h: 680,
    floorColor: '#500724',
    wallColor: '#20030f',
    exitDoor: {
      x: 420,
      y: 630,
      w: 60,
      h: 40,
      targetOutside: { x: 1320, y: 1980 },
    },
    furniture: [
      // Auditorium Stage
      { id: 'stage_k', name: 'Panggung Deklarasi Etika Siber', type: 'podium', x: 360, y: 120, w: 180, h: 80, color: '#ec4899', label: 'TAMENG ETIKA [E]', interactiveAction: 'mission4' },

      // Audience seats rows
      { id: 'seat1', name: 'Barisan Kursi Relawan A', type: 'desk', x: 120, y: 280, w: 240, h: 45, color: '#831843', label: 'Kursi Peserta' },
      { id: 'seat2', name: 'Barisan Kursi Relawan B', type: 'desk', x: 540, y: 280, w: 240, h: 45, color: '#831843', label: 'Kursi Peserta' },
      { id: 'seat3', name: 'Barisan Kursi Relawan C', type: 'desk', x: 120, y: 380, w: 240, h: 45, color: '#831843', label: 'Kursi Peserta' },
      { id: 'seat4', name: 'Barisan Kursi Relawan D', type: 'desk', x: 540, y: 380, w: 240, h: 45, color: '#831843', label: 'Kursi Peserta' },

      // Door rug
      { id: 'rug_door_k', name: 'Pintu Keluar Gedung Kampanye', type: 'rug', x: 410, y: 610, w: 80, h: 50, color: '#f472b6' },
    ],
    obstacles: [
      { x: 0, y: 0, w: 900, h: 60 },
      { x: 0, y: 0, w: 50, h: 680 },
      { x: 850, y: 0, w: 50, h: 680 },
      { x: 0, y: 640, w: 410, h: 40 },
      { x: 490, y: 640, w: 410, h: 40 },

      { x: 360, y: 120, w: 180, h: 80 },
      { x: 120, y: 280, w: 240, h: 45 },
      { x: 540, y: 280, w: 240, h: 45 },
      { x: 120, y: 380, w: 240, h: 45 },
      { x: 540, y: 380, w: 240, h: 45 },
    ],
    npcs: [
      {
        ...getNpc('agen_etika'),
        x: 450,
        y: 230,
        roomLocation: 'interior_kampanye',
      },
    ],
    interactiveItems: [],
  },

  interior_wisma: {
    id: 'interior_wisma',
    name: 'Wisma Komunitas & Pondok Belajar Agen',
    subtitle: 'Ruang Santai, Diskusi Refleksi & Perpustakaan Digital',
    theme: 'cozy',
    w: 800,
    h: 600,
    floorColor: '#451a03',
    wallColor: '#1c0a00',
    exitDoor: {
      x: 370,
      y: 550,
      w: 60,
      h: 40,
      targetOutside: { x: 2150, y: 1360 },
    },
    furniture: [
      // Warm Fireplace
      { id: 'fire', name: 'Perapian Nyaman', type: 'server', x: 340, y: 80, w: 120, h: 60, color: '#f97316', label: '🔥 PERAPIAN' },

      // Study desk with laptop
      { id: 'desk_w', name: 'Meja Belajar Siswa', type: 'desk', x: 100, y: 180, w: 160, h: 80, color: '#78350f', label: 'Laptop Agen' },

      // Cozy Sofa and Coffee table
      { id: 'sofa', name: 'Sofa Empuk Diskusi Santai', type: 'sofa', x: 480, y: 240, w: 200, h: 70, color: '#047857', label: 'Sofa Santai' },
      { id: 'table_c', name: 'Meja Teh & Camilan Belajar', type: 'desk', x: 520, y: 330, w: 120, h: 50, color: '#92400e', label: 'Meja Kopi' },

      // Bookshelves
      { id: 'book1', name: 'Rak Buku Sosiologi Klasik', type: 'shelf', x: 80, y: 380, w: 40, h: 120, color: '#78350f' },
      { id: 'book2', name: 'Rak Ensiklopedia Dunia Digital', type: 'shelf', x: 680, y: 380, w: 40, h: 120, color: '#78350f' },

      // Door rug
      { id: 'rug_w', name: 'Keset Selamat Datang', type: 'rug', x: 360, y: 530, w: 80, h: 50, color: '#d97706' },
    ],
    obstacles: [
      { x: 0, y: 0, w: 800, h: 60 },
      { x: 0, y: 0, w: 50, h: 600 },
      { x: 750, y: 0, w: 50, h: 600 },
      { x: 0, y: 560, w: 360, h: 40 },
      { x: 440, y: 560, w: 360, h: 40 },

      { x: 340, y: 80, w: 120, h: 60 },
      { x: 100, y: 180, w: 160, h: 80 },
      { x: 480, y: 240, w: 200, h: 70 },
      { x: 520, y: 330, w: 120, h: 50 },
      { x: 80, y: 380, w: 40, h: 120 },
      { x: 680, y: 380, w: 40, h: 120 },
    ],
    npcs: [],
    interactiveItems: [],
  },

  interior_botani: {
    id: 'interior_botani',
    name: 'Rumah Kaca Botani · Laboratorium Ekologi Siber',
    subtitle: 'Eksperimen Respons Tanaman terhadap Nutrisi Kebaikan vs Racun Digital',
    theme: 'cozy',
    w: 860,
    h: 640,
    floorColor: '#2d3748',
    wallColor: '#1a202c',
    exitDoor: {
      x: 400,
      y: 590,
      w: 60,
      h: 40,
      targetOutside: { x: 2115, y: 1620 },
    },
    furniture: [
      // Central Interactive Botanical Experiment Plot
      { id: 'term_botani', name: 'Meja Eksperimen Botani Digital', type: 'terminal', x: 340, y: 130, w: 180, h: 90, color: '#16a34a', label: 'TAMAN BOTANI [E]', interactiveAction: 'botanical_garden' },

      // Seedling shelves left and right
      { id: 'plant_sh1', name: 'Rak Bibit Nalar Kritis', type: 'shelf', x: 80, y: 90, w: 180, h: 50, color: '#047857', label: 'BIBIT DIGITAL' },
      { id: 'plant_sh2', name: 'Rak Pupuk Empati & 2FA', type: 'shelf', x: 600, y: 90, w: 180, h: 50, color: '#047857', label: 'PUPUK LITERASI' },

      // Greenhouse glass planter tables
      { id: 'table_g1', name: 'Meja Mikroskop & Analisis Klorofil', type: 'desk', x: 120, y: 290, w: 160, h: 70, color: '#15803d', label: 'Meja Analis Botani' },
      { id: 'table_g2', name: 'Meja Peneliti Ekologi Sosial', type: 'desk', x: 580, y: 290, w: 160, h: 70, color: '#15803d', label: 'Meja Kultur Jaringan' },

      // Decorative potted trees
      { id: 'tree_pot1', name: 'Bonsai Siber Bercahaya', type: 'plant', x: 80, y: 440, w: 50, h: 80, color: '#22c55e' },
      { id: 'tree_pot2', name: 'Palem Kedaulatan Privasi', type: 'plant', x: 730, y: 440, w: 50, h: 80, color: '#22c55e' },

      // Door rug
      { id: 'rug_botani', name: 'Keset Daun Alami', type: 'rug', x: 390, y: 570, w: 80, h: 50, color: '#10b981' },
    ],
    obstacles: [
      { x: 0, y: 0, w: 860, h: 60 },
      { x: 0, y: 0, w: 50, h: 640 },
      { x: 810, y: 0, w: 50, h: 640 },
      { x: 0, y: 600, w: 390, h: 40 },
      { x: 470, y: 600, w: 390, h: 40 },

      { x: 340, y: 130, w: 180, h: 90 },
      { x: 80, y: 90, w: 180, h: 50 },
      { x: 600, y: 90, w: 180, h: 50 },
      { x: 120, y: 290, w: 160, h: 70 },
      { x: 580, y: 290, w: 160, h: 70 },
      { x: 80, y: 440, w: 50, h: 80 },
      { x: 730, y: 440, w: 50, h: 80 },
    ],
    npcs: [
      {
        ...getNpc('dr_flora'),
        x: 430,
        y: 260,
        roomLocation: 'interior_botani',
      },
    ],
    interactiveItems: [],
  },

  interior_klinik: {
    id: 'interior_klinik',
    name: 'Klinik & Laboratorium Detoksifikasi Siber',
    subtitle: 'Skrining Imunitas Digital, Radiasi Hoaks & Pemulihan Korban',
    theme: 'tech',
    w: 940,
    h: 700,
    floorColor: '#f1f5f9',
    wallColor: '#cbd5e1',
    exitDoor: {
      x: 440,
      y: 650,
      w: 60,
      h: 40,
      targetOutside: { x: 825, y: 1220 },
    },
    furniture: [
      // Reception Counter Desk (like user image 3)
      { id: 'desk_rec', name: 'Meja Resepsionis & Registrasi Pasien', type: 'desk', x: 280, y: 100, w: 220, h: 60, color: '#38bdf8', label: 'RESEPSIONIS SIBER' },
      
      // Diagnostic CT / MRI Scanner for Hoax Toxicity
      { id: 'scanner_bed', name: 'Scanner CT Deteksi Toksisitas Hoaks', type: 'terminal', x: 620, y: 110, w: 180, h: 80, color: '#0284c7', label: 'DIAGNOSA SIBER [E]', interactiveAction: 'quiz' },

      // Patient Recovery Beds with IV Drip
      { id: 'bed_1', name: 'Ranjang Pasien Detoksifikasi 1', type: 'sofa', x: 100, y: 260, w: 120, h: 70, color: '#93c5fd', label: 'Ranjang 1' },
      { id: 'bed_2', name: 'Ranjang Pasien Detoksifikasi 2', type: 'sofa', x: 100, y: 380, w: 120, h: 70, color: '#93c5fd', label: 'Ranjang 2' },

      // Partitioned consultation desks (Image 3 layout)
      { id: 'desk_doc', name: 'Meja Konsultasi Psiko-Sosiologi', type: 'desk', x: 620, y: 320, w: 180, h: 75, color: '#0ea5e9', label: 'Konsultasi Dokter' },

      // Medical Archives & Pharmacy Shelves
      { id: 'med_sh1', name: 'Lemari Suplemen Etika Digital', type: 'shelf', x: 380, y: 280, w: 160, h: 50, color: '#64748b', label: 'FARMASI LITERASI' },

      // Indoor potted plants
      { id: 'plant_k1', name: 'Tanaman Pembersih Udara Klinik', type: 'plant', x: 80, y: 520, w: 40, h: 60, color: '#10b981' },
      { id: 'plant_k2', name: 'Tanaman Penenang Pikiran', type: 'plant', x: 820, y: 520, w: 40, h: 60, color: '#10b981' },

      // Door rug
      { id: 'rug_klinik', name: 'Keset Steril Rumah Sakit', type: 'rug', x: 430, y: 630, w: 80, h: 50, color: '#0284c7' },
    ],
    obstacles: [
      { x: 0, y: 0, w: 940, h: 60 },
      { x: 0, y: 0, w: 50, h: 700 },
      { x: 890, y: 0, w: 50, h: 700 },
      { x: 0, y: 660, w: 430, h: 40 },
      { x: 510, y: 660, w: 430, h: 40 },

      { x: 280, y: 100, w: 220, h: 60 },
      { x: 620, y: 110, w: 180, h: 80 },
      { x: 100, y: 260, w: 120, h: 70 },
      { x: 100, y: 380, w: 120, h: 70 },
      { x: 620, y: 320, w: 180, h: 75 },
      { x: 380, y: 280, w: 160, h: 50 },
    ],
    npcs: [
      {
        ...getNpc('dr_detoks'),
        x: 480,
        y: 200,
        roomLocation: 'interior_klinik',
      },
    ],
    interactiveItems: [],
  },

  interior_kamar_estetik: {
    id: 'interior_kamar_estetik',
    name: 'Kamar Siswa & Studio Desain Estetik',
    subtitle: 'Meja Belajar Lengkung, Lemari Rias Kustomisasi & Kucing Siber',
    theme: 'cozy',
    w: 860,
    h: 650,
    floorColor: '#faedcd',
    wallColor: '#285e61',
    exitDoor: {
      x: 400,
      y: 600,
      w: 60,
      h: 40,
      targetOutside: { x: 825, y: 1620 },
    },
    furniture: [
      // Curved Study Desk with aquarium & globe (user image 1)
      { id: 'desk_curved', name: 'Meja Belajar Lengkung Siswa', type: 'desk', x: 120, y: 180, w: 240, h: 80, color: '#b45309', label: 'MEJA BELAJAR SOSIOLOGI' },

      // Vanity Dressing Mirror: Interactive Character Customizer! (user image 2)

      // Cute Bed with soft pastel duvet
      { id: 'bed_cozy', name: 'Tempat Tidur Estetik dengan Bantal Hati', type: 'sofa', x: 100, y: 80, w: 160, h: 90, color: '#fbcfe8', label: 'Kasur Empuk' },

      // Cute Sleeping Cat (can be petted)
      { id: 'cat_bed', name: 'Kucing Siam Siber Imut', type: 'plant', x: 420, y: 320, w: 60, h: 50, color: '#ffedd5', label: 'KUCING [E]', interactiveAction: 'pet_cat' },

      // Bookshelves with Sociology & Digital Literacy Books
      { id: 'book_shelf', name: 'Rak Buku Durkheim & Ogburn', type: 'shelf', x: 620, y: 260, w: 160, h: 60, color: '#92400e', label: 'PERPUSTAKAAN SISWA' },

      // Cozy Rug
      { id: 'rug_kamar', name: 'Karpet Hati Lembut', type: 'rug', x: 390, y: 580, w: 80, h: 50, color: '#f472b6' },
    ],
    obstacles: [
      { x: 0, y: 0, w: 860, h: 60 },
      { x: 0, y: 0, w: 50, h: 650 },
      { x: 810, y: 0, w: 50, h: 650 },
      { x: 0, y: 610, w: 390, h: 40 },
      { x: 470, y: 610, w: 390, h: 40 },

      { x: 120, y: 180, w: 240, h: 80 },
      { x: 580, y: 110, w: 150, h: 80 },
      { x: 100, y: 80, w: 160, h: 90 },
      { x: 620, y: 260, w: 160, h: 60 },
    ],
    npcs: [],
    interactiveItems: [],
  },
};

// Door trigger positions on the exterior Town cottages
export const BUILDING_DOORS = [
  {
    id: 'door_balai_kota',
    buildingName: 'Balai Kota Siber',
    x: 1275,
    y: 1150,
    w: 50,
    h: 40,
    targetRoomId: 'interior_balai_kota',
    spawnInside: { x: 490, y: 620 },
  },
  {
    id: 'door_cekfakta',
    buildingName: 'Markas CekFakta',
    x: 1935,
    y: 460,
    w: 50,
    h: 40,
    targetRoomId: 'interior_cekfakta',
    spawnInside: { x: 450, y: 580 },
  },
  {
    id: 'door_gelembung',
    buildingName: 'Ruang Gelembung Algoritma',
    x: 555,
    y: 460,
    w: 50,
    h: 40,
    targetRoomId: 'interior_gelembung',
    spawnInside: { x: 450, y: 580 },
  },
  {
    id: 'door_privasi',
    buildingName: 'Kantor Keamanan Privasi',
    x: 495,
    y: 1600,
    w: 50,
    h: 40,
    targetRoomId: 'interior_privasi',
    spawnInside: { x: 450, y: 580 },
  },
  {
    id: 'door_kampanye',
    buildingName: 'Gedung Kampanye Digital',
    x: 1285,
    y: 1880,
    w: 50,
    h: 40,
    targetRoomId: 'interior_kampanye',
    spawnInside: { x: 450, y: 580 },
  },
  {
    id: 'door_wisma',
    buildingName: 'Wisma Komunitas Agen',
    x: 2115,
    y: 1270,
    w: 50,
    h: 40,
    targetRoomId: 'interior_wisma',
    spawnInside: { x: 400, y: 500 },
  },
  {
    id: 'door_botani',
    buildingName: 'Rumah Kaca Botani Siber',
    x: 2115,
    y: 1550,
    w: 50,
    h: 40,
    targetRoomId: 'interior_botani',
    spawnInside: { x: 430, y: 540 },
  },
  {
    id: 'door_klinik',
    buildingName: 'Klinik Detoksifikasi Siber',
    x: 825,
    y: 1150,
    w: 50,
    h: 40,
    targetRoomId: 'interior_klinik',
    spawnInside: { x: 470, y: 590 },
  },
  {
    id: 'door_kamar_estetik',
    buildingName: 'Kamar Siswa & Studio Estetik',
    x: 825,
    y: 1550,
    w: 50,
    h: 40,
    targetRoomId: 'interior_kamar_estetik',
    spawnInside: { x: 430, y: 550 },
  },
];
