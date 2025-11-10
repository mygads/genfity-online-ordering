/**
 * Public Merchant Categories API
 * GET /api/public/merchants/[code]/categories - Get merchant categories
 */

import { NextRequest, NextResponse } from 'next/server';
import merchantService from '@/lib/services/MerchantService';
import menuService from '@/lib/services/MenuService';

/**
 * GET /api/public/merchants/[code]/categories
 * Public endpoint to get merchant categories
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<Record<string, string>> }
) {
  const params = await context.params;
  try {
    // Get merchant by code
    const merchant = await merchantService.getMerchantByCode(params.code);

    if (!merchant) {
      return NextResponse.json(
        {
          success: false,
          error: 'MERCHANT_NOT_FOUND',
          message: 'Merchant not found',
          statusCode: 404,
        },
        { status: 404 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const merchantData = merchant as unknown as Record<string, any>;

    // Get all categories for this merchant
    const categories = await menuService.getCategoriesByMerchant(merchantData.id);

    // Format response
    const formattedCategories = categories.map((category) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const categoryData = category as any;
      return {
        id: categoryData.id.toString(),
        name: categoryData.name,
        description: categoryData.description,
        sortOrder: categoryData.sortOrder,
      };
    });

    return NextResponse.json({
      success: true,
      data: formattedCategories,
      message: 'Categories retrieved successfully',
      statusCode: 200,
    });
  } catch (error) {
    console.error('Error getting categories:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'INTERNAL_ERROR',
        message: 'Failed to retrieve categories',
        statusCode: 500,
      },
      { status: 500 }
    );
  }
}
