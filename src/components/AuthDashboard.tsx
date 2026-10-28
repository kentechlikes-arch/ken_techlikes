import React, { useState } from 'react';
import { 
  Sparkles, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Gift, 
  Smartphone, 
  Loader2, 
  KeyRound, 
  HelpCircle,
  TrendingUp,
  Compass,
  Check,
  QrCode
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  loginAccount, 
  registerAccount, 
  resetPassword, 
  getAuthErrorMessage 
} from '../lib/firebase';
import { isReservedUsername } from '../lib/termsPolicy';
import { SystemSettings } from '../types';

export type AuthDashboardTab = 'login' | 'register' | 'reset-password';

interface AuthDashboardProps {
  onSuccess: () => void;
  onOpenTerms: () => void;
  onExploreGuest?: () => void;
  onOpenQrCode?: () => void;
  systemSettings?: SystemSettings;
  initialTab?: AuthDashboardTab;
}

export const AuthDashboard: React.FC<AuthDashboardProps> = ({
  onSuccess,
  onOpenTerms,
  onExploreGuest,
  onOpenQrCode,
  systemSettings,
  initialTab = 'login'
}) => {
  const [tab, setTab] = useState<AuthDashboardTab>(initialTab);
  
  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  
  // Status & Feedback
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resetSuccessMsg, setResetSuccessMsg] = useState<string | null>(null);

  const resetFormAlerts = () => {
    setErrorMsg(null);
    setResetSuccessMsg(null);
  };

  const handleSwitchTab = (newTab: AuthDashboardTab) => {
    resetFormAlerts();
    setTab(newTab);
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetFormAlerts();

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (tab === 'login') {
      if (!password) {
        setErrorMsg('Please enter your account password.');
        return;
      }
      try {
        setLoading(true);
        await loginAccount(email, password);
        setLoading(false);
        try {
          confetti({ particleCount: 60, spread: 55, origin: { y: 0.6 } });
        } catch (e) {}
        onSuccess();
      } catch (err: any) {
        setLoading(false);
        setErrorMsg(getAuthErrorMessage(err));
      }
    } else if (tab === 'register') {
      if (!fullName.trim()) {
        setErrorMsg('Please enter your full name or nickname.');
        return;
      }
      const reservedCheck = isReservedUsername(fullName.trim());
      if (reservedCheck.isReserved) {
        setErrorMsg(reservedCheck.reason || 'This username is reserved by the system. Please choose another username.');
        return;
      }
      if (!phone.trim()) {
        setErrorMsg('Please enter your Safaricom M-Pesa phone number for instant withdrawals & alerts.');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match. Please verify both passwords.');
        return;
      }
      if (!agreeTerms) {
        setErrorMsg('Please accept the KenTech Likes Terms of Service & Prohibited Guidelines to continue.');
        return;
      }

      try {
        setLoading(true);
        await registerAccount(email, password, fullName, phone);
        setLoading(false);
        try {
          confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
        } catch (e) {}
        onSuccess();
      } catch (err: any) {
        setLoading(false);
        setErrorMsg(getAuthErrorMessage(err));
      }
    } else if (tab === 'reset-password') {
      try {
        setLoading(true);
        await resetPassword(email);
        setLoading(false);
        setResetSuccessMsg(`A password reset link has been dispatched to ${email}. Please check your inbox and spam folder.`);
      } catch (err: any) {
        setLoading(false);
        setErrorMsg(getAuthErrorMessage(err));
      }
    }
  };

  const officialHelpline = systemSettings?.supportPhone || '+254 793 749 604';
  const bonusPct = systemSettings?.promoBonusPercent ?? 10;

  return (
    <div className="min-h-screen flex flex-col justify-between py-6 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Top Brand Bar */}
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between pb-6 border-b border-slate-800/80">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/25 flex items-center justify-center">
            <div className="w-full h-full bg-[#080D1A] rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-black tracking-tight text-white">KEN_TECH LIKES</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                KENYA
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Automated Social Media Growth & SMM Reseller Hub</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-2">
          {onOpenQrCode && (
            <button
              type="button"
              onClick={onOpenQrCode}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer shadow-sm group"
              title="Scan QR Code to open on mobile"
            >
              <QrCode className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>Scan QR Code</span>
            </button>
          )}

          {onExploreGuest && (
            <button
              type="button"
              onClick={onExploreGuest}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Explore Services as Guest</span>
              <span className="sm:hidden">Guest Mode</span>
            </button>
          )}
        </div>
      </div>

      {/* Dynamic Broadcast Announcement Banner if active */}
      {systemSettings?.broadcastNotice && (
        <div className="max-w-6xl mx-auto w-full mt-4 bg-gradient-to-r from-emerald-950/80 via-slate-900 to-emerald-950/80 border border-emerald-500/40 rounded-2xl px-4 py-2.5 text-xs flex items-center space-x-2.5 text-slate-200 shadow-xl backdrop-blur-md">
          <span className="flex h-2 w-2 relative flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-bold text-emerald-400 uppercase tracking-wider text-[11px]">Notice:</span>
          <span className="font-medium text-slate-200">{systemSettings.broadcastNotice}</span>
        </div>
      )}

      {/* Main Dual-Column Content */}
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto py-8">
        
        {/* Left Column: Value Proposition & Social Proof */}
        <div className="lg:col-span-6 space-y-6 text-left">
          
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-semibold backdrop-blur-md">
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span>Instant Safaricom M-Pesa STK Push Active &bull; &lt; 3s Delivery</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Grow Your Social Media <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                Instantly in Kenya
              </span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
              Register or log in to access Kenya's premier automated SMM reseller hub. 
              Get genuine followers, likes, views, and subscribers with instant M-Pesa automated fulfillment.
            </p>
          </div>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-md flex items-start space-x-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Instant Automated Delivery</h4>
                <p className="text-[11px] text-slate-400">Fulfillment starts automatically in under 3 seconds upon ordering.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-md flex items-start space-x-3">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Direct M-Pesa STK Push</h4>
                <p className="text-[11px] text-slate-400">Pay directly via SIM PIN prompt or Paybill 522522 with zero delays.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-md flex items-start space-x-3">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Wholesale Rates (From 45 Bob)</h4>
                <p className="text-[11px] text-slate-400">Likes and views starting from 45 KES per 100 for TikTok, IG, FB & YT.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-md flex items-start space-x-3">
              <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">100% Safe & Passwordless</h4>
                <p className="text-[11px] text-slate-400">We never ask for your social media password—only your public profile link.</p>
              </div>
            </div>
          </div>

          {/* Social Proof Banner */}
          <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex -space-x-2 overflow-hidden">
                <span className="inline-block h-8 w-8 rounded-full ring-2 ring-[#080D1A] bg-emerald-500 text-black font-black text-xs flex items-center justify-center">K</span>
                <span className="inline-block h-8 w-8 rounded-full ring-2 ring-[#080D1A] bg-teal-500 text-black font-black text-xs flex items-center justify-center">N</span>
                <span className="inline-block h-8 w-8 rounded-full ring-2 ring-[#080D1A] bg-cyan-500 text-black font-black text-xs flex items-center justify-center">O</span>
              </div>
              <div>
                <p className="text-xs font-bold text-white">14,200+ Active Kenyan Clients</p>
                <p className="text-[11px] text-slate-400">Over 89,400 orders completed automatically</p>
              </div>
            </div>
            <span className="hidden sm:inline-flex px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
              +{bonusPct}% Deposit Bonus
            </span>
          </div>

        </div>

        {/* Right Column: Interactive Login / Register Form */}
        <div className="lg:col-span-6 w-full max-w-md mx-auto">
          <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative">
            
            {/* Ambient inner glow */}
            <div className="absolute top-0 right-1/4 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
            
            {/* Mode Switcher Tabs */}
            <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-800/80 mb-6">
              <button
                type="button"
                onClick={() => handleSwitchTab('login')}
                className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  tab === 'login'
                    ? 'bg-emerald-500 text-black shadow-md font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => handleSwitchTab('register')}
                className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center transition-all cursor-pointer ${
                  tab === 'register'
                    ? 'bg-emerald-500 text-black shadow-md font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Register</span>
              </button>
            </div>

            {/* Error Message Alert */}
            {errorMsg && (
              <div className="mb-5 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start space-x-2.5 text-rose-300 text-xs animate-shake">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
                <span className="font-medium leading-relaxed">{errorMsg}</span>
              </div>
            )}

            {/* Password Reset Sent Alert */}
            {resetSuccessMsg && (
              <div className="mb-5 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start space-x-2.5 text-emerald-300 text-xs">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-400" />
                <span className="font-medium leading-relaxed">{resetSuccessMsg}</span>
              </div>
            )}

            {/* Tab Form Content */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* REGISTER ONLY: Full Name / Username */}
              {tab === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 text-left">
                    Full Name or Desired Username
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        setErrorMsg(null);
                      }}
                      placeholder="e.g. Brian Mwangi or MwangiTech"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* ALL TABS: Email Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 text-left">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrorMsg(null);
                    }}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              {/* REGISTER ONLY: M-Pesa Phone Number */}
              {tab === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 text-left flex items-center justify-between">
                    <span>Safaricom M-Pesa Phone Number</span>
                    <span className="text-[10px] text-emerald-400 font-normal">For STK Push</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        setErrorMsg(null);
                      }}
                      placeholder="0793749604 or 07XXXXXXXX"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                    />
                  </div>
                </div>
              )}

              {/* LOGIN & REGISTER: Password */}
              {tab !== 'reset-password' && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-300 text-left">
                      Password
                    </label>
                    {tab === 'login' && (
                      <button
                        type="button"
                        onClick={() => handleSwitchTab('reset-password')}
                        className="text-[11px] text-emerald-400 hover:text-emerald-300 font-medium transition-colors cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setErrorMsg(null);
                      }}
                      placeholder={tab === 'register' ? 'Min 6 characters' : 'Enter your password'}
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* REGISTER ONLY: Confirm Password */}
              {tab === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 text-left">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setErrorMsg(null);
                      }}
                      placeholder="Repeat your password"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* REGISTER ONLY: Terms Checkbox */}
              {tab === 'register' && (
                <div className="flex items-start space-x-2 pt-1 text-left">
                  <input
                    type="checkbox"
                    id="terms-checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500/20 bg-slate-950 cursor-pointer"
                  />
                  <label htmlFor="terms-checkbox" className="text-[11px] text-slate-400 leading-snug">
                    I agree to KenTech's{' '}
                    <button
                      type="button"
                      onClick={onOpenTerms}
                      className="text-emerald-400 hover:underline cursor-pointer"
                    >
                      Terms of Service & Prohibited Content Policy
                    </button>.
                  </label>
                </div>
              )}

              {/* RESET PASSWORD INSTRUCTION */}
              {tab === 'reset-password' && (
                <p className="text-xs text-slate-400 text-left leading-relaxed">
                  Enter your registered email address and we'll send you an encrypted link to reset your account password.
                </p>
              )}

              {/* Action Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 hover:from-emerald-400 hover:to-teal-400 text-black font-black text-xs sm:text-sm tracking-wide flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer disabled:opacity-50 active:scale-98"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Securely...</span>
                  </>
                ) : tab === 'login' ? (
                  <>
                    <span>Sign In to KenTech Hub</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : tab === 'register' ? (
                  <>
                    <span>Create Account</span>
                    <Sparkles className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <span>Send Password Reset Link</span>
                    <Mail className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Back to Login from Reset */}
              {tab === 'reset-password' && (
                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => handleSwitchTab('login')}
                    className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    &larr; Back to Sign In
                  </button>
                </div>
              )}

            </form>

            {/* Bottom link: Explore services without auth */}
            {onExploreGuest && (
              <div className="mt-4 pt-3 text-center">
                <button
                  type="button"
                  onClick={onExploreGuest}
                  className="text-xs text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer flex items-center justify-center space-x-1 mx-auto"
                >
                  <span>Want to check out wholesale pricing first?</span>
                  <span className="text-emerald-400 font-bold underline">View as Guest</span>
                </button>
              </div>
            )}

          </div>
        </div>

      </div>

      {/* Bottom Footer Bar */}
      <div className="max-w-6xl mx-auto w-full pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 space-y-2 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <span>&copy; {new Date().getFullYear()} KenTech Likes Social Media Services Ltd.</span>
          <button
            type="button"
            onClick={onOpenTerms}
            className="hover:text-slate-300 transition-colors cursor-pointer"
          >
            Terms & Policy
          </button>
          {onOpenQrCode && (
            <button
              type="button"
              onClick={onOpenQrCode}
              className="text-emerald-400 hover:text-emerald-300 flex items-center space-x-1 cursor-pointer font-medium"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>App QR Code</span>
            </button>
          )}
        </div>
        <div className="flex items-center space-x-3 text-slate-400">
          <span>Nairobi 24/7 Helpline: {officialHelpline}</span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span className="text-emerald-400 font-semibold">100% Safe SSL</span>
        </div>
      </div>

    </div>
  );
};
