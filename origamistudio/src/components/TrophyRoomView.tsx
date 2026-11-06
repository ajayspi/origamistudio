import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useOrigamiStore } from '../store/useOrigamiStore';
import { ALL_KITS_ARRAY, getKitById } from '../data/kits';
import { OrigamiFigure } from './OrigamiFigure';
import {
  Trophy, Star, Package, Sparkles, Flame,
  Search, ArrowRight, CheckCircle2,
  Clock, ShieldCheck, Tv
} from 'lucide-react';

export const TrophyRoomView: React.FC = () => {
  const {
    completedKitIds,
    magicSheetsBalance,
    activityLedger,
    dailyStreak,
    setView,
    orderPhysicalKit,
  } = useOrigamiStore();

  const [activeTab, setActiveTab] = useState<'all' | 'physical' | 'digital'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [orderModalKitId, setOrderModalKitId] = useState<string | null>(null);

  // Map completed kit IDs to full kit objects
  const completedKits = useMemo(() => {
    const list = completedKitIds
      .map((id) => getKitById(id))
      .filter((k): k is NonNullable<typeof k> => Boolean(k));

    // If somehow empty, provide default starter showcase so the room is never empty
    if (list.length === 0) {
      return ALL_KITS_ARRAY.slice(0, 4);
    }
    return list;
  }, [completedKitIds]);

  // Filter activity ledger
  const filteredLedger = useMemo(() => {
    return activityLedger.filter((item) => {
      const matchesTab =
        activeTab === 'all'
          ? true
          : activeTab === 'physical'
          ? item.shippingStatus !== 'Digital'
          : item.shippingStatus === 'Digital';

      const matchesSearch =
        searchQuery.trim() === ''
          ? true
          : item.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.kitTitle && item.kitTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (item.trackingNumber && item.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
            item.shippingStatus.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesTab && matchesSearch;
    });
  }, [activityLedger, activeTab, searchQuery]);

  const physicalOrdersCount = useMemo(() => {
    return activityLedger.filter((item) => item.shippingStatus !== 'Digital').length;
  }, [activityLedger]);

  const handleSimulateAdWatch = () => {
    useOrigamiStore.setState((state) => {
      const bonus = 25;
      const newBal = state.magicSheetsBalance + bonus;
      try {
        localStorage.setItem('origami_magic_sheets_balance', String(newBal));
      } catch {}
      const newLedgerItem = {
        id: `act-${Date.now()}`,
        date: new Date().toISOString().slice(0, 10),
        action: 'Watched 30s STEM Geometry Lesson Ad 📺',
        magicSheetsChange: bonus,
        balanceAfter: newBal,
        shippingStatus: 'Digital' as const,
      };
      const updated = [newLedgerItem, ...state.activityLedger];
      try {
        localStorage.setItem('origami_economy_ledger', JSON.stringify(updated));
      } catch {}
      return { magicSheetsBalance: newBal, activityLedger: updated };
    });
  };

  const handleOrderConfirm = (kitId: string) => {
    const targetKit = getKitById(kitId);
    orderPhysicalKit(kitId, targetKit ? targetKit.title : 'Physical Origami Kit');
    setOrderModalKitId(null);
  };

  return (
    <div className="min-h-screen bg-[#fcfbf7] dark:bg-[#090b12] text-stone-900 dark:text-stone-100 transition-colors duration-200 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* PAGE HERO HEADER */}
        <div className="relative rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-cyan-500/10 dark:from-amber-950/30 dark:via-stone-900/60 dark:to-cyan-950/20 border-2 border-amber-500/30 shadow-xl overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-800 dark:text-amber-300 font-mono text-xs font-bold tracking-widest uppercase">
                <Trophy className="w-3.5 h-3.5" />
                <span>Hall of Origami Masters</span>
              </div>
              <h1 id="trophy-room-title" className="font-cinzel text-3xl sm:text-5xl font-black tracking-tight text-stone-950 dark:text-white">
                The Trophy Room & Economy
              </h1>
              <p className="text-sm sm:text-base font-serif text-stone-600 dark:text-stone-300">
                Celebrate your completed 3D kinetic sculptures, manage your Magic Sheets wallet, and track pre-creased physical kit deliveries right to your door.
              </p>
            </div>

            {/* MAGIC SHEETS WALLET & STREAK BANNER */}
            <div className="shrink-0 w-full md:w-auto p-4 sm:p-5 rounded-2xl bg-white/90 dark:bg-[#11131e]/90 backdrop-blur-xl border border-stone-200 dark:border-white/10 shadow-lg flex flex-col sm:flex-row md:flex-col gap-4">
              <div className="flex items-center justify-between gap-6">
                <div>
                  <div className="text-[11px] font-mono text-stone-500 uppercase font-bold tracking-wider">
                    Magic Sheets Balance
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span id="magic-sheets-balance-value" className="text-2xl sm:text-3xl font-black font-mono text-amber-600 dark:text-amber-400">
                      {magicSheetsBalance}
                    </span>
                    <span className="text-lg">📄</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[11px] font-mono text-stone-500 uppercase font-bold tracking-wider">
                    Daily Streak
                  </div>
                  <div className="flex items-center gap-1.5 justify-end mt-0.5 text-orange-600 dark:text-orange-400 font-bold font-mono text-lg sm:text-xl">
                    <Flame className="w-5 h-5 fill-orange-500 text-orange-500 animate-pulse" />
                    <span>{Math.max(1, dailyStreak)} Days</span>
                  </div>
                </div>
              </div>

              {/* Quick Earn Action */}
              <button
                onClick={handleSimulateAdWatch}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono text-xs font-bold shadow-md shadow-cyan-500/20 cursor-pointer active:scale-[0.98] transition-all"
                title="Watch 30s STEM Video for +25 Magic Sheets"
              >
                <Tv className="w-3.5 h-3.5" />
                <span>Earn +25 Sheets (Watch STEM Ad)</span>
              </button>
            </div>
          </div>
        </div>

        {/* SECTION A: THE GRID (Completed Origami Kits) */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 dark:border-stone-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                <h2 className="font-cinzel text-xl sm:text-2xl font-black tracking-tight text-stone-900 dark:text-stone-100">
                  Section A: Mastered Kinetic Sculptures ({completedKits.length})
                </h2>
              </div>
              <p className="text-xs sm:text-sm font-serif text-stone-500 dark:text-stone-400 mt-0.5">
                Each sculpture was folded accurately from a single uncut square sheet of paper. Click any card to inspect in the 3D Studio.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 font-mono text-xs font-bold border border-emerald-500/30">
                ⭐⭐⭐ 100% Geometry Accuracy
              </span>
            </div>
          </div>

          {/* Grid Layout of Glowing Thumbnails */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {completedKits.map((kit) => (
              <motion.div
                key={kit.id}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className="group relative rounded-3xl p-5 bg-white/95 dark:bg-[#0f121d]/90 backdrop-blur-md border-2 border-amber-500/40 dark:border-amber-400/30 shadow-[0_8px_30px_rgba(245,158,11,0.12)] flex flex-col justify-between overflow-hidden"
              >
                {/* Glowing Corner Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/25">
                    KIT #{String(kit.kitNumber || '01').padStart(2, '0')}
                  </span>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3].map((s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    ))}
                  </div>
                </div>

                {/* 3D Model Showcase Area (1:1 Ratio Box) */}
                <div className="relative w-full aspect-square rounded-2xl my-3 flex items-center justify-center p-3 bg-gradient-to-b from-stone-50 to-amber-50/40 dark:from-stone-900/40 dark:to-stone-900/20 border border-stone-200/60 dark:border-white/5 group-hover:border-amber-400/50 transition-colors overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center drop-shadow-lg group-hover:scale-108 transition-transform duration-300">
                    <OrigamiFigure kit={kit} size={152} />
                  </div>
                  {/* Subtle Crease Shimmer Line */}
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500/40 to-transparent overflow-hidden pointer-events-none">
                    <div className="w-1/2 h-full bg-amber-400 dark:bg-cyan-400 blur-[0.5px] animate-[slide_3s_ease-in-out_infinite]" />
                  </div>
                </div>

                {/* Kit Metadata */}
                <div className="space-y-1 mb-4">
                  <div className="text-[10px] font-mono text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                    {kit.collectionTitle || kit.collection}
                  </div>
                  <h3 className="font-cinzel text-base font-bold text-stone-950 dark:text-white line-clamp-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {kit.title}
                  </h3>
                  <p className="text-xs font-serif text-stone-600 dark:text-stone-300 line-clamp-2 leading-relaxed">
                    {kit.goal || kit.description || 'Masterwork kinetic paper fold.'}
                  </p>
                </div>

                {/* Card Action Buttons */}
                <div className="space-y-2 pt-2 border-t border-stone-100 dark:border-stone-800">
                  <button
                    onClick={() => setView('studio', kit.id)}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-white text-white dark:text-stone-950 font-mono text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-[0.98]"
                  >
                    <span>Inspect 3D</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setOrderModalKitId(kit.id)}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-800 dark:text-amber-300 border border-amber-500/30 font-mono text-[11px] font-extrabold transition-all cursor-pointer"
                  >
                    <Package className="w-3.5 h-3.5" />
                    <span>Order Physical Kit (₹299)</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* SECTION B: THE ECONOMY & ORDER TABLES */}
        <section className="space-y-6 pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <h2 className="font-cinzel text-xl sm:text-2xl font-black tracking-tight text-stone-900 dark:text-stone-100">
                  Section B: Economy Activity & Physical Orders
                </h2>
              </div>
              <p className="text-xs sm:text-sm font-serif text-stone-500 dark:text-stone-400 mt-0.5">
                Transparent parent dashboard tracking Magic Sheets currency and physical paper deliveries via Shiprocket.
              </p>
            </div>

            {/* Filter Tabs & Search */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center p-1 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs font-mono">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    activeTab === 'all'
                      ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-xs'
                      : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
                  }`}
                >
                  All ({activityLedger.length})
                </button>
                <button
                  onClick={() => setActiveTab('physical')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    activeTab === 'physical'
                      ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-xs'
                      : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
                  }`}
                >
                  Physical Orders ({physicalOrdersCount})
                </button>
                <button
                  onClick={() => setActiveTab('digital')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    activeTab === 'digital'
                      ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-xs'
                      : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
                  }`}
                >
                  Digital Activity
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Filter activity..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs font-mono text-stone-900 dark:text-stone-100 focus:outline-none focus:border-amber-500 w-44"
                />
              </div>
            </div>
          </div>

          {/* Clean Modern Data Table */}
          <div className="rounded-3xl border-2 border-stone-200 dark:border-stone-800 bg-white/95 dark:bg-[#0c0e17]/90 backdrop-blur-md shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-stone-200 dark:border-stone-800 bg-stone-50/75 dark:bg-stone-900/50 text-[11px] font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400">
                    <th className="py-3.5 px-4 sm:px-6 font-bold">Date</th>
                    <th className="py-3.5 px-4 sm:px-6 font-bold">Action</th>
                    <th className="py-3.5 px-4 sm:px-6 font-bold">Magic Sheets Balance</th>
                    <th className="py-3.5 px-4 sm:px-6 font-bold">Real-World Shipping Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60 font-mono text-xs">
                  {filteredLedger.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-stone-400 font-mono">
                        No transactions found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredLedger.map((row) => {
                      const isPositive = row.magicSheetsChange > 0;
                      return (
                        <tr
                          key={row.id}
                          className="hover:bg-amber-50/30 dark:hover:bg-amber-950/10 transition-colors"
                        >
                          {/* Column 1: Date */}
                          <td className="py-3.5 px-4 sm:px-6 text-stone-500 dark:text-stone-400 whitespace-nowrap">
                            {row.date}
                          </td>

                          {/* Column 2: Action */}
                          <td className="py-3.5 px-4 sm:px-6 font-medium text-stone-900 dark:text-stone-100">
                            <div className="flex items-center gap-2">
                              <span>{row.action}</span>
                            </div>
                            {row.trackingNumber && (
                              <div className="text-[10px] text-amber-700 dark:text-amber-400 font-bold mt-0.5 flex items-center gap-1">
                                <span>Shiprocket ID:</span>
                                <span className="underline">{row.trackingNumber}</span>
                              </div>
                            )}
                          </td>

                          {/* Column 3: Magic Sheets Balance */}
                          <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span
                                className={`font-bold px-2 py-0.5 rounded-md ${
                                  isPositive
                                    ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                                    : 'bg-orange-500/15 text-orange-700 dark:text-orange-300'
                                }`}
                              >
                                {isPositive ? `+${row.magicSheetsChange}` : row.magicSheetsChange} 📄
                              </span>
                              <span className="text-[11px] text-stone-400">
                                ({row.balanceAfter} balance)
                              </span>
                            </div>
                          </td>

                          {/* Column 4: Real-World Shipping Status with Visual Badges */}
                          <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap">
                            {row.shippingStatus === 'Delivered' ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Delivered</span>
                              </span>
                            ) : row.shippingStatus === 'Shipped via Shiprocket' ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30">
                                <Package className="w-3.5 h-3.5 text-amber-600" />
                                <span>Shipped via Shiprocket</span>
                              </span>
                            ) : row.shippingStatus === 'Processing' ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-yellow-500/15 text-yellow-800 dark:text-yellow-300 border border-yellow-500/30 animate-pulse">
                                <Clock className="w-3.5 h-3.5 text-yellow-600" />
                                <span>Processing</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
                                <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
                                <span>Instant Digital Unlock</span>
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer info */}
            <div className="py-3 px-6 bg-stone-50/50 dark:bg-stone-900/30 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-stone-500 gap-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>All physical deliveries authenticated & dispatched through Shiprocket logistics partner.</span>
              </div>
              <div className="font-semibold text-stone-600 dark:text-stone-400">
                Total Orders: {physicalOrdersCount} • Balance: {magicSheetsBalance} 📄
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* QUICK ORDER CONFIRMATION MODAL */}
      {orderModalKitId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="bg-[#fcfbf7] dark:bg-[#111422] border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-stone-900 dark:text-stone-100 font-mono space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
                <Package className="w-4 h-4" />
                <span>Confirm Physical Delivery</span>
              </div>
              <button
                onClick={() => setOrderModalKitId(null)}
                className="text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div>
              <h3 className="font-cinzel text-xl font-black text-stone-950 dark:text-white">
                {getKitById(orderModalKitId)?.title || 'Origami Master Kit'}
              </h3>
              <p className="text-xs font-serif text-stone-600 dark:text-stone-300 mt-1">
                Order a physical craft box containing pre-creased Japanese washi paper sheets and step-by-step full-color illustrated booklet.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-1">
              <div className="flex justify-between">
                <span>Kit Price:</span>
                <span className="font-bold text-stone-900 dark:text-stone-100">₹299</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span className="font-bold text-emerald-600">FREE via Shiprocket</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Arrival:</span>
                <span className="font-bold text-stone-900 dark:text-stone-100">2-3 Days</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setOrderModalKitId(null)}
                className="flex-1 py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold text-xs cursor-pointer hover:bg-stone-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleOrderConfirm(orderModalKitId)}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-black text-xs cursor-pointer hover:from-amber-400 hover:to-orange-400 shadow-md"
              >
                Place Order (₹299)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrophyRoomView;
