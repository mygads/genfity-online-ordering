/**
 * PUT /api/merchant/menu/[id]/categories - Update menu categories (many-to-many)
 * Replaces all existing category associations with new ones
 */

import { NextRequest, NextResponse } from "next/server";
import { withMerchant } from "@/lib/middleware/auth";
import prisma from "@/lib/db/client";
import { serializeBigInt } from "@/lib/utils/serializer";

/**
 * PUT /api/merchant/menu/[id]/categories
 * Update menu categories (many-to-many relationship)
 */
export const PUT = withMerchant(async (req: NextRequest, authContext) => {
  try {
    const { userId, merchantId } = authContext;
    const menuId = req.nextUrl.pathname.split("/")[5]; // Extract menu ID from path
    const body = await req.json();
    const { categoryIds } = body;

    if (!menuId) {
      return NextResponse.json(
        { success: false, message: "Menu ID is required" },
        { status: 400 }
      );
    }

    if (!Array.isArray(categoryIds)) {
      return NextResponse.json(
        { success: false, message: "categoryIds must be an array" },
        { status: 400 }
      );
    }

    const menuIdNum = BigInt(menuId);

    // Verify menu belongs to merchant
    const menu = await prisma.menu.findFirst({
      where: {
        id: menuIdNum,
        merchantId: merchantId,
        deletedAt: null,
      },
    });

    if (!menu) {
      return NextResponse.json(
        { success: false, message: "Menu not found" },
        { status: 404 }
      );
    }

    // Verify all categories belong to merchant
    if (categoryIds.length > 0) {
      const categories = await prisma.menuCategory.findMany({
        where: {
          id: { in: categoryIds.map((id: string) => BigInt(id)) },
          merchantId: merchantId,
          deletedAt: null,
        },
      });

      if (categories.length !== categoryIds.length) {
        return NextResponse.json(
          { success: false, message: "One or more categories not found" },
          { status: 400 }
        );
      }
    }

    // Update categories in transaction
    await prisma.$transaction(async (tx) => {
      // Delete all existing category associations
      await tx.menuCategoryItem.deleteMany({
        where: { menuId: menuIdNum },
      });

      // Create new category associations
      if (categoryIds.length > 0) {
        await tx.menuCategoryItem.createMany({
          data: categoryIds.map((categoryId: string) => ({
            menuId: menuIdNum,
            categoryId: BigInt(categoryId),
          })),
        });
      }

      // Update menu's updatedAt and updatedByUserId
      await tx.menu.update({
        where: { id: menuIdNum },
        data: {
          updatedByUserId: userId,
        },
      });
    });

    // Fetch updated menu with categories
    const updatedMenu = await prisma.menu.findUnique({
      where: { id: menuIdNum },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Menu categories updated successfully",
      data: serializeBigInt(updatedMenu),
    });
  } catch (error) {
    console.error("Update menu categories error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to update menu categories",
      },
      { status: 500 }
    );
  }
});
