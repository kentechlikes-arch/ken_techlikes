import React, { useState, useMemo } from 'react';
import { 
  X, 
  ShieldAlert, 
  ShieldCheck, 
  Search, 
  Lock, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  Ban, 
  ExternalLink,
  ChevronDown,
  Layers,
  Scale,
  Sparkles,
  PhoneCall,
  Mail
} from 'lucide-react';
import { 
  PLATFORM_POLICIES, 
  RESERVED_USERNAMES, 
  PROHIBITED_KEYWORDS,
  PolicySection 
} from '../lib/termsPolicy';
import { SUPPORT_EMAIL, SUPPORT_PHONE } from '../lib/firebase';

interface TermsAndPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: string;
}

export const TermsAndPolicyModal: React.FC<TermsAndPolicyModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'all',
}) => {
  if (!isOpen) return null;

  const [activeCategory, setActiveCategory] = useState<string>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSection, setExpandedSection] = useState<string | null>('prohibited-content');

  // Filter sections by search and category
  const filteredPolicies = useMemo(() => {
    return PLATFORM_POLICIES.filter((sec) => {
      const matchesCategory = activeCategory === 'all' || sec.id === activeCategory;
      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      const inTitle = sec.title.toLowerCase().includes(q);
      const inSummary = sec.summary.toLowerCase().includes(q);
      const inRules = sec.rules.some(
        (r) => r.heading.toLowerCase().includes(q) || r.description.toLowerCase().includes(q)
      );

      return inTitle || inSummary || inRules;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-3xl rounded-3xl bg-[#0B101E] border border-slate-800 shadow-2xl overflow-hidden relative animate-in fade-in zoom-in-95 my-6 flex flex-col max-h-[90vh]">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border-b border-emerald-500/20 p-5 sm:p-6 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shrink-0">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  Platform Terms & Prohibited Guidelines
                </h3>
                <span className="hidden sm:inline text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                  2026 Edition
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Reserved account identifiers, prohibited content categories & order compliance rules
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter Pills */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-[#090D17] space-y-3 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search prohibited terms (e.g., adult, ponzi, admin, refund, private account)..."
              className="w-full bg-[#121A2A] border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none pb-1 text-xs">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-emerald-500 text-black shadow'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              All Guidelines
            </button>
            <button
              onClick={() => setActiveCategory('prohibited-content')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === 'prohibited-content'
                  ? 'bg-rose-500 text-white shadow'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              🚫 Prohibited Content
            </button>
            <button
              onClick={() => setActiveCategory('reserved-terms')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === 'reserved-terms'
                  ? 'bg-amber-500 text-black shadow'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              🔒 Reserved Usernames
            </button>
            <button
              onClick={() => setActiveCategory('order-execution')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === 'order-execution'
                  ? 'bg-emerald-500 text-black shadow'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              ⚡ Public Profile Rules
            </button>
            <button
              onClick={() => setActiveCategory('payment-integrity')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === 'payment-integrity'
                  ? 'bg-cyan-500 text-black shadow'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              🇰🇪 M-Pesa Integrity
            </button>
          </div>
        </div>

        {/* Scrollable Policy Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Quick Notice Badge */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start space-x-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Account Compliance Notice:</strong> By depositing funds, creating an account, or placing orders on KEN_TECH LIKES, you agree not to submit prohibited links and not to claim reserved system handles. Automated filters scan all target links in real time.
            </div>
          </div>

          {/* Policy Sections Accordion */}
          <div className="space-y-4">
            {filteredPolicies.map((section) => {
              const isExpanded = expandedSection === section.id;
              return (
                <div 
                  key={section.id}
                  className="rounded-2xl bg-[#0F1626] border border-slate-800/80 overflow-hidden shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedSection(isExpanded ? null : section.id)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors cursor-pointer"
                  >
                    <div className="space-y-1 pr-3">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border ${section.badgeColor}`}>
                          {section.badge}
                        </span>
                        <h4 className="text-sm sm:text-base font-black text-white">
                          {section.title}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {section.summary}
                      </p>
                    </div>

                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform shrink-0 ${isExpanded ? 'rotate-180 text-emerald-400' : ''}`} />
                  </button>

                  {isExpanded && (
                    <div className="p-4 sm:p-5 pt-0 border-t border-slate-800/80 space-y-3 bg-[#0C1220]/60">
                      <div className="grid grid-cols-1 gap-3 pt-3">
                        {section.rules.map((rule, idx) => (
                          <div 
                            key={idx}
                            className={`p-3.5 rounded-xl border text-xs space-y-1 ${
                              rule.isStrict 
                                ? 'bg-rose-950/20 border-rose-500/30' 
                                : 'bg-[#121A2A] border-slate-800'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-white flex items-center space-x-1.5">
                                {rule.isStrict ? (
                                  <Ban className="w-3.5 h-3.5 text-rose-400" />
                                ) : (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                )}
                                <span>{rule.heading}</span>
                              </span>
                              {rule.isStrict && (
                                <span className="text-[9px] font-black uppercase tracking-wider text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded">
                                  Strict Ban
                                </span>
                              )}
                            </div>
                            <p className="text-slate-300 text-[11px] leading-relaxed">
                              {rule.description}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Special Interactive Section for Reserved Usernames */}
                      {section.id === 'reserved-terms' && (
                        <div className="mt-4 p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                          <span className="text-xs font-bold text-slate-200 block">
                            Examples of Restricted System Tokens:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {RESERVED_USERNAMES.slice(0, 20).map((name) => (
                              <span 
                                key={name}
                                className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-800 text-amber-300 border border-slate-700"
                              >
                                @{name}
                              </span>
                            ))}
                            <span className="text-[10px] text-slate-500 self-center pl-1">+ more</span>
                          </div>
                        </div>
                      )}

                      {/* Special Interactive Section for Prohibited Keywords */}
                      {section.id === 'prohibited-content' && (
                        <div className="mt-4 p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                          <span className="text-xs font-bold text-slate-200 block">
                            Prohibited Target Link Tokens (Scanned on checkout):
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {PROHIBITED_KEYWORDS.slice(0, 15).map((term) => (
                              <span 
                                key={term}
                                className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-rose-950/40 text-rose-300 border border-rose-500/30"
                              >
                                *{term}*
                              </span>
                            ))}
                            <span className="text-[10px] text-slate-500 self-center pl-1">...and related variants</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {filteredPolicies.length === 0 && (
              <div className="p-8 text-center space-y-2">
                <FileText className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-sm text-slate-400">No policy items matched "{searchQuery}"</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                  }}
                  className="text-xs text-emerald-400 underline font-bold"
                >
                  Reset search filters
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Bottom Actions Bar */}
        <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-[11px] text-slate-400 flex items-center space-x-2">
            <span>Questions or escalations?</span>
            <a 
              href={`mailto:${SUPPORT_EMAIL}`}
              className="text-emerald-400 font-mono hover:underline"
            >
              {SUPPORT_EMAIL}
            </a>
            <span>&bull;</span>
            <span className="font-mono text-slate-300">{SUPPORT_PHONE}</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs shadow-lg shadow-emerald-950/40 cursor-pointer transition-all active:scale-95"
          >
            I Understand & Agree
          </button>
        </div>

      </div>
    </div>
  );
};
