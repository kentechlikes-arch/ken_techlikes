import React from 'react';
import { PlatformId } from '../types';

interface BrandIconProps {
  platform: PlatformId | string;
  size?: number;
  className?: string;
  withBg?: boolean;
}

export const SocialBrandIcon: React.FC<BrandIconProps> = ({
  platform,
  size = 20,
  className = '',
  withBg = false,
}) => {
  const norm = platform.toLowerCase();

  // Helper wrapper if withBg is true
  const wrap = (children: React.ReactNode, bgClass: string = '') => {
    if (!withBg) return <span className={`inline-flex items-center justify-center shrink-0 ${className}`}>{children}</span>;
    return (
      <span className={`inline-flex items-center justify-center rounded-xl p-2 shrink-0 shadow-sm ${bgClass} ${className}`}>
        {children}
      </span>
    );
  };

  // 1. TIKTOK (Official logo with cyan & red brand glow)
  if (norm.includes('tiktok')) {
    return wrap(
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-sm"
      >
        {/* TikTok official styling */}
        <path
          d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-2.891 2.891 2.896 2.896 0 0 1-2.892-2.891 2.896 2.896 0 0 1 2.892-2.892c.307 0 .602.046.88.134V9.431a6.31 6.31 0 0 0-.88-.062 6.338 6.338 0 0 0-6.335 6.335 6.338 6.338 0 0 0 6.335 6.335 6.338 6.338 0 0 0 6.336-6.335V8.583a8.196 8.196 0 0 0 4.97 1.666v-3.563h-.001a4.793 4.793 0 0 1-1.2-.001v.001Z"
          fill="#00F2FE"
          transform="translate(-0.6, -0.6)"
        />
        <path
          d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-2.891 2.891 2.896 2.896 0 0 1-2.892-2.891 2.896 2.896 0 0 1 2.892-2.892c.307 0 .602.046.88.134V9.431a6.31 6.31 0 0 0-.88-.062 6.338 6.338 0 0 0-6.335 6.335 6.338 6.338 0 0 0 6.335 6.335 6.338 6.338 0 0 0 6.336-6.335V8.583a8.196 8.196 0 0 0 4.97 1.666v-3.563h-.001a4.793 4.793 0 0 1-1.2-.001v.001Z"
          fill="#FE2C55"
          transform="translate(0.6, 0.6)"
        />
        <path
          d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-2.891 2.891 2.896 2.896 0 0 1-2.892-2.891 2.896 2.896 0 0 1 2.892-2.892c.307 0 .602.046.88.134V9.431a6.31 6.31 0 0 0-.88-.062 6.338 6.338 0 0 0-6.335 6.335 6.338 6.338 0 0 0 6.335 6.335 6.338 6.338 0 0 0 6.336-6.335V8.583a8.196 8.196 0 0 0 4.97 1.666v-3.563h-.001a4.793 4.793 0 0 1-1.2-.001v.001Z"
          fill="#FFFFFF"
        />
      </svg>,
      'bg-black/90 border border-slate-700'
    );
  }

  // 2. INSTAGRAM (Official Gradient Camera)
  if (norm.includes('instagram')) {
    return wrap(
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <defs>
          <radialGradient id="igRad" cx="20%" cy="100%" r="130%">
            <stop offset="0%" stopColor="#FFDC80" />
            <stop offset="10%" stopColor="#FCAF45" />
            <stop offset="30%" stopColor="#F77737" />
            <stop offset="50%" stopColor="#F56040" />
            <stop offset="70%" stopColor="#FD1D1D" />
            <stop offset="90%" stopColor="#E1306C" />
            <stop offset="100%" stopColor="#C13584" />
          </radialGradient>
          <linearGradient id="igLin" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#405DE6" />
            <stop offset="50%" stopColor="#833AB4" />
            <stop offset="100%" stopColor="#C13584" />
          </linearGradient>
        </defs>
        <rect width="24" height="24" rx="6" fill="url(#igRad)" />
        <rect width="24" height="24" rx="6" fill="url(#igLin)" opacity="0.25" />
        <rect x="3" y="3" width="18" height="18" rx="5" stroke="#FFFFFF" strokeWidth="2" />
        <circle cx="12" cy="12" r="4.2" stroke="#FFFFFF" strokeWidth="2" />
        <circle cx="17.2" cy="6.8" r="1.2" fill="#FFFFFF" />
      </svg>,
      'bg-pink-950/40 border border-pink-500/30'
    );
  }

  // 3. YOUTUBE (Official YouTube Red #FF0000 with White Play Triangle)
  if (norm.includes('youtube')) {
    return wrap(
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <path
          d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"
          fill="#FF0000"
        />
        <path d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="#FFFFFF" />
      </svg>,
      'bg-red-950/40 border border-red-500/30'
    );
  }

  // 4. FACEBOOK (Official Facebook Blue #1877F2 with White 'f')
  if (norm.includes('facebook')) {
    return wrap(
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <circle cx="12" cy="12" r="12" fill="#1877F2" />
        <path
          d="M16.5 12.05h-2.73v7.45h-3.1v-7.45H8.75v-2.65h1.92V7.61c0-1.9 1.14-2.95 2.86-2.95.82 0 1.53.06 1.74.09v2.02h-1.19c-.92 0-1.1.44-1.1 1.08v1.55h2.24l-.29 2.65h-.43z"
          fill="#FFFFFF"
        />
      </svg>,
      'bg-blue-950/40 border border-blue-500/30'
    );
  }

  // 5. TELEGRAM (Official Sky Blue #229ED9 with Paper Airplane)
  if (norm.includes('telegram')) {
    return wrap(
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <circle cx="12" cy="12" r="12" fill="#24A1DE" />
        <path
          d="M5.4 11.8l11.5-4.7c.5-.2 1.1.1.9.7l-2 9.5c-.1.7-.6.9-1.2.5l-3.3-2.4-1.6 1.5c-.2.2-.3.3-.6.3l.2-3.4 6.2-5.6c.3-.3-.1-.4-.4-.2l-7.7 4.9-3.3-1c-.7-.2-.7-.7.2-1.1z"
          fill="#FFFFFF"
        />
      </svg>,
      'bg-sky-950/40 border border-sky-500/30'
    );
  }

  // 6. WHATSAPP (Official WhatsApp Green #25D366)
  if (norm.includes('whatsapp')) {
    return wrap(
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <circle cx="12" cy="12" r="12" fill="#25D366" />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M17.5 14.5c-.3-.2-1.7-.8-1.9-.9-.3-.1-.5-.2-.7.2s-.8.9-1 1.1c-.2.2-.4.2-.7.1s-1.3-.5-2.5-1.5c-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.7.1-.1.3-.4.5-.5.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5s-.7-1.7-1-2.3c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4s-1.1 1.1-1.1 2.6c0 1.5 1.1 3 1.3 3.2.2.2 2.2 3.4 5.3 4.8 2.6 1.1 2.6.7 3.1.7.5 0 1.7-.7 1.9-1.4.3-.7.3-1.3.2-1.4-.1-.1-.3-.2-.5-.3z"
          fill="#FFFFFF"
        />
      </svg>,
      'bg-emerald-950/40 border border-emerald-500/30'
    );
  }

  // 7. X (TWITTER) (Official Stark White X on Black #000000 / Cyan #1DA1F2)
  if (norm.includes('twitter') || norm.includes('x')) {
    return wrap(
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <rect width="24" height="24" rx="6" fill="#000000" />
        <path
          d="M18.244 3.75h2.529l-5.526 6.316 6.5 8.596h-5.088l-3.987-5.212-4.562 5.212H5.58l5.912-6.758L5.25 3.75h5.218l3.606 4.767 4.17-4.767zm-.888 13.393h1.401L8.85 5.163H7.346l10.01 11.98z"
          fill="#FFFFFF"
        />
      </svg>,
      'bg-slate-900 border border-slate-700'
    );
  }

  // 8. SPOTIFY (Official Green #1DB954 with Black Curved Soundwaves)
  if (norm.includes('spotify')) {
    return wrap(
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <circle cx="12" cy="12" r="12" fill="#1DB954" />
        <path
          d="M17.4 15.6c-.2.3-.6.4-.9.2-2.5-1.5-5.6-1.8-9.3-1-.4.1-.7-.2-.8-.5-.1-.4.2-.7.5-.8 4.1-.9 7.6-.6 10.3 1.1.4.3.4.7.2 1zm1.3-2.9c-.3.4-.8.5-1.2.3-2.9-1.8-7.3-2.3-10.7-1.3-.5.1-.9-.2-1-.6-.1-.5.2-.9.6-1 3.9-1.2 8.8-.6 12 1.4.4.3.6.8.3 1.2zm.1-3.1c-3.5-2.1-9.2-2.3-12.6-1.2-.5.2-1.1-.1-1.3-.6-.2-.5.1-1.1.6-1.3 3.9-1.2 10.2-1 14.3 1.4.5.3.7.9.4 1.4-.3.4-.9.6-1.4.3z"
          fill="#000000"
        />
      </svg>,
      'bg-green-950/40 border border-green-500/30'
    );
  }

  // 9. SOUNDCLOUD (Official Sunset Cloud Orange #FF5500)
  if (norm.includes('soundcloud')) {
    return wrap(
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <rect width="24" height="24" rx="6" fill="#FF5500" />
        <path
          d="M19.2 13.5c0-.4-.3-.8-.8-.8-.2 0-.4.1-.6.2-.2-1.5-1.5-2.7-3.1-2.7-.4 0-.8.1-1.2.3v5.2h5c.4 0 .7-.3.7-.7v-1.5zm-6.2-4.1c-.2 0-.4.2-.4.4v9.4c0 .2.2.4.4.4s.4-.2.4-.4V9.8c0-.2-.2-.4-.4-.4zm-1.8 1.5c-.2 0-.4.2-.4.4v7.9c0 .2.2.4.4.4s.4-.2.4-.4v-7.9c0-.2-.2-.4-.4-.4zm-1.9 1.7c-.2 0-.4.2-.4.4v6.2c0 .2.2.4.4.4s.4-.2.4-.4V13c0-.2-.2-.4-.4-.4zm-1.8 1.2c-.2 0-.4.2-.4.4v5c0 .2.2.4.4.4s.4-.2.4-.4v-5c0-.2-.2-.4-.4-.4zm-1.9 1.1c-.2 0-.4.2-.4.4v3.9c0 .2.2.4.4.4s.4-.2.4-.4v-3.9c0-.2-.2-.4-.4-.4z"
          fill="#FFFFFF"
        />
      </svg>,
      'bg-orange-950/40 border border-orange-500/30'
    );
  }

  // 10. GOOGLE MAPS (Official Google 4-Color Pin)
  if (norm.includes('google') || norm.includes('maps')) {
    return wrap(
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <path
          d="M12 2C7.58 2 4 5.58 4 10c0 5.25 8 12 8 12s8-6.75 8-12c0-4.42-3.58-8-8-8z"
          fill="#4285F4"
        />
        <path
          d="M12 2C7.58 2 4 5.58 4 10c0 2.21 1.05 4.7 2.7 7.2L12 22l5.3-4.8c1.65-2.5 2.7-4.99 2.7-7.2 0-4.42-3.58-8-8-8z"
          fill="#EA4335"
        />
        <circle cx="12" cy="9.5" r="3.5" fill="#FFFFFF" />
        <path d="M12 6a3.5 3.5 0 0 1 3.5 3.5c0 .85-.31 1.63-.82 2.22l-2.68-2.68V6z" fill="#FBBC05" />
        <path d="M12 13a3.5 3.5 0 0 1-3.5-3.5c0-.85.31-1.63.82-2.22l2.68 2.68V13z" fill="#34A853" />
      </svg>,
      'bg-blue-950/40 border border-blue-500/30'
    );
  }

  // 11. LINKEDIN (Official LinkedIn Blue #0A66C2 with bold 'in')
  if (norm.includes('linkedin')) {
    return wrap(
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <rect width="24" height="24" rx="4" fill="#0A66C2" />
        <path
          d="M7.1 9.5v8H4.4v-8h2.7zm-1.3-4.1c.9 0 1.6.7 1.6 1.6s-.7 1.6-1.6 1.6-1.6-.7-1.6-1.6.7-1.6 1.6-1.6zM19.6 17.5h-2.7v-4.2c0-1-.02-2.3-1.4-2.3s-1.6 1.1-1.6 2.2v4.3h-2.7v-8h2.6v1.1h.04c.36-.7 1.3-1.4 2.6-1.4 2.8 0 3.3 1.8 3.3 4.2v4.1h.06z"
          fill="#FFFFFF"
        />
      </svg>,
      'bg-blue-950/40 border border-blue-500/30'
    );
  }

  // 12. WEBSITE TRAFFIC & SEO (Globe & GA4 Analytics)
  return wrap(
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <circle cx="12" cy="12" r="10" stroke="#8B5CF6" strokeWidth="2" fill="#1E1B4B" />
      <path
        d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
        stroke="#10B981"
        strokeWidth="1.8"
      />
    </svg>,
    'bg-purple-950/40 border border-purple-500/30'
  );
};
