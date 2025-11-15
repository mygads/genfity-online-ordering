/**
 * Analytics Page (Super Admin Only)
 * Route: /admin/dashboard/analytics
 * Access: SUPER_ADMIN only
 */

import { Metadata } from 'next';
import { requireSuperAdmin } from '@/lib/auth/serverAuth';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import StatisticsChart from "@/components/ecommerce/StatisticsChart";

export const metadata: Metadata = {
  title: 'Analytics | GENFITY Admin Dashboard',
  description: 'System-wide analytics and insights',
};

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
  // Require SUPER_ADMIN role - will redirect if unauthorized
  await requireSuperAdmin();
  
  return (
    <div>
      <PageBreadcrumb pageTitle="Analytics" />

      {/* Date Range Selector */}
      <div className="mb-6 flex items-center gap-3">
        <select className="h-10 rounded-lg border border-gray-200 bg-white px-4 text-sm text-gray-800 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90">
          <option value="today">Today</option>
          <option value="week">Last 7 Days</option>
          <option value="month">Last 30 Days</option>
          <option value="year">This Year</option>
          <option value="custom">Custom Range</option>
        </select>
      </div>

      {/* Key Metrics Grid */}
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Revenue */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
          <div className="mb-2 text-sm text-gray-500 dark:text-gray-400">Total Revenue</div>
          <div className="text-2xl font-bold text-gray-800 dark:text-white/90">Rp 125,400,000</div>
          <div className="mt-2 text-sm text-success-600 dark:text-success-400">+12.5% from last month</div>
        </div>

        {/* Total Orders */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
          <div className="mb-2 text-sm text-gray-500 dark:text-gray-400">Total Orders</div>
          <div className="text-2xl font-bold text-gray-800 dark:text-white/90">4,892</div>
          <div className="mt-2 text-sm text-success-600 dark:text-success-400">+8.2% from last month</div>
        </div>

        {/* Active Merchants */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
          <div className="mb-2 text-sm text-gray-500 dark:text-gray-400">Active Merchants</div>
          <div className="text-2xl font-bold text-gray-800 dark:text-white/90">24</div>
          <div className="mt-2 text-sm text-blue-light-600 dark:text-blue-light-400">2 new this month</div>
        </div>

        {/* Total Users */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
          <div className="mb-2 text-sm text-gray-500 dark:text-gray-400">Total Users</div>
          <div className="text-2xl font-bold text-gray-800 dark:text-white/90">1,283</div>
          <div className="mt-2 text-sm text-success-600 dark:text-success-400">+15.3% from last month</div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="mb-6">
        <StatisticsChart />
      </div>

      {/* Top Merchants & Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top Merchants by Revenue */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
          <h2 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">
            Top Merchants by Revenue
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-800 dark:text-white/90">Simple Restaurant</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">245 orders</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-800 dark:text-white/90">Rp 45,200,000</div>
                <div className="text-xs text-success-600 dark:text-success-400">+18%</div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-800 dark:text-white/90">Coffee Memories</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">198 orders</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-800 dark:text-white/90">Rp 32,800,000</div>
                <div className="text-xs text-success-600 dark:text-success-400">+12%</div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-800 dark:text-white/90">Bakso Malang</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">167 orders</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-800 dark:text-white/90">Rp 28,500,000</div>
                <div className="text-xs text-success-600 dark:text-success-400">+9%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
          <h2 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 h-2 w-2 rounded-full bg-success-500"></div>
              <div className="flex-1">
                <div className="text-sm text-gray-800 dark:text-white/90">
                  New merchant <span className="font-medium">Fried Chicken</span>{' '}
                  registered
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 h-2 w-2 rounded-full bg-blue-light-500"></div>
              <div className="flex-1">
                <div className="text-sm text-gray-800 dark:text-white/90">
                  <span className="font-medium">Simple Restaurant</span> updated
                  menu
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">5 hours ago</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 h-2 w-2 rounded-full bg-warning-500"></div>
              <div className="flex-1">
                <div className="text-sm text-gray-800 dark:text-white/90">
                  Large order (Rp 2,500,000) from{' '}
                  <span className="font-medium">Coffee Memories</span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">1 day ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
