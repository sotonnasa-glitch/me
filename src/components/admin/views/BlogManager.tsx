import React, { useState } from 'react';
import {
  Newspaper,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  Video,
  Image as ImageIcon,
  Tag,
  Clock,
  Sparkles,
  ExternalLink,
  Check,
  X,
  Play,
  Share2
} from 'lucide-react';
import { useSiteData } from '../../../context/SiteDataContext';
import { BlogPost } from '../../../types';

export const BlogManager: React.FC = () => {
  const { blogPosts, addBlogPost, updateBlogPost, deleteBlogPost } = useSiteData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isCreatingModal, setIsCreatingModal] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [previewPost, setPreviewPost] = useState<BlogPost | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'هوش مصنوعی',
    author: 'تیم هوش مصنوعی تکویکس',
    readTime: '۵ دقیقه',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    videoUrl: '',
    videoDuration: '',
    tags: 'هوش_مصنوعی, وب۳, فناوری, اتوماسیون',
    featured: false,
  });

  const categories = [
    { id: 'all', label: 'همه دسته‌ها' },
    { id: 'هوش مصنوعی', label: 'هوش مصنوعی' },
    { id: 'طراحی وب', label: 'طراحی وب و UI' },
    { id: 'اتوماسیون', label: 'اتوماسیون و رباتیک' },
    { id: 'آموزش', label: 'آموزش و مقالات' },
  ];

  const filteredPosts = blogPosts.filter((post) => {
    const q = (searchQuery || '').toLowerCase().trim();
    const title = (post.title || '').toLowerCase();
    const excerpt = (post.excerpt || '').toLowerCase();
    const tagsMatch = Array.isArray(post.tags) && post.tags.some((t) => (t || '').toLowerCase().includes(q));
    const matchesSearch = !q || title.includes(q) || excerpt.includes(q) || tagsMatch;
    const matchesCat = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleOpenCreate = () => {
    setFormData({
      title: '',
      slug: `post-${Date.now()}`,
      excerpt: '',
      content: '',
      category: 'هوش مصنوعی',
      author: 'تیم هوش مصنوعی تکویکس',
      readTime: '۴ دقیقه',
      coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      videoUrl: '',
      videoDuration: '',
      tags: 'هوش_مصنوعی, نوآوری, طراحی_سایت',
      featured: false,
    });
    setEditingPost(null);
    setIsCreatingModal(true);
  };

  const handleOpenEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      author: post.author,
      readTime: post.readTime,
      coverImage: post.coverImage || '',
      videoUrl: post.videoUrl || '',
      videoDuration: post.videoDuration || '',
      tags: (post.tags || []).join(', '),
      featured: post.featured || false,
    });
    setIsCreatingModal(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    const tagArray = formData.tags
      .split(/[,،]/)
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    if (editingPost) {
      updateBlogPost(editingPost.id, {
        title: formData.title,
        slug: formData.slug || `post-${Date.now()}`,
        excerpt: formData.excerpt,
        content: formData.content,
        category: formData.category,
        author: formData.author,
        readTime: formData.readTime,
        coverImage: formData.coverImage,
        videoUrl: formData.videoUrl || undefined,
        videoDuration: formData.videoDuration || undefined,
        tags: tagArray,
        featured: formData.featured,
      });
    } else {
      addBlogPost({
        title: formData.title,
        slug: formData.slug || `post-${Date.now()}`,
        excerpt: formData.excerpt,
        content: formData.content,
        category: formData.category,
        author: formData.author,
        readTime: formData.readTime,
        coverImage: formData.coverImage,
        videoUrl: formData.videoUrl || undefined,
        videoDuration: formData.videoDuration || undefined,
        tags: tagArray,
        featured: formData.featured,
      });
    }

    setIsCreatingModal(false);
    setEditingPost(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              مدیریت بلاگ، مقالات و ویدیوها (CMS)
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-pink-950 border border-pink-500/30 text-pink-300 text-xs font-semibold">
              Content Engine
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            انتشار و ویرایش مقالات، افزودن ویدیوهای آموزشی، تگ‌های هشتگ و نمایش محتوا در ویترین سایت.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>نگارش مقاله / ویدیوی جدید</span>
        </button>
      </div>

      {/* Toolbar: Search and Filter */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-[#09090b] p-3.5 rounded-2xl border border-zinc-800">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-zinc-400 absolute start-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجو در مقالات، تگ‌ها، محتوا..."
            className="w-full ps-9 pe-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Posts Grid */}
      {filteredPosts.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#09090b] border border-zinc-800 text-zinc-400">
          <Newspaper className="w-12 h-12 mx-auto mb-3 text-zinc-600" />
          <p className="text-sm font-semibold text-zinc-300">مقاله‌ای یافت نشد.</p>
          <p className="text-xs text-zinc-500 mt-1">با کلیک روی «نگارش مقاله جدید» اولین پست را ایجاد کنید.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="rounded-2xl bg-[#09090b] border border-zinc-800 overflow-hidden shadow-md hover:border-zinc-700 transition-all flex flex-col justify-between group"
            >
              {/* Media Thumbnail */}
              <div className="relative h-48 bg-zinc-900 overflow-hidden">
                {post.coverImage ? (
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-zinc-950 text-zinc-600">
                    <ImageIcon className="w-10 h-10" />
                  </div>
                )}

                {/* Video Badge */}
                {post.videoUrl && (
                  <div className="absolute top-3 end-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold flex items-center gap-1.5 shadow-lg">
                    <Play className="w-3 h-3 fill-rose-500 text-rose-500" />
                    <span>دارای ویدیو ({post.videoDuration || 'آموزشی'})</span>
                  </div>
                )}

                {/* Category Badge */}
                <div className="absolute top-3 start-3 px-2.5 py-1 rounded-full bg-purple-950/80 backdrop-blur-md border border-purple-500/30 text-purple-300 text-[10px] font-semibold">
                  {post.category}
                </div>

                {post.featured && (
                  <div className="absolute bottom-3 start-3 px-2 py-0.5 rounded-md bg-amber-500/90 text-black text-[10px] font-extrabold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>ویژه</span>
                  </div>
                )}
              </div>

              {/* Content Info */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-zinc-500 mb-1.5">
                    <span>{post.author}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-white line-clamp-2 group-hover:text-purple-300 transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-xs text-zinc-400 line-clamp-2 mt-1.5 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                {/* Hashtags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {post.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-900 text-zinc-400 border border-zinc-800"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setPreviewPost(post)}
                    className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold border border-zinc-800 transition-colors flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>پیش‌نمایش</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(post)}
                      className="p-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition-colors"
                      title="ویرایش مقاله"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`آیا از حذف مقاله «${post.title}» مطمئن هستید؟`)) {
                          deleteBlogPost(post.id);
                        }
                      }}
                      className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors"
                      title="حذف مقاله"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>

            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {isCreatingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl bg-[#09090b] border border-zinc-800 p-6 sm:p-7 space-y-4 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-purple-400" />
                <span>{editingPost ? 'ویرایش مقاله و محتوا' : 'انتشار مقاله و ویدیوی جدید'}</span>
              </h2>
              <button
                type="button"
                onClick={() => setIsCreatingModal(false)}
                className="p-1.5 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4 text-xs">
              
              {/* Title & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    عنوان مقاله <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="مثال: آینده طراحی وب با هوش مصنوعی"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    نامک انگلیسی (Slug)
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="ai-web-design-future"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white focus:border-purple-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Category, Author & Read Time */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">دسته‌بندی</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white focus:border-purple-500 focus:outline-none cursor-pointer"
                  >
                    <option value="هوش مصنوعی">هوش مصنوعی</option>
                    <option value="طراحی وب">طراحی وب و UI</option>
                    <option value="اتوماسیون">اتوماسیون و رباتیک</option>
                    <option value="آموزش">آموزش و راهنما</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">نویسنده</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">زمان مطالعه</label>
                  <input
                    type="text"
                    value={formData.readTime}
                    onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                    placeholder="۵ دقیقه"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Image & Video Urls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    تصویر شاخص (URL)
                  </label>
                  <input
                    type="text"
                    value={formData.coverImage}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white focus:border-purple-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    لینک ویدیوی آپارات یا یوتیوب (اختیاری)
                  </label>
                  <input
                    type="text"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    placeholder="https://aparat.com/v/... یا https://youtube.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white focus:border-purple-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  خلاصه و چکیده مقاله <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="خلاصه جذاب و ۱ الی ۲ خطی از مقاله برای نمایش در کارت..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white focus:border-purple-500 focus:outline-none resize-none"
                />
              </div>

              {/* Full Content */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  متن کامل مقاله <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows={6}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="متن کامل و بندهای مقاله، نکات آموزشی و راهنما..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white focus:border-purple-500 focus:outline-none leading-relaxed"
                />
              </div>

              {/* Tags & Featured */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    هشتگ‌ها و برچسب‌ها (با ویرگول جدا کنید)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="هوش_مصنوعی, طراحی_سایت, تلگرام, فناوری"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-4">
                  <input
                    type="checkbox"
                    id="post-featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded bg-zinc-900 border-zinc-700 text-purple-600 focus:ring-0 w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="post-featured" className="text-xs text-zinc-300 cursor-pointer font-medium">
                    مقاله ویژه و پیشنهادی
                  </label>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsCreatingModal(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold border border-zinc-800"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-600/30"
                >
                  {editingPost ? 'ذخیره ویرایش مقاله' : 'انتشار در سایت'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl bg-[#09090b] border border-zinc-800 p-6 sm:p-7 space-y-4 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <span className="text-xs font-semibold text-purple-400">{previewPost.category}</span>
              <button
                type="button"
                onClick={() => setPreviewPost(null)}
                className="p-1 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {previewPost.coverImage && (
              <img
                src={previewPost.coverImage}
                alt={previewPost.title}
                className="w-full h-56 object-cover rounded-xl"
              />
            )}

            <h2 className="text-lg sm:text-xl font-bold text-white">{previewPost.title}</h2>
            
            <div className="flex items-center gap-3 text-xs text-zinc-400">
              <span>نویسنده: {previewPost.author}</span>
              <span>•</span>
              <span>زمان مطالعه: {previewPost.readTime}</span>
            </div>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed bg-zinc-950 p-4 rounded-xl border border-zinc-800 whitespace-pre-line">
              {previewPost.content}
            </p>

            {previewPost.tags && previewPost.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {previewPost.tags.map((t, idx) => (
                  <span key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-zinc-900 text-purple-300 border border-zinc-800 font-medium">
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
