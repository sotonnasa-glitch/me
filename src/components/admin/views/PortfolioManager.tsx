import React, { useState } from 'react';
import {
  Briefcase,
  Plus,
  Search,
  Edit2,
  Trash2,
  Sparkles,
  X,
  Tag
} from 'lucide-react';
import { useSiteData } from '../../../context/SiteDataContext';
import { PortfolioItem } from '../../../types';

export const PortfolioManager: React.FC = () => {
  const { portfolio, addPortfolioItem, updatePortfolioItem, deletePortfolioItem } = useSiteData();

  const [searchQuery, setSearchQuery] = useState('');
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  const [formData, setFormData] = useState<Partial<PortfolioItem>>({
    title: '',
    description: '',
    serviceCategory: 'وب‌سایت و کدنویسی',
    badge: 'پروژه شاخص',
    gradientTheme: 'from-purple-900/60 via-indigo-900/40 to-black',
    tags: ['AI', 'Design'],
    stats: [
      { label: 'سرعت تحویل', value: '۲ روز' },
      { label: 'رضایت کارفرما', value: '۱۰۰٪' }
    ]
  });

  const [tagInput, setTagInput] = useState('');

  const filteredPortfolio = portfolio.filter((p) => {
    const q = (searchQuery || '').toLowerCase().trim();
    if (!q) return true;
    const title = (p.title || '').toLowerCase();
    const serviceCat = (p.serviceCategory || '').toLowerCase();
    const desc = (p.description || '').toLowerCase();
    return title.includes(q) || serviceCat.includes(q) || desc.includes(q);
  });

  const handleStartCreate = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      description: '',
      serviceCategory: 'وب‌سایت و کدنویسی',
      badge: 'پروژه جدید',
      gradientTheme: 'from-purple-900/60 via-indigo-900/40 to-black',
      tags: ['AI', 'Tech', 'Cyber'],
      stats: [
        { label: 'کیفیت خروجی', value: '4K Ultra' },
        { label: 'نرخ رشد', value: '+۱۸۰٪' }
      ]
    });
    setIsCreatingNew(true);
  };

  const handleStartEdit = (item: PortfolioItem) => {
    setIsCreatingNew(false);
    setEditingItem(item);
    setFormData({
      ...item,
      tags: [...item.tags],
      stats: item.stats.map((s) => ({ ...s }))
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return;

    if (isCreatingNew) {
      addPortfolioItem({
        title: formData.title || '',
        description: formData.description || '',
        serviceCategory: formData.serviceCategory || 'وب‌سایت و کدنویسی',
        badge: formData.badge || 'پروژه نمونه',
        gradientTheme: formData.gradientTheme || 'from-purple-900/60 via-indigo-900/40 to-black',
        tags: formData.tags || ['AI'],
        stats: formData.stats || []
      });
      setIsCreatingNew(false);
    } else if (editingItem) {
      updatePortfolioItem(editingItem.id, {
        title: formData.title,
        description: formData.description,
        serviceCategory: formData.serviceCategory,
        badge: formData.badge,
        gradientTheme: formData.gradientTheme,
        tags: formData.tags,
        stats: formData.stats
      });
      setEditingItem(null);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: (prev.tags || []).filter((t) => t !== tagToRemove)
    }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-purple-900/30">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-cyan-400" />
            <span>مدیریت نمونه‌کارها و پروژه‌ها</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            پروژه‌های انجام‌شده با هوش مصنوعی را ویرایش کنید یا پروژه جدید به ویترین سایت اضافه نمایید.
          </p>
        </div>

        <button
          type="button"
          onClick={handleStartCreate}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs sm:text-sm font-bold shadow-[0_0_15px_rgba(147,51,234,0.4)] transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>افزودن نمونه‌کار جدید</span>
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center justify-between bg-[#0b081e] p-3 rounded-2xl border border-purple-900/30">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute start-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجو در نمونه‌کارها..."
            className="w-full ps-9 pe-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPortfolio.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl bg-[#0d0922] border border-purple-900/30 p-5 flex flex-col justify-between hover:border-purple-500/40 transition-all shadow-lg"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] text-cyan-400 font-semibold px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/30">
                  {item.serviceCategory}
                </span>
                <span className="text-[10px] text-purple-300 font-semibold px-2 py-0.5 rounded bg-purple-950/60 border border-purple-800/30">
                  {item.badge}
                </span>
              </div>

              <h3 className="text-sm font-bold text-white mb-2">{item.title}</h3>
              <p className="text-xs text-gray-300 leading-relaxed line-clamp-3 mb-4">
                {item.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {item.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-gray-400 border border-white/5"
                  >
                    #{t}
                  </span>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-black/40 border border-white/5 mb-4 text-xs">
                {item.stats.map((st, idx) => (
                  <div key={idx}>
                    <span className="text-[10px] text-gray-400 block">{st.label}</span>
                    <span className="font-bold text-white font-mono">{st.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-white/5 flex items-center justify-between">
              <span className="text-[10px] text-gray-500 font-mono">شناسه: {item.id}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleStartEdit(item)}
                  className="px-2.5 py-1 rounded-lg bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 text-xs font-semibold border border-purple-500/30 flex items-center gap-1"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>ویرایش</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`آیا از حذف نمونه‌کار ${item.title} مطمئن هستید؟`)) {
                      deletePortfolioItem(item.id);
                    }
                  }}
                  className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Create/Edit Portfolio */}
      {(isCreatingNew || editingItem) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0e0a24] border border-purple-500/40 p-6 sm:p-8 space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <span>{isCreatingNew ? 'افزودن نمونه‌کار جدید' : 'ویرایش نمونه‌کار'}</span>
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
                  عنوان پروژه <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="مثال: تیزر ویدیویی علمی‌تخیلی شرکت ویستا"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    دسته‌بندی نمایشی
                  </label>
                  <input
                    type="text"
                    value={formData.serviceCategory || ''}
                    onChange={(e) => setFormData({ ...formData, serviceCategory: e.target.value })}
                    placeholder="مثال: ویدیو و انیمیشن"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    بج / نشان
                  </label>
                  <input
                    type="text"
                    value={formData.badge || ''}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="مثال: ویدیو 4K"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  توضیحات پروژه <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="شرح مختصری از اهداف، سناریو و دستاورد پروژه..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white focus:border-purple-500 focus:outline-none resize-none"
                />
              </div>

              {/* Tags Manager */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  تگ‌ها و کلیدواژه‌ها
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="نام تگ (مثال: Midjourney)"
                    className="flex-1 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white focus:border-purple-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white"
                  >
                    افزودن تگ
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(formData.tags || []).map((t, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-purple-950/60 text-purple-200 border border-purple-800/40"
                    >
                      <span>#{t}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(t)}
                        className="hover:text-rose-300"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats Inputs */}
              <div className="p-3 rounded-2xl bg-black/30 border border-white/5 space-y-3">
                <span className="text-xs font-semibold text-cyan-300 block">
                  شاخص‌ها و آمارهای کلیدی پروژه
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">عنوان شاخص ۱</label>
                    <input
                      type="text"
                      value={formData.stats?.[0]?.label || ''}
                      onChange={(e) => {
                        const updated = [...(formData.stats || [])];
                        updated[0] = { ...updated[0], label: e.target.value, value: updated[0]?.value || '' };
                        setFormData({ ...formData, stats: updated });
                      }}
                      placeholder="مثال: نرخ بازدید"
                      className="w-full px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/10 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">مقدار شاخص ۱</label>
                    <input
                      type="text"
                      value={formData.stats?.[0]?.value || ''}
                      onChange={(e) => {
                        const updated = [...(formData.stats || [])];
                        updated[0] = { ...updated[0], label: updated[0]?.label || '', value: e.target.value };
                        setFormData({ ...formData, stats: updated });
                      }}
                      placeholder="مثال: +۲۵۰K"
                      className="w-full px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/10 text-xs text-white font-mono"
                    />
                  </div>
                </div>
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
                  ذخیره نمونه‌کار
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
