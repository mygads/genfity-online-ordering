"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ViewMenuAddonCategoriesModal from "@/components/menu/ViewMenuAddonCategoriesModal";
import ManageMenuAddonCategoriesModal from "@/components/menu/ManageMenuAddonCategoriesModal";

interface MenuAddonCategory {
  addonCategoryId: string;
  isRequired: boolean;
  displayOrder: number;
  addonCategory: {
    id: string;
    name: string;
    description: string | null;
    minSelection: number;
    maxSelection: number | null;
    addonItems: Array<{
      id: string;
      name: string;
      description: string | null;
      price: string | number;
      inputType: string;
      isActive: boolean;
      trackStock: boolean;
      stockQty: number | null;
      displayOrder: number;
    }>;
  };
}

interface MenuDetail {
  id: string;
  name: string;
  description: string | null;
  price: string | number;
  promoPrice: string | number | null;
  promoStartDate: string | null;
  promoEndDate: string | null;
  imageUrl: string | null;
  isActive: boolean;
  isPromo: boolean;
  trackStock: boolean;
  stockQty: number | null;
  dailyStockTemplate: number | null;
  autoResetStock: boolean;
  category?: {
    id: string;
    name: string;
  };
  categories?: Array<{
    id: string;
    menuId: string;
    categoryId: string;
    category: {
      id: string;
      name: string;
    };
  }>;
  addonCategories?: MenuAddonCategory[];
}

interface Merchant {
  id: string;
  name: string;
  currency: string;
}

export default function MenuDetailPage() {
  const router = useRouter();
  const params = useParams();
  const menuId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [menu, setMenu] = useState<MenuDetail | null>(null);
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [showViewAddonsModal, setShowViewAddonsModal] = useState(false);
  const [showManageAddonsModal, setShowManageAddonsModal] = useState(false);

  const fetchMenuDetail = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      if (!token) {
        router.push("/admin/login");
        return;
      }

      const [menuResponse, merchantResponse] = await Promise.all([
        fetch(`/api/merchant/menu/${menuId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/merchant/profile", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!menuResponse.ok) {
        if (menuResponse.status === 404) {
          throw new Error("Menu not found");
        }
        throw new Error("Failed to fetch menu details");
      }

      const menuData = await menuResponse.json();
      
      if (merchantResponse.ok) {
        const merchantData = await merchantResponse.json();
        if (merchantData.success && merchantData.data) {
          setMerchant({
            id: merchantData.data.id,
            name: merchantData.data.name,
            currency: merchantData.data.currency || "AUD",
          });
        }
      }

      if (menuData.success && menuData.data) {
        setMenu(menuData.data);
      } else {
        throw new Error("Invalid menu data");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (menuId) {
      fetchMenuDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuId]);

  const formatPrice = (price: string | number) => {
    const currency = merchant?.currency || "AUD";
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return `${currency} ${numPrice.toLocaleString("en-AU", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-AU", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isPromoActive = () => {
    if (!menu?.isPromo || !menu?.promoStartDate || !menu?.promoEndDate) {
      return false;
    }
    const now = new Date();
    const start = new Date(menu.promoStartDate);
    const end = new Date(menu.promoEndDate);
    return now >= start && now <= end;
  };

  if (loading) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Menu Detail" />
        <div className="mt-6 py-10 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-brand-500 border-r-transparent"></div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading menu details...</p>
        </div>
      </div>
    );
  }

  if (error || !menu) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Menu Detail" />
        <div className="mt-6 rounded-lg bg-error-50 p-4 dark:bg-error-900/20">
          <p className="text-sm text-error-600 dark:text-error-400">{error || "Menu not found"}</p>
          <button
            onClick={() => router.push("/admin/dashboard/menu")}
            className="mt-3 inline-flex h-10 items-center rounded-lg bg-brand-500 px-4 text-sm font-medium text-white hover:bg-brand-600"
          >
            Back to Menu List
          </button>
        </div>
      </div>
    );
  }

  const categoryNames = menu.categories && menu.categories.length > 0
    ? menu.categories.map(c => c.category.name).join(", ")
    : menu.category?.name || "-";

  return (
    <div>
      <PageBreadcrumb pageTitle={`Menu Detail - ${menu.name}`} />

      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push("/admin/dashboard/menu")}
            className="inline-flex h-11 items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Menu List
          </button>
          <button
            onClick={() => router.push(`/admin/dashboard/menu/${menuId}/edit`)}
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-brand-500 px-6 text-sm font-medium text-white hover:bg-brand-600"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Menu
          </button>
        </div>

        {/* Main Info Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/3">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Image */}
            <div className="lg:col-span-1">
              <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
                {menu.imageUrl ? (
                  <Image
                    src={menu.imageUrl}
                    alt={menu.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <svg className="h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {/* Title & Status */}
                <div>
                  <div className="flex items-start justify-between">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">{menu.name}</h1>
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                      menu.isActive 
                        ? 'bg-success-100 text-success-700 dark:bg-success-900/20 dark:text-success-400' 
                        : 'bg-error-100 text-error-700 dark:bg-error-900/20 dark:text-error-400'
                    }`}>
                      {menu.isActive ? '● Active' : '○ Inactive'}
                    </span>
                  </div>
                  {menu.description && (
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{menu.description}</p>
                  )}
                </div>

                {/* Price Info */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Regular Price</p>
                    <p className="mt-1 text-2xl font-bold text-gray-800 dark:text-white/90">{formatPrice(menu.price)}</p>
                  </div>
                  {menu.isPromo && menu.promoPrice && (
                    <div className={`rounded-lg border p-4 ${
                      isPromoActive()
                        ? 'border-orange-200 bg-orange-50 dark:border-orange-900/50 dark:bg-orange-900/20'
                        : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/50'
                    }`}>
                      <p className="text-xs font-medium uppercase tracking-wide text-orange-600 dark:text-orange-400">
                        Promo Price {isPromoActive() ? '(Active)' : '(Inactive)'}
                      </p>
                      <p className="mt-1 text-2xl font-bold text-orange-700 dark:text-orange-400">{formatPrice(menu.promoPrice)}</p>
                      <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                        {formatDate(menu.promoStartDate)} - {formatDate(menu.promoEndDate)}
                      </p>
                    </div>
                  )}
                </div>

                {/* Additional Info */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Category</p>
                    <p className="mt-1 text-sm font-medium text-gray-800 dark:text-white/90">{categoryNames}</p>
                  </div>
                  {menu.trackStock && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Stock</p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          (menu.stockQty || 0) > 10
                            ? 'bg-success-100 text-success-700 dark:bg-success-900/20 dark:text-success-400'
                            : (menu.stockQty || 0) > 0
                            ? 'bg-warning-100 text-warning-700 dark:bg-warning-900/20 dark:text-warning-400'
                            : 'bg-error-100 text-error-700 dark:bg-error-900/20 dark:text-error-400'
                        }`}>
                          {menu.stockQty || 0} pcs
                        </span>
                        {menu.autoResetStock && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            (Auto-reset: {menu.dailyStockTemplate || 0})
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Addon Categories Card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/3">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Addon Categories</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {menu.addonCategories?.length || 0} addon categor{menu.addonCategories?.length === 1 ? 'y' : 'ies'} linked to this menu
              </p>
            </div>
            <div className="flex gap-2">
              {menu.addonCategories && menu.addonCategories.length > 0 && (
                <button
                  onClick={() => setShowViewAddonsModal(true)}
                  className="inline-flex h-11 items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 text-sm font-medium text-blue-600 hover:bg-blue-100 dark:border-blue-900/50 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View All
                </button>
              )}
              <button
                onClick={() => setShowManageAddonsModal(true)}
                className="inline-flex h-11 items-center gap-2 rounded-lg bg-brand-500 px-4 text-sm font-medium text-white hover:bg-brand-600"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Manage Addons
              </button>
            </div>
          </div>

          {!menu.addonCategories || menu.addonCategories.length === 0 ? (
            <div className="py-10 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">No addon categories linked yet</p>
              <button
                onClick={() => setShowManageAddonsModal(true)}
                className="mt-4 inline-flex h-11 items-center gap-2 rounded-lg bg-brand-500 px-6 text-sm font-medium text-white hover:bg-brand-600"
              >
                Add Addon Categories
              </button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {menu.addonCategories.map((mac) => (
                <div
                  key={mac.addonCategoryId}
                  className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900/50"
                >
                  <div className="flex items-start justify-between">
                    <h4 className="font-medium text-gray-800 dark:text-white/90">
                      {mac.addonCategory.name}
                    </h4>
                    {mac.isRequired && (
                      <span className="inline-flex rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/20 dark:text-red-400">
                        Required
                      </span>
                    )}
                  </div>
                  {mac.addonCategory.description && (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                      {mac.addonCategory.description}
                    </p>
                  )}
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="text-gray-600 dark:text-gray-400">
                      Min: {mac.addonCategory.minSelection} / Max: {mac.addonCategory.maxSelection || '∞'}
                    </span>
                    <span className="font-medium text-brand-600 dark:text-brand-400">
                      {mac.addonCategory.addonItems?.length || 0} items
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showViewAddonsModal && menu.addonCategories && (
        <ViewMenuAddonCategoriesModal
          show={showViewAddonsModal}
          menuName={menu.name}
          addonCategories={menu.addonCategories}
          currency={merchant?.currency || "AUD"}
          onClose={() => setShowViewAddonsModal(false)}
        />
      )}

      {showManageAddonsModal && (
        <ManageMenuAddonCategoriesModal
          show={showManageAddonsModal}
          menuId={menuId}
          menuName={menu.name}
          currentAddonCategories={menu.addonCategories || []}
          onClose={() => setShowManageAddonsModal(false)}
          onSuccess={() => {
            setShowManageAddonsModal(false);
            fetchMenuDetail();
          }}
        />
      )}
    </div>
  );
}
