import React, { useState } from 'react';
import { 
  HelpCircle, 
  MessageCircle, 
  Send, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  ChevronDown, 
  PhoneCall, 
  Mail,
  AlertCircle
} from 'lucide-react';
import { FAQS } from '../data/servicesData';
import { OrderRecord, SystemSettings } from '../types';

interface SupportCenterProps {
  orders: OrderRecord[];
  systemSettings?: SystemSettings;
}

export const SupportCenter: React.FC<SupportCenterProps> = ({ orders, systemSettings }) => {
  const supportPhone = systemSettings?.supportPhone || '+254 793 749 604';
  const supportEmail = systemSettings?.supportEmail || 'kentechlikeS@gmail.com';
  const paymentPhone = systemSettings?.paymentPhone || '0793 749 604';
  const paybill = systemSettings?.paybill || '522522';
  const [selectedOrder, setSelectedOrder] = useState<string>('');
  const [subject, setSubject] = useState<string>('Refill Request');
  const [ticketMessage, setTicketMessage] = useState<string>('');
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketMessage.trim()) return;

    const ticketId = `TCK-${Math.floor(1000 + Math.random() * 9000)}`;
    setSubmittedTicket(ticketId);
    setTicketMessage('');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      
      {/* Support Hero Banner */}
      <div className="rounded-3xl bg-[#0B111E] border border-slate-800 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>24/7 NAIROBI SUPPORT DESK ONLINE</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Customer Support & Help Center
            </h2>
            <p className="text-sm font-medium text-slate-300 mt-2 max-w-xl">
              Need assistance with an M-Pesa deposit, order speed, or custom reseller package? Our local team replies in seconds.
            </p>
          </div>

          <div className="shrink-0 space-y-2">
            <a
              href="https://wa.me/254793749604?text=Hello%20KEN_TECH%20LIKES%20Support"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-black font-black text-sm tracking-wide shadow-xl flex items-center justify-center space-x-2 cursor-pointer transition-all active:scale-95"
            >
              <MessageCircle className="w-5 h-5 fill-black" />
              <span>WhatsApp Direct Help</span>
            </a>
            <span className="block text-center text-xs text-slate-400 font-mono">
              Average reply: &lt; 2 minutes
            </span>
          </div>
        </div>

        {/* Contact Info Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 text-xs sm:text-sm">
          <div className="p-3.5 rounded-2xl bg-[#121A2A] border border-slate-800 flex items-center space-x-3">
            <PhoneCall className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <span className="text-slate-400 text-xs block">Helpline / Hotline</span>
              <span className="font-bold text-white font-mono">{supportPhone}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#121A2A] border border-slate-800 flex items-center space-x-3">
            <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <span className="text-slate-400 text-xs block">Email Support</span>
              <a 
                href={`mailto:${supportEmail}`}
                className="font-bold text-white font-mono hover:text-emerald-400 transition-colors"
              >
                {supportEmail}
              </a>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#121A2A] border border-slate-800 flex items-center space-x-3">
            <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <span className="text-slate-400 text-xs block">Working Hours</span>
              <span className="font-bold text-white">24 Hours / 7 Days a Week</span>
            </div>
          </div>
        </div>

        {/* Official Payment Accounts Banner */}
        <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-teal-950/70 border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Official M-Pesa Deposit & Payment Channels:</span>
              <span className="text-[11px] text-slate-300">
                Direct Line: <strong className="text-emerald-400 font-mono text-xs">{paymentPhone}</strong> &bull; Paybill: <strong className="text-white font-mono">{paybill}</strong> (Acc: <span className="font-mono text-emerald-300">KT-88421</span>)
              </span>
            </div>
          </div>
          <span className="text-[10px] text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30 font-bold whitespace-nowrap">
            KEN TECH LIKES LTD
          </span>
        </div>
      </div>

      {/* Submit Ticket Form */}
      <div className="rounded-3xl bg-[#0B111E] border border-slate-800 p-6 sm:p-8 shadow-xl space-y-5">
        <div className="flex items-center space-x-2.5">
          <Send className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg sm:text-xl font-black text-white">
            Submit a Support Ticket / Order Escalation
          </h3>
        </div>

        {submittedTicket ? (
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h4 className="text-lg font-bold text-white">
              Ticket #{submittedTicket} Created!
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
              Our support team in Nairobi has received your request and is reviewing it now. You will receive an automated resolution or WhatsApp notification within 15 minutes.
            </p>
            <button
              onClick={() => setSubmittedTicket(null)}
              className="px-6 py-2 rounded-xl bg-emerald-500 text-black font-bold text-xs"
            >
              Submit Another Inquiry
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitTicket} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  Select Order ID (Optional):
                </label>
                <select
                  value={selectedOrder}
                  onChange={(e) => setSelectedOrder(e.target.value)}
                  className="w-full bg-[#121A2A] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                >
                  <option value="">No specific order (General question)</option>
                  {orders.map((o) => (
                    <option key={o.id} value={o.id}>
                      #{o.id} — {o.serviceName.substring(0, 35)}...
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  Issue Topic:
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-[#121A2A] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Refill Request">Refill Request (Non-Drop Guarantee)</option>
                  <option value="M-Pesa Payment Not Reflected">M-Pesa Payment Not Reflected</option>
                  <option value="Order Speed Inquiry">Order Speed Inquiry</option>
                  <option value="Reseller API Assistance">Reseller API Assistance</option>
                  <option value="Custom Bulk Quote">Custom Bulk Quote</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                Message / Details:
              </label>
              <textarea
                rows={4}
                required
                value={ticketMessage}
                onChange={(e) => setTicketMessage(e.target.value)}
                placeholder="Describe what you need help with (e.g. M-Pesa transaction code, order link, etc.)..."
                className="w-full bg-[#121A2A] border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-black text-xs sm:text-sm tracking-wide shadow cursor-pointer active:scale-95"
            >
              Submit Ticket
            </button>
          </form>
        )}
      </div>

      {/* Frequently Asked Questions */}
      <div className="rounded-3xl bg-[#0B111E] border border-slate-800 p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex items-center space-x-2.5 mb-2">
          <HelpCircle className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg sm:text-xl font-black text-white">
            Common Support Questions
          </h3>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-slate-800 bg-[#121A2A] overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-white hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  <span className="pr-4">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-emerald-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-slate-300 leading-relaxed border-t border-slate-800/80">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
