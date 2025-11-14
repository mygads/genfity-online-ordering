/**
 * Public Order Creation API
 * POST /api/public/orders - Create new order
 * 
 * @specification STEP_04_API_ENDPOINTS.txt - Order Endpoints
 * 
 * @description
 * Public endpoint for creating orders with auto customer registration:
 * 1. Validate merchant exists & active
 * 2. Validate customer info & order items
 * 3. Create order via OrderService
 * 4. Return serialized order data (Decimal → number)
 * 
 * @security
 * - Merchant validation before order creation
 * - Input sanitization & validation
 * - Proper error handling (400, 404, 500)
 * 
 * @response
 * - success: true
 * - data: Order object (all Decimals converted to numbers)
 * - message: Success message
 * - statusCode: 201
 */

import { NextRequest, NextResponse } from 'next/server';
import orderService from '@/lib/services/OrderService';
import { ValidationError } from '@/lib/constants/errors';
import prisma from '@/lib/db/client';

/**
 * POST /api/public/orders
 * Public endpoint to create order with auto customer registration
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // ========================================
    // VALIDATION (STEP_04 - Input Validation)
    // ========================================
    
    // Validate merchantCode
    if (!body.merchantCode) {
      return NextResponse.json(
        {
          success: false,
          error: 'VALIDATION_ERROR',
          message: 'Merchant code is required',
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    // Get merchant by code (STEP_01 merchants table)
    const merchant = await prisma.merchant.findUnique({
      where: { code: body.merchantCode },
    });

    if (!merchant || !merchant.isActive) {
      return NextResponse.json(
        {
          success: false,
          error: 'MERCHANT_INACTIVE',
          message: 'Merchant is currently not accepting orders',
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    // Validate customer info
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

    // Validate orderType (STEP_01 orders table - ENUM)
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

    // Validate items array
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

    // ========================================
    // ORDER CREATION (STEP_06 Business Logic)
    // ========================================
    
    console.log('[ORDER] Creating order for merchant:', merchant.id.toString(), merchant.name);
    
    // Create order (already serialized by service)
    const order = await orderService.createOrder({
      merchantId: merchant.id,
      orderType: body.orderType,
      tableNumber: body.tableNumber,
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      customerPhone: body.customerPhone,
      items: body.items.map((item: { 
        menuId: string; 
        quantity: number; 
        selectedAddons?: string[]; 
        notes?: string;
      }) => ({
        menuId: BigInt(item.menuId),
        quantity: item.quantity,
        selectedAddons: item.selectedAddons?.map((id: string) => BigInt(id)) || [],
        specialInstructions: item.notes,
      })),
      notes: body.notes,
    });

    console.log('[ORDER] Order created successfully:', order.orderNumber);

    // ✅ NO CHANGES NEEDED - Service returns serialized data
    return NextResponse.json({
      success: true,
      data: order, // ✅ Already serialized by OrderService
      message: 'Order created successfully',
      statusCode: 201,
    }, { status: 201 });

  } catch (error) {
    console.error('[ORDER] Error:', error);

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
