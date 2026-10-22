import React, { useState } from 'react';
import { 
  Calculator, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  TrendingUp, 
  ShieldCheck, 
  Gift
} from 'lucide-react';
import { Currency, OrderRecord } from '../types';
import { formatCurrency } from '../data/servicesData';
import { SocialBrandIcon } from './SocialBrandIcons';

interface GrowthCalculatorProps {
  currency: Currency;
  onOrderBundle: (serviceId: string, quantity: number) => void;
}

export const GrowthCalculator: React.FC<GrowthCalculatorProps> = ({
  currency,
  onOrderBundle,
}) => {
  const bundles = [
    {
      id: 'bundle-yt-monetize',
      name: 'YouTube Partner Monetization Fast-Track',
      platform: 'youtube',
      platformLabel: 'YouTube',
      serviceId: 'YT-301',
      serviceQty: 4000,
      highlight: 'Unlocks In-Stream Ads & Super Chats',
      features: [
        '4,000 Guaranteed High-Retention Watch Hours',
        '1,000 Active Channel Subscribers',
        'Lifetime Monetization Refill Protection',
        'AdSense Safe Drip-Feed Delivery (3-5 Days)'
      ],
      originalCost: 6500,
      discountedCost: 5200,
      savings: '20% OFF'
    },
    {
      id: 'bundle-tt-viral',
      name: 'TikTok Viral Creator Rewards Pack',
      platform: 'tiktok',
      platformLabel: 'TikTok',
      serviceId: 'TT-101',
      serviceQty: 10000,
      highlight: 'Qualifies for Creator Rewards Fund (10K+)',
      features: [
        '10,000 Real TikTok Followers',
        '50,000 Video Likes Distributed across posts',
        '250,000 FYP Algorithmic Views',
        'Instant Start within 10 Minutes'
      ],
      originalCost: 2800,
      discountedCost: 2150,
      savings: '23% OFF'
    },
    {
      id: 'bundle-ig-authority',
      name: 'Instagram Influencer & Brand Authority',
      platform: 'instagram',
      platformLabel: 'Instagram',
      serviceId: 'IG-201',
      serviceQty: 5000,
      highlight: 'Meta Verified Ready & High Social Proof',
      features: [
        '5,000 High-Quality Real Followers (30-Day Auto Refill)',
        '10,000 Post & Reel Likes',
        '50,000 Explore Page Reach & Impressions',
        'Custom Positive Comments Pack Included'
      ],
      originalCost: 1950,
      discountedCost: 1450,
      savings: '25% OFF'
    }
  ];

  const [activeBundleIndex, setActiveBundleIndex] = useState(0);
  const currentBundle = bundles[activeBundleIndex];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-[#0F172A]/95 border border-slate-700 p-6 sm:p-8 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-xs sm:text-sm font-bold text-emerald-300 mb-2.5">
              <Gift className="w-4 h-4 text-emerald-400" />
              <span>Pre-Configured Creator Bundles</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight">
              Growth Milestone & Monetization Packages
            </h2>
            <p className="text-sm font-medium text-slate-300 mt-1.5">
              Save up to 25% with bundled multi-service packs designed for monetization goals.
            </p>
          </div>
        </div>

        {/* Bundle Selector Cards with REAL BRAND ICONS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-7">
          {bundles.map((bundle, idx) => {
            const isSelected = activeBundleIndex === idx;
            return (
              <div
                key={bundle.id}
                onClick={() => setActiveBundleIndex(idx)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-gradient-to-b from-emerald-950/60 to-slate-900 border-emerald-400 ring-2 ring-emerald-500/40 shadow-xl shadow-emerald-950/40'
                    : 'bg-slate-900/90 border-slate-700 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-3.5">
                  <div className="flex items-center space-x-2.5">
                    <SocialBrandIcon platform={bundle.platform} size={22} withBg />
                    <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-white">
                      {bundle.platformLabel}
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    {bundle.savings}
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-white mb-1.5">
                  {bundle.name}
                </h3>
                <p className="text-xs sm:text-sm text-emerald-400 mb-4 font-semibold">
                  {bundle.highlight}
                </p>

                <div className="flex items-baseline space-x-2 pt-3 border-t border-slate-800">
                  <span className="text-xl sm:text-2xl font-black text-white font-mono">
                    {formatCurrency(bundle.discountedCost, currency)}
                  </span>
                  <span className="text-xs sm:text-sm text-slate-400 line-through font-mono">
                    {formatCurrency(bundle.originalCost, currency)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Bundle In-Depth Specs */}
        <div className="mt-8 rounded-2xl bg-slate-900/95 border border-slate-700 p-6 sm:p-7 space-y-4 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-3.5">
              <SocialBrandIcon platform={currentBundle.platform} size={32} withBg />
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                  Active Selection
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white">
                  {currentBundle.name}
                </h3>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs sm:text-sm text-slate-300 font-semibold block">Bundle Price (M-Pesa Ready):</span>
              <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
                {formatCurrency(currentBundle.discountedCost, currency)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {currentBundle.features.map((feat, i) => (
              <div key={i} className="flex items-start space-x-2.5 text-xs sm:text-sm text-slate-200 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{feat}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
            <div className="flex items-center space-x-2 text-xs sm:text-sm font-semibold text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Full Monetization Guarantee & 24/7 Priority Kenyan Support</span>
            </div>

            <button
              onClick={() => onOrderBundle(currentBundle.serviceId, currentBundle.serviceQty)}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-black text-xs sm:text-sm tracking-wide shadow-md flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
            >
              <span>Order This Bundle Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
