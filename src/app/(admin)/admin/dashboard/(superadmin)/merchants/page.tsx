"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { useToast } from "@/hooks/useToast";
import ToastContainer from "@/components/ui/ToastContainer";
import ConfirmDialog from "@/components/modals/ConfirmDialog";

interface Merchant {
  id: string;
  code: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  isActive: boolean;
  createdAt: string;
}

export default function MerchantsPage() {
  const router = useRouter();
  const { toasts, success: showSuccess, error: showError } = useToast();
  
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeOnly, setActiveOnly] = useState(false);
  
  // Delete confirmation state
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    merchantId: "",
    merchantName: "",
  });

  // Fetch merchants from API
  const fetchMerchants = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("accessToken");
      if (!token) {
        router.push("/auth/signin");
        return;
      }

      const url = activeOnly 
        ? "/api/admin/merchants?activeOnly=true"
        : "/api/admin/merchants";

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/auth/signin");
          return;
        }
        throw new Error("Failed to fetch merchants");
      }

      const data = await response.json();
      
      // Handle response format: { success: true, data: { merchants: [...] } }
      if (data.success && data.data && Array.isArray(data.data.merchants)) {
        setMerchants(data.data.merchants);
      } else if (Array.isArray(data.data)) {
        // Fallback if API returns data directly
        setMerchants(data.data);
      } else {
        setMerchants([]);
      }
    } catch (err) {
      console.error("Fetch merchants error:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMerchants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeOnly]);

  // Toggle merchant status
  const handleToggleStatus = async (merchantId: string) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      const response = await fetch(`/api/admin/merchants/${merchantId}/toggle`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to toggle merchant status");
      }

      // Refresh merchants list
      fetchMerchants();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to toggle status");
    }
  };

  // Show delete confirmation dialog
  const handleDelete = (merchantId: string, merchantName: string) => {
    setDeleteDialog({
      isOpen: true,
      merchantId,
      merchantName,
    });
  };

  // Confirm delete merchant
  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      const response = await fetch(`/api/admin/merchants/${deleteDialog.merchantId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete merchant");
      }

      // Close dialog and refresh list
      setDeleteDialog({ isOpen: false, merchantId: "", merchantName: "" });
      fetchMerchants();
      showSuccess("Success", "Merchant deleted successfully");
    } catch (err) {
      showError("Error", err instanceof Error ? err.message : "Failed to delete merchant");
      setDeleteDialog({ isOpen: false, merchantId: "", merchantName: "" });
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setDeleteDialog({ isOpen: false, merchantId: "", merchantName: "" });
  };

  return (
    <div>
      <ToastContainer toasts={toasts} />
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Delete Merchant"
        message={`Are you sure you want to delete "${deleteDialog.merchantName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
      <PageBreadcrumb pageTitle="Merchants Management" />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="mb-5">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            All Merchants
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage restaurant merchants and their settings
          </p>
        </div>
        {/* Actions Bar */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={activeOnly}
                onChange={(e) => setActiveOnly(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500 dark:border-gray-700"
              />
              <span>Active Only</span>
            </label>
            <button
              onClick={fetchMerchants}
              className="h-9 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-300 dark:hover:bg-white/[0.05]"
            >
              Refresh
            </button>
          </div>
          <button
            onClick={() => router.push("/admin/dashboard/merchants/create")}
            className="h-11 rounded-lg bg-brand-500 px-6 text-sm font-medium text-white hover:bg-brand-600 focus:outline-none focus:ring-3 focus:ring-brand-500/20"
          >
            + Create Merchant
          </button>
        </div>

          {/* Loading State */}
          {loading && (
            <div className="py-10 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
              <p className="mt-2 text-sm text-body-color">Loading merchants...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

        {/* Merchants Table */}
        {!loading && !error && (
          <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-white/[0.05]">
            <div className="max-w-full overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50 text-left dark:border-white/[0.05] dark:bg-white/[0.02]">
                    <th className="px-5 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400">
                      Code
                    </th>
                    <th className="px-5 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400">
                      Merchant Name
                    </th>
                    <th className="px-5 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400">
                      Email
                    </th>
                    <th className="px-5 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400">
                      Phone
                    </th>
                    <th className="px-5 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400">
                      Status
                    </th>
                    <th className="px-5 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {merchants.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-10 text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">No merchants found</p>
                        <button
                          onClick={() => router.push("/admin/dashboard/merchants/create")}
                          className="mt-4 text-sm text-brand-500 hover:text-brand-600 hover:underline dark:text-brand-400"
                        >
                          Create your first merchant
                        </button>
                      </td>
                    </tr>
                  ) : (
                    merchants.map((merchant) => (
                      <tr key={merchant.id}>
                        <td className="px-5 py-4">
                          <span className="font-mono text-sm text-gray-600 dark:text-gray-400">
                            {merchant.code}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                            {merchant.name}
                          </p>
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">{merchant.email}</td>
                        <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">{merchant.phone}</td>
                        <td className="px-5 py-4">
                          <button
                            onClick={() => handleToggleStatus(merchant.id)}
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                              merchant.isActive
                                ? "bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400"
                                : "bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400"
                            }`}
                          >
                            {merchant.isActive ? "Active" : "Inactive"}
                          </button>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => router.push(`/admin/dashboard/merchants/${merchant.id}`)}
                              className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                              title="View Details"
                            >
                              <svg
                                className="h-5 w-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => router.push(`/admin/dashboard/merchants/${merchant.id}/edit`)}
                              className="text-orange-500 hover:text-orange-600 dark:text-orange-400"
                              title="Edit"
                            >
                              <svg
                                className="h-5 w-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(merchant.id, merchant.name)}
                              className="text-error-600 hover:text-error-700 dark:text-error-400"
                              title="Delete"
                            >
                              <svg
                                className="h-5 w-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Summary */}
        {!loading && !error && merchants.length > 0 && (
          <div className="mt-5 flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing {merchants.length} merchant{merchants.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
