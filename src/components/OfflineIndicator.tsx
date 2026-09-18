import React from 'react';
import { WifiOff } from 'lucide-react';

interface OfflineIndicatorProps {
  isOnline: boolean;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ isOnline }) => {
  if (isOnline) return null;

  return (
    <div 
      id="pwa-offline-indicator"
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-amber-500/90 backdrop-blur-md px-3.5 py-2 text-xs font-semibold text-slate-950 shadow-2xl border border-amber-400 animate-fade-in"
    >
      <WifiOff className="w-4 h-4" />
      <span>Offline Mode — Active session cached for uninterrupted reading</span>
    </div>
  );
};
