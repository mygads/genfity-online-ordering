import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/db/client'; // ✅ Use Prisma client

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '30d'; // 30 days for customers

interface LoginRequestBody {
  email: string;
  name?: string;
  phone?: string;
}

/**
 * Customer Login/Register Endpoint
 * POST /api/public/auth/customer-login
 * 
 * @specification STEP_02_AUTHENTICATION_JWT.txt - Customer Auth Flow
 * 
 * @description
 * Seamless authentication for customers:
 * - If email exists → login (update name/phone if provided)
 * - If email doesn't exist → auto-register as CUSTOMER
 * 
 * @security
 * - Email validation (RFC 5322 format)
 * - Prisma parameterized queries (SQL injection safe)
 * - JWT token with 30-day expiry
 * - No password required for customers
 * 
 * @returns {Object} Standard response format
 * @returns {boolean} success - Operation status
 * @returns {Object} data - User data + JWT token
 * @returns {string} data.accessToken - JWT token for authentication
 * @returns {number} data.expiresAt - Token expiry timestamp (milliseconds)
 * @returns {Object} data.user - User profile data
 * @returns {string} message - Success/error message
 * @returns {number} statusCode - HTTP status code
 */
export async function POST(request: NextRequest) {
  try {
    const body: LoginRequestBody = await request.json();
    const { email, name, phone } = body;

    // ========================================
    // VALIDATION (STEP_02 Section 3.1)
    // ========================================
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'VALIDATION_ERROR',
          message: 'Email tidak valid',
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    const emailTrimmed = email.trim().toLowerCase();
    if (!emailTrimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
      return NextResponse.json(
        {
          success: false,
          error: 'VALIDATION_ERROR',
          message: 'Format email tidak valid',
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    // ========================================
    // DATABASE QUERY (STEP_01 users table)
    // ========================================
    
    /**
     * ✅ Check if user exists using Prisma
     * 
     * @security Parameterized query (SQL injection safe)
     * @performance Uses index on email column
     * 
     * Replaces:
     * const existingUser = await db.query(
     *   `SELECT id, email, name, phone, role, is_active 
     *    FROM users 
     *    WHERE email = $1 AND role = 'CUSTOMER'`,
     *   [emailTrimmed]
     * );
     */
    const existingUser = await prisma.user.findFirst({
      where: {
        email: emailTrimmed,
        role: 'CUSTOMER',
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        isActive: true,
      },
    });

    let userId: bigint;
    let userName: string;
    let userPhone: string | null;

    if (existingUser) {
      // ========================================
      // EXISTING USER - LOGIN FLOW
      // ========================================
      
      // Check if account is active
      if (!existingUser.isActive) {
        return NextResponse.json(
          {
            success: false,
            error: 'ACCOUNT_DISABLED',
            message: 'Akun Anda tidak aktif',
            statusCode: 403,
          },
          { status: 403 }
        );
      }

      userId = existingUser.id;
      userName = name?.trim() || existingUser.name;
      userPhone = phone?.trim() || existingUser.phone;

      // ✅ Update name/phone if provided and different
      if ((name && name.trim() !== existingUser.name) || (phone && phone.trim() !== existingUser.phone)) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            name: userName,
            phone: userPhone,
          },
        });
      }

    } else {
      // ========================================
      // NEW USER - REGISTER FLOW
      // ========================================
      
      // Name required for new registration
      if (!name || typeof name !== 'string' || !name.trim()) {
        return NextResponse.json(
          {
            success: false,
            error: 'VALIDATION_ERROR',
            message: 'Nama harus diisi untuk pendaftaran',
            statusCode: 400,
          },
          { status: 400 }
        );
      }

      /**
       * ✅ Create new customer using Prisma
       * 
       * @security No password required (email-based auth)
       * @default role='CUSTOMER', isActive=true
       */
      const newUser = await prisma.user.create({
        data: {
          email: emailTrimmed,
          name: name.trim(),
          phone: phone?.trim() || null,
          passwordHash: '', // No password for customers (magic link auth)
          role: 'CUSTOMER',
          isActive: true,
        },
        select: {
          id: true,
        },
      });

      userId = newUser.id;
      userName = name.trim();
      userPhone = phone?.trim() || null;
    }

    // ========================================
    // JWT GENERATION (STEP_02 Section 4.2)
    // ========================================
    
    /**
     * ✅ FIXED: JWT payload with correct field names
     * 
     * @specification STEP_02_AUTHENTICATION_JWT.txt - Token Structure
     * 
     * @security
     * - customerId: string (required by auth.ts verification)
     * - name: string (required by auth.ts verification)
     * - email: string (required by auth.ts verification)
     * - role: CUSTOMER (for authorization)
     * 
     * @critical
     * Field names MUST match CustomerTokenPayload interface in auth.ts:
     * - customerId (NOT userId)
     * - name (NOT optional)
     * - email
     */
    const payload = {
      customerId: userId.toString(), // ✅ Match auth.ts interface
      email: emailTrimmed,
      name: userName,                // ✅ Required by auth.ts
      role: 'CUSTOMER',
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

    return NextResponse.json(
      {
        success: true,
        data: {
          accessToken: token,
          expiresAt,
          user: {
            id: userId.toString(),
            email: emailTrimmed,
            name: userName,
            phone: userPhone,
            role: 'CUSTOMER',
          },
        },
        message: existingUser ? 'Login berhasil' : 'Akun berhasil dibuat',
        statusCode: 200,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Customer login error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'INTERNAL_ERROR',
        message: 'Terjadi kesalahan pada server',
        statusCode: 500,
      },
      { status: 500 }
    );
  }
}
