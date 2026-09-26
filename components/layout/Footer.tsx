// components/layout/Footer.tsx
import Link from 'next/link';

export default function Footer() {
  return (
    <footer
      className="bg-gray-900 text-gray-300 py-12 mt-auto border-t border-gray-800"
      dir="rtl"
    >
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* معلومات المتجر */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4">
            متجرنا الإلكتروني
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            منصتك الأولى للتسوق الإلكتروني، نوفر لك أفضل المنتجات بأعلى جودة
            وأفضل الأسعار.
          </p>
        </div>

        {/* روابط سريعة */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">روابط سريعة</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:text-white transition-colors">
                الرئيسية
              </Link>
            </li>
            <li>
              <Link
                href="/products"
                className="hover:text-white transition-colors"
              >
                جميع المنتجات
              </Link>
            </li>
            <li>
              <Link href="/cart" className="hover:text-white transition-colors">
                سلة التسوق
              </Link>
            </li>
          </ul>
        </div>

        {/* معلومات التواصل */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">تواصل معنا</h4>
          <p className="text-gray-400 text-sm mb-2">
            البريد الإلكتروني: support@store.com
          </p>
          <p className="text-gray-400 text-sm">الهاتف: +966 50 000 0000</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-8 pt-6 border-t border-gray-800 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} جميع الحقوق محفوظة.
      </div>
    </footer>
  );
}
