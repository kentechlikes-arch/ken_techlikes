import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  HelpCircle, 
  Link as LinkIcon, 
  Smartphone, 
  ShieldCheck, 
  Clock, 
  RotateCcw, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  Info,
  ChevronRight,
  Copy,
  Check,
  Star,
  Layers,
  ChevronDown,
  Zap,
  Sliders
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Currency, PlatformId, ServiceItem, OrderRecord } from '../types';
import { SERVICES_CATALOG, PLATFORMS_CONFIG, formatCurrency, FACEBOOK_SUBTITLES, TIKTOK_SUBTITLES, INSTAGRAM_SUBTITLES, YOUTUBE_SUBTITLES, TELEGRAM_SUBTITLES } from '../data/servicesData';
import { SocialBrandIcon } from './SocialBrandIcons';
import { validateTargetLink } from '../lib/termsPolicy';

interface QuickOrderWidgetProps {
  selectedCategory: PlatformId;
  onSelectCategory: (p: PlatformId) => void;
  currency: Currency;
  walletBalance: number;
  onPlaceOrder: (order: OrderRecord, paymentSource: 'wallet' | 'mpesa') => boolean;
  onOpenDeposit: () => void;
  preselectedServiceId?: string;
  onViewOrder: (orderId: string) => void;
  services?: ServiceItem[];
  onOpenTerms?: () => void;
  paymentPhone?: string;
  paybill?: string;
}

export const QuickOrderWidget: React.FC<QuickOrderWidgetProps> = ({
  selectedCategory,
  onSelectCategory,
  currency,
  walletBalance,
  onPlaceOrder,
  onOpenDeposit,
  preselectedServiceId,
  onViewOrder,
  services,
  onOpenTerms,
  paymentPhone = '0793749604',
  paybill = '522522',
}) => {
  const catalog = services || SERVICES_CATALOG;
  // Service selection
  const availableServices = catalog.filter((s) => s.category === selectedCategory && !s.disabled);
  const [selectedFbSubtitle, setSelectedFbSubtitle] = useState<string>('Facebook · Post Likes');
  const [selectedTiktokSubtitle, setSelectedTiktokSubtitle] = useState<string>('TikTok · Followers');
  const [selectedIgSubtitle, setSelectedIgSubtitle] = useState<string>('Instagram · Followers');
  const [selectedYtSubtitle, setSelectedYtSubtitle] = useState<string>('YouTube · Subscribers');
  const [selectedTgSubtitle, setSelectedTgSubtitle] = useState<string>('Telegram · Channel Members');
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    preselectedServiceId || (availableServices[0]?.id || catalog[0].id)
  );

  const activeService: ServiceItem = 
    catalog.find((s) => s.id === selectedServiceId) || availableServices[0] || catalog[0];

  // If category changed, update service to first available in category or matching selected subtitle
  useEffect(() => {
    if (activeService.category !== selectedCategory) {
      if (selectedCategory === 'facebook') {
        const match = catalog.find(
          (s) => s.category === 'facebook' && (s.subCategory === selectedFbSubtitle || s.id === '6206') && !s.disabled
        );
        if (match) {
          setSelectedServiceId(match.id);
          return;
        }
      }
      if (selectedCategory === 'tiktok') {
        const match = catalog.find(
          (s) => s.category === 'tiktok' && s.subCategory === selectedTiktokSubtitle && !s.disabled
        );
        if (match) {
          setSelectedServiceId(match.id);
          return;
        }
      }
      if (selectedCategory === 'instagram') {
        const match = catalog.find(
          (s) => s.category === 'instagram' && s.subCategory === selectedIgSubtitle && !s.disabled
        );
        if (match) {
          setSelectedServiceId(match.id);
          return;
        }
      }
      if (selectedCategory === 'youtube') {
        const match = catalog.find(
          (s) => s.category === 'youtube' && s.subCategory === selectedYtSubtitle && !s.disabled
        );
        if (match) {
          setSelectedServiceId(match.id);
          return;
        }
      }
      if (selectedCategory === 'telegram') {
        const match = catalog.find(
          (s) => s.category === 'telegram' && s.subCategory === selectedTgSubtitle && !s.disabled
        );
        if (match) {
          setSelectedServiceId(match.id);
          return;
        }
      }
      const firstInCat = catalog.find((s) => s.category === selectedCategory && !s.disabled);
      if (firstInCat) {
        setSelectedServiceId(firstInCat.id);
      }
    }
  }, [selectedCategory, catalog]);

  // Keep selected subtitle in sync when activeService changes
  useEffect(() => {
    if (activeService.category === 'facebook' && activeService.subCategory) {
      setSelectedFbSubtitle(activeService.subCategory);
    }
    if (activeService.category === 'tiktok' && activeService.subCategory) {
      setSelectedTiktokSubtitle(activeService.subCategory);
    }
    if (activeService.category === 'instagram' && activeService.subCategory) {
      setSelectedIgSubtitle(activeService.subCategory);
    }
    if (activeService.category === 'youtube' && activeService.subCategory) {
      setSelectedYtSubtitle(activeService.subCategory);
    }
    if (activeService.category === 'telegram' && activeService.subCategory) {
      setSelectedTgSubtitle(activeService.subCategory);
    }
  }, [activeService]);

  const handleSelectFbSubtitle = (sub: string) => {
    setSelectedFbSubtitle(sub);
    const match = catalog.find(
      (s) => s.category === 'facebook' && s.subCategory === sub && !s.disabled
    );
    if (match) {
      setSelectedServiceId(match.id);
      if (match.fixedQuantity) {
        setQuantity(match.fixedQuantity);
        setCustomInputVal(match.fixedQuantity.toString());
      } else {
        setQuantity(100);
        setCustomInputVal('100');
      }
    }
  };

  const handleSelectTiktokSubtitle = (sub: string) => {
    setSelectedTiktokSubtitle(sub);
    const match = catalog.find(
      (s) => s.category === 'tiktok' && s.subCategory === sub && !s.disabled
    );
    if (match) {
      setSelectedServiceId(match.id);
      if (match.fixedQuantity) {
        setQuantity(match.fixedQuantity);
        setCustomInputVal(match.fixedQuantity.toString());
      } else {
        const defaultQty = match.minQuantity >= 100 ? match.minQuantity : 100;
        setQuantity(defaultQty);
        setCustomInputVal(defaultQty.toString());
      }
    }
  };

  const handleSelectIgSubtitle = (sub: string) => {
    setSelectedIgSubtitle(sub);
    const match = catalog.find(
      (s) => s.category === 'instagram' && s.subCategory === sub && !s.disabled
    );
    if (match) {
      setSelectedServiceId(match.id);
      if (match.fixedQuantity) {
        setQuantity(match.fixedQuantity);
        setCustomInputVal(match.fixedQuantity.toString());
      } else {
        const defaultQty = match.minQuantity >= 100 ? match.minQuantity : 100;
        setQuantity(defaultQty);
        setCustomInputVal(defaultQty.toString());
      }
    }
  };

  const handleSelectYtSubtitle = (sub: string) => {
    setSelectedYtSubtitle(sub);
    const match = catalog.find(
      (s) => s.category === 'youtube' && s.subCategory === sub && !s.disabled
    );
    if (match) {
      setSelectedServiceId(match.id);
      if (match.fixedQuantity) {
        setQuantity(match.fixedQuantity);
        setCustomInputVal(match.fixedQuantity.toString());
      } else {
        const defaultQty = match.minQuantity >= 100 ? match.minQuantity : 100;
        setQuantity(defaultQty);
        setCustomInputVal(defaultQty.toString());
      }
    }
  };

  const handleSelectTgSubtitle = (sub: string) => {
    setSelectedTgSubtitle(sub);
    const match = catalog.find(
      (s) => s.category === 'telegram' && s.subCategory === sub && !s.disabled
    );
    if (match) {
      setSelectedServiceId(match.id);
      if (match.fixedQuantity) {
        setQuantity(match.fixedQuantity);
        setCustomInputVal(match.fixedQuantity.toString());
      } else {
        const defaultQty = match.minQuantity >= 100 ? match.minQuantity : 100;
        setQuantity(defaultQty);
        setCustomInputVal(defaultQty.toString());
      }
    }
  };

  useEffect(() => {
    if (preselectedServiceId) {
      setSelectedServiceId(preselectedServiceId);
      const svc = catalog.find((s) => s.id === preselectedServiceId);
      if (svc) {
        onSelectCategory(svc.category);
      }
    }
  }, [preselectedServiceId, catalog]);

  // Form State
  const [targetLink, setTargetLink] = useState('');
  const [quantity, setQuantity] = useState<number>(100);
  const [isCustomQty, setIsCustomQty] = useState(false);
  const [customInputVal, setCustomInputVal] = useState('100');
  const [isFavorite, setIsFavorite] = useState(true);
  const [copiedId, setCopiedId] = useState(false);

  // Payment & Checkout State
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'mpesa'>('mpesa');
  const [mpesaPhone, setMpesaPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stkPromptActive, setStkPromptActive] = useState(false);
  const [stkPin, setStkPin] = useState('');
  const [lastPlacedOrder, setLastPlacedOrder] = useState<OrderRecord | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Facebook pricing helpers based on user specifications:
  // - 100 polls vote @ 450
  // - 100 followers @ 59
  // - 100 views @ 30
  // - 100 post reactions at 63
  // - 100 post likes at 63
  // - 100 comments @ 199
  // - 100 live views at 249
  // - 100 post shares @ 49
  // - 100 storyviews @ 44
  // - 100 group joins @ 52
  // - facebook Audit at 1300
  const getFbRatePer100 = (svc: typeof activeService): number => {
    const sub = (svc.subCategory || '').toLowerCase();
    const name = svc.name.toLowerCase();
    if (sub.includes('poll') || name.includes('poll')) return 450;
    if (sub.includes('follower') || name.includes('follower')) return 59;
    if (sub.includes('story') || name.includes('story')) return 44;
    if (sub.includes('live') || name.includes('live')) return 249;
    if (sub.includes('video') || (sub.includes('view') && !sub.includes('live') && !sub.includes('story')) || name.includes('video') || name.includes('reel')) return 30;
    if (sub.includes('reaction') || name.includes('reaction')) return 63;
    if (sub.includes('like') || name.includes('like')) return 63;
    if (sub.includes('comment') || name.includes('comment')) return 199;
    if (sub.includes('share') || name.includes('share')) return 49;
    if (sub.includes('group') || name.includes('group')) return 52;
    return Math.round(svc.ratePer1000 / 10);
  };

  const isFbAudit = (svc: typeof activeService): boolean => {
    const sub = (svc.subCategory || '').toLowerCase();
    const name = svc.name.toLowerCase();
    return sub.includes('audit') || name.includes('audit');
  };

  // TikTok Dashboard Rates per 100:
  // - 100 likes @ 161
  // - 100 followers @ 167
  // - 100 views @ 25
  // - 100 live views @ 308
  // - 100 comments @ 163
  // - 100 comment likes @ 33
  // - 100 shares @ 15
  // - 100 saves @ 45
  // - 100 live tiktok likes @ 63
  // - 100 live comments @ 65
  const getTiktokRatePer100 = (svc: typeof activeService): number => {
    const sub = (svc.subCategory || '').toLowerCase();
    const name = svc.name.toLowerCase();

    // 100 live tiktok likes @ 63
    if ((sub.includes('live') && sub.includes('like')) || (name.includes('live') && name.includes('like') && !name.includes('comment') && !name.includes('audience') && !name.includes('view'))) {
      return 63;
    }
    // 100 live comments @ 65
    if ((sub.includes('live') && sub.includes('comment')) || (name.includes('live') && name.includes('comment'))) {
      return 65;
    }
    // 100 live views @ 308
    if (sub.includes('live') || name.includes('live audience') || name.includes('live view') || name.includes('live stream')) {
      return 308;
    }
    // 100 comment likes @ 33
    if (sub.includes('comment like') || name.includes('comment like')) {
      return 33;
    }
    // 100 comments @ 163
    if (sub.includes('comment') || name.includes('comment')) {
      return 163;
    }
    // 100 likes @ 161
    if (sub.includes('like') || name.includes('like')) {
      return 161;
    }
    // 100 followers @ 167
    if (sub.includes('follower') || name.includes('follower')) {
      return 167;
    }
    // 100 views @ 25
    if (sub.includes('view') || name.includes('view')) {
      return 25;
    }
    // 100 shares @ 15
    if (sub.includes('share') || name.includes('share')) {
      return 15;
    }
    // 100 saves @ 45
    if (sub.includes('save') || name.includes('save') || name.includes('bookmark')) {
      return 45;
    }

    return Math.round(svc.ratePer1000 / 10);
  };

  // Instagram Dashboard Rates per 100 (in multiples of 100s):
  // - 100 followers @ 150
  // - 100 likes @ 45
  // - 100 reel views @ 45
  // - 100 comments @ 49
  // - 100 shares @ 25
  // - 100 reposts @ 44
  // - 100 reel boost @ 69
  // - 100 comment likes @ 73
  const getInstagramRatePer100 = (svc: typeof activeService): number => {
    const sub = (svc.subCategory || '').toLowerCase();
    const name = svc.name.toLowerCase();

    // 100 comment likes @ 73
    if (sub.includes('comment like') || name.includes('comment like') || (sub.includes('comment') && sub.includes('like'))) {
      return 73;
    }
    // 100 comments @ 49
    if (sub.includes('comment') || name.includes('comment')) {
      return 49;
    }
    // 100 reel boost @ 69
    if (sub.includes('boost') || name.includes('boost') || sub.includes('reach') || sub.includes('impression')) {
      return 69;
    }
    // 100 reposts @ 44
    if (sub.includes('repost') || name.includes('repost')) {
      return 44;
    }
    // 100 shares @ 25
    if (sub.includes('share') || name.includes('share')) {
      return 25;
    }
    // 100 reel views @ 45
    if (sub.includes('reel') || sub.includes('view') || name.includes('reel') || name.includes('view')) {
      return 45;
    }
    // 100 likes @ 45
    if (sub.includes('like') || name.includes('like')) {
      return 45;
    }
    // 100 followers @ 150
    if (sub.includes('follower') || name.includes('follower')) {
      return 150;
    }

    return Math.round(svc.ratePer1000 / 10);
  };

  // YouTube Dashboard Rates per 100 (in multiples of 100s):
  // - 100 subscribers @ 999
  // - 100 likes @ 64
  // - 100 views @ 84
  // - 100 comments @ 243
  // - 100 watch time @ 5100
  const getYouTubeRatePer100 = (svc: typeof activeService): number => {
    const sub = (svc.subCategory || '').toLowerCase();
    const name = svc.name.toLowerCase();

    // 100 watch time @ 5100
    if (sub.includes('watch') || name.includes('watch') || sub.includes('monetiz') || name.includes('monetiz')) {
      return 5100;
    }
    // 100 comments @ 243
    if (sub.includes('comment') || name.includes('comment')) {
      return 243;
    }
    // 100 subscribers @ 999
    if (sub.includes('sub') || name.includes('sub')) {
      return 999;
    }
    // 100 likes @ 64
    if (sub.includes('like') || name.includes('like')) {
      return 64;
    }
    // 100 views @ 84
    if (sub.includes('view') || name.includes('view')) {
      return 84;
    }

    return Math.round(svc.ratePer1000 / 10);
  };

  // Telegram Dashboard Rates per 100 (in multiples of 100s):
  // - 100 channel members @ 49
  // - 100 premium members @ 65
  // - 100 reactions @ 45
  // - 100 post views @ 43
  // - 100 post shares @ 44
  // - 100 comments @ 149
  const getTelegramRatePer100 = (svc: typeof activeService): number => {
    const sub = (svc.subCategory || '').toLowerCase();
    const name = svc.name.toLowerCase();

    // 100 comments @ 149
    if (sub.includes('comment') || name.includes('comment')) {
      return 149;
    }
    // 100 premium members @ 65
    if (sub.includes('premium') || name.includes('premium')) {
      return 65;
    }
    // 100 channel members @ 49
    if (sub.includes('member') || name.includes('member') || sub.includes('subscriber')) {
      return 49;
    }
    // 100 reactions @ 45
    if (sub.includes('reaction') || name.includes('reaction') || sub.includes('emoji') || sub.includes('poll')) {
      return 45;
    }
    // 100 post shares @ 44
    if (sub.includes('share') || name.includes('share') || sub.includes('forward')) {
      return 44;
    }
    // 100 post views @ 43
    if (sub.includes('view') || name.includes('view')) {
      return 43;
    }

    return Math.round(svc.ratePer1000 / 10);
  };

  const calculateCost = (qty: number): number => {
    // 1. Facebook Service Calculations:
    if (activeService.category === 'facebook') {
      if (isFbAudit(activeService)) {
        return 1300;
      }
      // Fixed bulk packages (e.g. 1000, 5000) if exact match
      if (activeService.packagePrice && activeService.fixedQuantity && qty === activeService.fixedQuantity) {
        return activeService.packagePrice;
      }
      const unitPer100 = getFbRatePer100(activeService);
      return Math.round((qty / 100) * unitPer100);
    }

    // 2. TikTok Service Calculations (Multiples of 100):
    if (activeService.category === 'tiktok') {
      if (activeService.packagePrice && activeService.fixedQuantity && qty === activeService.fixedQuantity) {
        return activeService.packagePrice;
      }
      const unitPer100 = getTiktokRatePer100(activeService);
      return Math.round((qty / 100) * unitPer100);
    }

    // 3. Instagram Service Calculations (Multiples of 100):
    if (activeService.category === 'instagram') {
      if (activeService.packagePrice && activeService.fixedQuantity && qty === activeService.fixedQuantity) {
        return activeService.packagePrice;
      }
      const unitPer100 = getInstagramRatePer100(activeService);
      return Math.round((qty / 100) * unitPer100);
    }

    // 4. YouTube Service Calculations (Multiples of 100):
    if (activeService.category === 'youtube') {
      if (activeService.packagePrice && activeService.fixedQuantity && qty === activeService.fixedQuantity) {
        return activeService.packagePrice;
      }
      const unitPer100 = getYouTubeRatePer100(activeService);
      return Math.round((qty / 100) * unitPer100);
    }

    // 5. Telegram Service Calculations (Multiples of 100):
    if (activeService.category === 'telegram') {
      if (activeService.packagePrice && activeService.fixedQuantity && qty === activeService.fixedQuantity) {
        return activeService.packagePrice;
      }
      const unitPer100 = getTelegramRatePer100(activeService);
      return Math.round((qty / 100) * unitPer100);
    }

    // 6. Other platforms: 100 likes = 45 bob
    if (activeService.type === 'likes' || activeService.name.toLowerCase().includes('like')) {
      return Math.round((qty / 100) * 45);
    }

    // 6. If package has fixed packagePrice and exact quantity matches:
    if (activeService.packagePrice && activeService.fixedQuantity && qty === activeService.fixedQuantity) {
      return activeService.packagePrice;
    }

    // 7. General formula in hundreds:
    const ratePer100 = activeService.ratePer1000 / 10;
    return Math.max(1, Math.round((qty / 100) * ratePer100));
  };

  const finalCostInKES = calculateCost(quantity);
  const hasEnoughBalance = walletBalance >= finalCostInKES;

  // Handle preset capsule selections: 100, 500, 1000, 2500, 5000
  const handleSelectPreset = (amt: number) => {
    setIsCustomQty(false);
    setQuantity(amt);
    setCustomInputVal(amt.toString());
    setErrorMsg(null);
  };

  // Handle "Choose own" - strictly in hundreds
  const handleChooseOwn = () => {
    setIsCustomQty(true);
    setErrorMsg(null);
  };

  const handleCustomChange = (valStr: string) => {
    setCustomInputVal(valStr);
    const num = parseInt(valStr, 10);
    if (!isNaN(num) && num > 0) {
      // Snap or enforce hundreds
      if (num % 100 !== 0) {
        setErrorMsg('Quantity must be in hundreds (e.g. 100, 200, 300, 400, 500...)');
      } else {
        setErrorMsg(null);
        setQuantity(num);
      }
    }
  };

  const stepHundreds = (increment: number) => {
    const current = Math.max(100, Math.floor(quantity / 100) * 100);
    const nextVal = Math.max(100, current + increment);
    setQuantity(nextVal);
    setCustomInputVal(nextVal.toString());
    setErrorMsg(null);
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(activeService.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Order Submission
  const handleStartOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!targetLink.trim()) {
      setErrorMsg('Please paste your target link (e.g. post, profile, or video link).');
      return;
    }

    const linkCheck = validateTargetLink(targetLink);
    if (!linkCheck.isValid) {
      setErrorMsg(linkCheck.error || 'The entered target link violates prohibited content guidelines.');
      return;
    }

    if (quantity % 100 !== 0) {
      setErrorMsg('Quantity must be a multiple of 100 (e.g. 100, 200, 300...).');
      return;
    }

    if (paymentMethod === 'wallet' && !hasEnoughBalance) {
      setErrorMsg(`Insufficient wallet balance. You need ${formatCurrency(finalCostInKES, currency)}. Please top up or choose Direct M-Pesa.`);
      return;
    }

    if (paymentMethod === 'mpesa') {
      if (!mpesaPhone || mpesaPhone.length < 10) {
        setErrorMsg('Please enter a valid Safaricom phone number (e.g., 0712345678 or 0112345678).');
        return;
      }
      setStkPromptActive(true);
      return;
    }

    executeOrderCreation('wallet');
  };

  const executeOrderCreation = (paymentSource: 'wallet' | 'mpesa', mpesaRefCode?: string) => {
    setIsSubmitting(true);
    const newOrderId = `KT-${Math.floor(10000 + Math.random() * 90000)}`;

    const newOrder: OrderRecord = {
      id: newOrderId,
      serviceId: activeService.id,
      serviceName: activeService.name,
      platform: activeService.category,
      link: targetLink.trim(),
      quantity: quantity,
      charge: finalCostInKES,
      currency: 'KES',
      status: 'In Progress',
      startCount: Math.floor(Math.random() * 1200) + 100,
      currentCount: Math.floor(Math.random() * 1200) + 100,
      targetCount: Math.floor(Math.random() * 1200) + 100 + quantity,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', Today',
      mpesaRef: mpesaRefCode || (paymentSource === 'mpesa' ? `QJD${Math.floor(100000 + Math.random() * 900000)}KE` : undefined),
      refillEligible: activeService.refill.toLowerCase().includes('refill'),
    };

    setTimeout(() => {
      onPlaceOrder(newOrder, paymentSource);
      setIsSubmitting(false);
      setStkPromptActive(false);
      setLastPlacedOrder(newOrder);

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10B981', '#FF6A00', '#059669', '#3B82F6'],
        });
      } catch (err) {}
    }, 1200);
  };

  const handleMpesaStkAuthorize = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const code = `QJD${Math.floor(100000 + Math.random() * 900000)}KE`;
      executeOrderCreation('mpesa', code);
    }, 1500);
  };

  return (
    <div className="relative">
      
      {/* Top Handle / Platform Switcher Navigation */}
      <div className="max-w-4xl mx-auto mb-4">
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          {(Object.keys(PLATFORMS_CONFIG) as PlatformId[]).map((pid) => {
            const conf = PLATFORMS_CONFIG[pid];
            const isSelected = selectedCategory === pid;
            return (
              <button
                key={pid}
                type="button"
                onClick={() => onSelectCategory(pid)}
                className={`flex items-center space-x-2.5 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer shadow-sm ${
                  isSelected
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-black shadow-lg shadow-emerald-950/40 border-2 border-emerald-300 scale-[1.02]'
                    : 'bg-[#0E1524] hover:bg-[#152036] text-white border border-slate-800'
                }`}
              >
                <SocialBrandIcon platform={pid} size={18} />
                <span>{conf.tag || conf.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Dashboard Card (Exact match to screenshot architecture) */}
      <div className="max-w-4xl mx-auto rounded-3xl bg-[#0B111E] border border-slate-800/90 shadow-2xl p-5 sm:p-8 backdrop-blur-2xl">
        
        {/* Header: Platform Icon + Star + Service Name + Package Picker */}
        <div className="border-b border-slate-800/80 pb-5 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-md">
                <SocialBrandIcon platform={activeService.category} size={28} />
              </div>
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400 shrink-0" />
                <h2 className="text-base sm:text-xl font-black text-white tracking-tight">
                  {activeService.name}
                </h2>
                {activeService.subCategory && (
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                    activeService.category === 'tiktok'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      : activeService.category === 'instagram'
                      ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-300 border-pink-500/30'
                      : activeService.category === 'youtube'
                      ? 'bg-red-500/20 text-red-300 border-red-500/30'
                      : activeService.category === 'telegram'
                      ? 'bg-sky-500/20 text-sky-300 border-sky-500/30'
                      : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                  }`}>
                    {activeService.subCategory}
                  </span>
                )}
              </div>
            </div>

            {/* Service package switcher within this handle */}
            <div className="w-full sm:w-72">
              <select
                value={selectedServiceId}
                onChange={(e) => {
                  const newId = e.target.value;
                  setSelectedServiceId(newId);
                  const svc = catalog.find((s) => s.id === newId);
                  if (svc && svc.subCategory) {
                    if (svc.category === 'facebook') {
                      setSelectedFbSubtitle(svc.subCategory);
                    } else if (svc.category === 'tiktok') {
                      setSelectedTiktokSubtitle(svc.subCategory);
                    } else if (svc.category === 'instagram') {
                      setSelectedIgSubtitle(svc.subCategory);
                    } else if (svc.category === 'youtube') {
                      setSelectedYtSubtitle(svc.subCategory);
                    } else if (svc.category === 'telegram') {
                      setSelectedTgSubtitle(svc.subCategory);
                    }
                  }
                }}
                className="w-full bg-[#131C2E] border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                {selectedCategory === 'facebook' ? (
                  FACEBOOK_SUBTITLES.map((sub) => {
                    const subServices = availableServices.filter((s) => s.subCategory === sub);
                    if (subServices.length === 0) return null;
                    return (
                      <optgroup key={sub} label={sub} className="bg-[#0B111E] text-blue-400 font-bold">
                        {subServices.map((s) => (
                          <option key={s.id} value={s.id} className="text-slate-200">
                            {s.name}
                          </option>
                        ))}
                      </optgroup>
                    );
                  })
                ) : selectedCategory === 'tiktok' ? (
                  TIKTOK_SUBTITLES.map((sub) => {
                    const subServices = availableServices.filter((s) => s.subCategory === sub);
                    if (subServices.length === 0) return null;
                    return (
                      <optgroup key={sub} label={sub} className="bg-[#0B111E] text-rose-400 font-bold">
                        {subServices.map((s) => (
                          <option key={s.id} value={s.id} className="text-slate-200">
                            {s.name}
                          </option>
                        ))}
                      </optgroup>
                    );
                  })
                ) : selectedCategory === 'instagram' ? (
                  INSTAGRAM_SUBTITLES.map((sub) => {
                    const subServices = availableServices.filter((s) => s.subCategory === sub);
                    if (subServices.length === 0) return null;
                    return (
                      <optgroup key={sub} label={sub} className="bg-[#0B111E] text-pink-400 font-bold">
                        {subServices.map((s) => (
                          <option key={s.id} value={s.id} className="text-slate-200">
                            {s.name}
                          </option>
                        ))}
                      </optgroup>
                    );
                  })
                ) : selectedCategory === 'youtube' ? (
                  YOUTUBE_SUBTITLES.map((sub) => {
                    const subServices = availableServices.filter((s) => s.subCategory === sub);
                    if (subServices.length === 0) return null;
                    return (
                      <optgroup key={sub} label={sub} className="bg-[#0B111E] text-red-400 font-bold">
                        {subServices.map((s) => (
                          <option key={s.id} value={s.id} className="text-slate-200">
                            {s.name}
                          </option>
                        ))}
                      </optgroup>
                    );
                  })
                ) : selectedCategory === 'telegram' ? (
                  TELEGRAM_SUBTITLES.map((sub) => {
                    const subServices = availableServices.filter((s) => s.subCategory === sub);
                    if (subServices.length === 0) return null;
                    return (
                      <optgroup key={sub} label={sub} className="bg-[#0B111E] text-sky-400 font-bold">
                        {subServices.map((s) => (
                          <option key={s.id} value={s.id} className="text-slate-200">
                            {s.name}
                          </option>
                        ))}
                      </optgroup>
                    );
                  })
                ) : (
                  availableServices.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>
        </div>

        {/* Facebook Dashboard Subtitles Menu Bar */}
        {selectedCategory === 'facebook' && (
          <div className="mb-6 p-4 rounded-2xl bg-[#0F172A]/90 border border-blue-950/60 shadow-inner">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1877F2] animate-pulse"></span>
                <span className="text-xs font-black uppercase tracking-wider text-blue-400">
                  Facebook Subtitles
                </span>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-full font-bold">
                  {FACEBOOK_SUBTITLES.length} Subtitles
                </span>
              </div>
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                Tap any subtitle to pick package
              </span>
            </div>

            {/* Scrollable Subtitles Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none">
              {FACEBOOK_SUBTITLES.map((subtitle) => {
                const isActive = (activeService.subCategory === subtitle) || (selectedFbSubtitle === subtitle);
                return (
                  <button
                    key={subtitle}
                    type="button"
                    onClick={() => handleSelectFbSubtitle(subtitle)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border flex items-center space-x-1.5 ${
                      isActive
                        ? 'bg-[#1877F2] text-white border-blue-400 shadow-lg shadow-blue-900/50 font-black scale-[1.02]'
                        : 'bg-[#131C2E] hover:bg-[#1C283F] text-slate-300 border-slate-800 hover:text-white'
                    }`}
                  >
                    <span>{subtitle}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* TikTok Dashboard Subtitles Menu Bar */}
        {selectedCategory === 'tiktok' && (
          <div className="mb-6 p-4 rounded-2xl bg-[#0F172A]/90 border border-pink-950/60 shadow-inner">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FE2C55] animate-pulse"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#25F4EE] animate-pulse"></span>
                <span className="text-xs font-black uppercase tracking-wider text-rose-400">
                  TikTok Subtitles
                </span>
                <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded-full font-bold">
                  {TIKTOK_SUBTITLES.length} Subtitles
                </span>
              </div>
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                Tap any subtitle to pick package
              </span>
            </div>

            {/* Scrollable Subtitles Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none">
              {TIKTOK_SUBTITLES.map((subtitle) => {
                const isActive = (activeService.subCategory === subtitle) || (selectedTiktokSubtitle === subtitle);
                return (
                  <button
                    key={subtitle}
                    type="button"
                    onClick={() => handleSelectTiktokSubtitle(subtitle)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border flex items-center space-x-1.5 ${
                      isActive
                        ? 'bg-gradient-to-r from-[#FE2C55] to-[#E01A4F] text-white border-pink-400 shadow-lg shadow-pink-900/50 font-black scale-[1.02]'
                        : 'bg-[#131C2E] hover:bg-[#1C283F] text-slate-300 border-slate-800 hover:text-white'
                    }`}
                  >
                    <span>{subtitle}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Instagram Dashboard Subtitles Menu Bar */}
        {selectedCategory === 'instagram' && (
          <div className="mb-6 p-4 rounded-2xl bg-[#0F172A]/90 border border-pink-950/60 shadow-inner">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E1306C] animate-pulse"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#833AB4] animate-pulse"></span>
                <span className="text-xs font-black uppercase tracking-wider text-pink-400">
                  Instagram Subtitles
                </span>
                <span className="text-[10px] bg-pink-500/20 text-pink-300 border border-pink-500/30 px-2 py-0.5 rounded-full font-bold">
                  {INSTAGRAM_SUBTITLES.length} Subtitles
                </span>
              </div>
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                Tap any subtitle to pick package
              </span>
            </div>

            {/* Scrollable Subtitles Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none">
              {INSTAGRAM_SUBTITLES.map((subtitle) => {
                const isActive = (activeService.subCategory === subtitle) || (selectedIgSubtitle === subtitle);
                return (
                  <button
                    key={subtitle}
                    type="button"
                    onClick={() => handleSelectIgSubtitle(subtitle)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border flex items-center space-x-1.5 ${
                      isActive
                        ? 'bg-gradient-to-r from-[#E1306C] via-[#FD1D1D] to-[#F77737] text-white border-pink-400 shadow-lg shadow-pink-900/50 font-black scale-[1.02]'
                        : 'bg-[#131C2E] hover:bg-[#1C283F] text-slate-300 border-slate-800 hover:text-white'
                    }`}
                  >
                    <span>{subtitle}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* YouTube Dashboard Subtitles Menu Bar */}
        {selectedCategory === 'youtube' && (
          <div className="mb-6 p-4 rounded-2xl bg-[#0F172A]/90 border border-red-950/60 shadow-inner">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF0000] animate-pulse"></span>
                <span className="text-xs font-black uppercase tracking-wider text-red-400">
                  YouTube Subtitles
                </span>
                <span className="text-[10px] bg-red-500/20 text-red-300 border border-red-500/30 px-2 py-0.5 rounded-full font-bold">
                  {YOUTUBE_SUBTITLES.length} Subtitles
                </span>
              </div>
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                Tap any subtitle to pick package
              </span>
            </div>

            {/* Scrollable Subtitles Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none">
              {YOUTUBE_SUBTITLES.map((subtitle) => {
                const isActive = (activeService.subCategory === subtitle) || (selectedYtSubtitle === subtitle);
                return (
                  <button
                    key={subtitle}
                    type="button"
                    onClick={() => handleSelectYtSubtitle(subtitle)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border flex items-center space-x-1.5 ${
                      isActive
                        ? 'bg-gradient-to-r from-[#FF0000] to-[#CC0000] text-white border-red-400 shadow-lg shadow-red-900/50 font-black scale-[1.02]'
                        : 'bg-[#131C2E] hover:bg-[#1C283F] text-slate-300 border-slate-800 hover:text-white'
                    }`}
                  >
                    <span>{subtitle}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Telegram Dashboard Subtitles Menu Bar */}
        {selectedCategory === 'telegram' && (
          <div className="mb-6 p-4 rounded-2xl bg-[#0F172A]/90 border border-sky-950/60 shadow-inner">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#229ED9] animate-pulse"></span>
                <span className="text-xs font-black uppercase tracking-wider text-sky-400">
                  Telegram Subtitles
                </span>
                <span className="text-[10px] bg-sky-500/20 text-sky-300 border border-sky-500/30 px-2 py-0.5 rounded-full font-bold">
                  {TELEGRAM_SUBTITLES.length} Subtitles
                </span>
              </div>
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                Tap any subtitle to pick package
              </span>
            </div>

            {/* Scrollable Subtitles Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none">
              {TELEGRAM_SUBTITLES.map((subtitle) => {
                const isActive = (activeService.subCategory === subtitle) || (selectedTgSubtitle === subtitle);
                return (
                  <button
                    key={subtitle}
                    type="button"
                    onClick={() => handleSelectTgSubtitle(subtitle)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border flex items-center space-x-1.5 ${
                      isActive
                        ? 'bg-gradient-to-r from-[#229ED9] to-[#0088cc] text-white border-sky-400 shadow-lg shadow-sky-900/50 font-black scale-[1.02]'
                        : 'bg-[#131C2E] hover:bg-[#1C283F] text-slate-300 border-slate-800 hover:text-white'
                    }`}
                  >
                    <span>{subtitle}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Dashboard 2-Column Grid */}
        <form onSubmit={handleStartOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column (8 cols): Enter Quantity + Paste Link + Amount/Price + Place Order */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Section: Enter Quantity */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-slate-300 text-sm font-bold">
                  <span className="font-mono text-base">🔢</span>
                  <span>Enter Quantity</span>
                  <span className="text-xs font-normal text-slate-400 ml-2">
                    {activeService.category === 'facebook' ? (
                      isFbAudit(activeService)
                        ? '(Official Audit Package • 1,300 bob flat rate)'
                        : `(Multiples of 100 only • ${getFbRatePer100(activeService)} bob per 100)`
                    ) : activeService.category === 'tiktok' ? (
                      activeService.packagePrice
                        ? `(Fixed Package • ${activeService.fixedQuantity?.toLocaleString()} units)`
                        : `(Multiples of 100 only • ${getTiktokRatePer100(activeService)} bob per 100)`
                    ) : activeService.category === 'instagram' ? (
                      `(Multiples of 100 only • ${getInstagramRatePer100(activeService)} bob per 100)`
                    ) : activeService.category === 'youtube' ? (
                      `(Multiples of 100 only • ${getYouTubeRatePer100(activeService)} bob per 100)`
                    ) : activeService.category === 'telegram' ? (
                      `(Multiples of 100 only • ${getTelegramRatePer100(activeService)} bob per 100)`
                    ) : (
                      (activeService.type === 'likes' || activeService.name.toLowerCase().includes('like'))
                        ? '(Multiples of 100 only • 45 bob per 100)'
                        : '(Multiples of 100 only)'
                    )}
                  </span>
                </div>

                {/* 2-Column Grid of Capsule Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  
                  {/* Option 1: 100 (or 1 for Audit) */}
                  <button
                    type="button"
                    onClick={() => handleSelectPreset(isFbAudit(activeService) ? 1 : 100)}
                    className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-black transition-all cursor-pointer ${
                      (isFbAudit(activeService) ? quantity === 1 : quantity === 100) && !isCustomQty
                        ? 'bg-[#152033] text-white border-2 border-[#FF6A00] shadow-lg shadow-orange-950/20'
                        : 'bg-[#121A2A] hover:bg-[#182338] text-slate-200 border border-slate-800'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-rose-500 text-base">❤️</span>
                      <span className="tracking-wide">{isFbAudit(activeService) ? '1 Audit' : '100'}</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {formatCurrency(calculateCost(isFbAudit(activeService) ? 1 : 100), currency)}
                    </span>
                  </button>

                  {/* Option 2: 500 */}
                  <button
                    type="button"
                    onClick={() => handleSelectPreset(500)}
                    className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-black transition-all cursor-pointer ${
                      quantity === 500 && !isCustomQty
                        ? 'bg-[#152033] text-white border-2 border-[#FF6A00] shadow-lg shadow-orange-950/20'
                        : 'bg-[#121A2A] hover:bg-[#182338] text-slate-200 border border-slate-800'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-rose-500 text-base">❤️</span>
                      <span className="tracking-wide">500</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {formatCurrency(calculateCost(500), currency)}
                    </span>
                  </button>

                  {/* Option 3: 1 000 */}
                  <button
                    type="button"
                    onClick={() => handleSelectPreset(1000)}
                    className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-black transition-all cursor-pointer ${
                      quantity === 1000 && !isCustomQty
                        ? 'bg-[#152033] text-white border-2 border-[#FF6A00] shadow-lg shadow-orange-950/20'
                        : 'bg-[#121A2A] hover:bg-[#182338] text-slate-200 border border-slate-800'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-rose-500 text-base">❤️</span>
                      <span className="tracking-wide">1 000</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {formatCurrency(calculateCost(1000), currency)}
                    </span>
                  </button>

                  {/* Option 4: 2 500 */}
                  <button
                    type="button"
                    onClick={() => handleSelectPreset(2500)}
                    className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-black transition-all cursor-pointer ${
                      quantity === 2500 && !isCustomQty
                        ? 'bg-[#152033] text-white border-2 border-[#FF6A00] shadow-lg shadow-orange-950/20'
                        : 'bg-[#121A2A] hover:bg-[#182338] text-slate-200 border border-slate-800'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-rose-500 text-base">❤️</span>
                      <span className="tracking-wide">2 500</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {formatCurrency(calculateCost(2500), currency)}
                    </span>
                  </button>

                  {/* Option 5: 5 000 */}
                  <button
                    type="button"
                    onClick={() => handleSelectPreset(5000)}
                    className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-black transition-all cursor-pointer ${
                      quantity === 5000 && !isCustomQty
                        ? 'bg-[#152033] text-white border-2 border-[#FF6A00] shadow-lg shadow-orange-950/20'
                        : 'bg-[#121A2A] hover:bg-[#182338] text-slate-200 border border-slate-800'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-rose-500 text-base">❤️</span>
                      <span className="tracking-wide">5 000</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {formatCurrency(calculateCost(5000), currency)}
                    </span>
                  </button>

                  {/* Option 6: Choose own */}
                  <button
                    type="button"
                    onClick={handleChooseOwn}
                    className={`flex items-center justify-center px-4 py-3 rounded-2xl text-sm font-black transition-all cursor-pointer ${
                      isCustomQty
                        ? 'bg-[#152033] text-white border-2 border-[#FF6A00] shadow-lg shadow-orange-950/20'
                        : 'bg-[#121A2A] hover:bg-[#182338] text-slate-300 border border-slate-800'
                    }`}
                  >
                    <span>Choose own</span>
                  </button>

                </div>

                {/* If "Choose own" is selected, render hundreds stepper */}
                {isCustomQty && (
                  <div className="p-3.5 rounded-2xl bg-[#121A2A] border border-slate-700/80 space-y-2 animate-in fade-in">
                    <div className="flex items-center justify-between text-xs text-slate-300 font-bold">
                      <span>Custom Hundreds Amount:</span>
                      <span className="text-emerald-400 font-mono">Multiples of 100 only</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => stepHundreds(-100)}
                        className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-black text-xs cursor-pointer"
                      >
                        -100
                      </button>

                      <input
                        type="number"
                        step={100}
                        min={100}
                        max={100000}
                        value={customInputVal}
                        onChange={(e) => handleCustomChange(e.target.value)}
                        placeholder="e.g. 200, 300, 400..."
                        className="flex-1 bg-[#090D16] border border-slate-700 focus:border-[#FF6A00] rounded-xl px-4 py-2 text-center text-white font-mono font-black text-base focus:outline-none"
                      />

                      <button
                        type="button"
                        onClick={() => stepHundreds(100)}
                        className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-black text-xs cursor-pointer"
                      >
                        +100
                      </button>
                    </div>

                    {/* Quick hundreds chips */}
                    <div className="flex items-center space-x-1.5 pt-1 overflow-x-auto scrollbar-none text-[11px] font-mono">
                      <span className="text-slate-400">Presets:</span>
                      {[200, 300, 400, 600, 700, 800, 1500].map((h) => (
                        <button
                          key={h}
                          type="button"
                          onClick={() => {
                            setQuantity(h);
                            setCustomInputVal(h.toString());
                            setErrorMsg(null);
                          }}
                          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold"
                        >
                          {h}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Section: Paste Link */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm font-bold text-slate-300">
                  <div className="flex items-center space-x-2">
                    <span className="text-base">🔗</span>
                    <span>Paste Link</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setTargetLink(activeService.linkExample)}
                    className="text-xs text-emerald-400 hover:text-emerald-300 underline font-medium cursor-pointer"
                  >
                    Sample Link
                  </button>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={targetLink}
                    onChange={(e) => setTargetLink(e.target.value)}
                    placeholder={activeService.linkPlaceholder || 'https://www.facebook.com/...'}
                    className="w-full bg-[#121A2A] border border-slate-700/80 focus:border-[#FF6A00] rounded-2xl px-4 py-3.5 text-sm text-white font-mono placeholder-slate-500 focus:outline-none transition-colors"
                  />
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5 px-1">
                    <span className="flex items-center space-x-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>Filtered for compliance (No adult, scam, or illicit links)</span>
                    </span>
                    {onOpenTerms && (
                      <button
                        type="button"
                        onClick={onOpenTerms}
                        className="text-emerald-400 hover:text-emerald-300 underline font-semibold cursor-pointer shrink-0 ml-2"
                      >
                        Prohibited terms
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Amount and Price Readouts (As in screenshot) */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between text-sm sm:text-base font-bold text-slate-300">
                  <span>Amount</span>
                  <span className="font-mono text-white text-base sm:text-lg">
                    {quantity.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between text-base sm:text-xl font-bold text-slate-200">
                  <span>Price</span>
                  <div className="text-right">
                    <span className="font-mono font-black text-2xl sm:text-3xl text-white">
                      {formatCurrency(finalCostInKES, currency)}
                    </span>
                    {activeService.category === 'facebook' ? (
                      isFbAudit(activeService) ? (
                        <span className="block text-[11px] text-emerald-400 font-bold">
                          (Facebook Audit: 1,300 Ksh complete report)
                        </span>
                      ) : (
                        <span className="block text-[11px] text-emerald-400 font-bold">
                          ({activeService.subCategory || 'Facebook Service'}: 100 at {getFbRatePer100(activeService)} Ksh &bull; Multiplied in 100s)
                        </span>
                      )
                    ) : activeService.category === 'tiktok' ? (
                      <span className="block text-[11px] text-[#FE2C55] font-bold">
                        ({activeService.subCategory || 'TikTok Service'}: {activeService.packagePrice ? `Package: ${formatCurrency(activeService.packagePrice, currency)}` : `100 at ${getTiktokRatePer100(activeService)} Ksh • Multiplied in 100s`})
                      </span>
                    ) : activeService.category === 'instagram' ? (
                      <span className="block text-[11px] text-[#E1306C] font-bold">
                        ({activeService.subCategory || 'Instagram Service'}: 100 at {getInstagramRatePer100(activeService)} Ksh • Multiplied in 100s)
                      </span>
                    ) : activeService.category === 'youtube' ? (
                      <span className="block text-[11px] text-[#FF0000] font-bold">
                        ({activeService.subCategory || 'YouTube Service'}: 100 at {getYouTubeRatePer100(activeService)} Ksh • Multiplied in 100s)
                      </span>
                    ) : activeService.category === 'telegram' ? (
                      <span className="block text-[11px] text-[#229ED9] font-bold">
                        ({activeService.subCategory || 'Telegram Service'}: 100 at {getTelegramRatePer100(activeService)} Ksh • Multiplied in 100s)
                      </span>
                    ) : (
                      (activeService.type === 'likes' || activeService.name.toLowerCase().includes('like')) && (
                        <span className="block text-[11px] text-[#FF6A00] font-semibold">
                          (Likes bundle: 100 at 45 bob • Multiplied in 100s)
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Method Selector Dropdown / Pills */}
              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <span>Payment Gateway:</span>
                  <span className="text-emerald-400">Direct M-Pesa STK Push Available</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('mpesa')}
                    className={`flex items-center space-x-2 p-2.5 rounded-xl border font-bold cursor-pointer transition-all ${
                      paymentMethod === 'mpesa'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                        : 'bg-slate-900/60 text-slate-400 border-slate-800'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    <span>Lipa Na M-Pesa</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('wallet')}
                    className={`flex items-center space-x-2 p-2.5 rounded-xl border font-bold cursor-pointer transition-all ${
                      paymentMethod === 'wallet'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                        : 'bg-slate-900/60 text-slate-400 border-slate-800'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-emerald-400" />
                    <span>Wallet ({formatCurrency(walletBalance, currency)})</span>
                  </button>
                </div>

                {paymentMethod === 'mpesa' && (
                  <div className="pt-1 space-y-2">
                    <label className="text-[11px] font-bold text-slate-300 block">
                      Your Safaricom Phone Number (to receive M-Pesa prompt):
                    </label>
                    <input
                      type="tel"
                      value={mpesaPhone}
                      onChange={(e) => setMpesaPhone(e.target.value)}
                      placeholder="07XXXXXXXX or 01XXXXXXXX"
                      className="w-full bg-[#121A2A] border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-emerald-300 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>Prompt recipient line: <strong className="text-white">{mpesaPhone || 'Your Safaricom line'}</strong></span>
                      <button
                        type="button"
                        onClick={onOpenDeposit}
                        className="text-emerald-400 hover:text-emerald-300 underline font-sans font-bold"
                      >
                        Or pay direct to {paymentPhone} &rarr;
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2 font-medium">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Action Button: "Place order Now" (Orange gradient matching screenshot) */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#FF6A00] to-[#FF4500] hover:from-[#ff7919] hover:to-[#ff5414] text-white font-black text-base sm:text-lg tracking-wide shadow-xl shadow-orange-950/30 transition-all active:scale-[0.99] cursor-pointer flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <span>Place order Now</span>
                )}
              </button>

            </div>

            {/* Right Column (4 cols): Service ID + Favorite toggle + Speedometer Gauge + Refill Badge */}
            <div className="lg:col-span-4 space-y-6 lg:border-l lg:border-slate-800/80 lg:pl-8">
              
              {/* Service ID with copy icon */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-300">Service ID</span>
                <div className="flex items-center space-x-1.5 bg-[#121A2A] px-3 py-1 rounded-xl border border-slate-800">
                  <span className="font-mono font-bold text-xs sm:text-sm text-white">
                    {activeService.id.replace(/[^0-9]/g, '') || '6206'}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyId}
                    className="text-slate-400 hover:text-white cursor-pointer ml-1"
                    title="Copy Service ID"
                  >
                    {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Favorite Toggle Switch */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5 text-sm font-bold text-slate-300">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>Favorite</span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ${
                    isFavorite ? 'bg-[#FF6A00]' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                      isFavorite ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  ></div>
                </button>
              </div>

              {/* Speedometer Gauge Arc (Exact Match to screenshot) */}
              <div className="pt-2 flex flex-col items-center justify-center">
                <div className="relative w-44 h-28 flex items-center justify-center">
                  <svg className="w-44 h-44 -rotate-90 transform" viewBox="0 0 160 160">
                    {/* Background dark arc */}
                    <circle
                      cx="80"
                      cy="80"
                      r="60"
                      stroke="#182338"
                      strokeWidth="14"
                      fill="transparent"
                      strokeDasharray="282.7"
                      strokeDashoffset="94.2"
                      strokeLinecap="round"
                    />
                    {/* Glowing green speed arc (Right portion) */}
                    <circle
                      cx="80"
                      cy="80"
                      r="60"
                      stroke="#00E676"
                      strokeWidth="14"
                      fill="transparent"
                      strokeDasharray="282.7"
                      strokeDashoffset="210"
                      strokeLinecap="round"
                      className="filter drop-shadow-[0_0_8px_rgba(0,230,118,0.5)]"
                    />
                  </svg>

                  {/* Center Content: Speed ? Fast */}
                  <div className="absolute top-12 flex flex-col items-center justify-center text-center">
                    <div className="flex items-center space-x-1 text-[11px] text-slate-400 font-semibold">
                      <span>Speed</span>
                      <span className="text-[#FF6A00] font-black cursor-help" title="High-speed automated delivery queue">
                        ?
                      </span>
                    </div>
                    <span className="text-base font-black text-white tracking-wide mt-0.5">
                      Fast
                    </span>
                  </div>
                </div>
              </div>

              {/* Refill Badge (As in screenshot) */}
              <div className="flex justify-center">
                <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-[#122428] border border-emerald-500/30 text-emerald-400 text-xs font-bold shadow-sm">
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Refill 30 days</span>
                </div>
              </div>

              {/* Extra Security Note */}
              <div className="bg-[#121A2A]/60 p-3.5 rounded-2xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div className="flex items-center space-x-1 text-slate-300 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>100% Non-Drop Quality</span>
                </div>
                <p>
                  Guaranteed safe delivery. Refills trigger automatically if any drop is detected within the warranty window.
                </p>
              </div>

            </div>

          </div>
        </form>

      </div>

      {/* M-PESA STK Push Simulator Prompt Modal */}
      {stkPromptActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="w-full max-w-sm rounded-3xl bg-[#0F172A] border border-emerald-500/50 p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-bold text-emerald-400 tracking-wider">
                  SAFARICOM M-PESA STK PUSH
                </span>
              </div>
              <button
                onClick={() => setStkPromptActive(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="my-5 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto ring-4 ring-emerald-500/30">
                <Smartphone className="w-8 h-8 animate-bounce" />
              </div>

              <h3 className="text-base font-bold text-white">
                SIM Toolkit Prompt Received
              </h3>
              
              <div className="bg-[#05110E] p-3.5 rounded-xl border border-emerald-500/30 text-left font-mono text-xs text-emerald-300 space-y-1">
                <p>Do you want to pay <strong>Ksh {finalCostInKES.toLocaleString()}</strong> to <strong>KEN TECH LIKES LTD</strong>?</p>
                <p className="text-[11px] text-slate-400">Recipient Line: {paymentPhone} / Till: {paybill} (Ref: {activeService.id})</p>
                <p className="text-[11px] text-emerald-400 font-bold">Prompt Sent to: {mpesaPhone || 'Your Safaricom line'}</p>
                <p className="text-[11px] text-[#FF6A00]">Units: {quantity.toLocaleString()} {activeService.type || 'units'}</p>
              </div>

              <div className="pt-2">
                <label className="text-xs text-slate-300 block mb-1">
                  Enter M-Pesa PIN (Simulated):
                </label>
                <input
                  type="password"
                  maxLength={4}
                  value={stkPin}
                  onChange={(e) => setStkPin(e.target.value)}
                  placeholder="&bull;&bull;&bull;&bull;"
                  className="w-32 mx-auto text-center bg-black border border-emerald-500/60 rounded-lg py-1.5 text-base text-emerald-400 font-mono tracking-widest focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={handleMpesaStkAuthorize}
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF6A00] to-[#FF4500] text-white font-black text-sm transition-all shadow cursor-pointer active:scale-95"
              >
                {isSubmitting ? 'Verifying with Safaricom...' : 'Authorize & Pay Ksh ' + finalCostInKES.toLocaleString()}
              </button>

              <button
                type="button"
                onClick={() => setStkPromptActive(false)}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
              >
                Cancel STK Push
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Placed Success Receipt Modal */}
      {lastPlacedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-emerald-500/40 p-6 shadow-2xl space-y-4">
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-white">Order Successfully Placed!</h3>
              <p className="text-xs text-slate-400 mt-1">
                Your request has been routed to our automated server queue.
              </p>
            </div>

            <div className="rounded-2xl bg-[#090D16] border border-slate-800 p-4 space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Order ID:</span>
                <span className="font-mono font-bold text-emerald-400">{lastPlacedOrder.id}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Service:</span>
                <span className="font-medium text-white text-right max-w-[220px] truncate">{lastPlacedOrder.serviceName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Quantity:</span>
                <span className="font-mono font-bold text-white">{lastPlacedOrder.quantity.toLocaleString()} units</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Amount Paid:</span>
                <span className="font-mono font-bold text-emerald-400">{formatCurrency(lastPlacedOrder.charge, currency)}</span>
              </div>
              {lastPlacedOrder.mpesaRef && (
                <div className="flex justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-slate-400">M-Pesa Receipt Code:</span>
                  <span className="font-mono font-bold text-emerald-400">{lastPlacedOrder.mpesaRef}</span>
                </div>
              )}
              <div className="flex justify-between pt-1">
                <span className="text-slate-400">Status:</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  {lastPlacedOrder.status} (In Queue)
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  const id = lastPlacedOrder.id;
                  setLastPlacedOrder(null);
                  onViewOrder(id);
                }}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#FF6A00] to-[#FF4500] text-white font-bold text-xs flex items-center justify-center space-x-1.5 cursor-pointer shadow-lg active:scale-95"
              >
                <span>Track Live Status</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setLastPlacedOrder(null)}
                className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
