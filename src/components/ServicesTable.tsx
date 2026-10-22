import React, { useState } from 'react';
import { 
  Search, 
  RotateCcw, 
  Clock, 
  Sparkles, 
  ChevronRight, 
  ChevronDown,
  Layers,
  Table as TableIcon,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Zap,
  Info
} from 'lucide-react';
import { Currency, PlatformId, ServiceItem } from '../types';
import { SERVICES_CATALOG, PLATFORMS_CONFIG, formatCurrency } from '../data/servicesData';
import { SocialBrandIcon } from './SocialBrandIcons';

interface ServicesTableProps {
  currency: Currency;
  onSelectServiceToOrder: (serviceId: string) => void;
  services?: ServiceItem[];
}

export const ServicesTable: React.FC<ServicesTableProps> = ({
  currency,
  onSelectServiceToOrder,
  services,
}) => {
  const catalog = (services || SERVICES_CATALOG).filter(s => !s.disabled);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grouped' | 'table'>('grouped');
  const [sortBy, setSortBy] = useState<'id' | 'priceAsc' | 'priceDesc' | 'name'>('priceAsc');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    tiktok: true,
    instagram: true,
    youtube: true,
    facebook: true,
    telegram: true,
    whatsapp: true,
    twitter: true,
    spotify: true,
    soundcloud: true,
    google: true,
    traffic: true,
    linkedin: true,
  });

  const platforms = Object.keys(PLATFORMS_CONFIG) as PlatformId[];

  const toggleCategory = (cat: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [cat]: !prev[cat]
    }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    platforms.forEach(p => all[p] = true);
    setExpandedCategories(all);
  };

  const collapseAll = () => {
    const none: Record<string, boolean> = {};
    platforms.forEach(p => none[p] = false);
    setExpandedCategories(none);
  };

  // Filtered services
  const filteredServices = catalog.filter((item) => {
    const matchesCategory = selectedFilter === 'all' || item.category === selectedFilter;
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.subCategory && item.subCategory.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'priceAsc') return a.ratePer1000 - b.ratePer1000;
    if (sortBy === 'priceDesc') return b.ratePer1000 - a.ratePer1000;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return a.id.localeCompare(b.id);
  });

  // Group services by category for Arranged View
  const groupedServices: Record<string, ServiceItem[]> = {};
  platforms.forEach((p) => {
    const svcs = filteredServices.filter((s) => s.category === p);
    if (svcs.length > 0) {
      groupedServices[p] = svcs;
    }
  });

  return (
    <div className="space-y-6">
      
      {/* Top Filter & Arrangement Header */}
      <div className="rounded-2xl bg-[#0F172A]/95 border border-slate-700 p-5 sm:p-7 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
              <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight">
                Services & Live Rates
              </h2>
              <span className="text-xs font-mono font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-3 py-1 rounded-full shadow-sm">
                {catalog.length} Verified Packages
              </span>
            </div>
            <p className="text-sm font-medium text-slate-300 mt-1.5">
              Arranged by official platform with authentic logos, verified rates, and 24/7 automated M-Pesa fulfillment.
            </p>
          </div>

          {/* Controls: Search & View Mode */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* View Mode Switcher */}
            <div className="flex items-center bg-[#090D16] border border-slate-700 rounded-xl p-1 text-xs">
              <button
                onClick={() => setViewMode('grouped')}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg font-bold transition-colors cursor-pointer ${
                  viewMode === 'grouped'
                    ? 'bg-emerald-500 text-black shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span className="font-bold">Arranged by Category</span>
              </button>

              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg font-bold transition-colors cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-emerald-500 text-black shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <TableIcon className="w-4 h-4" />
                <span className="font-bold">Single Table</span>
              </button>
            </div>

            {/* Search Box */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search package, ID, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#090D16] border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 font-semibold"
              />
            </div>

          </div>
        </div>

        {/* Category Jump Pills with REAL OFFICIAL BRAND ICONS */}
        <div className="flex items-center space-x-2 overflow-x-auto pt-5 pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-colors cursor-pointer shadow-sm ${
              selectedFilter === 'all'
                ? 'bg-emerald-500 text-black font-black'
                : 'bg-slate-900 hover:bg-slate-800 text-white border border-slate-700'
            }`}
          >
            All Categories ({catalog.length})
          </button>

          {platforms.map((pid) => {
            const conf = PLATFORMS_CONFIG[pid];
            const count = catalog.filter((s) => s.category === pid).length;
            const isSelected = selectedFilter === pid;
            return (
              <button
                key={pid}
                onClick={() => setSelectedFilter(pid)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-colors flex items-center space-x-2 cursor-pointer shadow-sm ${
                  isSelected
                    ? 'bg-emerald-500 text-black font-black border border-emerald-300'
                    : 'bg-slate-900 hover:bg-slate-800 text-white border border-slate-700'
                }`}
              >
                <SocialBrandIcon platform={pid} size={18} />
                <span>{conf.tag}</span>
                <span className={`text-[11px] px-1.5 py-0.2 rounded font-bold ${isSelected ? 'bg-black/20 text-black' : 'bg-slate-800 text-emerald-400 border border-slate-700'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODE 1: ARRANGED BY CATEGORY (Same as dukalalikes.com) */}
      {/* ======================================================== */}
      {viewMode === 'grouped' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-300 px-1">
            <span>Showing services grouped by official platform categories:</span>
            <div className="flex items-center space-x-3">
              <button onClick={expandAll} className="hover:text-emerald-400 underline font-bold">Expand All</button>
              <span>&bull;</span>
              <button onClick={collapseAll} className="hover:text-emerald-400 underline font-bold">Collapse All</button>
            </div>
          </div>

          {Object.keys(groupedServices).length === 0 ? (
            <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-12 text-center text-slate-300 font-semibold">
              No services match your search query. Try searching for "TikTok", "Followers", "Views", or "M-Pesa".
            </div>
          ) : (
            Object.entries(groupedServices).map(([catId, svcs]) => {
              const conf = PLATFORMS_CONFIG[catId as PlatformId] || {
                name: catId,
                tag: catId,
                color: '#10B981',
                bg: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30'
              };
              const isExpanded = expandedCategories[catId] !== false;

              return (
                <div 
                  key={catId}
                  className="rounded-2xl bg-[#0F172A]/95 border border-slate-700 overflow-hidden shadow-xl backdrop-blur-xl transition-all"
                >
                  {/* Category Header Banner with REAL BRAND ICON */}
                  <div 
                    onClick={() => toggleCategory(catId)}
                    className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-slate-900 to-[#0B1224] border-b border-slate-700/80 flex items-center justify-between cursor-pointer hover:bg-slate-800/60 transition-colors"
                  >
                    <div className="flex items-center space-x-3.5">
                      <SocialBrandIcon platform={catId} size={30} withBg />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-base sm:text-xl font-black text-white">
                            {conf.tag}
                          </h3>
                          <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                            {svcs.length} Packages
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-300 font-medium mt-0.5">
                          Instant automated server queue &bull; 0% passwords needed &bull; Lipa Na M-Pesa 24/7
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <ChevronDown className={`w-5 h-5 text-emerald-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                  </div>

                  {/* Category Services Table */}
                  {isExpanded && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-700/80 bg-slate-900/60 text-xs font-bold uppercase tracking-wider text-slate-300">
                            <th className="py-3 px-4 w-20">ID</th>
                            <th className="py-3 px-4">Service Package</th>
                            <th className="py-3 px-4 w-36 text-right">Price / 1,000</th>
                            <th className="py-3 px-4 w-32 text-center">Min / Max</th>
                            <th className="py-3 px-4 w-40 text-center">Speed & Guarantee</th>
                            <th className="py-3 px-4 w-28 text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 text-xs sm:text-sm text-slate-200">
                          {svcs.map((service) => (
                            <tr 
                              key={service.id}
                              className="hover:bg-slate-800/60 transition-colors group"
                            >
                              {/* ID */}
                              <td className="py-3.5 px-4 font-mono font-bold text-slate-300">
                                <span className="px-2 py-1 rounded bg-slate-800 text-xs text-emerald-400 border border-slate-700 font-bold">
                                  {service.id}
                                </span>
                              </td>

                              {/* Service Name & Details */}
                              <td className="py-3.5 px-4">
                                <div className="space-y-1">
                                  <div className="flex items-center space-x-2 flex-wrap gap-1">
                                    <span className="font-bold text-white group-hover:text-emerald-300 transition-colors text-sm sm:text-base">
                                      {service.name}
                                    </span>
                                    {service.subCategory && (
                                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/15 text-blue-300 border border-blue-500/30">
                                        {service.subCategory}
                                      </span>
                                    )}
                                    {service.badge && (
                                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                                        {service.badge}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-slate-300 font-medium leading-relaxed max-w-2xl">
                                    {service.description}
                                  </p>
                                </div>
                              </td>

                              {/* Rate per 1000 or Package Price */}
                              <td className="py-3.5 px-4 text-right">
                                <span className="font-mono font-black text-emerald-400 text-base sm:text-lg">
                                  {service.packagePrice ? formatCurrency(service.packagePrice, currency) : formatCurrency(service.ratePer1000, currency)}
                                </span>
                                <span className="block text-xs text-slate-300 font-mono font-medium">
                                  {service.packagePrice
                                    ? `Package (${service.fixedQuantity?.toLocaleString()} units)`
                                    : (service.category === 'facebook' || service.category === 'tiktok' || service.category === 'instagram' || service.category === 'youtube' || service.category === 'telegram')
                                      ? `${formatCurrency(Math.round(service.ratePer1000 / 10), currency)} / 100 units`
                                      : '/ 1,000 units'}
                                </span>
                              </td>

                              {/* Min / Max */}
                              <td className="py-3.5 px-4 text-center font-mono text-xs font-semibold">
                                <span className="text-white">{service.minQuantity.toLocaleString()}</span>
                                <span className="text-slate-500"> / </span>
                                <span className="text-white">{service.maxQuantity.toLocaleString()}</span>
                              </td>

                              {/* Speed & Refill */}
                              <td className="py-3.5 px-4 text-center">
                                <div className="flex flex-col items-center space-y-1 text-xs">
                                  <span className="flex items-center space-x-1.5 text-slate-200 font-semibold">
                                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                                    <span>{service.speed}</span>
                                  </span>
                                  <span className="flex items-center space-x-1 text-emerald-400 font-bold">
                                    <RotateCcw className="w-3.5 h-3.5" />
                                    <span>{service.refill}</span>
                                  </span>
                                </div>
                              </td>

                              {/* Action Button */}
                              <td className="py-3.5 px-4 text-center">
                                <button
                                  onClick={() => onSelectServiceToOrder(service.id)}
                                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black transition-all shadow-md active:scale-95 cursor-pointer"
                                >
                                  Order
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* MODE 2: UNIFIED TABLE VIEW */}
      {/* ======================================================== */}
      {viewMode === 'table' && (
        <div className="rounded-2xl bg-[#0F172A]/95 border border-slate-700 shadow-xl overflow-hidden backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-900/90 text-xs font-bold uppercase tracking-wider text-slate-300">
                  <th className="py-3.5 px-4 w-20">ID</th>
                  <th className="py-3.5 px-4 w-36">Platform</th>
                  <th className="py-3.5 px-4">Service Details</th>
                  <th className="py-3.5 px-4 w-36 text-right">Rate / 1K</th>
                  <th className="py-3.5 px-4 w-32 text-center">Min / Max</th>
                  <th className="py-3.5 px-4 w-40 text-center">Speed & Guarantee</th>
                  <th className="py-3.5 px-4 w-28 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-xs sm:text-sm text-slate-200">
                {filteredServices.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400 font-semibold">
                      No services found matching your query.
                    </td>
                  </tr>
                ) : (
                  filteredServices.map((service) => {
                    const platConf = PLATFORMS_CONFIG[service.category];
                    return (
                      <tr 
                        key={service.id}
                        className="hover:bg-slate-800/60 transition-colors group"
                      >
                        {/* ID */}
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-300">
                          <span className="px-2 py-1 rounded bg-slate-800 text-xs text-emerald-400 border border-slate-700 font-bold">
                            {service.id}
                          </span>
                        </td>

                        {/* Platform with Real Brand Icon */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center space-x-2 bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700">
                            <SocialBrandIcon platform={service.category} size={18} />
                            <span className="text-xs font-bold text-white">
                              {platConf.name}
                            </span>
                          </div>
                        </td>

                        {/* Name & Badge */}
                        <td className="py-3.5 px-4">
                          <div className="flex flex-col space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-white group-hover:text-emerald-300 transition-colors text-sm sm:text-base">
                                {service.name}
                              </span>
                              {service.badge && (
                                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                                  {service.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-300 font-medium leading-relaxed max-w-2xl">
                              {service.description}
                            </p>
                          </div>
                        </td>

                        {/* Rate or Package */}
                        <td className="py-3.5 px-4 text-right">
                          <span className="font-mono font-black text-emerald-400 text-base sm:text-lg">
                            {service.packagePrice ? formatCurrency(service.packagePrice, currency) : formatCurrency(service.ratePer1000, currency)}
                          </span>
                          <span className="block text-xs text-slate-300 font-mono font-medium">
                            {service.packagePrice
                              ? `Package (${service.fixedQuantity?.toLocaleString()} units)`
                              : (service.category === 'facebook' || service.category === 'tiktok' || service.category === 'instagram' || service.category === 'youtube' || service.category === 'telegram')
                                ? `${formatCurrency(Math.round(service.ratePer1000 / 10), currency)} / 100 units`
                                : '/ 1,000 units'}
                          </span>
                        </td>

                        {/* Min / Max */}
                        <td className="py-3.5 px-4 text-center font-mono text-xs font-semibold">
                          <span className="text-white">{service.minQuantity.toLocaleString()}</span>
                          <span className="text-slate-500"> / </span>
                          <span className="text-white">{service.maxQuantity.toLocaleString()}</span>
                        </td>

                        {/* Speed & Refill */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex flex-col items-center space-y-1 text-xs">
                            <span className="flex items-center space-x-1.5 text-slate-200 font-semibold">
                              <Clock className="w-3.5 h-3.5 text-emerald-400" />
                              <span>{service.speed}</span>
                            </span>
                            <span className="flex items-center space-x-1 text-emerald-400 font-bold">
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>{service.refill}</span>
                            </span>
                          </div>
                        </td>

                        {/* Action */}
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => onSelectServiceToOrder(service.id)}
                            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black transition-all shadow-md active:scale-95 cursor-pointer"
                          >
                            Order
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

