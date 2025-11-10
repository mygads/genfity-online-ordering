# GENFITY Deployment Guide# 🚀 GENFITY Online Ordering - Deployment Guide



**Version**: 1.0.0  **Version:** 1.0  

**Last Updated**: November 10, 2025**Last Updated:** November 10, 2025  

**Status:** Production Ready ✅

This guide covers deploying GENFITY Online Ordering System to production.

---

---

## 📋 Table of Contents

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)

1. [Prerequisites](#prerequisites)2. [Environment Setup](#environment-setup)

2. [Environment Setup](#environment-setup)3. [Database Setup](#database-setup)

3. [Database Setup](#database-setup)4. [Application Configuration](#application-configuration)

4. [Application Deployment](#application-deployment)5. [Build & Run](#build--run)

5. [Post-Deployment](#post-deployment)6. [Production Deployment Options](#production-deployment-options)

6. [Monitoring & Maintenance](#monitoring--maintenance)7. [Security Checklist](#security-checklist)

7. [Troubleshooting](#troubleshooting)8. [Monitoring & Logging](#monitoring--logging)

9. [Troubleshooting](#troubleshooting)

---

---

## 1. Prerequisites

## 📦 Prerequisites

### Required Software

### Required Software

- **Node.js**: v18.17.0 or higher- **Node.js:** >= 18.0.0 (LTS recommended)

- **PostgreSQL**: v14 or higher- **PostgreSQL:** >= 14.0

- **npm**: v9.0.0 or higher- **Package Manager:** npm >= 9.0 or yarn >= 1.22

- **Git**: Latest version- **Git:** Latest version



### Required Accounts### Recommended

- **PM2:** For process management (production)

- Database hosting (e.g., AWS RDS, Supabase, Railway)- **Nginx:** For reverse proxy (production)

- Application hosting (e.g., Vercel, Railway, AWS)- **Docker:** Optional, for containerized deployment

- SMTP service (e.g., SendGrid, Mailgun, AWS SES)- **SSL Certificate:** For HTTPS (Let's Encrypt recommended)



------



## 2. Environment Setup## 🔧 Environment Setup



### 2.1 Clone Repository### 1. Clone Repository

```bash

```bashgit clone https://github.com/your-org/genfity-online-ordering.git

git clone https://github.com/mygads/genfity-online-ordering.gitcd genfity-online-ordering

cd genfity-online-ordering```

```

### 2. Install Dependencies

### 2.2 Install Dependencies```bash

npm install

```bash# or

npm installyarn install

``````



### 2.3 Environment Variables### 3. Create Environment File

Create `.env` file in root directory:

Create `.env` file in project root:

```env

```env# Database Configuration

# Database ConfigurationDATABASE_URL="postgresql://username:password@host:port/database?schema=genfity"

DATABASE_URL="postgresql://username:password@host:5432/database?schema=genfity&sslmode=require"

# Example for local development:

# JWT Configuration# DATABASE_URL="postgresql://postgres:password@localhost:5432/genfity_db?schema=genfity"

JWT_SECRET="your-super-secret-jwt-key-min-32-characters-long"

JWT_EXPIRY="3600"  # 1 hour in seconds# JWT Configuration

JWT_REFRESH_EXPIRY="604800"  # 7 days in secondsJWT_SECRET="your-super-secret-jwt-key-min-32-characters"

JWT_EXPIRES_IN="7d"

# SMTP Configuration (Email Notifications)JWT_REFRESH_EXPIRES_IN="30d"

SMTP_HOST="smtp.sendgrid.net"

SMTP_PORT="587"# Email Configuration (for notifications)

SMTP_SECURE="false"SMTP_HOST="smtp.gmail.com"

SMTP_USER="apikey"SMTP_PORT=587

SMTP_PASS="your-sendgrid-api-key"SMTP_SECURE=false

SMTP_FROM_EMAIL="noreply@yourdomain.com"SMTP_USER="your-email@gmail.com"

SMTP_FROM_NAME="GENFITY Ordering System"SMTP_PASSWORD="your-app-password"

EMAIL_FROM="GENFITY <noreply@genfity.com>"

# Application Configuration

NODE_ENV="production"# Application Configuration

PORT="3000"NODE_ENV="production"

FRONTEND_URL="https://yourdomain.com"NEXT_PUBLIC_API_URL="https://yourdomain.com"

PORT=3000

# Security

BCRYPT_ROUNDS="12"  # Higher for production (10-14 recommended)# Security

BCRYPT_ROUNDS=12

# CORS ConfigurationSESSION_MAX_AGE=604800000  # 7 days in milliseconds

CORS_ORIGIN="https://yourdomain.com"

# Optional: Rate Limiting

# Optional: File Upload (if implemented)RATE_LIMIT_WINDOW_MS=900000  # 15 minutes

MAX_FILE_SIZE="5242880"  # 5MB in bytesRATE_LIMIT_MAX_REQUESTS=100

UPLOAD_DIR="./uploads"

```# Optional: File Upload (if needed)

MAX_FILE_SIZE=5242880  # 5MB in bytes

### 2.4 Secure Your SecretsUPLOAD_DIR="./uploads"

```

**IMPORTANT**: Never commit `.env` to Git!

### 4. Generate Secure Secrets

Generate secure JWT secret:```bash

# Generate JWT_SECRET (minimum 32 characters)

```bashnode -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

```# Example output: 8f3d9e2a1b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1

```

---

---

## 3. Database Setup

## 🗄️ Database Setup

### 3.1 Create PostgreSQL Database

### 1. Create Database

**Option A: Using PostgreSQL CLI**```sql

-- Connect to PostgreSQL

```bashpsql -U postgres

psql -U postgres

CREATE DATABASE genfity_production;-- Create database

CREATE USER genfity_user WITH ENCRYPTED PASSWORD 'secure_password_here';CREATE DATABASE genfity_db;

GRANT ALL PRIVILEGES ON DATABASE genfity_production TO genfity_user;

\q-- Create schema

```\c genfity_db

CREATE SCHEMA IF NOT EXISTS genfity;

**Option B: Using Cloud Provider**

-- Grant permissions

- **Supabase**: Create new project → Get connection stringGRANT ALL PRIVILEGES ON DATABASE genfity_db TO your_username;

- **Railway**: Add PostgreSQL plugin → Copy DATABASE_URLGRANT ALL PRIVILEGES ON SCHEMA genfity TO your_username;

- **AWS RDS**: Create PostgreSQL instance → Configure security groups```



### 3.2 Update DATABASE_URL### 2. Run Prisma Migrations

```bash

```env# Generate Prisma client

# Formatnpx prisma generate

DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=genfity&sslmode=require"

# Run migrations (creates all 14 tables)

# Examplenpx prisma migrate deploy

DATABASE_URL="postgresql://genfity_user:password@db.example.com:5432/genfity_production?schema=genfity&sslmode=require"

```# Alternative: Reset database and migrate

npx prisma migrate reset --force

### 3.3 Run Database Migrations```



```bash### 3. Verify Database Schema

# Generate Prisma Client```bash

npx prisma generate# Check all tables created

npx prisma db pull

# Run migrations

npx prisma migrate deploy# Expected tables (14 total):

# - users

# Verify# - merchants

npx prisma db pull# - merchant_users

```# - menu_categories

# - menus

### 3.4 Seed Initial Data# - orders

# - order_items

```bash# - merchant_opening_hours

# Create super admin (optional script)# - addon_categories

npx tsx scripts/create-admin.ts# - addon_items

```# - menu_addon_categories

# - order_item_addons

**Or manually via SQL**:# - user_sessions

# - order_status_history

```sql```

-- Create super admin user

INSERT INTO genfity.users (name, email, password_hash, role, is_active, must_change_password)### 4. Seed Initial Data (Optional)

VALUES (```bash

  'Super Admin',# Run seed script (if available)

  'admin@yourdomain.com',npx prisma db seed

  '$2a$12$hashed_password_here',  -- Use bcrypt to hash

  'SUPER_ADMIN',# Or manually insert admin user:

  true,```

  false

);```sql

```-- Insert admin user

INSERT INTO genfity.users (email, password_hash, role, is_active, created_at, updated_at)

---VALUES (

  'admin@genfity.com',

## 4. Application Deployment  '$2a$12$hashedpasswordhere',  -- Use bcrypt to hash

  'ADMIN',

### 4.1 Build Application  true,

  NOW(),

```bash  NOW()

npm run build);

``````



This creates optimized production build in `.next/` directory.---



### 4.2 Test Production Build Locally## ⚙️ Application Configuration



```bash### 1. Prisma Configuration

npm startVerify `prisma/schema.prisma`:

``````prisma

datasource db {

Visit `http://localhost:3000` to verify.  provider = "postgresql"

  url      = env("DATABASE_URL")

### 4.3 Deploy to Hosting Platform}



#### Option A: Vercel (Recommended)generator client {

  provider = "prisma-client-js"

```bash}

# Install Vercel CLI```

npm i -g vercel

### 2. Next.js Configuration

# LoginVerify `next.config.ts`:

vercel login```typescript

const nextConfig = {

# Deploy  reactStrictMode: true,

vercel --prod  env: {

```    DATABASE_URL: process.env.DATABASE_URL,

    JWT_SECRET: process.env.JWT_SECRET,

**Configure environment variables in Vercel Dashboard**:  },

1. Go to Project Settings → Environment Variables  // Add production optimizations

2. Add all variables from `.env`  compress: true,

3. Redeploy  poweredByHeader: false,

};

#### Option B: Railway

export default nextConfig;

```bash```

# Install Railway CLI

npm i -g @railway/cli### 3. TypeScript Configuration

Ensure `tsconfig.json` has strict mode:

# Login```json

railway login{

  "compilerOptions": {

# Initialize    "strict": true,

railway init    "noImplicitAny": true,

    "strictNullChecks": true

# Add environment variables  }

railway variables set DATABASE_URL="..."}

railway variables set JWT_SECRET="..."```



# Deploy---

railway up

```## 🏗️ Build & Run



#### Option C: AWS EC2 / VPS### Development Mode

```bash

```bash# Start development server

# SSH to servernpm run dev

ssh user@your-server.com

# Server runs at http://localhost:3000

# Clone repository# Hot reload enabled

git clone https://github.com/mygads/genfity-online-ordering.git```

cd genfity-online-ordering

### Production Build

# Install dependencies```bash

npm install# Build for production

npm run build

# Build

npm run build# Output: .next folder with optimized bundles



# Install PM2 for process management# Start production server

npm install -g pm2npm run start

```

# Start with PM2

pm2 start npm --name "genfity" -- start### Build Verification

```bash

# Save PM2 config# Check build size

pm2 savenpm run build -- --analyze



# Setup auto-restart on reboot# Expected output:

pm2 startup# - Total size: < 500KB (gzipped)

```# - Largest chunks: Main, Framework

# - No errors or warnings

---```



## 5. Post-Deployment---



### 5.1 Verify Deployment## 🌐 Production Deployment Options



**Health Check**:### Option 1: Vercel (Recommended for Next.js)



```bash#### 1.1 Install Vercel CLI

curl https://yourdomain.com/api/health```bash

```npm install -g vercel

```

Expected response:

```json#### 1.2 Deploy

{```bash

  "status": "ok",# Login to Vercel

  "timestamp": "2025-11-10T10:00:00.000Z"vercel login

}

```# Deploy

vercel --prod

**Database Connection**:

# Set environment variables via Vercel Dashboard:

```bash# - DATABASE_URL

curl https://yourdomain.com/api/admin/merchants# - JWT_SECRET

```# - SMTP credentials

```

Should return 401 (Unauthorized) if working.

#### 1.3 Configure Domain

### 5.2 Create First Merchant```bash

# Add custom domain

Use admin account to create first merchant:vercel domains add yourdomain.com

```

```bash

curl -X POST https://yourdomain.com/api/admin/merchants \---

  -H "Authorization: Bearer ADMIN_TOKEN" \

  -H "Content-Type: application/json" \### Option 2: PM2 on VPS

  -d '{

    "merchantCode": "DEMO001",#### 2.1 Install PM2

    "merchantName": "Demo Restaurant",```bash

    "email": "demo@restaurant.com",npm install -g pm2

    "phone": "+1234567890",```

    "address": "123 Main St",

    "country": "USA",#### 2.2 Create PM2 Ecosystem File

    "currency": "USD",Create `ecosystem.config.js`:

    "enableTax": true,```javascript

    "taxPercentage": 10,module.exports = {

    "ownerName": "John Doe",  apps: [

    "ownerEmail": "john@restaurant.com",    {

    "temporaryPassword": "TempPass123!"      name: 'genfity-online-ordering',

  }'      script: 'npm',

```      args: 'start',

      instances: 'max',  // Use all CPU cores

### 5.3 SSL Certificate      exec_mode: 'cluster',

      env: {

**For Vercel/Railway**: Automatic HTTPS        NODE_ENV: 'production',

        PORT: 3000,

**For VPS**: Use Let's Encrypt      },

      error_file: './logs/err.log',

```bash      out_file: './logs/out.log',

# Install Certbot      log_file: './logs/combined.log',

sudo apt-get install certbot python3-certbot-nginx      time: true,

    },

# Get certificate  ],

sudo certbot --nginx -d yourdomain.com};

```

# Auto-renewal (test)

sudo certbot renew --dry-run#### 2.3 Start with PM2

``````bash

# Start application

### 5.4 Configure Nginx (VPS only)pm2 start ecosystem.config.js



```nginx# Save PM2 process list

# /etc/nginx/sites-available/genfitypm2 save

server {

    listen 80;# Enable PM2 startup on boot

    server_name yourdomain.com;pm2 startup

    return 301 https://$server_name$request_uri;```

}

#### 2.4 Configure Nginx Reverse Proxy

server {Create `/etc/nginx/sites-available/genfity`:

    listen 443 ssl http2;```nginx

    server_name yourdomain.com;server {

    listen 80;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Redirect HTTP to HTTPS

    location / {    return 301 https://$host$request_uri;

        proxy_pass http://localhost:3000;}

        proxy_http_version 1.1;

        proxy_set_header Upgrade $http_upgrade;server {

        proxy_set_header Connection 'upgrade';    listen 443 ssl http2;

        proxy_set_header Host $host;    server_name yourdomain.com www.yourdomain.com;

        proxy_cache_bypass $http_upgrade;

        proxy_set_header X-Real-IP $remote_addr;    # SSL Configuration

        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;

    }    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

}    ssl_protocols TLSv1.2 TLSv1.3;

```    ssl_ciphers HIGH:!aNULL:!MD5;



Enable site:    # Security Headers

```bash    add_header X-Frame-Options "SAMEORIGIN" always;

sudo ln -s /etc/nginx/sites-available/genfity /etc/nginx/sites-enabled/    add_header X-Content-Type-Options "nosniff" always;

sudo nginx -t    add_header X-XSS-Protection "1; mode=block" always;

sudo systemctl reload nginx    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

```

    # Proxy to Next.js

---    location / {

        proxy_pass http://localhost:3000;

## 6. Monitoring & Maintenance        proxy_http_version 1.1;

        proxy_set_header Upgrade $http_upgrade;

### 6.1 Logging        proxy_set_header Connection 'upgrade';

        proxy_set_header Host $host;

**PM2 Logs** (VPS):        proxy_cache_bypass $http_upgrade;

```bash        proxy_set_header X-Real-IP $remote_addr;

pm2 logs genfity        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

pm2 logs genfity --lines 100        proxy_set_header X-Forwarded-Proto $scheme;

```    }



**Vercel Logs**:    # Rate Limiting

- Dashboard → Your Project → Logs    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

    limit_req zone=api burst=20 nodelay;

### 6.2 Database Backups

    # File Upload Size

**Automated Backups** (PostgreSQL):    client_max_body_size 10M;

}

```bash```

# Backup script

#!/bin/bashEnable site and restart Nginx:

DATE=$(date +%Y%m%d_%H%M%S)```bash

BACKUP_DIR="/var/backups/genfity"sudo ln -s /etc/nginx/sites-available/genfity /etc/nginx/sites-enabled/

pg_dump -U genfity_user genfity_production > $BACKUP_DIR/backup_$DATE.sqlsudo nginx -t

gzip $BACKUP_DIR/backup_$DATE.sqlsudo systemctl restart nginx

```

# Keep only last 7 days

find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +7 -delete---

```

### Option 3: Docker Deployment

Add to cron:

```bash#### 3.1 Create Dockerfile

crontab -eCreate `Dockerfile` in root:

# Add: Daily backup at 2 AM```dockerfile

0 2 * * * /path/to/backup-script.shFROM node:18-alpine AS base

```

# Install dependencies only when needed

### 6.3 Performance MonitoringFROM base AS deps

WORKDIR /app

**Install Monitoring Tools**:COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

RUN npm ci

```bash

# New Relic# Rebuild the source code only when needed

npm install newrelicFROM base AS builder

WORKDIR /app

# Or Sentry for error trackingCOPY --from=deps /app/node_modules ./node_modules

npm install @sentry/nextjsCOPY . .

```

# Generate Prisma client

### 6.4 Database MaintenanceRUN npx prisma generate



```sql# Build Next.js

-- Vacuum database (weekly)RUN npm run build

VACUUM ANALYZE;

# Production image

-- Reindex (monthly)FROM base AS runner

REINDEX DATABASE genfity_production;WORKDIR /app



-- Check table sizesENV NODE_ENV production

SELECT 

  schemaname,RUN addgroup --system --gid 1001 nodejs

  tablename,RUN adduser --system --uid 1001 nextjs

  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size

FROM pg_tablesCOPY --from=builder /app/public ./public

WHERE schemaname = 'genfity'COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

```

USER nextjs

---

EXPOSE 3000

## 7. Troubleshooting

ENV PORT 3000

### 7.1 Database Connection ErrorsENV HOSTNAME "0.0.0.0"



**Error**: `Can't reach database server`CMD ["node", "server.js"]

```

**Solution**:

1. Check `DATABASE_URL` format#### 3.2 Create docker-compose.yml

2. Verify database is running```yaml

3. Check firewall rulesversion: '3.8'

4. Ensure SSL mode matches database config

services:

```bash  app:

# Test connection    build: .

psql "postgresql://user:pass@host:5432/db?sslmode=require"    ports:

```      - "3000:3000"

    environment:

### 7.2 JWT Token Errors      - DATABASE_URL=${DATABASE_URL}

      - JWT_SECRET=${JWT_SECRET}

**Error**: `JsonWebTokenError: invalid signature`      - NODE_ENV=production

    depends_on:

**Solution**:      - db

- Verify `JWT_SECRET` is same across all instances    restart: unless-stopped

- Check token expiry settings

- Ensure environment variables are loaded  db:

    image: postgres:14-alpine

### 7.3 Email Not Sending    environment:

      - POSTGRES_DB=genfity_db

**Error**: `SMTP connection failed`      - POSTGRES_USER=postgres

      - POSTGRES_PASSWORD=${DB_PASSWORD}

**Solution**:    volumes:

1. Verify SMTP credentials      - postgres_data:/var/lib/postgresql/data

2. Check SMTP port (usually 587 or 465)    ports:

3. Enable "less secure apps" if using Gmail      - "5432:5432"

4. Use app-specific password    restart: unless-stopped



**Test SMTP**:volumes:

```bash  postgres_data:

npx tsx scripts/test-email.ts```

```

#### 3.3 Deploy with Docker

### 7.4 Migration Errors```bash

# Build and run

**Error**: `Migration failed`docker-compose up -d



**Solution**:# Check logs

```bashdocker-compose logs -f app

# Reset migrations (DANGER: Only in development!)

npx prisma migrate reset# Run migrations

docker-compose exec app npx prisma migrate deploy

# Production: Manual rollback```

npx prisma migrate resolve --rolled-back MIGRATION_NAME

```---



### 7.5 High Memory Usage## 🔐 Security Checklist



**Solution**:### Pre-Deployment Security

- [ ] **Environment Variables:** All secrets in `.env`, never commit to Git

```bash- [ ] **JWT Secret:** Minimum 32 characters, randomly generated

# Increase Node.js memory limit- [ ] **Database Password:** Strong password (12+ chars, mixed case, numbers, symbols)

NODE_OPTIONS="--max-old-space-size=4096" npm start- [ ] **SMTP Credentials:** App-specific password, not main password

- [ ] **CORS:** Configure allowed origins (not `*` in production)

# Or in PM2- [ ] **Rate Limiting:** Enable API rate limits

pm2 start npm --name "genfity" -- start --node-args="--max-old-space-size=4096"- [ ] **Input Validation:** All user inputs validated

```- [ ] **SQL Injection:** All queries parameterized (Prisma handles this)

- [ ] **XSS Protection:** Sanitize HTML inputs

---- [ ] **HTTPS:** SSL certificate installed and enforced

- [ ] **Security Headers:** X-Frame-Options, CSP, HSTS configured

## 8. Security Checklist- [ ] **Session Management:** Secure session storage, httpOnly cookies

- [ ] **Password Hashing:** bcrypt with rounds >= 12

- [ ] Use HTTPS only

- [ ] Set strong `JWT_SECRET` (32+ characters)### Post-Deployment Checks

- [ ] Configure CORS properly```bash

- [ ] Use environment variables for secrets# Test HTTPS

- [ ] Enable database SSLcurl -I https://yourdomain.com

- [ ] Set `bcrypt` rounds to 12+

- [ ] Implement rate limiting# Verify security headers

- [ ] Enable security headerscurl -I https://yourdomain.com | grep -E "X-Frame-Options|X-Content-Type-Options|Strict-Transport-Security"

- [ ] Regular security updates (`npm audit`)

- [ ] Database backups configured# Check API rate limiting

- [ ] Monitoring and alerts set upfor i in {1..20}; do curl https://yourdomain.com/api/auth/login; done



---# Test authentication

curl -X POST https://yourdomain.com/api/auth/login \

## 9. Scaling Considerations  -H "Content-Type: application/json" \

  -d '{"email":"test@test.com","password":"wrong"}'

### Horizontal Scaling```



- **Load Balancer**: Nginx, AWS ALB, Cloudflare---

- **Multiple Instances**: PM2 cluster mode or Kubernetes

- **Database**: Read replicas, connection pooling## 📊 Monitoring & Logging



### Vertical Scaling### Application Logs

```bash

- Increase server resources (CPU, RAM)# PM2 logs

- Optimize database queriespm2 logs genfity-online-ordering

- Add caching layer (Redis)

# Follow logs in real-time

---pm2 logs --lines 100



## 10. Rollback Procedure# Docker logs

docker-compose logs -f app

If deployment fails:```



```bash### Health Check Endpoint

# VercelCreate `src/app/api/health/route.ts`:

vercel rollback```typescript

export async function GET() {

# PM2  return Response.json({

pm2 stop genfity    status: 'healthy',

git checkout PREVIOUS_COMMIT    timestamp: new Date().toISOString(),

npm install    uptime: process.uptime(),

npm run build  });

pm2 restart genfity}

```

# Database rollback

npx prisma migrate resolve --rolled-back MIGRATION_NAMETest health check:

``````bash

curl https://yourdomain.com/api/health

---```



## Support### Monitoring Tools (Recommended)

- **Sentry:** Error tracking and monitoring

For deployment issues:- **LogRocket:** Session replay and debugging

- **Documentation**: [GitHub Wiki](https://github.com/mygads/genfity-online-ordering/wiki)- **New Relic:** Application performance monitoring

- **Issues**: [GitHub Issues](https://github.com/mygads/genfity-online-ordering/issues)- **Uptime Robot:** Uptime monitoring

- **Email**: support@genfity.com- **PostgreSQL:** Enable slow query log



---### Database Monitoring

```sql

**Last Updated**: November 10, 2025  -- Enable slow query log

**Next Review**: December 10, 2025ALTER SYSTEM SET log_min_duration_statement = 1000;  -- Log queries > 1 second

SELECT pg_reload_conf();

-- Monitor active connections
SELECT count(*) FROM pg_stat_activity WHERE state = 'active';

-- Check table sizes
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'genfity'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Test database connection
npx prisma db push --skip-generate

# Check PostgreSQL status
sudo systemctl status postgresql

# View PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-14-main.log
```

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules
rm -rf node_modules
npm install

# Clear Prisma cache
rm -rf node_modules/.prisma
npx prisma generate
```

### JWT Token Issues
```bash
# Verify JWT_SECRET is set
node -e "console.log(process.env.JWT_SECRET ? 'Set' : 'Missing')"

# Test JWT generation
node -e "
const jwt = require('jsonwebtoken');
const token = jwt.sign({userId: 1}, process.env.JWT_SECRET);
console.log('Token:', token);
const decoded = jwt.verify(token, process.env.JWT_SECRET);
console.log('Decoded:', decoded);
"
```

### Email Sending Issues
```bash
# Test SMTP connection
node -e "
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});
transporter.verify((error, success) => {
  console.log(error ? 'SMTP Error: ' + error : 'SMTP Ready');
});
"
```

### Performance Issues
```bash
# Analyze bundle size
npm run build -- --analyze

# Check memory usage (PM2)
pm2 monit

# Database query optimization
# Add indexes on frequently queried columns:
```

```sql
-- Example: Add index on orders.merchant_id for faster lookups
CREATE INDEX idx_orders_merchant_id ON genfity.orders(merchant_id);

-- Add index on order_items.order_id
CREATE INDEX idx_order_items_order_id ON genfity.order_items(order_id);
```

---

## 📚 Additional Resources

### Documentation Files
- `docs/PANDUAN_KESELURUHAN.txt` - Complete project overview
- `docs/STEP_01_DATABASE_DESIGN.txt` - Database schema details
- `docs/STEP_02_AUTHENTICATION_JWT.txt` - Authentication implementation
- `docs/STEP_04_API_ENDPOINTS.txt` - API documentation
- `docs/COMPLETE_TESTING_REPORT_NOV10.md` - Testing results

### Useful Commands
```bash
# Check application status
pm2 status

# Restart application
pm2 restart genfity-online-ordering

# View real-time logs
pm2 logs --lines 50

# Monitor resources
pm2 monit

# Stop application
pm2 stop genfity-online-ordering

# Database backup
pg_dump -U postgres -d genfity_db -F c -f backup.dump

# Database restore
pg_restore -U postgres -d genfity_db backup.dump
```

---

## ✅ Deployment Checklist

### Pre-Deployment
- [ ] All environment variables configured
- [ ] Database migrations run successfully
- [ ] Build completes without errors
- [ ] All tests passing
- [ ] Security headers configured
- [ ] SSL certificate installed
- [ ] Domain DNS configured
- [ ] Backup strategy in place

### Deployment
- [ ] Application deployed to production
- [ ] Database connected successfully
- [ ] Health check endpoint responding
- [ ] Authentication working
- [ ] API endpoints tested
- [ ] Email notifications working
- [ ] Static files serving correctly

### Post-Deployment
- [ ] Monitor logs for errors
- [ ] Test all critical user flows
- [ ] Verify performance metrics
- [ ] Set up monitoring alerts
- [ ] Document deployment date and version
- [ ] Create rollback plan

---

**🎉 Congratulations! Your GENFITY Online Ordering system is now deployed and production-ready!**

**For support, refer to the documentation files in the `docs/` folder or contact the development team.**

---

**Last Updated:** November 10, 2025  
**Version:** 1.0  
**Maintained By:** GENFITY Development Team
