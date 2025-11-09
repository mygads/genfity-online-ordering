/**
 * POST /api/auth/refresh
 * Refresh access token using refresh token
 * 
 * Request Body:
 * {
 *   "refreshToken": "refresh-token-here"
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "accessToken": "new-jwt-token",
 *     "refreshToken": "new-refresh-token",
 *     "expiresIn": 3600
 *   },
 *   "message": "Token refreshed successfully",
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
    const { refreshToken } = body;

    // Validate required field
    if (!refreshToken) {
      throw new ValidationError(
        'Refresh token is required',
        ERROR_CODES.VALIDATION_FAILED
      );
    }

    // Call AuthService refresh
    const result = await authService.refreshAccessToken(refreshToken);

    // Return success response
    return successResponse(result, 'Token refreshed successfully', 200);
  } catch (error) {
    return handleError(error);
  }
}
