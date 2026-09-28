// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { CartProvider } from '@/context/CartContext';
import { ProductProvider } from '@/context/ProductContext';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'المتجر الإلكتروني',
  description: 'منصة تسوق إلكتروني متكاملة بأفضل الأسعار',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        {/* استدعاء خط القاهرة مباشر عبر CDN لتفادي حظر التنزيل في بيئة WebContainers / StackBlitz */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-['Cairo',sans-serif] min-h-screen flex flex-col bg-gray-50 text-gray-900 antialiased">
        {/* تغليف كافة المكونات بـ ProductProvider و CartProvider لضمان عمل كافة الوظائف */}
        <ProductProvider>
          <CartProvider>
            {/* 1. شريط الرسائل الإعلاني أعلى الموقع */}
            <AnnouncementBar
              message="🎉 شحن مجاني لكافة الطلبات فوق 200 ريال لمدّة أسبوع!"
              badgeText="تنبيه"
              linkHref="/products"
              linkText="استكشف المنتجات ←"
            />

            {/* 2. الهيدر / شريط الملاحة العلوي */}
            <Navbar />

            {/* 3. محتوى الصفحات الديناميكي */}
            <main className="flex-grow">{children}</main>

            {/* 4. الفوتر / أسفل الصفحة */}
            <Footer />
          </CartProvider>
        </ProductProvider>
      </body>
    </html>
  );
}
