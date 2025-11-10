/**
 * POST /api/admin/merchants/:id/toggle
 * Toggle merchant active status (Super Admin only)
 * 
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "merchant": {...}
 *   },
 *   "message": "Merchant status toggled successfully",
 *   "statusCode": 200
 * }
 */

import { NextRequest } from 'next/server';
import merchantService from '@/lib/services/MerchantService';
import { successResponse } from '@/lib/middleware/errorHandler';
import { withSuperAdmin } from '@/lib/middleware/auth';

async function toggleMerchantHandler(
  request: NextRequest,
  authContext: unknown,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const merchantId = BigInt(params.id);

  // Toggle merchant status
  const merchant = await merchantService.toggleMerchantStatus(merchantId);

  return successResponse(
    { merchant },
    'Merchant status toggled successfully',
    200
  );
}

export const POST = withSuperAdmin(toggleMerchantHandler);
