import React, { useState, useEffect } from 'react';
import { Sparkles, AlertTriangle } from 'lucide-react';
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

    setVisible(true);
    setIsLeaving(false);

    const leaveTimer = setTimeout(() => {
      setIsLeaving(true);
    }, 3200);

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
    <div className={`absolute bottom-3 right-3 z-30 pointer-events-none select-none transition-all ${
      isLeaving ? 'animate-slide-out-right' : 'animate-slide-in-right'
    }`}>
      <div className={`overflow-hidden rounded-xl shadow-xl border-2 transition-all duration-300 relative w-fit max-w-[min(90vw,28rem)] ${
        isPeace 
          ? 'bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 border-yellow-300 text-white' 
          : isBoring
          ? 'bg-slate-800/95 border-slate-600 text-slate-300'
          : 'bg-gradient-to-r from-red-700 via-red-800 to-slate-900 border-red-500 text-white'
      }`}>
        
        {/* Top Ticker Bar */}
        <div className={`px-2.5 py-0.5 flex items-center justify-between text-[10px] font-bold tracking-wider uppercase gap-3 ${
          isPeace ? 'bg-black/30 text-yellow-300' : isBoring ? 'bg-slate-900 text-slate-400' : 'bg-black/60 text-red-400'
        }`}>
          <div className="flex items-center space-x-1.5">
            {isPeace ? <Sparkles className="w-3 h-3 animate-spin text-yellow-300" /> : <AlertTriangle className="w-3 h-3 animate-bounce" />}
            <span>{isPeace ? 'Edizione speciale' : isBoring ? 'Notizia minore' : 'Breaking news'}</span>
          </div>
          <span className="opacity-60">WBWWB</span>
        </div>

        {/* Content Bar */}
        <div className="px-2.5 py-2 flex items-center gap-2.5">
          
          {/* Captured Thumbnail Snippet */}
          <div className="w-12 h-12 rounded-md overflow-hidden border border-white/40 flex-shrink-0 bg-slate-950">
            <img 
              src={latestPhoto.imageData} 
              alt="Snap" 
              className="w-full h-full object-cover" 
            />
          </div>

          {/* Headline and Subheadline (Auto-width) */}
          <div className="min-w-0 flex-shrink">
            <h2 className={`text-sm font-bold tracking-tight whitespace-nowrap ${
              isPeace ? 'text-yellow-200' : isBoring ? 'text-slate-300' : 'text-white'
            }`}>
              {latestPhoto.headline}
            </h2>
            <p className={`text-[11px] mt-0.5 leading-tight whitespace-nowrap overflow-hidden text-ellipsis ${
              isPeace ? 'text-pink-100' : isBoring ? 'text-slate-400' : 'text-red-100'
            }`}>
              {latestPhoto.subheadline}
            </p>
          </div>

        </div>

        {/* Visual Countdown Timer Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black/40 overflow-hidden">
          <div 
            className={`h-full transition-all duration-[3200ms] ease-linear ${
              isPeace ? 'bg-yellow-300' : isBoring ? 'bg-slate-400' : 'bg-white'
            }`} 
            style={{ width: isLeaving ? '0%' : '100%' }}
          />
        </div>

      </div>
    </div>
  );
};
