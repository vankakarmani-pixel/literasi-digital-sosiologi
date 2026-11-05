import React from 'react';
import { sound } from '../../game/audio';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectEmote: (emote: string) => void;
}

const EMOTE_OPTIONS = [
  { emoji: '🔍', label: 'Cek Fakta' },
  { emoji: '🛡️', label: 'Etika Digital' },
  { emoji: '🔒', label: 'Jaga Privasi' },
  { emoji: '💡', label: 'Ide Kritis' },
  { emoji: '👍', label: 'Sepakat' },
  { emoji: '❤️', label: 'Solidaritas' },
  { emoji: '🚨', label: 'Awas Hoaks!' },
  { emoji: '🤝', label: 'Toleransi' },
];

export const EmoteWheel: React.FC<Props> = ({ isOpen, onClose, onSelectEmote }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 left-20 z-40 p-2.5 rounded-2xl bg-slate-950/95 border-2 border-cyan-500/70 shadow-2xl backdrop-blur-md animate-in zoom-in-95 duration-150">
      <div className="grid grid-cols-4 gap-2">
        {EMOTE_OPTIONS.map((e) => (
          <button
            key={e.label}
            onClick={() => {
              sound.playBlip(800);
              onSelectEmote(e.emoji);
              onClose();
            }}
            className="w-12 h-12 rounded-xl bg-slate-900 hover:bg-cyan-950 border border-slate-700 hover:border-cyan-400 flex flex-col items-center justify-center gap-0.5 transition hover:scale-110 active:scale-95 cursor-pointer"
            title={e.label}
          >
            <span className="text-xl">{e.emoji}</span>
            <span className="text-[8px] font-mono text-slate-400 leading-none">{e.label.split(' ')[0]}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
