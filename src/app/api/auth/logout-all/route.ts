/**
 * POST /api/auth/logout-all
 * Logout from all devices (revoke all sessions)
 * 
 * Headers:
 * Authorization: Bearer <token>
 * 
 * Response:
 * {
 *   "success": true,
 *   "data": null,
 *   "message": "Logged out from all devices successfully",
 *   "statusCode": 200
 * }
 */

import { NextRequest } from 'next/server';
import authService from '@/lib/services/AuthService';
import { successResponse } from '@/lib/middleware/errorHandler';
import { withAuth } from '@/lib/middleware/auth';
import type { AuthContext } from '@/lib/types/auth';

async function logoutAllHandler(request: NextRequest, authContext: AuthContext) {
  // Revoke all sessions
  await authService.logoutAll(authContext.userId);

  return successResponse(
    null,
    'Logged out from all devices successfully',
    200
  );
}

export const POST = withAuth(logoutAllHandler);
