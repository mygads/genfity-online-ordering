/**
 * POST /api/auth/change-password
 * Change user password
 * 
 * Headers:
 * Authorization: Bearer <token>
 * 
 * Request Body:
 * {
 *   "currentPassword": "old-password",
 *   "newPassword": "new-password"
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "data": null,
 *   "message": "Password changed successfully",
 *   "statusCode": 200
 * }
 */

import { NextRequest } from 'next/server';
import authService from '@/lib/services/AuthService';
import { successResponse } from '@/lib/middleware/errorHandler';
import { withAuth } from '@/lib/middleware/auth';
import { ValidationError, ERROR_CODES } from '@/lib/constants/errors';
import type { AuthContext } from '@/lib/types/auth';

async function changePasswordHandler(request: NextRequest, authContext: AuthContext) {
  // Parse request body
  const body = await request.json();
  const { currentPassword, newPassword } = body;

  // Validate required fields
  if (!currentPassword || !newPassword) {
    throw new ValidationError(
      'Current password and new password are required',
      ERROR_CODES.VALIDATION_FAILED
    );
  }

  // Change password
  await authService.changePassword(
    authContext.userId,
    currentPassword,
    newPassword
  );

  return successResponse(null, 'Password changed successfully', 200);
}

export const POST = withAuth(changePasswordHandler);
