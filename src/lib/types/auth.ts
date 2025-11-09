/**
 * Authentication Types
 */

export type UserRole = 'SUPER_ADMIN' | 'MERCHANT_OWNER' | 'MERCHANT_STAFF' | 'CUSTOMER';
export type SessionStatus = 'ACTIVE' | 'REVOKED' | 'EXPIRED';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: bigint;
    name: string;
    email: string;
    role: UserRole;
  };
  accessToken: string;
  refreshToken?: string;
}

export interface JWTPayload {
  userId: bigint;
  sessionId: bigint;
  role: UserRole;
  email: string;
  iat?: number;
  exp?: number;
}

export interface RefreshTokenPayload {
  userId: bigint;
  sessionId: bigint;
  iat?: number;
  exp?: number;
}

export interface SessionData {
  id: bigint;
  userId: bigint;
  token: string;
  status: SessionStatus;
  expiresAt: Date;
  deviceInfo?: string | null;
  ipAddress?: string | null;
}

export interface AuthUser {
  id: bigint;
  name: string;
  email: string;
  role: UserRole;
  merchantId?: bigint;
}
