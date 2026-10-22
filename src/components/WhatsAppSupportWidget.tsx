import React, { useState } from 'react';
import { 
  MessageCircle, 
  X, 
  Send, 
  CheckCheck, 
  Sparkles, 
  Smartphone, 
  HelpCircle,
  ExternalLink
} from 'lucide-react';

export const WhatsAppSupportWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'agent'; text: string; time: string }>>([
    {
      sender: 'agent',
      text: 'Jambo! 👋 Welcome to KEN_TECH LIKES Support. How can we help you boost your social media today? Our Nairobi desk is online 24/7. You can also email us directly at kentechlikeS@gmail.com.',
      time: 'Just now',
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const quickQuestions = [
    'Need help with M-Pesa topup',
    'How long does TikTok delivery take?',
    'I want to track an existing order',
    'Do you have reseller API discounts?',
  ];

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = { sender: 'user' as const, text: text.trim(), time: timeStr };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');

    // Simulate Agent reply
    setIsTyping(true);
    setTimeout(() => {
      let reply = 'Thank you for your message! Our automated system is processing orders smoothly. If you deposited via M-Pesa, it reflects within 30 seconds. For urgent direct WhatsApp escalation, our Kenyan hotline is +254 793 749 604.';
      
      const lower = text.toLowerCase();
      if (lower.includes('mpesa') || lower.includes('m-pesa') || lower.includes('topup')) {
        reply = 'For M-Pesa: You can use our automated STK Push under "Top Up", or send money directly to Paybill 522522 with your user ID. Your funds credit automatically!';
      } else if (lower.includes('tiktok') || lower.includes('delivery')) {
        reply = 'TikTok services start within 30 seconds to 5 minutes! Likes and views are instant, while followers drip-feed safely at 10k-25k per day.';
      } else if (lower.includes('track') || lower.includes('order')) {
        reply = 'You can track any order anytime by clicking the "Track Orders" tab and entering your Order ID (e.g. KT-94812).';
      } else if (lower.includes('api') || lower.includes('reseller')) {
        reply = 'Yes! Resellers receive up to 30% wholesale discounts. Check the "Reseller API" tab to generate your API key.';
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'agent',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-3 rounded-full shadow-2xl shadow-emerald-500/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400 border-2 border-black"></span>
          </span>
          <MessageCircle className="w-5 h-5 text-black" />
          <span className="text-xs font-black tracking-wide hidden sm:inline">
            KEN_TECH WhatsApp &bull; Online
          </span>
        </button>
      )}

      {/* Chat Drawer */}
      {isOpen && (
        <div className="w-[340px] sm:w-[380px] rounded-2xl bg-[#0F172A] border border-emerald-500/40 shadow-2xl overflow-hidden flex flex-col h-[500px] animate-in fade-in slide-in-from-bottom-5">
          
          {/* Header */}
          <div className="bg-emerald-600 p-4 text-black flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-black/15 flex items-center justify-center font-bold text-sm">
                KT
              </div>
              <div>
                <h4 className="text-sm font-black leading-tight">KEN_TECH LIKES Support</h4>
                <div className="flex items-center space-x-1 text-[11px] font-medium text-emerald-950">
                  <span className="w-2 h-2 rounded-full bg-emerald-300"></span>
                  <span>Replies within 60 seconds (Nairobi, KE)</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <a
                href="https://wa.me/254793749604?text=Hello%20KEN_TECH%20LIKES%20Support"
                target="_blank"
                rel="noopener noreferrer"
                title="Chat directly on WhatsApp (0793749604)"
                className="p-1.5 rounded-lg hover:bg-black/10 text-emerald-950 flex items-center space-x-1 text-xs font-black cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>0793 749 604</span>
              </a>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-black/10 text-emerald-950 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-[#090D16]">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-emerald-500 text-black font-medium rounded-br-none'
                      : 'bg-slate-800/90 text-slate-100 rounded-bl-none border border-slate-700/60'
                  }`}
                >
                  <p>{m.text}</p>
                </div>
                <div className="flex items-center space-x-1 text-[9px] text-slate-500 mt-1 px-1">
                  <span>{m.time}</span>
                  {m.sender === 'user' && <CheckCheck className="w-3 h-3 text-emerald-400" />}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center space-x-1.5 bg-slate-800/60 text-slate-400 text-xs px-3 py-2 rounded-xl w-24">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            )}
          </div>

          {/* Quick Questions Chips */}
          <div className="p-2 bg-slate-900 border-t border-slate-800 flex items-center space-x-1 overflow-x-auto scrollbar-none">
            {quickQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(q)}
                className="text-[10px] font-medium whitespace-nowrap bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded-md transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-[#0F172A] border-t border-slate-800 flex items-center space-x-2"
          >
            <input
              type="text"
              placeholder="Ask anything about orders or M-Pesa..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 bg-[#090D16] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black cursor-pointer shadow"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}

    </div>
  );
};
