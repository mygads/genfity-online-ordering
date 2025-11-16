import { NextRequest, NextResponse } from "next/server";
import { withMerchant } from "@/lib/middleware/auth";
import type { AuthContext } from "@/lib/middleware/auth";
import prisma from "@/lib/db/client";
import { serializeBigInt } from "@/lib/utils/serializer";

/**
 * GET /api/merchant/addon-categories/[id]/relationships
 * Get all menus using this addon category
 */
async function handleGet(
  request: NextRequest,
  context: AuthContext,
  routeContext: { params: Promise<Record<string, string>> }
) {
  try {
    // Get merchant from user's merchant_users relationship
    const merchantUser = await prisma.merchantUser.findFirst({
      where: { userId: context.userId },
    });

    if (!merchantUser) {
      return NextResponse.json(
        {
          success: false,
          error: "MERCHANT_NOT_FOUND",
          message: "Merchant not found for this user",
          statusCode: 404,
        },
        { status: 404 }
      );
    }

    const params = await routeContext.params;
    const addonCategoryId = BigInt(params.id || "0");

    // Verify addon category belongs to merchant
    const addonCategory = await prisma.addonCategory.findFirst({
      where: {
        id: addonCategoryId,
        merchantId: merchantUser.merchantId,
        deletedAt: null,
      },
    });

    if (!addonCategory) {
      return NextResponse.json(
        {
          success: false,
          error: "CATEGORY_NOT_FOUND",
          message: "Addon category not found",
          statusCode: 404,
        },
        { status: 404 }
      );
    }

    // Fetch all menu relationships
    const menuRelationships = await prisma.menuAddonCategory.findMany({
      where: {
        addonCategoryId: addonCategoryId,
        menu: {
          merchantId: merchantUser.merchantId,
          deletedAt: null,
        },
      },
      include: {
        menu: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
          },
        },
      },
      orderBy: {
        displayOrder: "asc",
      },
    });

    // Transform data for frontend
    const menus = menuRelationships.map((rel) => ({
      id: rel.menu.id,
      name: rel.menu.name,
      description: rel.menu.description,
      price: rel.menu.price,
      isRequired: rel.isRequired,
      displayOrder: rel.displayOrder,
    }));

    return NextResponse.json({
      success: true,
      data: serializeBigInt(menus),
      message: "Menu relationships retrieved successfully",
      statusCode: 200,
    });
  } catch (error) {
    console.error("Error fetching menu relationships:", error);
    return NextResponse.json(
      {
        success: false,
        error: "INTERNAL_ERROR",
        message: "Failed to fetch menu relationships",
        statusCode: 500,
      },
      { status: 500 }
    );
  }
}

export const GET = withMerchant(handleGet);
