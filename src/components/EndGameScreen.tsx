import React from 'react';
import { RotateCcw, Image as ImageIcon, Sliders, Flame, ExternalLink, Sparkles } from 'lucide-react';
import { GameMode, Language, Peep } from '../types/game';
import { translations } from '../utils/translations';
import { soundManager } from '../utils/audio';

interface EndGameScreenProps {
  language: Language;
  deceasedPeeps: Peep[];
  onReplay: () => void;
  onSetMode: (mode: GameMode) => void;
}

export const EndGameScreen: React.FC<EndGameScreenProps> = ({
  language,
  deceasedPeeps,
  onReplay,
  onSetMode,
}) => {
  const t = translations[language];

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl animate-fade-in select-none">
      <div className="max-w-3xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl flex flex-col items-center text-center animate-scale-up relative overflow-hidden max-h-[90vh] overflow-y-auto">
        
        {/* Glow Effects */}
        <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none bg-red-600" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none bg-blue-600" />

        {/* Icon / Epilogue Header */}
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center shadow-xl mb-4 border bg-red-950/40 text-red-500 border-red-500/40">
          <Flame className="w-10 h-10 animate-pulse" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 text-white">
          #DiventiamoCiòCheGuardiamo
        </h2>
        
        <p className="text-xs sm:text-sm text-slate-400 max-w-lg mb-6 leading-relaxed">
          {language === 'it' 
            ? "Restano solo la coppia e i grilli, seduti davanti alla TV."
            : "Only the couple and the crickets remain, sitting in front of the TV."
          }
        </p>

        {/* Memorial TV & Candele Scene Container (Post-credits) */}
        <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl w-full mb-8 shadow-inner relative">
          <h3 className="text-xs font-mono uppercase tracking-wider text-amber-400 mb-4 flex items-center justify-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{language === 'it' ? 'Epilogo' : 'Epilogue'}</span>
          </h3>

          <div className="flex flex-col items-center justify-center py-4 space-y-6">
            
            {/* The TV Screen representing the past events */}
            <div className="w-48 h-32 bg-slate-900 border-4 border-slate-700 rounded-2xl flex flex-col items-center justify-center shadow-lg relative overflow-hidden">
              <span className="text-xs font-bold text-red-500 font-mono tracking-tight animate-pulse">#TuttiOdianoTutti</span>
              <div className="absolute bottom-1 w-20 h-1 bg-red-500/40 rounded" />
            </div>

            {/* The Couple sitting in front & The 3 Crickets */}
            <div className="flex items-end justify-center space-x-6">
              
              {/* Cricket 1 */}
              <div className="flex flex-col items-center">
                <span className="text-xs mb-1 font-bold text-emerald-400">Cri</span>
                <div className="w-4 h-3 bg-emerald-700 rounded-full" />
              </div>

              {/* Circle Partner */}
              <div className="flex flex-col items-center">
                <span className="text-xs mb-1 font-bold text-pink-400">❤️</span>
                <div className="w-8 h-8 rounded-full bg-white border-2 border-slate-300 shadow-md" />
              </div>

              {/* Square Partner */}
              <div className="flex flex-col items-center">
                <span className="text-xs mb-1 font-bold text-blue-400">❤️</span>
                <div className="w-8 h-8 rounded-lg bg-white border-2 border-slate-300 shadow-md" />
              </div>

              {/* Crickets 2 & 3 */}
              <div className="flex items-end space-x-2">
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-emerald-400">Cri</span>
                  <div className="w-3.5 h-2.5 bg-emerald-700 rounded-full" />
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-emerald-400">Cri</span>
                  <div className="w-3 h-2 bg-emerald-700 rounded-full" />
                </div>
              </div>

            </div>

            {/* Memorial Lit Candles Grid for the Fallen Shapes */}
            <div className="pt-4 border-t border-slate-800/80 w-full flex flex-wrap items-center justify-center gap-3">
              <span className="text-xs text-slate-400 w-full mb-1 font-mono">{language === 'it' ? 'Candele accese per i caduti' : 'Candles lit for the deceased'} ({deceasedPeeps.length})</span>
              {deceasedPeeps.map(peep => (
                <div key={peep.id} className="flex items-center space-x-1 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                  <span className="text-xs">{peep.shape === 'circle' ? '⚪' : '⏹️'}</span>
                  <span className="text-sm animate-pulse">🕯️</span>
                </div>
              ))}
              {deceasedPeeps.length === 0 && (
                <span className="text-xs text-slate-500 italic">🕯️ 🕯️ 🕯️ In memoria delle vittime della follia mediatica...</span>
              )}
            </div>

          </div>
        </div>

        {/* Citazioni finali */}
        <div className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-xl w-full mb-6 text-left space-y-2">
          <p className="text-xs sm:text-sm text-slate-300 italic">
            "{t.story.finalMessage1}"
          </p>
          <p className="text-xs sm:text-sm text-slate-400 italic">
            "{t.story.finalMessage2}"
          </p>
        </div>

        {/* Buttons Action */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mb-6">
          
          {/* Replay */}
          <button
            onClick={() => {
              soundManager.playPop();
              onReplay();
            }}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black px-5 py-3.5 rounded-2xl shadow-lg transition-transform active:scale-95 text-xs sm:text-sm uppercase tracking-wider"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t.replay}</span>
          </button>

          {/* View Gallery */}
          <button
            onClick={() => {
              soundManager.playPop();
              onSetMode('gallery');
            }}
            className="flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold px-5 py-3.5 rounded-2xl shadow transition-transform active:scale-95 text-xs sm:text-sm"
          >
            <ImageIcon className="w-4 h-4 text-amber-400" />
            <span>{t.galleryMode}</span>
          </button>

          {/* Sandbox Mode */}
          <button
            onClick={() => {
              soundManager.playPop();
              onSetMode('sandbox');
            }}
            className="flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold px-5 py-3.5 rounded-2xl shadow transition-transform active:scale-95 text-xs sm:text-sm"
          >
            <Sliders className="w-4 h-4 text-blue-400" />
            <span>{t.sandboxMode}</span>
          </button>

        </div>

        {/* Credits */}
        <div className="pt-4 border-t border-slate-800/80 w-full flex items-center justify-center text-xs text-slate-500">
          <a
            href="https://github.com/ncase"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-amber-400 transition-colors flex items-center space-x-1 underline"
          >
            <span>Gioco originale di Nicky Case (2016)</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

      </div>
    </div>
  );
};
