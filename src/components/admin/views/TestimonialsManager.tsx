import React, { useState } from 'react';
import {
  MessageSquareHeart,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Sparkles,
  X,
  Star
} from 'lucide-react';
import { useSiteData } from '../../../context/SiteDataContext';
import { TestimonialItem } from '../../../types';

export const TestimonialsManager: React.FC = () => {
  const { testimonials, addTestimonial, updateTestimonial, deleteTestimonial } = useSiteData();

  const [editingItem, setEditingItem] = useState<TestimonialItem | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  const [formData, setFormData] = useState<Partial<TestimonialItem>>({
    name: '',
    role: '',
    company: '',
    quote: '',
    avatarSeed: 'user',
    verified: true,
  });

  const handleStartCreate = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      role: '',
      company: '',
      quote: '',
      avatarSeed: `user-${Date.now()}`,
      verified: true,
    });
    setIsCreatingNew(true);
  };

  const handleStartEdit = (item: TestimonialItem) => {
    setIsCreatingNew(false);
    setEditingItem(item);
    setFormData({ ...item });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.quote) return;

    if (isCreatingNew) {
      addTestimonial({
        name: formData.name || '',
        role: formData.role || 'کارفرما',
        company: formData.company || 'کسب‌وکار دیجیتال',
        quote: formData.quote || '',
        avatarSeed: formData.avatarSeed || 'user',
        verified: formData.verified ?? true,
      });
      setIsCreatingNew(false);
    } else if (editingItem) {
      updateTestimonial(editingItem.id, {
        name: formData.name,
        role: formData.role,
        company: formData.company,
        quote: formData.quote,
        verified: formData.verified,
      });
      setEditingItem(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-purple-900/30">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <MessageSquareHeart className="w-5 h-5 text-pink-400" />
            <span>مدیریت نظرات و رضایت مشتریان</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            ثبت و ویرایش دیدگاه‌های مشتریان که در بخش کارت‌های رضایت صفحه اصلی نمایش داده می‌شود.
          </p>
        </div>

        <button
          type="button"
          onClick={handleStartCreate}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs sm:text-sm font-bold shadow-[0_0_15px_rgba(147,51,234,0.4)] transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>افزودن نظر مشتری جدید</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="rounded-2xl bg-[#0d0922] border border-purple-900/30 p-5 flex flex-col justify-between hover:border-purple-500/40 transition-all shadow-lg"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                    {t.name.slice(0, 1)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-1">
                      <span>{t.name}</span>
                      {t.verified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    </h3>
                    <span className="text-[11px] text-gray-400">
                      {t.role} • {t.company}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-300 leading-relaxed italic mb-4">
                "{t.quote}"
              </p>
            </div>

            <div className="pt-3 border-t border-white/5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => handleStartEdit(t)}
                className="px-2.5 py-1 rounded-lg bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 text-xs font-semibold flex items-center gap-1"
              >
                <Edit2 className="w-3 h-3" />
                <span>ویرایش</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirm(`آیا از حذف نظر ${t.name} اطمینان دارید؟`)) {
                    deleteTestimonial(t.id);
                  }
                }}
                className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {(isCreatingNew || editingItem) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl bg-[#0e0a24] border border-purple-500/40 p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-pink-400" />
                <span>{isCreatingNew ? 'افزودن نظر مشتری' : 'ویرایش نظر مشتری'}</span>
              </h2>
              <button
                type="button"
                onClick={() => {
                  setIsCreatingNew(false);
                  setEditingItem(null);
                }}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  نام و نام خانوادگی مشتری <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="مثال: سارا رضایی"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">سمت شغلی</label>
                  <input
                    type="text"
                    value={formData.role || ''}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="مثال: مدیر مارکتینگ"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">شرکت یا برند</label>
                  <input
                    type="text"
                    value={formData.company || ''}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="مثال: آژانس نووا"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  متن دیدگاه و نظر <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.quote || ''}
                  onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                  placeholder="متن نظر کارفرما درباره کیفیت، سرعت و خروجی تکویکس..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white focus:border-purple-500 focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-200">
                  <input
                    type="checkbox"
                    checked={formData.verified ?? true}
                    onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
                    className="w-4 h-4 rounded text-purple-600 bg-white/5 border-white/20"
                  />
                  <span>دارای نشان تأییدشده (Verified)</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingNew(false);
                    setEditingItem(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-white/5 text-gray-300 text-xs"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white text-xs font-bold"
                >
                  ذخیره دیدگاه
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
