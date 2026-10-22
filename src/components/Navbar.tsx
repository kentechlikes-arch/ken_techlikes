import React, { useState } from 'react';
import { 
  Sparkles, 
  Wallet, 
  PlusCircle, 
  Menu, 
  X, 
  ShieldCheck, 
  HelpCircle, 
  Code2, 
  Clock, 
  ChevronDown, 
  Palette,
  Gift,
  User,
  Percent,
  LogIn,
  LogOut,
  KeyRound,
  UserPlus,
  FileText,
  Scale
} from 'lucide-react';
import { Currency, ThemePreset, UserProfile } from '../types';
import { formatCurrency } from '../data/servicesData';
import { DownloadAppButton } from './DownloadAppButton';
import { User as FirebaseUser } from 'firebase/auth';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  walletBalance: number;
  onOpenDeposit: () => void;
  theme: ThemePreset;
  setTheme: (t: ThemePreset) => void;
  firebaseConnected?: boolean;
  currentUser?: FirebaseUser | null;
  userProfile?: UserProfile | null;
  onOpenAuth: (mode?: 'login' | 'register' | 'reset-password') => void;
  onLogout: () => void;
  isAdmin?: boolean;
  onOpenTerms?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currency,
  setCurrency,
  walletBalance,
  onOpenDeposit,
  theme,
  setTheme,
  firebaseConnected,
  currentUser,
  userProfile,
  onOpenAuth,
  onLogout,
  isAdmin = false,
  onOpenTerms,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isRealUser = currentUser && !currentUser.isAnonymous;

  const navItems = [
    { id: 'order', label: 'New order', icon: Sparkles },
    { id: 'my-orders', label: 'My orders', icon: Clock },
    { id: 'bonus', label: 'Bonus 10%', icon: Gift, badge: '10%' },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'api', label: 'API', icon: Code2 },
    { id: 'support', label: 'Support', icon: HelpCircle },
    ...(isAdmin ? [{ id: 'admin', label: 'Admin Hub', icon: ShieldCheck, badge: 'ADMIN' }] : []),
  ];

  const themes: { id: ThemePreset; name: string; dot: string }[] = [
    { id: 'emerald-obsidian', name: 'Nairobi Cyber Emerald (Default)', dot: 'bg-emerald-500' },
    { id: 'sapphire-cyber', name: 'Electric Sapphire & Blue', dot: 'bg-blue-500' },
    { id: 'sunset-gold', name: 'Kenyan Sunset Amber', dot: 'bg-amber-500' },
    { id: 'sleek-slate', name: 'Titanium Slate Minimal', dot: 'bg-slate-400' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-slate-800/80 backdrop-blur-xl">
      {/* Top micro announcement bar */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-emerald-950/60 border-b border-emerald-500/20 py-1.5 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 text-slate-300">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-medium text-emerald-400">KEN_TECH LIKES:</span>
            <span className="hidden sm:inline text-slate-300">Kenya's #1 Automated SMM Growth Panel &bull; Instant M-Pesa STK Push 24/7</span>
            <span className="sm:hidden text-slate-300">Instant M-Pesa Delivery 24/7</span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1.5 text-slate-400 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline">0% Password Required &bull; 100% Safe</span>
            </div>
            {firebaseConnected && (
              <div className="flex items-center space-x-1 text-emerald-400 text-[11px] bg-emerald-950/70 border border-emerald-500/30 px-2 py-0.5 rounded font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Firebase Synced</span>
              </div>
            )}
            <div className="flex items-center space-x-1 text-slate-300 text-[11px] bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/60">
              <span className="text-emerald-400 font-bold">KES</span>
              <span>Accepted via M-Pesa</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo */}
          <div 
            onClick={() => setActiveTab('order')}
            className="flex items-center space-x-3 cursor-pointer group select-none"
          >
            <div className="relative">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-indigo-600 flex items-center justify-center p-0.5 shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-all">
                <div className="w-full h-full bg-[#080D1A] rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-emerald-400 group-hover:rotate-12 transition-transform" />
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 text-[9px] font-black bg-emerald-500 text-black px-1 rounded-sm leading-tight shadow">
                KE
              </span>
            </div>

            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-mono">
                  KEN<span className="text-emerald-400">_TECH</span>
                </span>
                <span className="text-xs sm:text-sm font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  LIKES
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide hidden sm:block">
                Social Growth & SMM Panel
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = 
                activeTab === item.id || 
                (item.id === 'my-orders' && activeTab === 'track') ||
                (item.id === 'support' && activeTab === 'faq');
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-950/20' 
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-amber-500/25 text-amber-300 border border-amber-500/40 ml-1">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Tools: Currency, Wallet, Theme & Deposit */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Theme switcher dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setThemeDropdownOpen(!themeDropdownOpen);
                  setCurrencyDropdownOpen(false);
                }}
                title="Change Background Theme"
                className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/60 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40 transition-colors"
              >
                <Palette className="w-4 h-4" />
              </button>

              {themeDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900 border border-slate-800 p-2 shadow-2xl z-50">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1">
                    Theme Palette
                  </div>
                  {themes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setTheme(t.id);
                        setThemeDropdownOpen(false);
                      }}
                      className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-left transition-colors ${
                        theme === t.id ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full ${t.dot}`}></span>
                      <span className="truncate">{t.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Currency selector */}
            <div className="relative">
              <button
                onClick={() => {
                  setCurrencyDropdownOpen(!currencyDropdownOpen);
                  setThemeDropdownOpen(false);
                }}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/80 text-xs font-semibold text-slate-200 hover:border-slate-600 transition-colors"
              >
                <span className="text-emerald-400 font-mono">{currency}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {currencyDropdownOpen && (
                <div className="absolute right-0 mt-2 w-32 rounded-xl bg-slate-900 border border-slate-800 p-1.5 shadow-2xl z-50">
                  {(['KES', 'USD', 'EUR', 'NGN'] as Currency[]).map((cur) => (
                    <button
                      key={cur}
                      onClick={() => {
                        setCurrency(cur);
                        setCurrencyDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between ${
                        currency === cur ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span>{cur}</span>
                      {currency === cur && <span className="text-emerald-400">&bull;</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Wallet balance display + Instant Deposit button */}
            <div className="flex items-center bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 rounded-xl p-1 transition-all shadow-inner">
              <div 
                onClick={onOpenDeposit}
                className="flex items-center space-x-2 px-2.5 py-1 cursor-pointer"
                title="Your Current Balance. Click to Deposit."
              >
                <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Wallet className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[10px] text-slate-400 leading-none">Wallet</span>
                  <span className="text-xs font-bold text-white font-mono leading-tight">
                    {formatCurrency(walletBalance, currency)}
                  </span>
                </div>
              </div>

              <button
                onClick={onOpenDeposit}
                className="flex items-center space-x-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg shadow-sm shadow-emerald-900/30 transition-all active:scale-95 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Top Up</span>
              </button>
            </div>

            {/* Admin console button for authorized admin */}
            {isAdmin && (
              <button
                type="button"
                onClick={() => setActiveTab(activeTab === 'admin' ? 'order' : 'admin')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  activeTab === 'admin'
                    ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/40 ring-1 ring-emerald-400'
                    : 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 hover:bg-emerald-900/60'
                }`}
                title="Open Admin Operations Console"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Admin Hub</span>
              </button>
            )}

            {/* User Account / Auth Trigger */}
            {isRealUser ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/50 rounded-xl px-2.5 py-1.5 transition-all cursor-pointer shadow-sm"
                >
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-black text-xs flex items-center justify-center">
                    {(userProfile?.displayName || currentUser?.displayName || currentUser?.email || 'U').charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden xl:inline text-xs font-bold text-slate-200 max-w-[90px] truncate">
                    {userProfile?.displayName || currentUser?.displayName || currentUser?.email?.split('@')[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-[#0D131F] border border-slate-800 rounded-2xl shadow-2xl py-2 z-50 animate-fade-in">
                    <div className="px-4 py-2.5 border-b border-slate-800/80">
                      <p className="text-xs font-black text-white truncate">
                        {userProfile?.displayName || currentUser?.displayName || 'Registered Client'}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate font-mono">
                        {currentUser?.email}
                      </p>
                      <div className="mt-1.5 flex items-center space-x-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                          isAdmin 
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}>
                          {isAdmin ? 'System Administrator' : (userProfile?.accountTier || 'Gold VIP')}
                        </span>
                        <span className="text-[10px] text-emerald-400 font-bold">&bull; Active</span>
                      </div>
                    </div>

                    {/* Admin Direct Option */}
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('admin');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-xs font-black text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/40 flex items-center space-x-2.5 transition-colors cursor-pointer bg-emerald-950/20 border-b border-emerald-500/20"
                      >
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>Admin Operations Console</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('profile');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 flex items-center space-x-2.5 transition-colors cursor-pointer"
                    >
                      <User className="w-4 h-4 text-emerald-400" />
                      <span>My Profile & Wallet</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onOpenAuth('reset-password');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 flex items-center space-x-2.5 transition-colors cursor-pointer"
                    >
                      <KeyRound className="w-4 h-4 text-amber-400" />
                      <span>Reset Password</span>
                    </button>

                    {onOpenTerms && (
                      <button
                        type="button"
                        onClick={() => {
                          onOpenTerms();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 flex items-center space-x-2.5 transition-colors cursor-pointer"
                      >
                        <FileText className="w-4 h-4 text-emerald-400" />
                        <span>Terms & Prohibited Rules</span>
                      </button>
                    )}

                    <div className="border-t border-slate-800/80 my-1"></div>

                    <button
                      type="button"
                      onClick={() => {
                        onLogout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 flex items-center space-x-2.5 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-rose-400" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-1.5">
                <button
                  type="button"
                  onClick={() => onOpenAuth('login')}
                  className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/80 flex items-center space-x-1 transition-colors cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
                <button
                  type="button"
                  onClick={() => onOpenAuth('register')}
                  className="px-3 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black shadow-md shadow-emerald-950/30 flex items-center space-x-1 transition-all cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register</span>
                </button>
              </div>
            )}

            {/* Install / Download App Button */}
            <div className="hidden md:block">
              <DownloadAppButton />
            </div>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-slate-800/80 border border-slate-700/80 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-[#0B101E] px-4 pt-3 pb-6 space-y-2">
          {/* Mobile Auth banner */}
          <div className="p-3 mb-2 rounded-2xl bg-[#121A2A] border border-slate-700/80">
            {isRealUser ? (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 font-black text-xs flex items-center justify-center">
                      {(userProfile?.displayName || currentUser?.displayName || currentUser?.email || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white truncate max-w-[150px]">
                        {userProfile?.displayName || currentUser?.displayName || 'Registered Client'}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate max-w-[150px]">
                        {currentUser?.email}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    {userProfile?.accountTier || 'Gold'}
                  </span>
                </div>
                <div className="flex items-center space-x-2 pt-2 border-t border-slate-700/60">
                  <button
                    onClick={() => {
                      onOpenAuth('reset-password');
                      setMobileMenuOpen(false);
                    }}
                    className="flex-1 py-1 px-2 rounded-lg bg-slate-800 text-amber-300 text-[11px] font-semibold flex items-center justify-center space-x-1"
                  >
                    <KeyRound className="w-3 h-3" />
                    <span>Reset Pass</span>
                  </button>
                  <button
                    onClick={() => {
                      onLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex-1 py-1 px-2 rounded-lg bg-rose-950/40 text-rose-300 text-[11px] font-semibold flex items-center justify-center space-x-1"
                  >
                    <LogOut className="w-3 h-3" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    onOpenAuth('login');
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold flex items-center justify-center space-x-1"
                >
                  <LogIn className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Sign In</span>
                </button>
                <button
                  onClick={() => {
                    onOpenAuth('register');
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-2 rounded-xl bg-emerald-500 text-black text-xs font-black flex items-center justify-center space-x-1 shadow-md shadow-emerald-950/40"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register (+50 KES)</span>
                </button>
              </div>
            )}
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = 
              activeTab === item.id || 
              (item.id === 'my-orders' && activeTab === 'track') ||
              (item.id === 'support' && activeTab === 'faq');
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                  isActive 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                    : 'text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-amber-500/25 text-amber-300 border border-amber-500/40">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-xs text-slate-400">Add funds via M-Pesa:</span>
            <button
              onClick={() => {
                onOpenDeposit();
                setMobileMenuOpen(false);
              }}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold"
            >
              Lipa Na M-Pesa STK
            </button>
          </div>

          {onOpenTerms && (
            <button
              onClick={() => {
                onOpenTerms();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center space-x-2 px-3 py-2 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer border-t border-slate-800/60"
            >
              <Scale className="w-4 h-4 text-emerald-400" />
              <span>Platform Terms & Prohibited Rules</span>
            </button>
          )}

          <div className="pt-2 flex justify-center">
            <DownloadAppButton />
          </div>
        </div>
      )}
    </header>
  );
};
