import React, { useState } from 'react';
import {
  MessageSquare,
  Send,
  Heart,
  Star,
  CheckCircle2,
  User,
  Sparkles,
  ShieldCheck,
  Clock,
  ThumbsUp
} from 'lucide-react';
import { useSiteData } from '../../context/SiteDataContext';
import { BlogComment } from '../../types';

interface BlogCommentsProps {
  postId: string;
  postTitle: string;
  onOpenAuthModal?: () => void;
}

export const BlogComments: React.FC<BlogCommentsProps> = ({
  postId,
  postTitle,
  onOpenAuthModal,
}) => {
  const { blogComments, addBlogComment, likeBlogComment, currentUser } = useSiteData();

  const [authorName, setAuthorName] = useState(currentUser?.name || '');
  const [authorEmail, setAuthorEmail] = useState(currentUser?.email || '');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

  const postComments = blogComments.filter((c) => c.postId === postId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const name = currentUser?.name || authorName.trim() || 'کاربر تکویکس';
    const email = currentUser?.email || authorEmail.trim() || undefined;
    const avatar =
      currentUser?.avatar ||
      `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`;

    setIsSubmitting(true);
    setTimeout(() => {
      addBlogComment({
        postId,
        authorName: name,
        authorEmail: email,
        authorAvatar: avatar,
        content: content.trim(),
        rating,
      });

      setContent('');
      if (!currentUser) {
        setAuthorName('');
        setAuthorEmail('');
      }
      setIsSubmitting(false);
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    }, 350);
  };

  const handleLike = (commentId: string) => {
    if (likedMap[commentId]) return;
    likeBlogComment(commentId);
    setLikedMap((prev) => ({ ...prev, [commentId]: true }));
  };

  return (
    <div className="space-y-6 pt-6 border-t border-zinc-800" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <MessageSquare className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span>دیدگاه‌ها و نظرات کاربران</span>
              <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-mono">
                {postComments.length}
              </span>
            </h3>
            <p className="text-[11px] text-zinc-400">
              نظر خود را در مورد این مقاله مطرح کنید تا دیگران نیز از تجربیات شما استفاده کنند.
            </p>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {showSuccessToast && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>دیدگاه شما با موفقیت ثبت و منتشر گردید!</span>
        </div>
      )}

      {/* Write Comment Form */}
      <form
        onSubmit={handleSubmit}
        className="p-4 sm:p-5 rounded-3xl bg-[#0c0820] border border-purple-500/30 space-y-4 shadow-lg shadow-purple-950/20"
      >
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-purple-200 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>ارسال دیدگاه جدید</span>
          </span>

          {currentUser ? (
            <div className="flex items-center gap-2 text-emerald-400 bg-emerald-950/50 px-2.5 py-1 rounded-full border border-emerald-500/30 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ارسال از حساب: {currentUser.name}</span>
            </div>
          ) : (
            onOpenAuthModal && (
              <button
                type="button"
                onClick={onOpenAuthModal}
                className="text-purple-400 hover:text-purple-200 text-[11px] font-semibold transition-colors cursor-pointer"
              >
                ورود با گوگل برای ثبت سریع‌تر
              </button>
            )
          )}
        </div>

        {/* Rating Stars Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-300">امتیاز شما به این مقاله:</span>
          <div className="flex items-center gap-1" dir="ltr">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`p-1 rounded-lg transition-transform hover:scale-110 cursor-pointer ${
                  rating >= star ? 'text-amber-400' : 'text-zinc-600 hover:text-zinc-400'
                }`}
              >
                <Star
                  className={`w-4 h-4 ${
                    rating >= star ? 'fill-amber-400 text-amber-400' : 'text-zinc-600'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Guest Input Fields if not logged in */}
        {!currentUser && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-zinc-400 mb-1 font-semibold">
                نام و نام‌خانوادگی <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="مثال: آرش اکبری"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-purple-900/40 text-xs text-white placeholder:text-zinc-600 focus:border-purple-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] text-zinc-400 mb-1 font-semibold">
                آدرس ایمیل یا آیدی تلگرام (اختیاری)
              </label>
              <input
                type="text"
                value={authorEmail}
                onChange={(e) => setAuthorEmail(e.target.value)}
                placeholder="email@example.com یا @username"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-purple-900/40 text-xs text-white placeholder:text-zinc-600 font-mono focus:border-purple-400 focus:outline-none text-left"
              />
            </div>
          </div>
        )}

        {/* Comment textarea */}
        <div>
          <label className="block text-[11px] text-zinc-400 mb-1 font-semibold">
            متن نظر و دیدگاه شما <span className="text-rose-400">*</span>
          </label>
          <textarea
            required
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="دیدگاه خود را درباره این آموزش یا راهکار بنویسید..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-purple-900/40 text-xs text-white placeholder:text-zinc-600 focus:border-purple-400 focus:outline-none resize-none leading-relaxed"
          />
        </div>

        {/* Submit button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || !content.trim()}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-600/30 flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send className="w-3.5 h-3.5 rotate-180" />
            <span>{isSubmitting ? 'در حال ثبت...' : 'ارسال و ثبت دیدگاه'}</span>
          </button>
        </div>
      </form>

      {/* List of Existing Comments */}
      <div className="space-y-3">
        {postComments.length === 0 ? (
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 text-center space-y-2">
            <MessageSquare className="w-8 h-8 text-zinc-600 mx-auto" />
            <p className="text-xs text-zinc-400">
              هنوز نظری برای این مقاله ثبت نشده است. اولین نفری باشید که دیدگاه خود را ارسال می‌کند!
            </p>
          </div>
        ) : (
          postComments.map((comment) => {
            const hasLiked = !!likedMap[comment.id];
            return (
              <div
                key={comment.id}
                className="p-4 rounded-2xl bg-[#09090b]/80 border border-zinc-800/90 hover:border-purple-500/30 transition-all space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        comment.authorAvatar ||
                        `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(
                          comment.authorName
                        )}`
                      }
                      alt={comment.authorName}
                      className="w-9 h-9 rounded-xl object-cover border border-purple-500/40 bg-zinc-900"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs sm:text-sm text-white">
                          {comment.authorName}
                        </span>
                        <span className="px-2 py-0.2 rounded-full bg-purple-900/40 text-purple-300 border border-purple-500/20 text-[10px]">
                          کاربر تایید شده
                        </span>
                      </div>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {new Date(comment.createdAt).toLocaleDateString('fa-IR')}
                      </span>
                    </div>
                  </div>

                  {/* Rating display */}
                  {comment.rating && (
                    <div className="flex items-center gap-0.5" dir="ltr">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < comment.rating!
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-zinc-700'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Comment Text */}
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed ps-12">
                  {comment.content}
                </p>

                {/* Likes action */}
                <div className="flex items-center justify-end gap-2 pt-1 border-t border-zinc-800/50">
                  <button
                    type="button"
                    onClick={() => handleLike(comment.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                      hasLiked
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800 border border-transparent'
                    }`}
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        hasLiked ? 'fill-rose-500 text-rose-500' : 'text-zinc-400'
                      }`}
                    />
                    <span className="font-mono text-[11px]">{comment.likesCount || 0}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
