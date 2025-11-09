/**
 * POST /api/auth/logout
 * User logout endpoint - revokes current session
 * 
 * Headers:
 * Authorization: Bearer <token>
 * 
 * Response:
 * {
 *   "success": true,
 *   "data": null,
 *   "message": "Logout successful",
 *   "statusCode": 200
 * }
 */

import { NextRequest } from 'next/server';
import authService from '@/lib/services/AuthService';
import { handleError, successResponse } from '@/lib/middleware/errorHandler';
import { withAuth } from '@/lib/middleware/auth';

async function logoutHandler(request: NextRequest, authContext: any) {
  // Revoke current session
  await authService.logout(authContext.sessionId);

  return successResponse(null, 'Logout successful', 200);
}

export const POST = withAuth(logoutHandler);
