/**
 * Menu Repository
 * Handles menu, categories, and addons operations
 */

import prisma from '@/lib/db/client';

export class MenuRepository {
  /**
   * ========================================
   * MENU CATEGORIES
   * ========================================
   */

  async findAllCategories(merchantId: bigint) {
    return prisma.menuCategory.findMany({
      where: { merchantId },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findCategoryById(id: bigint) {
    return prisma.menuCategory.findUnique({
      where: { id },
    });
  }

  async createCategory(data: {
    merchantId: bigint;
    name: string;
    description?: string;
    sortOrder?: number;
    isActive?: boolean;
  }) {
    return prisma.menuCategory.create({
      data,
    });
  }

  async updateCategory(id: bigint, data: {
    name?: string;
    description?: string;
    sortOrder?: number;
    isActive?: boolean;
  }) {
    return prisma.menuCategory.update({
      where: { id },
      data,
    });
  }

  async deleteCategory(id: bigint) {
    return prisma.menuCategory.delete({
      where: { id },
    });
  }

  /**
   * ========================================
   * MENUS
   * ========================================
   */

  async findAllMenus(merchantId: bigint, categoryId?: bigint, includeInactive = false) {
    return prisma.menu.findMany({
      where: {
        merchantId,
        ...(categoryId && { categoryId }),
        ...(includeInactive ? {} : { isActive: true }),
      },
      include: {
        category: true,
        addonCategories: {
          include: {
            addonCategory: {
              include: {
                addonItems: {
                  where: { isActive: true },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findMenuById(id: bigint) {
    return prisma.menu.findUnique({
      where: { id },
      include: {
        category: true,
        addonCategories: {
          include: {
            addonCategory: {
              include: {
                addonItems: true,
              },
            },
          },
        },
      },
    });
  }

  async createMenu(data: {
    merchantId: bigint;
    categoryId?: bigint;
    name: string;
    description?: string;
    price: number;
    imageUrl?: string;
    isActive?: boolean;
    isPromo?: boolean;
    trackStock?: boolean;
    stockQty?: number;
  }) {
    return prisma.menu.create({
      data,
    });
  }

  async updateMenu(id: bigint, data: {
    categoryId?: bigint;
    name?: string;
    description?: string;
    price?: number;
    imageUrl?: string;
    isActive?: boolean;
    isPromo?: boolean;
    trackStock?: boolean;
    stockQty?: number;
  }) {
    return prisma.menu.update({
      where: { id },
      data,
    });
  }

  async deleteMenu(id: bigint) {
    return prisma.menu.delete({
      where: { id },
    });
  }

  async updateStock(id: bigint, quantity: number) {
    return prisma.menu.update({
      where: { id },
      data: {
        stockQty: {
          decrement: quantity,
        },
      },
    });
  }

  /**
   * ========================================
   * ADDON CATEGORIES
   * ========================================
   */

  async findAllAddonCategories(merchantId: bigint) {
    return prisma.addonCategory.findMany({
      where: { merchantId },
      include: {
        addonItems: true,
      },
    });
  }

  async findAddonCategoryById(id: bigint) {
    return prisma.addonCategory.findUnique({
      where: { id },
      include: {
        addonItems: true,
      },
    });
  }

  async createAddonCategory(data: {
    merchantId: bigint;
    name: string;
    description?: string;
    minSelection?: number;
    maxSelection?: number;
    isActive?: boolean;
  }) {
    return prisma.addonCategory.create({
      data,
    });
  }

  async updateAddonCategory(id: bigint, data: {
    name?: string;
    description?: string;
    minSelection?: number;
    maxSelection?: number;
    isActive?: boolean;
  }) {
    return prisma.addonCategory.update({
      where: { id },
      data,
    });
  }

  async deleteAddonCategory(id: bigint) {
    return prisma.addonCategory.delete({
      where: { id },
    });
  }

  /**
   * ========================================
   * ADDON ITEMS
   * ========================================
   */

  async findAddonItemsByCategoryId(categoryId: bigint) {
    return prisma.addonItem.findMany({
      where: { addonCategoryId: categoryId },
    });
  }

  async findAddonItemById(id: bigint) {
    return prisma.addonItem.findUnique({
      where: { id },
    });
  }

  async createAddonItem(data: {
    addonCategoryId: bigint;
    name: string;
    description?: string;
    price: number;
    isActive?: boolean;
    trackStock?: boolean;
    stockQty?: number;
  }) {
    return prisma.addonItem.create({
      data,
    });
  }

  async updateAddonItem(id: bigint, data: {
    name?: string;
    description?: string;
    price?: number;
    isActive?: boolean;
    trackStock?: boolean;
    stockQty?: number;
  }) {
    return prisma.addonItem.update({
      where: { id },
      data,
    });
  }

  async deleteAddonItem(id: bigint) {
    return prisma.addonItem.delete({
      where: { id },
    });
  }

  async updateAddonStock(id: bigint, quantity: number) {
    return prisma.addonItem.update({
      where: { id },
      data: {
        stockQty: {
          decrement: quantity,
        },
      },
    });
  }

  /**
   * ========================================
   * MENU-ADDON LINKING
   * ========================================
   */

  async linkAddonToMenu(menuId: bigint, addonCategoryId: bigint) {
    return prisma.menuAddonCategory.create({
      data: {
        menuId,
        addonCategoryId,
      },
    });
  }

  async unlinkAddonFromMenu(menuId: bigint, addonCategoryId: bigint) {
    return prisma.menuAddonCategory.delete({
      where: {
        menuId_addonCategoryId: {
          menuId,
          addonCategoryId,
        },
      },
    });
  }

  async getMenuAddons(menuId: bigint) {
    return prisma.menuAddonCategory.findMany({
      where: { menuId },
      include: {
        addonCategory: {
          include: {
            addonItems: {
              where: { isActive: true },
            },
          },
        },
      },
    });
  }
}

const menuRepository = new MenuRepository();
export default menuRepository;
