import React, { useState, useEffect } from 'react';
import { Download, Users, RefreshCw, Award, CheckCircle2, FileSpreadsheet } from 'lucide-react';
import { sound } from '../../game/audio';

interface StudentScoreItem {
  name: string;
  classGrade: string;
  skills: number;
  culture: number;
  safety: number;
  ethics: number;
  total: number;
  completedMissions: string[];
  isHost: boolean;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  roomCode: string;
  isHost: boolean;
  currentLocalPlayer: {
    name: string;
    classGrade: string;
    scores: {
      skills: number;
      culture: number;
      safety: number;
      ethics: number;
      total: number;
    };
    completedMissions: string[];
  };
}

export const TeacherDashboardModal: React.FC<Props> = ({
  isOpen,
  onClose,
  roomCode,
  isHost,
  currentLocalPlayer,
}) => {
  const [students, setStudents] = useState<StudentScoreItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchScores = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/rooms/${roomCode}/scores`);
      if (res.ok) {
        const data = await res.json();
        setStudents(data.players || []);
      } else {
        // Fallback to local player if offline or solo
        setStudents([
          {
            name: currentLocalPlayer.name,
            classGrade: currentLocalPlayer.classGrade,
            skills: currentLocalPlayer.scores.skills,
            culture: currentLocalPlayer.scores.culture,
            safety: currentLocalPlayer.scores.safety,
            ethics: currentLocalPlayer.scores.ethics,
            total: currentLocalPlayer.scores.total,
            completedMissions: currentLocalPlayer.completedMissions,
            isHost: true,
          },
        ]);
      }
    } catch {
      setStudents([
        {
          name: currentLocalPlayer.name,
          classGrade: currentLocalPlayer.classGrade,
          skills: currentLocalPlayer.scores.skills,
          culture: currentLocalPlayer.scores.culture,
          safety: currentLocalPlayer.scores.safety,
          ethics: currentLocalPlayer.scores.ethics,
          total: currentLocalPlayer.scores.total,
          completedMissions: currentLocalPlayer.completedMissions,
          isHost: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchScores();
    }
  }, [isOpen, roomCode]);

  if (!isOpen) return null;

  const handleDownloadCsv = () => {
    sound.playItemCollect();
    window.location.href = `/api/rooms/${roomCode}/export-csv`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-950 border-2 border-cyan-500/70 rounded-2xl shadow-2xl shadow-cyan-500/20 text-slate-100 p-6 flex flex-col gap-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cyan-800/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-400">
              <FileSpreadsheet className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-xs font-mono tracking-wider text-cyan-400 uppercase font-semibold">
                DASHBOARD EVALUASI GURU SOSIOLOGI · KELAS AKTIF
              </span>
              <h2 className="text-xl font-bold font-cyber text-cyan-300">
                Rekapitulasi Skor Literasi Digital (Ruang: {roomCode})
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => { sound.playBlip(); fetchScores(); }}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 transition"
              title="Segarkan Data"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => { sound.playBlip(); onClose(); }}
              className="text-slate-400 hover:text-white px-3 py-1 rounded-lg hover:bg-slate-800 text-sm font-mono transition"
            >
              [ESC / TUTUP]
            </button>
          </div>
        </div>

        {/* Action & Stats Banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-4 text-xs font-mono">
            <div>
              <span className="text-slate-400 block">Total Siswa Terhubung:</span>
              <span className="text-lg font-bold text-white">{students.length} Siswa</span>
            </div>
            <div className="border-l border-slate-800 pl-4">
              <span className="text-slate-400 block">Rata-rata Skor Kelas:</span>
              <span className="text-lg font-bold text-emerald-400">
                {students.length > 0
                  ? Math.round(students.reduce((acc, s) => acc + s.total, 0) / students.length)
                  : 0}{' '}
                / 4000
              </span>
            </div>
          </div>

          <button
            onClick={handleDownloadCsv}
            className="px-4 py-2.5 rounded-xl font-cyber font-bold text-xs text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 shadow-lg shadow-emerald-500/25 transition flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Download className="w-4 h-4" /> [DOWNLOAD CSV] Rekap Nilai Siswa
          </button>
        </div>

        {/* Scores Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-400 font-mono uppercase text-[11px] border-b border-slate-800">
              <tr>
                <th className="p-3">No</th>
                <th className="p-3">Nama Siswa</th>
                <th className="p-3">Kelas</th>
                <th className="p-3 text-center text-emerald-400">Skills (Cek Fakta)</th>
                <th className="p-3 text-center text-purple-400">Culture (Echo Chamber)</th>
                <th className="p-3 text-center text-rose-400">Safety (Privasi)</th>
                <th className="p-3 text-center text-pink-400">Ethics (Anti-Bullying)</th>
                <th className="p-3 text-center text-cyan-300 font-bold">Total Skor</th>
                <th className="p-3">Status Literasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {students.map((student, idx) => {
                let statusLabel = 'Perlu Pendampingan';
                let statusClass = 'text-amber-400 bg-amber-950/40 border-amber-500/30';
                if (student.total >= 3500) {
                  statusLabel = 'Warga Siber Bijak';
                  statusClass = 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30';
                } else if (student.total >= 2000) {
                  statusLabel = 'Agen Mandiri';
                  statusClass = 'text-cyan-400 bg-cyan-950/40 border-cyan-500/30';
                }

                return (
                  <tr key={idx} className="hover:bg-slate-800/40 transition">
                    <td className="p-3 text-slate-500">{idx + 1}</td>
                    <td className="p-3 font-sans font-semibold text-slate-100 flex items-center gap-1.5">
                      {student.name}
                      {student.isHost && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-700">
                          Host
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-slate-300">{student.classGrade}</td>
                    <td className="p-3 text-center text-emerald-300">{student.skills}</td>
                    <td className="p-3 text-center text-purple-300">{student.culture}</td>
                    <td className="p-3 text-center text-rose-300">{student.safety}</td>
                    <td className="p-3 text-center text-pink-300">{student.ethics}</td>
                    <td className="p-3 text-center font-bold text-cyan-300">{student.total}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] border ${statusClass}`}>
                        {statusLabel}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer Note */}
        <p className="text-[11px] font-mono text-slate-400 text-center">
          *Tabel diperbarui secara realtime dari WebSocket server Kota Siber. Cocok diekspor ke format Google Sheets atau Microsoft Excel untuk penilaian rapor P5 / Kurikulum Merdeka Fase F.
        </p>

      </div>
    </div>
  );
};
