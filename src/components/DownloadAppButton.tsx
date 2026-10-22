import React, { useState, useEffect } from 'react';
import { Download, Smartphone } from 'lucide-react';

export const DownloadAppButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstallable(false);
      }
      setDeferredPrompt(null);
    } else {
      // Fallback action if prompt isn't immediately available
      try {
        alert("To install KEN_TECH LIKES: Tap your browser menu (three dots) and select 'Install App' or 'Add to Home Screen'.");
      } catch {
        console.log("Install prompt fallback");
      }
    }
  };

  return (
    <button
      onClick={handleInstallClick}
      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 transition-all transform hover:scale-105 text-sm cursor-pointer"
    >
      <Smartphone className="w-4 h-4" />
      <span>{isInstallable ? "Install App" : "Download App"}</span>
    </button>
  );
};
