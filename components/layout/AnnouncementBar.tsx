// components/layout/AnnouncementBar.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';

interface AnnouncementBarProps {
  message?: string;
  badgeText?: string;
  newsItems?: string[];
  linkHref?: string;
  linkText?: string;
}

export default function AnnouncementBar({
  message,
  badgeText = 'عاجل',
  newsItems,
  linkHref = '/products',
  linkText = 'تسوق الآن ←',
}: AnnouncementBarProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  // تحديد محتوى الشريط (إذا تم إرسال message مفردة، أو استخدام مصفوفة newsItems، أو الافتراضي)
  const items = message
    ? [message]
    : newsItems || [
        '🎉 خصومات حصريّة بمناسبة الافتتاح! احصل على خصم 15% على جميع المنتجات.',
        '🚚 شحن مجاني وسريع لكافة الطلبات التي تتجاوز 200 ريال.',
        '⭐ تم إضافة تشكيلة جديدة من الأجهزة الذكية والإكسسوارات.',
      ];

  return (
    <div className="bg-zinc-950 text-white text-xs sm:text-sm py-2 px-4 relative z-50 overflow-hidden border-b border-zinc-800/80 shadow-md" dir="rtl">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* شارة العنوان الإخباري Thicker Badge */}
        <div className="flex items-center gap-2 shrink-0 z-10 bg-zinc-950 pl-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-store-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-store-primary"></span>
          </span>
          <span className="bg-store-primary text-white text-[11px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
            {badgeText}
          </span>
        </div>

        {/* الحاوية المتحركة (Marquee Loop) */}
        <div className="flex-1 overflow-hidden relative group">
          <div className="animate-marquee whitespace-nowrap flex items-center gap-12 group-hover:[animation-play-state:paused]">
            {/* تكرار المصفوفة لضمان استمرارية الحركة الأفقية بدون انقطاع */}
            {[...items, ...items].map((item, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-2 font-medium text-zinc-300"
              >
                <span>{item}</span>
                {linkHref && (
                  <Link
                    href={linkHref}
                    className="text-store-primary hover:underline font-bold transition-colors mr-2"
                  >
                    {linkText}
                  </Link>
                )}
                <span className="text-zinc-700 mr-8">•</span>
              </span>
            ))}
          </div>
        </div>

        {/* زر الإغلاق */}
        <button
          onClick={() => setIsVisible(false)}
          className="p-1 rounded-lg hover:bg-zinc-900 text-zinc-400 hover:text-white transition-all shrink-0 z-10 bg-zinc-950 pr-2 focus:outline-none cursor-pointer"
          aria-label="إغلاق الشريط"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}