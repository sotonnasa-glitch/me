import React from 'react';
import { X, RotateCcw, Check, Sparkles, Palette, Layout, Moon, Sun, Dices } from 'lucide-react';

export type AdminThemePreset = 'tekvix-purple' | 'cosmic-dark' | 'cyberpunk-cyan' | 'emerald-ai' | 'monochrome-zinc';
export type AdminRadius = '0' | '0.3' | '0.5' | '0.75' | '1.0';
export type AdminMode = 'dark' | 'light';

interface CustomizerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: AdminThemePreset;
  onSelectTheme: (theme: AdminThemePreset) => void;
  currentRadius: AdminRadius;
  onSelectRadius: (radius: AdminRadius) => void;
  currentMode: AdminMode;
  onSelectMode: (mode: AdminMode) => void;
  onReset: () => void;
}

export const CustomizerDrawer: React.FC<CustomizerDrawerProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme,
  currentRadius,
  onSelectRadius,
  currentMode,
  onSelectMode,
  onReset,
}) => {
  const [activeTab, setActiveTab] = React.useState<'theme' | 'layout'>('theme');

  if (!isOpen) return null;

  const themePresets: { id: AdminThemePreset; label: string; colors: string[] }[] = [
    { id: 'tekvix-purple', label: 'تکویکس بنفش (Default)', colors: ['#9333ea', '#6366f1', '#09090b'] },
    { id: 'cosmic-dark', label: 'کیهانی تاریک (Cosmic Dark)', colors: ['#a855f7', '#ec4899', '#05030f'] },
    { id: 'cyberpunk-cyan', label: 'سایبرپانک نئون (Cyber Cyan)', colors: ['#06b6d4', '#3b82f6', '#090d16'] },
    { id: 'emerald-ai', label: 'زمردی هوشمند (Emerald AI)', colors: ['#10b981', '#14b8a6', '#04130c'] },
    { id: 'monochrome-zinc', label: 'تایتانیوم مونوکروم (Zinc Slate)', colors: ['#71717a', '#27272a', '#09090b'] },
  ];

  const radiusOptions: { value: AdminRadius; label: string }[] = [
    { value: '0', label: '0' },
    { value: '0.3', label: '0.3' },
    { value: '0.5', label: '0.5' },
    { value: '0.75', label: '0.75' },
    { value: '1.0', label: '1.0' },
  ];

  const handleRandomTheme = () => {
    const nextThemes = themePresets.map((t) => t.id).filter((t) => t !== currentTheme);
    const random = nextThemes[Math.floor(Math.random() * nextThemes.length)];
    onSelectTheme(random);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 start-0 max-w-full flex pl-0 z-50">
        <div className="w-screen max-w-sm sm:max-w-md bg-[#0c0a1a] text-zinc-100 border-e border-zinc-800 shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Palette className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">سفارشی‌ساز قالب (Customizer)</h3>
                <p className="text-[11px] text-zinc-400">تنظیمات پوسته، گوشه‌ها و تم اختصاصی تکویکس</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={onReset}
                title="بازنشانی به پیش‌فرض"
                className="p-2 rounded-lg bg-zinc-800/60 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-lg bg-zinc-800/60 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs">
            
            {/* Tabs: Theme / Layout */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-zinc-900/90 rounded-xl border border-zinc-800">
              <button
                type="button"
                onClick={() => setActiveTab('theme')}
                className={`py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'theme'
                    ? 'bg-zinc-800 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span>پوسته و تم (Theme)</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('layout')}
                className={`py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'layout'
                    ? 'bg-zinc-800 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Layout className="w-3.5 h-3.5" />
                <span>چیدمان و ساختار (Layout)</span>
              </button>
            </div>

            {activeTab === 'theme' && (
              <div className="space-y-6">
                
                {/* Theme Presets */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-zinc-200">
                      پوسته‌های Shadcn UI (Presets)
                    </label>
                    <button
                      type="button"
                      onClick={handleRandomTheme}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-[11px] font-medium border border-zinc-700 transition-colors"
                    >
                      <Dices className="w-3 h-3" />
                      <span>تصادفی (Random)</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {themePresets.map((preset) => {
                      const isSelected = currentTheme === preset.id;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => onSelectTheme(preset.id)}
                          className={`w-full p-3 rounded-xl border flex items-center justify-between transition-all ${
                            isSelected
                              ? 'bg-zinc-900 border-purple-500 shadow-md ring-1 ring-purple-500/30'
                              : 'bg-zinc-950/60 border-zinc-800 hover:border-zinc-700 text-zinc-300'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="flex items-center -space-x-1.5">
                              {preset.colors.map((c, i) => (
                                <span
                                  key={i}
                                  className="w-3.5 h-3.5 rounded-full border border-black/40 shadow-sm"
                                  style={{ backgroundColor: c }}
                                />
                              ))}
                            </div>
                            <span className="text-xs font-medium text-white">{preset.label}</span>
                          </div>

                          {isSelected && <Check className="w-4 h-4 text-purple-400" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Radius Controls */}
                <div className="space-y-2.5 pt-2 border-t border-zinc-800">
                  <label className="text-xs font-semibold text-zinc-200 block">
                    شعاع انحنای کارت‌ها و دکمه‌ها (Radius)
                  </label>
                  <div className="grid grid-cols-5 gap-1.5">
                    {radiusOptions.map((opt) => {
                      const isSelected = currentRadius === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => onSelectRadius(opt.value)}
                          className={`py-2 rounded-lg text-xs font-mono font-bold border transition-all ${
                            isSelected
                              ? 'bg-purple-600 text-white border-purple-500 shadow-sm'
                              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Light / Dark Mode Toggle */}
                <div className="space-y-2.5 pt-2 border-t border-zinc-800">
                  <label className="text-xs font-semibold text-zinc-200 block">
                    حالت رنگی (Mode)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => onSelectMode('light')}
                      className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 font-medium transition-all ${
                        currentMode === 'light'
                          ? 'bg-zinc-800 text-white border-purple-500'
                          : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                      <span>روشن (Light)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onSelectMode('dark')}
                      className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 font-medium transition-all ${
                        currentMode === 'dark'
                          ? 'bg-zinc-800 text-white border-purple-500'
                          : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <Moon className="w-3.5 h-3.5 text-purple-400" />
                      <span>تاریک (Dark)</span>
                    </button>
                  </div>
                </div>

              </div>
            )}

            {activeTab === 'layout' && (
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                  <span className="text-xs font-semibold text-white block">پیکربندی چیدمان هوشمند</span>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    منوی داشبورد برای دستگاه‌های موبایل، تبلت و دسکتاپ بهینه شده و به صورت تمام‌صفحه و رسپانسیو تطبیق می‌یابد.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-200 block">
                    تراکم نمایش محتوا (Density)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-200 text-center font-semibold">
                      استاندارد (Comfortable)
                    </div>
                    <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 text-center font-medium opacity-60">
                      فشرده (Compact)
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Footer */}
          <div className="p-4 border-t border-zinc-800 bg-zinc-950/80 flex items-center justify-between">
            <button
              type="button"
              onClick={onReset}
              className="text-xs text-zinc-400 hover:text-white underline font-medium"
            >
              بازنشانی تنظیمات
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30"
            >
              اعمال و بستن
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
