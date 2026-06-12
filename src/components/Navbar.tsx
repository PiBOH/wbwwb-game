import React from 'react';
import { Volume2, VolumeX, Camera, Sliders, Image as ImageIcon, Sparkles } from 'lucide-react';
import { GameMode, Language } from '../types/game';
import { translations } from '../utils/translations';
import { soundManager } from '../utils/audio';

interface NavbarProps {
  mode: GameMode;
  setMode: (mode: GameMode) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  photoCount: number;
  unlockedPeace: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  mode,
  setMode,
  language,
  setLanguage,
  photoCount,
  unlockedPeace,
}) => {
  const t = translations[language];
  const [muted, setMuted] = React.useState(soundManager.isMuted());

  const handleSoundToggle = () => {
    const isMuted = soundManager.toggleMute();
    setMuted(isMuted);
    if (!isMuted) {
      soundManager.playShutter();
    }
  };

  return (
    <header className="bg-slate-900 text-white shadow-lg border-b border-slate-800 sticky top-0 z-40 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Branding */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-red-500 flex items-center justify-center shadow-md animate-pulse">
            <Camera className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-amber-300 bg-clip-text text-transparent">
              {t.title}
            </h1>
            <p className="text-xs text-slate-400 hidden md:block">
              {t.recreatedFor} · <span className="text-amber-400/80 font-mono">v1.0.0h_BETA</span> · by PiBOH
            </p>
          </div>
        </div>

        {/* Middle: Game Modes */}
        <nav className="flex items-center space-x-1 sm:space-x-2 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
          <button
            onClick={() => {
              setMode('story');
              soundManager.playPop();
            }}
            className={`flex items-center space-x-1.5 px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              mode === 'story'
                ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>{t.storyMode}</span>
          </button>

          <button
            onClick={() => {
              setMode('sandbox');
              soundManager.playPop();
            }}
            className={`flex items-center space-x-1.5 px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              mode === 'sandbox'
                ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>{t.sandboxMode}</span>
          </button>

          <button
            onClick={() => {
              setMode('gallery');
              soundManager.playPop();
            }}
            className={`flex items-center space-x-1.5 px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all relative ${
              mode === 'gallery'
                ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span className="hidden sm:inline">{t.galleryMode}</span>
            {photoCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center border border-white">
                {photoCount}
              </span>
            )}
          </button>
        </nav>

        {/* Right: Sound & Language */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Secret Peace badge */}
          {unlockedPeace && (
            <div className="hidden lg:flex items-center space-x-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-2.5 py-1 rounded-lg text-xs animate-bounce font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.secretPeace}</span>
            </div>
          )}

          {/* Sound Toggle */}
          <button
            onClick={handleSoundToggle}
            title={muted ? t.soundOff : t.soundOn}
            className={`p-2 rounded-xl border transition-all ${
              muted 
                ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200' 
                : 'bg-amber-500/20 border-amber-500/40 text-amber-400 hover:bg-amber-500/30'
            }`}
          >
            {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>

          {/* Language Selector */}
          <div className="flex bg-slate-800 p-0.5 rounded-xl border border-slate-700 text-xs font-bold">
            <button
              onClick={() => {
                setLanguage('it');
                soundManager.playPop();
              }}
              className={`px-2.5 py-1.5 rounded-lg transition-all ${
                language === 'it' 
                  ? 'bg-gradient-to-r from-emerald-600 via-white text-slate-900 to-red-600 shadow font-black' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              IT
            </button>
            <button
              onClick={() => {
                setLanguage('en');
                soundManager.playPop();
              }}
              className={`px-2.5 py-1.5 rounded-lg transition-all ${
                language === 'en' 
                  ? 'bg-blue-600 text-white shadow font-black' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              EN
            </button>
          </div>

        </div>

      </div>
    </header>
  );
};
