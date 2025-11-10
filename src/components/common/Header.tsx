/**
 * Header Component
 * Reusable fixed header with back button, title, and actions
 */

"use client";

import React from "react";
import { useRouter } from "next/navigation";

export interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightActions?: React.ReactNode;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  onBack,
  rightActions,
  className = "",
}) => {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-[100]
        h-14 bg-white dark:bg-gray-900
        border-b border-primary dark:border-gray-800
        ${className}
      `}
    >
      <div className="relative flex h-full items-center justify-between px-4 max-w-[428px] mx-auto">
        {/* Left Section - Back Button */}
        <div className="flex items-center min-w-[40px]">
          {showBack && (
            <button
              onClick={handleBack}
              className="flex h-10 w-10 items-center justify-center rounded-full text-primary-dark hover:bg-secondary transition-colors dark:text-gray-400 dark:hover:bg-gray-800"
              aria-label="Kembali"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 18L9 12L15 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Center Section - Title */}
        {title && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[200px]">
            <h1 className="text-base font-semibold text-primary-dark dark:text-white truncate text-center">
              {title}
            </h1>
          </div>
        )}

        {/* Right Section - Actions */}
        <div className="flex items-center gap-2 min-w-[40px] justify-end">
          {rightActions}
        </div>
      </div>
    </header>
  );
};

export default Header;
