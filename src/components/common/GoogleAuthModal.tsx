import React, { useState, useEffect } from 'react';
import {
  X,
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
  Camera,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useSiteData } from '../../context/SiteDataContext';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenOrderModal?: () => void;
}

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
];

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({
  isOpen,
  onClose,
  onOpenOrderModal,
}) => {
  const { currentUser, loginWithGoogle, updateUserProfile, logoutUser, orders, brandInfo } = useSiteData();
  const [activeTab, setActiveTab] = useState<'profile' | 'edit'>('profile');
  
  // Custom Login state
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [isCustomFormOpen, setIsCustomFormOpen] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Edit Profile Form state
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

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleQuickGoogleLogin = (preset?: { name: string; email: string; avatar: string; telegram?: string; phone?: string }) => {
    setIsSigningIn(true);
    setTimeout(() => {
      const selected = preset || {
        name: 'مهدی حاتمی',
        email: 'mahdihatami2024@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        telegram: '@Lawat_kar',
        phone: '09123456789',
      };
      loginWithGoogle(selected);
      setIsSigningIn(false);
      showToast('با موفقیت از طریق گوگل وارد شدید!');
    }, 450);
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
        telegram: '@' + customName.replace(/\s+/g, '_').toLowerCase(),
        phone: '09120000000',
      });
      setIsSigningIn(false);
      setIsCustomFormOpen(false);
      showToast('حساب کاربری جدید ایجاد و فعال شد!');
    }, 400);
  };

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
      setActiveTab('profile');
      showToast('اطلاعات پروفایل با موفقیت به‌روزرسانی شد!');
    }, 350);
  };

  const userOrders = currentUser
    ? orders.filter(
        (o) =>
          o.fullName.toLowerCase().includes(currentUser.name.toLowerCase()) ||
          o.telegramOrPhone.toLowerCase().includes(currentUser.email.toLowerCase()) ||
          (currentUser.telegram && o.telegramOrPhone.includes(currentUser.telegram))
      )
    : [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200"
      dir="rtl"
    >
      <div
        className="w-full max-w-lg bg-[#0a071a] border border-purple-500/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(147,51,234,0.3)] relative text-white space-y-6 overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient background glows */}
        <div className="absolute -top-24 -end-24 w-60 h-60 bg-purple-600/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -start-24 w-60 h-60 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-purple-900/30">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-600/40 border border-purple-400/30">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white">
                {currentUser
                  ? activeTab === 'edit'
                    ? 'ویرایش اطلاعات کاربری'
                    : 'پروفایل و حساب کاربری'
                  : 'ثبت‌نام و ورود با گوگل'}
              </h2>
              <span className="text-xs text-purple-300/80">
                {currentUser
                  ? 'مدیریت مشخصات، ارتباط تلگرام و پیگیری سفارشات'
                  : 'اتصال سریع و بدون نیاز به رمز عبور'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Toast Notification */}
        {toastMessage && (
          <div className="p-3 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* ================= LOGGED IN USER INTERFACE ================= */}
        {currentUser ? (
          <div className="space-y-5">
            {/* Navigation Tabs (Overview vs Edit Profile) */}
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/[0.04] border border-white/10">
              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'profile'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>نمای کلی و پروژه‌ها</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('edit')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'edit'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Edit3 className="w-4 h-4" />
                <span>ویرایش پروفایل</span>
              </button>
            </div>

            {/* TAB 1: OVERVIEW & ORDERS */}
            {activeTab === 'profile' && (
              <div className="space-y-5 animate-in fade-in">
                {/* Profile Card */}
                <div className="p-4.5 rounded-3xl bg-gradient-to-br from-[#150d36] to-[#0d0924] border border-purple-500/40 shadow-inner relative overflow-hidden">
                  <div className="flex items-start gap-4">
                    <div className="relative shrink-0">
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-purple-400 shadow-md"
                      />
                      <span className="absolute -bottom-1 -start-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#0d0924] flex items-center justify-center text-[10px] text-black font-bold">
                        ✓
                      </span>
                    </div>
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-black text-white text-base sm:text-lg truncate">
                          {currentUser.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => setActiveTab('edit')}
                          className="px-2.5 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/30 text-purple-200 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>ویرایش</span>
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-purple-200/80">
                        <div className="flex items-center gap-1 font-mono">
                          <Mail className="w-3.5 h-3.5 text-purple-400" />
                          <span>{currentUser.email}</span>
                        </div>
                        {currentUser.telegram && (
                          <div className="flex items-center gap-1 font-mono text-cyan-300">
                            <Send className="w-3 h-3 rotate-180" />
                            <span>{currentUser.telegram}</span>
                          </div>
                        )}
                        {currentUser.phone && (
                          <div className="flex items-center gap-1 font-mono text-emerald-300">
                            <Phone className="w-3 h-3" />
                            <span>{currentUser.phone}</span>
                          </div>
                        )}
                      </div>

                      {currentUser.bio && (
                        <p className="text-xs text-gray-300 pt-1 border-t border-purple-900/30 italic">
                          "{currentUser.bio}"
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Orders Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-gray-200 flex items-center gap-1.5">
                      <Inbox className="w-4 h-4 text-purple-400" />
                      <span>سفارشات و پروژه‌های شما ({userOrders.length})</span>
                    </span>
                    {onOpenOrderModal && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onOpenOrderModal();
                        }}
                        className="text-purple-400 hover:text-purple-200 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <span>+ ثبت سفارش جدید</span>
                      </button>
                    )}
                  </div>

                  {userOrders.length === 0 ? (
                    <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 text-center space-y-3">
                      <p className="text-xs text-gray-400">هنوز سفارشی با این حساب ثبت نکرده‌اید.</p>
                      {onOpenOrderModal && (
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onOpenOrderModal();
                          }}
                          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-600/30 cursor-pointer"
                        >
                          ثبت سفارش سریع با هوش مصنوعی
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {userOrders.map((ord) => (
                        <div
                          key={ord.id}
                          className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between text-xs hover:border-purple-500/40 transition-all"
                        >
                          <div className="space-y-0.5">
                            <span className="font-bold text-white block text-xs sm:text-sm">
                              {ord.serviceTitle}
                            </span>
                            <div className="text-[11px] text-gray-400 font-mono flex items-center gap-2">
                              <span>کد: {ord.id}</span>
                              <span>•</span>
                              <span>{new Date(ord.createdAt).toLocaleDateString('fa-IR')}</span>
                            </div>
                          </div>
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
                              ? 'در حال ساخت'
                              : 'تکمیل شده'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Controls */}
                <div className="pt-2 border-t border-purple-900/30 flex items-center justify-between gap-3">
                  <a
                    href="https://t.me/Lawat_kar"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-purple-300 hover:text-white transition-colors"
                  >
                    <Send className="w-3.5 h-3.5 rotate-180 text-purple-400" />
                    <span>پشتیبانی تلگرام (@Lawat_kar)</span>
                  </a>

                  <button
                    type="button"
                    onClick={logoutUser}
                    className="py-2 px-4 rounded-xl bg-white/5 hover:bg-rose-500/20 border border-white/10 hover:border-rose-500/30 text-gray-300 hover:text-rose-300 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>خروج از حساب</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: EDIT PROFILE FORM */}
            {activeTab === 'edit' && (
              <form onSubmit={handleSaveProfile} className="space-y-4 animate-in fade-in">
                {/* Avatar Selection */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-200">
                    انتخاب تصویر پروفایل (آواتار)
                  </label>
                  <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
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
                        <img src={avUrl} alt="Avatar" className="w-12 h-12 object-cover" />
                        {editAvatar === avUrl && (
                          <div className="absolute inset-0 bg-purple-600/40 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-300 mb-1 font-bold">نام و نام‌خانوادگی</label>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="مهدی حاتمی"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-purple-900/50 text-xs text-white focus:border-purple-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-300 mb-1 font-bold">آدرس ایمیل</label>
                    <input
                      type="email"
                      required
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      placeholder="user@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-purple-900/50 text-xs text-white font-mono focus:border-purple-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-300 mb-1 font-bold">آیدی تلگرام</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={editTelegram}
                        onChange={(e) => setEditTelegram(e.target.value)}
                        placeholder="@Lawat_kar"
                        className="w-full px-3.5 py-2.5 ps-8 rounded-xl bg-black/50 border border-purple-900/50 text-xs text-white font-mono focus:border-purple-400 focus:outline-none text-left"
                      />
                      <Send className="w-3.5 h-3.5 text-cyan-400 absolute top-3 start-2.5 rotate-180" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-300 mb-1 font-bold">شماره موبایل</label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        placeholder="09123456789"
                        className="w-full px-3.5 py-2.5 ps-8 rounded-xl bg-black/50 border border-purple-900/50 text-xs text-white font-mono focus:border-purple-400 focus:outline-none text-left"
                      />
                      <Phone className="w-3.5 h-3.5 text-emerald-400 absolute top-3 start-2.5" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-300 mb-1 font-bold">معرفی کوتاه / بیوگرافی یا عنوان شغلی</label>
                  <input
                    type="text"
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    placeholder="مثال: مدیر فنی استارتاپ، علاقه‌مند به هوش مصنوعی"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-purple-900/50 text-xs text-white focus:border-purple-400 focus:outline-none"
                  />
                </div>

                {/* Submit button & cancel */}
                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? 'در حال ذخیره اطلاعات...' : 'ذخیره تغییرات پروفایل'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('profile')}
                    className="py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-xs font-bold transition-all cursor-pointer"
                  >
                    انصراف
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          /* ================= SIGN-IN / REGISTRATION VIEW ================= */
          <div className="space-y-6">
            <div className="text-center space-y-2.5">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-purple-600/30 to-indigo-600/30 border border-purple-400/40 flex items-center justify-center mx-auto text-purple-300 shadow-[0_0_25px_rgba(168,85,247,0.3)]">
                <Sparkles className="w-8 h-8 animate-pulse text-purple-300" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                عضویت سریع در پلتفرم تکویکس
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed max-w-sm mx-auto">
                با یک کلیک از طریق حساب کاربری گوگل خود ثبت‌نام کنید تا سفارشات، فایل‌های تحویلی و وضعیت پیشرفت پروژه‌های شما ذخیره و هماهنگ شود.
              </p>
            </div>

            {/* Official Google Sign-In Button */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={() =>
                  handleQuickGoogleLogin({
                    name: 'مهدی حاتمی',
                    email: 'mahdihatami2024@gmail.com',
                    avatar:
                      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
                    telegram: '@Lawat_kar',
                    phone: '09123456789',
                  })
                }
                disabled={isSigningIn}
                className="w-full py-4 px-5 rounded-2xl bg-white hover:bg-gray-100 text-zinc-900 font-black text-sm sm:text-base flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
              >
                {/* Authentic 4-Color Google "G" Icon */}
                <svg className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" viewBox="0 0 24 24">
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
                <span>
                  {isSigningIn ? 'در حال اتصال ایمن به Google...' : 'ورود و ثبت‌نام با اکانت گوگل'}
                </span>
              </button>

              <div className="flex items-center gap-2 text-center text-xs text-gray-400 justify-center">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>احراز هویت رمزنگاری شده و اتصال آنی</span>
              </div>
            </div>

            {/* Custom Google Account Info Accordion */}
            <div className="pt-2 border-t border-purple-900/30">
              <button
                type="button"
                onClick={() => setIsCustomFormOpen((prev) => !prev)}
                className="w-full text-center text-xs text-purple-300 hover:text-white font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer py-1"
              >
                <span>{isCustomFormOpen ? '▲ بستن فرم حساب دلخواه' : '▼ ورود با مشخصات یا جیمیل اختصاصی دیگر'}</span>
              </button>

              {isCustomFormOpen && (
                <form
                  onSubmit={handleCustomGoogleSubmit}
                  className="mt-3 p-4 rounded-2xl bg-[#120b2e] border border-purple-500/30 space-y-3 animate-in fade-in"
                >
                  <div>
                    <label className="block text-xs text-gray-300 mb-1">نام و نام‌خانوادگی</label>
                    <input
                      type="text"
                      required
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder="مثال: مهدی حاتمی"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-purple-900/40 text-xs text-white focus:border-purple-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-300 mb-1">آدرس ایمیل گوگل (Gmail)</label>
                    <input
                      type="email"
                      required
                      value={customEmail}
                      onChange={(e) => setCustomEmail(e.target.value)}
                      placeholder="mahdihatami2024@gmail.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-purple-900/40 text-xs text-white font-mono focus:border-purple-400 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-600/40 cursor-pointer"
                  >
                    تایید و ورود با این حساب
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
