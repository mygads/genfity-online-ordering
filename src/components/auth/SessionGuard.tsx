"use client";

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getAdminAuth, clearAdminAuth } from '@/lib/utils/adminAuth';

/**
 * Session Guard Component
 * Periodically checks token expiry and auto-redirects to login when expired
 * 
 * Features:
 * - Checks token every 60 seconds
 * - Auto-clears localStorage on expiry
 * - Redirects to /admin/login with error message
 * - Only active on admin routes
 * 
 * Usage:
 * Add to admin layout:
 * ```tsx
 * <SessionGuard />
 * ```
 */
export default function SessionGuard() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Only run on admin routes (excluding login page)
    if (!pathname.startsWith('/admin') || pathname === '/admin/login') {
      return;
    }

    // Check immediately on mount
    checkSession();

    // Then check every 60 seconds
    const interval = setInterval(checkSession, 60000); // 60 seconds

    return () => clearInterval(interval);
  }, [pathname, router]);

  function checkSession() {
    // Check if token exists and is valid
    const auth = getAdminAuth({ skipRedirect: true });

    // If no auth or expired, redirect to login
    if (!auth) {
      clearAdminAuth();
      
      // Redirect to login with expired error
      if (typeof window !== 'undefined' && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login?error=expired';
      }
    }
  }

  // This component doesn't render anything
  return null;
}
