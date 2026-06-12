import React from 'react';
import { X, Calendar, Share2, Sparkles, Trash2, Camera } from 'lucide-react';
import { CapturedPhoto, Language } from '../types/game';
import { translations } from '../utils/translations';
import { soundManager } from '../utils/audio';

interface GalleryModalProps {
  photos: CapturedPhoto[];
  language: Language;
  onClose: () => void;
  onClearGallery: () => void;
}

export const GalleryModal: React.FC<GalleryModalProps> = ({
  photos,
  language,
  onClose,
  onClearGallery,
}) => {
  const t = translations[language];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in select-none">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-scale-up">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {t.galleryMode}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {photos.length} {t.photoCount.toLowerCase()}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {photos.length > 0 && (
              <button
                onClick={() => {
                  soundManager.playBoom();
                  onClearGallery();
                }}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs sm:text-sm font-bold transition-all"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">{t.clearCrowd}</span>
              </button>
            )}

            <button
              onClick={() => {
                soundManager.playPop();
                onClose();
              }}
              className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {photos.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-500 mb-4">
                <Camera className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-300">Nessuna notizia archiviata</h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1">
                {t.cameraTip}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {photos.map((photo, index) => {
                const isPeace = photo.headline === '#LA_PACE_E_NOIOSA' || photo.headline === '#PEACE_IS_BORING';
                const isImportant = photo.isImportant;

                return (
                  <div
                    key={photo.id}
                    className={`rounded-2xl overflow-hidden border bg-slate-950/60 flex flex-col justify-between transition-all hover:-translate-y-1 ${
                      isPeace
                        ? 'border-pink-500/60 shadow-lg shadow-pink-500/10'
                        : isImportant
                        ? 'border-red-500/50 shadow-lg shadow-red-500/10'
                        : 'border-slate-800'
                    }`}
                  >
                    {/* Image snippet */}
                    <div className="relative aspect-video w-full overflow-hidden bg-slate-900 border-b border-slate-800/80">
                      <img
                        src={photo.imageData}
                        alt="News Memory"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-mono text-slate-300 flex items-center space-x-1 border border-white/10">
                        <Calendar className="w-3 h-3 text-amber-400" />
                        <span>Notizia #{index + 1}</span>
                      </div>
                      {isImportant && !isPeace && (
                        <div className="absolute top-3 right-3 bg-red-600 text-white px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider">
                          VIRALE
                        </div>
                      )}
                      {isPeace && (
                        <div className="absolute top-3 right-3 bg-gradient-to-r from-pink-500 to-amber-400 text-slate-950 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider flex items-center space-x-1">
                          <Sparkles className="w-3 h-3" />
                          <span>MIRACOLO</span>
                        </div>
                      )}
                    </div>

                    {/* Meta Box */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className={`text-lg font-black tracking-tight ${isPeace ? 'text-pink-300' : 'text-white'}`}>
                          {photo.headline}
                        </h4>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2 font-medium">
                          {photo.subheadline}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                        <span>{new Date(photo.timestamp).toLocaleTimeString()}</span>
                        <button 
                          onClick={() => {
                            soundManager.playPop();
                            if (navigator.share) {
                              navigator.share({
                                title: photo.headline,
                                text: photo.subheadline,
                              }).catch(() => {});
                            } else {
                              alert("Notizia copiata negli appunti!");
                            }
                          }}
                          className="hover:text-amber-400 transition-colors flex items-center space-x-1"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          <span>Condividi</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
