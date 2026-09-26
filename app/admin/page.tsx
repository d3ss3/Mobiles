// app/admin/page.tsx

export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-8" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 border-b pb-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-gray-900">
              لوحة تحكم الإدارة
            </h1>
            <p className="text-gray-600 mt-1">
              نظرة عامة على المبيعات والمنتجات
            </p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors">
            + إضافة منتج جديد
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">
              إجمالي المبيعات
            </h3>
            <p className="text-2xl font-black text-gray-900 mt-2">1,250 ر.س</p>
          </div>
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">عدد الطلبات</h3>
            <p className="text-2xl font-black text-gray-900 mt-2">12 طلب</p>
          </div>
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">
              إجمالي المنتجات
            </h3>
            <p className="text-2xl font-black text-gray-900 mt-2">3 منتجات</p>
          </div>
        </div>
      </div>
    </main>
  );
}
