import React from 'react';
import { PlusCircle, PlusSquare, Sparkles, Flame, Heart, RefreshCw, Send, Radio } from 'lucide-react';
import { Language } from '../types/game';
import { translations } from '../utils/translations';
import { soundManager } from '../utils/audio';

interface SandboxUIProps {
  language: Language;
  onSpawnPeep: (shape: 'circle' | 'square', special?: 'hat' | 'crazed' | 'couple' | 'armed' | 'peacemaker') => void;
  onBroadcastCustom: (headline: string, sub: string) => void;
  onResetCrowd: () => void;
}

export const SandboxUI: React.FC<SandboxUIProps> = ({
  language,
  onSpawnPeep,
  onBroadcastCustom,
  onResetCrowd,
}) => {
  const t = translations[language];
  const [customHead, setCustomHead] = React.useState('');
  const [customSub, setCustomSub] = React.useState('');

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customHead.trim()) return;
    soundManager.playNewsJingle();
    onBroadcastCustom(customHead.toUpperCase(), customSub);
    setCustomHead('');
    setCustomSub('');
  };

  return (
    <div className="bg-slate-900 border-t border-slate-800 p-4 shadow-2xl z-30 select-none">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left: Quick Spawners */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs font-black uppercase text-slate-400 tracking-wider mr-2 hidden lg:inline">
            {t.sandboxControls}:
          </span>

          {/* Spawn Circle */}
          <button
            onClick={() => {
              soundManager.playPop();
              onSpawnPeep('circle');
            }}
            className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold transition-transform active:scale-95 shadow"
          >
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            <span>Cerchio</span>
          </button>

          {/* Spawn Square */}
          <button
            onClick={() => {
              soundManager.playPop();
              onSpawnPeep('square');
            }}
            className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold transition-transform active:scale-95 shadow"
          >
            <PlusSquare className="w-4 h-4 text-blue-400" />
            <span>Quadrato</span>
          </button>

          {/* Spawn Hat Man */}
          <button
            onClick={() => {
              soundManager.playPop();
              onSpawnPeep('square', 'hat');
            }}
            className="flex items-center space-x-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1.5 rounded-xl text-xs font-bold transition-transform active:scale-95 shadow"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{t.spawnHat}</span>
          </button>

          {/* Spawn Crazed */}
          <button
            onClick={() => {
              soundManager.playShout();
              onSpawnPeep('square', 'crazed');
            }}
            className="flex items-center space-x-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 px-3 py-1.5 rounded-xl text-xs font-bold transition-transform active:scale-95 shadow"
          >
            <Flame className="w-4 h-4 text-red-500 animate-pulse" />
            <span>{t.spawnCrazed}</span>
          </button>

          {/* Spawn Couple */}
          <button
            onClick={() => {
              soundManager.playPop();
              onSpawnPeep('circle', 'couple');
            }}
            className="flex items-center space-x-1.5 bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 border border-pink-500/30 px-3 py-1.5 rounded-xl text-xs font-bold transition-transform active:scale-95 shadow"
          >
            <Heart className="w-4 h-4 text-pink-500 animate-bounce" />
            <span>{t.spawnCouple}</span>
          </button>

          {/* Spawn Armed */}
          <button
            onClick={() => {
              soundManager.playBoom();
              onSpawnPeep('square', 'armed');
            }}
            className="flex items-center space-x-1.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 px-3 py-1.5 rounded-xl text-xs font-bold transition-transform active:scale-95 shadow"
          >
            <Radio className="w-4 h-4 text-purple-400" />
            <span>{t.spawnArmed}</span>
          </button>

          {/* Reset button */}
          <button
            onClick={() => {
              soundManager.playBoom();
              onResetCrowd();
            }}
            title={t.clearCrowd}
            className="p-1.5 bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-700 rounded-xl transition-all"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Custom Breaking News Broadcaster */}
        <form onSubmit={handleBroadcast} className="flex items-center space-x-2 w-full md:w-auto">
          <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 flex-1">
            <input
              type="text"
              placeholder="#TITOLO_VIRALE"
              value={customHead}
              onChange={(e) => setCustomHead(e.target.value)}
              className="bg-slate-950 border border-slate-700 focus:border-amber-500 text-white px-3 py-1.5 rounded-xl text-xs font-mono uppercase focus:outline-none w-full sm:w-40"
            />
            <input
              type="text"
              placeholder="Sottotitolo / Dettagli..."
              value={customSub}
              onChange={(e) => setCustomSub(e.target.value)}
              className="bg-slate-950 border border-slate-700 focus:border-amber-500 text-white px-3 py-1.5 rounded-xl text-xs font-medium focus:outline-none w-full sm:w-48"
            />
          </div>

          <button
            type="submit"
            disabled={!customHead.trim()}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-600 hover:to-red-700 disabled:opacity-40 text-slate-950 font-black px-4 py-1.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md flex-shrink-0 self-stretch sm:self-auto justify-center"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.broadcast}</span>
          </button>
        </form>

      </div>
    </div>
  );
};
