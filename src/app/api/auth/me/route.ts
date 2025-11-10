/**
 * GET /api/auth/me
 * Get current authenticated user info
 * 
 * Headers:
 * Authorization: Bearer <token>
 * 
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "user": { id, name, email, role, phoneNumber, isActive, ... },
 *     "session": { id, deviceInfo, ipAddress, lastActivityAt }
 *   },
 *   "message": "User retrieved successfully",
 *   "statusCode": 200
 * }
 */

import { NextRequest } from 'next/server';
import authService from '@/lib/services/AuthService';
import { successResponse } from '@/lib/middleware/errorHandler';
import { withAuth } from '@/lib/middleware/auth';
import { AuthContext } from '@/lib/types/auth';

async function meHandler(request: NextRequest, authContext: AuthContext) {
  // Get user with session details
  const result = await authService.getUserBySession(authContext.sessionId);

  return successResponse(result, 'User retrieved successfully', 200);
}

export const GET = withAuth(meHandler);
