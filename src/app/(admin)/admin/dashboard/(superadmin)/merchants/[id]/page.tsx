"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";

interface MerchantDetails {
  id: string;
  code: string;
  name: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  logoUrl: string | null;
  isActive: boolean;
  currency: string;
  createdAt: string;
  openingHours: Array<{
    dayOfWeek: number;
    openTime: string;
    closeTime: string;
    isClosed: boolean;
  }>;
  merchantUsers: Array<{
    role: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  }>;
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function MerchantDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const merchantId = params?.id as string;

  const [merchant, setMerchant] = useState<MerchantDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMerchant = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("accessToken");
        if (!token) {
          router.push("/auth/signin");
          return;
        }

        const response = await fetch(`/api/admin/merchants/${merchantId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            router.push("/auth/signin");
            return;
          }
          throw new Error("Failed to fetch merchant");
        }

        const data = await response.json();
        
        // Handle response format: { success: true, data: { merchant: {...} } }
        if (data.success && data.data && data.data.merchant) {
          setMerchant(data.data.merchant);
        } else if (data.data) {
          // Fallback if API returns merchant directly
          setMerchant(data.data);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        console.error("Fetch merchant error:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (merchantId) {
      fetchMerchant();
    }
  }, [merchantId, router]);

  const handleToggleStatus = async () => {
    if (!merchant) return;

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      const response = await fetch(`/api/admin/merchants/${merchant.id}/toggle`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to toggle status");
      }

      // Update local state
      setMerchant({ ...merchant, isActive: !merchant.isActive });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to toggle status");
    }
  };

  if (loading) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Merchant Details" />
        <div className="mt-6 py-10 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-brand-500 border-r-transparent"></div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading merchant details...</p>
        </div>
      </div>
    );
  }

  if (error || !merchant) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Merchant Details" />
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">Error</h3>
          <div className="rounded-lg bg-error-50 p-4 dark:bg-error-900/20">
            <p className="text-sm text-error-600 dark:text-error-400">
              {error || "Merchant not found"}
            </p>
          </div>
          <button
            onClick={() => router.push("/admin/dashboard/merchants")}
            className="mt-4 text-sm text-brand-500 hover:text-brand-600 hover:underline dark:text-brand-400"
          >
            ← Back to Merchants
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle={merchant.name} />

      <ComponentCard title="Merchant Details" className="space-y-6">
        {/* Basic Information */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
          <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">Basic Information</h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-500 dark:text-gray-400">
                Merchant Code
              </label>
              <p className="font-mono text-lg font-semibold text-brand-500">
                {merchant.code}
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-500 dark:text-gray-400">
                Status
              </label>
              <button
                onClick={handleToggleStatus}
                className={`inline-flex rounded-full px-4 py-1.5 text-sm font-medium ${
                  merchant.isActive
                    ? "bg-success-100 text-success-700 dark:bg-success-900/20 dark:text-success-400"
                    : "bg-error-100 text-error-700 dark:bg-error-900/20 dark:text-error-400"
                }`}
              >
                {merchant.isActive ? "Active" : "Inactive"}
              </button>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-500 dark:text-gray-400">
                Merchant Name
              </label>
              <p className="text-gray-800 dark:text-white/90">{merchant.name}</p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-500 dark:text-gray-400">
                Email
              </label>
              <p className="text-gray-800 dark:text-white/90">{merchant.email}</p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-500 dark:text-gray-400">
                Phone
              </label>
              <p className="text-gray-800 dark:text-white/90">{merchant.phone}</p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-500 dark:text-gray-400">
                Currency
              </label>
              <p className="text-gray-800 dark:text-white/90">{merchant.currency}</p>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-500 dark:text-gray-400">
                Address
              </label>
              <p className="text-gray-800 dark:text-white/90">{merchant.address}</p>
            </div>

            {merchant.description && (
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-500 dark:text-gray-400">
                  Description
                </label>
                <p className="text-gray-800 dark:text-white/90">{merchant.description}</p>
              </div>
            )}
          </div>

          <div className="mt-6 flex gap-3 border-t border-gray-200 pt-6 dark:border-gray-800">
            <button
              onClick={() => router.push(`/admin/dashboard/merchants/${merchant.id}/edit`)}
              className="h-11 rounded-lg bg-brand-500 px-6 text-sm font-medium text-white hover:bg-brand-600 focus:outline-none focus:ring-3 focus:ring-brand-500/20"
            >
              Edit Merchant
            </button>
            <button
              onClick={() => router.push("/admin/dashboard/merchants")}
              className="h-11 rounded-lg border border-gray-200 bg-white px-6 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-300 dark:hover:bg-white/[0.05]"
            >
              Back to List
            </button>
          </div>
        </div>

        {/* Opening Hours */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
          <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">Opening Hours</h3>
          {merchant.openingHours && merchant.openingHours.length > 0 ? (
            <div className="space-y-3">
              {merchant.openingHours.map((hour) => (
                <div
                  key={hour.dayOfWeek}
                  className="flex items-center justify-between border-b border-gray-100 py-3 last:border-0 dark:border-gray-800"
                >
                  <span className="font-medium text-gray-800 dark:text-white/90">
                    {DAYS[hour.dayOfWeek]}
                  </span>
                  {hour.isClosed ? (
                    <span className="text-error-600 dark:text-error-400">Closed</span>
                  ) : (
                    <span className="text-gray-800 dark:text-white/90">
                      {hour.openTime} - {hour.closeTime}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No opening hours configured</p>
          )}
        </div>

        {/* Staff/Owners */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
          <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">Staff & Owners</h3>
          {merchant.merchantUsers && merchant.merchantUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-50 text-left dark:bg-gray-900/50">
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                      Name
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                      Email
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                      Role
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {merchant.merchantUsers.map((mu, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 text-sm text-gray-800 dark:text-white/90">
                        {mu.user.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800 dark:text-white/90">
                        {mu.user.email}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                            mu.role === "OWNER"
                              ? "bg-brand-100 text-brand-700 dark:bg-brand-900/20 dark:text-brand-400"
                              : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                          }`}
                        >
                          {mu.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No staff members found</p>
          )}
        </div>

        {/* Metadata */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
          <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">Metadata</h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-500 dark:text-gray-400">
                Merchant ID
              </label>
              <p className="font-mono text-sm text-gray-800 dark:text-white/90">
                {merchant.id}
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-500 dark:text-gray-400">
                Created At
              </label>
              <p className="text-gray-800 dark:text-white/90">
                {new Date(merchant.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </div>
      </ComponentCard>
    </div>
  );
}
