// app/api/checkout/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, customer, totalPrice } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'السلة فارغة، لا يمكن إتمام الطلب' },
        { status: 400 }
      );
    }

    // محاكاة إنشاء طلب جديد برقم مرجعي فريد
    const newOrder = {
      orderId: `ORD-${Date.now()}`,
      items,
      customer: customer || {},
      totalPrice: totalPrice || 0,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: 'تم إتمام الطلب بنجاح',
      order: newOrder,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'حدث خطأ أثناء معالجة عملية الشراء' },
      { status: 500 }
    );
  }
}
