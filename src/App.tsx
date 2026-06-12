import { useState, useCallback } from 'react';
import { GameMode, Language, StoryPhase, CapturedPhoto, Peep } from './types/game';
import { translations } from './utils/translations';
import { soundManager } from './utils/audio';
import { Navbar } from './components/Navbar';
import { GameCanvas } from './components/GameCanvas';
import { TVOverlay } from './components/TVOverlay';
import { GalleryModal } from './components/GalleryModal';
import { SandboxUI } from './components/SandboxUI';
import { EndGameScreen } from './components/EndGameScreen';
import { Sparkles, HelpCircle, BookOpen, Heart, Code2 } from 'lucide-react';

export function App() {
  const [mode, setMode] = useState<GameMode>('story');
  const [language, setLanguage] = useState<Language>('it');
  const [phase, setPhase] = useState<StoryPhase>('INTRO');
  const [photos, setPhotos] = useState<CapturedPhoto[]>([]);
  const [latestPhoto, setLatestPhoto] = useState<CapturedPhoto | null>(null);
  const [showGuide, setShowGuide] = useState<boolean>(false);
  const [deceasedPeeps, setDeceasedPeeps] = useState<Peep[]>([]);

  // Sandbox trigger states
  const [sandboxSpawnTrigger, setSandboxSpawnTrigger] = useState<{
    shape: 'circle' | 'square',
    special?: 'hat' | 'crazed' | 'couple' | 'armed',
    id: number
  } | null>(null);
  const [sandboxCrowdReset, setSandboxCrowdReset] = useState<number>(0);

  const t = translations[language];

  // Handle Photo Taken
  const handlePhotoTaken = useCallback((photo: CapturedPhoto) => {
    setPhotos(prev => [photo, ...prev]);
    setLatestPhoto(photo);
  }, []);

  // Handle Phase Change
  const handlePhaseChange = useCallback((newPhase: StoryPhase) => {
    setPhase(newPhase);
  }, []);

  // Handle Massacre Complete -> transition to epilogue
  const handleMassacreEnd = useCallback((fallen: Peep[]) => {
    setDeceasedPeeps(fallen);
    setPhase('EPILOGUE');
  }, []);

  // Handle Replay / Reset
  const handleReplay = useCallback(() => {
    setPhase('INTRO');
    setLatestPhoto(null);
    setDeceasedPeeps([]);
    setSandboxCrowdReset(Date.now());
    setMode('story');
  }, []);

  // Sandbox spawners
  const handleSpawnPeep = useCallback((shape: 'circle' | 'square', special?: 'hat' | 'crazed' | 'couple' | 'armed') => {
    setSandboxSpawnTrigger({ shape, special, id: Date.now() });
  }, []);

  const handleBroadcastCustom = useCallback((headline: string, sub: string) => {
    const customPhoto: CapturedPhoto = {
      id: 'custom_' + Date.now(),
      timestamp: Date.now(),
      headline,
      subheadline: sub,
      phase: phase,
      imageData: latestPhoto?.imageData || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=300&q=80',
      isImportant: true,
      tags: ['CUSTOM'],
    };
    setLatestPhoto(customPhoto);
    setPhotos(prev => [customPhoto, ...prev]);
  }, [latestPhoto, phase]);

  const handleResetCrowd = useCallback(() => {
    setSandboxCrowdReset(Date.now());
    setLatestPhoto(null);
  }, []);

  const handleClearGallery = useCallback(() => {
    setPhotos([]);
    setLatestPhoto(null);
  }, []);

  const isEnding = phase === 'EPILOGUE';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-amber-500 selection:text-slate-950">
      
      {/* 1. Navbar Overlay */}
      <Navbar
        mode={mode}
        setMode={setMode}
        language={language}
        setLanguage={setLanguage}
        photoCount={photos.length}
        unlockedPeace={false}
      />

      {/* 2. Main Game Container */}
      <main className="flex-1 flex flex-col max-w-7xl w-full mx-auto p-3 sm:p-6 lg:p-8 relative justify-center">
        
        {/* Instructions / Progress Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-4 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3 select-none">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white">
                {mode === 'story' ? t.story.instruction : mode === 'sandbox' ? "Modalità Creativa (Sandbox)" : t.galleryMode}
              </h3>
              <p className="text-xs text-slate-400">
                {mode === 'story' ? t.story.subInstruction : mode === 'sandbox' ? "Sperimenta con la folla e diffondi le tue notizie" : "Tutte le notizie che hai immortalato."}
              </p>
            </div>
          </div>

          {/* Toggle Guide button */}
          <button
            onClick={() => {
              soundManager.playPop();
              setShowGuide(!showGuide);
            }}
            className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border border-slate-700 self-stretch sm:self-auto justify-center"
          >
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span>{showGuide ? (language === 'it' ? 'Nascondi Guida' : 'Hide Guide') : (language === 'it' ? 'Come finire il gioco?' : 'Walkthrough Guide')}</span>
          </button>
        </div>

        {/* Walkthrough Guide Panel */}
        {showGuide && (
          <div className="bg-slate-900/95 border-2 border-red-500/40 rounded-2xl p-6 mb-6 shadow-xl space-y-4 animate-fade-in text-xs sm:text-sm text-slate-300 select-none">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="font-extrabold text-base text-red-400 flex items-center space-x-2">
                <Sparkles className="w-5 h-5" />
                <span>{language === 'it' ? 'Guida per il finale corretto 100%' : 'Exact Final Walkthrough'}</span>
              </h4>
            </div>
            <p className="leading-relaxed">
              {language === 'it' ? (
                <>
                  In <strong>We Become What We Behold</strong> segui la discesa inarrestabile della società nel caos. Cerca di inquadrare questi eventi esatti in sequenza:
                  <br /><br />
                  <span className="text-white font-bold">1. La Moda (#CHE_BEL_CAPPELLO):</span> Inquadra l'Uomo con il cappello per lanciare la moda. Poi inquadra di nuovo qualcuno con il cappello per uccidere la moda (#CAPPELLI_FUORI_MODA).
                  <br />
                  <span className="text-white font-bold">2. L'Amore Noioso (#LA_PACE_E_NOIOSA):</span> Se inquadri i piccioncini che si abbracciano o regalano il cappello, la TV ti ricorderà che la pace non fa notizia. La violenza diventa virale!
                  <br />
                  <span className="text-white font-bold">3. La Scintilla (#QUADRATO_FOLLE_ATTACCA):</span> Trova il Quadrato con i capelli a punta e gli occhi folli. Fotografalo esattamente mentre urla contro un Cerchio.
                  <br />
                  <span className="text-white font-bold">4. L'Escalation:</span> Fotografa un Cerchio terrorizzato (#I_CERCHI_TEMONO_I_QUADRATI) e poi un Quadrato che gli volta le spalle indispettito (#I_QUADRATI_DISPREZZANO_I_CERCHI).
                  <br />
                  <span className="text-white font-bold">5. Il Climax Sanguinoso (#UOMO_CON_CAPPELLO_SPARA):</span> Fotografa l'odio generale fino a quando l'elegante Cerchio estrarrà una pistola per eliminare il Quadrato folle.
                  <br />
                  <span className="text-white font-bold">6. Il Massacro Finale:</span> Continua a fotografare fino a che lo schermo mostrerà il brutale scontro finale. Alla fine, si aprirà l'epilogo con la <em>Coppia e i Grilli</em> in lutto davanti alla TV in memoria dei caduti.
                </>
              ) : (
                <>
                  In <strong>We Become What We Behold</strong>, you capture the tragic spiral of society. Capture these events exactly:
                  <br /><br />
                  <span className="text-white font-bold">1. The Fad (#OOH_NICE_HAT):</span> Snap the Hat Man to start a trend. Snap a hat wearer again to kill it (#HATS_ARE_OVER).
                  <br />
                  <span className="text-white font-bold">2. Peace is Boring (#PEACE_IS_BORING):</span> Snap The Couple getting along. The news will tell you "Who tunes in to watch people get along? Peace is boring, violence goes viral."
                  <br />
                  <span className="text-white font-bold">3. The Spark (#CRAZED_SQUARE_ATTACKS):</span> Find the unhinged spiky-haired Square and snap him screaming at a Circle.
                  <br />
                  <span className="text-white font-bold">4. Total Escalation:</span> Snap a terrified Circle (#CIRCLES_FEAR_SQUARES), then an insulted Square snubbing a Circle (#SQUARES_SNUB_CIRCLES).
                  <br />
                  <span className="text-white font-bold">5. The Climax (#FANCY_GUY_SHOOTS):</span> Snap general mutual hate until the dapper Circle whips out a gun and shoots the crazed Square.
                  <br />
                  <span className="text-white font-bold">6. Absolute Bloodshed:</span> Keep capturing the final mass riot until the screen dims into the epilogue, showing The Couple mourning at a candlelit memorial.
                </>
              )}
            </p>
          </div>
        )}

        {/* Core Arena View */}
        <div className="relative flex-1 flex items-center justify-center">
          <GameCanvas
            phase={phase}
            mode={mode}
            language={language}
            sandboxSpawnTrigger={sandboxSpawnTrigger}
            sandboxCrowdReset={sandboxCrowdReset}
            onPhotoTaken={handlePhotoTaken}
            onPhaseChange={handlePhaseChange}
            onMassacreEnd={handleMassacreEnd}
          />

          {/* Live Breaking News Ticker Popup */}
          <TVOverlay
            latestPhoto={latestPhoto}
            language={language}
          />

          {/* Cinematic Exact End Game Epilogue Screen */}
          {isEnding && (
            <EndGameScreen
              language={language}
              deceasedPeeps={deceasedPeeps}
              onReplay={handleReplay}
              onSetMode={setMode}
            />
          )}
        </div>

      </main>

      {/* 3. Sandbox UI Panel */}
      {mode === 'sandbox' && (
        <SandboxUI
          language={language}
          onSpawnPeep={(shape, special) => handleSpawnPeep(shape, special as 'hat' | 'crazed' | 'couple' | 'armed')}
          onBroadcastCustom={handleBroadcastCustom}
          onResetCrowd={handleResetCrowd}
        />
      )}

      {/* 4. Gallery Photo Archive Modal */}
      {mode === 'gallery' && (
        <GalleryModal
          photos={photos}
          language={language}
          onClose={() => setMode('story')}
          onClearGallery={handleClearGallery}
        />
      )}

      {/* 5. Responsive Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-500 py-6 px-4 text-xs select-none">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <p className="font-bold text-slate-300">
              {t.title} <span className="font-normal text-slate-500">- {t.subtitle}</span>
            </p>
            <p className="mt-1">
              Ricreato in React, Vite e Tailwind CSS per il web e GitHub Pages.
            </p>
          </div>

          <div className="flex items-center space-x-6">
            <a
              href="https://github.com/ncase/wbwwb"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 hover:text-white transition-colors"
            >
              <Code2 className="w-4 h-4" />
              <span>GitHub Originale</span>
            </a>
            <div className="flex items-center space-x-1 text-red-500">
              <span>Peace is Boring. Violence goes Viral.</span>
              <Heart className="w-3.5 h-3.5 fill-current" />
            </div>
          </div>
        </div>

        {/* Versione, Autore & Licenza */}
        <div className="max-w-7xl mx-auto mt-4 pt-4 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left text-[11px] text-slate-600">
          <div className="flex items-center space-x-2">
            <span className="bg-slate-800 text-amber-400 font-mono font-bold px-2 py-0.5 rounded-md border border-slate-700">
              v1.0.0g_BETA
            </span>
            <span>
              Autore:{' '}
              <a
                href="https://piboh.github.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-amber-400 underline font-semibold transition-colors"
              >
                PiBOH
              </a>
            </span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span>Licenza repository:</span>
            <a
              href="https://unlicense.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-amber-400 underline font-semibold transition-colors"
            >
              Unlicense
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
