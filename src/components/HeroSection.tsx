import React from 'react';
import { 
  Zap, 
  ShieldCheck, 
  CheckCircle2, 
  TrendingUp, 
  Smartphone, 
  Users, 
  Clock, 
  Award,
  ArrowRight
} from 'lucide-react';
import { PlatformId } from '../types';
import { PLATFORMS_CONFIG } from '../data/servicesData';
import { SocialBrandIcon } from './SocialBrandIcons';

interface HeroSectionProps {
  onSelectCategory: (platform: PlatformId) => void;
  onExploreServices: () => void;
  onOpenDeposit: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSelectCategory,
  onExploreServices,
  onOpenDeposit
}) => {
  const quickPicks: { platform: PlatformId; label: string; highlight: string }[] = [
    { platform: 'tiktok', label: 'TikTok Viral', highlight: 'Likes from KES 20' },
    { platform: 'instagram', label: 'Instagram', highlight: 'Followers from KES 89' },
    { platform: 'youtube', label: 'YouTube', highlight: '4K Watch Hours & Subs' },
    { platform: 'facebook', label: 'Facebook', highlight: 'Followers from KES 300' },
    { platform: 'telegram', label: 'Telegram', highlight: 'Members 0% Drop' },
    { platform: 'whatsapp', label: 'WhatsApp', highlight: 'Channel Followers' },
    { platform: 'google', label: 'Google Maps', highlight: '5-Star Reviews' },
    { platform: 'spotify', label: 'Spotify', highlight: 'Royalties Streams' },
  ];

  return (
    <div className="relative pt-6 pb-12 sm:pb-16 overflow-hidden">
      {/* Dynamic Background Glow Spheres */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none"></div>
      <div className="absolute top-10 right-10 w-[300px] h-[250px] bg-indigo-600/10 blur-[110px] rounded-full pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Award & Trust Top Badge */}
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-500/20 via-slate-800/90 to-emerald-500/20 border border-emerald-500/40 px-4 py-2 rounded-full mb-6 backdrop-blur-md shadow-lg shadow-emerald-950/30">
          <Award className="w-4 h-4 text-emerald-400" />
          <span className="text-xs sm:text-sm font-bold text-emerald-300">
            Kenya's Most Trusted SMM Provider
          </span>
          <span className="text-slate-400 font-bold">&bull;</span>
          <span className="text-xs sm:text-sm text-slate-200 font-semibold hidden sm:inline">
            Direct Automated M-Pesa STK Push 24/7
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none drop-shadow-md">
          Grow Your Social Media with{' '}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            KEN_TECH LIKES
          </span>
        </h1>

        <p className="mt-4 sm:mt-6 text-base sm:text-xl text-slate-200 max-w-3xl mx-auto font-medium leading-relaxed">
          Instantly boost TikTok, Instagram, YouTube, Facebook, Telegram & WhatsApp.
          Get real engagement, monetization hours, and genuine reach delivered in minutes with seamless 
          <span className="text-emerald-400 font-bold underline decoration-emerald-500/50 underline-offset-4"> Lipa Na M-Pesa </span> support.
        </p>

        {/* Key Feature Highlights - High contrast and visible fonts */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm text-slate-100 font-semibold">
          <div className="flex items-center space-x-2 bg-slate-900/90 px-3.5 py-2 rounded-xl border border-slate-700 shadow-md">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span>Starts in 30 Seconds</span>
          </div>
          <div className="flex items-center space-x-2 bg-slate-900/90 px-3.5 py-2 rounded-xl border border-slate-700 shadow-md">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>0% Passwords Needed</span>
          </div>
          <div className="flex items-center space-x-2 bg-slate-900/90 px-3.5 py-2 rounded-xl border border-slate-700 shadow-md">
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span>Instant M-Pesa STK Push</span>
          </div>
          <div className="flex items-center space-x-2 bg-slate-900/90 px-3.5 py-2 rounded-xl border border-slate-700 shadow-md">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Auto Refill Guarantee</span>
          </div>
        </div>

        {/* Quick Platform Bar with REAL OFFICIAL BRAND ICONS */}
        <div className="mt-10 pt-6 border-t border-slate-800/80">
          <p className="text-xs sm:text-sm font-bold text-slate-300 uppercase tracking-wider mb-5">
            Select A Platform to Fast Track Your Order:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 xl:grid-cols-8 gap-3 max-w-6xl mx-auto">
            {quickPicks.map((item) => {
              return (
                <button
                  key={item.platform}
                  onClick={() => onSelectCategory(item.platform)}
                  className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-400/60 transition-all text-center group shadow-md hover:shadow-emerald-950/30 cursor-pointer"
                >
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-2 bg-[#090D16] border border-slate-700 group-hover:scale-110 transition-transform shadow-inner">
                    <SocialBrandIcon platform={item.platform} size={24} />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {item.label}
                  </span>
                  <span className="text-[11px] text-emerald-400 font-bold font-mono mt-1">
                    {item.highlight}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Real-time Counter Stats */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-center shadow-md">
            <div className="flex items-center justify-center space-x-1.5 text-slate-300 text-xs sm:text-sm font-semibold mb-1">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Orders Completed</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">1,489,200+</div>
            <div className="text-xs font-bold text-emerald-400 mt-0.5">99.8% Success Rate</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-center shadow-md">
            <div className="flex items-center justify-center space-x-1.5 text-slate-300 text-xs sm:text-sm font-semibold mb-1">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Active Creators</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">42,850+</div>
            <div className="text-xs font-semibold text-slate-300 mt-0.5">Kenya & East Africa</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-center shadow-md">
            <div className="flex items-center justify-center space-x-1.5 text-slate-300 text-xs sm:text-sm font-semibold mb-1">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Avg Start Time</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">60 Sec</div>
            <div className="text-xs font-semibold text-slate-300 mt-0.5">Automated Server Queues</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-center shadow-md">
            <div className="flex items-center justify-center space-x-1.5 text-slate-300 text-xs sm:text-sm font-semibold mb-1">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>M-Pesa STK Push</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">Instant</div>
            <div className="text-xs font-bold text-emerald-400 mt-0.5">Paybill 522522 & Express</div>
          </div>
        </div>

      </div>
    </div>
  );
};
