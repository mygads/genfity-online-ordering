/**
 * Session Repository
 * Handles user session management for JWT tracking
 */

import prisma from '@/lib/db/client';
import { Prisma } from '@prisma/client';

export class SessionRepository {
  /**
   * Create new session
   */
  async create(data: Prisma.UserSessionCreateInput) {
    return prisma.userSession.create({
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }

  /**
   * Find session by ID
   */
  async findById(id: bigint) {
    return prisma.userSession.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isActive: true,
          },
        },
      },
    });
  }

  /**
   * Find session by token
   */
  async findByToken(token: string) {
    return prisma.userSession.findUnique({
      where: { token },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isActive: true,
          },
        },
      },
    });
  }

  /**
   * Find active sessions by user ID
   */
  async findActiveByUserId(userId: bigint) {
    return prisma.userSession.findMany({
      where: {
        userId,
        status: 'ACTIVE',
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Update session
   */
  async update(id: bigint, data: {
    token?: string;
    status?: 'ACTIVE' | 'REVOKED' | 'EXPIRED';
    expiresAt?: Date;
  }) {
    return prisma.userSession.update({
      where: { id },
      data,
    });
  }

  /**
   * Update session status (for logout/revoke)
   */
  async updateStatus(id: bigint, status: 'ACTIVE' | 'REVOKED' | 'EXPIRED') {
    return prisma.userSession.update({
      where: { id },
      data: { status },
    });
  }

  /**
   * Revoke session by ID
   */
  async revoke(id: bigint) {
    return this.updateStatus(id, 'REVOKED');
  }

  /**
   * Revoke session by token
   */
  async revokeByToken(token: string) {
    return prisma.userSession.update({
      where: { token },
      data: { status: 'REVOKED' },
    });
  }

  /**
   * Revoke all sessions for a user
   */
  async revokeAllByUserId(userId: bigint) {
    return prisma.userSession.updateMany({
      where: {
        userId,
        status: 'ACTIVE',
      },
      data: {
        status: 'REVOKED',
      },
    });
  }

  /**
   * Delete expired sessions (cleanup)
   */
  async deleteExpired() {
    return prisma.userSession.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  }

  /**
   * Check if session is valid (active and not expired)
   */
  async isValid(id: bigint): Promise<boolean> {
    const session = await prisma.userSession.findUnique({
      where: { id },
      select: {
        status: true,
        expiresAt: true,
      },
    });

    if (!session) return false;
    if (session.status !== 'ACTIVE') return false;
    if (session.expiresAt < new Date()) return false;

    return true;
  }
}

const sessionRepository = new SessionRepository();
export default sessionRepository;
