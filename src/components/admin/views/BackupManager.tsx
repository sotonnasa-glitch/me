import React, { useState } from 'react';
import {
  Database,
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  Copy,
  Check
} from 'lucide-react';
import { useSiteData } from '../../../context/SiteDataContext';

export const BackupManager: React.FC = () => {
  const { exportJSON, importJSON, resetToDefaults, services, orders, portfolio, testimonials, faqs } = useSiteData();

  const [importText, setImportText] = useState('');
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [copied, setCopied] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleDownloadBackup = () => {
    const json = exportJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tekvix-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyJSON = () => {
    const json = exportJSON();
    navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importText.trim()) return;

    const success = importJSON(importText);
    if (success) {
      setImportStatus('success');
      setImportText('');
      setTimeout(() => setImportStatus('idle'), 3500);
    } else {
      setImportStatus('error');
    }
  };

  const handleExecuteReset = () => {
    resetToDefaults();
    setShowResetConfirm(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl">
      
      {/* Header */}
      <div className="pb-4 border-b border-purple-900/30">
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Database className="w-5 h-5 text-gray-400" />
          <span>پشتیبان‌گیری، خروجی JSON و بازنشانی داده‌ها</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          تهیه نسخه پشتیبان از تمام اطلاعات سایت (خدمات، سفارشات، نمونه‌کارها، نظرات) یا بازیابی داده‌ها.
        </p>
      </div>

      {/* Summary of Data */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-4 rounded-2xl bg-[#0d0922] border border-purple-900/30 text-center">
          <span className="text-[11px] text-gray-400 block">خدمات</span>
          <span className="text-xl font-bold text-white font-mono">{services.length}</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#0d0922] border border-purple-900/30 text-center">
          <span className="text-[11px] text-gray-400 block">سفارشات</span>
          <span className="text-xl font-bold text-white font-mono">{orders.length}</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#0d0922] border border-purple-900/30 text-center">
          <span className="text-[11px] text-gray-400 block">نمونه‌کارها</span>
          <span className="text-xl font-bold text-white font-mono">{portfolio.length}</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#0d0922] border border-purple-900/30 text-center">
          <span className="text-[11px] text-gray-400 block">نظرات مشتریان</span>
          <span className="text-xl font-bold text-white font-mono">{testimonials.length}</span>
        </div>
        <div className="p-4 rounded-2xl bg-[#0d0922] border border-purple-900/30 text-center col-span-2 sm:col-span-1">
          <span className="text-[11px] text-gray-400 block">سوالات FAQ</span>
          <span className="text-xl font-bold text-white font-mono">{faqs.length}</span>
        </div>
      </div>

      {/* Export Section */}
      <div className="p-6 rounded-2xl bg-[#0d0922] border border-purple-900/30 space-y-4 shadow-lg">
        <div className="flex items-center justify-between pb-2 border-b border-white/5">
          <div className="flex items-center gap-2 text-purple-300">
            <Download className="w-4 h-4" />
            <h2 className="text-sm font-bold text-white">دریافت فایل پشتیبان (Export Data)</h2>
          </div>
          <span className="text-xs text-gray-400">فرمت استاندارد JSON</span>
        </div>

        <p className="text-xs text-gray-300 leading-relaxed">
          می‌توانید تمام تغییرات، سفارشات، خدمات و متون سایت را به صورت یک فایل JSON دانلود کرده و در سیستم خود نگه دارید.
        </p>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleDownloadBackup}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-[0_0_15px_rgba(147,51,234,0.3)] flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>دانلود فایل پشتیبان (JSON)</span>
          </button>

          <button
            type="button"
            onClick={handleCopyJSON}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-semibold border border-white/10 flex items-center gap-2"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'کپی شد!' : 'کپی متن JSON'}</span>
          </button>
        </div>
      </div>

      {/* Import Section */}
      <div className="p-6 rounded-2xl bg-[#0d0922] border border-purple-900/30 space-y-4 shadow-lg">
        <div className="flex items-center gap-2 text-purple-300 pb-2 border-b border-white/5">
          <Upload className="w-4 h-4" />
          <h2 className="text-sm font-bold text-white">بازیابی و وارد کردن اطلاعات (Import Data)</h2>
        </div>

        {importStatus === 'success' && (
          <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>اطلاعات با موفقیت بازیابی و با سایت همگام شد!</span>
          </div>
        )}

        {importStatus === 'error' && (
          <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            <span>فرمت JSON نامعتبر است. لطفاً متن وارد شده را بررسی فرمایید.</span>
          </div>
        )}

        <form onSubmit={handleImportSubmit} className="space-y-3">
          <textarea
            rows={4}
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder="محتوای JSON نسخه پشتیبان را اینجا قرار دهید (Paste)..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white font-mono focus:border-purple-500 focus:outline-none resize-none"
          />

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white text-xs font-bold"
          >
            بازیابی و اعمال داده‌ها
          </button>
        </form>
      </div>

      {/* Factory Reset Section */}
      <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-500/20 space-y-4">
        <div className="flex items-center gap-2 text-rose-300 pb-2 border-b border-rose-500/20">
          <RotateCcw className="w-4 h-4" />
          <h2 className="text-sm font-bold text-white">بازنشانی به تنظیمات پیش‌فرض کارخانه</h2>
        </div>

        <p className="text-xs text-gray-300 leading-relaxed">
          در صورت تمایل به حذف تمام تغییرات و بازگشت داده‌های سایت و خدمات به حالت اولیه، از دکمه زیر استفاده کنید.
        </p>

        <button
          type="button"
          onClick={() => setShowResetConfirm(true)}
          className="px-4 py-2.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 hover:text-white border border-rose-500/30 text-xs font-semibold transition-all flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>بازنشانی کلیه داده‌ها به حالت پیش‌فرض</span>
        </button>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-[#0e0a24] border border-rose-500/40 p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">آیا از بازنشانی داده‌ها مطمئن هستید؟</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              تمام خدمات اضافه شده، سفارشات و تغییرات پاک شده و اطلاعات اولیه تکویکس بارگذاری خواهد شد.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl bg-white/5 text-gray-300 text-xs font-semibold"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={handleExecuteReset}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
              >
                بله، بازنشانی شود
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
