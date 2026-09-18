import React from 'react';
import { Download, Share2, PlusSquare, X } from 'lucide-react';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  isIOS: boolean;
  onInstallNative?: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({
  isOpen,
  onClose,
  isIOS,
  onInstallNative,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div 
        id="pwa-install-modal"
        className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-900 border border-slate-700 p-4 sm:p-6 shadow-2xl text-slate-100 relative"
      >
        <button
          id="close-pwa-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 transition-colors p-1 rounded-lg hover:bg-slate-800"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Download className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Install ReadSync PWA</h3>
            <p className="text-xs text-slate-400">Offline-ready interactive reading companion</p>
          </div>
        </div>

        {isIOS ? (
          <div className="space-y-4 text-sm text-slate-300">
            <p className="text-slate-300 leading-relaxed">
              Install this Progressive Web App on your iPhone or iPad for zero-distraction fullscreen reading:
            </p>
            <ol className="space-y-3 bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 text-xs">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold">1</span>
                <span>Tap the <strong className="text-white inline-flex items-center gap-1"><Share2 className="w-3.5 h-3.5 text-indigo-400 inline" /> Share</strong> button in Safari toolbar.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold">2</span>
                <span>Scroll down and select <strong className="text-white inline-flex items-center gap-1"><PlusSquare className="w-3.5 h-3.5 text-indigo-400 inline" /> Add to Home Screen</strong>.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold">3</span>
                <span>Tap <strong className="text-white">Add</strong> in the top-right corner to launch from your home screen.</span>
              </li>
            </ol>
          </div>
        ) : (
          <div className="space-y-4 text-sm text-slate-300">
            <p className="text-slate-300 leading-relaxed">
              Install ReadSync to your desktop or device to experience seamless interactive reading with full offline caching and faster response times.
            </p>
            {onInstallNative && (
              <button
                id="native-install-btn"
                onClick={() => {
                  onInstallNative();
                  onClose();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-all shadow-lg shadow-indigo-600/30"
              >
                <Download className="w-4 h-4" />
                Install App Now
              </button>
            )}
          </div>
        )}

        <button
          id="dismiss-pwa-modal-btn"
          onClick={onClose}
          className="mt-4 w-full py-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
        >
          Got it, return to reading
        </button>
      </div>
    </div>
  );
};
