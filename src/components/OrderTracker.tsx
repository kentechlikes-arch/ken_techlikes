import React, { useState } from 'react';
import { 
  Search, 
  Clock, 
  CheckCircle2, 
  RotateCcw, 
  ExternalLink, 
  AlertCircle, 
  TrendingUp, 
  Copy, 
  Check,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { Currency, OrderRecord } from '../types';
import { formatCurrency, PLATFORMS_CONFIG } from '../data/servicesData';
import { SocialBrandIcon } from './SocialBrandIcons';

interface OrderTrackerProps {
  orders: OrderRecord[];
  currency: Currency;
  onRequestRefill: (orderId: string) => void;
  searchedOrderId?: string;
}

export const OrderTracker: React.FC<OrderTrackerProps> = ({
  orders,
  currency,
  onRequestRefill,
  searchedOrderId = '',
}) => {
  const [searchTerm, setSearchTerm] = useState(searchedOrderId);
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [refillSuccessMsg, setRefillSuccessMsg] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRefillClick = (orderId: string) => {
    onRequestRefill(orderId);
    setRefillSuccessMsg(`Automated refill triggered for Order #${orderId}. Missing counts are being resupplied.`);
    setTimeout(() => setRefillSuccessMsg(null), 4000);
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.link.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.mpesaRef && order.mpesaRef.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    if (activeFilter === 'active') {
      return order.status === 'Pending' || order.status === 'In Progress' || order.status === 'Delivering';
    }
    if (activeFilter === 'completed') {
      return order.status === 'Completed';
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header & Quick Lookup */}
      <div className="rounded-2xl bg-[#0F172A]/95 border border-slate-700 p-5 sm:p-7 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
              <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight">
                My Orders & History
              </h2>
              <span className="text-xs font-mono font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-3 py-1 rounded-full shadow-sm">
                {orders.length} Total Orders
              </span>
            </div>
            <p className="text-sm font-medium text-slate-300 mt-1.5">
              Live automated status updates with start count, delivery rate, and refill telemetry.
            </p>
          </div>

          {/* Search box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Track by Order ID (e.g. KT-94812)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#090D16] border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 font-mono font-semibold"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-2 mt-5 pt-4 border-t border-slate-800">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer shadow-sm ${
              activeFilter === 'all'
                ? 'bg-emerald-500 text-black font-black'
                : 'bg-slate-900 hover:bg-slate-800 text-white border border-slate-700'
            }`}
          >
            All Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveFilter('active')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer shadow-sm ${
              activeFilter === 'active'
                ? 'bg-emerald-500 text-black font-black'
                : 'bg-slate-900 hover:bg-slate-800 text-white border border-slate-700'
            }`}
          >
            Delivering & In Progress ({orders.filter(o => o.status !== 'Completed' && o.status !== 'Canceled').length})
          </button>
          <button
            onClick={() => setActiveFilter('completed')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer shadow-sm ${
              activeFilter === 'completed'
                ? 'bg-emerald-500 text-black font-black'
                : 'bg-slate-900 hover:bg-slate-800 text-white border border-slate-700'
            }`}
          >
            Completed ({orders.filter(o => o.status === 'Completed').length})
          </button>
        </div>
      </div>

      {/* Refill Success Notification */}
      {refillSuccessMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-sm font-semibold flex items-center justify-between animate-in fade-in shadow-md">
          <div className="flex items-center space-x-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{refillSuccessMsg}</span>
          </div>
          <button onClick={() => setRefillSuccessMsg(null)} className="text-slate-300 hover:text-white font-bold">✕</button>
        </div>
      )}

      {/* Orders List / Cards */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-12 text-center text-slate-300 font-semibold">
            <Clock className="w-10 h-10 mx-auto mb-3 text-slate-600" />
            <p className="text-lg font-bold text-white">No matching orders found</p>
            <p className="text-sm text-slate-400 mt-1">
              Check your search query or place a new order using the order form.
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const platConf = PLATFORMS_CONFIG[order.platform];
            const delivered = order.currentCount - order.startCount;
            const progress = Math.min(100, Math.max(5, Math.round((delivered / order.quantity) * 100)));

            const statusColors: Record<string, { bg: string; text: string; border: string }> = {
              'Delivering': { bg: 'bg-cyan-500/20', text: 'text-cyan-300 font-black', border: 'border-cyan-500/40' },
              'In Progress': { bg: 'bg-amber-500/20', text: 'text-amber-300 font-black', border: 'border-amber-500/40' },
              'Pending': { bg: 'bg-indigo-500/20', text: 'text-indigo-300 font-black', border: 'border-indigo-500/40' },
              'Completed': { bg: 'bg-emerald-500/20', text: 'text-emerald-300 font-black', border: 'border-emerald-500/40' },
              'Canceled': { bg: 'bg-rose-500/20', text: 'text-rose-300 font-black', border: 'border-rose-500/40' },
            };

            const st = statusColors[order.status] || statusColors['Pending'];

            return (
              <div 
                key={order.id}
                className="rounded-2xl bg-[#0F172A]/95 border border-slate-700 p-5 sm:p-6 shadow-lg space-y-4 transition-all hover:border-slate-600"
              >
                {/* Top Bar: ID, Date, Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3.5">
                  <div className="flex items-center space-x-2.5">
                    <span className="font-mono font-black text-base text-white">
                      #{order.id}
                    </span>
                    <button
                      onClick={() => handleCopy(order.id)}
                      title="Copy Order ID"
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                    >
                      {copiedId === order.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <span className="text-slate-600">&bull;</span>
                    <span className="text-xs sm:text-sm font-semibold text-slate-300">{order.createdAt}</span>
                    {order.mpesaRef && (
                      <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        M-Pesa: {order.mpesaRef}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border shadow-sm ${st.bg} ${st.text} ${st.border}`}>
                      {order.status}
                    </span>
                    <span className="font-mono font-black text-base sm:text-lg text-emerald-400">
                      {formatCurrency(order.charge, currency)}
                    </span>
                  </div>
                </div>

                {/* Service Details with REAL OFFICIAL BRAND ICON */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <SocialBrandIcon platform={order.platform} size={26} withBg />
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                        {platConf?.name || order.platform}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-white">
                        {order.serviceName}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-xs sm:text-sm font-mono text-slate-200 bg-slate-900/90 p-3 rounded-xl border border-slate-700/80 break-all font-medium">
                    <span className="text-slate-400 font-bold shrink-0">Target URL:</span>
                    <a 
                      href={order.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-emerald-400 hover:text-emerald-300 underline flex items-center space-x-1 truncate font-semibold"
                    >
                      <span>{order.link}</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0 inline ml-1" />
                    </a>
                  </div>
                </div>

                {/* Progress Bar & Telemetry */}
                <div className="space-y-2 bg-[#090D16] p-4 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between text-xs sm:text-sm text-slate-200 font-mono font-bold">
                    <span>Progress: {progress}%</span>
                    <span>
                      Start: <strong className="text-white">{order.startCount.toLocaleString()}</strong> &bull; Target: <strong className="text-emerald-400">{order.targetCount.toLocaleString()}</strong>
                    </span>
                  </div>

                  {/* Bar */}
                  <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        order.status === 'Completed'
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                          : 'bg-gradient-to-r from-cyan-500 via-emerald-400 to-teal-400 animate-pulse'
                      }`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between text-xs font-semibold text-slate-300 pt-1">
                    <span>Ordered Units: <strong className="text-white font-mono">{order.quantity.toLocaleString()}</strong></span>
                    <span>Remaining Units: <strong className="text-emerald-400 font-mono">{Math.max(0, order.targetCount - order.currentCount).toLocaleString()}</strong></span>
                  </div>
                </div>

                {/* Action Bar: Refill & Verification */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center space-x-2 text-xs sm:text-sm font-semibold text-slate-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Non-Drop Guarantee Active</span>
                  </div>

                  {order.refillEligible && (
                    <button
                      onClick={() => handleRefillClick(order.id)}
                      className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs sm:text-sm font-bold text-emerald-400 border border-slate-700 hover:border-emerald-500/40 transition-colors cursor-pointer shadow-sm"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Request Free Refill</span>
                    </button>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
