import React from 'react';
import {
  Bot,
  Camera,
  Code2,
  FileText,
  Image as ImageIcon,
  Mic2,
  Music2,
  Sparkles,
  Video,
  WandSparkles,
} from 'lucide-react';

const tools = [
  { name: 'ChatGPT', icon: Bot },
  { name: 'Gemini', icon: Sparkles },
  { name: 'Claude', icon: Bot },
  { name: 'Midjourney', icon: ImageIcon },
  { name: 'Runway', icon: Video },
  { name: 'Suno', icon: Music2 },
  { name: 'ElevenLabs', icon: Mic2 },
  { name: 'Canva AI', icon: WandSparkles },
  { name: 'Cursor', icon: Code2 },
  { name: 'Perplexity', icon: FileText },
  { name: 'Image AI', icon: Camera },
  { name: 'Video AI', icon: Video },
  { name: 'Voice AI', icon: Mic2 },
  { name: 'Music AI', icon: Music2 },
  { name: 'Prompt AI', icon: FileText },
  { name: 'Creative AI', icon: WandSparkles },
  { name: 'Code AI', icon: Code2 },
  { name: 'Design AI', icon: ImageIcon },
  { name: 'Automation AI', icon: Bot },
  { name: 'Content AI', icon: Sparkles },
];

export const AIPoweredToolsShowcase: React.FC = () => {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-5 sm:p-7">
      <div className="mb-6 text-center">
        <div className="inline-flex items-center gap-2 text-purple-300 text-sm font-medium">
          <Sparkles className="h-4 w-4" />
          <span>ابزارهای هوش مصنوعی مورد استفاده در تکویکس</span>
        </div>
        <p className="mt-2 text-xs sm:text-sm text-gray-400">
          مجموعه‌ای از ابزارهای نوین برای اجرای پروژه‌های خلاقانه و دیجیتال
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
        {tools.map(({ name, icon: Icon }) => (
          <div
            key={name}
            className="flex items-center gap-2 rounded-2xl border border-white/5 bg-white/[0.025] px-3 py-3 text-xs sm:text-sm text-gray-200"
          >
            <Icon className="h-4 w-4 shrink-0 text-purple-400" />
            <span className="truncate">{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIPoweredToolsShowcase;
