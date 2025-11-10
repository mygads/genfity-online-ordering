/**
 * Admin Authentication Utilities
 * Handles localStorage operations for admin authentication
 * 
 * Features:
 * - JWT token storage and retrieval
 * - Session management
 * - Role-based access control
 * - Auto token expiration check
 * 
 * Security:
 * - Token stored in localStorage (consider httpOnly cookies for production)
 * - Automatic expiration validation
 * - Role validation (SUPER_ADMIN, MERCHANT_OWNER, MERCHANT_STAFF)
 */

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'MERCHANT_OWNER' | 'MERCHANT_STAFF';
  merchantId?: string;
}

export interface AdminAuth {
  accessToken: string;
  refreshToken: string;
  user: AdminUser;
  expiresAt: string;
}

// Storage key
const ADMIN_AUTH_KEY = 'genfity_admin_auth';

/**
 * Get admin auth data from localStorage
 * Returns null if not authenticated or token expired
 */
export function getAdminAuth(): AdminAuth | null {
  if (typeof window === 'undefined') return null;

  try {
    const data = localStorage.getItem(ADMIN_AUTH_KEY);
    if (!data) return null;

    const auth = JSON.parse(data) as AdminAuth;

    // Check if token expired
    if (new Date(auth.expiresAt) < new Date()) {
      clearAdminAuth();
      return null;
    }

    return auth;
  } catch (error) {
    console.error('Error getting admin auth:', error);
    return null;
  }
}

/**
 * Save admin auth data to localStorage and cookies
 */
export function saveAdminAuth(auth: AdminAuth): void {
  if (typeof window === 'undefined') return;

  try {
    // Save to localStorage
    localStorage.setItem(ADMIN_AUTH_KEY, JSON.stringify(auth));
    
    // Save token to cookie for middleware (httpOnly would be better but can't set from client)
    const expiresIn = Math.floor((new Date(auth.expiresAt).getTime() - Date.now()) / 1000);
    document.cookie = `auth_token=${auth.accessToken}; path=/; max-age=${expiresIn}; SameSite=Strict`;
  } catch (error) {
    console.error('Error saving admin auth:', error);
  }
}

/**
 * Clear admin auth data from localStorage and cookies
 */
export function clearAdminAuth(): void {
  if (typeof window === 'undefined') return;

  try {
    // Clear localStorage
    localStorage.removeItem(ADMIN_AUTH_KEY);
    
    // Clear cookie
    document.cookie = 'auth_token=; path=/; max-age=0';
  } catch (error) {
    console.error('Error clearing admin auth:', error);
  }
}

/**
 * Check if user is authenticated as admin
 */
export function isAdminAuthenticated(): boolean {
  return getAdminAuth() !== null;
}

/**
 * Get admin access token
 */
export function getAdminToken(): string | null {
  const auth = getAdminAuth();
  return auth?.accessToken ?? null;
}

/**
 * Get admin user data
 */
export function getAdminUser(): AdminUser | null {
  const auth = getAdminAuth();
  return auth?.user ?? null;
}

/**
 * Check if user has specific role
 */
export function hasRole(role: AdminUser['role'] | AdminUser['role'][]): boolean {
  const user = getAdminUser();
  if (!user) return false;

  if (Array.isArray(role)) {
    return role.includes(user.role);
  }

  return user.role === role;
}

/**
 * Check if user is Super Admin
 */
export function isSuperAdmin(): boolean {
  return hasRole('SUPER_ADMIN');
}

/**
 * Check if user is Merchant Owner
 */
export function isMerchantOwner(): boolean {
  return hasRole('MERCHANT_OWNER');
}

/**
 * Check if user is Merchant Staff
 */
export function isMerchantStaff(): boolean {
  return hasRole('MERCHANT_STAFF');
}
