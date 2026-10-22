import React, { useState } from 'react';
import { 
  ChevronDown, 
  Star, 
  CheckCircle2, 
  HelpCircle, 
  ShieldCheck, 
  Award,
  Sparkles,
  MapPin
} from 'lucide-react';
import { FAQS } from '../data/servicesData';

export const ReviewsAndFaq: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const reviews = [
    {
      name: 'Brian K.',
      handle: '@briannairobi',
      location: 'Nairobi, Kenya',
      service: 'TikTok Followers & FYP Views',
      stars: 5,
      date: '2 days ago',
      comment: 'KEN_TECH LIKES is easily the most reliable panel in East Africa. I paid via M-Pesa STK push and my 10k TikTok followers started dropping in under 2 minutes. Hit the Creator Rewards Fund threshold in one week!',
    },
    {
      name: 'Faith M.',
      handle: '@faith_boutiqueke',
      location: 'Mombasa, Kenya',
      service: 'Instagram Page Growth & Likes',
      stars: 5,
      date: 'Yesterday',
      comment: 'Our clothing boutique Instagram page looked inactive before. With their 5,000 real followers and post likes pack, customer inquiries tripled. The automated M-Pesa checkout is super smooth.',
    },
    {
      name: 'Otieno D.',
      handle: '@otienomedia',
      location: 'Kisumu, Kenya',
      service: 'YouTube 4K Watch Hours & Subs',
      stars: 5,
      date: '4 days ago',
      comment: 'Got my YouTube channel monetized! The 4,000 watch hours delivered cleanly without drops and Google AdSense approved my application 3 days later. 100% recommended for serious creators.',
    },
    {
      name: 'Dennis W.',
      handle: '@denno_agency',
      location: 'Eldoret, Kenya',
      service: 'Reseller API & Telegram Members',
      stars: 5,
      date: '1 week ago',
      comment: 'I run a digital agency reselling SMM services to local clients. KEN_TECH LIKES API uptime is flawless and wholesale prices leave me with great margins.',
    },
  ];

  return (
    <div className="space-y-12 py-6">
      
      {/* Reviews & Social Proof Section */}
      <div className="rounded-2xl bg-[#0F172A]/90 border border-slate-800 p-6 sm:p-8 shadow-xl backdrop-blur-xl">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-400 mb-2">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>4.9 / 5.0 Average Creator Rating</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Loved by 42,000+ Kenyan Creators & Brands
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Real feedback from verified accounts growing their presence across Kenya and Africa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((rev, i) => (
            <div 
              key={i} 
              className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/30 transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="font-bold text-white text-sm">{rev.name}</span>
                    <span className="text-xs text-slate-400">{rev.handle}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="flex items-center space-x-1 text-[11px] text-slate-500">
                    <MapPin className="w-3 h-3 text-emerald-500" />
                    <span>{rev.location}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-0.5 text-amber-400">
                  {[...Array(rev.stars)].map((_, s) => (
                    <Star key={s} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed italic">
                "{rev.comment}"
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 font-mono">
                <span>Ordered: <strong className="text-emerald-400">{rev.service}</strong></span>
                <span>{rev.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQs Section */}
      <div className="rounded-2xl bg-[#0F172A]/90 border border-slate-800 p-6 sm:p-8 shadow-xl backdrop-blur-xl">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400 mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions? We Have Answers</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Everything you need to know about M-Pesa payments, safety, delivery speeds, and guarantees.
          </p>
        </div>

        <div className="space-y-3 max-w-3xl mx-auto">
          {FAQS.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-white hover:text-emerald-300 transition-colors cursor-pointer"
                >
                  <span className="pr-4">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-emerald-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-slate-300 leading-relaxed border-t border-slate-800/80 animate-in fade-in">
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
