/**
 * POST /api/auth/first-time-password
 * Change password for first-time login (no auth token required)
 * 
 * Request Body:
 * {
 *   "email": "user@example.com",
 *   "currentPassword": "temporary-password",
 *   "newPassword": "new-password"
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "user": { ... },
 *     "token": "jwt-token"
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
    const { email, currentPassword, newPassword } = body;

    // Validate required fields
    if (!email || !currentPassword || !newPassword) {
      throw new ValidationError(
        'Email, current password, and new password are required',
        ERROR_CODES.VALIDATION_FAILED
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ValidationError('Invalid email format', ERROR_CODES.INVALID_EMAIL);
    }

    // Validate new password strength (min 8 chars, 1 uppercase, 1 lowercase, 1 number)
    if (newPassword.length < 8) {
      throw new ValidationError(
        'Password must be at least 8 characters long',
        ERROR_CODES.VALIDATION_FAILED
      );
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
    if (!passwordRegex.test(newPassword)) {
      throw new ValidationError(
        'Password must contain at least one uppercase letter, one lowercase letter, and one number',
        ERROR_CODES.VALIDATION_FAILED
      );
    }

    // Change password and login
    const result = await authService.firstTimePasswordChange(
      email,
      currentPassword,
      newPassword
    );

    return successResponse(result, 'Password changed successfully', 200);
  } catch (error) {
    return handleError(error);
  }
}
