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
import { Sparkles, HelpCircle, Code2 } from 'lucide-react';

export function App() {
  const [mode, setMode] = useState<GameMode>('story');
  const [language, setLanguage] = useState<Language>('it');
  const [phase, setPhase] = useState<StoryPhase>('INTRO');
  const [photos, setPhotos] = useState<CapturedPhoto[]>([]);
  const [latestPhoto, setLatestPhoto] = useState<CapturedPhoto | null>(null);
  const [showGuide, setShowGuide] = useState<boolean>(false);
  const [deceasedPeeps, setDeceasedPeeps] = useState<Peep[]>([]);

  const [sandboxSpawnTrigger, setSandboxSpawnTrigger] = useState<{
    shape: 'circle' | 'square',
    special?: 'hat' | 'crazed' | 'couple' | 'armed',
    id: number
  } | null>(null);
  const [sandboxCrowdReset, setSandboxCrowdReset] = useState<number>(0);

  const t = translations[language];

  const handlePhotoTaken = useCallback((photo: CapturedPhoto) => {
    setPhotos(prev => [photo, ...prev]);
    setLatestPhoto(photo);
  }, []);

  const handlePhaseChange = useCallback((newPhase: StoryPhase) => {
    setPhase(newPhase);
  }, []);

  const handleMassacreEnd = useCallback((fallen: Peep[]) => {
    setDeceasedPeeps(fallen);
    setPhase('EPILOGUE');
  }, []);

  const handleReplay = useCallback(() => {
    setPhase('INTRO');
    setLatestPhoto(null);
    setDeceasedPeeps([]);
    setSandboxCrowdReset(Date.now());
    setMode('story');
  }, []);

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
      imageData: latestPhoto?.imageData || 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciLz4=',
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
      
      <Navbar
        mode={mode}
        setMode={setMode}
        language={language}
        setLanguage={setLanguage}
        photoCount={photos.length}
        unlockedPeace={false}
      />

      <main className="flex-1 flex flex-col max-w-7xl w-full mx-auto p-3 sm:p-6 lg:p-8 relative justify-center">
        
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-4 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3 select-none">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white">
                {mode === 'story' ? t.story.instruction : mode === 'sandbox' ? "Sandbox" : t.galleryMode}
              </h3>
              <p className="text-xs text-slate-400">
                {mode === 'story' ? t.story.subInstruction : mode === 'sandbox' ? "Aggiungi personaggi e crea notizie" : "Le foto scattate."}
              </p>
            </div>
          </div>

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
                  <strong>We Become What We Behold</strong> segui la discesa inarrestabile della società nel caos. Inquadra questi eventi in sequenza:
                  <br /><br />
                  <span className="text-white font-bold">1. La Moda (#CheBelCappello):</span> Inquadra l'Uomo con il cappello per lanciare la moda, poi di nuovo un cappello per ucciderla (#CappelliFuoriModa).
                  <br />
                  <span className="text-white font-bold">2. L'Amore Noioso (#LaPaceÈNoiosa):</span> Inquadra i piccioncini per vedere che la pace non fa notizia.
                  <br />
                  <span className="text-white font-bold">3. La Scintilla (#QuadratoFolleAttacca):</span> Fotografa il Quadrato con i capelli a punta mentre urla contro un Cerchio.
                  <br />
                  <span className="text-white font-bold">4. L'Escalation:</span> Fotografa un Cerchio terrorizzato e poi un Quadrato che gli volta le spalle.
                  <br />
                  <span className="text-white font-bold">5. Il Climax (#UomoConCappelloSpara):</span> Continua a fotografare fino alla pistola.
                  <br />
                  <span className="text-white font-bold">6. Il Massacro:</span> Lo scontro finale porta al memoriale con la Coppia e i Grilli in lutto.
                </>
              ) : (
                <>
                  In <strong>We Become What We Behold</strong> capture these events to reach the true ending:
                  <br /><br />
                  <span className="text-white font-bold">1. The Fad (#OohNiceHat):</span> Snap the Hat Man, then snap a hat again to kill the trend (#HatsAreOver).
                  <br />
                  <span className="text-white font-bold">2. Peace is Boring (#PeaceIsBoring):</span> Snap The Couple to see that peace doesn't sell.
                  <br />
                  <span className="text-white font-bold">3. The Spark (#CrazedSquareAttacks):</span> Snap the spiky-haired Square screaming at a Circle.
                  <br />
                  <span className="text-white font-bold">4. Total Escalation:</span> Snap a terrified Circle then an insulted Square snubbing a Circle.
                  <br />
                  <span className="text-white font-bold">5. The Climax (#FancyGuyShoots):</span> Snap hate until the dapper Circle shoots.
                  <br />
                  <span className="text-white font-bold">6. Bloodshed:</span> Final mass riot ends with the epilogue (Couple mourning at the candle memorial).
                </>
              )}
            </p>
          </div>
        )}

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

          <TVOverlay
            latestPhoto={latestPhoto}
            language={language}
          />

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

      {mode === 'sandbox' && (
        <SandboxUI
          language={language}
          onSpawnPeep={(shape, special) => handleSpawnPeep(shape, special as 'hat' | 'crazed' | 'couple' | 'armed')}
          onBroadcastCustom={handleBroadcastCustom}
          onResetCrowd={handleResetCrowd}
        />
      )}

      {mode === 'gallery' && (
        <GalleryModal
          photos={photos}
          language={language}
          onClose={() => setMode('story')}
          onClearGallery={handleClearGallery}
        />
      )}

      <footer className="bg-slate-900 border-t border-slate-800 text-slate-500 py-6 px-4 text-xs select-none">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <p className="font-bold text-slate-300">
              {t.title} <span className="font-normal text-slate-500">- {t.subtitle}</span>
            </p>
          </div>

          <div className="flex items-center space-x-6">
            <a
              href="https://github.com/ncase"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 hover:text-white transition-colors"
            >
              <Code2 className="w-4 h-4" />
              <span>GitHub di Nicky Case</span>
            </a>
          </div>
        </div>

        {/* Versione, Autore & Licenza */}
        <div className="max-w-7xl mx-auto mt-4 pt-4 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left text-[11px] text-slate-600">
          <div className="flex items-center space-x-2">
            <span className="bg-slate-800 text-amber-400 font-mono font-bold px-2 py-0.5 rounded-md border border-slate-700">
              v1.0.1c_BETA
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
