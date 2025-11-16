"use client";

import React from 'react';
import { FaClock, FaUser, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

interface ActivityLogEntry {
  id: string;
  action: 'created' | 'updated' | 'deleted' | 'activated' | 'deactivated';
  entity: 'menu' | 'category' | 'addon' | 'addon-item' | 'order';
  entityName: string;
  userName: string;
  timestamp: Date | string;
  details?: string;
}

interface ActivityLogWidgetProps {
  activities: ActivityLogEntry[];
  maxItems?: number;
  showViewAll?: boolean;
  onViewAll?: () => void;
  className?: string;
}

export default function ActivityLogWidget({
  activities,
  maxItems = 5,
  showViewAll = true,
  onViewAll,
  className = '',
}: ActivityLogWidgetProps) {
  const displayedActivities = activities.slice(0, maxItems);

  const getActionIcon = (action: ActivityLogEntry['action']) => {
    switch (action) {
      case 'created':
        return <FaPlus className="h-3 w-3 text-success-600 dark:text-success-400" />;
      case 'updated':
        return <FaEdit className="h-3 w-3 text-blue-600 dark:text-blue-400" />;
      case 'deleted':
        return <FaTrash className="h-3 w-3 text-error-600 dark:text-error-400" />;
      case 'activated':
        return <div className="h-2 w-2 rounded-full bg-success-500" />;
      case 'deactivated':
        return <div className="h-2 w-2 rounded-full bg-gray-400" />;
      default:
        return <FaEdit className="h-3 w-3 text-gray-600 dark:text-gray-400" />;
    }
  };

  const getActionColor = (action: ActivityLogEntry['action']) => {
    switch (action) {
      case 'created':
        return 'bg-success-100 text-success-700 dark:bg-success-900/20 dark:text-success-400';
      case 'updated':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      case 'deleted':
        return 'bg-error-100 text-error-700 dark:bg-error-900/20 dark:text-error-400';
      case 'activated':
        return 'bg-success-100 text-success-700 dark:bg-success-900/20 dark:text-success-400';
      case 'deactivated':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getEntityLabel = (entity: ActivityLogEntry['entity']) => {
    const labels: Record<ActivityLogEntry['entity'], string> = {
      menu: 'Menu',
      category: 'Category',
      addon: 'Addon Category',
      'addon-item': 'Addon Item',
      order: 'Order',
    };
    return labels[entity];
  };

  const formatTimestamp = (timestamp: Date | string) => {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className={`rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 ${className}`}>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FaClock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90">Recent Activity</h3>
        </div>
        {showViewAll && activities.length > maxItems && (
          <button
            onClick={onViewAll}
            className="text-xs font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
          >
            View All
          </button>
        )}
      </div>

      {/* Activity List */}
      {displayedActivities.length === 0 ? (
        <div className="py-8 text-center">
          <FaClock className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">No recent activity</p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayedActivities.map((activity, index) => (
            <div
              key={activity.id}
              className={`flex gap-3 rounded-lg border border-gray-100 bg-gray-50/50 p-3 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-800/50 dark:hover:bg-gray-800 ${
                index === 0 ? 'border-brand-200 bg-brand-50/30 dark:border-brand-900/50 dark:bg-brand-900/10' : ''
              }`}
            >
              {/* Icon */}
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${getActionColor(activity.action)}`}>
                {getActionIcon(activity.action)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 dark:text-white/90">
                      <span className="font-medium">{activity.action}</span>{' '}
                      <span className="text-gray-600 dark:text-gray-400">{getEntityLabel(activity.entity).toLowerCase()}</span>
                    </p>
                    <p className="mt-0.5 truncate text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {activity.entityName}
                    </p>
                    {activity.details && (
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                        {activity.details}
                      </p>
                    )}
                  </div>
                  <span className="shrink-0 text-xs text-gray-500 dark:text-gray-400">
                    {formatTimestamp(activity.timestamp)}
                  </span>
                </div>

                {/* User */}
                <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                  <FaUser className="h-3 w-3" />
                  <span>{activity.userName}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      {displayedActivities.length > 0 && (
        <div className="mt-4 border-t border-gray-200 pt-3 dark:border-gray-800">
          <p className="text-center text-xs text-gray-500 dark:text-gray-400">
            Showing {displayedActivities.length} of {activities.length} recent activities
          </p>
        </div>
      )}
    </div>
  );
}

// Compact version for dashboard widgets
export function ActivityLogCompact({ activities, maxItems = 3 }: { activities: ActivityLogEntry[]; maxItems?: number }) {
  const displayedActivities = activities.slice(0, maxItems);

  const getActionColor = (action: ActivityLogEntry['action']) => {
    switch (action) {
      case 'created': return 'text-success-600 dark:text-success-400';
      case 'updated': return 'text-blue-600 dark:text-blue-400';
      case 'deleted': return 'text-error-600 dark:text-error-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const formatTimestamp = (timestamp: Date | string) => {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    const now = new Date();
    const diffMins = Math.floor((now.getTime() - date.getTime()) / 60000);
    if (diffMins < 60) return `${diffMins}m`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h`;
    return `${Math.floor(diffHours / 24)}d`;
  };

  return (
    <div className="space-y-2">
      {displayedActivities.map((activity) => (
        <div key={activity.id} className="flex items-center gap-2 text-xs">
          <span className={`shrink-0 font-medium capitalize ${getActionColor(activity.action)}`}>
            {activity.action}
          </span>
          <span className="min-w-0 flex-1 truncate text-gray-700 dark:text-gray-300">
            {activity.entityName}
          </span>
          <span className="shrink-0 text-gray-500 dark:text-gray-400">
            {formatTimestamp(activity.timestamp)}
          </span>
        </div>
      ))}
    </div>
  );
}
