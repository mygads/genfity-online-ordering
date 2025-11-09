/**
 * POST /api/auth/first-time-password-change
 * Change password for users with mustChangePassword=true
 * Does not require JWT authentication
 * 
 * Request Body:
 * {
 *   "email": "user@example.com",
 *   "tempPassword": "TempPass123!",
 *   "newPassword": "NewSecurePass123!"
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "user": {
 *       "id": "1",
 *       "name": "User Name",
 *       "email": "user@example.com",
 *       "role": "MERCHANT_OWNER"
 *     },
 *     "accessToken": "eyJhbGci...",
 *     "refreshToken": "eyJhbGci..."
 *   },
 *   "message": "Password changed successfully",
 *   "statusCode": 200
 * }
 */

import { NextRequest } from 'next/server';
import authService from '@/lib/services/AuthService';
import { handleError, successResponse } from '@/lib/middleware/errorHandler';
import { ValidationError, ERROR_CODES } from '@/lib/constants/errors';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { email, tempPassword, newPassword } = body;

    // Validate required fields
    if (!email || !tempPassword || !newPassword) {
      throw new ValidationError(
        'Email, temp password, and new password are required',
        ERROR_CODES.VALIDATION_FAILED
      );
    }

    // Change password and get login tokens
    const result = await authService.firstTimePasswordChange(
      email,
      tempPassword,
      newPassword
    );

    return successResponse(result, 'Password changed successfully', 200);
  } catch (error) {
    return handleError(error);
  }
}
