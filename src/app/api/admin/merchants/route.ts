/**
 * GET /api/admin/merchants
 * List all merchants (Super Admin only)
 * 
 * Query Parameters:
 * - activeOnly: boolean (optional) - Filter active merchants only
 * 
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "merchants": [...]
 *   },
 *   "message": "Merchants retrieved successfully",
 *   "statusCode": 200
 * }
 * 
 * POST /api/admin/merchants
 * Create new merchant with owner account (Super Admin only)
 * 
 * Request Body:
 * {
 *   "name": "Restaurant Name",
 *   "code": "RESTAURANT",
 *   "description": "Description",
 *   "address": "Address",
 *   "phoneNumber": "+61400000000",
 *   "email": "restaurant@example.com",
 *   "taxRate": 10,
 *   "taxIncluded": false,
 *   "ownerName": "Owner Name",
 *   "ownerEmail": "owner@example.com",
 *   "ownerPhone": "+61400000001"
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "merchant": {...},
 *     "owner": {...},
 *     "tempPassword": "TempPass123!"
 *   },
 *   "message": "Merchant created successfully",
 *   "statusCode": 201
 * }
 */

import { NextRequest } from 'next/server';
import merchantService from '@/lib/services/MerchantService';
import { successResponse } from '@/lib/middleware/errorHandler';
import { withSuperAdmin } from '@/lib/middleware/auth';
import type { CreateMerchantInput } from '@/lib/services/MerchantService';

async function getMerchantsHandler(request: NextRequest) {
  // Get query parameters
  const { searchParams } = new URL(request.url);
  const activeOnly = searchParams.get('activeOnly') === 'true';

  // Get all merchants
  const merchants = await merchantService.getAllMerchants(activeOnly);

  return successResponse(
    { merchants },
    'Merchants retrieved successfully',
    200
  );
}

async function createMerchantHandler(request: NextRequest) {
  // Parse request body
  const body: CreateMerchantInput = await request.json();

  // Create merchant
  const result = await merchantService.createMerchant(body);

  return successResponse(result, 'Merchant created successfully', 201);
}

export const GET = withSuperAdmin(getMerchantsHandler);
export const POST = withSuperAdmin(createMerchantHandler);
