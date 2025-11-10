# Contributing to GENFITY Online Ordering System

Thank you for your interest in contributing to GENFITY! This document provides guidelines and instructions for contributing to the project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Development Workflow](#development-workflow)
- [Testing Guidelines](#testing-guidelines)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Pull Request Process](#pull-request-process)
- [API Development Guidelines](#api-development-guidelines)
- [Database Changes](#database-changes)
- [Security Guidelines](#security-guidelines)
- [Documentation](#documentation)

---

## 📜 Code of Conduct

### Our Standards
- Be respectful and inclusive
- Welcome constructive feedback
- Focus on what's best for the project
- Show empathy towards other contributors
- Maintain professional communication

### Unacceptable Behavior
- Harassment or discriminatory language
- Trolling or insulting comments
- Publishing others' private information
- Any conduct inappropriate for a professional setting

---

## 🚀 Getting Started

### Prerequisites
- **Node.js:** 18.0.0 or higher
- **PostgreSQL:** 14.0 or higher
- **Git:** Latest version
- **Code Editor:** VS Code recommended (with ESLint and Prettier extensions)

### Tools We Use
- **Package Manager:** npm (v9+)
- **ORM:** Prisma 6.19.0
- **Framework:** Next.js 15.2.3
- **Language:** TypeScript 5.7.2
- **Linting:** ESLint with TypeScript rules
- **Formatting:** Prettier

---

## 💻 Development Setup

### 1. Fork and Clone
```bash
# Fork the repository on GitHub, then:
git clone https://github.com/YOUR_USERNAME/genfity-online-ordering.git
cd genfity-online-ordering
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your local settings
# Minimum required:
DATABASE_URL="postgresql://user:password@localhost:5432/genfity_dev"
JWT_SECRET="your-secure-random-secret-min-32-chars"
JWT_REFRESH_SECRET="your-refresh-secret-min-32-chars"
```

**Generate secure JWT secrets:**
```bash
# On Linux/macOS:
openssl rand -base64 32

# On Windows PowerShell:
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
```

### 4. Database Setup
```bash
# Create database
createdb genfity_dev

# Run migrations
npx prisma migrate dev

# (Optional) Seed test data
npx prisma db seed
```

### 5. Run Development Server
```bash
npm run dev
```

Server will start at `http://localhost:3000`

### 6. Verify Setup
```bash
# Run linter
npm run lint

# Run type checking
npx tsc --noEmit

# Build production bundle
npm run build
```

---

## 📁 Project Structure

```
genfity-online-ordering/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/                # API routes
│   │   │   ├── admin/          # Admin endpoints
│   │   │   ├── auth/           # Authentication
│   │   │   ├── merchant/       # Merchant endpoints
│   │   │   └── public/         # Public endpoints
│   │   ├── (admin)/            # Admin pages
│   │   ├── (full-width-pages)/ # Auth & error pages
│   │   └── layout.tsx          # Root layout
│   ├── components/             # React components
│   │   ├── auth/               # Auth components
│   │   ├── common/             # Shared components
│   │   └── ui/                 # UI primitives
│   ├── lib/                    # Core libraries
│   │   ├── repositories/       # Data access layer
│   │   ├── services/           # Business logic
│   │   ├── middleware/         # Auth & error handling
│   │   ├── utils/              # Utility functions
│   │   └── types/              # TypeScript types
│   └── context/                # React contexts
├── prisma/
│   ├── schema.prisma           # Database schema
│   ├── migrations/             # Migration files
│   └── seed.ts                 # Seed data
├── docs/                       # Documentation
├── public/                     # Static assets
└── .github/
    └── copilot-instructions.md # AI coding guidelines
```

### Key Directories

**`src/app/api/`** - API route handlers (Next.js App Router)
- Follow REST conventions
- Use middleware for auth
- Return standard response format

**`src/lib/services/`** - Business logic layer
- Service classes for each domain
- Handle validation and business rules
- Call repositories for data access

**`src/lib/repositories/`** - Data access layer
- Database queries using Prisma
- No business logic
- Return typed data

**`src/lib/middleware/`** - Request processing
- Authentication (`auth.ts`)
- Error handling (`errorHandler.ts`)
- Reusable middleware patterns

---

## 🎨 Coding Standards

### TypeScript Guidelines

#### 1. Use Strict Type Checking
```typescript
// ✅ Good - Explicit types
interface CreateUserInput {
  email: string;
  name: string;
  role: UserRole;
}

async function createUser(input: CreateUserInput): Promise<User> {
  // Implementation
}

// ❌ Bad - Implicit any
async function createUser(input) {
  // No type safety
}
```

#### 2. Avoid `any` Type (Use Sparingly)
```typescript
// ✅ Good - Use specific types
function processOrder(order: Order): void {
  // Type-safe processing
}

// ⚠️ Acceptable - Unknown external data
function handleWebhook(payload: unknown): void {
  // Validate and narrow type
  if (isValidPayload(payload)) {
    // Now payload is typed
  }
}

// ❌ Bad - Lazy typing
function handleData(data: any): void {
  // No type safety
}
```

#### 3. Use Type Guards
```typescript
// ✅ Good - Type narrowing
function isValidEmail(value: unknown): value is string {
  return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

if (isValidEmail(input.email)) {
  // TypeScript knows input.email is string
  console.log(input.email.toLowerCase());
}
```

### Code Style

#### 1. Indentation and Spacing
- **2 spaces** for indentation (no tabs)
- **Empty line** between functions
- **No trailing whitespace**

```typescript
// ✅ Good
export class AuthService {
  private jwtManager: JWTManager;

  constructor() {
    this.jwtManager = new JWTManager();
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    // Implementation
  }
}
```

#### 2. Naming Conventions
- **camelCase** for variables and functions
- **PascalCase** for classes and interfaces
- **UPPER_SNAKE_CASE** for constants
- **Descriptive names** (avoid abbreviations)

```typescript
// ✅ Good
const userEmail = 'user@example.com';
const MAX_LOGIN_ATTEMPTS = 5;

class AuthService { }
interface UserProfile { }

// ❌ Bad
const usrEml = 'user@example.com';
const max = 5;
class authSvc { }
```

#### 3. Function Style
- **Arrow functions** for simple operations
- **Named functions** for complex logic
- **Async/await** over promises

```typescript
// ✅ Good - Arrow function for simple operations
const isActive = (user: User) => user.isActive && !user.deletedAt;

// ✅ Good - Named function for complex logic
async function processOrder(orderId: bigint): Promise<Order> {
  const order = await orderRepository.findById(orderId);
  if (!order) throw new NotFoundError('Order not found');
  
  // Complex processing
  return order;
}

// ❌ Bad - Overly complex arrow function
const processOrder = (orderId) => orderRepository.findById(orderId).then(order => {
  if (!order) throw new Error('Not found');
  // Many lines of processing
});
```

### Documentation

#### 1. JSDoc Comments (Required for Public APIs)
```typescript
/**
 * Authenticate user and create session
 * 
 * @param email User email address
 * @param password User password (plain text)
 * @returns Authentication response with tokens
 * @throws {ValidationError} If email or password invalid
 * @throws {AuthenticationError} If credentials incorrect
 * 
 * @example
 * const result = await authService.login('user@example.com', 'password123');
 * console.log(result.accessToken);
 */
async login(email: string, password: string): Promise<AuthResponse> {
  // Implementation
}
```

#### 2. Inline Comments (For Complex Logic)
```typescript
// ✅ Good - Explain why, not what
// Use bcrypt to avoid timing attacks on password comparison
const isValid = await bcrypt.compare(password, user.passwordHash);

// Calculate order total including tax (10%) and service fee (5%)
const total = subtotal * 1.15;

// ❌ Bad - Obvious comment
// Set user email
user.email = email;
```

---

## 🔄 Development Workflow

### Branch Naming Conventions

```bash
# Feature branches
feature/user-authentication
feature/order-tracking

# Bug fix branches
bugfix/login-session-timeout
bugfix/order-total-calculation

# Hotfix branches (production issues)
hotfix/security-vulnerability
hotfix/payment-gateway-error

# Documentation branches
docs/api-documentation
docs/deployment-guide

# Refactoring branches
refactor/auth-service
refactor/database-queries
```

### Workflow Steps

#### 1. Create Feature Branch
```bash
# Always branch from main
git checkout main
git pull origin main
git checkout -b feature/your-feature-name
```

#### 2. Make Changes
```bash
# Make your code changes
# Follow coding standards
# Write tests (if applicable)

# Check your changes
git status
git diff
```

#### 3. Commit Changes
```bash
# Stage changes
git add .

# Commit with descriptive message (see commit guidelines below)
git commit -m "feat: add user authentication service"
```

#### 4. Keep Branch Updated
```bash
# Regularly sync with main
git checkout main
git pull origin main
git checkout feature/your-feature-name
git rebase main

# Resolve conflicts if any
```

#### 5. Push and Create PR
```bash
# Push to your fork
git push origin feature/your-feature-name

# Create Pull Request on GitHub
```

---

## 🧪 Testing Guidelines

### Manual Testing (Current Approach)

Since automated tests are not yet implemented, follow these manual testing steps:

#### 1. API Endpoint Testing
Use **Postman** or **curl** to test API endpoints:

```bash
# Example: Test login endpoint
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@genfity.com",
    "password": "Admin123!"
  }'
```

See `TEST_DATA_REFERENCE.md` for comprehensive test data.

#### 2. Frontend Testing
- Test all user interactions manually
- Verify responsive design on different screen sizes
- Check form validation
- Test error states

#### 3. Database Testing
```bash
# Check database state
npx prisma studio

# Verify data integrity
# Check foreign key constraints
# Validate timestamps
```

#### 4. Testing Checklist (Before PR)
- [ ] All API endpoints respond correctly
- [ ] Authentication works (login, logout, refresh)
- [ ] Authorization enforced (role-based access)
- [ ] Input validation working
- [ ] Error handling graceful
- [ ] Database constraints enforced
- [ ] No console errors in browser
- [ ] Build succeeds (`npm run build`)
- [ ] Lint passes (`npm run lint`)

### Future: Automated Testing
We plan to implement:
- **Unit Tests:** Jest + Testing Library
- **Integration Tests:** API endpoint testing
- **E2E Tests:** Playwright or Cypress
- **Coverage Target:** 80%+

**Contributors welcome to help set up testing infrastructure!**

---

## 📝 Commit Message Guidelines

We follow **Conventional Commits** specification.

### Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- **feat:** New feature
- **fix:** Bug fix
- **docs:** Documentation changes
- **style:** Code style changes (formatting, no logic change)
- **refactor:** Code refactoring
- **perf:** Performance improvements
- **test:** Adding or updating tests
- **chore:** Build process or tooling changes

### Scope (Optional)
- **auth:** Authentication
- **merchant:** Merchant management
- **order:** Order system
- **menu:** Menu management
- **api:** API changes
- **db:** Database changes

### Examples

```bash
# Feature
git commit -m "feat(auth): add first-time password flow"

# Bug fix
git commit -m "fix(order): correct total calculation with tax"

# Documentation
git commit -m "docs: update API documentation with new endpoints"

# Refactoring
git commit -m "refactor(auth): extract JWT logic to separate manager class"

# Database
git commit -m "feat(db): add merchant opening hours table"

# Breaking change
git commit -m "feat(api): change order status enum values

BREAKING CHANGE: Order status 'PENDING' renamed to 'NEW'"
```

### Commit Message Rules
1. **Subject line:** Lowercase, no period, max 72 characters
2. **Body:** Explain what and why (not how), wrap at 72 characters
3. **Footer:** Reference issues, note breaking changes

---

## 🔀 Pull Request Process

### Before Creating PR

#### 1. Self-Review Checklist
- [ ] Code follows style guidelines
- [ ] No console.log() statements (use proper logging)
- [ ] No commented-out code
- [ ] All imports used
- [ ] No TypeScript errors
- [ ] Build passes (`npm run build`)
- [ ] Lint passes (`npm run lint`)
- [ ] Manual testing completed

#### 2. Update Documentation
- [ ] Update API_DOCUMENTATION.md (if API changed)
- [ ] Update README.md (if setup changed)
- [ ] Add JSDoc comments to new functions
- [ ] Update CHANGELOG.md (for significant changes)

#### 3. Prepare Branch
```bash
# Ensure branch is up to date
git checkout main
git pull origin main
git checkout your-branch
git rebase main

# Clean commit history (if needed)
git rebase -i main
```

### PR Template

**Title:** `feat(auth): add two-factor authentication`

**Description:**
```markdown
## 📝 Description
Brief description of changes and motivation.

## 🎯 Type of Change
- [ ] Bug fix (non-breaking change fixing an issue)
- [ ] New feature (non-breaking change adding functionality)
- [ ] Breaking change (fix or feature causing existing functionality to change)
- [ ] Documentation update

## ✅ Testing
Describe testing performed:
- Tested login with 2FA enabled
- Verified backup codes generation
- Checked SMS delivery

## 📸 Screenshots (if applicable)
[Add screenshots for UI changes]

## 📋 Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings or errors
- [ ] Manual testing completed
- [ ] Related issues linked

## 🔗 Related Issues
Closes #123
Related to #456
```

### PR Review Process

#### For Contributors:
1. **Create PR** with descriptive title and template
2. **Respond to feedback** promptly
3. **Make requested changes** in new commits
4. **Request re-review** after changes

#### For Reviewers:
1. **Check code quality** and style compliance
2. **Verify functionality** matches description
3. **Test locally** if needed
4. **Provide constructive feedback**
5. **Approve or request changes**

### Merge Requirements
- ✅ At least 1 approving review
- ✅ All CI checks passing (when implemented)
- ✅ No merge conflicts
- ✅ Up to date with main branch
- ✅ Documentation updated

---

## 🔌 API Development Guidelines

### Standard Response Format

**All API responses must follow this format:**

```typescript
// Success Response
{
  success: true,
  data: { /* actual response data */ },
  message: "Operation successful",
  statusCode: 200
}

// Error Response
{
  success: false,
  error: "ERROR_CODE",
  message: "User-friendly error message",
  statusCode: 400
}
```

### HTTP Status Codes

Use appropriate status codes:
- **200 OK:** Successful GET, PUT, PATCH
- **201 Created:** Successful POST creating resource
- **204 No Content:** Successful DELETE
- **400 Bad Request:** Validation error
- **401 Unauthorized:** Authentication required
- **403 Forbidden:** Insufficient permissions
- **404 Not Found:** Resource not found
- **409 Conflict:** Resource conflict (e.g., duplicate email)
- **500 Internal Server Error:** Server error (never expose details)

### Input Validation

**Always validate input using Zod:**

```typescript
import { z } from 'zod';

const LoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

// In route handler
const validation = LoginSchema.safeParse(body);
if (!validation.success) {
  return NextResponse.json(
    {
      success: false,
      error: 'VALIDATION_ERROR',
      message: validation.error.errors[0].message,
      statusCode: 400
    },
    { status: 400 }
  );
}
```

### Authentication Middleware

**Use `withAuth` for protected endpoints:**

```typescript
import { withAuth } from '@/lib/middleware/auth';
import { UserRole } from '@/lib/types/auth';

export const GET = withAuth(
  async (request, authContext) => {
    // authContext contains: userId, sessionId, role, email, merchantId
    const { userId, role } = authContext;
    
    // Your endpoint logic
    return NextResponse.json({
      success: true,
      data: { userId },
      message: 'Success',
      statusCode: 200
    });
  },
  [UserRole.MERCHANT_OWNER] // Optional: restrict to specific roles
);
```

### Error Handling

**Use custom error classes:**

```typescript
import { ValidationError, AuthenticationError, NotFoundError } from '@/lib/middleware/errorHandler';

// In service
if (!user) {
  throw new NotFoundError('User not found');
}

if (!isValid) {
  throw new AuthenticationError('Invalid credentials');
}

if (input.email.length === 0) {
  throw new ValidationError('Email is required');
}
```

---

## 🗄️ Database Changes

### Creating Migrations

#### 1. Modify Schema
Edit `prisma/schema.prisma`:

```prisma
model NewTable {
  id        BigInt   @id @default(autoincrement())
  name      String
  createdAt DateTime @default(now()) @db.Timestamptz(6)

  @@map("new_table")
}
```

#### 2. Create Migration
```bash
# Development (creates and applies migration)
npx prisma migrate dev --name add_new_table

# Production (creates migration only)
npx prisma migrate deploy
```

#### 3. Update Prisma Client
```bash
npx prisma generate
```

#### 4. Update Types
Create TypeScript interfaces matching new schema:

```typescript
// src/lib/types/newTable.ts
export interface NewTable {
  id: bigint;
  name: string;
  createdAt: Date;
}
```

### Migration Best Practices

1. **Always test migrations locally first**
2. **Never edit migration files manually**
3. **Use descriptive migration names**
4. **Add indexes for frequently queried columns**
5. **Use TIMESTAMPTZ for timestamps** (not TIMESTAMP)
6. **Add comments for complex schema**
7. **Backup database before applying migrations in production**

### Schema Guidelines

```prisma
// ✅ Good - Complete model definition
model User {
  id            BigInt    @id @default(autoincrement())
  email         String    @unique @db.VarChar(255)
  passwordHash  String    @db.VarChar(255) @map("password_hash")
  isActive      Boolean   @default(true) @map("is_active")
  createdAt     DateTime  @default(now()) @db.Timestamptz(6) @map("created_at")
  updatedAt     DateTime  @updatedAt @db.Timestamptz(6) @map("updated_at")
  deletedAt     DateTime? @db.Timestamptz(6) @map("deleted_at")

  sessions      UserSession[]

  @@index([email])
  @@map("users")
}

// ❌ Bad - Missing details
model User {
  id    Int    @id @default(autoincrement())
  email String
  password String
}
```

---

## 🔒 Security Guidelines

### Password Security

```typescript
// ✅ Good - Secure password hashing
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10; // Minimum 10 rounds
const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

// Verify password
const isValid = await bcrypt.compare(password, user.passwordHash);

// ❌ Bad - Never return password hash
return {
  ...user,
  passwordHash: user.passwordHash // NEVER DO THIS
};
```

### SQL Injection Prevention

```typescript
// ✅ Good - Parameterized query (Prisma handles this)
const user = await prisma.user.findUnique({
  where: { email: userEmail }
});

// ❌ Bad - String concatenation (vulnerable)
const query = `SELECT * FROM users WHERE email = '${userEmail}'`;
```

### JWT Security

```typescript
// ✅ Good - Include session validation
const payload = jwtManager.verifyAccessToken(token);
const session = await sessionRepository.findById(payload.sessionId);

if (!session || session.revokedAt) {
  throw new AuthenticationError('Invalid session');
}

// ❌ Bad - Trust JWT without validation
const payload = jwtManager.verifyAccessToken(token);
// Use payload.userId directly without checking session
```

### Environment Variables

```typescript
// ✅ Good - Validate required env vars
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is required');
}

const jwtSecret = process.env.JWT_SECRET;

// ❌ Bad - Hardcoded secrets
const jwtSecret = 'my-secret-key-123'; // NEVER DO THIS
```

### Input Sanitization

```typescript
// ✅ Good - Validate and sanitize
const email = input.email.trim().toLowerCase();

if (!isValidEmail(email)) {
  throw new ValidationError('Invalid email');
}

// ❌ Bad - Trust user input directly
const user = await createUser({
  email: req.body.email // No validation
});
```

---

## 📚 Documentation

### What to Document

1. **Public APIs** - All endpoints with examples
2. **Complex Logic** - Business rules and algorithms
3. **Configuration** - Environment variables and setup
4. **Architecture** - System design decisions
5. **Security** - Security measures and best practices

### Documentation Files

- **README.md** - Project overview and quick start
- **API_DOCUMENTATION.md** - Complete API reference
- **DEPLOYMENT_GUIDE.md** - Production deployment
- **CONTRIBUTING.md** - This file
- **CHANGELOG.md** - Version history
- **docs/*.txt** - Technical specifications

### Writing Good Documentation

```markdown
## ✅ Good Documentation Example

### POST /api/auth/login

Authenticate user and create session.

**Authentication:** None required

**Request Body:**
\```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
\```

**Success Response (200):**
\```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbG...",
    "refreshToken": "eyJhbG...",
    "user": {
      "id": "1",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "MERCHANT_OWNER"
    }
  },
  "message": "Login successful",
  "statusCode": 200
}
\```

**Error Responses:**
- `400 VALIDATION_ERROR` - Invalid input
- `401 AUTHENTICATION_ERROR` - Invalid credentials
- `500 INTERNAL_ERROR` - Server error

**Example:**
\```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"Password123!"}'
\```
```

---

## 🆘 Getting Help

### Resources
- **Documentation:** Check `docs/` folder
- **Code Examples:** See existing implementations
- **API Reference:** See `API_DOCUMENTATION.md`
- **Deployment:** See `DEPLOYMENT_GUIDE.md`

### Questions?
- **Technical Questions:** Create a GitHub Discussion
- **Bug Reports:** Create a GitHub Issue
- **Feature Requests:** Create a GitHub Issue with `enhancement` label

### Issue Template
```markdown
**Describe the issue:**
Clear description of the problem

**Steps to reproduce:**
1. Step one
2. Step two
3. ...

**Expected behavior:**
What should happen

**Actual behavior:**
What actually happens

**Environment:**
- OS: [e.g., Windows 11]
- Node.js version: [e.g., 18.17.0]
- Browser: [e.g., Chrome 120]

**Screenshots:**
If applicable

**Additional context:**
Any other relevant information
```

---

## 🎉 Thank You!

Thank you for contributing to GENFITY! Your efforts help make this project better for everyone.

### Recognition
- All contributors will be listed in CHANGELOG.md
- Significant contributions will be highlighted in release notes
- Top contributors may receive maintainer access

### Quick Links
- [Code of Conduct](#code-of-conduct)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Pull Request Process](#pull-request-process)

**Happy coding! 🚀**
