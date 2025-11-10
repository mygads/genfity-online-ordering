/**
 * GET /api/auth/sessions
 * Get all active sessions for current user
 * 
 * Headers:
 * Authorization: Bearer <token>
 * 
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "sessions": [
 *       {
 *         "id": "1",
 *         "deviceInfo": "Mozilla/5.0...",
 *         "ipAddress": "192.168.1.1",
 *         "lastActivityAt": "2025-01-09T10:00:00Z",
 *         "isCurrent": true
 *       }
 *     ]
 *   },
 *   "message": "Sessions retrieved successfully",
 *   "statusCode": 200
 * }
 */

import { NextRequest } from 'next/server';
import authService from '@/lib/services/AuthService';
import { successResponse } from '@/lib/middleware/errorHandler';
import { withAuth } from '@/lib/middleware/auth';
import { AuthContext } from '@/lib/types/auth';

async function sessionsHandler(request: NextRequest, authContext: AuthContext) {
  // Get all active sessions
  const sessions = await authService.getActiveSessions(authContext.userId);

  // Mark current session
  const sessionsWithCurrent = sessions.map(session => ({
    ...session,
    isCurrent: session.id === authContext.sessionId
  }));

  return successResponse(
    { sessions: sessionsWithCurrent },
    'Sessions retrieved successfully',
    200
  );
}

export const GET = withAuth(sessionsHandler);
