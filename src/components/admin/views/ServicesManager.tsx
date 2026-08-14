import React, { useState } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Star,
  Check,
  X,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock,
  DollarSign
} from 'lucide-react';
import { useSiteData } from '../../../context/SiteDataContext';
import { Service } from '../../../types';

export const ServicesManager: React.FC<{ isOpenAddModalDirectly?: boolean; onCloseDirectModal?: () => void }> = ({
  isOpenAddModalDirectly,
  onCloseDirectModal,
}) => {
  const {
    services,
    addService,
    updateService,
    deleteService,
    toggleServiceActive,
    toggleServicePopular,
  } = useSiteData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(isOpenAddModalDirectly || false);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<Service>>({
    title: '',
    category: 'web',
    categoryLabel: 'توسعه وب',
    iconName: 'Globe',
    badge: '',
    popular: false,
    active: true,
    shortDescription: '',
    fullDescription: '',
    deliverables: [''],
    estimatedPrice: '',
    deliveryDays: '',
  });

  const categories = [
    { id: 'all', label: 'همه دسته‌ها' },
    { id: 'web', label: 'توسعه وب' },
    { id: 'media', label: 'تصویر و رسانه' },
    { id: 'content', label: 'تولید محتوا و متن' },
    { id: 'bot', label: 'ربات تلگرام' },
    { id: 'custom', label: 'راهکارهای سفارشی' },
  ];

  const iconOptions = [
    'Globe',
    'Palette',
    'Clapperboard',
    'Music',
    'Mic',
    'PenTool',
    'Smartphone',
    'Bot',
    'Target',
    'Image',
    'Cpu',
    'Sparkles',
    'Zap',
    'Code',
    'Database'
  ];

  const filteredServices = services.filter((srv) => {
    const q = (searchQuery || '').toLowerCase().trim();
    const title = (srv.title || '').toLowerCase();
    const shortDesc = (srv.shortDescription || '').toLowerCase();
    const catLabel = (srv.categoryLabel || '').toLowerCase();
    const matchesSearch = !q || title.includes(q) || shortDesc.includes(q) || catLabel.includes(q);
    const matchesCat = selectedCategory === 'all' || srv.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleStartCreate = () => {
    setEditingService(null);
    setFormData({
      title: '',
      category: 'web',
      categoryLabel: 'توسعه وب',
      iconName: 'Globe',
      badge: '',
      popular: false,
      active: true,
      shortDescription: '',
      fullDescription: '',
      deliverables: ['تحویل سریع و تضمینی', 'پشتیبانی اختصاصی'],
      estimatedPrice: '',
      deliveryDays: '۲ تا ۴ روز کاری',
    });
    setIsCreatingNew(true);
  };

  const handleStartEdit = (srv: Service) => {
    setIsCreatingNew(false);
    setEditingService(srv);
    setFormData({
      ...srv,
      deliverables: srv.deliverables && srv.deliverables.length > 0 ? [...srv.deliverables] : [''],
    });
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim() || !formData.shortDescription?.trim()) {
      alert('لطفاً عنوان و توضیحات کوتاه خدمت را وارد کنید.');
      return;
    }

    const cleanDeliverables = (formData.deliverables || []).filter((d) => d.trim() !== '');

    if (isCreatingNew) {
      addService({
        title: formData.title || '',
        category: formData.category || 'web',
        categoryLabel:
          categories.find((c) => c.id === formData.category)?.label || 'توسعه هوش مصنوعی',
        iconName: formData.iconName || 'Globe',
        badge: formData.badge || '',
        popular: !!formData.popular,
        active: formData.active ?? true,
        shortDescription: formData.shortDescription || '',
        fullDescription: formData.fullDescription || formData.shortDescription || '',
        deliverables: cleanDeliverables.length > 0 ? cleanDeliverables : ['پشتیبانی ۲۴ ساعته'],
        estimatedPrice: formData.estimatedPrice,
        deliveryDays: formData.deliveryDays,
      });
      setIsCreatingNew(false);
      if (onCloseDirectModal) onCloseDirectModal();
    } else if (editingService) {
      updateService(editingService.id, {
        ...formData,
        deliverables: cleanDeliverables.length > 0 ? cleanDeliverables : ['پشتیبانی ۲۴ ساعته'],
      });
      setEditingService(null);
    }
  };

  const handleAddDeliverableField = () => {
    setFormData((prev) => ({
      ...prev,
      deliverables: [...(prev.deliverables || []), ''],
    }));
  };

  const handleDeliverableChange = (idx: number, val: string) => {
    const updated = [...(formData.deliverables || [])];
    updated[idx] = val;
    setFormData({ ...formData, deliverables: updated });
  };

  const handleRemoveDeliverable = (idx: number) => {
    const updated = (formData.deliverables || []).filter((_, i) => i !== idx);
    setFormData({ ...formData, deliverables: updated });
  };

  const confirmDelete = () => {
    if (serviceToDelete) {
      deleteService(serviceToDelete.id);
      setServiceToDelete(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Top Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-purple-900/30">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-400" />
            <span>مدیریت خدمات و محصولات تکویکس</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            ویرایش مشخصات، افزودن سرویس جدید، تغییر وضعیت نمایش در سایت و مدیریت پکیج‌ها.
          </p>
        </div>

        <button
          type="button"
          onClick={handleStartCreate}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold shadow-[0_0_20px_rgba(147,51,234,0.4)] transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>افزودن خدمت جدید</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-[#0b081e] p-3.5 rounded-2xl border border-purple-900/30">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute start-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجو در عنوان، دسته‌بندی..."
            className="w-full ps-9 pe-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Categories Tabs */}
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                selectedCategory === cat.id
                  ? 'bg-purple-600 text-white font-bold shadow-sm'
                  : 'bg-white/[0.03] text-gray-300 hover:bg-white/[0.08]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredServices.map((srv) => {
          const isActive = srv.active !== false;
          return (
            <div
              key={srv.id}
              className={`rounded-2xl border p-5 flex flex-col justify-between transition-all ${
                isActive
                  ? 'bg-[#0f0b24] border-purple-900/30 hover:border-purple-500/40 shadow-lg'
                  : 'bg-[#080512] border-white/5 opacity-60'
              }`}
            >
              {/* Card Header */}
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-purple-400 font-semibold uppercase tracking-wider block">
                        {srv.categoryLabel}
                      </span>
                      <h3 className="font-bold text-sm text-white">{srv.title}</h3>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex items-center gap-1">
                    {srv.badge && (
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-950 border border-purple-500/30 text-purple-200">
                        {srv.badge}
                      </span>
                    )}
                    {srv.popular && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-0.5">
                        <Star className="w-2.5 h-2.5 fill-amber-300" />
                        محبوب
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed line-clamp-3 mb-4">
                  {srv.shortDescription}
                </p>

                {/* Deliverables Preview */}
                {srv.deliverables && srv.deliverables.length > 0 && (
                  <div className="space-y-1 mb-4 pt-2 border-t border-white/5">
                    <span className="text-[10px] text-gray-400 block mb-1">اقلام تحویلی:</span>
                    <div className="flex flex-wrap gap-1">
                      {srv.deliverables.slice(0, 3).map((item, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] px-2 py-0.5 rounded bg-white/[0.03] text-gray-300 border border-white/5"
                        >
                          ✓ {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-purple-900/20 flex items-center justify-between gap-2">
                {/* Active / Inactive Toggle */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => toggleServiceActive(srv.id)}
                    className={`p-1.5 rounded-lg border transition-colors ${
                      isActive
                        ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25'
                        : 'bg-rose-500/15 border-rose-500/30 text-rose-300 hover:bg-rose-500/25'
                    }`}
                    title={isActive ? 'غیرفعال کردن در سایت' : 'فعال‌سازی در سایت'}
                  >
                    {isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleServicePopular(srv.id)}
                    className={`p-1.5 rounded-lg border transition-colors ${
                      srv.popular
                        ? 'bg-amber-500/20 border-amber-500/30 text-amber-300'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                    }`}
                    title="تغییر وضعیت محبوب"
                  >
                    <Star className={`w-3.5 h-3.5 ${srv.popular ? 'fill-amber-300' : ''}`} />
                  </button>
                </div>

                {/* Edit & Delete */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleStartEdit(srv)}
                    className="px-2.5 py-1 rounded-lg bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 hover:text-white text-xs font-semibold border border-purple-500/30 transition-colors flex items-center gap-1"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>ویرایش</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setServiceToDelete(srv)}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/20 transition-colors"
                    title="حذف خدمت"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal / Drawer for Creating & Editing Service */}
      {(isCreatingNew || editingService) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          role="dialog"
        >
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0e0a24] border border-purple-500/40 p-6 sm:p-8 shadow-[0_0_60px_rgba(147,51,234,0.3)] relative">
            
            {/* Close */}
            <button
              type="button"
              onClick={() => {
                setIsCreatingNew(false);
                setEditingService(null);
                if (onCloseDirectModal) onCloseDirectModal();
              }}
              className="absolute top-5 end-5 w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <span>{isCreatingNew ? 'افزودن خدمت جدید به تکویکس' : 'ویرایش مشخصات خدمت'}</span>
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                اطلاعات وارد شده مستقیماً در لندینگ‌پیج و فرم استعلام قیمت نمایش داده خواهد شد.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveForm} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Title */}
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    عنوان خدمت <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="مثال: تولید تیزر ویدیویی با هوش مصنوعی"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:border-purple-500 text-xs text-white focus:outline-none"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    دسته‌بندی <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={formData.category || 'web'}
                    onChange={(e) => {
                      const val = e.target.value as Service['category'];
                      const catObj = categories.find((c) => c.id === val);
                      setFormData({
                        ...formData,
                        category: val,
                        categoryLabel: catObj ? catObj.label : 'خدمات هوش مصنوعی',
                      });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#15102d] border border-white/10 focus:border-purple-500 text-xs text-white focus:outline-none cursor-pointer"
                  >
                    <option value="web">توسعه وب</option>
                    <option value="media">تصویر و رسانه</option>
                    <option value="content">تولید محتوا و متن</option>
                    <option value="bot">ربات تلگرام</option>
                    <option value="custom">راهکارهای سفارشی</option>
                  </select>
                </div>
              </div>

              {/* Badge & Icon */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    بج یا نشان تبلیغاتی (اختیاری)
                  </label>
                  <input
                    type="text"
                    value={formData.badge || ''}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="مثال: ترند روز، 4K، ویژه"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:border-purple-500 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    برآورد زمان تحویل
                  </label>
                  <input
                    type="text"
                    value={formData.deliveryDays || ''}
                    onChange={(e) => setFormData({ ...formData, deliveryDays: e.target.value })}
                    placeholder="مثال: ۲۴ تا ۴۸ ساعت"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:border-purple-500 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    آیکون خدمت
                  </label>
                  <select
                    value={formData.iconName || 'Globe'}
                    onChange={(e) => setFormData({ ...formData, iconName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#15102d] border border-white/10 focus:border-purple-500 text-xs text-white focus:outline-none cursor-pointer"
                  >
                    {iconOptions.map((ic) => (
                      <option key={ic} value={ic}>
                        {ic}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  توضیحات کوتاه (نمایش در کارت خدمت) <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.shortDescription || ''}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="مختصری از ویژگی‌ها و خروجی‌های این سرویس بنویسید..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:border-purple-500 text-xs text-white focus:outline-none resize-none"
                />
              </div>

              {/* Full Description */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  توضیحات تکمیلی (اختیاری)
                </label>
                <textarea
                  rows={2}
                  value={formData.fullDescription || ''}
                  onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                  placeholder="توضیحات کامل‌تر برای استعلام قیمت یا معرفی..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:border-purple-500 text-xs text-white focus:outline-none resize-none"
                />
              </div>

              {/* Deliverables / Features List */}
              <div className="p-3.5 rounded-2xl bg-black/30 border border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-purple-300">
                    اقلام تحویلی و ویژگی‌های کلیدی
                  </label>
                  <button
                    type="button"
                    onClick={handleAddDeliverableField}
                    className="text-[11px] text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1"
                  >
                    + افزودن مورد
                  </button>
                </div>

                <div className="space-y-2">
                  {(formData.deliverables || []).map((del, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={del}
                        onChange={(e) => handleDeliverableChange(idx, e.target.value)}
                        placeholder={`مورد تحویلی شماره ${idx + 1}`}
                        className="flex-1 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/10 text-xs text-white focus:border-purple-500 focus:outline-none"
                      />
                      {(formData.deliverables || []).length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveDeliverable(idx)}
                          className="p-1.5 text-gray-400 hover:text-rose-400"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Checkboxes: Active & Popular */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-200">
                  <input
                    type="checkbox"
                    checked={formData.active !== false}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="w-4 h-4 rounded text-purple-600 bg-white/5 border-white/20 focus:ring-purple-500"
                  />
                  <span>نمایش در سایت (فعال)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-200">
                  <input
                    type="checkbox"
                    checked={!!formData.popular}
                    onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                    className="w-4 h-4 rounded text-purple-600 bg-white/5 border-white/20 focus:ring-purple-500"
                  />
                  <span>علامت‌گذاری به عنوان سرویس پرمخاطب (محبوب)</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-purple-900/30">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingNew(false);
                    setEditingService(null);
                    if (onCloseDirectModal) onCloseDirectModal();
                  }}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-[0_0_20px_rgba(147,51,234,0.4)]"
                >
                  {isCreatingNew ? 'افزودن و انتشار در سایت' : 'ذخیره تغییرات'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {serviceToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          role="dialog"
        >
          <div className="w-full max-w-md rounded-2xl bg-[#0e0a24] border border-rose-500/40 p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-4 border border-rose-500/30">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">حذف خدمت از وب‌سایت؟</h3>
            <p className="text-xs text-gray-300 leading-relaxed mb-6">
              آیا از حذف خدمت «<span className="text-rose-300 font-bold">{serviceToDelete.title}</span>» اطمینان دارید؟ این خدمت از لیست صفحه اصلی حذف خواهد شد.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setServiceToDelete(null)}
                className="px-4 py-2 rounded-xl bg-white/5 text-gray-300 text-xs font-semibold"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg"
              >
                بله، حذف شود
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
