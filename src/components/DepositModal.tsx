import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Sparkles,
  Zap,
  Store,
  ShieldAlert,
  ClipboardPaste,
  Lock,
  ArrowRight,
  FolderOpen,
  AlertTriangle,
  Loader2,
  ShieldX,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';
import Tesseract from 'tesseract.js';
import { Currency, SystemSettings } from '../types';
import { formatCurrency } from '../data/servicesData';
import { SUPPORT_EMAIL, SUPPORT_PHONE, auth } from '../lib/firebase';
import { 
  parseAndValidateMpesaMessage, 
  checkMpesaCodeAlreadyClaimed, 
  lockMpesaCodeClaim,
  recordFraudAttemptAndCheckClosure,
  MpesaVerificationResult 
} from '../lib/mpesaValidator';

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
  systemSettings,
}) => {
  if (!isOpen) return null;

  const officialTill = systemSettings?.tillNumber || '1856074';
  const officialHelpline = systemSettings?.supportPhone || SUPPORT_PHONE;
  const officialEmail = systemSettings?.supportEmail || SUPPORT_EMAIL;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [rawMessage, setRawMessage] = useState('');
  const [copiedTill, setCopiedTill] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [securityNotice, setSecurityNotice] = useState<string | null>(null);

  // File browse & OCR state
  const [isScanningImage, setIsScanningImage] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [fileStatusMessage, setFileStatusMessage] = useState<string | null>(null);

  // Account Closure / Ban state
  const [isAccountClosed, setIsAccountClosed] = useState(false);
  const [accountClosedReason, setAccountClosedReason] = useState<string | null>(null);

  // Live parsed preview
  const [parsedPreview, setParsedPreview] = useState<MpesaVerificationResult | null>(null);

  const [successReceipt, setSuccessReceipt] = useState<{ 
    amount: number; 
    ref: string; 
    dateTime: string; 
    methodTitle: string 
  } | null>(null);

  // Check if account has been closed due to tampering
  useEffect(() => {
    try {
      const closedReason = localStorage.getItem('kt_account_closed_reason');
      const infractions = localStorage.getItem('kt_security_infractions');
      if (closedReason || (infractions && parseInt(infractions, 10) >= 2)) {
        setIsAccountClosed(true);
        setAccountClosedReason(closedReason || 'Permanent closure due to repeated M-Pesa SMS forgery attempts.');
      }
    } catch (e) {}
  }, [isOpen]);

  const handleCopyTill = () => {
    navigator.clipboard.writeText(officialTill);
    setCopiedTill(true);
    setTimeout(() => setCopiedTill(false), 2200);
  };

  const handleQuickPaste = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setRawMessage(text);
          setFileStatusMessage('📋 Pasted directly from clipboard');
          runLiveInspection(text);
        }
      }
    } catch {
      // Clipboard permission denied or unsupported
    }
  };

  // Browse phone or desktop file (Text or Image screenshot)
  const handleFileChosen = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileStatusMessage(null);
    setErrorMessage(null);
    setSecurityNotice(null);

    // 1. Text file handling (.txt, .log, .csv, text/*)
    if (file.type.startsWith('text/') || /\.(txt|log|csv|text)$/i.test(file.name)) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = (event.target?.result as string) || '';
        if (content.trim()) {
          setRawMessage(content);
          runLiveInspection(content);
          setFileStatusMessage(`📄 Loaded from ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
        } else {
          setErrorMessage('The selected file is empty. Please select a valid M-Pesa SMS text file.');
        }
      };
      reader.onerror = () => {
        setErrorMessage('Unable to read selected text file. Please copy and paste the SMS text manually.');
      };
      reader.readAsText(file);
      // Reset input value so user can pick same file again if desired
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // 2. Image / Screenshot OCR handling (.png, .jpg, .jpeg, .webp, image/*)
    if (file.type.startsWith('image/') || /\.(png|jpe?g|webp|gif|bmp)$/i.test(file.name)) {
      setIsScanningImage(true);
      setScanProgress(10);
      setFileStatusMessage(`📷 Scanning screenshot "${file.name}" with OCR engine...`);

      try {
        const result = await Tesseract.recognize(file, 'eng', {
          logger: (m) => {
            if (m.status === 'recognizing text' && m.progress) {
              setScanProgress(Math.round(m.progress * 100));
            }
          }
        });

        const recognizedText = result?.data?.text ? result.data.text.trim() : '';
        if (recognizedText) {
          // Normalize linebreaks and extra spaces from OCR
          const cleanedText = recognizedText.replace(/\r\n/g, ' ').replace(/\n/g, ' ').replace(/\s+/g, ' ');
          setRawMessage(cleanedText);
          runLiveInspection(cleanedText);
          setFileStatusMessage(`✅ OCR extracted SMS text from "${file.name}"`);
        } else {
          setErrorMessage('Could not extract readable M-Pesa text from this screenshot. Please ensure the screenshot is clear or paste the text directly.');
        }
      } catch (ocrErr) {
        console.warn('OCR error:', ocrErr);
        setErrorMessage('Automatic image scanning encountered an issue. Please paste the SMS text directly from your phone.');
      } finally {
        setIsScanningImage(false);
        setScanProgress(0);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
      return;
    }

    setErrorMessage(`Unsupported file format (${file.name}). Please browse for an SMS screenshot (.png, .jpg) or text file (.txt).`);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const runLiveInspection = (text: string) => {
    setErrorMessage(null);
    setSecurityNotice(null);

    if (!text.trim()) {
      setParsedPreview(null);
      return;
    }

    const result = parseAndValidateMpesaMessage(text, officialTill);
    setParsedPreview(result);

    if (!result.isValid && result.error) {
      if (result.securityFlags && result.securityFlags.length > 0) {
        setSecurityNotice(result.error);
      }
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setRawMessage(val);
    runLiveInspection(val);
  };

  // Submit and verify whole M-Pesa SMS
  const handleVerifyMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSecurityNotice(null);

    if (isAccountClosed) {
      setErrorMessage('Your account is permanently closed due to prior security infractions.');
      return;
    }

    if (!rawMessage.trim()) {
      setErrorMessage('Please paste or browse the whole M-Pesa SMS message you received from Safaricom.');
      return;
    }

    setIsVerifying(true);

    try {
      // 1. Strict Structural, Recipient & Anti-Tamper Security Parsing
      const result = parseAndValidateMpesaMessage(rawMessage, officialTill);

      if (!result.isValid || !result.code || !result.amount) {
        setIsVerifying(false);
        setErrorMessage(result.error || 'The message could not be verified. Please do not edit any text.');
        
        if (result.securityFlags && result.securityFlags.length > 0) {
          setSecurityNotice(result.error || 'Fraud Prevention: Altered or mismatched M-Pesa message detected.');

          // Log security infraction and check for automatic account closure
          if (result.isSevereFraud) {
            const closureOutcome = await recordFraudAttemptAndCheckClosure(
              auth.currentUser?.uid || 'guest',
              result.error || 'Attempted SMS forgery/alteration',
              rawMessage
            );
            if (closureOutcome.accountClosed) {
              setIsAccountClosed(true);
              setAccountClosedReason(closureOutcome.warning);
            }
          }
        }
        return;
      }

      // 2. Anti-Replay / Duplicate Attack Check (Firestore + LocalStorage)
      const isAlreadyClaimed = await checkMpesaCodeAlreadyClaimed(result.code);
      if (isAlreadyClaimed) {
        setIsVerifying(false);
        const duplicateWarning = `Fraud Alert: Reference code ${result.code} has already been verified and credited. Re-submitting used M-Pesa receipts is strictly prohibited and results in account closure.`;
        setSecurityNotice(duplicateWarning);
        
        const closureOutcome = await recordFraudAttemptAndCheckClosure(
          auth.currentUser?.uid || 'guest',
          `Re-submitting already claimed code: ${result.code}`,
          rawMessage
        );
        if (closureOutcome.accountClosed) {
          setIsAccountClosed(true);
          setAccountClosedReason(closureOutcome.warning);
        }
        return;
      }

      // 3. Lock this claim permanently in Firestore to prevent any future reuse
      await lockMpesaCodeClaim(
        result.code,
        result.amount,
        rawMessage.trim(),
        auth.currentUser?.uid || 'client'
      );

      // 4. Credit user's wallet with the EXACT amount parsed from the verified SMS
      onDepositSuccess(
        result.amount, 
        `Lipa Na M-Pesa Till ${officialTill}`, 
        result.code
      );

      setIsVerifying(false);
      setSuccessReceipt({
        amount: result.amount,
        ref: result.code,
        dateTime: result.dateTime || 'Just now',
        methodTitle: `Buy Goods Till ${officialTill} (KEN_TECH LIKES)`
      });

      try {
        confetti({
          particleCount: 120,
          spread: 90,
          origin: { y: 0.6 },
          colors: ['#10B981', '#34D399', '#059669', '#3B82F6'],
        });
      } catch (err) {}

    } catch (err) {
      setIsVerifying(false);
      setErrorMessage('Verification error. Please ensure your internet connection is active and retry.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-lg rounded-3xl bg-[#0D1424] border border-slate-800 shadow-2xl overflow-hidden relative animate-in fade-in zoom-in-95 my-8">
        
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border-b border-emerald-500/20 p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shadow-inner">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center space-x-2">
                <span>Lipa Na M-Pesa Buy Goods</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                  0% Fee &bull; Instant Auto-Credit
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Pay to Till <strong className="text-emerald-400 font-mono">{officialTill}</strong> and paste your SMS below
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

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          
          {/* Account Closed Screen If Blacklisted */}
          {isAccountClosed ? (
            <div className="text-center py-6 px-2 space-y-4 animate-in fade-in">
              <div className="w-16 h-16 rounded-3xl bg-rose-500/20 text-rose-500 border border-rose-500/30 flex items-center justify-center mx-auto ring-4 ring-rose-500/20 shadow-xl">
                <ShieldX className="w-9 h-9" />
              </div>

              <div className="space-y-1">
                <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 text-xs font-bold mb-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Permanent Security Suspension</span>
                </div>
                <h4 className="text-xl sm:text-2xl font-black text-white">Account Permanently Closed</h4>
                <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed pt-1">
                  Pursuant to KEN_TECH LIKES Anti-Fraud Policy and the Kenya Computer Misuse and Cybercrimes Act, your account has been terminated due to submitting forged, edited, or manipulated Safaricom M-Pesa SMS messages.
                </p>
              </div>

              <div className="max-w-md mx-auto p-4 rounded-2xl bg-rose-950/70 border border-rose-500/50 text-left text-xs font-mono space-y-2 shadow-xl">
                <div className="flex justify-between border-b border-rose-900/60 pb-1.5">
                  <span className="text-rose-400/80">Action:</span>
                  <span className="text-rose-300 font-bold">TERMINATION & BLACKLISTING</span>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="text-rose-400/80">Violation Cause:</span>
                  <span className="text-white text-[11px] leading-relaxed break-words">
                    {accountClosedReason || 'Attempted M-Pesa SMS forgery/alteration'}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400">
                To appeal or inquire, email our compliance team at{' '}
                <a href={`mailto:${officialEmail}`} className="text-emerald-400 font-mono underline">{officialEmail}</a>.
              </p>

              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer transition-colors"
              >
                Close Window
              </button>
            </div>
          ) : successReceipt ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto ring-4 ring-emerald-500/30 animate-in zoom-in">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold mb-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Safaricom M-Pesa Verified Genuine</span>
                </div>
                <h4 className="text-xl font-black text-white">Payment Verified & Wallet Credited!</h4>
                <p className="text-xs text-slate-300 mt-1">
                  Your wallet has been credited with{' '}
                  <strong className="text-emerald-400 font-mono text-lg">{formatCurrency(successReceipt.amount, currency)}</strong>
                </p>
              </div>

              <div className="max-w-sm mx-auto bg-slate-900 border border-emerald-500/30 p-4 rounded-2xl text-left text-xs font-mono space-y-2 shadow-lg">
                <div className="flex justify-between border-b border-slate-800 pb-1.5">
                  <span className="text-slate-400">Payment Ref:</span>
                  <span className="text-emerald-400 font-bold">{successReceipt.ref}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-1.5">
                  <span className="text-slate-400">Verified Amount:</span>
                  <span className="text-white font-bold">{formatCurrency(successReceipt.amount, currency)}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-1.5">
                  <span className="text-slate-400">Recipient:</span>
                  <span className="text-white font-medium">{successReceipt.methodTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Transaction Time:</span>
                  <span className="text-slate-300">{successReceipt.dateTime}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setSuccessReceipt(null);
                  setRawMessage('');
                  onClose();
                }}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-black text-xs shadow-lg shadow-emerald-950/40 cursor-pointer transition-all active:scale-95"
              >
                Done & Start Ordering
              </button>
            </div>
          ) : (
            <>
              {/* Official Till Number Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-[#0A1220] to-emerald-950/40 border-2 border-emerald-500/60 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                      <span>Lipa Na M-Pesa &bull; Buy Goods Till</span>
                    </div>
                    <div className="mt-1 flex items-baseline space-x-2">
                      <span className="text-3xl sm:text-4xl font-mono font-black text-emerald-400 tracking-wider">
                        {officialTill}
                      </span>
                    </div>
                    <span className="text-xs text-slate-300 block mt-0.5 font-medium">
                      Recipient Name: <strong className="text-white">KEN_TECH LIKES</strong>
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyTill}
                    className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs flex items-center space-x-1.5 cursor-pointer shadow-lg shadow-emerald-950/40 transition-all active:scale-95 shrink-0"
                  >
                    {copiedTill ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy Till</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center space-x-1 text-emerald-400 font-semibold">
                    <Zap className="w-3.5 h-3.5" />
                    <span>0% Transaction Fee (Free on Safaricom)</span>
                  </span>
                  <span>Min: KES 50</span>
                </div>
              </div>

              {/* 3 Step Instructions */}
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 space-y-2">
                <p className="font-bold text-white flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>How to make payment on your phone:</span>
                </p>
                <ol className="list-decimal list-inside space-y-1 text-slate-300 text-[11px]">
                  <li>Open M-PESA &rarr; Select <strong>Lipa Na M-PESA</strong> &rarr; <strong>Buy Goods and Services</strong></li>
                  <li>Enter Till Number: <strong className="text-emerald-400 font-mono font-bold text-xs">{officialTill}</strong></li>
                  <li>Enter Amount, confirm recipient is <strong>KEN_TECH LIKES</strong>, and enter your PIN</li>
                  <li>Browse file/screenshot or copy and paste the <strong>entire unedited M-PESA SMS</strong> below:</li>
                </ol>
              </div>

              {/* MANDATORY HIGH-SECURITY CAUTION BANNER: EDITING MESSAGE = ACCOUNT CLOSURE */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-red-950/90 via-slate-950 to-amber-950/70 border-2 border-red-500/60 text-red-200 text-xs space-y-1.5 shadow-xl animate-in fade-in">
                <div className="flex items-center space-x-2 text-red-400 font-black tracking-wide uppercase text-[11px]">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-400 animate-pulse" />
                  <span>Security Caution: Zero Tolerance for Altered Messages</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-200 font-medium">
                  <strong className="text-red-400 font-bold uppercase">Caution:</strong> All submitted M-Pesa SMS messages undergo cryptographic signature checks and timestamp validation. <strong className="text-white underline decoration-red-500 underline-offset-2">Editing, altering amounts, or submitting fake messages WILL RESULT IN IMMEDIATE AND PERMANENT ACCOUNT CLOSURE</strong>, forfeiture of all balances, and blacklisting with Safaricom fraud tracking.
                </p>
              </div>

              {/* Fraud Warning / Security Alert */}
              {securityNotice && (
                <div className="p-3.5 rounded-2xl bg-rose-950/90 border border-rose-500/60 text-rose-200 text-xs space-y-1 shadow-lg animate-in fade-in">
                  <div className="flex items-center space-x-1.5 font-bold text-rose-400">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>Security & Anti-Tamper Violation Alert</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-rose-200 font-semibold">
                    {securityNotice}
                  </p>
                  <p className="text-[10px] text-rose-400 pt-0.5 font-medium">
                    Warning: Repeating this attempt will trigger instant and permanent account closure.
                  </p>
                </div>
              )}

              {/* General Error Message */}
              {errorMessage && !securityNotice && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center space-x-2 font-medium">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Verification Form: Paste / Browse Whole M-Pesa Message */}
              <form onSubmit={handleVerifyMessage} className="space-y-3">
                {/* Hidden File Input for Phone & Desktop Browsing */}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChosen} 
                  accept=".txt,.text,.log,.csv,image/*" 
                  className="hidden" 
                />

                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-slate-200">
                    <label className="flex items-center space-x-1.5">
                      <Lock className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Whole M-Pesa SMS Message:</span>
                    </label>

                    <div className="flex items-center space-x-2">
                      {/* BROWSE BUTTON FOR PHONE & DESKTOP */}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isScanningImage}
                        className="text-amber-400 hover:text-amber-300 font-bold text-[11px] flex items-center space-x-1.5 cursor-pointer bg-slate-900 hover:bg-slate-800 px-3 py-1 rounded-lg border border-amber-500/40 hover:border-amber-400 transition-colors shadow-sm disabled:opacity-50"
                        title="Browse your phone or desktop to upload M-Pesa SMS text file or screenshot"
                      >
                        <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
                        <span>Browse Phone / PC</span>
                      </button>

                      {/* QUICK PASTE BUTTON */}
                      <button
                        type="button"
                        onClick={handleQuickPaste}
                        className="text-emerald-400 hover:text-emerald-300 font-bold text-[11px] flex items-center space-x-1 cursor-pointer bg-slate-900 hover:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 hover:border-emerald-500/50 transition-colors"
                      >
                        <ClipboardPaste className="w-3.5 h-3.5" />
                        <span>Paste SMS</span>
                      </button>
                    </div>
                  </div>

                  {/* OCR Scanning Progress Box */}
                  {isScanningImage && (
                    <div className="p-3 rounded-xl bg-blue-950/70 border border-blue-500/40 text-blue-200 text-xs space-y-1.5 animate-in fade-in">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="flex items-center space-x-1.5">
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-400" />
                          <span>Scanning M-Pesa screenshot OCR...</span>
                        </span>
                        <span className="font-bold text-blue-300">{scanProgress}%</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-cyan-400 h-1.5 transition-all duration-300 rounded-full" 
                          style={{ width: `${Math.max(10, scanProgress)}%` }} 
                        />
                      </div>
                    </div>
                  )}

                  {/* File Upload Status Pill */}
                  {fileStatusMessage && !isScanningImage && (
                    <div className="text-[11px] text-emerald-300 font-mono bg-emerald-950/50 border border-emerald-500/30 px-3 py-1.5 rounded-xl flex items-center justify-between">
                      <span className="flex items-center space-x-1.5 truncate">
                        <FileText className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate">{fileStatusMessage}</span>
                      </span>
                      <button 
                        type="button" 
                        onClick={() => setFileStatusMessage(null)} 
                        className="text-slate-400 hover:text-white ml-2 text-sm leading-none cursor-pointer"
                      >
                        &times;
                      </button>
                    </div>
                  )}

                  <div className="relative">
                    <textarea
                      rows={4}
                      value={rawMessage}
                      onChange={handleMessageChange}
                      placeholder="e.g. TD982341KA Confirmed. Ksh1,500.00 paid to KEN_TECH LIKES Till 1856074 on 27/10/26 at 10:45 AM. New M-PESA balance is Ksh4,210.50. Transaction cost, Ksh0.00."
                      className="w-full bg-[#090D16] border border-slate-700 rounded-2xl p-3.5 text-xs font-mono text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors leading-relaxed resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
                    <span>Must be complete original SMS. Editing message triggers account closure.</span>
                    <span className="font-mono">{rawMessage.length} characters</span>
                  </div>
                </div>

                {/* Live Inspection Preview Pill If Valid */}
                {parsedPreview && parsedPreview.isValid && (
                  <div className="p-3 rounded-2xl bg-emerald-950/50 border border-emerald-500/40 text-xs font-mono text-emerald-300 space-y-1 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">Detected Reference:</span>
                      <strong className="text-white font-bold">{parsedPreview.code}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">Verified Amount:</span>
                      <strong className="text-emerald-400 font-bold text-sm">
                        {formatCurrency(parsedPreview.amount || 0, currency)}
                      </strong>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Timestamp:</span>
                      <span className="text-slate-300">{parsedPreview.dateTime}</span>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isVerifying || !rawMessage.trim()}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-black text-sm tracking-wide shadow-lg shadow-emerald-950/40 cursor-pointer flex items-center justify-center space-x-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isVerifying ? 'Verifying with Safaricom...' : 'Verify M-Pesa Message & Credit Wallet'}</span>
                </button>
              </form>

            </>
          )}

        </div>

        {/* Support Help Footer */}
        <div className="p-3.5 bg-slate-950/90 border-t border-slate-800 text-[11px] text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Need payment assistance?</span>
          </div>
          <div className="flex items-center space-x-3 text-slate-300">
            <a 
              href={`https://wa.me/${officialHelpline.replace(/[^0-9]/g, '')}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-emerald-400 hover:underline font-mono"
            >
              WhatsApp Support
            </a>
            <span>&bull;</span>
            <a 
              href={`mailto:${officialEmail}`}
              className="text-slate-300 hover:text-emerald-400 font-mono"
            >
              {officialEmail}
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
