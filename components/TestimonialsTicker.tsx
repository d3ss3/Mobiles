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
    <section className="bg-gradient-to-b from-zinc-950 to-zinc-900 text-white py-10 overflow-hidden relative border-y border-zinc-800/80" dir="rtl">
      {/* عنوان القسم والتقييم */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="w-3 h-3 rounded-full bg-store-primary animate-pulse"></span>
          <h2 className="text-base sm:text-lg font-black tracking-wide text-white">آراء وتجارب عملائنا المميزين</h2>
        </div>
        <div className="flex items-center gap-2 bg-zinc-900/90 px-4 py-2 rounded-2xl border border-zinc-800 shadow-inner">
          <span className="text-amber-400 text-xs">⭐⭐⭐⭐⭐</span>
          <span className="text-xs font-bold text-zinc-200">4.9 / 5.0</span>
        </div>
      </div>

      {/* شريط متحرك بسلاسة (Ticker) */}
      <div className="flex w-full overflow-x-hidden relative py-2">
        <div className="flex animate-marquee gap-6 whitespace-nowrap">
          {/* نكرر القائمة لضمان استمرار الحركة بلا توقف (Infinite Loop) */}
          {[...reviews, ...reviews].map((review, index) => (
            <div
              key={`${review.id}-${index}`}
              className="bg-zinc-900/90 hover:bg-zinc-850 border border-zinc-800 hover:border-store-primary/50 p-6 rounded-3xl min-w-[310px] sm:min-w-[390px] shadow-xl flex flex-col justify-between gap-4 transition-all duration-300 group"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-store-primary/15 text-store-primary font-black flex items-center justify-center text-sm border border-store-primary/30 shrink-0">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <span className="font-bold text-sm text-white block group-hover:text-store-primary transition-colors">{review.name}</span>
                    <span className="text-[11px] text-zinc-400 font-medium">عميل معتمد</span>
                  </div>
                </div>
                <span className="text-[11px] bg-store-primary/10 text-store-primary px-3 py-1 rounded-full font-bold border border-store-primary/20 shrink-0">
                  {review.car}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-zinc-300 whitespace-normal line-clamp-3 leading-relaxed font-medium">
                &ldquo;{review.text}&rdquo;
              </p>

              <div className="flex items-center justify-between border-t border-zinc-800/80 pt-3 text-[11px] text-zinc-400">
                <div className="flex items-center gap-1 text-amber-400">
                  <span>★★★★★</span>
                </div>
                <span className="font-medium text-zinc-500">تم الشراء برقم الهيكل</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}