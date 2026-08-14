import React, { useState } from 'react';
import {
  HelpCircle,
  Plus,
  Edit2,
  Trash2,
  Sparkles,
  X,
  ChevronDown
} from 'lucide-react';
import { useSiteData } from '../../../context/SiteDataContext';
import { FAQItem } from '../../../types';

export const FAQManager: React.FC = () => {
  const { faqs, addFAQ, updateFAQ, deleteFAQ } = useSiteData();

  const [editingItem, setEditingItem] = useState<FAQItem | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  const [formData, setFormData] = useState<Partial<FAQItem>>({
    question: '',
    answer: '',
    category: 'general',
  });

  const categories = [
    { id: 'general', label: 'عمومی' },
    { id: 'pricing', label: 'قیمت و تعرفه' },
    { id: 'process', label: 'مراحل و زمان‌بندی' },
    { id: 'support', label: 'پشتیبانی و تحویل' },
  ];

  const handleStartCreate = () => {
    setEditingItem(null);
    setFormData({
      question: '',
      answer: '',
      category: 'general',
    });
    setIsCreatingNew(true);
  };

  const handleStartEdit = (item: FAQItem) => {
    setIsCreatingNew(false);
    setEditingItem(item);
    setFormData({ ...item });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.question || !formData.answer) return;

    if (isCreatingNew) {
      addFAQ({
        question: formData.question || '',
        answer: formData.answer || '',
        category: formData.category || 'general',
      });
      setIsCreatingNew(false);
    } else if (editingItem) {
      updateFAQ(editingItem.id, {
        question: formData.question,
        answer: formData.answer,
        category: formData.category,
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
            <HelpCircle className="w-5 h-5 text-emerald-400" />
            <span>مدیریت سوالات متداول (FAQ)</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            پاسخ به سوالات پرتکرار و ابهامات مشتریان را مدیریت و ویرایش کنید.
          </p>
        </div>

        <button
          type="button"
          onClick={handleStartCreate}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs sm:text-sm font-bold shadow-[0_0_15px_rgba(147,51,234,0.4)] transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>افزودن سوال جدید</span>
        </button>
      </div>

      {/* FAQs List */}
      <div className="space-y-3">
        {faqs.map((faq, idx) => (
          <div
            key={faq.id}
            className="rounded-2xl bg-[#0d0922] border border-purple-900/30 p-5 hover:border-purple-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded">
                  Q{idx + 1}
                </span>
                <h3 className="text-sm font-bold text-white">{faq.question}</h3>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed ps-7 line-clamp-2">
                {faq.answer}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0 ps-7 sm:ps-0">
              <button
                type="button"
                onClick={() => handleStartEdit(faq)}
                className="px-3 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 text-xs font-semibold flex items-center gap-1"
              >
                <Edit2 className="w-3 h-3" />
                <span>ویرایش</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirm('آیا از حذف این سوال اطمینان دارید؟')) {
                    deleteFAQ(faq.id);
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
          <div className="w-full max-w-lg rounded-3xl bg-[#0e0a24] border border-purple-500/40 p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <span>{isCreatingNew ? 'افزودن پرسش و پاسخ جدید' : 'ویرایش پرسش و پاسخ'}</span>
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
                  صورت سوال <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.question || ''}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder="مثال: زمان تحویل پروژه‌های ویدیویی چقدر است؟"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  دسته‌بندی سوال
                </label>
                <select
                  value={formData.category || 'general'}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as FAQItem['category'] })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#15102d] border border-white/10 text-xs text-white focus:border-purple-500 focus:outline-none cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  پاسخ کامل و شفاف <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.answer || ''}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  placeholder="پاسخ کامل برای رفع ابهام کاربر..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white focus:border-purple-500 focus:outline-none resize-none"
                />
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
                  ذخیره سوال
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
