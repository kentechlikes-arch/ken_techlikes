import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Eye, 
  EyeOff, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft,
  Loader2,
  ShieldCheck
} from 'lucide-react';
import { 
  registerAccount, 
  loginAccount, 
  resetPassword, 
  getAuthErrorMessage 
} from '../lib/firebase';
import { isReservedUsername } from '../lib/termsPolicy';

export type AuthMode = 'login' | 'register' | 'reset-password';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: AuthMode;
  onSuccess?: () => void;
  onOpenTerms?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  onSuccess,
  onOpenTerms
}) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resetSuccessMsg, setResetSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const resetForm = () => {
    setErrorMsg(null);
    setResetSuccessMsg(null);
  };

  const handleSwitchMode = (newMode: AuthMode) => {
    resetForm();
    setMode(newMode);
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setResetSuccessMsg(null);

    // Validation
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (mode === 'login') {
      if (!password) {
        setErrorMsg('Please enter your password.');
        return;
      }
      try {
        setLoading(true);
        await loginAccount(email, password);
        setLoading(false);
        if (onSuccess) onSuccess();
        onClose();
      } catch (err: any) {
        setLoading(false);
        setErrorMsg(getAuthErrorMessage(err));
      }
    } else if (mode === 'register') {
      if (!fullName.trim()) {
        setErrorMsg('Please enter your full name or nickname.');
        return;
      }
      const reservedCheck = isReservedUsername(fullName.trim());
      if (reservedCheck.isReserved) {
        setErrorMsg(reservedCheck.reason || 'This username is reserved by the system. Please choose another username.');
        return;
      }
      const emailPrefixCheck = isReservedUsername(email.split('@')[0]);
      if (emailPrefixCheck.isReserved) {
        setErrorMsg(emailPrefixCheck.reason || 'This email username contains a reserved system term.');
        return;
      }
      if (!password || password.length < 6) {
        setErrorMsg('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match. Please re-enter.');
        return;
      }
      try {
        setLoading(true);
        await registerAccount(email, password, fullName, phone);
        setLoading(false);
        if (onSuccess) onSuccess();
        onClose();
      } catch (err: any) {
        setLoading(false);
        setErrorMsg(getAuthErrorMessage(err));
      }
    } else if (mode === 'reset-password') {
      try {
        setLoading(true);
        await resetPassword(email);
        setLoading(false);
        setResetSuccessMsg(
          `A password reset link has been dispatched to ${email}. Please check your inbox (and spam folder) to set your new password.`
        );
      } catch (err: any) {
        setLoading(false);
        setErrorMsg(getAuthErrorMessage(err));
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-md bg-[#0D131F] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-black font-black mx-auto mb-3 shadow-lg shadow-emerald-950/40">
            <Sparkles className="w-6 h-6" />
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white">
            {mode === 'login' && 'Sign In to KEN_TECH'}
            {mode === 'register' && 'Create Your Account'}
            {mode === 'reset-password' && 'Reset Your Password'}
          </h3>

          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {mode === 'login' && 'Access your synced orders, wallet, and reseller rates'}
            {mode === 'register' && 'Get 50 KES free welcome bonus + instant M-Pesa automated access'}
            {mode === 'reset-password' && "We'll send you a secure Firebase link to reset your password"}
          </p>
        </div>

        {/* Tabs for Login vs Register */}
        {mode !== 'reset-password' && (
          <div className="flex bg-slate-900/90 p-1 rounded-xl border border-slate-800 mb-6">
            <button
              type="button"
              onClick={() => handleSwitchMode('login')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                mode === 'login'
                  ? 'bg-emerald-500 text-black shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => handleSwitchMode('register')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                mode === 'register'
                  ? 'bg-emerald-500 text-black shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Register (+50 KES Free)
            </button>
          </div>
        )}

        {/* Error notification */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-start space-x-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMsg}</span>
          </div>
        )}

        {/* Password Reset Success notification */}
        {resetSuccessMsg && (
          <div className="mb-4 p-4 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-200 text-xs flex items-start space-x-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed">{resetSuccessMsg}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Register: Full Name */}
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Full Name / Username
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="e.g. John Mwangi"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#121A2A] border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                />
              </div>
            </div>
          )}

          {/* Email Address */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                placeholder="you@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#121A2A] border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
              />
            </div>
          </div>

          {/* Register: Phone Number */}
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                M-Pesa Safaricom Phone Number <span className="text-slate-500 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="tel"
                  placeholder="0712 345 678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#121A2A] border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                />
              </div>
            </div>
          )}

          {/* Password (for Login & Register) */}
          {mode !== 'reset-password' && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-300">
                  Password
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => handleSwitchMode('reset-password')}
                    className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#121A2A] border border-slate-700/80 rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Confirm Password (for Register) */}
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#121A2A] border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                />
              </div>
            </div>
          )}

          {/* Bonus callout on Register */}
          {mode === 'register' && (
            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-emerald-300 text-xs flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Includes <strong>50 KES</strong> instant signup bonus into your wallet!</span>
              </div>
              <p className="text-[11px] text-slate-400 text-center leading-normal">
                By registering, you agree to KEN_TECH LIKES{' '}
                <button
                  type="button"
                  onClick={onOpenTerms}
                  className="text-emerald-400 underline hover:text-emerald-300 font-semibold cursor-pointer"
                >
                  Platform Terms & Reserved Names Policy
                </button>
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-black text-sm tracking-wide shadow-lg shadow-emerald-950/40 flex items-center justify-center space-x-2 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-black" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                {mode === 'login' && <span>Sign In to Account</span>}
                {mode === 'register' && <span>Create My Account</span>}
                {mode === 'reset-password' && <span>Send Password Reset Link</span>}
              </>
            )}
          </button>

          {/* Back to sign in for Reset Password */}
          {mode === 'reset-password' && (
            <button
              type="button"
              onClick={() => handleSwitchMode('login')}
              className="w-full py-2.5 text-xs font-bold text-slate-400 hover:text-white flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
            </button>
          )}

          {/* Footer note */}
          <div className="text-center pt-2">
            <div className="flex items-center justify-center space-x-1.5 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Protected by Firebase Authentication & 256-Bit SSL</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
