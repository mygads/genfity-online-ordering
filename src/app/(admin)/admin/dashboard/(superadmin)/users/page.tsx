/**
 * Users Management Page (Super Admin Only)
 * Route: /admin/dashboard/users
 * Access: SUPER_ADMIN only
 */

import { Metadata } from 'next';
import { requireSuperAdmin } from '@/lib/auth/serverAuth';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';

export const metadata: Metadata = {
  title: 'User Management | GENFITY Admin Dashboard',
  description: 'Manage all users in the system',
};

export const dynamic = 'force-dynamic';

export default async function UsersPage() {
  // Require SUPER_ADMIN role - will redirect if unauthorized
  await requireSuperAdmin();
  return (
    <div>
      <PageBreadcrumb pageTitle="User Management" />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="mb-5">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            All Users
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage all users, roles, and permissions across the system
          </p>
        </div>

        {/* Actions Bar */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="text"
              placeholder="Search users..."
              className="h-10 w-64 rounded-lg border border-gray-200 bg-white px-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
            />
            <select className="h-10 rounded-lg border border-gray-200 bg-white px-4 text-sm text-gray-800 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90">
              <option value="">All Roles</option>
              <option value="SUPER_ADMIN">Super Admin</option>
              <option value="MERCHANT_OWNER">Merchant Owner</option>
              <option value="MERCHANT_STAFF">Merchant Staff</option>
              <option value="CUSTOMER">Customer</option>
            </select>
            <select className="h-10 rounded-lg border border-gray-200 bg-white px-4 text-sm text-gray-800 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <button className="h-11 rounded-lg bg-brand-500 px-6 text-sm font-medium text-white hover:bg-brand-600 focus:outline-none focus:ring-3 focus:ring-brand-500/20">
            + Add New User
          </button>
        </div>

        {/* Users Table */}
        <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-white/[0.05]">
          <div className="max-w-full overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-left dark:border-white/[0.05] dark:bg-white/[0.02]">
                  <th className="px-5 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400">
                    User
                  </th>
                  <th className="px-5 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400">
                    Email
                  </th>
                  <th className="px-5 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400">
                    Role
                  </th>
                  <th className="px-5 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400">
                    Merchant
                  </th>
                  <th className="px-5 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400">
                    Status
                  </th>
                  <th className="px-5 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400">
                    Registered
                  </th>
                  <th className="px-5 py-3 text-end text-xs font-medium text-gray-500 dark:text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {/* Sample Data - Replace with actual data */}
                <tr>
                  <td className="px-5 py-4">
                    <div className="text-sm font-medium text-gray-800 dark:text-white/90">System Admin</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">ID: 1</div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">admin@genfity.com</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                      Super Admin
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400">-</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex rounded-full bg-success-100 px-2.5 py-0.5 text-xs font-medium text-success-700 dark:bg-success-900/30 dark:text-success-400">
                      Active
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">01 Jan 2025</td>
                  <td className="px-5 py-4 text-end">
                    <button className="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400">
                      Edit
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="px-5 py-4">
                    <div className="text-sm font-medium text-gray-800 dark:text-white/90">John Doe</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">ID: 2</div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">john@example.com</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex rounded-full bg-blue-light-100 px-2.5 py-0.5 text-xs font-medium text-blue-light-700 dark:bg-blue-light-900/30 dark:text-blue-light-400">
                      Merchant Owner
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-800 dark:text-white/90">Simple Restaurant</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex rounded-full bg-success-100 px-2.5 py-0.5 text-xs font-medium text-success-700 dark:bg-success-900/30 dark:text-success-400">
                      Active
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">10 Nov 2025</td>
                  <td className="px-5 py-4 text-end">
                    <button className="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400">
                      Edit
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-5 flex flex-col gap-4 border-t border-gray-200 pt-4 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">Showing 1 to 10 of 100 results</p>
          <div className="flex items-center gap-2">
            <button className="h-9 rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.05]">
              Previous
            </button>
            <button className="h-9 rounded-lg bg-brand-500 px-3 text-sm font-medium text-white">
              1
            </button>
            <button className="h-9 rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.05]">
              2
            </button>
            <button className="h-9 rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.05]">
              3
            </button>
            <button className="h-9 rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.05]">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
