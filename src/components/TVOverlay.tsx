import React, { useState, useEffect } from 'react';
import { Sparkles, Tv, AlertTriangle } from 'lucide-react';
import { CapturedPhoto, Language } from '../types/game';
import { translations } from '../utils/translations';

interface TVOverlayProps {
  latestPhoto: CapturedPhoto | null;
  language: Language;
}

export const TVOverlay: React.FC<TVOverlayProps> = ({ latestPhoto, language }) => {
  const t = translations[language];
  const [visible, setVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    if (!latestPhoto) {
      setVisible(false);
      setIsLeaving(false);
      return;
    }

    // Nuova foto scattata o aggiornata
    setVisible(true);
    setIsLeaving(false);

    // Timer per iniziare l'animazione di scomparsa dopo 3.2 secondi
    const leaveTimer = setTimeout(() => {
      setIsLeaving(true);
    }, 3200);

    // Timer per rimuovere completamente il componente dopo che l'animazione è conclusa
    const hideTimer = setTimeout(() => {
      setVisible(false);
    }, 3500);

    return () => {
      clearTimeout(leaveTimer);
      clearTimeout(hideTimer);
    };
  }, [latestPhoto?.id]);

  if (!latestPhoto || !visible) return null;

  const isPeace = latestPhoto.headline === t.story.peaceIsBoringHeadline;
  const isBoring = latestPhoto.headline === t.story.boringHeadline || latestPhoto.headline === t.story.cricketHeadline;

  return (
    <div className={`absolute bottom-4 right-4 z-30 max-w-md w-[92%] sm:w-[26rem] pointer-events-none select-none transition-all ${
      isLeaving ? 'animate-slide-out-right' : 'animate-slide-in-right'
    }`}>
      <div className={`overflow-hidden rounded-2xl shadow-2xl border-4 transition-all duration-300 relative ${
        isPeace 
          ? 'bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 border-yellow-300 text-white shadow-pink-500/50' 
          : isBoring
          ? 'bg-slate-800/95 border-slate-600 text-slate-300 shadow-slate-900/50'
          : 'bg-gradient-to-r from-red-700 via-red-800 to-slate-900 border-red-500 text-white shadow-red-900/80'
      }`}>
        
        {/* Top Ticker Bar */}
        <div className={`px-4 py-1.5 flex items-center justify-between text-xs font-black tracking-widest uppercase ${
          isPeace ? 'bg-black/30 text-yellow-300' : isBoring ? 'bg-slate-900 text-slate-400' : 'bg-black/60 text-red-400'
        }`}>
          <div className="flex items-center space-x-2">
            {isPeace ? <Sparkles className="w-4 h-4 animate-spin text-yellow-300" /> : <AlertTriangle className="w-4 h-4 animate-bounce" />}
            <span>{isPeace ? 'EDIZIONE STRAORDINARIA' : isBoring ? 'NOTIZIA SECONDARIA' : 'BREAKING NEWS'}</span>
          </div>
          <div className="flex items-center space-x-1.5 opacity-80">
            <Tv className="w-3.5 h-3.5" />
            <span>WBWWB TELEVISION</span>
          </div>
        </div>

        {/* Content Bar */}
        <div className="p-4 sm:p-5 flex items-center space-x-4 backdrop-blur-sm">
          
          {/* Captured Thumbnail Snippet */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border-2 border-white/60 shadow-inner flex-shrink-0 bg-slate-950">
            <img 
              src={latestPhoto.imageData} 
              alt="Snap" 
              className="w-full h-full object-cover animate-pulse" 
            />
          </div>

          {/* Headline and Subheadline */}
          <div className="flex-1 min-w-0">
            <h2 className={`text-xl sm:text-2xl font-black tracking-tight truncate ${
              isPeace ? 'text-yellow-200' : isBoring ? 'text-slate-300' : 'text-white'
            }`}>
              {latestPhoto.headline}
            </h2>
            <p className={`text-xs sm:text-sm font-semibold mt-1 leading-snug ${
              isPeace ? 'text-pink-100 font-bold' : isBoring ? 'text-slate-400' : 'text-red-100'
            }`}>
              {latestPhoto.subheadline}
            </p>
          </div>

        </div>

        {/* Visual Countdown Timer Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/40 overflow-hidden">
          <div 
            className={`h-full transition-all duration-[3200ms] ease-linear w-0 ${
              isPeace ? 'bg-yellow-300' : isBoring ? 'bg-slate-400' : 'bg-white'
            }`} 
            style={{ width: isLeaving ? '0%' : '100%' }}
          />
        </div>

      </div>
    </div>
  );
};
