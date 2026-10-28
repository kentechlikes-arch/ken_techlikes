import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  RotateCcw, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  DollarSign, 
  Wallet, 
  TrendingUp, 
  Megaphone, 
  Key, 
  Layers, 
  Save, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Activity, 
  UserCheck, 
  Lock, 
  RefreshCw,
  Settings,
  Phone,
  Mail,
  Sliders,
  Eye,
  Check,
  CreditCard,
  Percent,
  X
} from 'lucide-react';
import { 
  OrderRecord, 
  TransactionRecord, 
  ServiceItem, 
  Currency, 
  OrderStatus, 
  PlatformId,
  ServiceType,
  SystemSettings
} from '../types';
import { formatCurrency, PLATFORMS_CONFIG } from '../data/servicesData';
import { DESIGNATED_ADMIN_UID } from '../lib/firebase';
import { RESERVED_USERNAMES, PROHIBITED_KEYWORDS } from '../lib/termsPolicy';

interface AdminPanelProps {
  orders: OrderRecord[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onRefundOrder: (orderId: string, charge: number, reason?: string) => void;
  onBoostOrder: (orderId: string, boostAmount: number) => void;
  services: ServiceItem[];
  onUpdateServiceRate: (serviceId: string, newRate: number) => void;
  onToggleServiceStatus: (serviceId: string, disabled: boolean) => void;
  onAddCustomService: (newService: ServiceItem) => void;
  onEditService?: (serviceId: string, updates: Partial<ServiceItem>) => void;
  onDeleteService?: (serviceId: string) => void;
  transactions: TransactionRecord[];
  walletBalance: number;
  onAdjustWalletBalance: (deltaAmount: number, reason: string) => void;
  broadcastNotice: string;
  onUpdateBroadcastNotice: (notice: string) => void;
  currency: Currency;
  adminUid: string;
  systemSettings?: SystemSettings;
  onUpdateSystemSettings?: (settings: Partial<SystemSettings>) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  orders,
  onUpdateOrderStatus,
  onRefundOrder,
  onBoostOrder,
  services,
  onUpdateServiceRate,
  onToggleServiceStatus,
  onAddCustomService,
  onEditService,
  onDeleteService,
  transactions,
  walletBalance,
  onAdjustWalletBalance,
  broadcastNotice,
  onUpdateBroadcastNotice,
  currency,
  adminUid,
  systemSettings,
  onUpdateSystemSettings
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'services' | 'finances' | 'broadcast' | 'settings' | 'access'>('orders');
  
  // Real-time Main Web Sync Toast
  const [liveToast, setLiveToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setLiveToast(msg);
    setTimeout(() => setLiveToast(null), 4000);
  };

  // Orders filter & search state
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  
  // Services search & filter
  const [serviceSearch, setServiceSearch] = useState('');
  const [servicePlatformFilter, setServicePlatformFilter] = useState<string>('all');
  const [editingRateId, setEditingRateId] = useState<string | null>(null);
  const [editRateValue, setEditRateValue] = useState<number>(0);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  
  // Add service modal
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [newSvcName, setNewSvcName] = useState('');
  const [newSvcPlatform, setNewSvcPlatform] = useState<PlatformId>('tiktok');
  const [newSvcRate, setNewSvcRate] = useState<number>(100);
  const [newSvcMin, setNewSvcMin] = useState<number>(50);
  const [newSvcMax, setNewSvcMax] = useState<number>(100000);
  const [newSvcSpeed, setNewSvcSpeed] = useState('Instant (0-15m)');
  const [newSvcDescription, setNewSvcDescription] = useState('');
  
  // Financial adjustment
  const [adjAmount, setAdjAmount] = useState<string>('');
  const [adjType, setAdjType] = useState<'credit' | 'debit'>('credit');
  const [adjReason, setAdjReason] = useState<string>('Administrative manual adjustment');
  const [adjFeedback, setAdjFeedback] = useState<string | null>(null);

  // Broadcast state & preset templates
  const [noticeDraft, setNoticeDraft] = useState(broadcastNotice);
  const [noticeSavedFeedback, setNoticeSavedFeedback] = useState(false);

  // Storefront & Payment Settings State
  const [settTill, setSettTill] = useState(systemSettings?.tillNumber || '1856074');
  const [settPhone, setSettPhone] = useState(systemSettings?.paymentPhone || '0793749604');
  const [settPaybill, setSettPaybill] = useState(systemSettings?.tillNumber || systemSettings?.paybill || '1856074');
  const [settEmail, setSettEmail] = useState(systemSettings?.supportEmail || 'kentechlikeS@gmail.com');
  const [settHelp, setSettHelp] = useState(systemSettings?.supportPhone || '+254 793 749 604');
  const [settBonus, setSettBonus] = useState(systemSettings?.promoBonusPercent || 10);
  const [settingsSavedFeedback, setSettingsSavedFeedback] = useState(false);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      const matchSearch = 
        ord.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
        ord.serviceName.toLowerCase().includes(orderSearch.toLowerCase()) ||
        ord.link.toLowerCase().includes(orderSearch.toLowerCase()) ||
        (ord.mpesaRef && ord.mpesaRef.toLowerCase().includes(orderSearch.toLowerCase()));
      const matchStatus = orderStatusFilter === 'all' || ord.status === orderStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [orders, orderSearch, orderStatusFilter]);

  // Filtered services
  const filteredServices = useMemo(() => {
    return services.filter((svc) => {
      const matchSearch = 
        svc.name.toLowerCase().includes(serviceSearch.toLowerCase()) ||
        svc.id.includes(serviceSearch);
      const matchPlatform = servicePlatformFilter === 'all' || svc.category === servicePlatformFilter;
      return matchSearch && matchPlatform;
    });
  }, [services, serviceSearch, servicePlatformFilter]);

  // Financial aggregates
  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, o) => sum + (o.status !== 'Canceled' ? o.charge : 0), 0);
  }, [orders]);

  const totalDeposited = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'deposit')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  // Handlers
  const handleSaveRate = (serviceId: string) => {
    if (editRateValue > 0) {
      onUpdateServiceRate(serviceId, editRateValue);
      showToast(`Rate for #${serviceId} updated to ${editRateValue} KES. Live on storefront!`);
    }
    setEditingRateId(null);
  };

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSvcName.trim()) return;

    const newId = `ADMIN-${Math.floor(1000 + Math.random() * 9000)}`;
    const newServiceItem: ServiceItem = {
      id: newId,
      name: newSvcName.trim(),
      category: newSvcPlatform,
      categoryName: PLATFORMS_CONFIG[newSvcPlatform]?.name || 'Social',
      type: 'custom' as ServiceType,
      ratePer1000: Number(newSvcRate),
      minQuantity: Number(newSvcMin),
      maxQuantity: Number(newSvcMax),
      speed: newSvcSpeed,
      refill: '30 Days Auto-Refill',
      description: newSvcDescription.trim() || 'Premium high retention automated delivery service.',
      badge: 'VIP',
      linkPlaceholder: 'https://...',
      linkExample: 'https://...',
      averageTime: '5-15 mins'
    };

    onAddCustomService(newServiceItem);
    showToast(`Custom service "${newServiceItem.name}" created and added live to storefront!`);
    setIsAddServiceOpen(false);
    setNewSvcName('');
    setNewSvcDescription('');
  };

  const handleSaveEditedService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    if (onEditService) {
      onEditService(editingService.id, editingService);
    } else {
      onUpdateServiceRate(editingService.id, editingService.ratePer1000);
    }
    showToast(`Service "${editingService.name}" updated successfully! Reflects live on main web.`);
    setEditingService(null);
  };

  const handleDeleteServiceClick = (serviceId: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove service "${name}" (#${serviceId}) from the main web?`)) {
      if (onDeleteService) {
        onDeleteService(serviceId);
        showToast(`Service #${serviceId} permanently removed from main web.`);
      }
    }
  };

  const handleExecuteWalletAdj = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(adjAmount);
    if (isNaN(val) || val <= 0) return;

    const signedDelta = adjType === 'credit' ? val : -val;
    onAdjustWalletBalance(signedDelta, adjReason);
    setAdjAmount('');
    setAdjFeedback(`Wallet adjusted successfully by ${adjType === 'credit' ? '+' : '-'}${val} ${currency}`);
    showToast(`Wallet adjusted by ${adjType === 'credit' ? '+' : '-'}${val} ${currency}. Live on client ledger!`);
    setTimeout(() => setAdjFeedback(null), 3000);
  };

  const handleSaveBroadcast = () => {
    onUpdateBroadcastNotice(noticeDraft);
    setNoticeSavedFeedback(true);
    showToast("Broadcast announcement published live to storefront!");
    setTimeout(() => setNoticeSavedFeedback(false), 3000);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateSystemSettings) {
      onUpdateSystemSettings({
        tillNumber: settTill.trim(),
        paymentPhone: settPhone.trim(),
        paybill: settTill.trim(),
        supportEmail: settEmail.trim(),
        supportPhone: settHelp.trim(),
        promoBonusPercent: Number(settBonus),
      });
      setSettingsSavedFeedback(true);
      showToast("Storefront credentials & Till 1856074 synced to Cloud Firestore and live on main web!");
      setTimeout(() => setSettingsSavedFeedback(false), 3500);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Admin Header */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0C1525] via-[#09101C] to-[#0C1525] border border-emerald-500/30 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-black shadow-lg shadow-emerald-950/50">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  KEN_TECH Operations Admin Console
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Superadmin Active</span>
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 font-mono">
                Admin UID: <span className="text-emerald-400 font-bold">{adminUid || DESIGNATED_ADMIN_UID}</span> &bull; Cloud Firestore Authorized
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="bg-[#121A2A] border border-slate-700 px-3.5 py-2 rounded-xl text-right">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Current Ledger Wallet</span>
              <span className="text-base font-black text-emerald-400 font-mono">
                {formatCurrency(walletBalance, currency)}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mt-6 pt-6 border-t border-slate-800/80">
          <div className="p-3.5 rounded-2xl bg-[#121A2A]/90 border border-slate-800">
            <span className="text-xs text-slate-400 block font-medium">Total Orders Placed</span>
            <span className="text-xl font-black text-white font-mono mt-0.5 block">{orders.length}</span>
            <span className="text-[11px] text-emerald-400">{orders.filter(o => o.status === 'Completed').length} Completed</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#121A2A]/90 border border-slate-800">
            <span className="text-xs text-slate-400 block font-medium">Orders in Delivery</span>
            <span className="text-xl font-black text-amber-400 font-mono mt-0.5 block">
              {orders.filter(o => o.status === 'Delivering' || o.status === 'In Progress').length}
            </span>
            <span className="text-[11px] text-slate-400">Automated queue</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#121A2A]/90 border border-slate-800">
            <span className="text-xs text-slate-400 block font-medium">Gross Revenue Charged</span>
            <span className="text-xl font-black text-emerald-400 font-mono mt-0.5 block">
              {formatCurrency(totalRevenue, currency)}
            </span>
            <span className="text-[11px] text-slate-400">Order fees collected</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#121A2A]/90 border border-slate-800">
            <span className="text-xs text-slate-400 block font-medium">Live Catalog Services</span>
            <span className="text-xl font-black text-cyan-400 font-mono mt-0.5 block">
              {services.length}
            </span>
            <span className="text-[11px] text-emerald-400">{services.filter(s => !s.disabled).length} Online Active</span>
          </div>
        </div>

        {/* Live sync toast banner */}
        {liveToast && (
          <div className="mt-4 p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-200 text-xs font-bold flex items-center space-x-2.5 animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{liveToast}</span>
          </div>
        )}
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex bg-[#0B101E] p-1.5 rounded-2xl border border-slate-800 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-emerald-500 text-black shadow-md font-black'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          <span>Orders Management ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('services')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'services'
              ? 'bg-emerald-500 text-black shadow-md font-black'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Services & Rates ({services.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('finances')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'finances'
              ? 'bg-emerald-500 text-black shadow-md font-black'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Finances & Wallet Ledger</span>
        </button>

        <button
          onClick={() => setActiveTab('broadcast')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'broadcast'
              ? 'bg-emerald-500 text-black shadow-md font-black'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Megaphone className="w-4 h-4" />
          <span>Notice Banner</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-emerald-500 text-black shadow-md font-black'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Storefront & Payment Settings</span>
        </button>

        <button
          onClick={() => setActiveTab('access')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'access'
              ? 'bg-emerald-500 text-black shadow-md font-black'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Admin Security</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: ORDERS MANAGEMENT                                 */}
      {/* ======================================================== */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="rounded-2xl bg-[#0B101E] border border-slate-800 p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search Order ID, link, M-Pesa ref..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="w-full bg-[#121A2A] border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto scrollbar-none">
              {['all', 'Pending', 'In Progress', 'Delivering', 'Completed', 'Canceled'].map((st) => (
                <button
                  key={st}
                  onClick={() => setOrderStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    orderStatusFilter === st
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {st.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Orders Table */}
          <div className="rounded-3xl bg-[#0B101E] border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#121A2A] text-slate-400 uppercase font-black tracking-wider text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Order ID & Date</th>
                    <th className="py-3 px-4">Service & Platform</th>
                    <th className="py-3 px-4">Target Link</th>
                    <th className="py-3 px-4">Quantity / Progress</th>
                    <th className="py-3 px-4">Charge</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        No orders matching current filter.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3.5 px-4 font-mono">
                          <span className="font-bold text-white block">{ord.id}</span>
                          <span className="text-[10px] text-slate-500 block">{ord.createdAt}</span>
                          {ord.mpesaRef && (
                            <span className="text-[10px] text-emerald-400 block font-mono">
                              M-Pesa: {ord.mpesaRef}
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 max-w-[200px]">
                          <span className="font-bold text-slate-200 block truncate">{ord.serviceName}</span>
                          <span className="text-[10px] text-slate-400 uppercase font-mono">{ord.platform}</span>
                        </td>

                        <td className="py-3.5 px-4 max-w-[180px]">
                          <a
                            href={ord.link.startsWith('http') ? ord.link : `https://${ord.link}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-400 hover:underline truncate block font-mono text-[11px]"
                          >
                            {ord.link}
                          </a>
                        </td>

                        <td className="py-3.5 px-4 font-mono">
                          <span className="font-bold text-white block">
                            {ord.currentCount} / {ord.targetCount}
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            Qty: {ord.quantity.toLocaleString()}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                          {formatCurrency(ord.charge, currency)}
                        </td>

                        <td className="py-3.5 px-4">
                          <select
                            value={ord.status}
                            onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value as OrderStatus)}
                            className="bg-[#121A2A] border border-slate-700 text-slate-200 text-xs rounded-lg px-2 py-1 focus:outline-none focus:border-emerald-500 font-medium"
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Delivering">Delivering</option>
                            <option value="Completed">Completed</option>
                            <option value="Canceled">Canceled</option>
                          </select>
                        </td>

                        <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                          {/* Boost Button */}
                          <button
                            onClick={() => onBoostOrder(ord.id, Math.round(ord.quantity * 0.25))}
                            className="px-2 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold cursor-pointer"
                            title="Boost count by +25%"
                          >
                            +25% Boost
                          </button>

                          {/* Refund Button */}
                          {ord.status !== 'Canceled' && (
                            <button
                              onClick={() => onRefundOrder(ord.id, ord.charge, 'Admin one-click refund')}
                              className="px-2 py-1 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/40 text-[11px] font-bold cursor-pointer"
                              title="Refund charge to client wallet"
                            >
                              Refund
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: SERVICES & RATES CONFIGURATOR                     */}
      {/* ======================================================== */}
      {activeTab === 'services' && (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-[#0B101E] border border-slate-800 p-4 rounded-2xl">
            <div className="flex items-center space-x-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search service name, ID..."
                  value={serviceSearch}
                  onChange={(e) => setServiceSearch(e.target.value)}
                  className="w-full bg-[#121A2A] border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500"
                />
              </div>

              <select
                value={servicePlatformFilter}
                onChange={(e) => setServicePlatformFilter(e.target.value)}
                className="bg-[#121A2A] border border-slate-700 text-xs text-slate-200 rounded-xl px-3 py-2"
              >
                <option value="all">All Platforms</option>
                {Object.keys(PLATFORMS_CONFIG).map((p) => (
                  <option key={p} value={p}>{PLATFORMS_CONFIG[p as PlatformId]?.name}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setIsAddServiceOpen(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black text-xs font-black flex items-center space-x-1.5 shadow-md shadow-emerald-950/40 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom Service</span>
            </button>
          </div>

          {/* Add Service Modal */}
          {isAddServiceOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
              <div className="bg-[#0D131F] border border-slate-700 rounded-3xl p-6 max-w-lg w-full space-y-4">
                <h3 className="text-lg font-black text-white">Create New Catalog Service</h3>
                <form onSubmit={handleCreateService} className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Service Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. TikTok High Retention Kenyan Views"
                      value={newSvcName}
                      onChange={(e) => setNewSvcName(e.target.value)}
                      className="w-full bg-[#121A2A] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Platform</label>
                      <select
                        value={newSvcPlatform}
                        onChange={(e) => setNewSvcPlatform(e.target.value as PlatformId)}
                        className="w-full bg-[#121A2A] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                      >
                        {Object.keys(PLATFORMS_CONFIG).map((p) => (
                          <option key={p} value={p}>{PLATFORMS_CONFIG[p as PlatformId]?.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Rate / 1000 (KES)</label>
                      <input
                        type="number"
                        required
                        value={newSvcRate}
                        onChange={(e) => setNewSvcRate(Number(e.target.value))}
                        className="w-full bg-[#121A2A] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Min Quantity</label>
                      <input
                        type="number"
                        value={newSvcMin}
                        onChange={(e) => setNewSvcMin(Number(e.target.value))}
                        className="w-full bg-[#121A2A] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Max Quantity</label>
                      <input
                        type="number"
                        value={newSvcMax}
                        onChange={(e) => setNewSvcMax(Number(e.target.value))}
                        className="w-full bg-[#121A2A] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Description / Notes</label>
                    <textarea
                      rows={2}
                      value={newSvcDescription}
                      onChange={(e) => setNewSvcDescription(e.target.value)}
                      placeholder="High quality automated service with lifetime guarantee..."
                      className="w-full bg-[#121A2A] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div className="flex items-center justify-end space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddServiceOpen(false)}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-emerald-500 text-black text-xs font-black"
                    >
                      Create Service
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Services List */}
          <div className="rounded-3xl bg-[#0B101E] border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#121A2A] text-slate-400 uppercase font-black tracking-wider text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">ID</th>
                    <th className="py-3 px-4">Service Details</th>
                    <th className="py-3 px-4">Platform</th>
                    <th className="py-3 px-4">Min - Max</th>
                    <th className="py-3 px-4">Rate per 1,000 (KES)</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredServices.map((svc) => (
                    <tr key={svc.id} className={`hover:bg-slate-800/30 transition-colors ${svc.disabled ? 'opacity-50' : ''}`}>
                      <td className="py-3 px-4 font-mono text-slate-400">{svc.id}</td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-white block">{svc.name}</span>
                        <span className="text-[10px] text-slate-500 block">{svc.speed}</span>
                      </td>
                      <td className="py-3 px-4 font-mono uppercase text-emerald-400 text-[11px] font-bold">
                        {svc.category}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-300">
                        {svc.minQuantity.toLocaleString()} - {svc.maxQuantity.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-mono">
                        {editingRateId === svc.id ? (
                          <div className="flex items-center space-x-1.5">
                            <input
                              type="number"
                              value={editRateValue}
                              onChange={(e) => setEditRateValue(Number(e.target.value))}
                              className="w-20 bg-slate-900 border border-emerald-500 rounded px-2 py-1 text-xs text-emerald-400 font-bold"
                            />
                            <button
                              onClick={() => handleSaveRate(svc.id)}
                              className="p-1 rounded bg-emerald-500 text-black hover:bg-emerald-400 cursor-pointer"
                            >
                              <Save className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-white font-mono">{svc.ratePer1000} KES</span>
                            <button
                              onClick={() => {
                                setEditingRateId(svc.id);
                                setEditRateValue(svc.ratePer1000);
                              }}
                              className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                              title="Edit rate"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          svc.disabled ? 'bg-rose-950/60 text-rose-300 border border-rose-500/40' : 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40'
                        }`}>
                          {svc.disabled ? 'Disabled' : 'Active'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => setEditingService(svc)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-bold cursor-pointer transition-colors"
                          title="Edit full service specifications"
                        >
                          <Sliders className="w-3 h-3 inline mr-1" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => onToggleServiceStatus(svc.id, !svc.disabled)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
                            svc.disabled 
                              ? 'bg-emerald-600 hover:bg-emerald-500 text-white' 
                              : 'bg-slate-800 hover:bg-rose-950/60 text-slate-300 hover:text-rose-300'
                          }`}
                        >
                          {svc.disabled ? 'Enable' : 'Disable'}
                        </button>

                        {svc.id.startsWith('ADMIN-') && (
                          <button
                            onClick={() => handleDeleteServiceClick(svc.id, svc.name)}
                            className="p-1 rounded-lg bg-rose-950/50 hover:bg-rose-900/80 text-rose-300 border border-rose-500/30 text-[11px] font-bold cursor-pointer inline-flex items-center"
                            title="Delete custom service"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: FINANCES & WALLET MANUAL ADJUSTMENT               */}
      {/* ======================================================== */}
      {activeTab === 'finances' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Manual Wallet Tool Card */}
          <div className="lg:col-span-1 rounded-3xl bg-[#0B101E] border border-slate-800 p-6 shadow-xl space-y-4">
            <div className="flex items-center space-x-2.5">
              <Wallet className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-black text-white">Manual Client Wallet Adjustment</h3>
            </div>
            <p className="text-xs text-slate-300">
              Directly credit or debit the central client wallet balance for manual M-Pesa reconciliations, bonuses, or compensations.
            </p>

            {adjFeedback && (
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs">
                {adjFeedback}
              </div>
            )}

            <form onSubmit={handleExecuteWalletAdj} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Adjustment Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjType('credit')}
                    className={`py-2 rounded-xl text-xs font-bold cursor-pointer ${
                      adjType === 'credit' ? 'bg-emerald-500 text-black font-black' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    + Credit Funds
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjType('debit')}
                    className={`py-2 rounded-xl text-xs font-bold cursor-pointer ${
                      adjType === 'debit' ? 'bg-rose-600 text-white font-black' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    - Debit Funds
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Amount (KES)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 500"
                  value={adjAmount}
                  onChange={(e) => setAdjAmount(e.target.value)}
                  className="w-full bg-[#121A2A] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Audit Reason / Note</label>
                <input
                  type="text"
                  required
                  value={adjReason}
                  onChange={(e) => setAdjReason(e.target.value)}
                  className="w-full bg-[#121A2A] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black text-xs font-black shadow-lg cursor-pointer transition-all active:scale-95"
              >
                Apply Wallet Adjustment
              </button>
            </form>
          </div>

          {/* Transaction Ledger Table */}
          <div className="lg:col-span-2 rounded-3xl bg-[#0B101E] border border-slate-800 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-white">Full System Financial Ledger</h3>
              <span className="text-xs text-slate-400 font-mono">{transactions.length} records</span>
            </div>

            <div className="divide-y divide-slate-800 max-h-[480px] overflow-y-auto">
              {transactions.map((t) => {
                const isDeposit = t.type === 'deposit';
                const isRefund = t.type === 'refund';
                const isBonus = t.type === 'bonus';
                return (
                  <div key={t.id} className="py-3 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isDeposit || isBonus ? 'bg-emerald-500/20 text-emerald-400' : isRefund ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {isDeposit || isBonus ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                      </div>
                      <div>
                        <span className="font-bold text-white block capitalize">{t.type}: {t.method}</span>
                        <span className="text-[10px] text-slate-500 font-mono">Ref: {t.reference} &bull; {t.timestamp}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`font-mono font-black ${isDeposit || isRefund || isBonus ? 'text-emerald-400' : 'text-slate-200'}`}>
                        {isDeposit || isRefund || isBonus ? '+' : '-'}{formatCurrency(t.amount, currency)}
                      </span>
                      <span className="block text-[10px] text-slate-400">{t.status}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: STOREFRONT NOTICE BROADCAST                       */}
      {/* ======================================================== */}
      {activeTab === 'broadcast' && (
        <div className="rounded-3xl bg-[#0B101E] border border-slate-800 p-6 sm:p-8 shadow-xl max-w-2xl space-y-4">
          <div className="flex items-center space-x-2.5">
            <Megaphone className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base sm:text-lg font-black text-white">
              Storefront Announcement Banner
            </h3>
          </div>
          <p className="text-xs text-slate-300">
            This notice appears at the top of the storefront for every customer. Use it to announce M-Pesa promotions, holiday bonuses, or service updates.
          </p>

          {noticeSavedFeedback && (
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Broadcast notice saved and published live!</span>
            </div>
          )}

          <div className="space-y-3">
            <textarea
              rows={3}
              value={noticeDraft}
              onChange={(e) => setNoticeDraft(e.target.value)}
              placeholder="e.g. ⚡ Safaricom Lipa Na M-Pesa Buy Goods Till 1856074 is active. Pay and paste whole SMS for instant wallet credit..."
              className="w-full bg-[#121A2A] border border-slate-700 rounded-xl p-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />

            <div className="flex flex-wrap gap-2 pt-1">
              <span className="text-[11px] text-slate-400 font-bold block w-full">Quick Preset Templates:</span>
              <button
                type="button"
                onClick={() => setNoticeDraft('⚡ Safaricom M-Pesa Buy Goods Till 1856074 is active! Pay to Till 1856074 and paste whole SMS message for instant wallet credit.')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] cursor-pointer"
              >
                ⚡ Till 1856074 & Instant Credit
              </button>
              <button
                type="button"
                onClick={() => setNoticeDraft('🎉 Double Auto-Refill Promo Active: All TikTok, Instagram & YouTube orders include 60-day replacement guarantee!')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] cursor-pointer"
              >
                🎉 60-Day Refill Guarantee
              </button>
              <button
                type="button"
                onClick={() => setNoticeDraft(`🔥 Flash Special: Make payment to ${settPhone || '0793749604'} or Till ${settPaybill || '522522'} for instant 15% wallet credit!`)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] cursor-pointer"
              >
                🔥 Flash M-Pesa Promo
              </button>
              <button
                type="button"
                onClick={() => setNoticeDraft('🛠️ Scheduled Maintenance: M-Pesa automated routing active. 24/7 WhatsApp customer desk online.')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] cursor-pointer"
              >
                🛠️ Maintenance Notice
              </button>
            </div>

            {/* Live Storefront Preview */}
            <div className="pt-2">
              <span className="text-[11px] text-slate-400 font-bold block mb-1">
                Live Storefront Customer Preview:
              </span>
              <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-emerald-950/80 border border-emerald-500/40 rounded-2xl px-4 py-2.5 text-xs flex items-center justify-between text-slate-200 shadow-md">
                <div className="flex items-center space-x-2">
                  <span className="flex h-2 w-2 relative flex-shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="font-bold text-emerald-400 uppercase tracking-wider text-[10px]">Notice:</span>
                  <span className="font-medium text-slate-200 text-xs">{noticeDraft || '(Notice hidden / empty)'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <button
                onClick={handleSaveBroadcast}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black flex items-center space-x-1.5 cursor-pointer shadow-md shadow-emerald-950/40 transition-all active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>Publish Announcement Live</span>
              </button>
              <button
                onClick={() => {
                  setNoticeDraft('');
                  onUpdateBroadcastNotice('');
                  showToast('Storefront notice cleared.');
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
              >
                Clear / Hide Notice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 5: STOREFRONT & PAYMENT SETTINGS                     */}
      {/* ======================================================== */}
      {activeTab === 'settings' && (
        <div className="rounded-3xl bg-[#0B101E] border border-slate-800 p-6 sm:p-8 shadow-xl max-w-3xl space-y-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white">
                Main Web Storefront & Payment Settings
              </h3>
              <p className="text-xs text-slate-300">
                Any changes made here sync directly to Cloud Firestore and instantly update the Deposit Modal, Quick Order Form, Support Desk, and Footer across the entire site.
              </p>
            </div>
          </div>

          {settingsSavedFeedback && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-200 text-xs flex items-center space-x-2 font-bold animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>✓ All credentials & settings saved to Cloud Firestore and reflected live across the main web!</span>
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-200 block mb-1.5 flex items-center space-x-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Safaricom Lipa Na M-Pesa Buy Goods Till Number</span>
                </label>
                <input
                  type="text"
                  required
                  value={settTill}
                  onChange={(e) => {
                    setSettTill(e.target.value);
                    setSettPaybill(e.target.value);
                  }}
                  placeholder="e.g. 1856074"
                  className="w-full bg-[#121A2A] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-emerald-300 font-mono font-bold focus:outline-none focus:border-emerald-500"
                />
                <span className="text-[10px] text-slate-400 block mt-1">
                  Official Buy Goods Till displayed to customers for deposits & SMS verification.
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-200 block mb-1.5 flex items-center space-x-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Operations / Helpline Phone Number</span>
                </label>
                <input
                  type="text"
                  required
                  value={settPhone}
                  onChange={(e) => setSettPhone(e.target.value)}
                  placeholder="e.g. 0793749604"
                  className="w-full bg-[#121A2A] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono font-bold focus:outline-none focus:border-emerald-500"
                />
                <span className="text-[10px] text-slate-400 block mt-1">
                  Admin operations line and support contact number.
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-200 block mb-1.5 flex items-center space-x-1.5">
                  <Mail className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Official Support Email</span>
                </label>
                <input
                  type="email"
                  required
                  value={settEmail}
                  onChange={(e) => setSettEmail(e.target.value)}
                  placeholder="e.g. kentechlikeS@gmail.com"
                  className="w-full bg-[#121A2A] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                />
                <span className="text-[10px] text-slate-400 block mt-1">
                  Shown in Support Desk and Footer across the site.
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-200 block mb-1.5 flex items-center space-x-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Helpline / WhatsApp Number</span>
                </label>
                <input
                  type="text"
                  required
                  value={settHelp}
                  onChange={(e) => setSettHelp(e.target.value)}
                  placeholder="e.g. +254 793 749 604"
                  className="w-full bg-[#121A2A] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                />
                <span className="text-[10px] text-slate-400 block mt-1">
                  Connected to the WhatsApp floating support widget.
                </span>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-200 block mb-1.5 flex items-center space-x-1.5">
                <Percent className="w-3.5 h-3.5 text-amber-400" />
                <span>Promotional Deposit Bonus (%)</span>
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="number"
                  min={0}
                  max={100}
                  required
                  value={settBonus}
                  onChange={(e) => setSettBonus(Number(e.target.value))}
                  className="w-32 bg-[#121A2A] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-amber-400 font-mono font-bold focus:outline-none focus:border-amber-500"
                />
                <span className="text-xs text-slate-300 font-medium">
                  % extra wallet credit automatically added on customer deposits.
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black text-xs sm:text-sm font-black shadow-lg shadow-emerald-950/40 cursor-pointer flex items-center space-x-2 transition-all active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>Save & Push Changes Live to Main Web</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 5: ADMIN SECURITY & PRIVILEGES                      */}
      {/* ======================================================== */}
      {activeTab === 'access' && (
        <div className="rounded-3xl bg-[#0B101E] border border-slate-800 p-6 sm:p-8 shadow-xl max-w-2xl space-y-4">
          <div className="flex items-center space-x-2.5">
            <Lock className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base sm:text-lg font-black text-white">
              Administrator Security & Role Status
            </h3>
          </div>

          <div className="space-y-3 pt-2">
            <div className="p-4 rounded-2xl bg-[#121A2A] border border-slate-700/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Primary Administrator UID</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Active
                </span>
              </div>
              <p className="text-xs font-mono text-emerald-400 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 break-all">
                {DESIGNATED_ADMIN_UID}
              </p>
              <p className="text-[11px] text-slate-400">
                This UID is locked in Firestore Security Rules (`firestore.rules`) with full administrative permissions to modify orders, service catalogs, and system records.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#121A2A] border border-slate-700/80 space-y-1.5">
              <span className="text-xs font-bold text-white block">Official Support Contact</span>
              <p className="text-xs text-slate-300 font-mono">
                Email: <span className="text-emerald-400">kentechlikeS@gmail.com</span>
              </p>
              <p className="text-xs text-slate-300 font-mono">
                Helpline: <span className="text-emerald-400">+254 793 749 604</span>
              </p>
            </div>

            {/* Platform Policy & Prohibited Terms Status */}
            <div className="p-4 rounded-2xl bg-[#121A2A] border border-slate-700/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Active Reserved & Prohibited Terms</span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Enforced
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                System automatically scans all checkout target links and blocks registrations attempting to impersonate administration.
              </p>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Reserved Usernames</span>
                  <span className="font-mono font-bold text-amber-400">{RESERVED_USERNAMES.length} Protected Names</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Prohibited Link Keywords</span>
                  <span className="font-mono font-bold text-rose-400">{PROHIBITED_KEYWORDS.length} Blocked Terms</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Service Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0D131F] border border-slate-700 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base sm:text-lg font-black text-white flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                <span>Edit Service Specifications</span>
              </h3>
              <button
                onClick={() => setEditingService(null)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedService} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Service Title</label>
                <input
                  type="text"
                  required
                  value={editingService.name}
                  onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                  className="w-full bg-[#121A2A] border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Platform Category</label>
                  <select
                    value={editingService.category}
                    onChange={(e) => setEditingService({ 
                      ...editingService, 
                      category: e.target.value as PlatformId,
                      categoryName: PLATFORMS_CONFIG[e.target.value as PlatformId]?.name || 'Social'
                    })}
                    className="w-full bg-[#121A2A] border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    {Object.keys(PLATFORMS_CONFIG).map((p) => (
                      <option key={p} value={p}>{PLATFORMS_CONFIG[p as PlatformId]?.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Rate / 1000 (KES)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={editingService.ratePer1000}
                    onChange={(e) => setEditingService({ ...editingService, ratePer1000: Number(e.target.value) })}
                    className="w-full bg-[#121A2A] border border-slate-700 rounded-xl px-3 py-2 text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Min Quantity</label>
                  <input
                    type="number"
                    required
                    value={editingService.minQuantity}
                    onChange={(e) => setEditingService({ ...editingService, minQuantity: Number(e.target.value) })}
                    className="w-full bg-[#121A2A] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Max Quantity</label>
                  <input
                    type="number"
                    required
                    value={editingService.maxQuantity}
                    onChange={(e) => setEditingService({ ...editingService, maxQuantity: Number(e.target.value) })}
                    className="w-full bg-[#121A2A] border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Speed Indicator</label>
                  <input
                    type="text"
                    value={editingService.speed}
                    onChange={(e) => setEditingService({ ...editingService, speed: e.target.value })}
                    placeholder="e.g. Instant (0-15m)"
                    className="w-full bg-[#121A2A] border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Promo Badge</label>
                  <select
                    value={editingService.badge || 'VIP'}
                    onChange={(e) => setEditingService({ ...editingService, badge: e.target.value as any })}
                    className="w-full bg-[#121A2A] border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="HOT">HOT</option>
                    <option value="BESTSELLER">BESTSELLER</option>
                    <option value="CHEAPEST">CHEAPEST</option>
                    <option value="INSTANT">INSTANT</option>
                    <option value="VIP">VIP</option>
                    <option value="POPULAR">POPULAR</option>
                    <option value="FAST">FAST</option>
                    <option value="PRO">PRO</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Description / Guarantee Notes</label>
                <textarea
                  rows={2}
                  value={editingService.description}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  className="w-full bg-[#121A2A] border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black text-xs font-black shadow-md cursor-pointer"
                >
                  Save & Sync to Main Web
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
