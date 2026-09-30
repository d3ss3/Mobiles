import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    // بناء استعلام جلب المنتجات من Supabase
    let query = supabase.from('products').select('*');

    // إذا تم تمرير تصنيف أو شركة، نقوم بالفلترة
    if (category) {
      query = query.or(`category.eq.${category},category_id.eq.${category}`);
    }

    const { data: products, error } = await query;

    if (error) {
      console.error('Database Error:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: products || [],
    });
  } catch (err: any) {
    console.error('Server Error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}