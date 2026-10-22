import React from 'react';
import { Sparkles, ShieldCheck, Heart, Award } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
  onOpenTerms?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenTerms }) => {
  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-[#080C14] text-slate-400 text-xs">
      {/* Payment methods banner */}
      <div className="border-b border-slate-800/60 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-300 font-semibold text-xs">
              Accepted Instant Payment Methods:
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono font-semibold">
            <span className="px-2.5 py-1 rounded-md bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
              🇰🇪 Safaricom Lipa Na M-Pesa STK
            </span>
            <span className="px-2.5 py-1 rounded-md bg-red-950/60 text-red-300 border border-red-500/30">
              Airtel Money
            </span>
            <span className="px-2.5 py-1 rounded-md bg-blue-950/60 text-blue-300 border border-blue-500/30">
              Visa & MasterCard
            </span>
            <span className="px-2.5 py-1 rounded-md bg-teal-950/60 text-teal-300 border border-teal-500/30">
              USDT (TRC-20)
            </span>
            <span className="px-2.5 py-1 rounded-md bg-amber-950/60 text-amber-300 border border-amber-500/30">
              Bitcoin (BTC)
            </span>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-black font-black">
                KT
              </div>
              <span className="text-lg font-black text-white font-mono">
                KEN<span className="text-emerald-400">_TECH</span> LIKES
              </span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400">
              The premier automated Social Media Marketing (SMM) provider and reseller panel in Kenya and Africa. Built for creators, businesses, artists, and agencies.
            </p>
            <div className="inline-flex items-center space-x-1.5 text-[10px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              <Award className="w-3.5 h-3.5" />
              <span>Wezesha SME Awards Best SMM Panel</span>
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Growth Services</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li><button onClick={() => onNavigate('order')} className="hover:text-emerald-400">TikTok Likes & FYP Views</button></li>
              <li><button onClick={() => onNavigate('order')} className="hover:text-emerald-400">Instagram Followers & Likes</button></li>
              <li><button onClick={() => onNavigate('order')} className="hover:text-emerald-400">YouTube 4K Watch Hours</button></li>
              <li><button onClick={() => onNavigate('order')} className="hover:text-emerald-400">Facebook Page Engagement</button></li>
              <li><button onClick={() => onNavigate('order')} className="hover:text-emerald-400">X (Twitter) Impressions</button></li>
              <li><button onClick={() => onNavigate('order')} className="hover:text-emerald-400">Telegram Channel Members</button></li>
            </ul>
          </div>

          {/* Platform & Resellers */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Quick Navigation</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li><button onClick={() => onNavigate('order')} className="hover:text-emerald-400 cursor-pointer">New order</button></li>
              <li><button onClick={() => onNavigate('my-orders')} className="hover:text-emerald-400 cursor-pointer">My orders</button></li>
              <li><button onClick={() => onNavigate('bonus')} className="hover:text-amber-400 text-amber-300 font-semibold cursor-pointer">Bonus 10% (Promo)</button></li>
              <li><button onClick={() => onNavigate('profile')} className="hover:text-emerald-400 cursor-pointer">Profile & Wallet</button></li>
              <li><button onClick={() => onNavigate('api')} className="hover:text-emerald-400 cursor-pointer">API Documentation</button></li>
              <li><button onClick={() => onNavigate('support')} className="hover:text-emerald-400 cursor-pointer">24/7 Support Desk</button></li>
              {onOpenTerms && (
                <li>
                  <button 
                    onClick={onOpenTerms} 
                    className="text-emerald-400/90 hover:text-emerald-300 font-semibold cursor-pointer underline flex items-center space-x-1"
                  >
                    <span>Terms & Prohibited Terms</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Security & Support */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Safety & Support</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              We operate strictly according to platform public API standards. No account passwords ever required. 100% confidential.
            </p>
            <div className="pt-2 text-[11px] text-slate-300">
              <span className="block font-semibold text-white">Nairobi Operations Desk:</span>
              <span className="block text-emerald-400 font-mono mt-0.5">Helpline: +254 793 749 604</span>
              <a href="mailto:kentechlikeS@gmail.com" className="block text-emerald-400/90 hover:text-emerald-300 font-mono text-[11px] transition-colors">
                Email: kentechlikeS@gmail.com
              </a>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="mt-10 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span>&copy; {new Date().getFullYear()} KEN_TECH LIKES. All rights reserved.</span>
            {onOpenTerms && (
              <>
                <span>&bull;</span>
                <button onClick={onOpenTerms} className="hover:text-emerald-400 underline cursor-pointer">
                  Platform Terms & Prohibited Guidelines
                </button>
              </>
            )}
          </div>
          <div className="flex items-center space-x-1">
            <span>Engineered with excellence for Africa's digital creators</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
