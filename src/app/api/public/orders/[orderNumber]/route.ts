/**
 * Public Order Detail API
 * GET /api/public/orders/[orderNumber]
 * 
 * ✅ FIXED: Import default export instead of named export
 * 
 * @specification STEP_04_API_ENDPOINTS.txt - Order Endpoints
 */

import { NextRequest, NextResponse } from 'next/server';
import orderService from '@/lib/services/OrderService'; // ✅ FIXED: Default import

/**
 * GET /api/public/orders/[orderNumber]
 * Retrieve order details by order number
 * @public No authentication required
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<Record<string, string>> }
) {
  const params = await context.params;
  
  try {
    const { orderNumber } = params;
    
    // Validate order number
    if (!orderNumber) {
      return NextResponse.json(
        {
          success: false,
          error: 'VALIDATION_ERROR',
          message: 'Order number is required',
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    console.log('📦 [API] Fetching order:', orderNumber);

    // ✅ FIXED: Now works with default import
    const order = await orderService.getOrderByNumber(orderNumber);

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          error: 'ORDER_NOT_FOUND',
          message: 'Order not found',
          statusCode: 404,
        },
        { status: 404 }
      );
    }

    // Fetch order status history
    const statusHistory = await orderService.getOrderStatusHistory(BigInt(order.id));

    console.log('✅ [API] Order fetched successfully:', {
      orderNumber: order.orderNumber,
      status: order.status,
      totalAmount: order.totalAmount,
    });

    // ✅ Return with serviceFeeAmount included
    return NextResponse.json({
      success: true,
      data: {
        ...order,
        serviceFeeAmount: order.serviceFeeAmount || 0,
        statusHistory,
      },
      message: 'Order retrieved successfully',
      statusCode: 200,
    });

  } catch (error) {
    console.error('❌ [API] Get order error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'INTERNAL_ERROR',
        message: 'Failed to retrieve order',
        statusCode: 500,
      },
      { status: 500 }
    );
  }
}
