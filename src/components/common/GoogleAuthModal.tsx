import React, { useState, useEffect, useRef } from 'react';
import {
  User,
  LogOut,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Inbox,
  Sparkles,
  Edit3,
  Phone,
  Send,
  Save,
  Check,
  Copy,
  Clock,
  Zap,
  Activity,
  Plus,
  ArrowRight,
  UserCheck,
  AtSign
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSiteData } from '../../context/SiteDataContext';
import { AICloseButton } from './AICloseButton';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenOrderModal?: () => void;
  onOpenOrderTracking?: (orderId?: string) => void;
}

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
];

// Live Particle Star Canvas Component for Cosmic Cyber Atmosphere
const AmbientCyberCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 700);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    const particleCount = Math.min(32, Math.floor((width * height) / 13000));
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.8 + 0.6,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35 - 0.1,
      alpha: Math.random() * 0.6 + 0.2,
      color: Math.random() > 0.6 ? '#a855f7' : Math.random() > 0.3 ? '#06b6d4' : '#ec4899',
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-50"
    />
  );
};

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({
  isOpen,
  onClose,
  onOpenOrderModal,
  onOpenOrderTracking,
}) => {
  const { currentUser, loginWithGoogle, updateUserProfile, logoutUser, orders, brandInfo } = useSiteData();
  const [activeTab, setActiveTab] = useState<'orders' | 'edit'>('orders');
  const [orderFilter, setOrderFilter] = useState<'all' | 'in_progress' | 'completed'>('all');
  
  // Real User Registration Form states (no prefilled admin credentials)
  const [userEmailInput, setUserEmailInput] = useState('');
  const [userNameInput, setUserNameInput] = useState('');
  const [userPhoneInput, setUserPhoneInput] = useState('');
  const [userTelegramInput, setUserTelegramInput] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_PRESETS[0]);
  
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

  // Edit Profile Form state for logged in user
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editTelegram, setEditTelegram] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setEditName(currentUser.name || '');
      setEditEmail(currentUser.email || '');
      setEditPhone(currentUser.phone || '');
      setEditTelegram(currentUser.telegram || '');
      setEditBio(currentUser.bio || '');
      setEditAvatar(currentUser.avatar || AVATAR_PRESETS[0]);
    }
  }, [currentUser]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const handleCopyCode = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedOrderId(id);
    showToast(`کد پیگیری ${id} کپی شد!`);
    setTimeout(() => setCopiedOrderId(null), 2000);
  };

  // Real Email Registration / Login Handler
  const handleRealEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = userEmailInput.trim().toLowerCase();
    
    if (!cleanEmail) {
      showToast('لطفاً آدرس ایمیل خود را وارد کنید.');
      return;
    }

    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      showToast('لطفاً یک آدرس ایمیل معتبر وارد فرمایید.');
      return;
    }

    setIsSigningIn(true);
    setTimeout(() => {
      const derivedName = userNameInput.trim() || cleanEmail.split('@')[0].replace(/[._]/g, ' ');
      const cleanTelegram = userTelegramInput.trim()
        ? userTelegramInput.startsWith('@')
          ? userTelegramInput.trim()
          : `@${userTelegramInput.trim()}`
        : '';

      const newUser = loginWithGoogle({
        name: derivedName,
        email: cleanEmail,
        avatar: selectedAvatar || AVATAR_PRESETS[0],
        phone: userPhoneInput.trim(),
        telegram: cleanTelegram,
        bio: 'کاربر فعال پلتفرم هوش مصنوعی تکویکس',
      });

      setIsSigningIn(false);
      setUserEmailInput('');
      setUserNameInput('');
      setUserPhoneInput('');
      setUserTelegramInput('');
      showToast(`خوش آمدید ${newUser.name}! حساب کاربری شما با ایمیل ${cleanEmail} فعال شد.`);
    }, 450);
  };

  // Save profile updates
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      updateUserProfile({
        name: editName.trim() || currentUser?.name,
        email: editEmail.trim() || currentUser?.email,
        phone: editPhone.trim(),
        telegram: editTelegram.trim(),
        bio: editBio.trim(),
        avatar: editAvatar || currentUser?.avatar,
      });
      setIsSaving(false);
      setActiveTab('orders');
      showToast('مشخصات حساب شما با موفقیت ذخیره شد!');
    }, 380);
  };

  // Real Matched orders for the authenticated user
  const userOrders = currentUser
    ? orders.filter(
        (o) =>
          (o.userEmail && o.userEmail.toLowerCase() === currentUser.email.toLowerCase()) ||
          (currentUser.email && o.telegramOrPhone && o.telegramOrPhone.toLowerCase().includes(currentUser.email.toLowerCase())) ||
          (currentUser.phone && o.telegramOrPhone && o.telegramOrPhone.includes(currentUser.phone)) ||
          (currentUser.telegram && o.telegramOrPhone && o.telegramOrPhone.toLowerCase().includes(currentUser.telegram.toLowerCase().replace('@', ''))) ||
          (currentUser.name && o.fullName && o.fullName.toLowerCase().includes(currentUser.name.toLowerCase()))
      )
    : [];

  const filteredOrders = userOrders.filter((ord) => {
    if (orderFilter === 'all') return true;
    if (orderFilter === 'in_progress') return ord.status === 'in_progress' || ord.status === 'new';
    if (orderFilter === 'completed') return ord.status === 'completed';
    return true;
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-200"
      dir="rtl"
      onClick={onClose}
    >
      <div
        className="w-full h-full sm:h-auto sm:max-h-[92vh] sm:max-w-2xl bg-[#080518] sm:border sm:border-purple-500/35 sm:rounded-3xl shadow-[0_0_80px_rgba(147,51,234,0.35)] relative text-white flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Live Stardust Canvas Background */}
        <AmbientCyberCanvas />

        {/* Ambient neon gradient glowing orbs */}
        <div className="absolute -top-32 -end-32 w-80 h-80 bg-purple-600/30 rounded-full blur-[100px] pointer-events-none animate-pulse" />
        <div className="absolute -bottom-32 -start-32 w-80 h-80 bg-indigo-600/25 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />

        {/* ================= MODAL HEADER (Sticky) ================= */}
        <header className="shrink-0 px-4 sm:px-6 py-3.5 sm:py-4 bg-[#0a071d]/90 backdrop-blur-xl border-b border-purple-900/40 flex items-center justify-between z-20">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-purple-600/40 border border-purple-400/40">
                <User className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <span className="absolute -top-1 -end-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-[#080518]"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white">
                  {currentUser
                    ? activeTab === 'edit'
                      ? 'ویرایش اطلاعات حساب کاربری'
                      : 'پروفایل و سفارشات کاربری'
                    : 'ورود و ثبت‌نام با ایمیل شخصی'}
                </h2>
                {currentUser && (
                  <span className="px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-400/30 text-[10px] font-bold text-purple-300 hidden sm:inline-flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" />
                    حساب کاربری فعال
                  </span>
                )}
              </div>
              <p className="text-[11px] sm:text-xs text-purple-200/70 flex items-center gap-1.5 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                <span>
                  {currentUser
                    ? 'مشاهده وضعیت سفارشات، ویرایش مشخصات و ارتباط مستقیم'
                    : 'ثبت ایمیل برای پیگیری اختصاصی پروژه‌ها و دانلود فایل‌ها'}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <AICloseButton
              onClick={onClose}
              title="بستن و بازگشت"
              ariaLabel="بستن پنجره"
              variant="cyber"
            />
          </div>
        </header>

        {/* Global Toast Notification */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mx-4 mt-3 p-3 rounded-2xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 text-xs font-bold flex items-center justify-between gap-2 shadow-lg shadow-emerald-950/50 z-30 shrink-0"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{toastMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => setToastMessage(null)}
                className="text-emerald-400 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ================= SCROLLABLE CONTENT BODY ================= */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 relative z-10 custom-scrollbar">
          {currentUser ? (
            /* ================= LOGGED IN USER VIEW ================= */
            <div className="space-y-5">
              {/* Profile Card Hero */}
              <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-[#180f3d] via-[#100b2b] to-[#09061c] border border-purple-500/40 shadow-[0_10px_35px_rgba(0,0,0,0.5)] relative overflow-hidden group">
                <div className="absolute top-0 end-0 w-44 h-44 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                    <div className="relative shrink-0">
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl p-0.5 bg-gradient-to-tr from-purple-500 via-cyan-400 to-indigo-600 shadow-xl shadow-purple-600/30">
                        <img
                          src={currentUser.avatar}
                          alt={currentUser.name}
                          className="w-full h-full rounded-[14px] object-cover"
                        />
                      </div>
                      <span className="absolute -bottom-1 -start-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-[#09061c] flex items-center justify-center text-black font-bold text-xs shadow-md" title="اکانت فعال">
                        ✓
                      </span>
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base sm:text-lg font-black text-white truncate">
                          {currentUser.name}
                        </h3>
                        <span className="px-2 py-0.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          حساب تایید شده
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-purple-200/80 font-mono">
                        <div className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                          <span className="truncate max-w-[200px] sm:max-w-xs">{currentUser.email}</span>
                        </div>
                        {currentUser.telegram && (
                          <div className="flex items-center gap-1 text-cyan-300">
                            <Send className="w-3 h-3 rotate-180 shrink-0" />
                            <span>{currentUser.telegram}</span>
                          </div>
                        )}
                        {currentUser.phone && (
                          <div className="flex items-center gap-1 text-emerald-300">
                            <Phone className="w-3 h-3 shrink-0" />
                            <span>{currentUser.phone}</span>
                          </div>
                        )}
                      </div>

                      {currentUser.bio && (
                        <p className="text-xs text-gray-300/90 pt-0.5 line-clamp-1 italic">
                          "{currentUser.bio}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-purple-900/30">
                    <button
                      type="button"
                      onClick={() => setActiveTab(activeTab === 'edit' ? 'orders' : 'edit')}
                      className="px-3.5 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/30 text-purple-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>{activeTab === 'edit' ? 'مشاهده سفارشات' : 'ویرایش مشخصات'}</span>
                    </button>
                  </div>
                </div>

                {/* Quick User Stats Pill Row */}
                <div className="mt-4 pt-3.5 border-t border-purple-900/40 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="text-[10px] text-gray-400 block mb-0.5">کل سفارشات</span>
                    <span className="font-mono font-bold text-white text-sm">{userOrders.length}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="text-[10px] text-gray-400 block mb-0.5">پروژه‌های فعال</span>
                    <span className="font-mono font-bold text-cyan-300 text-sm">
                      {userOrders.filter((o) => o.status === 'in_progress' || o.status === 'new').length}
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="text-[10px] text-gray-400 block mb-0.5">تحویل شده</span>
                    <span className="font-mono font-bold text-emerald-400 text-sm">
                      {userOrders.filter((o) => o.status === 'completed').length}
                    </span>
                  </div>
                </div>
              </div>

              {/* 2 Focused Navigation Tabs: Orders & Edit Profile */}
              <div className="flex items-center gap-2 p-1 rounded-2xl bg-white/[0.04] border border-white/10">
                <button
                  type="button"
                  onClick={() => setActiveTab('orders')}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    activeTab === 'orders'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Inbox className="w-4 h-4" />
                  <span>سفارشات و پروژه‌های شما</span>
                  <span className="px-2 py-0.5 rounded-full bg-black/40 text-[10px] font-mono">
                    {userOrders.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('edit')}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    activeTab === 'edit'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Edit3 className="w-4 h-4" />
                  <span>ویرایش پروفایل و اطلاعات</span>
                </button>
              </div>

              {/* TAB 1: ORDERS & PROJECTS */}
              {activeTab === 'orders' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setOrderFilter('all')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          orderFilter === 'all'
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-400/40'
                            : 'text-gray-400 hover:text-gray-200'
                        }`}
                      >
                        همه ({userOrders.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setOrderFilter('in_progress')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          orderFilter === 'in_progress'
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-400/40'
                            : 'text-gray-400 hover:text-gray-200'
                        }`}
                      >
                        در حال ساخت ({userOrders.filter((o) => o.status === 'in_progress' || o.status === 'new').length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setOrderFilter('completed')}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          orderFilter === 'completed'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                            : 'text-gray-400 hover:text-gray-200'
                        }`}
                      >
                        تکمیل شده ({userOrders.filter((o) => o.status === 'completed').length})
                      </button>
                    </div>

                    {onOpenOrderModal && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onOpenOrderModal();
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/40 text-purple-200 text-xs font-bold flex items-center gap-1.5 transition-all self-end sm:self-auto cursor-pointer shadow-md"
                      >
                        <Plus className="w-3.5 h-3.5 text-purple-400" />
                        <span>+ ثبت سفارش جدید</span>
                      </button>
                    )}
                  </div>

                  {filteredOrders.length === 0 ? (
                    <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 text-center space-y-4 relative overflow-hidden">
                      <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto text-purple-400">
                        <Inbox className="w-7 h-7" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-white text-sm">هنوز سفارشی با ایمیل ({currentUser.email}) ثبت نکرده‌اید</h4>
                        <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
                          می‌توانید همین الان با هوش مصنوعی تکویکس طراحی وب‌سایت، ربات تلگرام، ساخت ویدیو یا پروژه خود را ثبت کنید.
                        </p>
                      </div>

                      {onOpenOrderModal && (
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onOpenOrderModal();
                          }}
                          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:opacity-95 text-white text-xs font-black transition-all shadow-lg shadow-purple-600/30 inline-flex items-center gap-2 cursor-pointer"
                        >
                          <Zap className="w-4 h-4 text-cyan-300" />
                          <span>ثبت سریع سفارش با هوش مصنوعی</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredOrders.map((ord) => {
                        const isNew = ord.status === 'new';
                        const isInProgress = ord.status === 'in_progress';
                        const isCompleted = ord.status === 'completed';

                        return (
                          <div
                            key={ord.id}
                            className="p-4 rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/10 hover:border-purple-500/40 transition-all space-y-3 group relative overflow-hidden"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-black text-white text-sm sm:text-base">
                                    {ord.serviceTitle}
                                  </span>
                                  {ord.isPromoEvent && (
                                    <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold">
                                      افتتاحیه ویژه
                                    </span>
                                  )}
                                </div>

                                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400 font-mono">
                                  <span className="flex items-center gap-1 text-purple-300 font-bold">
                                    کد: {ord.id}
                                    <button
                                      type="button"
                                      onClick={(e) => handleCopyCode(ord.id, e)}
                                      className="p-1 hover:text-white cursor-pointer"
                                      title="کپی کد رهگیری"
                                    >
                                      {copiedOrderId === ord.id ? (
                                        <Check className="w-3 h-3 text-emerald-400" />
                                      ) : (
                                        <Copy className="w-3 h-3" />
                                      )}
                                    </button>
                                  </span>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {new Date(ord.createdAt).toLocaleDateString('fa-IR')}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 self-start sm:self-auto">
                                <span
                                  className={`px-3 py-1 rounded-full text-[11px] font-black border flex items-center gap-1.5 ${
                                    isNew
                                      ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                                      : isInProgress
                                      ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                                      : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                                  }`}
                                >
                                  <span
                                    className={`w-2 h-2 rounded-full ${
                                      isNew
                                        ? 'bg-amber-400 animate-pulse'
                                        : isInProgress
                                        ? 'bg-purple-400 animate-pulse'
                                        : 'bg-emerald-400'
                                    }`}
                                  />
                                  <span>
                                    {isNew
                                      ? 'گام ۱: ثبت و استعلام'
                                      : isInProgress
                                      ? 'گام ۲: در حال پیاده‌سازی'
                                      : 'گام ۳: تحویل داده شد'}
                                  </span>
                                </span>
                              </div>
                            </div>

                            {/* 3-Step Live Visual Stepper Bar */}
                            <div className="pt-2">
                              <div className="grid grid-cols-3 gap-1.5 text-[10px] font-bold text-center">
                                <div
                                  className={`p-1.5 rounded-lg border transition-all ${
                                    isNew || isInProgress || isCompleted
                                      ? 'bg-purple-950/60 border-purple-500/40 text-purple-200'
                                      : 'bg-white/[0.02] border-white/5 text-gray-500'
                                  }`}
                                >
                                  <span>۱. استعلام و ثبت</span>
                                </div>
                                <div
                                  className={`p-1.5 rounded-lg border transition-all ${
                                    isInProgress || isCompleted
                                      ? 'bg-purple-950/60 border-purple-500/40 text-purple-200'
                                      : 'bg-white/[0.02] border-white/5 text-gray-500'
                                  }`}
                                >
                                  <span>۲. پیاده‌سازی هوش مصنوعی</span>
                                </div>
                                <div
                                  className={`p-1.5 rounded-lg border transition-all ${
                                    isCompleted
                                      ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200 font-black'
                                      : 'bg-white/[0.02] border-white/5 text-gray-500'
                                  }`}
                                >
                                  <span>۳. تحویل و دانلود</span>
                                </div>
                              </div>
                            </div>

                            {/* Order Details & Actions */}
                            <div className="pt-2 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs">
                              <span className="text-gray-300 font-mono">
                                مبلغ: <strong className="text-white">{ord.priceQuoted || 'استعلامی'}</strong>
                              </span>

                              <div className="flex items-center gap-2">
                                {onOpenOrderTracking && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      onClose();
                                      onOpenOrderTracking(ord.id);
                                    }}
                                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold flex items-center gap-1 transition-all cursor-pointer"
                                  >
                                    <Activity className="w-3.5 h-3.5 text-cyan-400" />
                                    <span>پیگیری زنده و دانلود</span>
                                  </button>
                                )}

                                <a
                                  href={`https://t.me/${brandInfo.telegramHandle.replace('@', '')}?text=${encodeURIComponent(`سلام، در مورد سفارش با کد ${ord.id} (${ord.serviceTitle}) سوال داشتم.`)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/30 text-purple-200 font-bold flex items-center gap-1 transition-all"
                                >
                                  <Send className="w-3 h-3 rotate-180" />
                                  <span>پشتیبانی تلگرام</span>
                                </a>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: EDIT PROFILE FORM */}
              {activeTab === 'edit' && (
                <form onSubmit={handleSaveProfile} className="space-y-4 animate-in fade-in">
                  {/* Avatar Selection */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-200">
                      انتخاب آواتار اختصاصی
                    </label>
                    <div className="flex items-center gap-2.5 overflow-x-auto pb-2 custom-scrollbar">
                      {AVATAR_PRESETS.map((avUrl, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setEditAvatar(avUrl)}
                          className={`relative rounded-2xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                            editAvatar === avUrl
                              ? 'border-purple-400 scale-105 shadow-lg shadow-purple-500/40'
                              : 'border-transparent opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img src={avUrl} alt="Avatar" className="w-12 h-12 sm:w-14 sm:h-14 object-cover" />
                          {editAvatar === avUrl && (
                            <div className="absolute inset-0 bg-purple-600/45 flex items-center justify-center">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs text-gray-300 mb-1 font-bold">نام و نام‌خانوادگی</label>
                      <input
                        type="text"
                        required
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="نام و نام خانوادگی شما"
                        className="w-full px-3.5 py-3 rounded-xl bg-black/50 border border-purple-900/50 text-xs text-white focus:border-purple-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-300 mb-1 font-bold">آدرس ایمیل شما</label>
                      <input
                        type="email"
                        required
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        placeholder="yourname@gmail.com"
                        className="w-full px-3.5 py-3 rounded-xl bg-black/50 border border-purple-900/50 text-xs text-white font-mono focus:border-purple-400 focus:outline-none text-left"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-300 mb-1 font-bold">آیدی تلگرام شما (برای ارسال اعلان)</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={editTelegram}
                          onChange={(e) => setEditTelegram(e.target.value)}
                          placeholder="@username"
                          className="w-full px-3.5 py-3 ps-8 rounded-xl bg-black/50 border border-purple-900/50 text-xs text-white font-mono focus:border-purple-400 focus:outline-none text-left"
                        />
                        <Send className="w-3.5 h-3.5 text-cyan-400 absolute top-3.5 start-2.5 rotate-180" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-gray-300 mb-1 font-bold">شماره تماس (اختیاری)</label>
                      <div className="relative">
                        <input
                          type="tel"
                          value={editPhone}
                          onChange={(e) => setEditPhone(e.target.value)}
                          placeholder="0912..."
                          className="w-full px-3.5 py-3 ps-8 rounded-xl bg-black/50 border border-purple-900/50 text-xs text-white font-mono focus:border-purple-400 focus:outline-none text-left"
                        />
                        <Phone className="w-3.5 h-3.5 text-emerald-400 absolute top-3.5 start-2.5" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-300 mb-1 font-bold">توضیحات کوتاه یا بیوگرافی</label>
                    <input
                      type="text"
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                      placeholder="مثال: علاقه‌مند به هوش مصنوعی، ساخت تیزر و وب‌سایت"
                      className="w-full px-3.5 py-3 rounded-xl bg-black/50 border border-purple-900/50 text-xs text-white focus:border-purple-400 focus:outline-none"
                    />
                  </div>

                  <div className="pt-2 flex items-center gap-3">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:opacity-90 text-white text-xs font-black transition-all shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isSaving ? 'در حال ذخیره...' : 'ذخیره تغییرات مشخصات'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('orders')}
                      className="py-3.5 px-5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-xs font-bold transition-all cursor-pointer"
                    >
                      انصراف
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            /* ================= REAL EMAIL REGISTRATION & SIGN-IN VIEW ================= */
            <div className="space-y-6 animate-in fade-in">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-purple-600/30 to-indigo-600/30 border border-purple-400/40 flex items-center justify-center mx-auto text-purple-300 shadow-[0_0_30px_rgba(168,85,247,0.3)]">
                  <UserCheck className="w-8 h-8 animate-pulse text-purple-300" />
                </div>
                <h3 className="text-base sm:text-xl font-black text-white">
                  ورود و ثبت‌نام با ایمیل شخصی
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed max-w-md mx-auto">
                  لطفاً ایمیل و مشخصات خود را وارد کنید تا سفارشات و وضعیت پروژه‌ها به حساب کاربری اختصاصی شما متصل شود.
                </p>
              </div>

              {/* Real User Registration / Login Form */}
              <form onSubmit={handleRealEmailAuth} className="space-y-4">
                {/* Select Avatar Preset */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-200">
                    انتخاب تصویر پروفایل (آواتار هوش مصنوعی)
                  </label>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
                    {AVATAR_PRESETS.slice(0, 6).map((url, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedAvatar(url)}
                        className={`relative rounded-2xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                          selectedAvatar === url
                            ? 'border-purple-400 scale-105 shadow-md shadow-purple-500/40'
                            : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={url} alt="Preset" className="w-11 h-11 object-cover" />
                        {selectedAvatar === url && (
                          <div className="absolute inset-0 bg-purple-600/40 flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Email Input */}
                  <div>
                    <label className="block text-xs text-gray-200 mb-1 font-bold flex items-center justify-between">
                      <span>آدرس ایمیل شما (Gmail یا سایر ایمیل‌ها) *</span>
                      <span className="text-[10px] text-purple-400 font-normal">ضروری برای ورود و بازیابی</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={userEmailInput}
                        onChange={(e) => {
                          setUserEmailInput(e.target.value);
                          if (!userNameInput && e.target.value.includes('@')) {
                            const uname = e.target.value.split('@')[0];
                            setUserNameInput(uname.replace(/[._]/g, ' '));
                          }
                        }}
                        placeholder="example@gmail.com"
                        className="w-full px-3.5 py-3 ps-9 rounded-xl bg-black/50 border border-purple-900/50 text-xs text-white font-mono focus:border-purple-400 focus:outline-none text-left"
                      />
                      <Mail className="w-4 h-4 text-purple-400 absolute top-3.5 start-3" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Name Input */}
                    <div>
                      <label className="block text-xs text-gray-300 mb-1 font-bold">نام و نام‌خانوادگی</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={userNameInput}
                          onChange={(e) => setUserNameInput(e.target.value)}
                          placeholder="نام و نام خانوادگی شما"
                          className="w-full px-3.5 py-3 ps-9 rounded-xl bg-black/50 border border-purple-900/50 text-xs text-white focus:border-purple-400 focus:outline-none"
                        />
                        <User className="w-4 h-4 text-purple-400 absolute top-3.5 start-3" />
                      </div>
                    </div>

                    {/* Telegram Username Input */}
                    <div>
                      <label className="block text-xs text-gray-300 mb-1 font-bold">آیدی تلگرام شما (اختیاری)</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={userTelegramInput}
                          onChange={(e) => setUserTelegramInput(e.target.value)}
                          placeholder="@username"
                          className="w-full px-3.5 py-3 ps-9 rounded-xl bg-black/50 border border-purple-900/50 text-xs text-white font-mono focus:border-purple-400 focus:outline-none text-left"
                        />
                        <AtSign className="w-4 h-4 text-cyan-400 absolute top-3.5 start-3" />
                      </div>
                    </div>
                  </div>

                  {/* Phone Input */}
                  <div>
                    <label className="block text-xs text-gray-300 mb-1 font-bold">شماره موبایل شما (اختیاری)</label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={userPhoneInput}
                        onChange={(e) => setUserPhoneInput(e.target.value)}
                        placeholder="0912..."
                        className="w-full px-3.5 py-3 ps-9 rounded-xl bg-black/50 border border-purple-900/50 text-xs text-white font-mono focus:border-purple-400 focus:outline-none text-left"
                      />
                      <Phone className="w-4 h-4 text-emerald-400 absolute top-3.5 start-3" />
                    </div>
                  </div>
                </div>

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={isSigningIn}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:opacity-95 text-white text-sm font-black transition-all shadow-[0_0_30px_rgba(168,85,247,0.35)] flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 mt-2"
                >
                  <CheckCircle2 className="w-5 h-5 text-cyan-300" />
                  <span>{isSigningIn ? 'در حال ورود و فعال‌سازی حساب...' : 'ورود و ثبت‌نام در پنل کاربری'}</span>
                </button>

                {/* Security and privacy notice */}
                <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1.5 text-xs text-gray-400">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>حریم خصوصی و ذخیره‌سازی امن:</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-gray-400">
                    اطلاعات شما فقط برای رهگیری سفارشات، هماهنگی تحویل فایل‌ها و پیام‌رسانی تلگرام استفاده می‌شود.
                  </p>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* ================= MODAL FOOTER (Sticky / Fixed) ================= */}
        <footer className="shrink-0 px-4 sm:px-6 py-3 bg-[#0a071d]/95 backdrop-blur-xl border-t border-purple-900/40 flex flex-wrap items-center justify-between gap-3 z-20">
          <a
            href={`https://t.me/${brandInfo.telegramHandle.replace('@', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-purple-300 hover:text-white transition-colors"
          >
            <Send className="w-3.5 h-3.5 rotate-180 text-purple-400" />
            <span>پشتیبانی تلگرام ({brandInfo.telegramHandle})</span>
          </a>

          {currentUser ? (
            <button
              type="button"
              onClick={() => {
                logoutUser();
                showToast('از حساب کاربری خارج شدید.');
              }}
              className="py-2 px-3.5 rounded-xl bg-white/5 hover:bg-rose-500/20 border border-white/10 hover:border-rose-500/30 text-gray-300 hover:text-rose-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>خروج از حساب</span>
            </button>
          ) : (
            <span className="text-[11px] text-gray-400 flex items-center gap-1 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              پروتکل امنیتی تکویکس
            </span>
          )}
        </footer>
      </div>
    </div>
  );
};
