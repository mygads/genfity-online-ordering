"use client";

import React from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';

export interface FilterPill {
  id: string;
  label: string;
  value: string | boolean | number;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'gray';
  icon?: React.ReactNode;
}

interface QuickFilterPillsProps {
  filters: FilterPill[];
  activeFilters: string[];
  onChange: (activeFilters: string[]) => void;
  multiSelect?: boolean;
  className?: string;
}

export default function QuickFilterPills({
  filters,
  activeFilters,
  onChange,
  multiSelect = true,
  className = '',
}: QuickFilterPillsProps) {
  const handleToggle = (filterId: string) => {
    if (multiSelect) {
      if (activeFilters.includes(filterId)) {
        onChange(activeFilters.filter((id) => id !== filterId));
      } else {
        onChange([...activeFilters, filterId]);
      }
    } else {
      // Single select mode
      if (activeFilters.includes(filterId)) {
        onChange([]);
      } else {
        onChange([filterId]);
      }
    }
  };

  const getColorClasses = (color: FilterPill['color'] = 'gray', isActive: boolean) => {
    if (!isActive) {
      return 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:bg-gray-700';
    }

    const colorMap = {
      blue: 'border-blue-500 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:border-blue-400 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/40',
      green: 'border-green-500 bg-green-50 text-green-700 hover:bg-green-100 dark:border-green-400 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/40',
      red: 'border-red-500 bg-red-50 text-red-700 hover:bg-red-100 dark:border-red-400 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/40',
      yellow: 'border-yellow-500 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 dark:border-yellow-400 dark:bg-yellow-900/30 dark:text-yellow-300 dark:hover:bg-yellow-900/40',
      purple: 'border-purple-500 bg-purple-50 text-purple-700 hover:bg-purple-100 dark:border-purple-400 dark:bg-purple-900/30 dark:text-purple-300 dark:hover:bg-purple-900/40',
      gray: 'border-gray-500 bg-gray-50 text-gray-700 hover:bg-gray-100 dark:border-gray-400 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600',
    };

    return colorMap[color];
  };

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filters:</span>
      
      {filters.map((filter) => {
        const isActive = activeFilters.includes(filter.id);
        
        return (
          <button
            key={filter.id}
            onClick={() => handleToggle(filter.id)}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all ${getColorClasses(
              filter.color,
              isActive
            )}`}
          >
            {filter.icon && <span className="shrink-0">{filter.icon}</span>}
            <span>{filter.label}</span>
            {isActive && (
              <FaCheck className="h-3 w-3 shrink-0" />
            )}
          </button>
        );
      })}

      {activeFilters.length > 0 && (
        <button
          onClick={() => onChange([])}
          className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        >
          <FaTimes className="h-3 w-3" />
          Clear All
        </button>
      )}
    </div>
  );
}

// Preset filter configurations for common use cases
export const menuFilterPresets = {
  status: [
    { id: 'active', label: 'Active', value: true, color: 'green' as const, icon: <FaCheck className="h-3 w-3" /> },
    { id: 'inactive', label: 'Inactive', value: false, color: 'red' as const, icon: <FaTimes className="h-3 w-3" /> },
  ],
  stock: [
    { id: 'in-stock', label: 'In Stock', value: 'in-stock', color: 'green' as const },
    { id: 'low-stock', label: 'Low Stock', value: 'low-stock', color: 'yellow' as const },
    { id: 'out-of-stock', label: 'Out of Stock', value: 'out-of-stock', color: 'red' as const },
  ],
  promo: [
    { id: 'on-promo', label: 'On Promo', value: true, color: 'purple' as const },
    { id: 'regular-price', label: 'Regular Price', value: false, color: 'gray' as const },
  ],
};
