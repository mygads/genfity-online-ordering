import UserAddressCard from "@/components/user-profile/UserAddressCard";
import UserInfoCard from "@/components/user-profile/UserInfoCard";
import UserMetaCard from "@/components/user-profile/UserMetaCard";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Profile | GENFITY Admin Dashboard",
  description:
    "View and manage your profile information - GENFITY Admin",
};

/**
 * Profile Page (Accessible to all admin roles)
 * Route: /admin/dashboard/profile
 * Access: SUPER_ADMIN, MERCHANT_OWNER, MERCHANT_STAFF
 * 
 * @description
 * User profile page using template design components.
 * Displays user meta information, personal details, and address.
 * 
 * @specification
 * - Uses UserMetaCard for avatar and basic info
 * - Uses UserInfoCard for detailed personal information
 * - Uses UserAddressCard for address management
 * - Template-based card layout and styling
 */
export default function ProfilePage() {
  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Profile
        </h3>
        <div className="space-y-6">
          <UserMetaCard />
          <UserInfoCard />
          <UserAddressCard />
        </div>
      </div>
    </div>
  );
}
