'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('كلمات المرور غير متطابقة، يرجى التأكد وإعادة المحاولة.');
      return;
    }

    if (!formData.agreeTerms) {
      setErrorMessage('يرجى الموافقة على الشروط والأحكام للمتابعة.');
      return;
    }

    setIsLoading(true);

    // محاكاة الاتصال بخادم إنشاء الحساب
    setTimeout(() => {
      setIsLoading(false);
      alert(`تم إنشاء الحساب بنجاح باسم: ${formData.name}`);
    }, 1500);
  };

  return (
    <main
      className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-store-light text-store-dark"
      dir="rtl"
    >
      <div className="w-full max-w-5xl bg-white rounded-3xl border border-zinc-200/80 shadow-2xl shadow-zinc-200/50 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[650px]">
        {/* القسم الأيمن: النموذج والتفاعل */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between">
          <div>
            {/* العنونة */}
            <div className="space-y-2 mb-6">
              <span className="bg-store-primary/10 text-store-primary text-xs font-extrabold px-3 py-1 rounded-full border border-store-primary/20">
                حساب جديد ✨
              </span>
              <h1 className="text-3xl font-black text-store-dark tracking-tight">
                إنشاء حساب جديد
              </h1>
              <p className="text-sm font-medium text-zinc-500">
                انضم إلينا للاستمتاع بتجربة تسوق فريدة وتتبع طلباتك بكل سهولة
              </p>
            </div>

            {/* رسالة الخطأ إن وجدت */}
            {errorMessage && (
              <div className="mb-4 p-3.5 bg-red-50 border border-red-200 rounded-2xl text-xs font-bold text-red-600 flex items-center gap-2">
                <span>⚠️</span>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* أزرار التسجيل السريع (Social Register) */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <button
                type="button"
                className="flex items-center justify-center gap-2 px-4 py-3 border border-zinc-200 rounded-2xl hover:bg-zinc-50 transition-all font-bold text-xs text-zinc-700 active:scale-[0.98]"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Google</span>
              </button>

              <button
                type="button"
                className="flex items-center justify-center gap-2 px-4 py-3 border border-zinc-200 rounded-2xl hover:bg-zinc-50 transition-all font-bold text-xs text-zinc-700 active:scale-[0.98]"
              >
                <svg className="w-4 h-4 fill-zinc-900" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.62-.76 1.05-1.82.93-2.88-.91.04-2.03.61-2.68 1.37-.58.67-1.09 1.76-.95 2.8.1.01.21.02.31.02 1.02 0 1.77-.55 2.39-1.31z" />
                </svg>
                <span>Apple</span>
              </button>
            </div>

            {/* فاصل */}
            <div className="relative my-5 flex items-center justify-center">
              <div className="border-t border-zinc-200 w-full" />
              <span className="bg-white px-3 text-[11px] font-bold text-zinc-400 absolute uppercase">
                أو بالتسجيل المباشر
              </span>
            </div>

            {/* نموذج التسجيل */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* حقل الاسم الكامل */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  الاسم الكامل
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="محمد عبدالله"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-4 py-3 pl-10 text-sm font-medium text-store-dark outline-none focus:border-store-primary focus:bg-white focus:ring-4 focus:ring-store-primary/10 transition-all"
                  />
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                    👤
                  </span>
                </div>
              </div>

              {/* حقل البريد الإلكتروني */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="example@domain.com"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-4 py-3 pl-10 text-sm font-medium text-store-dark outline-none focus:border-store-primary focus:bg-white focus:ring-4 focus:ring-store-primary/10 transition-all"
                  />
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                    📧
                  </span>
                </div>
              </div>

              {/* كلمة المرور وتأكيدها */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    كلمة المرور
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      placeholder="••••••••"
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-4 py-3 pl-10 text-sm font-medium text-store-dark outline-none focus:border-store-primary focus:bg-white focus:ring-4 focus:ring-store-primary/10 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 text-[11px] font-bold"
                    >
                      {showPassword ? 'إخفاء' : 'إظهار'}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    تأكيد كلمة المرور
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    placeholder="••••••••"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-4 py-3 text-sm font-medium text-store-dark outline-none focus:border-store-primary focus:bg-white focus:ring-4 focus:ring-store-primary/10 transition-all"
                  />
                </div>
              </div>

              {/* خيار الشروط والأحكام */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="terms"
                  checked={formData.agreeTerms}
                  onChange={(e) =>
                    setFormData({ ...formData, agreeTerms: e.target.checked })
                  }
                  className="w-4 h-4 rounded-lg border-zinc-300 text-store-primary focus:ring-store-primary cursor-pointer"
                />
                <label
                  htmlFor="terms"
                  className="text-xs text-zinc-600 cursor-pointer select-none"
                >
                  أوافق على{' '}
                  <Link
                    href="#"
                    className="text-store-primary font-bold hover:underline"
                  >
                    الشروط والأحكام
                  </Link>{' '}
                  و{' '}
                  <Link
                    href="#"
                    className="text-store-primary font-bold hover:underline"
                  >
                    سياسة الخصوصية
                  </Link>
                </label>
              </div>

              {/* زر الإرسال */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-store-primary hover:bg-store-secondary text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-store-primary/25 transition-all active:scale-[0.98] text-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>جاري إنشاء الحساب...</span>
                  </>
                ) : (
                  <span>إنشاء حساب جديد</span>
                )}
              </button>
            </form>
          </div>

          {/* التذييل التحتي */}
          <div className="pt-4 text-center border-t border-zinc-100">
            <p className="text-xs font-bold text-zinc-500">
              لديك حساب بالفعل؟{' '}
              <Link
                href="/login"
                className="text-store-primary font-black hover:underline"
              >
                تسجيل الدخول مباشرة
              </Link>
            </p>
          </div>
        </div>

        {/* القسم الأيسر: العرض البصري الجذاب بالهوية الجديدة */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-store-primary via-store-secondary to-store-dark p-8 flex-col justify-between relative overflow-hidden text-white">
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-12 -right-12 w-60 h-60 bg-store-primary/20 rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl mb-6 border border-white/20">
              🎁
            </div>
            <h2 className="text-2xl font-black mb-3">مزايا عضوية المتجر!</h2>
            <ul className="space-y-3 text-zinc-100 text-xs font-medium">
              <li className="flex items-center gap-2">
                <span className="bg-white/20 p-1 rounded-full text-[10px]">
                  ✓
                </span>
                شحن مجاني على أول طلب بعد التسجيل
              </li>
              <li className="flex items-center gap-2">
                <span className="bg-white/20 p-1 rounded-full text-[10px]">
                  ✓
                </span>
                حفظ العناوين وطرق الدفع للشراء بنقرة واحدة
              </li>
              <li className="flex items-center gap-2">
                <span className="bg-white/20 p-1 rounded-full text-[10px]">
                  ✓
                </span>
                تتبع حالة الطلبات والاحتفاظ بسجل المشتريات
              </li>
            </ul>
          </div>

          <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl">
            <p className="text-xs font-bold mb-1">💡 هل تعلم؟</p>
            <p className="text-[11px] text-zinc-100 leading-relaxed">
              يمكنك ربط حسابك بـ Google لتسجيل الدخول الفوري بدون الحاجة لحفظ
              كلمة مرور جديدة.
            </p>
          </div>

          <p className="relative z-10 text-[10px] text-zinc-200 font-medium">
            © 2026 جميع الحقوق محفوظة لـ متجري
          </p>
        </div>
      </div>
    </main>
  );
}