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
      <PageBreadcrumb pageTitle="Menu Detail" />

      <div className="mt-6 space-y-6">
        {/* Header with Gradient Background */}
        <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3">
          {/* Subtle Gradient Background */}
          <div className="absolute inset-0 bg-linear-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900/50 dark:via-gray-900/30 dark:to-gray-900/50"></div>
          
          {/* Content */}
          <div className="relative p-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Image */}
              <div className="lg:col-span-1">
                <div className="relative aspect-square w-full max-w-[280px] overflow-hidden rounded-lg border-2 border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                  {menu.imageUrl ? (
                    <Image
                      src={menu.imageUrl}
                      alt={menu.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                      <svg className="h-24 w-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
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
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                          {menu.name}
                        </h1>
                        {menu.description && (
                          <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                            {menu.description}
                          </p>
                        )}
                      </div>
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm ${
                        menu.isActive 
                          ? 'bg-success-500 text-white dark:bg-success-600' 
                          : 'bg-gray-400 text-white dark:bg-gray-600'
                      }`}>
                        <span className={`h-2 w-2 rounded-full ${menu.isActive ? 'bg-white' : 'bg-gray-200'}`}></span>
                        {menu.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  {/* Price Cards */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-900/80">
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Regular Price
                      </p>
                      <p className="mt-1.5 text-2xl font-bold text-gray-900 dark:text-white">
                        {formatPrice(menu.price)}
                      </p>
                    </div>
                    
                    {menu.isPromo && menu.promoPrice && (
                      <div className={`rounded-lg border p-4 shadow-sm transition-all hover:shadow-md ${
                        isPromoActive()
                          ? 'border-orange-300 bg-linear-to-br from-orange-50 to-orange-100 dark:border-orange-700 dark:from-orange-900/30 dark:to-orange-800/20'
                          : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900/80'
                      }`}>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                            Promo Price
                          </p>
                          {isPromoActive() && (
                            <span className="inline-flex items-center rounded-full bg-orange-500 px-2 py-0.5 text-xs font-semibold text-white">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="mt-1.5 text-2xl font-bold text-orange-700 dark:text-orange-400">
                          {formatPrice(menu.promoPrice)}
                        </p>
                        <p className="mt-2 text-xs font-medium text-gray-600 dark:text-gray-400">
                          {formatDate(menu.promoStartDate)} - {formatDate(menu.promoEndDate)}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => router.push(`/admin/dashboard/menu/${menuId}/edit`)}
                      className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-brand-600 hover:shadow-md"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit Menu
                    </button>
                    <button
                      onClick={() => router.push("/admin/dashboard/menu")}
                      className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow-md dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      Back to Menu
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Category Card */}
          <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-white/3">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100 dark:bg-brand-900/30">
                <svg className="h-5 w-5 text-brand-600 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Category
                </h3>
                <p className="mt-1 text-base font-semibold text-gray-900 dark:text-white truncate">
                  {categoryNames}
                </p>
              </div>
            </div>
          </div>

          {/* Stock Card */}
          {menu.trackStock && (
            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-white/3">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <svg className="h-5 w-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Stock Management
                  </h3>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold shadow-sm ${
                      (menu.stockQty || 0) > 10
                        ? 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400'
                        : (menu.stockQty || 0) > 0
                        ? 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400'
                        : 'bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400'
                    }`}>
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      {menu.stockQty || 0} pcs
                    </span>
                    {menu.autoResetStock && (
                      <span className="inline-flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Daily reset: {menu.dailyStockTemplate || 0}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Addon Categories Section */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/3">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Addon Categories
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {menu.addonCategories?.length || 0} addon categor{menu.addonCategories?.length === 1 ? 'y' : 'ies'} linked to this menu
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {menu.addonCategories && menu.addonCategories.length > 0 && (
                <button
                  onClick={() => setShowViewAddonsModal(true)}
                  className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 shadow-sm transition-all hover:bg-blue-100 hover:shadow-md dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/40"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View Details
                </button>
              )}
              <button
                onClick={() => setShowManageAddonsModal(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-600 hover:shadow-md"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Manage Addons
              </button>
            </div>
          </div>

          {!menu.addonCategories || menu.addonCategories.length === 0 ? (
            <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 py-16 text-center dark:border-gray-700 dark:bg-gray-900/50">
              <div className="flex justify-center">
                <div className="rounded-full bg-gray-200 p-4 dark:bg-gray-800">
                  <svg className="h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
              </div>
              <h4 className="mt-4 text-base font-semibold text-gray-900 dark:text-white">
                No Addon Categories Yet
              </h4>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Get started by adding addon categories to enhance this menu item
              </p>
              <button
                onClick={() => setShowManageAddonsModal(true)}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-brand-600 hover:shadow-md"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add First Addon Category
              </button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {menu.addonCategories.map((mac) => (
                <div
                  key={mac.addonCategoryId}
                  className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-900/80"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="flex-1 text-base font-bold text-gray-900 dark:text-white">
                        {mac.addonCategory.name}
                      </h4>
                      {mac.isRequired && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-500 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
                          Required
                        </span>
                      )}
                    </div>
                    
                    {mac.addonCategory.description && (
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {mac.addonCategory.description}
                      </p>
                    )}
                    
                    <div className="mt-3 flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-800/50">
                      <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-gray-400">
                        <span>Min: {mac.addonCategory.minSelection}</span>
                        <span className="text-gray-400">•</span>
                        <span>Max: {mac.addonCategory.maxSelection || '∞'}</span>
                      </div>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-2.5 py-1 text-xs font-bold text-brand-700 dark:bg-brand-900/30 dark:text-brand-400">
                        {mac.addonCategory.addonItems?.length || 0} items
                      </span>
                    </div>
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
