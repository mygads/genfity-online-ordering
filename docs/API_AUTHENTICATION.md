# Authentication API Documentation

## Overview
This document describes all authentication endpoints for the GENFITY Online Ordering System.

**Base URL**: `http://localhost:3000/api/auth`

**Standard Response Format**:
```json
{
  "success": true|false,
  "data": { ... },
  "message": "Human readable message",
  "statusCode": 200
}
```

**Error Response Format**:
```json
{
  "success": false,
  "error": "ERROR_CODE",
  "message": "User-friendly error message",
  "statusCode": 400
}
```

---

## Endpoints

### 1. Login
**POST** `/api/auth/login`

Authenticate user and create new session.

**Request Body**:
```json
{
  "email": "admin@genfity.com",
  "password": "Admin@123456"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "1",
      "name": "Super Admin",
      "email": "admin@genfity.com",
      "role": "SUPER_ADMIN"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  },
  "message": "Login successful",
  "statusCode": 200
}
```

**Error Responses**:
- `400` - Validation error (missing email/password)
- `401` - Invalid credentials
- `401` - User inactive
- `500` - Internal server error

**Example**:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@genfity.com",
    "password": "Admin@123456"
  }'
```

---

### 2. Logout
**POST** `/api/auth/logout`

Revoke current session.

**Headers**:
```
Authorization: Bearer <access-token>
```

**Success Response** (200):
```json
{
  "success": true,
  "data": null,
  "message": "Logout successful",
  "statusCode": 200
}
```

**Error Responses**:
- `401` - Unauthorized (missing/invalid token)
- `500` - Internal server error

**Example**:
```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### 3. Get Current User
**GET** `/api/auth/me`

Get authenticated user information.

**Headers**:
```
Authorization: Bearer <access-token>
```

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "1",
      "name": "Super Admin",
      "email": "admin@genfity.com",
      "role": "SUPER_ADMIN",
      "phoneNumber": null,
      "isActive": true,
      "mustChangePassword": false,
      "createdAt": "2025-01-09T10:00:00Z",
      "lastLoginAt": "2025-01-09T12:00:00Z"
    },
    "session": {
      "id": "123",
      "deviceInfo": "Mozilla/5.0...",
      "ipAddress": "192.168.1.1",
      "lastActivityAt": "2025-01-09T12:30:00Z"
    }
  },
  "message": "User retrieved successfully",
  "statusCode": 200
}
```

**Error Responses**:
- `401` - Unauthorized
- `500` - Internal server error

**Example**:
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### 4. Refresh Token
**POST** `/api/auth/refresh`

Refresh access token using refresh token.

**Request Body**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  },
  "message": "Token refreshed successfully",
  "statusCode": 200
}
```

**Error Responses**:
- `400` - Validation error (missing refresh token)
- `401` - Invalid or expired refresh token
- `500` - Internal server error

**Example**:
```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN_HERE"
  }'
```

---

### 5. Change Password
**POST** `/api/auth/change-password`

Change authenticated user's password.

**Headers**:
```
Authorization: Bearer <access-token>
```

**Request Body**:
```json
{
  "currentPassword": "old-password",
  "newPassword": "new-password"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "data": null,
  "message": "Password changed successfully",
  "statusCode": 200
}
```

**Error Responses**:
- `400` - Validation error (missing fields)
- `400` - Invalid password format (less than 8 characters)
- `401` - Unauthorized
- `401` - Current password incorrect
- `500` - Internal server error

**Example**:
```bash
curl -X POST http://localhost:3000/api/auth/change-password \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "Admin@123456",
    "newPassword": "NewSecure@123"
  }'
```

---

### 6. Get Active Sessions
**GET** `/api/auth/sessions`

Get all active sessions for current user.

**Headers**:
```
Authorization: Bearer <access-token>
```

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "sessions": [
      {
        "id": "123",
        "deviceInfo": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)...",
        "ipAddress": "192.168.1.1",
        "lastActivityAt": "2025-01-09T12:30:00Z",
        "isCurrent": true
      },
      {
        "id": "124",
        "deviceInfo": "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0)...",
        "ipAddress": "192.168.1.100",
        "lastActivityAt": "2025-01-09T11:00:00Z",
        "isCurrent": false
      }
    ]
  },
  "message": "Sessions retrieved successfully",
  "statusCode": 200
}
```

**Error Responses**:
- `401` - Unauthorized
- `500` - Internal server error

**Example**:
```bash
curl -X GET http://localhost:3000/api/auth/sessions \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### 7. Revoke Session
**DELETE** `/api/auth/sessions/:sessionId`

Revoke specific session.

**Headers**:
```
Authorization: Bearer <access-token>
```

**Path Parameters**:
- `sessionId` - Session ID to revoke

**Success Response** (200):
```json
{
  "success": true,
  "data": null,
  "message": "Session revoked successfully",
  "statusCode": 200
}
```

**Error Responses**:
- `401` - Unauthorized
- `403` - Forbidden (session belongs to another user)
- `404` - Session not found
- `500` - Internal server error

**Example**:
```bash
curl -X DELETE http://localhost:3000/api/auth/sessions/124 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### 8. Logout All Devices
**POST** `/api/auth/logout-all`

Logout from all devices (revoke all sessions).

**Headers**:
```
Authorization: Bearer <access-token>
```

**Success Response** (200):
```json
{
  "success": true,
  "data": null,
  "message": "Logged out from all devices successfully",
  "statusCode": 200
}
```

**Error Responses**:
- `401` - Unauthorized
- `500` - Internal server error

**Example**:
```bash
curl -X POST http://localhost:3000/api/auth/logout-all \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Authentication Flow

### First-Time Login Flow
1. User submits email + password via `/api/auth/login`
2. System validates credentials
3. System creates session in database
4. System generates JWT access token (1 hour) + refresh token (7 days)
5. System returns tokens + user info
6. Client stores tokens (localStorage/sessionStorage)
7. Client includes `Authorization: Bearer <token>` in subsequent requests

### Token Refresh Flow
1. When access token expires (after 1 hour)
2. Client calls `/api/auth/refresh` with refresh token
3. System validates refresh token
4. System generates new access token + refresh token
5. Client updates stored tokens

### Logout Flow
1. Client calls `/api/auth/logout` with access token
2. System revokes current session in database
3. JWT becomes invalid (session check fails)
4. Client clears stored tokens

### Multi-Device Support
- Each login creates new session
- User can view all active sessions via `/api/auth/sessions`
- User can revoke individual sessions via `/api/auth/sessions/:sessionId`
- User can logout from all devices via `/api/auth/logout-all`

---

## Security Features

### Password Requirements
- Minimum 8 characters
- Must contain uppercase, lowercase, numbers, special characters
- Hashed with bcrypt (10 rounds)

### JWT Security
- Access token expires in 1 hour
- Refresh token expires in 7 days
- Session ID included in JWT payload
- Every request validates token + checks session in database
- Revoked sessions fail authentication

### Session Tracking
- Device info (User-Agent) recorded
- IP address recorded
- Last activity timestamp updated
- Multi-device support

### Error Handling
- User-friendly error messages
- No internal details exposed
- Consistent error format

---

## Testing with Postman

### Setup
1. Import endpoints as Postman collection
2. Create environment variable `{{baseUrl}}` = `http://localhost:3000`
3. Create environment variable `{{token}}` (auto-updated via test scripts)

### Test Script for Login
```javascript
// In POST /api/auth/login > Tests tab
if (pm.response.code === 200) {
  const response = pm.response.json();
  pm.environment.set("token", response.data.accessToken);
  pm.environment.set("refreshToken", response.data.refreshToken);
}
```

### Test Script for Refresh
```javascript
// In POST /api/auth/refresh > Tests tab
if (pm.response.code === 200) {
  const response = pm.response.json();
  pm.environment.set("token", response.data.accessToken);
  pm.environment.set("refreshToken", response.data.refreshToken);
}
```

### Authorization Header
For protected endpoints, use:
```
Authorization: Bearer {{token}}
```

---

## Development Notes

### Default Super Admin
- Email: `admin@genfity.com`
- Password: `Admin@123456`
- Role: `SUPER_ADMIN`

### Session Cleanup
Run cleanup command to remove expired sessions:
```typescript
// In AuthService or scheduled task
await sessionRepository.deleteExpired();
```

### Email Notifications
Login triggers password notification email for new merchant accounts (when `mustChangePassword=true`).

---

## Next Steps
- [ ] Implement Super Admin endpoints (`/api/admin/*`)
- [ ] Implement Merchant endpoints (`/api/merchant/*`)
- [ ] Implement Public endpoints (`/api/public/*`)
- [ ] Add rate limiting
- [ ] Add API documentation with Swagger/OpenAPI
