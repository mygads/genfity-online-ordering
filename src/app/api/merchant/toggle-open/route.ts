/**
 * Merchant Toggle Open API
 * PUT /api/merchant/toggle-open - Toggle store open/close status (MERCHANT_OWNER only)
 */

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/client';
import { withMerchant } from '@/lib/middleware/auth';
import type { AuthContext } from '@/lib/middleware/auth';
import { serializeBigInt } from '@/lib/utils/serializer';

/**
 * PUT /api/merchant/toggle-open
 * Toggle merchant store open/close status
 * Only MERCHANT_OWNER can use this endpoint
 */
async function handlePut(req: NextRequest, authContext: AuthContext) {
  try {
    // Check if user is MERCHANT_OWNER
    if (authContext.role !== 'MERCHANT_OWNER') {
      return NextResponse.json(
        {
          success: false,
          error: 'FORBIDDEN',
          message: 'Only merchant owners can open/close the store',
          statusCode: 403,
        },
        { status: 403 }
      );
    }

    // Get merchant from user's merchant_users relationship
    const merchantUser = await prisma.merchantUser.findFirst({
      where: { userId: authContext.userId },
      include: { merchant: true },
    });
    
    if (!merchantUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'MERCHANT_NOT_FOUND',
          message: 'Merchant not found for this user',
          statusCode: 404,
        },
        { status: 404 }
      );
    }

    const body = await req.json();
    const { isOpen } = body;

    if (typeof isOpen !== 'boolean') {
      return NextResponse.json(
        {
          success: false,
          error: 'VALIDATION_ERROR',
          message: 'isOpen must be a boolean value',
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    // Update merchant isOpen status
    const updatedMerchant = await prisma.merchant.update({
      where: { id: merchantUser.merchantId },
      data: { 
        isOpen,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      data: serializeBigInt(updatedMerchant),
      message: `Store ${isOpen ? 'opened' : 'closed'} successfully`,
      statusCode: 200,
    });
  } catch (error) {
    console.error('Error toggling store open status:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'INTERNAL_ERROR',
        message: 'Failed to toggle store open status',
        statusCode: 500,
      },
      { status: 500 }
    );
  }
}

// Apply auth middleware and export handler
export const PUT = withMerchant(handlePut);
