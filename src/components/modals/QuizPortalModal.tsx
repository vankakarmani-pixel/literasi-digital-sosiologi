import React, { useState } from 'react';
import { Sparkles, CheckCircle2, HelpCircle, ArrowRight, Award } from 'lucide-react';
import { sound } from '../../game/audio';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (score: number) => void;
}

interface Question {
  id: number;
  caseText: string;
  theory: string;
  question: string;
  options: {
    key: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    theory: 'Teori Ketinggalan Budaya (Cultural Lag - William F. Ogburn)',
    caseText: 'Sebagian besar remaja Indonesia saat ini telah memiliki ponsel pintar canggih dengan koneksi internet 5G. Namun demikian, kasus penyebaran konten hoaks, perundungan siber, dan pelanggaran privasi justru melonjak pesat.',
    question: 'Secara sosiologis, kesenjangan antara pesatnya kemajuan teknologi perangkat keras (material culture) dengan lambatnya pemahaman etika dan norma digital warganet (non-material culture) disebut sebagai...',
    options: [
      {
        key: 'A',
        text: 'Cultural Lag (Ketinggalan Budaya)',
        isCorrect: true,
        explanation: 'Tepat! Ogburn menjelaskan bahwa unsur kebudayaan material (gadget/internet) sering berkembang lebih cepat daripada kebudayaan non-material (norma, etika, dan kesadaran hukum masyarakat).',
      },
      {
        key: 'B',
        text: 'Cultural Shock (Guncangan Budaya Sementara)',
        isCorrect: false,
        explanation: 'Kurang tepat. Cultural shock lebih merujuk pada kebingungan seseorang saat memasuki lingkungan budaya asing baru, bukan kesenjangan sistemik norma dan teknologi.',
      },
      {
        key: 'C',
        text: 'Asimilasi Budaya Global',
        isCorrect: false,
        explanation: 'Kurang tepat. Asimilasi adalah peleburan dua kebudayaan menjadi satu kebudayaan baru.',
      },
    ],
  },
  {
    id: 2,
    theory: 'Masyarakat Jaringan & Anomie (Manuel Castells & Emile Durkheim)',
    caseText: 'Di media sosial, banyak pengguna membuat akun samaran (anonim) tanpa foto profil asli. Sebagian dari mereka merasa bebas melontarkan kata-kata kotor, ancaman, dan menyebarkan hoaks karena merasa identitas aslinya tidak diketahui.',
    question: 'Kondisi hilangnya rasa malu dan runtuhnya kepatuhan terhadap norma kesopanan akibat interaksi tanpa tatap muka di dunia siber mencerminkan konsep...',
    options: [
      {
        key: 'A',
        text: 'Solidaritas Mekanis Mutlak',
        isCorrect: false,
        explanation: 'Kurang tepat. Solidaritas mekanis dicirikan oleh kesadaran kolektif yang sangat ketat dan mengikat pada masyarakat tradisional.',
      },
      {
        key: 'B',
        text: 'Anomie Digital & Deindividuasi Sosial',
        isCorrect: true,
        explanation: 'Tepat! Anomie adalah situasi di mana norma masyarakat memudar atau kehilangan daya ikat, sedangkan deindividuasi membuat seseorang merasa bebas dari tanggung jawab moral karena bersembunyi di balik anonimitas.',
      },
      {
        key: 'C',
        text: 'Diferensiasi Struktural Positif',
        isCorrect: false,
        explanation: 'Kurang tepat. Diferensiasi struktural merujuk pada pembagian peran fungsi sosial dalam institusi modern.',
      },
    ],
  },
  {
    id: 3,
    theory: 'Ruang Publik & Diskursus Kritis (Jürgen Habermas)',
    caseText: 'Algoritma platform digital dirancang untuk mengutamakan engagement (klik, komentar panas, share) demi kepentingan keuntungan iklan. Konten yang memicu amarah dan perdebatan sengit lebih sering direkomendasikan daripada konten edukatif yang bernuansa damai.',
    question: 'Berdasarkan kritik teori kritis terhadap ruang publik digital, dampak negatif dari komodifikasi algoritma ini terhadap warganet adalah...',
    options: [
      {
        key: 'A',
        text: 'Membuka kesempatan dialog yang setara bagi semua kelompok marginal',
        isCorrect: false,
        explanation: 'Justru sebaliknya, algoritma komersial cenderung meminggirkan dialog yang sejuk demi konten kontroversial yang laku.',
      },
      {
        key: 'B',
        text: 'Terdistorsinya ruang publik menjadi arena sensasionalisme dan polarisasi kelompok',
        isCorrect: true,
        explanation: 'Benar sekali! Habermas menekankan bahwa ruang publik ideal harus bebas dari distorsi komersial agar konsensus rasional dapat tercapai.',
      },
      {
        key: 'C',
        text: 'Meningkatkan kohesi sosial antarumat beragama secara otomatis',
        isCorrect: false,
        explanation: 'Salah. Algoritma clickbait justru kerap memperuncing sentimen identitas demi interaksi tinggi.',
      },
    ],
  },
  {
    id: 4,
    theory: 'Teori Presentasi Diri & Panggung Depan/Belakang (Erving Goffman)',
    caseText: 'Banyak remaja menampilkan citra hidup serba mewah dan bahagia di linimasa media sosial (front stage), namun menyembunyikan kecemasan dan masalah pribadi di ruang privat (back stage). Ketika seorang oknum membocorkan foto dan rahasia pribadinya (doxxing), batas kehidupannya hancur.',
    question: 'Menurut sosiologi dramaturgi Goffman, bahaya terbesar dari praktik doxxing adalah...',
    options: [
      {
        key: 'A',
        text: 'Meruntuhkan batas proteksi panggung belakang (backstage) dan merampas kontrol individu atas privasinya',
        isCorrect: true,
        explanation: 'Tepat sekali! Goffman menyatakan setiap manusia membutuhkan panggung belakang (ruang privat) yang aman tanpa sorotan publik agar kesehatan mental dan identitas dirinya terjaga.',
      },
      {
        key: 'B',
        text: 'Membuat orang tersebut menjadi selebriti baru secara instan',
        isCorrect: false,
        explanation: 'Salah. Doxxing adalah pelanggaran privasi traumatis, bukan ajang publisitas positif.',
      },
      {
        key: 'C',
        text: 'Meningkatkan penjualan perangkat lunak antivirus di komputer korban',
        isCorrect: false,
        explanation: 'Kurang tepat. Doxxing menyerang privasi psikososial, bukan sekadar kerusakan teknis perangkat keras.',
      },
    ],
  },
  {
    id: 5,
    theory: 'Masyarakat Berisiko Siber (Risk Society - Ulrich Beck)',
    caseText: 'Kecerdasan Buatan (AI) kini mampu menciptakan audio dan video deepfake seorang tokoh atau teman sekelas yang sedang berbuat asusila atau menghasut, padahal rekaman tersebut 100% palsu.',
    question: 'Karakteristik utama risiko dalam masyarakat era digital menurut Ulrich Beck adalah...',
    options: [
      {
        key: 'A',
        text: 'Risiko hanya dialami oleh mereka yang tidak memiliki akun media sosial',
        isCorrect: false,
        explanation: 'Salah. Risiko modern bersifat merata dan mengancam seluruh tatanan sosial.',
      },
      {
        key: 'B',
        text: 'Risiko diproduksi oleh teknologi modern itu sendiri dan menuntut nalar verifikasi mandiri',
        isCorrect: true,
        explanation: 'Benar! Beck menjelaskan bahwa dalam masyarakat berisiko tinggi, kemajuan teknologi modern menghasilkan risiko-risiko baru yang tidak kasat mata dan butuh refleksivitas kritis.',
      },
      {
        key: 'C',
        text: 'Risiko dapat diatasi hanya dengan mematikan internet selama satu hari',
        isCorrect: false,
        explanation: 'Salah. Disinformasi berbasis AI butuh literasi forensik dan penegakan hukum berkelanjutan.',
      },
    ],
  },
  {
    id: 6,
    theory: 'Modal Sosial Digital & Netiquette (Francis Fukuyama & Pierre Bourdieu)',
    caseText: 'Di sebuah forum siber, anggota kelompok saling mendukung, memeriksa fakta bersama, dan menolak merundung kelompok minoritas, sehingga tercipta rasa saling percaya (trust) yang sangat tinggi.',
    question: 'Secara sosiologis, kekayaan tak berwujud yang dimiliki komunitas tersebut disebut...',
    options: [
      {
        key: 'A',
        text: 'Modal Finansial Moneter',
        isCorrect: false,
        explanation: 'Salah. Ini bukan tentang uang atau transaksi finansial.',
      },
      {
        key: 'B',
        text: 'Modal Sosial (Social Capital) berupa kepercayaan dan norma kerja sama positif',
        isCorrect: true,
        explanation: 'Tepat sekali! Fukuyama dan Bourdieu menekankan bahwa modal sosial berupa kepercayaan, etika bersama, dan jaringan solidaritas adalah fondasi masyarakat yang sehat.',
      },
      {
        key: 'C',
        text: 'Komodifikasi Eksklusif Algoritma',
        isCorrect: false,
        explanation: 'Salah. Komodifikasi merujuk pada menjadikan sesuatu sebagai barang dagangan.',
      },
    ],
  },
];

export const QuizPortalModal: React.FC<Props> = ({ isOpen, onClose, onComplete }) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentQ = QUESTIONS[currentIdx];

  const handleSelectOption = (key: string) => {
    if (showFeedback) return;
    sound.playBlip();
    setSelectedKey(key);
  };

  const handleCheckAnswer = () => {
    if (!selectedKey) return;
    const opt = currentQ.options.find(o => o.key === selectedKey);
    const correct = opt?.isCorrect;

    if (correct) {
      sound.playItemCollect();
      setScore(prev => prev + 1);
    } else {
      sound.playAlarm();
    }
    setShowFeedback(true);
  };

  const handleNext = () => {
    sound.playBlip();
    setShowFeedback(false);
    setSelectedKey(null);

    if (currentIdx + 1 < QUESTIONS.length) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setIsFinished(true);
      sound.playVictoryFanfare();
    }
  };

  const handleClaim = () => {
    const finalScore = Math.min(1000, score * 150); // 6 questions, max 900
    onComplete(finalScore);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-950 border-2 border-amber-500/70 rounded-2xl shadow-2xl shadow-amber-500/20 text-slate-100 p-6 flex flex-col gap-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-800/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-950 border border-amber-500/40 text-amber-400">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-xs font-mono tracking-wider text-amber-400 uppercase font-semibold">
                PORTAL TANTANGAN WARGANET · SOSIOLOGI SMA FASE F
              </span>
              <h2 className="text-xl font-bold font-cyber text-amber-300">
                Ujian Pemikiran Kritis & Perubahan Sosial
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

        {!isFinished ? (
          <div className="space-y-4">
            {/* Progress counter */}
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Studi Kasus {currentIdx + 1} dari {QUESTIONS.length}</span>
              <span className="text-amber-400 font-bold">Skor Benar: {score}</span>
            </div>

            {/* Theory card */}
            <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs">
              <span className="font-bold text-amber-300 font-mono block mb-1">
                Landasan Teori: {currentQ.theory}
              </span>
              <p className="text-amber-200/90 italic">"{currentQ.caseText}"</p>
            </div>

            {/* Question */}
            <h3 className="text-sm font-bold text-white font-cyber">
              {currentQ.question}
            </h3>

            {/* Options */}
            <div className="space-y-2">
              {currentQ.options.map((opt) => {
                const isSelected = selectedKey === opt.key;
                const isCorrect = opt.isCorrect;

                let borderStyle = 'border-slate-800 bg-slate-900 text-slate-300 hover:border-amber-500/50';
                if (showFeedback) {
                  if (isCorrect) borderStyle = 'border-emerald-500 bg-emerald-950/60 text-emerald-200';
                  else if (isSelected && !isCorrect) borderStyle = 'border-rose-500 bg-rose-950/60 text-rose-200';
                } else if (isSelected) {
                  borderStyle = 'border-amber-400 bg-amber-950/60 text-amber-200 ring-2 ring-amber-500/30';
                }

                return (
                  <button
                    key={opt.key}
                    onClick={() => handleSelectOption(opt.key)}
                    disabled={showFeedback}
                    className={`w-full p-3 rounded-xl border text-left transition flex items-start gap-3 cursor-pointer ${borderStyle}`}
                  >
                    <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-black/40 text-slate-300">
                      {opt.key}
                    </span>
                    <div className="text-xs">
                      <p className="font-semibold">{opt.text}</p>
                      {showFeedback && (isSelected || isCorrect) && (
                        <p className="text-[11px] mt-1 text-slate-300 font-mono leading-relaxed">
                          {opt.explanation}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Next / Check action */}
            {!showFeedback ? (
              <button
                onClick={handleCheckAnswer}
                disabled={!selectedKey}
                className="w-full py-3 px-4 rounded-xl font-bold font-cyber text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 shadow-lg shadow-amber-500/30 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
              >
                <CheckCircle2 className="w-5 h-5" /> Kunci Jawaban & Analisis Sosiologi
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="w-full py-3 px-4 rounded-xl font-bold font-cyber text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 shadow-lg shadow-emerald-500/30 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {currentIdx + 1 < QUESTIONS.length ? 'Kasus Selanjutnya' : 'Lihat Hasil Evaluasi Portal'} <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-amber-950/40 border border-amber-500/50 text-center space-y-4">
            <Award className="w-12 h-12 text-amber-400 mx-auto animate-bounce" />
            <h3 className="font-bold text-xl font-cyber text-amber-200">
              TANTANGAN PORTAL SELESAI!
            </h3>
            <p className="text-sm text-slate-300">
              Kamu berhasil menjawab <span className="font-bold text-amber-400">{score}</span> dari {QUESTIONS.length} studi kasus sosiologi dengan tepat.
            </p>
            <p className="text-xs font-mono text-emerald-300">
              + {score * 300} Poin Kecakapan Analisis Kritis Warganet!
            </p>
            <button
              onClick={handleClaim}
              className="py-3 px-6 rounded-xl font-bold font-cyber text-slate-950 bg-amber-400 hover:bg-amber-300 shadow-lg transition cursor-pointer"
            >
              Simpan Nilai & Kembali ke Kota Siber
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
