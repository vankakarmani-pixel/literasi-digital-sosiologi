import React, { useState } from 'react';
import { Send, MessageSquare, X } from 'lucide-react';
import { sound } from '../../game/audio';
import { ChatMessage } from '../../game/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  currentUserId: string;
}

export const ChatDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  messages,
  onSendMessage,
  currentUserId,
}) => {
  const [inputText, setInputText] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sound.playBlip(700);
    onSendMessage(inputText.trim());
    setInputText('');
  };

  return (
    <div className="fixed bottom-20 left-4 z-40 w-80 max-w-[calc(100vw-2rem)] bg-slate-950/95 border-2 border-cyan-500/70 rounded-2xl shadow-2xl shadow-cyan-500/20 text-slate-100 flex flex-col h-72 backdrop-blur-md animate-in slide-in-from-bottom-4">
      {/* Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-cyan-900/60">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-300">
          <MessageSquare className="w-4 h-4 text-cyan-400" />
          OBROLAN RUANG KELAS
        </div>
        <button
          onClick={() => { sound.playBlip(); onClose(); }}
          className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 text-xs font-sans">
        {messages.length === 0 ? (
          <div className="text-slate-500 text-center py-8 font-mono text-[11px]">
            Belum ada pesan. Sapa teman sekelasmu!
          </div>
        ) : (
          messages.map((m) => {
            const isMe = m.senderId === currentUserId;
            return (
              <div
                key={m.id}
                className={`p-2 rounded-xl max-w-[85%] text-xs leading-relaxed ${
                  isMe
                    ? 'ml-auto bg-cyan-950 border border-cyan-500/40 text-cyan-100'
                    : 'bg-slate-900 border border-slate-800 text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-0.5 text-[10px] font-mono text-slate-400">
                  <span className="font-bold text-cyan-300">{m.senderName}</span>
                  {m.emote && <span className="text-sm">{m.emote}</span>}
                </div>
                <p className="break-words">{m.text}</p>
              </div>
            );
          })
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-2 border-t border-slate-800 flex gap-2">
        <input
          type="text"
          value={inputText}
          maxLength={120}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ketik pesan santun..."
          className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition disabled:opacity-40 cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
