// components/TestimonialsTicker.tsx
'use client';

export default function TestimonialsTicker() {
  const reviews = [
    { id: 1, name: 'محمد القحطاني', text: 'ما شاء الله، فحمات هافال أصلية 100% والوصول كان سريع.', car: 'هافال H6' },
    { id: 2, name: 'عبدالله الشمري', text: 'أسعار ممتازة جداً مقارنة بالوكالة، وتطابق برقم الهيكل كان دقيق.', car: 'جيلي كولراي' },
    { id: 3, name: 'صالح العمري', text: 'خدمة العملاء ساعدوني اعرف القطعة الصح، الله يرزقكم.', car: 'شيري تيجو 8' },
    { id: 4, name: 'فيصل العتيبي', text: 'أفضل متجر لقطع الغيار الصينية، التوصيل تم في نفس اليوم.', car: 'شانجان CS75' },
  ];

  return (
    <div className="bg-zinc-900 text-white py-4 overflow-hidden relative" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 mb-2 flex items-center justify-between">
        <span className="text-xs font-bold text-store-primary tracking-wider">💬 آراء العملاء الثقات</span>
        <span className="text-[10px] text-zinc-400">تقييم معتمد 4.9 / 5.0 ⭐</span>
      </div>

      {/* شريط متحرك بسلاسة (Ticker) */}
      <div className="flex w-full overflow-x-hidden relative">
        <div className="flex animate-marquee gap-6 whitespace-nowrap py-2">
          {/* نكرر القائمة مرتين لضمان استمرار الحركة بلا توقف (Infinite Loop) */}
          {[...reviews, ...reviews].map((review, index) => (
            <div
              key={`${review.id}-${index}`}
              className="bg-zinc-800/80 border border-zinc-700/50 px-5 py-3 rounded-2xl min-w-[280px] sm:min-w-[340px] shadow-sm flex flex-col gap-1 inline-block"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-white">{review.name}</span>
                <span className="text-[10px] bg-store-primary/20 text-store-primary px-2 py-0.5 rounded-md font-medium">
                  {review.car}
                </span>
              </div>
              <p className="text-xs text-zinc-300 whitespace-normal line-clamp-2">
                &ldquo;{review.text}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}