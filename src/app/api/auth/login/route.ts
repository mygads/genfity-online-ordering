/**
 * POST /api/auth/login
 * User login endpoint
 * 
 * Request Body:
 * {
 *   "email": "admin@genfity.com",
 *   "password": "Admin@123456"
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "user": { id, name, email, role },
 *     "accessToken": "jwt-token",
 *     "refreshToken": "refresh-token",
 *     "expiresIn": 3600
 *   },
 *   "message": "Login successful",
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
    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      throw new ValidationError(
        'Email and password are required',
        ERROR_CODES.VALIDATION_FAILED
      );
    }

    // Get device info and IP from request
    const userAgent = request.headers.get('user-agent') || 'Unknown';
    const ipAddress = 
      request.headers.get('x-forwarded-for')?.split(',')[0] || 
      request.headers.get('x-real-ip') || 
      'Unknown';

    // Call AuthService login
    const result = await authService.login(
      { email, password },
      userAgent,
      ipAddress
    );

    // Return success response
    return successResponse(result, 'Login successful', 200);
  } catch (error) {
    return handleError(error);
  }
}
