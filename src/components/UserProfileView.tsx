import React, { useState } from 'react';
import { 
  User, 
  Wallet, 
  ShieldCheck, 
  Smartphone, 
  Key, 
  Copy, 
  Check, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  Award,
  PlusCircle,
  FileText,
  KeyRound,
  LogOut,
  LogIn,
  UserPlus,
  Sparkles,
  Mail,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Currency, TransactionRecord, OrderRecord, UserProfile } from '../types';
import { formatCurrency } from '../data/servicesData';
import { User as FirebaseUser } from 'firebase/auth';
import { resetPassword, getAuthErrorMessage, DESIGNATED_ADMIN_UID } from '../lib/firebase';

interface UserProfileViewProps {
  walletBalance: number;
  currency: Currency;
  onOpenDeposit: () => void;
  transactions: TransactionRecord[];
  orders: OrderRecord[];
  currentUser?: FirebaseUser | null;
  userProfile?: UserProfile | null;
  onOpenAuth: (mode?: 'login' | 'register' | 'reset-password') => void;
  onLogout: () => void;
  onNavigateToAdmin?: () => void;
  isAdmin?: boolean;
  onOpenTerms?: () => void;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({
  walletBalance,
  currency,
  onOpenDeposit,
  transactions,
  orders,
  currentUser,
  userProfile,
  onOpenAuth,
  onLogout,
  onNavigateToAdmin,
  isAdmin = false,
  onOpenTerms,
}) => {
  const [copiedKey, setCopiedKey] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);
  const [resetFeedback, setResetFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const isRealUser = currentUser && !currentUser.isAnonymous;
  const isUserAdmin = isAdmin || currentUser?.uid === DESIGNATED_ADMIN_UID || userProfile?.role === 'admin' || userProfile?.isAdmin === true;
  const apiKey = userProfile?.apiKey || 'kt_live_9a72b8d410f92ce388b17a6';

  const totalSpent = orders.reduce((sum, o) => sum + o.charge, 0);
  const totalDeposited = transactions
    .filter((t) => t.type === 'deposit')
    .reduce((sum, t) => sum + t.amount, 0);

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleQuickPasswordReset = async () => {
    if (!currentUser?.email) {
      onOpenAuth('reset-password');
      return;
    }
    try {
      setResettingPassword(true);
      setResetFeedback(null);
      await resetPassword(currentUser.email);
      setResettingPassword(false);
      setResetFeedback({
        type: 'success',
        message: `Password reset instructions sent to ${currentUser.email}. Check your email to set a new password.`
      });
    } catch (err: any) {
      setResettingPassword(false);
      setResetFeedback({
        type: 'error',
        message: getAuthErrorMessage(err)
      });
    }
  };

  const userDisplayName = isUserAdmin ? 'System Administrator' : (userProfile?.displayName || currentUser?.displayName || 'Ken_Tech Client');
  const userEmail = currentUser?.email || 'kentechlikeS@gmail.com';
  const userPhone = userProfile?.phoneNumber || '0793 749 604';
  const userTier = isUserAdmin ? 'Super Administrator' : (userProfile?.accountTier || 'Gold VIP Reseller');
  const userInitials = isUserAdmin ? 'AD' : (userDisplayName || 'KT').substring(0, 2).toUpperCase();

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      
      {/* Admin Quick Launch Banner */}
      {isUserAdmin && onNavigateToAdmin && (
        <div className="rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border border-emerald-500/50 p-5 sm:p-6 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="text-sm sm:text-base font-black text-white">
                  Administrator Privileges Active
                </h4>
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-500 text-black">
                  Admin
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 font-mono">
                UID: {currentUser?.uid || DESIGNATED_ADMIN_UID} &bull; Full CRUD permissions authorized
              </p>
            </div>
          </div>
          <button
            onClick={onNavigateToAdmin}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black text-xs font-black shadow-lg shadow-emerald-950/40 flex items-center justify-center space-x-1.5 cursor-pointer shrink-0"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Launch Admin Console</span>
          </button>
        </div>
      )}

      {/* Guest Mode Callout */}
      {!isRealUser && (
        <div className="rounded-3xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-emerald-950/70 border border-emerald-500/40 p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-md">
          <div className="flex items-start space-x-3.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 flex-shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-black text-white">
                Browsing as Guest &bull; Unlock Synced Account
              </h4>
              <p className="text-xs text-slate-300 mt-1 max-w-lg">
                Create a registered account to sync your orders across devices, unlock password protection, and receive a <strong>50 KES Free Welcome Bonus</strong>!
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2.5 flex-shrink-0">
            <button
              onClick={() => onOpenAuth('login')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={() => onOpenAuth('register')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black text-xs font-black shadow-md shadow-emerald-950/40 flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Account (+50 KES)</span>
            </button>
          </div>
        </div>
      )}

      {/* Password Reset In-Profile Alert */}
      {resetFeedback && (
        <div className={`p-4 rounded-2xl text-xs flex items-start space-x-3 border ${
          resetFeedback.type === 'success' 
            ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200' 
            : 'bg-rose-950/60 border-rose-500/40 text-rose-200'
        }`}>
          {resetFeedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
          )}
          <span className="leading-relaxed flex-1">{resetFeedback.message}</span>
        </div>
      )}

      {/* Profile Header Card */}
      <div className="rounded-3xl bg-[#0B111E] border border-slate-800 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-black font-black text-2xl shadow-lg shadow-emerald-950/40 flex-shrink-0">
              {userInitials}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  {userDisplayName}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {userTier}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-300 mt-1 font-medium">
                {currentUser?.email && (
                  <span className="flex items-center space-x-1 font-mono text-emerald-300">
                    <Mail className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{currentUser.email}</span>
                  </span>
                )}
                {userPhone && (
                  <>
                    <span className="text-slate-600 hidden sm:inline">&bull;</span>
                    <span className="flex items-center space-x-1">
                      <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="font-mono">{userPhone}</span>
                    </span>
                  </>
                )}
                <span className="text-slate-600 hidden sm:inline">&bull;</span>
                <span className="text-emerald-400 font-semibold flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isRealUser ? 'Firebase Verified Account' : 'Guest Session'}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenDeposit}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-black text-xs sm:text-sm tracking-wide shadow-lg shadow-emerald-950/30 flex items-center justify-center space-x-2 cursor-pointer active:scale-95 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Top Up Wallet</span>
            </button>

            {isRealUser ? (
              <button
                onClick={onLogout}
                className="p-2.5 rounded-2xl bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-700/80 transition-colors cursor-pointer"
                title="Sign out of your account"
              >
                <LogOut className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => onOpenAuth('login')}
                className="p-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 transition-colors cursor-pointer"
                title="Sign In"
              >
                <LogIn className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Security & Password Reset Action Card */}
        <div className="mt-6 p-4 rounded-2xl bg-[#121A2A] border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">
                Account Security & Password Management
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {isRealUser 
                  ? `Need to change or reset your password? Click to receive a secure link at ${currentUser?.email}.` 
                  : 'Register or sign in with email and password to secure your wallet and order history.'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0">
            {isRealUser ? (
              <button
                onClick={handleQuickPasswordReset}
                disabled={resettingPassword}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-amber-500/30 text-amber-300 hover:text-amber-200 text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
              >
                {resettingPassword ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <KeyRound className="w-3.5 h-3.5" />
                )}
                <span>Reset Password</span>
              </button>
            ) : (
              <button
                onClick={() => onOpenAuth('reset-password')}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300 text-xs font-bold flex items-center space-x-1.5 cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Forgot Password?</span>
              </button>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="p-4 rounded-2xl bg-[#121A2A] border border-slate-700/80">
            <span className="text-xs font-bold text-slate-400 block mb-1">Current Balance</span>
            <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
              {formatCurrency(walletBalance, currency)}
            </span>
            <span className="text-[11px] text-slate-400 block mt-1">Available for instant orders</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#121A2A] border border-slate-700/80">
            <span className="text-xs font-bold text-slate-400 block mb-1">Total Orders</span>
            <span className="text-xl sm:text-2xl font-black text-white font-mono">
              {orders.length}
            </span>
            <span className="text-[11px] text-emerald-400 block mt-1">99.8% Completion rate</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#121A2A] border border-slate-700/80">
            <span className="text-xs font-bold text-slate-400 block mb-1">Total Spent</span>
            <span className="text-xl sm:text-2xl font-black text-white font-mono">
              {formatCurrency(totalSpent, currency)}
            </span>
            <span className="text-[11px] text-slate-400 block mt-1">Lifetime services purchased</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#121A2A] border border-slate-700/80">
            <span className="text-xs font-bold text-slate-400 block mb-1">M-Pesa Deposits</span>
            <span className="text-xl sm:text-2xl font-black text-amber-400 font-mono">
              {formatCurrency(totalDeposited || 6500, currency)}
            </span>
            <span className="text-[11px] text-slate-400 block mt-1">Lipa Na M-Pesa verified</span>
          </div>
        </div>
      </div>

      {/* Secret API Key Card */}
      <div className="rounded-3xl bg-[#0B111E] border border-slate-800 p-6 sm:p-8 shadow-xl space-y-3">
        <div className="flex items-center space-x-2">
          <Key className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base sm:text-lg font-black text-white">
            Reseller API Key
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-slate-300">
          Use this secret key to connect automated SMM panels, Python bots, or custom apps directly to KEN_TECH LIKES servers.
        </p>

        <div className="flex items-center space-x-2 bg-[#121A2A] p-2 rounded-xl border border-slate-700">
          <span className="font-mono text-xs text-emerald-300 flex-1 truncate px-2">
            {apiKey}
          </span>
          <button
            onClick={handleCopyKey}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black flex items-center space-x-1 cursor-pointer"
          >
            {copiedKey ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedKey ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Recent M-Pesa & Wallet Transactions Ledger */}
      <div className="rounded-3xl bg-[#0B111E] border border-slate-800 p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base sm:text-lg font-black text-white">
              Financial Statement & M-Pesa Ledger
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {transactions.length} Transactions
          </span>
        </div>

        <div className="divide-y divide-slate-800/80">
          {transactions.map((txn) => {
            const isDeposit = txn.type === 'deposit';
            const isBonus = txn.type === 'bonus';
            return (
              <div key={txn.id} className="py-3.5 flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center space-x-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    isBonus 
                      ? 'bg-amber-500/20 text-amber-400' 
                      : isDeposit 
                        ? 'bg-emerald-500/20 text-emerald-400' 
                        : 'bg-slate-800 text-slate-300'
                  }`}>
                    {isBonus ? <Sparkles className="w-4 h-4" /> : isDeposit ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                  </div>
                  <div>
                    <span className="font-bold text-white block">
                      {isBonus ? 'Welcome Promo Bonus' : isDeposit ? 'M-PESA Top Up' : 'Order Payment'}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Ref: {txn.reference} &bull; {txn.timestamp}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`font-mono font-black ${
                    isDeposit || isBonus ? 'text-emerald-400' : 'text-slate-200'
                  }`}>
                    {isDeposit || isBonus ? '+' : '-'}{formatCurrency(txn.amount, currency)}
                  </span>
                  <span className="block text-[11px] text-emerald-400 font-semibold">
                    {txn.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Account Safety & Terms Compliance Card */}
      <div className="rounded-3xl bg-[#090E1A] border border-slate-800 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Platform Compliance & Prohibited Terms</h4>
            <p className="text-xs text-slate-400">
              Zero tolerance for adult/scam links, reserved username impersonation, and fraudulent M-Pesa reversals.
            </p>
          </div>
        </div>

        {onOpenTerms && (
          <button
            type="button"
            onClick={onOpenTerms}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
          >
            Review Prohibited Terms &rarr;
          </button>
        )}
      </div>

    </div>
  );
};
