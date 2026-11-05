import React, { useState, useEffect } from 'react';
import { MessageSquare, ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react';
import { sound } from '../../game/audio';
import { NPCData } from '../../game/types';

interface Props {
  npc: NPCData | null;
  isOpen: boolean;
  isMissionCompleted: boolean;
  onClose: () => void;
  onAction: () => void;
}

export const DialogModal: React.FC<Props> = ({
  npc,
  isOpen,
  isMissionCompleted,
  onClose,
  onAction,
}) => {
  const [lineIndex, setLineIndex] = useState(0);
  const [isStardewTheme, setIsStardewTheme] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLineIndex(0);
      sound.playCozyClick();
    }
  }, [isOpen, npc]);

  if (!isOpen || !npc) return null;

  const dialogueLines = isMissionCompleted ? npc.dialogueCompleted : npc.dialogueIntro;
  const currentLine = dialogueLines[lineIndex] || '';
  const isLastLine = lineIndex >= dialogueLines.length - 1;

  const handleNext = () => {
    if (!isLastLine) {
      sound.playCozyClick();
      setLineIndex(prev => prev + 1);
    } else {
      if (!isMissionCompleted && npc.associatedMission !== 'intro') {
        onAction();
      } else {
        sound.playCozyClick();
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-x-0 bottom-6 z-50 flex justify-center px-4 animate-in slide-in-from-bottom-6 duration-200 pointer-events-auto">
      <div
        className={`w-full max-w-2xl rounded-2xl p-5 flex flex-col gap-3 backdrop-blur-md transition-all ${
          isStardewTheme
            ? 'stardew-box font-pixel shadow-2xl'
            : 'bg-slate-950/95 border-2 border-cyan-500/80 shadow-2xl shadow-cyan-500/30 text-slate-100 font-sans'
        }`}
      >
        {/* Speaker Name Bar */}
        <div
          className={`flex items-center justify-between pb-2 border-b ${
            isStardewTheme ? 'border-[#8b4513]/40' : 'border-cyan-800/50'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm shadow ${
                isStardewTheme ? 'border-2 border-[#8b4513]' : 'border border-white/20'
              }`}
              style={{ backgroundColor: npc.avatarColor }}
            >
              {npc.name.charAt(0)}
            </div>
            <div>
              <h3
                className={`font-bold text-base leading-tight ${
                  isStardewTheme ? 'text-[#5c2c0e] font-pixel' : 'font-cyber text-cyan-300 text-sm'
                }`}
              >
                {npc.name}
              </h3>
              <p
                className={`text-xs ${
                  isStardewTheme ? 'text-[#78350f] font-sans' : 'font-mono text-cyan-400/80 text-[11px]'
                }`}
              >
                {npc.title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => { sound.playCozyClick(); setIsStardewTheme(!isStardewTheme); }}
              className={`text-[10px] px-2 py-0.5 rounded cursor-pointer transition ${
                isStardewTheme
                  ? 'bg-[#faedcd] border border-[#8b4513] text-[#78350f]'
                  : 'bg-slate-900 border border-slate-700 text-cyan-300'
              }`}
              title="Ganti Tema Dialog"
            >
              {isStardewTheme ? '🌾 Tema Stardew' : '⚡ Tema Cyber'}
            </button>
            <span
              className={`text-[10px] px-2 py-0.5 rounded border ${
                isStardewTheme
                  ? 'bg-[#faedcd] border-[#d4a373] text-[#78350f]'
                  : 'font-mono text-slate-400 bg-slate-900 border-slate-800'
              }`}
            >
              Halaman {lineIndex + 1}/{dialogueLines.length} · [ENTER]
            </span>
          </div>
        </div>

        {/* Dialogue Content */}
        <div
          className={`min-h-16 py-1 leading-relaxed text-sm md:text-base ${
            isStardewTheme ? 'text-[#451a03] font-pixel' : 'text-slate-200 font-sans'
          }`}
        >
          {currentLine}
        </div>

        {/* Action Row */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => { sound.playCozyClick(); onClose(); }}
            className={`text-xs px-2.5 py-1 rounded transition cursor-pointer ${
              isStardewTheme
                ? 'text-[#78350f] hover:text-[#451a03] hover:bg-[#faedcd]'
                : 'font-mono text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            Lewati Dialog [ESC]
          </button>

          <button
            onClick={handleNext}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs md:text-sm shadow-md transition flex items-center gap-2 cursor-pointer active:scale-95 ${
              isStardewTheme
                ? 'bg-[#8b4513] hover:bg-[#70360d] text-amber-100 font-pixel'
                : 'font-cyber text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 shadow-cyan-500/25'
            }`}
          >
            {!isLastLine ? (
              <>Lanjutkan <ChevronRight className="w-4 h-4" /></>
            ) : !isMissionCompleted && npc.associatedMission !== 'intro' ? (
              <>{npc.dialogueActionText} <ArrowRight className="w-4 h-4" /></>
            ) : (
              <>Tutup Dialog <CheckCircle2 className="w-4 h-4" /></>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
