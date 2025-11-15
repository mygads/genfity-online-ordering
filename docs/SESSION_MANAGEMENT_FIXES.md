# Session Management Fixes - Implementation Documentation

## Overview
This document details the session management improvements implemented to fix token expiry handling and session duration issues in the GENFITY online ordering system.

## Issues Fixed

### 1. Customer Session Duration
**Problem:** Customer sessions were set to 90 days instead of the required 1 year.

**Solution:** Updated `AuthService.ts` `getSessionDuration()` method.

**File:** `src/lib/services/AuthService.ts`
```typescript
// BEFORE
if (role === 'CUSTOMER') {
  return 90 * 24 * 60 * 60; // 7776000 seconds = 90 days
}

// AFTER
if (role === 'CUSTOMER') {
  return 365 * 24 * 60 * 60; // 31536000 seconds = 365 days = 1 year
}
```

### 2. No Auto-Redirect on Token Expiry
**Problem:** When tokens expired, users remained on the page with broken functionality. No automatic redirect to login page.

**Solution:** Implemented multi-layered token expiry detection and auto-redirect system.

#### Components Added:

1. **SessionGuard Component** (`src/components/auth/SessionGuard.tsx`)
   - Client-side component that checks token expiry every 60 seconds
   - Auto-clears localStorage when expired
   - Auto-redirects to `/admin/login?error=expired`
   - Integrated into admin dashboard layout

2. **Enhanced adminAuth Utility** (`src/lib/utils/adminAuth.ts`)
   - Updated `getAdminAuth()` to auto-redirect on expiry
   - Added optional `skipRedirect` parameter for programmatic checks
   - Automatically clears localStorage and cookies when token expires

3. **useAdminAuth Hook** (`src/hooks/useAdminAuth.ts`)
   - React hook for components to check auth state
   - Returns `{ auth, isLoading, isAuthenticated, user, accessToken }`
   - Auto-checks expiry every 60 seconds
   - Includes `useTokenExpiryWarning()` hook for showing warnings before expiry

4. **API Client Utility** (`src/lib/utils/apiClient.ts`)
   - `fetchWithAuth()` - Automatically adds Authorization header
   - `fetchJsonWithAuth()` - Returns typed JSON responses
   - Auto-redirects to login on 401 (Unauthorized) responses
   - Clears localStorage on token expiry

5. **Admin Login Error Handling** (`src/app/(admin)/admin/login/page.tsx`)
   - Added error message mapping for `?error=expired` query parameter
   - Shows user-friendly message: "Sesi Anda telah berakhir. Silakan login kembali."

## Session Duration Rules (Final)

| Role | Default Duration | With "Remember Me" |
|------|------------------|-------------------|
| CUSTOMER | 1 year (365 days) | N/A |
| SUPER_ADMIN | 1 day | 7 days |
| MERCHANT_OWNER | 1 day | 7 days |
| MERCHANT_STAFF | 1 day | 7 days |

## Token Expiry Flow

### Server-Side (API Routes)
1. Request arrives at API endpoint
2. `withAuth()` middleware extracts token from Authorization header
3. `authService.verifyToken()` checks:
   - JWT signature validity
   - JWT expiration time
   - Session status in database (ACTIVE/REVOKED/EXPIRED)
4. If invalid/expired: Returns 401 response
5. If valid: Proceeds with request

### Client-Side (React Components)
1. **On Mount & Every 60 Seconds:**
   - `SessionGuard` component checks `getAdminAuth()`
   - Verifies `expiresAt` timestamp against current time
   - If expired: Clears localStorage + redirects to login

2. **On API Calls:**
   - `fetchWithAuth()` adds Authorization header
   - If response is 401: Clears localStorage + redirects to login

3. **User Actions:**
   - Components can use `useAdminAuth()` hook to check auth state
   - Hook returns `isAuthenticated` and auto-updates on expiry

## Auto-Redirect Behavior

### Admin Routes (`/admin/*`)
- Token expires → Clear localStorage → Redirect to `/admin/login?error=expired`
- Shows message: "Sesi Anda telah berakhir. Silakan login kembali."

### Customer Routes
- Token expires → Clear localStorage only (no redirect)
- Customer stays on current page
- Next API call will prompt login if required

## Implementation Details

### SessionGuard Integration
**File:** `src/app/(admin)/admin/dashboard/layout.tsx`
```tsx
import SessionGuard from "@/components/auth/SessionGuard";

export default function AdminDashboardLayout({ children }) {
  return (
    <div className="min-h-screen xl:flex">
      <SessionGuard /> {/* Added here */}
      <AppSidebar />
      {/* ... */}
    </div>
  );
}
```

### Using the API Client
**Example Usage:**
```tsx
import { fetchJsonWithAuth } from '@/lib/utils/apiClient';

// In a component
async function fetchMerchants() {
  try {
    const data = await fetchJsonWithAuth('/api/admin/merchants');
    // Auto-adds Authorization header
    // Auto-redirects on 401
    return data;
  } catch (error) {
    console.error('Failed to fetch merchants:', error);
  }
}
```

### Using the useAdminAuth Hook
**Example Usage:**
```tsx
import { useAdminAuth } from '@/hooks/useAdminAuth';

export default function MyComponent() {
  const { auth, isLoading, isAuthenticated, user } = useAdminAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Not authenticated</div>;

  return <div>Welcome, {user?.name}</div>;
}
```

### Using the Token Expiry Warning
**Example Usage:**
```tsx
import { useTokenExpiryWarning } from '@/hooks/useAdminAuth';

export default function ExpiryWarningBanner() {
  const isExpiringSoon = useTokenExpiryWarning(5); // 5 minutes warning

  if (!isExpiringSoon) return null;

  return (
    <div className="bg-yellow-50 p-4">
      Your session will expire in less than 5 minutes. 
      Please save your work.
    </div>
  );
}
```

## Security Improvements

1. **Automatic Cleanup:** All auth data cleared on expiry (localStorage + cookies)
2. **Multi-Layer Validation:** JWT expiry + database session status + client-side checks
3. **Consistent Behavior:** All API calls use same auth mechanism via `fetchWithAuth()`
4. **User Feedback:** Clear error messages on expiry (`?error=expired`)

## Testing Checklist

- [ ] Customer login → Verify 1-year session created
- [ ] Admin login (no remember me) → Verify 1-day session
- [ ] Admin login (with remember me) → Verify 7-day session
- [ ] Wait for token expiry → Verify auto-redirect to login
- [ ] API call with expired token → Verify 401 and redirect
- [ ] SessionGuard checks every 60 seconds
- [ ] Error message shown on login page after expiry
- [ ] localStorage cleared on expiry

## Files Modified/Created

### Modified
1. `src/lib/services/AuthService.ts` - Session duration fix
2. `src/lib/utils/adminAuth.ts` - Auto-redirect on expiry
3. `src/app/(admin)/admin/dashboard/layout.tsx` - SessionGuard integration
4. `src/app/(admin)/admin/login/page.tsx` - Error handling

### Created
1. `src/components/auth/SessionGuard.tsx` - Periodic expiry checker
2. `src/hooks/useAdminAuth.ts` - Auth state hook
3. `src/lib/utils/apiClient.ts` - Fetch wrapper with auto-auth

## Migration Notes

### For Developers
1. **Replace manual fetch calls with `fetchWithAuth()`:**
   ```tsx
   // OLD
   const response = await fetch('/api/admin/merchants', {
     headers: {
       'Authorization': `Bearer ${token}`,
     },
   });

   // NEW
   import { fetchJsonWithAuth } from '@/lib/utils/apiClient';
   const data = await fetchJsonWithAuth('/api/admin/merchants');
   ```

2. **Use `useAdminAuth()` instead of manual localStorage checks:**
   ```tsx
   // OLD
   const token = localStorage.getItem('accessToken');
   const user = JSON.parse(localStorage.getItem('user'));

   // NEW
   const { auth, isAuthenticated, user } = useAdminAuth();
   ```

3. **SessionGuard is automatically active** in admin dashboard layout (no action needed)

## Environment Variables
No new environment variables required. Uses existing:
- `JWT_SECRET` - JWT signing secret
- `JWT_EXPIRY` - Access token expiry (default: 3600 seconds)
- `JWT_REFRESH_EXPIRY` - Refresh token expiry

## Future Improvements
1. **Refresh Token Auto-Renewal:** Implement silent token refresh before expiry
2. **Session Extension:** Allow users to extend session from warning banner
3. **Activity Tracking:** Track user activity and extend session on activity
4. **HttpOnly Cookies:** Move to server-side cookie management for better security
5. **WebSocket Notifications:** Real-time session expiry notifications

## Conclusion
All session management issues have been resolved:
✅ Customer session duration: 90 days → 1 year
✅ Auto-redirect on token expiry implemented
✅ localStorage cleared automatically on expiry
✅ Multi-layer expiry detection (server + client)
✅ User-friendly error messages
✅ Reusable hooks and utilities for consistent behavior

---
**Version:** 1.0  
**Date:** 2025-01-09  
**Author:** GitHub Copilot
