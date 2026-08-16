import React, { useState } from 'react';
import {
  MessageSquare,
  Star,
  Sparkles,
  CheckCircle2,
  Heart,
  Send,
  User,
  ShieldCheck,
  Plus,
  Filter,
  Check,
  TrendingUp,
  Award,
  ThumbsUp,
  CornerDownLeft
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { SiteReview } from '../types';

interface CustomerReviewsSectionProps {
  onOpenAuthModal?: () => void;
}

export const CustomerReviewsSection: React.FC<CustomerReviewsSectionProps> = ({
  onOpenAuthModal,
}) => {
  const { siteReviews, addSiteReview, likeSiteReview, currentUser, brandInfo } = useSiteData();

  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<string | null>(null);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

  // Review Form state
  const [name, setName] = useState(currentUser?.name || '');
  const [role, setRole] = useState(currentUser?.bio || '');
  const [projectTitle, setProjectTitle] = useState('طراحی وب‌سایت و هوش مصنوعی');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { id: 'all', label: 'همه نظرات' },
    { id: '5star', label: '⭐ ۵ ستاره' },
    { id: 'website', label: 'طراحی وب‌سایت' },
    { id: 'ai', label: 'هوش مصنوعی' },
    { id: 'bot', label: 'ربات تلگرام' },
  ];

  const filteredReviews = siteReviews.filter((rev) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === '5star') return rev.rating === 5;
    if (activeFilter === 'website') return rev.projectTitle?.includes('سایت') || rev.projectTitle?.includes('وب');
    if (activeFilter === 'ai') return rev.projectTitle?.includes('هوش مصنوعی') || rev.content.includes('هوش مصنوعی');
    if (activeFilter === 'bot') return rev.projectTitle?.includes('تلگرام') || rev.projectTitle?.includes('ربات');
    return true;
  });

  const averageRating = (
    siteReviews.reduce((acc, curr) => acc + curr.rating, 0) / (siteReviews.length || 1)
  ).toFixed(1);

  const fiveStarCount = siteReviews.filter((r) => r.rating === 5).length;
  const satisfactionRate = Math.round((fiveStarCount / (siteReviews.length || 1)) * 100);

  const handleLike = (reviewId: string) => {
    if (likedMap[reviewId]) return;
    likeSiteReview(reviewId);
    setLikedMap((prev) => ({ ...prev, [reviewId]: true }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    const reviewerName = currentUser?.name || name.trim() || 'کاربر تکویکس';
    const reviewerAvatar =
      currentUser?.avatar ||
      `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(reviewerName)}`;

    setTimeout(() => {
      addSiteReview({
        userName: reviewerName,
        userAvatar: reviewerAvatar,
        userRole: role.trim() || 'مشتری رضایتمند',
        projectTitle: projectTitle.trim() || 'سفارش آنلاین',
        rating,
        content: content.trim(),
        verified: true,
        reply: 'با تشکر از حسن نظر و همکاری ارزشمند شما با پلتفرم تکویکس 🙏',
      });

      setContent('');
      if (!currentUser) {
        setName('');
        setRole('');
      }
      setIsSubmitting(false);
      setIsFormOpen(false);
      setShowToast('نظر و تجربه شما با موفقیت ثبت شد و نمایش داده می‌شود!');
      setTimeout(() => setShowToast(null), 3500);
    }, 400);
  };

  return (
    <section id="reviews" className="py-24 sm:py-32 relative bg-[#060411] overflow-hidden border-t border-purple-900/30" dir="rtl">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 start-1/4 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 end-10 w-[450px] h-[450px] bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-300 text-xs font-semibold">
            <Award className="w-3.5 h-3.5 text-purple-400" />
            <span>نظرات و بازخوردهای واقعی مشتریان</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            مرکز نظرات، امتیازات و تجربیات همکاری با {brandInfo.name || 'تکویکس'}
          </h2>

          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
            شفافیت و کیفیت اولویت ماست. نظر کاربران و صاحبان کسب‌وکاری که پروژه‌های وب، ربات تلگرام و تولید محتوای خود را به ما سپردند بخوانید یا تجربه خود را ثبت کنید.
          </p>
        </div>

        {/* Global Toast */}
        {showToast && (
          <div className="max-w-xl mx-auto p-4 rounded-2xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 text-xs sm:text-sm font-bold flex items-center gap-2.5 shadow-xl animate-in fade-in slide-in-from-top-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{showToast}</span>
          </div>
        )}

        {/* Rating Scoreboard Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#120a2e]/90 via-[#0d0724]/90 to-[#120a2e]/90 border border-purple-500/30 shadow-2xl backdrop-blur-xl">
          {/* Total score box */}
          <div className="flex items-center gap-5 justify-center md:justify-start border-b md:border-b-0 md:border-e border-purple-900/40 pb-5 md:pb-0 md:pe-6">
            <div className="text-4xl sm:text-5xl font-black text-white font-mono flex items-baseline gap-1">
              <span>{averageRating}</span>
              <span className="text-sm text-zinc-500">/۵</span>
            </div>
            <div>
              <div className="flex items-center gap-1 text-amber-400" dir="ltr">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <span className="text-xs text-zinc-400 mt-1 block">
                بر اساس {siteReviews.length} نظر ثبت شده
              </span>
            </div>
          </div>

          {/* Satisfaction rate */}
          <div className="flex items-center gap-4 justify-center border-b md:border-b-0 md:border-e border-purple-900/40 pb-5 md:pb-0 md:pe-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <span className="text-lg font-black text-white">{satisfactionRate}٪ رضایت کامل</span>
              <span className="text-xs text-zinc-400 block">پروژه‌های تحویل شده به موقع</span>
            </div>
          </div>

          {/* Add Review Action */}
          <div className="flex items-center justify-center md:justify-end">
            <button
              type="button"
              onClick={() => setIsFormOpen((prev) => !prev)}
              className="w-full md:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isFormOpen ? 'بستن فرم ثبت نظر' : 'ثبت دیدگاه و امتیاز شما'}</span>
            </button>
          </div>
        </div>

        {/* Collapsible Write Review Form */}
        {isFormOpen && (
          <form
            onSubmit={handleFormSubmit}
            className="p-6 sm:p-8 rounded-3xl bg-[#0e0927] border border-purple-400/40 shadow-2xl space-y-5 animate-in fade-in slide-in-from-top-4"
          >
            <div className="flex items-center justify-between border-b border-purple-900/40 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm sm:text-base font-bold text-white">
                  فرم ثبت تجربه و نظر درباره خدمات تکویکس
                </h3>
              </div>

              {currentUser ? (
                <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>ثبت با حساب گوگل ({currentUser.name})</span>
                </div>
              ) : (
                onOpenAuthModal && (
                  <button
                    type="button"
                    onClick={onOpenAuthModal}
                    className="text-purple-400 hover:text-purple-200 text-xs font-semibold cursor-pointer"
                  >
                    ورود با گوگل برای تایید نشان هویت
                  </button>
                )
              )}
            </div>

            {/* Star Rating selector */}
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-xs font-bold text-gray-200">میزان رضایت و امتیاز:</span>
              <div className="flex items-center gap-1.5" dir="ltr">
                {[1, 2, 3, 4, 5].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setRating(st)}
                    className="p-1.5 rounded-xl hover:bg-purple-900/30 transition-all cursor-pointer"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        rating >= st
                          ? 'fill-amber-400 text-amber-400 scale-110'
                          : 'text-zinc-600 hover:text-zinc-400'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs text-amber-300 font-bold">
                {rating === 5 ? 'عالی و فراتر از انتظار (۵/۵)' : `${rating} از ۵`}
              </span>
            </div>

            {/* Details Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">
                  نام و نام‌خانوادگی <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مهدی حاتمی"
                  disabled={!!currentUser}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-purple-900/50 text-xs text-white placeholder:text-zinc-600 focus:border-purple-400 focus:outline-none disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">
                  سمت یا نام برند / حوزه کاری
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="مثال: مدیر فروشگاه اینترنتی"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-purple-900/50 text-xs text-white placeholder:text-zinc-600 focus:border-purple-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">
                  نوع پروژه دریافت شده
                </label>
                <select
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-purple-900/50 text-xs text-white focus:border-purple-400 focus:outline-none cursor-pointer"
                >
                  <option value="طراحی سایت هوشمند و سئو">طراحی سایت هوشمند و سئو</option>
                  <option value="طراحی و توسعه ربات تلگرام اختصاصی">طراحی و توسعه ربات تلگرام اختصاصی</option>
                  <option value="تولید محتوا و ویدیو با هوش مصنوعی">تولید محتوا و ویدیو با هوش مصنوعی</option>
                  <option value="مشاوره تخصصی هوش مصنوعی">مشاوره تخصصی هوش مصنوعی</option>
                  <option value="اتوماسیون کسب‌وکار">اتوماسیون کسب‌وکار</option>
                </select>
              </div>
            </div>

            {/* Comment Body */}
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">
                توضیحات و بازخورد شما درباره کیفیت کار، زمان تحویل و پشتیبانی <span className="text-rose-400">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="تجربه همکاری با تیم تکویکس چطور بود؟ چه نقاط قوتی دیدید؟"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-purple-900/50 text-xs text-white placeholder:text-zinc-600 focus:border-purple-400 focus:outline-none resize-none leading-relaxed"
              />
            </div>

            {/* Submit Action */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold transition-colors cursor-pointer"
              >
                انصراف
              </button>

              <button
                type="submit"
                disabled={isSubmitting || !content.trim()}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-purple-600/30 flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5 rotate-180" />
                <span>{isSubmitting ? 'در حال ثبت...' : 'انتشار عمومی نظر'}</span>
              </button>
            </div>
          </form>
        )}

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveFilter(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeFilter === cat.id
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 font-bold scale-105'
                  : 'bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Reviews Masonry / Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((rev) => {
            const isLiked = !!likedMap[rev.id];
            return (
              <div
                key={rev.id}
                className="p-6 rounded-3xl bg-[#09071a]/90 border border-purple-900/40 hover:border-purple-500/50 shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  {/* Top Bar: Reviewer info & Star Rating */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={rev.userAvatar}
                        alt={rev.userName}
                        className="w-11 h-11 rounded-2xl object-cover border border-purple-400/40 bg-zinc-900 shadow-md"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-white text-sm sm:text-base">
                            {rev.userName}
                          </span>
                          {rev.verified && (
                            <CheckCircle2 className="w-4 h-4 text-purple-400" title="مشتری احراز هویت شده" />
                          )}
                        </div>
                        <span className="text-xs text-purple-300/80 block">
                          {rev.userRole}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-0.5 text-amber-400 shrink-0" dir="ltr">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating ? 'fill-amber-400' : 'text-zinc-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Project Tag Badge */}
                  {rev.projectTitle && (
                    <div className="inline-block px-3 py-1 rounded-lg bg-purple-950/60 border border-purple-500/30 text-[11px] font-bold text-purple-300">
                      پروژه: {rev.projectTitle}
                    </div>
                  )}

                  {/* Comment Body */}
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
                    «{rev.content}»
                  </p>

                  {/* Official Tekvix Reply if present */}
                  {rev.reply && (
                    <div className="p-3.5 rounded-2xl bg-purple-950/30 border border-purple-500/20 text-xs text-purple-200 space-y-1 mt-2">
                      <div className="flex items-center gap-1.5 font-bold text-purple-300 text-[11px]">
                        <CornerDownLeft className="w-3.5 h-3.5" />
                        <span>پاسخ پشتیبانی تکویکس:</span>
                      </div>
                      <p className="text-zinc-300 text-[11px] leading-relaxed ps-5">
                        {rev.reply}
                      </p>
                    </div>
                  )}
                </div>

                {/* Card Footer: Date & Like Counter */}
                <div className="pt-3 border-t border-purple-900/30 flex items-center justify-between text-xs text-zinc-500 font-mono">
                  <span>{new Date(rev.createdAt).toLocaleDateString('fa-IR')}</span>

                  <button
                    type="button"
                    onClick={() => handleLike(rev.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isLiked
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                    }`}
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        isLiked ? 'fill-rose-500 text-rose-500' : 'text-zinc-400'
                      }`}
                    />
                    <span>{rev.likesCount || 0}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
