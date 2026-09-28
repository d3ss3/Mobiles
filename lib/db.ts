import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// فحص للتأكد من وجود المتغيرات وطباعة تنبيه في حال كانت مفقودة
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ خطأ: متغيرات البيئة الخاصة بـ Supabase غير ملقوطة في Next.js!');
  console.log('SUPABASE_URL:', supabaseUrl);
  console.log('SUPABASE_ANON_KEY:', supabaseAnonKey ? 'موجود' : 'مفقود');
}

// استخدام قيم مؤقتة لمنع انهيار التطبيق تماماً إذا كانت فارغة
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);