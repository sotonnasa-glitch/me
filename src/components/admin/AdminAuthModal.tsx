import React, { useState } from 'react';
import {
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useSiteData } from '../../context/SiteDataContext';
import { AICloseButton } from '../common/AICloseButton';

interface AdminAuthModalProps {
  isOpen: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onSuccess,
  onCancel,
}) => {
  const { verifyAdminPassword, brandInfo } = useSiteData();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('لطفاً رمز عبور مدیریت را وارد کنید.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await verifyAdminPassword(password);
      if (res.success) {
        setIsLoading(false);
        onSuccess();
      } else {
        setError(res.error || 'رمز عبور وارد شده نادرست است.');
        setIsLoading(false);
      }
    } catch (err: any) {
      setError('خطا در بررسی رمز عبور.');
      setIsLoading(false);
    }
  };

  return (
    <div
      id="admin-auth-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      dir="rtl"
    >
      <div
        id="admin-auth-card"
        className="w-full max-w-md rounded-3xl bg-gradient-to-b from-[#130b2e] via-[#0b071c] to-[#060410] border border-purple-500/40 p-6 sm:p-8 shadow-[0_0_80px_rgba(168,85,247,0.35)] relative overflow-hidden text-start"
      >
        {/* Glow */}
        <div className="absolute top-0 start-1/2 -translate-x-1/2 w-48 h-24 bg-purple-600/30 rounded-full blur-2xl pointer-events-none" />

        {/* Close / Return Button */}
        <div className="absolute top-4 start-4 z-20">
          <AICloseButton
            onClick={onCancel}
            title="انصراف و بازگشت به سایت"
            ariaLabel="بستن پنجره ورود مدیریت"
            variant="cyber"
            size="sm"
          />
        </div>

        {/* Icon & Title */}
        <div className="relative z-10 text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 border border-purple-400/40 flex items-center justify-center text-white shadow-xl shadow-purple-600/40">
            <Lock className="w-8 h-8" />
          </div>

          <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 inline-block mb-2">
            ورود ایمن به پنل مدیریت {brandInfo.name || 'تکویکس'}
          </span>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            احراز هویت ادمین
          </h2>
          <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
            برای دسترسی به تنظیمات سایت، مدیریت سفارشات و ربات تلگرام، رمز عبور را وارد کنید.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
          <div>
            <label
              htmlFor="admin-password-input"
              className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center gap-1.5"
            >
              <KeyRound className="w-3.5 h-3.5 text-purple-400" />
              <span>رمز عبور مدیریت</span>
            </label>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="admin-password-input"
                autoFocus
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="رمز عبور پنل ادمین..."
                className={`w-full ps-4 pe-11 py-3 rounded-2xl bg-[#080517] border text-white placeholder:text-gray-500 text-sm focus:outline-none transition-all ${
                  error
                    ? 'border-rose-500 bg-rose-950/20 focus:border-rose-400'
                    : 'border-purple-900/50 focus:border-purple-400 focus:bg-[#0f0927] shadow-inner'
                }`}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute end-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer"
                title={showPassword ? 'مخفی کردن' : 'نمایش رمز'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <p className="text-[11px] text-rose-400 mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2.5 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="w-1/3 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-semibold border border-white/10 transition-colors cursor-pointer flex items-center justify-center gap-1"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>انصراف</span>
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="w-2/3 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isLoading ? 'در حال بررسی...' : 'ورود به پنل ادمین'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
