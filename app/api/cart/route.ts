// app/api/cart/route.ts
import { NextResponse } from 'next/server';

// محاكاة مؤقتة لقاعدة البيانات في الذاكرة
let mockCart: any[] = [];

export async function GET() {
  return NextResponse.json({
    success: true,
    data: mockCart,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { product, quantity = 1 } = body;

    if (!product) {
      return NextResponse.json(
        { success: false, message: 'بيانات المنتج مطلوبة' },
        { status: 400 }
      );
    }

    const existingIndex = mockCart.findIndex(
      (item) => item.product.id === product.id
    );

    if (existingIndex > -1) {
      mockCart[existingIndex].quantity += quantity;
    } else {
      mockCart.push({ product, quantity });
    }

    return NextResponse.json({
      success: true,
      message: 'تمت إضافة المنتج للسلة بنجاح',
      data: mockCart,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء معالجة الطلب' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (productId) {
      mockCart = mockCart.filter((item) => item.product.id !== productId);
    } else {
      mockCart = []; // تفريغ السلة بالكامل
    }

    return NextResponse.json({
      success: true,
      message: 'تم تحديث السلة',
      data: mockCart,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء الحذف' },
      { status: 500 }
    );
  }
}
