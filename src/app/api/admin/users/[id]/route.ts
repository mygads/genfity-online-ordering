/**
 * GET /api/admin/users/:id
 * Get user details
 * 
 * PUT /api/admin/users/:id
 * Update user details
 * 
 * DELETE /api/admin/users/:id
 * Delete user (soft delete)
 */

import { NextRequest } from 'next/server';
import { successResponse } from '@/lib/middleware/errorHandler';
import { withSuperAdmin } from '@/lib/middleware/auth';
import { AuthContext } from '@/lib/types/auth';
import userRepository from '@/lib/repositories/UserRepository';
import { validateEmail } from '@/lib/utils/validators';
import { NotFoundError, ERROR_CODES } from '@/lib/constants/errors';

/**
 * GET handler - Get user by ID
 */
async function getUserHandler(
  request: NextRequest,
  authContext: AuthContext,
  context: { params: Promise<Record<string, string>> }
) {
  const params = await context.params;
  const userId = BigInt(params.id);

  const user = await userRepository.findById(userId);
  if (!user) {
    throw new NotFoundError('User not found', ERROR_CODES.USER_NOT_FOUND);
  }

  return successResponse({ user }, 'User retrieved successfully', 200);
}

/**
 * PUT handler - Update user
 */
async function updateUserHandler(
  request: NextRequest,
  authContext: AuthContext,
  context: { params: Promise<Record<string, string>> }
) {
  const params = await context.params;
  const userId = BigInt(params.id);
  const body = await request.json();

  // Validate user exists
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new NotFoundError('User not found', ERROR_CODES.USER_NOT_FOUND);
  }

  // Validate email if provided
  if (body.email) {
    validateEmail(body.email);
  }

  // Update user
  const updateData: Record<string, unknown> = {};
  if (body.name !== undefined) updateData.name = body.name;
  if (body.email !== undefined) updateData.email = body.email;
  if (body.phone !== undefined) updateData.phone = body.phone;
  if (body.role !== undefined) updateData.role = body.role;
  if (body.isActive !== undefined) updateData.isActive = body.isActive;

  const updated = await userRepository.update(userId, updateData);

  return successResponse({ user: updated }, 'User updated successfully', 200);
}

/**
 * DELETE handler - Delete user
 */
async function deleteUserHandler(
  request: NextRequest,
  authContext: AuthContext,
  context: { params: Promise<Record<string, string>> }
) {
  const params = await context.params;
  const userId = BigInt(params.id);

  // Validate user exists
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new NotFoundError('User not found', ERROR_CODES.USER_NOT_FOUND);
  }

  // Soft delete user (set isActive = false)
  await userRepository.update(userId, { isActive: false });

  return successResponse(null, 'User deleted successfully', 200);
}

export const GET = withSuperAdmin(getUserHandler);
export const PUT = withSuperAdmin(updateUserHandler);
export const DELETE = withSuperAdmin(deleteUserHandler);
