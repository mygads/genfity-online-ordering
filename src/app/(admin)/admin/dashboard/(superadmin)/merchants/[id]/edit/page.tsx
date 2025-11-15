"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { useToast } from "@/hooks/useToast";
import ToastContainer from "@/components/ui/ToastContainer";

interface MerchantFormData {
  name: string;
  code: string;
  description: string;
  address: string;
  email: string;
  phoneNumber: string;
}

export default function EditMerchantPage() {
  const router = useRouter();
  const params = useParams();
  const merchantId = params?.id as string;
  const { toasts, success: showSuccess, error: showError } = useToast();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<MerchantFormData>({
    name: "",
    code: "",
    description: "",
    address: "",
    email: "",
    phoneNumber: "",
  });

  useEffect(() => {
    const fetchMerchant = async () => {
      try {
        setLoading(true);
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
          throw new Error("Failed to fetch merchant");
        }

        const data = await response.json();
        // API returns { success: true, data: { merchant: {...} } }
        const merchant = data.data?.merchant || data.data;
        
        console.log('Loaded merchant data:', merchant); // Debug log
        
        setFormData({
          name: merchant.name || "",
          code: merchant.code || "",
          description: merchant.description || "",
          address: merchant.address || "",
          email: merchant.email || "",
          phoneNumber: merchant.phone || "",
        });
      } catch (err) {
        showError("Error", err instanceof Error ? err.message : "Failed to load merchant data");
      } finally {
        setLoading(false);
      }
    };

    if (merchantId) {
      fetchMerchant();
    }
  }, [merchantId, router, showError]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        router.push("/auth/signin");
        return;
      }

      const response = await fetch(`/api/admin/merchants/${merchantId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update merchant");
      }

      showSuccess("Success", "Merchant updated successfully!");
      
      setTimeout(() => {
        router.push(`/admin/dashboard/merchants/${merchantId}`);
      }, 1500);
    } catch (err) {
      showError("Error", err instanceof Error ? err.message : "Failed to update merchant");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Edit Merchant" />
        <div className="mt-6 py-10 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-brand-500 border-r-transparent"></div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading merchant...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ToastContainer toasts={toasts} />
      <PageBreadcrumb pageTitle="Edit Merchant" />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="mb-5">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Update Merchant Information
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Edit merchant details and settings
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Merchant Code <span className="text-error-500">*</span>
              </label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                required
                disabled
                className="h-11 w-full rounded-lg border border-gray-200 bg-gray-50 px-4 text-sm text-gray-500 cursor-not-allowed dark:border-gray-800 dark:bg-gray-800 dark:text-gray-400"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Merchant code cannot be changed</p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Merchant Name <span className="text-error-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="h-11 w-full rounded-lg border border-gray-200 bg-white px-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email <span className="text-error-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="h-11 w-full rounded-lg border border-gray-200 bg-white px-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Phone Number <span className="text-error-500">*</span>
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                className="h-11 w-full rounded-lg border border-gray-200 bg-white px-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Address <span className="text-error-500">*</span>
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                rows={3}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
              />
            </div>

            <div className="flex items-center justify-end gap-4 border-t border-gray-200 pt-6 dark:border-gray-800">
              <button
                type="button"
                onClick={() => router.back()}
                className="h-11 rounded-lg border border-gray-200 bg-white px-6 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-300 dark:hover:bg-white/[0.05]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="h-11 rounded-lg bg-brand-500 px-6 text-sm font-medium text-white hover:bg-brand-600 focus:outline-none focus:ring-3 focus:ring-brand-500/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? "Updating..." : "Update Merchant"}
              </button>
            </div>
        </form>
      </div>
    </div>
  );
}
