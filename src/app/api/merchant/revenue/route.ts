/**
 * Merchant Revenue API
 * GET /api/merchant/revenue - Get revenue reports
 */

import { NextRequest, NextResponse } from 'next/server';
import orderService from '@/lib/services/OrderService';
import prisma from '@/lib/db/client';
import { withMerchant } from '@/lib/middleware/auth';
import type { AuthContext } from '@/lib/middleware/auth';

/**
 * GET /api/merchant/revenue
 * Get revenue report with date range
 * Query params: startDate, endDate, type (daily|total)
 */
async function handleGet(req: NextRequest, context: AuthContext) {
  try {
    // Get merchant from user's merchant_users relationship
    const merchantUser = await prisma.merchantUser.findFirst({
      where: { userId: context.userId },
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

    const { searchParams } = new URL(req.url);
    const startDateStr = searchParams.get('startDate');
    const endDateStr = searchParams.get('endDate');
    const type = searchParams.get('type') || 'total'; // 'daily' or 'total'

    // Default to last 30 days if not provided
    const endDate = endDateStr ? new Date(endDateStr) : new Date();
    const startDate = startDateStr 
      ? new Date(startDateStr) 
      : new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);

    if (type === 'daily') {
      // Get daily revenue report
      const report = await orderService.getRevenueReport(
        merchantUser.merchantId,
        startDate,
        endDate
      );

      return NextResponse.json({
        success: true,
        data: {
          type: 'daily',
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          report,
        },
        message: 'Revenue report retrieved successfully',
        statusCode: 200,
      });
    } else {
      // Get total revenue
      const total = await orderService.getTotalRevenue(
        merchantUser.merchantId,
        startDate,
        endDate
      );

      return NextResponse.json({
        success: true,
        data: {
          type: 'total',
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          ...total,
        },
        message: 'Total revenue retrieved successfully',
        statusCode: 200,
      });
    }
  } catch (error) {
    console.error('Error getting revenue:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'INTERNAL_ERROR',
        message: 'Failed to retrieve revenue data',
        statusCode: 500,
      },
      { status: 500 }
    );
  }
}

export const GET = withMerchant(handleGet);
