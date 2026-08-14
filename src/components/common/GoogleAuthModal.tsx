import React, { useState } from 'react';
import {
  X,
  User,
  LogOut,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Inbox,
  Sparkles,
  ExternalLink,
  ChevronLeft
} from 'lucide-react';
import { useSiteData } from '../../context/SiteDataContext';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenOrderModal?: () => void;
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({
  isOpen,
  onClose,
  onOpenOrderModal,
}) => {
  const { currentUser, loginWithGoogle, logoutUser, orders } = useSiteData();
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [isCustomFormOpen, setIsCustomFormOpen] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  if (!isOpen) return null;

  const handleQuickGoogleLogin = () => {
    setIsSigningIn(true);
    setTimeout(() => {
      loginWithGoogle({
        name: 'کاربر ارجمند گوگل',
        email: 'user.google@gmail.com',
        avatar:
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      });
      setIsSigningIn(false);
    }, 600);
  };

  const handleCustomGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName || !customEmail) return;
    setIsSigningIn(true);
    setTimeout(() => {
      loginWithGoogle({
        name: customName,
        email: customEmail,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(customName)}`,
      });
      setIsSigningIn(false);
      setIsCustomFormOpen(false);
    }, 400);
  };

  const userOrders = currentUser
    ? orders.filter(
        (o) =>
          o.fullName.toLowerCase().includes(currentUser.name.toLowerCase()) ||
          o.telegramOrPhone.toLowerCase().includes(currentUser.email.toLowerCase())
      )
    : [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      dir="rtl"
    >
      <div
        className="w-full max-w-md bg-[#09090b] border border-purple-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative text-white space-y-6 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background glow */}
        <div className="absolute -top-20 -end-20 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-white">
                {currentUser ? 'پروفایل کاربری' : 'ورود و عضویت در تکویکس'}
              </h2>
              <span className="text-[11px] text-zinc-400">
                {currentUser ? 'مدیریت حساب و پیگیری سفارشات' : 'اتصال سریع با حساب کاربری گوگل'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Logged-In View */}
        {currentUser ? (
          <div className="space-y-6">
            {/* User Info Card */}
            <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-center gap-4">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-purple-500/40 shadow-md"
              />
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm sm:text-base">
                    {currentUser.name}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    تایید شده
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
                  <Mail className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{currentUser.email}</span>
                </div>
              </div>
            </div>

            {/* User Orders Status */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-zinc-300 flex items-center gap-1.5">
                  <Inbox className="w-3.5 h-3.5 text-purple-400" />
                  سفارشات ثبت شده شما ({userOrders.length})
                </span>
                {onOpenOrderModal && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenOrderModal();
                    }}
                    className="text-purple-400 hover:text-purple-300 font-semibold text-xs flex items-center gap-1"
                  >
                    <span>+ ثبت سفارش جدید</span>
                  </button>
                )}
              </div>

              {userOrders.length === 0 ? (
                <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 text-center space-y-2">
                  <p className="text-xs text-zinc-400">هنوز سفارشی با این حساب ثبت نکرده‌اید.</p>
                  {onOpenOrderModal && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenOrderModal();
                      }}
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-600/30"
                    >
                      شروع اولین پروژه
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {userOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-white block">{ord.serviceTitle}</span>
                        <span className="text-[10px] text-zinc-400 font-mono">
                          کد: {ord.id} | {new Date(ord.createdAt).toLocaleDateString('fa-IR')}
                        </span>
                      </div>
                      <div>
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                            ord.status === 'new'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                              : ord.status === 'in_progress'
                              ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          }`}
                        >
                          {ord.status === 'new'
                            ? 'بررسی استعلام'
                            : ord.status === 'in_progress'
                            ? 'در حال پیاده‌سازی'
                            : 'تکمیل شده'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Logout Button */}
            <div className="pt-2 border-t border-zinc-800">
              <button
                type="button"
                onClick={logoutUser}
                className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-rose-500/20 border border-zinc-800 hover:border-rose-500/30 text-zinc-400 hover:text-rose-300 text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>خروج از حساب کاربری</span>
              </button>
            </div>
          </div>
        ) : (
          /* Sign-In View */
          <div className="space-y-5">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-3xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center mx-auto text-purple-400 shadow-inner">
                <Sparkles className="w-8 h-8 animate-pulse" />
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed px-4">
                با ورود از طریق حساب گوگل، سفارشات شما ذخیره شده و روند پیشرفت ساخت پروژه را
                بلادرنگ مشاهده خواهید کرد.
              </p>
            </div>

            {/* Official Google Sign-In Button */}
            <button
              type="button"
              onClick={handleQuickGoogleLogin}
              disabled={isSigningIn}
              className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-zinc-100 text-zinc-900 font-bold text-sm flex items-center justify-center gap-3 shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              {/* Google 4-Color SVG Icon */}
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{isSigningIn ? 'در حال اتصال به گوگل...' : 'ورود سریع با اکانت گوگل'}</span>
            </button>

            {/* Custom Google Account Info Accordion */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsCustomFormOpen((prev) => !prev)}
                className="w-full text-center text-xs text-purple-400 hover:text-purple-300 font-semibold transition-colors"
              >
                {isCustomFormOpen ? 'بستن فرم مشخصات دستی' : 'یا ورود با نام و ایمیل دلخواه'}
              </button>

              {isCustomFormOpen && (
                <form
                  onSubmit={handleCustomGoogleSubmit}
                  className="mt-3 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3"
                >
                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">نام و نام‌خانوادگی</label>
                    <input
                      type="text"
                      required
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder="مثال: علی احمدی"
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">آدرس ایمیل گوگل</label>
                    <input
                      type="email"
                      required
                      value={customEmail}
                      onChange={(e) => setCustomEmail(e.target.value)}
                      placeholder="ali.ahmadi@gmail.com"
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white font-mono focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-600/30"
                  >
                    تایید و ورود
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
