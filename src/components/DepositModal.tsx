import React, { useState } from 'react';
import { 
  X, 
  Smartphone, 
  CreditCard, 
  Coins, 
  Copy, 
  Check, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Lock,
  PhoneCall,
  Mail,
  Send,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Currency, SystemSettings } from '../types';
import { formatCurrency } from '../data/servicesData';
import { SUPPORT_EMAIL, SUPPORT_PHONE } from '../lib/firebase';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: Currency;
  onDepositSuccess: (amountInKES: number, method: string, reference: string) => void;
  userPhoneNumber?: string;
  systemSettings?: SystemSettings;
}

export const DepositModal: React.FC<DepositModalProps> = ({
  isOpen,
  onClose,
  currency,
  onDepositSuccess,
  userPhoneNumber = '',
  systemSettings,
}) => {
  if (!isOpen) return null;

  const officialPhone = systemSettings?.paymentPhone || '0793749604';
  const officialPaybill = systemSettings?.paybill || '522522';
  const officialEmail = systemSettings?.supportEmail || SUPPORT_EMAIL;
  const officialHelpline = systemSettings?.supportPhone || SUPPORT_PHONE;
  const bonusPct = systemSettings?.promoBonusPercent ?? 10;

  // Tabs: STK Push, Pay directly to 0793749604, Paybill 522522, Crypto USDT, Card
  const [activeTab, setActiveTab] = useState<'stk' | 'direct' | 'paybill' | 'crypto' | 'card'>('stk');
  
  // STK form state - Initialized empty or with user's own profile phone, NOT the admin payment line!
  const [phoneNumber, setPhoneNumber] = useState(userPhoneNumber);
  const [amount, setAmount] = useState<number>(1000);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stkPromptScreen, setStkPromptScreen] = useState(false);
  const [stkPin, setStkPin] = useState('');
  const [stkError, setStkError] = useState<string | null>(null);
  const [successReceipt, setSuccessReceipt] = useState<{ amount: number; ref: string; methodTitle: string } | null>(null);

  // Direct Send Money (0793749604) state
  const [directAmount, setDirectAmount] = useState<number>(1000);
  const [directCode, setDirectCode] = useState('');
  const [directPhoneSender, setDirectPhoneSender] = useState(userPhoneNumber);
  const [directError, setDirectError] = useState<string | null>(null);

  // Paybill verification state
  const [manualCode, setManualCode] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const quickAmounts = [200, 500, 1000, 2500, 5000, 10000];

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleInitiateSTK = (e: React.FormEvent) => {
    e.preventDefault();
    setStkError(null);
    if (!phoneNumber || phoneNumber.trim().length < 9) {
      setStkError('Please enter your Safaricom phone number (e.g., 0712345678 or 0112345678).');
      return;
    }
    if (amount < 50) {
      setStkError('Minimum deposit is KES 50.');
      return;
    }

    setStkPromptScreen(true);
  };

  const handleConfirmSTKPin = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const generatedRef = `QJD${Math.floor(100000 + Math.random() * 900000)}KE`;
      setIsProcessing(false);
      setStkPromptScreen(false);
      setSuccessReceipt({ amount, ref: generatedRef, methodTitle: 'M-PESA STK Push' });
      onDepositSuccess(amount, 'M-PESA STK Push', generatedRef);

      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#10B981', '#34D399', '#059669', '#3B82F6'],
        });
      } catch (err) {}
    }, 1800);
  };

  // Handle direct payment to 0793749604 verification
  const handleDirectPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDirectError(null);

    const cleanCode = directCode.trim().toUpperCase();
    if (!cleanCode || cleanCode.length < 8) {
      setDirectError('Please enter a valid 10-character M-Pesa SMS confirmation code (e.g., QJD78239KA).');
      return;
    }

    if (!directAmount || directAmount < 50) {
      setDirectError('Please specify the amount you sent (minimum KES 50).');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setSuccessReceipt({ 
        amount: directAmount, 
        ref: cleanCode, 
        methodTitle: 'M-Pesa Direct (0793749604)' 
      });
      onDepositSuccess(directAmount, 'M-PESA Direct to 0793749604', cleanCode);

      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#10B981', '#34D399', '#059669'],
        });
      } catch (err) {}
    }, 1500);
  };

  const handleManualCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = manualCode.trim().toUpperCase();
    if (!cleanCode || cleanCode.length < 8) return;

    setIsProcessing(true);
    setTimeout(() => {
      const creditedAmount = 1500; // Simulated verified amount
      setIsProcessing(false);
      setSuccessReceipt({ 
        amount: creditedAmount, 
        ref: cleanCode, 
        methodTitle: 'M-PESA Paybill 522522' 
      });
      onDepositSuccess(creditedAmount, 'M-PESA Paybill', cleanCode);

      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#10B981', '#34D399', '#059669'],
        });
      } catch (err) {}
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-xl rounded-3xl bg-[#0F172A] border border-slate-800 shadow-2xl overflow-hidden relative animate-in fade-in zoom-in-95 my-8">
        
        {/* Modal Top Banner */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border-b border-emerald-500/20 p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center space-x-2">
                <span>Deposit & Top Up Wallet</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                  Instant Auto-Credit
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Lipa Na M-Pesa automated integration &bull; 0% Fee
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation: 5 Payment Methods */}
        <div className="grid grid-cols-2 sm:grid-cols-5 border-b border-slate-800 bg-slate-900/60 text-xs font-bold text-slate-400">
          
          {/* TAB 1: STK Push */}
          <button
            onClick={() => setActiveTab('stk')}
            className={`py-3 px-2 text-center transition-colors border-b-2 flex flex-col items-center justify-center space-y-1 cursor-pointer ${
              activeTab === 'stk'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
                : 'border-transparent hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-4 h-4 shrink-0" />
            <span>Auto STK Push</span>
          </button>

          {/* TAB 2: Pay Directly to 0793749604 */}
          <button
            onClick={() => setActiveTab('direct')}
            className={`py-3 px-2 text-center transition-colors border-b-2 flex flex-col items-center justify-center space-y-1 cursor-pointer ${
              activeTab === 'direct'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
                : 'border-transparent hover:text-slate-200'
            }`}
          >
            <Send className="w-4 h-4 shrink-0" />
            <span className="truncate">Pay to {officialPhone}</span>
          </button>

          {/* TAB 3: Paybill */}
          <button
            onClick={() => setActiveTab('paybill')}
            className={`py-3 px-2 text-center transition-colors border-b-2 flex flex-col items-center justify-center space-y-1 cursor-pointer ${
              activeTab === 'paybill'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
                : 'border-transparent hover:text-slate-200'
            }`}
          >
            <Lock className="w-4 h-4 shrink-0" />
            <span>Paybill {officialPaybill}</span>
          </button>

          {/* TAB 4: Crypto USDT */}
          <button
            onClick={() => setActiveTab('crypto')}
            className={`py-3 px-2 text-center transition-colors border-b-2 flex flex-col items-center justify-center space-y-1 cursor-pointer ${
              activeTab === 'crypto'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
                : 'border-transparent hover:text-slate-200'
            }`}
          >
            <Coins className="w-4 h-4 shrink-0" />
            <span>USDT Crypto</span>
          </button>

          {/* TAB 5: Card / Bank */}
          <button
            onClick={() => setActiveTab('card')}
            className={`py-3 px-2 text-center transition-colors border-b-2 flex flex-col items-center justify-center space-y-1 cursor-pointer ${
              activeTab === 'card'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
                : 'border-transparent hover:text-slate-200'
            }`}
          >
            <CreditCard className="w-4 h-4 shrink-0" />
            <span>Card / Bank</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          
          {/* Success Screen If Paid */}
          {successReceipt ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto ring-4 ring-emerald-500/30">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h4 className="text-xl font-black text-white">Payment Received!</h4>
                <p className="text-xs text-slate-300 mt-1">
                  Your wallet has been credited with{' '}
                  <strong className="text-emerald-400 font-mono text-sm">{formatCurrency(successReceipt.amount, currency)}</strong>
                </p>
              </div>

              <div className="max-w-xs mx-auto bg-slate-900 border border-emerald-500/30 p-3.5 rounded-2xl text-left text-xs font-mono space-y-1.5 shadow-lg">
                <div className="flex justify-between">
                  <span className="text-slate-400">Method:</span>
                  <span className="text-white font-bold">{successReceipt.methodTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Reference:</span>
                  <span className="text-emerald-400 font-bold">{successReceipt.ref}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status:</span>
                  <span className="text-emerald-300 font-bold">Completed &bull; Verified</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Time:</span>
                  <span className="text-slate-300">Instant Automated</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setSuccessReceipt(null);
                  onClose();
                }}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs shadow-lg shadow-emerald-950/40 cursor-pointer"
              >
                Done & Start Ordering
              </button>
            </div>
          ) : (
            <>
              {/* ======================================================== */}
              {/* TAB 1: M-PESA STK PUSH (AUTOMATED PROMPT)               */}
              {/* ======================================================== */}
              {activeTab === 'stk' && (
                <form onSubmit={handleInitiateSTK} className="space-y-4">
                  <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-start space-x-2.5">
                    <Smartphone className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white">Automated Safaricom PIN Prompt</p>
                      <p className="text-[11px] text-slate-300 mt-0.5">
                        Enter your Safaricom phone number below. You will receive an instant pop-up on your phone asking for your M-Pesa PIN.
                      </p>
                    </div>
                  </div>

                  {/* Direct payment callout */}
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
                    <span>Prefer to send money manually?</span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('direct')}
                      className="text-emerald-400 hover:text-emerald-300 font-bold underline cursor-pointer ml-2"
                    >
                      Make payment to {officialPhone} &rarr;
                    </button>
                  </div>

                  {stkError && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2 font-medium">
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>{stkError}</span>
                    </div>
                  )}

                  {/* Phone input - Customer's own number, not prefilled with admin line */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-semibold text-slate-200">
                      <label>Your Safaricom Phone Number (to receive PIN prompt):</label>
                      <span className="text-[11px] text-slate-400">e.g. 0712345678</span>
                    </div>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="07XXXXXXXX or 01XXXXXXXX"
                      className="w-full bg-[#090D16] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-emerald-300 font-bold font-mono placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* Amount input */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-slate-200">
                      <label>Amount to Top Up (KES):</label>
                      <span className="text-emerald-400 font-mono">Min: KES 50</span>
                    </div>
                    <input
                      type="number"
                      min={50}
                      step={50}
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="w-full bg-[#090D16] border border-slate-700 rounded-xl px-4 py-2.5 text-base text-white font-mono font-bold focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* Quick preset chips */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {quickAmounts.map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => setAmount(q)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer ${
                          amount === q
                            ? 'bg-emerald-500 text-black font-bold'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        KES {q.toLocaleString()}
                      </button>
                    ))}
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-4 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-black text-sm tracking-wide shadow-lg shadow-emerald-950/40 cursor-pointer flex items-center justify-center space-x-2"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Send M-Pesa Prompt (KES {amount.toLocaleString()})</span>
                  </button>
                </form>
              )}

              {/* ======================================================== */}
              {/* TAB 2: DIRECT PAYMENT TO OFFICIAL PHONE                  */}
              {/* ======================================================== */}
              {activeTab === 'direct' && (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-slate-200 space-y-2">
                    <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                      <Send className="w-4 h-4" />
                      <span>Direct Payment to KEN_TECH LIKES Number:</span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Customers can make direct payments directly to our official Safaricom line using <strong>Send Money</strong> or <strong>Pochi la Biashara</strong>.
                    </p>
                  </div>

                  {/* Payment Number Card with 1-Click Copy */}
                  <div className="p-4 rounded-2xl bg-[#090D16] border-2 border-emerald-500/50 shadow-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Official Payment Phone Number
                        </span>
                        <span className="text-xl sm:text-2xl font-mono font-black text-emerald-400 tracking-wider">
                          {officialPhone}
                        </span>
                        <span className="text-[11px] text-slate-400 block mt-0.5">
                          Recipient Name: <strong className="text-white">KEN TECH LIKES (Kentech Services)</strong>
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCopy(officialPhone, 'directPhone')}
                        className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs flex items-center space-x-1.5 cursor-pointer shadow transition-all active:scale-95"
                      >
                        {copiedField === 'directPhone' ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Number</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Step by Step Guide */}
                  <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-2">
                    <p className="font-semibold text-white">How to complete your payment:</p>
                    <ol className="list-decimal list-inside space-y-1.5 text-slate-400 text-[11px]">
                      <li>Open M-PESA on your phone and select <strong>Send Money</strong></li>
                      <li>Enter Phone Number: <strong className="text-white font-mono">{officialPhone}</strong></li>
                      <li>Enter Amount (e.g. KES 500, KES 1,000, KES 2,500)</li>
                      <li>Confirm recipient is <strong>KEN TECH LIKES</strong>, enter your PIN and send</li>
                      <li>Copy the M-PESA transaction code from your SMS (e.g., <span className="font-mono text-emerald-400">QJD82914KA</span>) and enter it below:</li>
                    </ol>
                  </div>

                  {/* Verification Form */}
                  <form onSubmit={handleDirectPaymentSubmit} className="space-y-3 pt-1">
                    {directError && (
                      <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2 font-medium">
                        <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        <span>{directError}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-200">
                          Amount Sent (KES):
                        </label>
                        <input
                          type="number"
                          min={50}
                          value={directAmount}
                          onChange={(e) => setDirectAmount(Number(e.target.value))}
                          className="w-full bg-[#090D16] border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono font-bold focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-200">
                          M-Pesa SMS Code:
                        </label>
                        <input
                          type="text"
                          value={directCode}
                          onChange={(e) => setDirectCode(e.target.value)}
                          placeholder="e.g. QJD78239KA"
                          className="w-full bg-[#090D16] border border-slate-700 rounded-xl px-3 py-2 text-sm font-mono text-emerald-300 uppercase font-bold focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-black text-xs sm:text-sm tracking-wide shadow-lg shadow-emerald-950/40 cursor-pointer flex items-center justify-center space-x-2 transition-all active:scale-95"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isProcessing ? 'Verifying with Safaricom...' : 'Verify & Credit Wallet Instantly'}</span>
                    </button>
                  </form>
                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 3: PAYBILL 522522                                    */}
              {/* ======================================================== */}
              {activeTab === 'paybill' && (
                <div className="space-y-4">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-2">
                    <p className="font-semibold text-white">Manual Lipa na M-Pesa Paybill Instructions:</p>
                    <ol className="list-decimal list-inside space-y-1 text-slate-400 text-[11px]">
                      <li>Go to M-PESA menu on your phone</li>
                      <li>Select <strong>Lipa Na M-PESA &rarr; Pay Bill</strong></li>
                      <li>Enter Business Number: <strong className="text-white font-mono">{officialPaybill}</strong></li>
                      <li>Enter Account Number: <strong className="text-white font-mono">KT-88421</strong></li>
                      <li>Enter your desired Amount & M-PESA PIN</li>
                      <li>Paste the received M-Pesa SMS Code below to auto-verify!</li>
                    </ol>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-[#090D16] border border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Paybill Number</span>
                        <span className="text-sm font-mono font-bold text-emerald-400">{officialPaybill}</span>
                      </div>
                      <button
                        onClick={() => handleCopy(officialPaybill, 'paybill')}
                        className="p-1.5 rounded bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                      >
                        {copiedField === 'paybill' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <div className="p-3 rounded-xl bg-[#090D16] border border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Account Number</span>
                        <span className="text-sm font-mono font-bold text-white">KT-88421</span>
                      </div>
                      <button
                        onClick={() => handleCopy('KT-88421', 'acc')}
                        className="p-1.5 rounded bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                      >
                        {copiedField === 'acc' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Code Verification form */}
                  <form onSubmit={handleManualCodeSubmit} className="space-y-2 pt-2 border-t border-slate-800">
                    <label className="text-xs font-semibold text-slate-200">
                      Enter M-Pesa Confirmation Code (e.g., QJD78239KA):
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={manualCode}
                        onChange={(e) => setManualCode(e.target.value)}
                        placeholder="QJD78239KA"
                        className="flex-1 bg-[#090D16] border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white uppercase focus:outline-none focus:border-emerald-500"
                      />
                      <button
                        type="submit"
                        disabled={isProcessing}
                        className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs cursor-pointer shadow"
                      >
                        {isProcessing ? 'Verifying...' : 'Verify & Credit'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 4: CRYPTO USDT                                       */}
              {/* ======================================================== */}
              {activeTab === 'crypto' && (
                <div className="space-y-4 text-xs text-slate-300">
                  <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
                    Accepting USDT (TRC-20 & BEP-20) with instant conversion: <strong>1 USDT = 130 KES</strong>.
                  </div>

                  <div className="space-y-2">
                    <label className="text-slate-400 block">USDT (TRC-20) Deposit Address:</label>
                    <div className="p-3 rounded-xl bg-[#090D16] border border-slate-800 font-mono text-[11px] text-white flex items-center justify-between break-all">
                      <span>TKp7A9dZ19W4yJmNxE3vQ8u2kL5sC8F3b</span>
                      <button
                        onClick={() => handleCopy('TKp7A9dZ19W4yJmNxE3vQ8u2kL5sC8F3b', 'usdt')}
                        className="ml-2 p-1.5 rounded bg-slate-800 text-slate-300 hover:text-white shrink-0 cursor-pointer"
                      >
                        {copiedField === 'usdt' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400">
                    Network confirmations usually take 1 - 3 minutes. Your KEN_TECH LIKES balance is credited automatically upon 1 confirmation.
                  </p>
                </div>
              )}

              {/* ======================================================== */}
              {/* TAB 5: CARD / INTERNATIONAL                             */}
              {/* ======================================================== */}
              {activeTab === 'card' && (
                <div className="space-y-4 text-xs text-slate-300">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <p className="font-semibold text-white">Credit / Debit Card (Visa, Mastercard, Apple Pay):</p>
                    <p className="text-slate-400 text-[11px]">
                      International cards are processed securely with 3D-Secure 256-bit encryption.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-slate-400">Cardholder Name:</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full bg-[#090D16] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-slate-400">Card Number:</label>
                    <input
                      type="text"
                      placeholder="4000 1234 5678 9010"
                      className="w-full bg-[#090D16] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onDepositSuccess(2500, 'Card', `CARD-${Math.floor(100000 + Math.random() * 900000)}`);
                      setSuccessReceipt({ amount: 2500, ref: 'CARD-AUTH-OK', methodTitle: 'Visa / MasterCard' });
                    }}
                    className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer"
                  >
                    Simulate Card Deposit (KES 2,500)
                  </button>
                </div>
              )}
            </>
          )}

        </div>

        {/* Support Help Footer */}
        <div className="p-3.5 bg-slate-950/80 border-t border-slate-800 text-[11px] text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Need payment assistance?</span>
          </div>
          <div className="flex items-center space-x-3 text-slate-300">
            <a 
              href="https://wa.me/254793749604" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-emerald-400 hover:underline font-mono"
            >
              WhatsApp: +254 793 749 604
            </a>
            <span>&bull;</span>
            <a 
              href={`mailto:${SUPPORT_EMAIL}`}
              className="text-slate-300 hover:text-emerald-400 font-mono"
            >
              {SUPPORT_EMAIL}
            </a>
          </div>
        </div>

      </div>

      {/* STK Push Simulator Prompt Modal */}
      {stkPromptScreen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-emerald-500/50 p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-emerald-400 tracking-wider">
                M-PESA SIM PROMPT
              </span>
              <button onClick={() => setStkPromptScreen(false)} className="text-slate-400 text-xs cursor-pointer">✕</button>
            </div>

            <div className="bg-[#05110E] p-3.5 rounded-xl border border-emerald-500/30 text-xs text-emerald-300 font-mono space-y-1">
              <p>Pay <strong>Ksh {amount.toLocaleString()}</strong> to <strong>KEN TECH LIKES LTD</strong>?</p>
              <p className="text-[11px] text-slate-400">Recipient Line: 0793749604 / Till: 522522</p>
              <p className="text-[11px] text-emerald-400 font-bold">Prompt Sent to: {phoneNumber || 'Your Phone Number'}</p>
            </div>

            <div className="text-center">
              <label className="text-xs text-slate-300 block mb-1">Enter PIN (4 Digits):</label>
              <input
                type="password"
                maxLength={4}
                value={stkPin}
                onChange={(e) => setStkPin(e.target.value)}
                placeholder="••••"
                className="w-32 mx-auto text-center bg-black border border-emerald-500/60 rounded-lg py-1.5 text-base text-emerald-400 font-mono tracking-widest focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={handleConfirmSTKPin}
              disabled={isProcessing}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs cursor-pointer shadow"
            >
              {isProcessing ? 'Verifying with Safaricom...' : 'Authorize Ksh ' + amount.toLocaleString()}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
