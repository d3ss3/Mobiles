// components/layout/Footer.tsx
import Link from 'next/link';

export default function Footer() {
  return (
    <footer
      className="bg-zinc-950 text-zinc-300 py-14 mt-auto border-t border-zinc-800/80 shadow-2xl"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* معلومات المتجر */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-store-primary flex items-center justify-center text-white shadow-lg shadow-store-primary/25 font-black text-xl">
              🛒
            </div>
            <h3 className="text-xl font-black text-white tracking-tight">
              متجري الإلكتروني
            </h3>
          </div>
          <p className="text-zinc-400 text-sm leading-relaxed font-medium">
            منصتك الأولى للتسوق الذكي، نوفر لك أرقى المنتجات بأعلى معايير الجودة وأفضل الأسعار التنافسية.
          </p>
        </div>

        {/* روابط سريعة */}
        <div className="space-y-4">
          <h4 className="text-base font-black text-white tracking-wide border-r-4 border-store-primary pr-3">
            روابط سريعة
          </h4>
          <ul className="space-y-2.5 text-sm font-medium">
            <li>
              <Link
                href="/"
                className="text-zinc-400 hover:text-store-primary transition-colors flex items-center gap-2"
              >
                <span className="text-store-primary">›</span> الرئيسية
              </Link>
            </li>
            <li>
              <Link
                href="/products"
                className="text-zinc-400 hover:text-store-primary transition-colors flex items-center gap-2"
              >
                <span className="text-store-primary">›</span> جميع المنتجات
              </Link>
            </li>
            <li>
              <Link
                href="/cart"
                className="text-zinc-400 hover:text-store-primary transition-colors flex items-center gap-2"
              >
                <span className="text-store-primary">›</span> سلة التسوق
              </Link>
            </li>
          </ul>
        </div>

        {/* معلومات التواصل */}
        <div className="space-y-4">
          <h4 className="text-base font-black text-white tracking-wide border-r-4 border-store-primary pr-3">
            تواصل معنا
          </h4>
          <div className="space-y-3 text-sm text-zinc-400 font-medium">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-store-primary">
                📧
              </span>
              <span>support@store.com</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-store-primary">
                📞
              </span>
              <span dir="ltr">+966 50 000 0000</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-zinc-900 text-center text-xs text-zinc-500 font-medium">
        © {new Date().getFullYear()} متجري. جميع الحقوق محفوظة.
      </div>
    </footer>
  );
}