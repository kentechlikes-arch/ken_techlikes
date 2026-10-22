import React, { useState } from 'react';
import { 
  Percent, 
  Sparkles, 
  Gift, 
  ArrowRight, 
  Smartphone, 
  Copy, 
  Check, 
  Users, 
  TrendingUp, 
  ShieldCheck, 
  Wallet
} from 'lucide-react';
import { Currency } from '../types';
import { formatCurrency } from '../data/servicesData';

interface BonusPromoProps {
  currency: Currency;
  onOpenDeposit: () => void;
  walletBalance: number;
  bonusPercent?: number;
}

export const BonusPromo: React.FC<BonusPromoProps> = ({
  currency,
  onOpenDeposit,
  walletBalance,
  bonusPercent = 10,
}) => {
  const [calcDeposit, setCalcDeposit] = useState<number>(2000);
  const [copiedRef, setCopiedRef] = useState(false);

  const bonusAmount = Math.round(calcDeposit * (bonusPercent / 100));
  const totalCredited = calcDeposit + bonusAmount;

  const referralLink = 'https://kentechlikes.co.ke/ref/KT-KENYA-982';

  const handleCopyRef = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      
      {/* Hero Bonus Header */}
      <div className="relative rounded-3xl bg-gradient-to-br from-amber-950/40 via-[#0E1526] to-[#0A101D] border-2 border-amber-500/40 p-6 sm:p-10 shadow-2xl overflow-hidden backdrop-blur-xl">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs sm:text-sm font-black shadow-sm">
              <Gift className="w-4 h-4 text-amber-400" />
              <span>LIMITED TIME REWARDS &bull; OCT 2026</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Get an Extra <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-300 bg-clip-text text-transparent">+{bonusPercent}% Bonus</span> on Every M-Pesa Deposit!
            </h2>

            <p className="text-sm sm:text-base text-slate-200 max-w-xl font-medium leading-relaxed">
              Top up <strong className="text-white">KES 1,000 or more</strong> via automated Lipa Na M-Pesa STK Push or Paybill and our system automatically adds an instant <strong className="text-amber-400">{bonusPercent}% free credit</strong> to your wallet balance.
            </p>
          </div>

          <div className="shrink-0 text-center">
            <button
              onClick={onOpenDeposit}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 text-black font-black text-base sm:text-lg tracking-wide shadow-xl shadow-amber-950/40 transition-all active:scale-95 cursor-pointer flex items-center space-x-2"
            >
              <Sparkles className="w-5 h-5" />
              <span>Claim +{bonusPercent}% Bonus Now</span>
            </button>
            <span className="block text-xs text-slate-400 mt-2 font-mono">
              Auto-credited in 30 seconds
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Bonus Calculator */}
      <div className="rounded-3xl bg-[#0B111E] border border-slate-800 p-6 sm:p-8 shadow-xl">
        <div className="flex items-center space-x-2.5 mb-6">
          <Percent className="w-5 h-5 text-amber-400" />
          <h3 className="text-lg sm:text-xl font-black text-white">
            {bonusPercent}% Deposit Bonus Calculator
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="space-y-4">
            <label className="text-xs sm:text-sm font-bold text-slate-300 block">
              Enter Deposit Amount to Calculate:
            </label>

            <div className="flex items-center space-x-2">
              <span className="text-sm font-bold text-amber-400 font-mono">KES</span>
              <input
                type="number"
                min={500}
                step={500}
                value={calcDeposit}
                onChange={(e) => setCalcDeposit(Math.max(0, Number(e.target.value)))}
                className="w-full bg-[#121A2A] border border-slate-700 focus:border-amber-500 rounded-xl px-4 py-3 text-lg font-mono font-black text-white focus:outline-none"
              />
            </div>

            {/* Quick amount chips */}
            <div className="flex flex-wrap gap-2 pt-1">
              {[1000, 2000, 5000, 10000, 25000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setCalcDeposit(amt)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer ${
                    calcDeposit === amt
                      ? 'bg-amber-500 text-black font-black'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                  }`}
                >
                  KES {amt.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Breakdown Card */}
          <div className="p-5 rounded-2xl bg-[#121A2A] border border-slate-700/80 space-y-3 font-mono">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Your M-Pesa Top Up:</span>
              <span className="text-white font-bold">{formatCurrency(calcDeposit, currency)}</span>
            </div>

            <div className="flex justify-between text-xs text-amber-400 font-bold border-b border-slate-800 pb-2">
              <span>+10% Free Bonus Credit:</span>
              <span>+{formatCurrency(bonusAmount, currency)}</span>
            </div>

            <div className="flex justify-between text-base sm:text-lg font-black text-white pt-1">
              <span>Total Credited to Wallet:</span>
              <span className="text-emerald-400">{formatCurrency(totalCredited, currency)}</span>
            </div>

            <button
              onClick={onOpenDeposit}
              className="w-full mt-3 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-black text-xs sm:text-sm tracking-wide shadow cursor-pointer active:scale-95 flex items-center justify-center space-x-1.5"
            >
              <span>Deposit KES {calcDeposit.toLocaleString()} & Get KES {totalCredited.toLocaleString()}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Affiliate / Referral Program: Earn 10% Lifetime */}
      <div className="rounded-3xl bg-[#0B111E] border border-slate-800 p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex items-center space-x-2.5">
          <Users className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg sm:text-xl font-black text-white">
            10% Lifetime Referral Commission
          </h3>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
          Invite friends, content creators, or agency clients to KEN_TECH LIKES. Whenever they top up their account using M-Pesa, you instantly receive <strong className="text-emerald-400">10% of their deposit</strong> credited directly to your withdrawable wallet balance!
        </p>

        <div className="p-4 rounded-2xl bg-[#121A2A] border border-slate-700/80 space-y-2">
          <label className="text-xs font-bold text-slate-300 block">
            Your Unique Referral Link:
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              readOnly
              value={referralLink}
              className="flex-1 bg-[#090D16] border border-slate-700 rounded-xl px-4 py-2.5 text-xs font-mono text-emerald-400 focus:outline-none"
            />
            <button
              onClick={handleCopyRef}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs flex items-center space-x-1.5 cursor-pointer shadow"
            >
              {copiedRef ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedRef ? 'Copied!' : 'Copy Link'}</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
