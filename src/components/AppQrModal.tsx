import React, { useState, useEffect } from 'react';
import { 
  X, 
  QrCode, 
  Copy, 
  Check, 
  Download, 
  Share2, 
  Smartphone, 
  Sparkles, 
  ExternalLink,
  ShieldCheck,
  Zap
} from 'lucide-react';
import QRCode from 'qrcode';

interface AppQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  customUrl?: string;
}

export const AppQrModal: React.FC<AppQrModalProps> = ({
  isOpen,
  onClose,
  customUrl,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Determine current public URL
  const appUrl = customUrl || (typeof window !== 'undefined' ? window.location.origin : 'https://ais-pre-5u4mtl6hcbg4cjxua5aghx-283838909312.europe-west2.run.app');

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;

    async function generateQR() {
      try {
        const url = await QRCode.toDataURL(appUrl, {
          errorCorrectionLevel: 'H',
          margin: 2,
          width: 512,
          color: {
            dark: '#030712',
            light: '#ffffff',
          },
        });
        if (isMounted) {
          setQrDataUrl(url);
        }
      } catch (err) {
        console.error('Error generating QR code:', err);
      }
    }

    generateQR();

    return () => {
      isMounted = false;
    };
  }, [isOpen, appUrl]);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(appUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'KEN_TECH LIKES - Automated SMM Platform',
          text: 'Get instant followers, likes, views & subscribers with automated Safaricom M-Pesa delivery on KEN_TECH LIKES!',
          url: appUrl,
        });
      } catch (e) {
        console.log('Share canceled or not allowed');
      }
    } else {
      handleCopyLink();
    }
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    setDownloading(true);

    try {
      // Generate a high-resolution branded poster canvas (800 x 960)
      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = 800;
      exportCanvas.height = 960;
      const ctx = exportCanvas.getContext('2d');

      if (!ctx) {
        setDownloading(false);
        return;
      }

      // 1. Dark Gradient Background
      const bgGrad = ctx.createLinearGradient(0, 0, 800, 960);
      bgGrad.addColorStop(0, '#040814');
      bgGrad.addColorStop(0.5, '#071026');
      bgGrad.addColorStop(1, '#030610');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 800, 960);

      // Top glowing accent line
      const lineGrad = ctx.createLinearGradient(100, 0, 700, 0);
      lineGrad.addColorStop(0, 'rgba(16, 185, 129, 0)');
      lineGrad.addColorStop(0.5, 'rgba(16, 185, 129, 0.8)');
      lineGrad.addColorStop(1, 'rgba(16, 185, 129, 0)');
      ctx.fillStyle = lineGrad;
      ctx.fillRect(100, 2, 600, 4);

      // 2. Header Brand Title
      ctx.textAlign = 'center';
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 18px system-ui, -apple-system, sans-serif';
      ctx.letterSpacing = '3px';
      ctx.fillText('KENYA’S #1 INSTANT SMM PLATFORM', 400, 70);

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 38px system-ui, -apple-system, sans-serif';
      ctx.letterSpacing = '-0.5px';
      ctx.fillText('KEN_TECH LIKES', 400, 120);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '500 16px system-ui, -apple-system, sans-serif';
      ctx.letterSpacing = '0px';
      ctx.fillText('Scan to Open & Order Instantly on Mobile', 400, 150);

      // 3. Draw QR Code Frame (Rounded Card)
      const qrBoxX = 175;
      const qrBoxY = 190;
      const qrBoxSize = 450;
      const radius = 24;

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, radius);
      ctx.fill();

      // Outer subtle border
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 3;
      ctx.stroke();

      // 4. Draw QR Code Image into card
      const img = new Image();
      img.onload = () => {
        const qrPadding = 25;
        ctx.drawImage(
          img, 
          qrBoxX + qrPadding, 
          qrBoxY + qrPadding, 
          qrBoxSize - (qrPadding * 2), 
          qrBoxSize - (qrPadding * 2)
        );

        // Center branding pill in QR code
        const badgeW = 90;
        const badgeH = 34;
        const badgeX = 400 - (badgeW / 2);
        const badgeY = qrBoxY + (qrBoxSize / 2) - (badgeH / 2);

        ctx.fillStyle = '#080d1a';
        ctx.beginPath();
        ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 12);
        ctx.fill();
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#34d399';
        ctx.font = '900 13px system-ui, -apple-system, sans-serif';
        ctx.fillText('KEN_TECH', 400, badgeY + 22);

        // 5. Bottom Instructions & Features
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px system-ui, -apple-system, sans-serif';
        ctx.fillText('⚡ Safaricom M-Pesa Till 1856074 Automated', 400, 690);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '15px system-ui, -apple-system, sans-serif';
        ctx.fillText('Likes, Followers, Views & Subscribers from 45 Bob', 400, 725);

        // Pill box for URL
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.roundRect(100, 765, 600, 48, 14);
        ctx.fill();
        ctx.strokeStyle = 'rgba(51, 65, 85, 0.8)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = '#38bdf8';
        ctx.font = '600 14px monospace';
        const displayUrl = appUrl.length > 55 ? `${appUrl.substring(0, 52)}...` : appUrl;
        ctx.fillText(displayUrl, 400, 795);

        // Footer copyright & safety
        ctx.fillStyle = '#64748b';
        ctx.font = '12px system-ui, -apple-system, sans-serif';
        ctx.fillText('100% Safe & Passwordless • 24/7 Support: +254 793 749 604', 400, 860);
        ctx.fillText('© ' + new Date().getFullYear() + ' KenTech Likes Kenya • All Rights Reserved', 400, 890);

        // Download trigger
        const downloadLink = document.createElement('a');
        downloadLink.download = 'kentech-likes-qr-code.png';
        downloadLink.href = exportCanvas.toDataURL('image/png');
        downloadLink.click();
        setDownloading(false);
      };

      img.src = qrDataUrl;
    } catch (e) {
      console.error('Error generating download poster:', e);
      setDownloading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md bg-[#0D131F] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-7 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-32 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1.5 mb-5">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Instant Mobile Access</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Scan QR Code to Open App
          </h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Scan with your phone camera or QR scanner to load KenTech Likes instantly on mobile.
          </p>
        </div>

        {/* QR Code Container */}
        <div className="relative mx-auto w-64 h-64 sm:w-72 sm:h-72 p-4 bg-white rounded-3xl shadow-2xl border-4 border-emerald-500/40 flex items-center justify-center group transition-all">
          {qrDataUrl ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <img 
                src={qrDataUrl} 
                alt="KenTech Likes App QR Code" 
                className="w-full h-full object-contain rounded-xl"
              />
              {/* Center Logo Badge */}
              <div className="absolute inset-0 m-auto w-12 h-12 rounded-2xl bg-slate-950 border-2 border-emerald-400 flex items-center justify-center shadow-xl">
                <Sparkles className="w-6 h-6 text-emerald-400 animate-pulse" />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-2 text-slate-600">
              <QrCode className="w-12 h-12 animate-pulse text-emerald-500" />
              <span className="text-xs font-semibold">Generating QR Code...</span>
            </div>
          )}
        </div>

        {/* Mobile Quick Tips */}
        <div className="mt-4 py-2.5 px-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 flex items-center justify-center space-x-2">
          <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Works on all iPhone (Camera) & Android (Google Lens / Camera)</span>
        </div>

        {/* URL Display Pill */}
        <div className="mt-3 flex items-center justify-between bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs">
          <span className="font-mono text-slate-400 truncate max-w-[240px] text-left">
            {appUrl}
          </span>
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex items-center space-x-1 text-emerald-400 hover:text-emerald-300 font-bold ml-2 shrink-0 cursor-pointer text-[11px]"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Primary Action Buttons */}
        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={handleDownloadQr}
            disabled={downloading || !qrDataUrl}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer border border-slate-700 disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>{downloading ? 'Preparing...' : 'Download Image'}</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-black text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-emerald-950/30 transition-all cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Link</span>
          </button>
        </div>

        {/* Bottom Trust Badge */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-center space-x-2 text-[10px] text-slate-500">
          <ShieldCheck className="w-3 h-3 text-emerald-500" />
          <span>Safaricom M-Pesa Native &bull; Fast Progressive Web App (PWA)</span>
        </div>

      </div>
    </div>
  );
};
