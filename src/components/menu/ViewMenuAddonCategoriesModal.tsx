"use client";

import React, { useState } from "react";

interface AddonItem {
  id: string;
  name: string;
  description: string | null;
  price: string | number;
  inputType: string;
  isActive: boolean;
  trackStock: boolean;
  stockQty: number | null;
  displayOrder: number;
}

interface AddonCategory {
  id: string;
  name: string;
  description: string | null;
  minSelection: number;
  maxSelection: number | null;
  addonItems: AddonItem[];
}

interface MenuAddonCategory {
  addonCategoryId: string;
  isRequired: boolean;
  displayOrder: number;
  addonCategory: AddonCategory;
}

interface ViewMenuAddonCategoriesModalProps {
  show: boolean;
  menuName: string;
  addonCategories: MenuAddonCategory[];
  currency: string;
  onClose: () => void;
}

export default function ViewMenuAddonCategoriesModal({
  show,
  menuName,
  addonCategories,
  currency,
  onClose,
}: ViewMenuAddonCategoriesModalProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  if (!show) return null;

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return `${currency} ${numPrice.toLocaleString("en-AU", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Sort by displayOrder
  const sortedCategories = [...addonCategories].sort((a, b) => {
    const orderA = a.displayOrder ?? 999;
    const orderB = b.displayOrder ?? 999;
    if (orderA !== orderB) return orderA - orderB;
    return a.addonCategory.name.localeCompare(b.addonCategory.name);
  });

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-5xl rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6 dark:border-gray-800">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Addon Categories - {menuName}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {addonCategories.length} categor{addonCategories.length === 1 ? 'y' : 'ies'} • Click to expand items
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {sortedCategories.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No addon categories linked to this menu
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedCategories.map((mac, index) => {
                const isExpanded = expandedCategory === mac.addonCategoryId;
                const sortedItems = [...(mac.addonCategory.addonItems || [])].sort((a, b) => {
                  const orderA = a.displayOrder ?? 999;
                  const orderB = b.displayOrder ?? 999;
                  if (orderA !== orderB) return orderA - orderB;
                  return a.name.localeCompare(b.name);
                });

                return (
                  <div
                    key={mac.addonCategoryId}
                    className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900/50"
                  >
                    {/* Category Header */}
                    <button
                      onClick={() => toggleCategory(mac.addonCategoryId)}
                      className="w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700 dark:bg-brand-900/20 dark:text-brand-400">
                              {index + 1}
                            </span>
                            <h4 className="font-semibold text-gray-800 dark:text-white/90">
                              {mac.addonCategory.name}
                            </h4>
                            {mac.isRequired && (
                              <span className="inline-flex rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/20 dark:text-red-400">
                                Required
                              </span>
                            )}
                          </div>
                          {mac.addonCategory.description && (
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                              {mac.addonCategory.description}
                            </p>
                          )}
                          <div className="mt-2 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                            <span>Min: {mac.addonCategory.minSelection}</span>
                            <span>Max: {mac.addonCategory.maxSelection || '∞'}</span>
                            <span className="font-medium text-brand-600 dark:text-brand-400">
                              {sortedItems.length} items
                            </span>
                          </div>
                        </div>
                        <svg
                          className={`h-5 w-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>

                    {/* Expanded Items */}
                    {isExpanded && sortedItems.length > 0 && (
                      <div className="border-t border-gray-200 p-4 dark:border-gray-700">
                        <div className="overflow-x-auto">
                          <table className="w-full table-auto">
                            <thead>
                              <tr className="bg-gray-50 text-left dark:bg-gray-900/50">
                                <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                                  #
                                </th>
                                <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                                  Name
                                </th>
                                <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                                  Type
                                </th>
                                <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                                  Price
                                </th>
                                <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                                  Stock
                                </th>
                                <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                                  Status
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                              {sortedItems.map((item, itemIndex) => (
                                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30">
                                  <td className="px-3 py-3 text-xs text-gray-500 dark:text-gray-400">
                                    {itemIndex + 1}
                                  </td>
                                  <td className="px-3 py-3">
                                    <div>
                                      <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                        {item.name}
                                      </p>
                                      {item.description && (
                                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                                          {item.description}
                                        </p>
                                      )}
                                    </div>
                                  </td>
                                  <td className="px-3 py-3">
                                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                                      item.inputType === "SELECT"
                                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                                        : "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400"
                                    }`}>
                                      {item.inputType === "SELECT" ? "Select" : "Quantity"}
                                    </span>
                                  </td>
                                  <td className="px-3 py-3">
                                    <span className="text-sm font-semibold text-gray-800 dark:text-white/90">
                                      {formatPrice(item.price)}
                                    </span>
                                  </td>
                                  <td className="px-3 py-3">
                                    {item.trackStock ? (
                                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                                        (item.stockQty || 0) > 10
                                          ? 'bg-success-100 text-success-700 dark:bg-success-900/20 dark:text-success-400'
                                          : (item.stockQty || 0) > 0
                                          ? 'bg-warning-100 text-warning-700 dark:bg-warning-900/20 dark:text-warning-400'
                                          : 'bg-error-100 text-error-700 dark:bg-error-900/20 dark:text-error-400'
                                      }`}>
                                        {item.stockQty || 0}
                                      </span>
                                    ) : (
                                      <span className="text-xs text-gray-500 dark:text-gray-400">-</span>
                                    )}
                                  </td>
                                  <td className="px-3 py-3">
                                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                                      item.isActive 
                                        ? 'bg-success-100 text-success-700 dark:bg-success-900/20 dark:text-success-400' 
                                        : 'bg-error-100 text-error-700 dark:bg-error-900/20 dark:text-error-400'
                                    }`}>
                                      {item.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {isExpanded && sortedItems.length === 0 && (
                      <div className="border-t border-gray-200 p-4 text-center dark:border-gray-700">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          No items in this category
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 dark:border-gray-800">
          <button
            onClick={onClose}
            className="h-11 w-full rounded-lg bg-brand-500 text-sm font-medium text-white hover:bg-brand-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
