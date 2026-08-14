import React, { useState } from 'react';
import {
  Inbox,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Send,
  Trash2,
  Edit3,
  ExternalLink,
  DollarSign,
  AlertCircle,
  Plus,
  Copy,
  Check,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Columns3,
  ListFilter,
  RotateCcw
} from 'lucide-react';
import { useSiteData } from '../../../context/SiteDataContext';
import { OrderItem, OrderStatus } from '../../../types';

export const OrdersManager: React.FC = () => {
  const {
    orders,
    advanceOrderStatus,
    updateOrderStatus,
    updateOrderDetails,
    deleteOrder,
    addOrder,
    services,
    newOrdersCount,
    inProgressOrdersCount,
    completedOrdersCount
  } = useSiteData();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeWorkflowTab, setActiveWorkflowTab] = useState<'all' | 'new' | 'in_progress' | 'completed'>('all');
  const [viewLayout, setViewLayout] = useState<'pipeline' | 'list'>('pipeline');
  const [editingOrder, setEditingOrder] = useState<OrderItem | null>(null);
  const [adminNoteInput, setAdminNoteInput] = useState('');
  const [priceInput, setPriceInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isCreatingManual, setIsCreatingManual] = useState(false);

  // Manual order form
  const [manualForm, setManualForm] = useState({
    fullName: '',
    telegramOrPhone: '',
    serviceId: services[0]?.id || 'ai-website',
    message: '',
  });

  const handleCopyContact = (id: string, contact: string) => {
    navigator.clipboard.writeText(contact);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getTelegramUrl = (contact: string) => {
    const clean = contact.trim().replace(/^@/, '');
    return `https://t.me/${clean}`;
  };

  const handleStartEdit = (order: OrderItem) => {
    setEditingOrder(order);
    setAdminNoteInput(order.adminNotes || '');
    setPriceInput(order.priceQuoted || '');
  };

  const handleSaveEdit = () => {
    if (editingOrder) {
      updateOrderDetails(editingOrder.id, {
        adminNotes: adminNoteInput,
        priceQuoted: priceInput,
      });
      setEditingOrder(null);
    }
  };

  const handleCreateManualOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualForm.fullName || !manualForm.telegramOrPhone) return;
    addOrder(manualForm);
    setIsCreatingManual(false);
    setManualForm({
      fullName: '',
      telegramOrPhone: '',
      serviceId: services[0]?.id || 'ai-website',
      message: '',
    });
  };

  const filterOrderList = (orderList: OrderItem[]) => {
    const q = (searchQuery || '').toLowerCase().trim();
    if (!q) return orderList;
    return orderList.filter((ord) => {
      const fullName = (ord.fullName || '').toLowerCase();
      const contact = (ord.telegramOrPhone || '').toLowerCase();
      const serviceTitle = (ord.serviceTitle || '').toLowerCase();
      const message = (ord.message || '').toLowerCase();
      return fullName.includes(q) || contact.includes(q) || serviceTitle.includes(q) || message.includes(q);
    });
  };

  const newOrders = filterOrderList(orders.filter((o) => o.status === 'new' || (o.status as any) === 'pending' || (o.status as any) === 'contacted'));
  const inProgressOrders = filterOrderList(orders.filter((o) => o.status === 'in_progress'));
  const completedOrders = filterOrderList(orders.filter((o) => o.status === 'completed'));

  const renderOrderCard = (ord: OrderItem, showColumnActions = true) => {
    const contactStr = ord.telegramOrPhone || '';
    const isTelegram = contactStr.startsWith('@');
    const isNew = ord.status === 'new' || (ord.status as any) === 'pending' || (ord.status as any) === 'contacted';
    const isInProgress = ord.status === 'in_progress';
    const isCompleted = ord.status === 'completed';

    return (
      <div
        key={ord.id}
        className="rounded-2xl bg-[#09090b] border border-zinc-800 p-4 sm:p-5 shadow-md space-y-3.5 hover:border-zinc-700 transition-all flex flex-col justify-between group"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-zinc-800/80">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs font-mono shrink-0 ${
                isNew
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                  : isInProgress
                  ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                  : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
              }`}
            >
              {ord.id.slice(-3)}
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-sm text-white truncate">{ord.fullName}</h4>
              <span className="text-[11px] text-zinc-400 block truncate">
                سرویس: <span className="text-purple-300 font-medium">{ord.serviceTitle}</span>
              </span>
            </div>
          </div>

          <span className="text-[10px] text-zinc-500 font-mono shrink-0">
            {new Date(ord.createdAt).toLocaleDateString('fa-IR', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>

        {/* Message */}
        {ord.message && (
          <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/60 text-xs text-zinc-300 leading-relaxed max-h-24 overflow-y-auto">
            <span className="text-zinc-500 font-semibold block text-[10px] mb-0.5">نیازمندی کاربر:</span>
            {ord.message}
          </div>
        )}

        {/* Admin Notes & Quoted Price */}
        {(ord.adminNotes || ord.priceQuoted) && (
          <div className="p-2.5 rounded-xl bg-purple-950/20 border border-purple-900/30 text-xs space-y-1">
            {ord.priceQuoted && (
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-purple-300">قیمت توافق‌شده:</span>
                <span className="text-white font-mono font-bold">{ord.priceQuoted}</span>
              </div>
            )}
            {ord.adminNotes && (
              <div className="text-[11px]">
                <span className="text-purple-300">یادداشت: </span>
                <span className="text-zinc-300">{ord.adminNotes}</span>
              </div>
            )}
          </div>
        )}

        {/* Contact info & Action row */}
        <div className="pt-2 border-t border-zinc-800/80 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="font-mono text-xs font-bold text-zinc-200 bg-zinc-900 px-2 py-1 rounded-lg border border-zinc-800 truncate">
                {ord.telegramOrPhone}
              </span>

              <button
                type="button"
                onClick={() => handleCopyContact(ord.id, ord.telegramOrPhone)}
                className="p-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                title="کپی شماره/آیدی"
              >
                {copiedId === ord.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {isTelegram && (
              <a
                href={getTelegramUrl(ord.telegramOrPhone)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 text-[11px] font-semibold border border-purple-500/30 transition-colors"
              >
                <Send className="w-3 h-3 rotate-180" />
                <span>تلگرام</span>
              </a>
            )}
          </div>

          {/* Workflow Action Buttons (Step 1 -> Step 2 -> Step 3) */}
          {showColumnActions && (
            <div className="pt-1 flex items-center justify-between gap-2">
              {/* Step 1 to Step 2 */}
              {isNew && (
                <button
                  type="button"
                  onClick={() => advanceOrderStatus(ord.id)}
                  className="flex-1 py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-600/20 transition-all flex items-center justify-center gap-1.5"
                >
                  <span>انتقال به درحال ساخت</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Step 2 to Step 3 */}
              {isInProgress && (
                <div className="flex items-center gap-1.5 w-full">
                  <button
                    type="button"
                    onClick={() => updateOrderStatus(ord.id, 'new')}
                    className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 transition-colors"
                    title="بازگشت به جدید"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => advanceOrderStatus(ord.id)}
                    className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>تکمیل و تحویل نهایی</span>
                  </button>
                </div>
              )}

              {/* Step 3 (Completed) */}
              {isCompleted && (
                <div className="flex items-center justify-between w-full">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>تکمیل و تحویل شد</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => updateOrderStatus(ord.id, 'in_progress')}
                    className="text-[11px] text-zinc-400 hover:text-purple-300 font-semibold underline underline-offset-4"
                  >
                    بازگشت به ساخت
                  </button>
                </div>
              )}

              {/* Utility edit / delete buttons */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => handleStartEdit(ord)}
                  className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 transition-colors"
                  title="یادداشت و قیمت"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`آیا از حذف سفارش ${ord.fullName} اطمینان دارید؟`)) {
                      deleteOrder(ord.id);
                    }
                  }}
                  className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                  title="حذف"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              مدیریت سفارشات (گردش ۳ مرحله‌ای)
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-950 border border-purple-500/30 text-purple-300 text-xs font-semibold">
              ۳-Step Workflow
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            سفارشات جدید وارد ستون اول می‌شوند، پس از تایید به مرحله «درحال ساخت» و سپس با یک کلیک به «تکمیل شده» منتقل می‌شوند.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsCreatingManual(true)}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>ثبت سفارش دستی</span>
          </button>
        </div>
      </div>

      {/* Workflow 3-Step Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {/* Step 1: New */}
        <div
          onClick={() => {
            setActiveWorkflowTab('new');
            setViewLayout('list');
          }}
          className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
            activeWorkflowTab === 'new' && viewLayout === 'list'
              ? 'bg-amber-950/30 border-amber-500/50 shadow-md'
              : 'bg-[#09090b] border-zinc-800 hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
              ۱
            </div>
            <div>
              <span className="text-xs font-bold text-zinc-300 block">گام اول: سفارشات جدید</span>
              <span className="text-[11px] text-zinc-500">استعلام‌های ورودی سایت</span>
            </div>
          </div>
          <span className="text-2xl font-extrabold font-mono text-amber-400">
            {newOrdersCount}
          </span>
        </div>

        {/* Step 2: In Progress */}
        <div
          onClick={() => {
            setActiveWorkflowTab('in_progress');
            setViewLayout('list');
          }}
          className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
            activeWorkflowTab === 'in_progress' && viewLayout === 'list'
              ? 'bg-purple-950/30 border-purple-500/50 shadow-md'
              : 'bg-[#09090b] border-zinc-800 hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold">
              ۲
            </div>
            <div>
              <span className="text-xs font-bold text-zinc-300 block">گام دوم: درحال ساخت و در انتظار</span>
              <span className="text-[11px] text-zinc-500">پروژه‌های فعال در حال انجام</span>
            </div>
          </div>
          <span className="text-2xl font-extrabold font-mono text-purple-400">
            {inProgressOrdersCount}
          </span>
        </div>

        {/* Step 3: Completed */}
        <div
          onClick={() => {
            setActiveWorkflowTab('completed');
            setViewLayout('list');
          }}
          className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
            activeWorkflowTab === 'completed' && viewLayout === 'list'
              ? 'bg-emerald-950/30 border-emerald-500/50 shadow-md'
              : 'bg-[#09090b] border-zinc-800 hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
              ۳
            </div>
            <div>
              <span className="text-xs font-bold text-zinc-300 block">گام سوم: سفارشات تکمیل شده</span>
              <span className="text-[11px] text-zinc-500">تحویل داده شده به مشتری</span>
            </div>
          </div>
          <span className="text-2xl font-extrabold font-mono text-emerald-400">
            {completedOrdersCount}
          </span>
        </div>
      </div>

      {/* Toolbar: Search, Filters, View Modes */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-[#09090b] p-3.5 rounded-2xl border border-zinc-800">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-zinc-400 absolute start-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجو در نام، تلگرام، خدمت درخواستی..."
            className="w-full ps-9 pe-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* View Layout Toggle & Tabs */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
          
          {/* Pipeline vs List Switch */}
          <div className="flex items-center p-1 rounded-xl bg-zinc-900 border border-zinc-800">
            <button
              type="button"
              onClick={() => setViewLayout('pipeline')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewLayout === 'pipeline'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Columns3 className="w-3.5 h-3.5" />
              <span>نمای کانبان (۳ ستون)</span>
            </button>

            <button
              type="button"
              onClick={() => setViewLayout('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewLayout === 'list'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>نمای تب‌بندی شده</span>
            </button>
          </div>

        </div>

      </div>

      {/* MAIN VIEW AREA */}
      {viewLayout === 'pipeline' ? (
        /* KANBAN 3-COLUMN WORKFLOW VIEW */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          
          {/* COLUMN 1: NEW ORDERS */}
          <div className="rounded-2xl bg-zinc-950/60 border border-amber-900/30 p-4 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                <h3 className="font-extrabold text-sm text-white">۱. سفارشات جدید</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 text-xs font-mono font-bold border border-amber-500/20">
                {newOrders.length}
              </span>
            </div>

            <div className="space-y-3 min-h-[300px]">
              {newOrders.length === 0 ? (
                <div className="p-8 text-center rounded-xl bg-zinc-900/40 border border-zinc-800/60 text-zinc-500 text-xs">
                  هیچ سفارش جدیدی در انتظار نیست.
                </div>
              ) : (
                newOrders.map((ord) => renderOrderCard(ord, true))
              )}
            </div>
          </div>

          {/* COLUMN 2: IN PROGRESS ORDERS */}
          <div className="rounded-2xl bg-zinc-950/60 border border-purple-900/30 p-4 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                <h3 className="font-extrabold text-sm text-white">۲. درحال ساخت و در انتظار</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 text-xs font-mono font-bold border border-purple-500/20">
                {inProgressOrders.length}
              </span>
            </div>

            <div className="space-y-3 min-h-[300px]">
              {inProgressOrders.length === 0 ? (
                <div className="p-8 text-center rounded-xl bg-zinc-900/40 border border-zinc-800/60 text-zinc-500 text-xs">
                  هیچ سفارشی در مرحله ساخت نیست.
                </div>
              ) : (
                inProgressOrders.map((ord) => renderOrderCard(ord, true))
              )}
            </div>
          </div>

          {/* COLUMN 3: COMPLETED ORDERS */}
          <div className="rounded-2xl bg-zinc-950/60 border border-emerald-900/30 p-4 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <h3 className="font-extrabold text-sm text-white">۳. سفارشات تکمیل شده</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/20">
                {completedOrders.length}
              </span>
            </div>

            <div className="space-y-3 min-h-[300px]">
              {completedOrders.length === 0 ? (
                <div className="p-8 text-center rounded-xl bg-zinc-900/40 border border-zinc-800/60 text-zinc-500 text-xs">
                  هنوز سفارشی به عنوان تکمیل شده ثبت نشده است.
                </div>
              ) : (
                completedOrders.map((ord) => renderOrderCard(ord, true))
              )}
            </div>
          </div>

        </div>
      ) : (
        /* TABBED FOCUSED VIEW */
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
            <button
              type="button"
              onClick={() => setActiveWorkflowTab('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeWorkflowTab === 'all'
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              همه ({orders.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveWorkflowTab('new')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeWorkflowTab === 'new'
                  ? 'bg-amber-600 text-white'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              ۱. سفارشات جدید ({newOrders.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveWorkflowTab('in_progress')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeWorkflowTab === 'in_progress'
                  ? 'bg-purple-600 text-white'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              ۲. درحال ساخت ({inProgressOrders.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveWorkflowTab('completed')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeWorkflowTab === 'completed'
                  ? 'bg-emerald-600 text-white'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              ۳. تکمیل شده ({completedOrders.length})
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(activeWorkflowTab === 'all'
              ? filterOrderList(orders)
              : activeWorkflowTab === 'new'
              ? newOrders
              : activeWorkflowTab === 'in_progress'
              ? inProgressOrders
              : completedOrders
            ).map((ord) => renderOrderCard(ord, true))}
          </div>
        </div>
      )}

      {/* Edit Notes / Quoted Price Modal */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-[#09090b] border border-zinc-800 p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-purple-400" />
              <span>ویرایش یادداشت و قیمت ({editingOrder.fullName})</span>
            </h3>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                مبلغ توافق‌شده / پیش‌فاکتور (اختیاری)
              </label>
              <input
                type="text"
                value={priceInput}
                onChange={(e) => setPriceInput(e.target.value)}
                placeholder="مثال: ۴,۵۰۰,۰۰۰ تومان"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                یادداشت داخلی ادمین
              </label>
              <textarea
                rows={3}
                value={adminNoteInput}
                onChange={(e) => setAdminNoteInput(e.target.value)}
                placeholder="یادداشت‌های هماهنگی، وضعیت پروژه و..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white focus:border-purple-500 focus:outline-none resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setEditingOrder(null)}
                className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold border border-zinc-800 transition-colors"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md"
              >
                ذخیره تغییرات
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Order Creation Modal */}
      {isCreatingManual && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl bg-[#09090b] border border-zinc-800 p-6 sm:p-7 space-y-4 shadow-2xl">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-purple-400" />
              <span>ثبت سفارش دستی / لید تلگرامی</span>
            </h2>

            <form onSubmit={handleCreateManualOrder} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  نام مشتری <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={manualForm.fullName}
                  onChange={(e) => setManualForm({ ...manualForm, fullName: e.target.value })}
                  placeholder="مثال: علی رضایی"
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  آیدی تلگرام یا شماره تماس <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={manualForm.telegramOrPhone}
                  onChange={(e) => setManualForm({ ...manualForm, telegramOrPhone: e.target.value })}
                  placeholder="مثال: @client_username یا 09123456789"
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  سرویس مورد نظر
                </label>
                <select
                  value={manualForm.serviceId}
                  onChange={(e) => setManualForm({ ...manualForm, serviceId: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white focus:border-purple-500 focus:outline-none cursor-pointer"
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  توضیحات و توافق اولیه
                </label>
                <textarea
                  rows={3}
                  value={manualForm.message}
                  onChange={(e) => setManualForm({ ...manualForm, message: e.target.value })}
                  placeholder="خلاصه نیازمندی یا توضیحات سفارش..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white focus:border-purple-500 focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsCreatingManual(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold border border-zinc-800"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md"
                >
                  ثبت سفارش در گام اول
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
