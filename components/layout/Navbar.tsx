// components/layout/Navbar.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const { totalItems } = useCart();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // إضفاء تأثير ظل خفيف عند التمرير لأسفل
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // إغلاق قائمة الجوال عند تغيير الصفحة
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'الرئيسية', href: '/' },
    { name: 'المنتجات', href: '/products' },
    { name: 'لوحة التحكم', href: '/admin/products' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white border-b border-zinc-200/80 shadow-xl shadow-zinc-200/20'
          : 'bg-white border-b border-zinc-100'
      }`}
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ================= تصميم الجوال ================= */}
        <div className="flex md:hidden items-center justify-between h-20">
          {/* 1. زر القائمة */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2.5 rounded-2xl bg-zinc-100 hover:bg-zinc-200 text-zinc-600 transition-colors cursor-pointer"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

          {/* 2. الشعار في المنتصف */}
          <Link href="/" className="flex items-center gap-2 group focus:outline-none">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWv_BiMd-nE8VfVaumxE4v4Ito0ARtWVl31IvTU3oRGg&s=10" 
              alt="شعار المتجر"
              className="w-11 h-11 object-contain rounded-2xl group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col">
              <span className="text-lg font-black text-store-dark tracking-tight">
                متجر غناتي
              </span>
            </div>
          </Link>

          {/* 3. السلة + تسجيل الدخول */}
          <div className="flex items-center gap-2">
            <Link
              href="/cart"
              className={`relative p-2.5 rounded-2xl transition-all active:scale-95 ${
                pathname === '/cart'
                ? 'bg-store-primary text-white shadow-lg shadow-store-primary/25'
                : 'bg-zinc-100 text-zinc-700 hover:bg-store-primary/10 hover:text-store-primary'
              }`}
              aria-label="سلة التسوق"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.25 10.5a.75.75 0 100-1.5.75.75 0 000 1.5zm7.5 0a.75.75 0 100-1.5.75.75 0 000 1.5z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 text-[10px] font-black rounded-full bg-store-primary text-white flex items-center justify-center shadow-sm">
                  {totalItems}
                </span>
              )}
            </Link>

            <Link
              href="/login"
              title="حسابي / تسجيل الدخول"
              aria-label="تسجيل الدخول"
              className={`p-2.5 rounded-2xl transition-all active:scale-95 ${
                pathname === '/login' || pathname === '/register'
                  ? 'bg-store-primary text-white shadow-lg shadow-store-primary/25'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-store-primary/10 hover:text-store-primary'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </Link>
          </div>
        </div>

        {/* ================= تصميم الشاشات الكبيرة (Desktop) ================= */}
        <div className="hidden md:flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3 group focus:outline-none">
            <div className="w-11 h-11 rounded-2xl bg-store-primary flex items-center justify-center text-white shadow-lg shadow-store-primary/25 group-hover:scale-105 transition-transform font-black text-xl">
              🛒
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-store-dark tracking-tight">
                متجري
              </span>
              <span className="text-[10px] font-bold text-zinc-400 -mt-1 tracking-wider uppercase">
                التسوق الذكي
              </span>
            </div>
          </Link>

          <nav className="flex items-center gap-1.5 bg-zinc-100/80 p-1.5 rounded-2xl border border-zinc-200/80">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-white text-store-primary shadow-sm border border-zinc-200/50'
                      : 'text-zinc-600 hover:text-store-dark hover:bg-zinc-200/60'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/cart"
              className={`relative flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-sm font-bold transition-all active:scale-95 ${
                pathname === '/cart'
                  ? 'bg-store-primary text-white shadow-lg shadow-store-primary/25'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-store-primary/10 hover:text-store-primary'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.25 10.5a.75.75 0 100-1.5.75.75 0 000 1.5zm7.5 0a.75.75 0 100-1.5.75.75 0 000 1.5z" />
              </svg>
              {totalItems > 0 && (
                <span className="min-w-[20px] h-5 px-1.5 text-[11px] font-black rounded-full bg-white text-store-primary flex items-center justify-center shadow-sm">
                  {totalItems}
                </span>
              )}
            </Link>

            <Link
              href="/login"
              title="حسابي / تسجيل الدخول"
              className={`p-2.5 rounded-2xl transition-all active:scale-95 ${
                pathname === '/login' || pathname === '/register'
                  ? 'bg-store-primary text-white shadow-lg shadow-store-primary/25'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-store-primary/10 hover:text-store-primary'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </Link>
          </div>
        </div>

      </div>

      {/* 4. القائمة المنسدلة للجوال */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-zinc-200 px-4 pt-3 pb-6 space-y-2 shadow-xl">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-3 rounded-2xl text-base font-bold transition-all ${
                  isActive
                    ? 'bg-store-primary/10 text-store-primary border border-store-primary/20'
                    : 'text-zinc-600 hover:bg-zinc-50'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}