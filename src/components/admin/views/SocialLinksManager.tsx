import React, { useState } from 'react';
import {
  Radio,
  Send,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  ExternalLink,
  Sparkles,
  RefreshCw,
  Eye,
  EyeOff,
  Globe,
  Share2,
  CheckCircle2
} from 'lucide-react';
import { useSiteData } from '../../../context/SiteDataContext';
import { SocialMediaLink } from '../../../types';

export const SocialLinksManager: React.FC = () => {
  const {
    socialLinks,
    updateSocialLink,
    addSocialLink,
    deleteSocialLink,
    resetSocialLinks,
  } = useSiteData();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<SocialMediaLink>>({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newForm, setNewForm] = useState<Omit<SocialMediaLink, 'id'>>({
    platform: 'telegram',
    title: '',
    handle: '',
    url: '',
    description: '',
    followersCount: '',
    badge: 'رسمی',
    enabled: true,
    orderIndex: socialLinks.length + 1,
  });

  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleStartEdit = (link: SocialMediaLink) => {
    setEditingId(link.id);
    setEditForm({ ...link });
  };

  const handleSaveEdit = (id: string) => {
    updateSocialLink(id, editForm);
    setEditingId(null);
    setEditForm({});
    showNotification('اطلاعات شبکه اجتماعی با موفقیت به‌روزرسانی شد.');
  };

  const handleCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newForm.title || !newForm.url) {
      alert('لطفاً عنوان و لینک را وارد کنید.');
      return;
    }
    addSocialLink(newForm);
    setIsAddModalOpen(false);
    setNewForm({
      platform: 'telegram',
      title: '',
      handle: '',
      url: '',
      description: '',
      followersCount: '',
      badge: 'رسمی',
      enabled: true,
      orderIndex: socialLinks.length + 1,
    });
    showNotification('شبکه اجتماعی جدید اضافه شد.');
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-zinc-900/90 border border-zinc-800">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">مدیریت شبکه‌های اجتماعی و کانال‌ها</h2>
            <p className="text-xs text-zinc-400 mt-1">
              تنظیم لینک‌های تلگرام، اینستاگرام، یوتیوب و شبکه‌های اجتماعی با لوگوهای متحرک دیجیتال
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={resetSocialLinks}
            className="px-3.5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="بازنشانی به پیش‌فرض"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>تنظیمات پیش‌فرض</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-purple-600/30 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>افزودن شبکه جدید</span>
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Social Links Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {socialLinks.map((link) => {
          const isEditing = editingId === link.id;

          return (
            <div
              key={link.id}
              className={`p-5 rounded-2xl border transition-all ${
                link.enabled
                  ? 'bg-zinc-900/70 border-zinc-800 hover:border-zinc-700'
                  : 'bg-zinc-900/30 border-zinc-800/50 opacity-60'
              }`}
            >
              {isEditing ? (
                /* Edit Mode */
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                    <span className="text-xs font-bold text-purple-400">ویرایش {link.title}</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(link.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>ذخیره</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs"
                      >
                        انصراف
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">عنوان فارسی</label>
                      <input
                        type="text"
                        value={editForm.title || ''}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">آیدی یا هندل</label>
                      <input
                        type="text"
                        value={editForm.handle || ''}
                        onChange={(e) => setEditForm({ ...editForm, handle: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">لینک مستقیم (URL)</label>
                    <input
                      type="text"
                      value={editForm.url || ''}
                      onChange={(e) => setEditForm({ ...editForm, url: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-xs font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">تعداد اعضا / فالوور</label>
                      <input
                        type="text"
                        value={editForm.followersCount || ''}
                        onChange={(e) => setEditForm({ ...editForm, followersCount: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-xs"
                        placeholder="مثال: 12.5k عضو"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">برچسب (بج)</label>
                      <input
                        type="text"
                        value={editForm.badge || ''}
                        onChange={(e) => setEditForm({ ...editForm, badge: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">توضیح کوتاه</label>
                    <input
                      type="text"
                      value={editForm.description || ''}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-xs"
                    />
                  </div>
                </div>
              ) : (
                /* View Mode */
                <div className="flex flex-col justify-between h-full space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-purple-400 font-bold">
                        {link.platform === 'telegram' && <Send className="w-5 h-5 rotate-180 text-sky-400" />}
                        {link.platform === 'instagram' && <span className="text-pink-400">IG</span>}
                        {link.platform === 'youtube' && <span className="text-red-400">YT</span>}
                        {link.platform === 'github' && <span className="text-white">GH</span>}
                        {link.platform === 'x' && <span className="text-sky-300">X</span>}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-white">{link.title}</h3>
                          {link.badge && (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                              {link.badge}
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-mono text-zinc-400 block mt-0.5">{link.handle}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => updateSocialLink(link.id, { enabled: !link.enabled })}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          link.enabled
                            ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30'
                            : 'bg-zinc-800 text-zinc-500 border-zinc-700'
                        }`}
                        title={link.enabled ? 'فعال (کلیک برای غیرفعال‌سازی)' : 'غیرفعال (کلیک برای نمایش)'}
                      >
                        {link.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStartEdit(link)}
                        className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 transition-colors"
                        title="ویرایش اطلاعات"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`آیا از حذف ${link.title} اطمینان دارید؟`)) {
                            deleteSocialLink(link.id);
                            showNotification('شبکه اجتماعی حذف شد.');
                          }
                        }}
                        className="p-1.5 rounded-lg bg-rose-950/30 hover:bg-rose-900/50 text-rose-400 border border-rose-800/40 transition-colors"
                        title="حذف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {link.description && (
                    <p className="text-xs text-zinc-400 line-clamp-2">{link.description}</p>
                  )}

                  <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
                    >
                      <span className="truncate max-w-[220px]">{link.url}</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    </a>

                    {link.followersCount && (
                      <span className="text-[11px] font-mono text-zinc-400 font-semibold">
                        {link.followersCount}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add New Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-zinc-900 border border-zinc-800 p-6 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 end-4 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-purple-400" />
              <span>افزودن شبکه اجتماعی یا کانال جدید</span>
            </h3>

            <form onSubmit={handleCreateNew} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">پلتفرم</label>
                  <select
                    value={newForm.platform}
                    onChange={(e) =>
                      setNewForm({ ...newForm, platform: e.target.value as SocialMediaLink['platform'] })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-xs"
                  >
                    <option value="telegram">تلگرام (Telegram)</option>
                    <option value="instagram">اینستاگرام (Instagram)</option>
                    <option value="youtube">یوتیوب (YouTube)</option>
                    <option value="github">گیت‌هاب (GitHub)</option>
                    <option value="x">توییتر / X</option>
                    <option value="website">وب‌سایت / دیگر</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">عنوان فارسی</label>
                  <input
                    type="text"
                    required
                    value={newForm.title}
                    onChange={(e) => setNewForm({ ...newForm, title: e.target.value })}
                    placeholder="مثال: کانال اخبار هوش مصنوعی"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">آیدی / هندل</label>
                  <input
                    type="text"
                    value={newForm.handle}
                    onChange={(e) => setNewForm({ ...newForm, handle: e.target.value })}
                    placeholder="@Lawat_kar"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">آمار اعضا</label>
                  <input
                    type="text"
                    value={newForm.followersCount}
                    onChange={(e) => setNewForm({ ...newForm, followersCount: e.target.value })}
                    placeholder="مثال: 5.4K دنبال‌کننده"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1">لینک مستقیم (URL)</label>
                <input
                  type="url"
                  required
                  value={newForm.url}
                  onChange={(e) => setNewForm({ ...newForm, url: e.target.value })}
                  placeholder="https://t.me/Lawat_kar"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-400 mb-1">توضیحات</label>
                <textarea
                  rows={2}
                  value={newForm.description}
                  onChange={(e) => setNewForm({ ...newForm, description: e.target.value })}
                  placeholder="توضیح کوتاه درباره این کانال یا پیج..."
                  className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold"
                >
                  افزودن شبکه
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
