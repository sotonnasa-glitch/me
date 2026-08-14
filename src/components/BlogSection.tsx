import React, { useState } from 'react';
import {
  Newspaper,
  Play,
  Clock,
  User,
  Tag,
  ArrowLeft,
  X,
  Share2,
  Sparkles,
  ExternalLink,
  ChevronLeft,
  Eye,
  Check
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { BlogPost } from '../types';
import { UniversalBackButton } from './common/UniversalBackButton';

interface BlogSectionProps {
  onOpenOrderModal?: (serviceId?: string) => void;
}

export const BlogSection: React.FC<BlogSectionProps> = ({ onOpenOrderModal }) => {
  const { blogPosts, sectionsConfig } = useSiteData();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeArticle, setActiveArticle] = useState<BlogPost | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const sectionConfig = sectionsConfig.find((s) => s.key === 'blog' || s.id === 'blog');
  if (sectionConfig && !sectionConfig.enabled) {
    return null;
  }

  const categories = [
    { id: 'all', label: 'همه مقالات' },
    { id: 'هوش مصنوعی', label: 'هوش مصنوعی' },
    { id: 'طراحی وب', label: 'طراحی وب و UI' },
    { id: 'اتوماسیون', label: 'اتوماسیون' },
    { id: 'آموزش', label: 'آموزش و مقالات' },
  ];

  const filteredPosts = blogPosts.filter((post) => {
    if (selectedCategory === 'all') return true;
    return post.category === selectedCategory;
  });

  const handleShare = (post: BlogPost) => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${window.location.origin}#blog-${post.slug}`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <section id="blog" className="py-20 sm:py-24 relative overflow-hidden">
      
      {/* Background Subtle Ambient Glow */}
      <div className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-300 text-xs font-semibold">
            <Newspaper className="w-3.5 h-3.5 text-purple-400" />
            <span>{sectionConfig?.badgeText || 'بلاگ، مقالات و ویدیوهای آموزشی'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            {sectionConfig?.titleFa || 'جدیدترین بینش‌ها و مقالات هوش مصنوعی'}
          </h2>

          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            {sectionConfig?.subtitleFa || 'راهنماهای اختصاصی، تحلیل روندهای مدرن طراحی وب و ویدیوهای کاربردی در حوزه هوش مصنوعی و اتوماسیون.'}
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 font-bold scale-105'
                    : 'bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Posts Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              onClick={() => setActiveArticle(post)}
              className="group rounded-3xl bg-[#09090b]/80 border border-zinc-800/80 hover:border-purple-500/50 transition-all duration-300 overflow-hidden shadow-xl hover:shadow-purple-600/10 cursor-pointer flex flex-col justify-between"
            >
              {/* Media Thumbnail Container */}
              <div className="relative h-52 sm:h-56 bg-zinc-900 overflow-hidden">
                <img
                  src={post.coverImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'}
                  alt={post.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Video Play Badge */}
                {post.videoUrl && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-90 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-purple-600/90 text-white flex items-center justify-center shadow-lg shadow-purple-600/50 group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-white ms-0.5" />
                    </div>
                    {post.videoDuration && (
                      <span className="absolute bottom-3 end-3 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-sm text-[11px] font-mono font-bold text-white border border-white/10">
                        {post.videoDuration}
                      </span>
                    )}
                  </div>
                )}

                {/* Category Badge */}
                <div className="absolute top-3 start-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-purple-300 text-[11px] font-semibold">
                  {post.category}
                </div>

                {post.featured && (
                  <div className="absolute top-3 end-3 px-2.5 py-1 rounded-full bg-amber-500 text-black text-[10px] font-extrabold flex items-center gap-1 shadow-md">
                    <Sparkles className="w-3 h-3" />
                    <span>منتخب</span>
                  </div>
                )}
              </div>

              {/* Content Body */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-zinc-500" />
                      {post.author}
                    </span>
                    <span className="flex items-center gap-1 font-mono text-zinc-500">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-2 leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-zinc-400 line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                {/* Tags and Action */}
                <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1">
                    {post.tags && post.tags.slice(0, 2).map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 text-zinc-400 border border-zinc-800"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>

                  <span className="inline-flex items-center gap-1 text-xs font-bold text-purple-400 group-hover:text-purple-300 group-hover:-translate-x-1 transition-all">
                    <span>مطالعه مقاله</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </span>
                </div>

              </div>
            </article>
          ))}
        </div>

      </div>

      {/* Interactive Reader / Video Player Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
          <div className="w-full max-w-3xl rounded-3xl bg-[#09090b] border border-zinc-800 p-6 sm:p-8 space-y-6 shadow-2xl my-8 relative max-h-[90vh] overflow-y-auto">
            
            {/* Modal Top Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <UniversalBackButton
                onBack={() => setActiveArticle(null)}
                label="بازگشت به مقالات"
                variant="inline"
              />

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleShare(activeArticle)}
                  className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition-colors flex items-center gap-1.5 text-xs font-semibold"
                  title="اشتراک‌گذاری"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">کپی شد</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5" />
                      <span>اشتراک</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveArticle(null)}
                  className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Media Cover / Video Player Area */}
            {activeArticle.videoUrl ? (
              <div className="rounded-2xl overflow-hidden bg-black border border-zinc-800 aspect-video relative">
                <iframe
                  src={activeArticle.videoUrl.replace('watch?v=', 'embed/')}
                  title={activeArticle.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : activeArticle.coverImage ? (
              <div className="rounded-2xl overflow-hidden h-64 sm:h-80 border border-zinc-800">
                <img
                  src={activeArticle.coverImage}
                  alt={activeArticle.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : null}

            {/* Header info */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
                <span className="px-2.5 py-1 rounded-md bg-purple-950/80 border border-purple-500/30 text-purple-300 font-semibold">
                  {activeArticle.category}
                </span>
                <span>•</span>
                <span>نویسنده: <strong className="text-zinc-200">{activeArticle.author}</strong></span>
                <span>•</span>
                <span className="font-mono">زمان مطالعه: {activeArticle.readTime}</span>
              </div>

              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white leading-tight">
                {activeArticle.title}
              </h1>
            </div>

            {/* Excerpt Lead */}
            <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-900/30 text-xs sm:text-sm text-purple-200 leading-relaxed font-medium">
              {activeArticle.excerpt}
            </div>

            {/* Main Content Body */}
            <div className="text-xs sm:text-sm text-zinc-300 leading-loose space-y-4 whitespace-pre-line border-t border-zinc-800/80 pt-4">
              {activeArticle.content}
            </div>

            {/* Hashtags */}
            {activeArticle.tags && activeArticle.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {activeArticle.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-3 py-1 rounded-xl bg-zinc-900 text-purple-300 border border-zinc-800 font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* In-Article CTA Banner */}
            <div className="rounded-2xl bg-gradient-to-r from-purple-950/60 to-indigo-950/60 border border-purple-500/30 p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
              <div>
                <h4 className="font-bold text-sm sm:text-base text-white">
                  علاقه‌مند به اجرای این راهکار هوش مصنوعی در کسب‌وکار خود هستید؟
                </h4>
                <p className="text-xs text-zinc-400 mt-1">
                  مشاوران تیم فنی تکویکس آماده پاسخگویی و ثبت سفارش شما هستند.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setActiveArticle(null);
                  if (onOpenOrderModal) {
                    onOpenOrderModal('ai-website');
                  }
                }}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-purple-600/30 transition-all shrink-0"
              >
                ثبت سفارش آنلاین این خدمت
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
