/**
 * Public Order Creation API
 * POST /api/public/orders - Create new order
 */

import { NextRequest, NextResponse } from 'next/server';
import orderService from '@/lib/services/OrderService';
import { ValidationError } from '@/lib/constants/errors';

/**
 * POST /api/public/orders
 * Public endpoint to create order with auto customer registration
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate required fields
    if (!body.merchantId) {
      return NextResponse.json(
        {
          success: false,
          error: 'VALIDATION_ERROR',
          message: 'Merchant ID is required',
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    if (!body.customerName || !body.customerEmail) {
      return NextResponse.json(
        {
          success: false,
          error: 'VALIDATION_ERROR',
          message: 'Customer name and email are required',
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    if (!body.orderType || !['DINE_IN', 'TAKEAWAY'].includes(body.orderType)) {
      return NextResponse.json(
        {
          success: false,
          error: 'VALIDATION_ERROR',
          message: 'Valid order type is required (DINE_IN or TAKEAWAY)',
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'VALIDATION_ERROR',
          message: 'Order must contain at least one item',
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    // Create order
    const order = await orderService.createOrder({
      merchantId: BigInt(body.merchantId),
      orderType: body.orderType,
      tableNumber: body.tableNumber,
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      customerPhone: body.customerPhone,
      items: body.items.map((item: { menuId: string; quantity: number; selectedAddons?: string[]; specialInstructions?: string }) => ({
        menuId: BigInt(item.menuId),
        quantity: item.quantity,
        selectedAddons: item.selectedAddons?.map((id: string) => BigInt(id)) || [],
        specialInstructions: item.specialInstructions,
      })),
      notes: body.notes,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const orderData = order as any;

    return NextResponse.json({
      success: true,
      data: {
        orderId: orderData.id.toString(),
        orderNumber: orderData.orderNumber,
        status: orderData.status,
        orderType: orderData.orderType,
        tableNumber: orderData.tableNumber,
        subtotal: orderData.subtotal,
        taxAmount: orderData.taxAmount,
        totalAmount: orderData.totalAmount,
        customerName: orderData.customerName,
        customerEmail: orderData.customerEmail,
        createdAt: orderData.createdAt,
      },
      message: 'Order created successfully',
      statusCode: 201,
    });
  } catch (error) {
    console.error('Error creating order:', error);

    if (error instanceof ValidationError) {
      return NextResponse.json(
        {
          success: false,
          error: 'VALIDATION_ERROR',
          message: error.message,
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'INTERNAL_ERROR',
        message: 'Failed to create order',
        statusCode: 500,
      },
      { status: 500 }
    );
  }
}
