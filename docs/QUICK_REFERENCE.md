# 🔑 GENFITY - Quick Reference Guide

**Last Updated:** November 10, 2025  
**Status:** Testing Complete - All Data Ready

---

## 🔐 LOGIN CREDENTIALS

### Admin User
```
Email: admin@genfity.com
Password: Genfity2024!
Role: SUPER_ADMIN
```

### Merchant 1: Kopi Kenangan (KOPI001)
```
Email: budi@kopi.com
Password: Budi123!
Role: MERCHANT_OWNER
Merchant: Kopi Kenangan (KOPI001)
```

### Merchant 2: Restoran Padang Minang (RPM001)
```
Email: ahmad@padang.com
Password: Ahmad123!
Role: MERCHANT_OWNER
Merchant: Restoran Padang Minang (RPM001)
```

---

## 📊 TEST DATA SUMMARY

### Merchants (2)
1. **Kopi Kenangan**
   - Code: KOPI001
   - Categories: 4
   - Menus: 11 items
   - Tax: 10%

2. **Restoran Padang Minang**
   - Code: RPM001
   - Categories: 4
   - Menus: 8 items
   - Tax: 10%

### Categories (8 total - 4 per merchant)

**KOPI001:**
1. Beverages
2. Main Course
3. Appetizers
4. Desserts

**RPM001:**
1. Indonesian Food
2. Padang Dishes
3. Beverages
4. Desserts

### Menu Items (19 total)

**KOPI001 - 11 items:**

**Beverages (4):**
- Espresso - Rp 25,000
- Cappuccino - Rp 30,000
- Latte - Rp 28,000
- Americano - Rp 22,000

**Main Course (3):**
- Nasi Goreng - Rp 35,000
- Mie Goreng - Rp 32,000
- Fried Rice Special - Rp 40,000

**Appetizers (2):**
- French Fries - Rp 18,000
- Chicken Wings - Rp 25,000

**Desserts (2):**
- Tiramisu - Rp 35,000
- Chocolate Cake - Rp 30,000

**RPM001 - 8 items:**

**Indonesian Food (2):**
- Rendang Sapi - Rp 45,000
- Gulai Ayam - Rp 35,000

**Padang Dishes (3):**
- Sate Padang - Rp 40,000
- Dendeng Balado - Rp 55,000
- Ikan Bakar - Rp 50,000

**Beverages (2):**
- Es Teh Manis - Rp 8,000
- Jus Alpukat - Rp 15,000

**Desserts (1):**
- Es Kacang Merah - Rp 12,000

### Orders (2)
1. **ORD-20251109-0001**
   - Customer: Budi Santoso
   - Type: DINE_IN
   - Total: Rp 55,000
   - Status: COMPLETED ✅

2. **ORD-20251109-0002**
   - Customer: Ahmad Yani
   - Type: TAKEAWAY
   - Total: Rp 68,800
   - Status: COMPLETED ✅

### Revenue Statistics
- **Total Orders:** 2
- **Total Revenue:** Rp 123,800
- **Average Order Value:** Rp 61,900

---

## 🔗 API ENDPOINTS (20+)

### Base URL
```
Development: http://localhost:3000
Production: https://yourdomain.com
```

### Authentication (3 endpoints)
```
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/first-time-password
```

### Merchant Management (2 endpoints)
```
GET /api/merchant/profile
PUT /api/merchant/profile
```

### Categories (4 endpoints)
```
GET /api/merchant/categories
POST /api/merchant/categories
PUT /api/merchant/categories/[id]
DELETE /api/merchant/categories/[id]
```

### Menu Management (4 endpoints)
```
GET /api/merchant/menu
POST /api/merchant/menu
PUT /api/merchant/menu/[id]
DELETE /api/merchant/menu/[id]
```

### Order Management (3 endpoints)
```
GET /api/merchant/orders
GET /api/merchant/orders/[id]
PUT /api/merchant/orders/[id]
```

### Revenue Reports (1 endpoint)
```
GET /api/merchant/revenue?type=total
GET /api/merchant/revenue?type=daily&startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
```

### Public APIs (3 endpoints)
```
GET /api/public/merchants/[code]
GET /api/public/menu/[code]
POST /api/public/orders
```

---

## 🧪 QUICK TEST COMMANDS (PowerShell)

### 1. Login KOPI001
```powershell
$loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -ContentType "application/json" -Body (@{
  email = "budi@kopi.com"
  password = "Budi123!"
} | ConvertTo-Json)

$global:merchantToken = $loginResponse.data.accessToken
Write-Host "✅ KOPI001 Token: $global:merchantToken"
```

### 2. Login RPM001
```powershell
$loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -ContentType "application/json" -Body (@{
  email = "ahmad@padang.com"
  password = "Ahmad123!"
} | ConvertTo-Json)

$global:padangToken = $loginResponse.data.accessToken
Write-Host "✅ RPM001 Token: $global:padangToken"
```

### 3. Get Merchant Profile
```powershell
# KOPI001
Invoke-RestMethod -Uri "http://localhost:3000/api/merchant/profile" -Headers @{
  "Authorization" = "Bearer $global:merchantToken"
}

# RPM001
Invoke-RestMethod -Uri "http://localhost:3000/api/merchant/profile" -Headers @{
  "Authorization" = "Bearer $global:padangToken"
}
```

### 4. List Categories
```powershell
# KOPI001 categories
Invoke-RestMethod -Uri "http://localhost:3000/api/merchant/categories" -Headers @{
  "Authorization" = "Bearer $global:merchantToken"
}

# RPM001 categories
Invoke-RestMethod -Uri "http://localhost:3000/api/merchant/categories" -Headers @{
  "Authorization" = "Bearer $global:padangToken"
}
```

### 5. List Menus
```powershell
# KOPI001 menus
Invoke-RestMethod -Uri "http://localhost:3000/api/merchant/menu" -Headers @{
  "Authorization" = "Bearer $global:merchantToken"
}

# RPM001 menus
Invoke-RestMethod -Uri "http://localhost:3000/api/merchant/menu" -Headers @{
  "Authorization" = "Bearer $global:padangToken"
}
```

### 6. Get Orders
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/merchant/orders" -Headers @{
  "Authorization" = "Bearer $global:merchantToken"
}
```

### 7. Get Revenue
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/merchant/revenue?type=total" -Headers @{
  "Authorization" = "Bearer $global:merchantToken"
}
```

### 8. Public: Browse Menu
```powershell
# KOPI001
Invoke-RestMethod -Uri "http://localhost:3000/api/public/merchants/KOPI001"

# RPM001
Invoke-RestMethod -Uri "http://localhost:3000/api/public/merchants/RPM001"
```

### 9. Public: Create Order
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/public/orders" -Method POST -ContentType "application/json" -Body (@{
  merchantCode = "KOPI001"
  customerName = "Test Customer"
  customerEmail = "test@example.com"
  customerPhone = "+628123456789"
  orderType = "DINE_IN"
  tableNumber = "Table 1"
  items = @(
    @{
      menuId = 1
      quantity = 2
      notes = "Less sugar"
    }
  )
} | ConvertTo-Json -Depth 5)
```

---

## 📋 ORDER STATUS WORKFLOW

Valid transitions:
```
PENDING → ACCEPTED → IN_PROGRESS → READY → COMPLETED
```

Can cancel at any point before COMPLETED:
```
Any status → CANCELLED
```

Invalid transitions (will be rejected):
```
COMPLETED → PENDING ❌
COMPLETED → ACCEPTED ❌
CANCELLED → Any status ❌
```

### Update Order Status
```powershell
# Accept order
Invoke-RestMethod -Uri "http://localhost:3000/api/merchant/orders/1" -Method PUT -Headers @{
  "Authorization" = "Bearer $global:merchantToken"
} -ContentType "application/json" -Body (@{
  status = "ACCEPTED"
  notes = "Order accepted"
} | ConvertTo-Json)

# Move to in progress
Invoke-RestMethod -Uri "http://localhost:3000/api/merchant/orders/1" -Method PUT -Headers @{
  "Authorization" = "Bearer $global:merchantToken"
} -ContentType "application/json" -Body (@{
  status = "IN_PROGRESS"
} | ConvertTo-Json)

# Mark as ready
Invoke-RestMethod -Uri "http://localhost:3000/api/merchant/orders/1" -Method PUT -Headers @{
  "Authorization" = "Bearer $global:merchantToken"
} -ContentType "application/json" -Body (@{
  status = "READY"
} | ConvertTo-Json)

# Complete order
Invoke-RestMethod -Uri "http://localhost:3000/api/merchant/orders/1" -Method PUT -Headers @{
  "Authorization" = "Bearer $global:merchantToken"
} -ContentType "application/json" -Body (@{
  status = "COMPLETED"
} | ConvertTo-Json)
```

---

## 🗄️ DATABASE ACCESS

### Connection String
```
DATABASE_URL="postgresql://username:password@db.prisma.io:5432/postgres?schema=genfity"
```

### Prisma Studio (GUI)
```bash
npx prisma studio
```
Opens at: http://localhost:5555

### Direct SQL Query
```bash
# Connect via psql
psql postgresql://username:password@db.prisma.io:5432/postgres

# Switch to schema
SET search_path TO genfity;

# Query examples
SELECT * FROM genfity.merchants;
SELECT * FROM genfity.menu_categories;
SELECT * FROM genfity.menus;
SELECT * FROM genfity.orders;
```

---

## 🔧 ENVIRONMENT VARIABLES

### Required Variables
```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/database?schema=genfity"

# JWT
JWT_SECRET="your-super-secret-jwt-key-min-32-characters"
JWT_EXPIRES_IN="7d"

# Email (optional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"

# App
NODE_ENV="development"
PORT=3000
```

---

## 📚 DOCUMENTATION FILES

### Quick Links
1. **PROJECT_SUMMARY.md** - Complete project overview
2. **DEPLOYMENT_GUIDE.md** - Production deployment
3. **COMPLETE_TESTING_REPORT_NOV10.md** - Testing results (100%)
4. **IMPLEMENTASI_100_PERSEN_SELESAI.md** - Completion announcement (Bahasa)
5. **STEP_04_API_ENDPOINTS.txt** - Full API documentation

### File Locations
```
docs/
├── PROJECT_SUMMARY.md
├── DEPLOYMENT_GUIDE.md
├── COMPLETE_TESTING_REPORT_NOV10.md
├── IMPLEMENTASI_100_PERSEN_SELESAI.md
├── QUICK_REFERENCE.md (this file)
└── STEP_*.txt (8 files)
```

---

## 🎯 COMMON TASKS

### Start Development Server
```bash
npm run dev
# Server runs at http://localhost:3000
```

### Run Database Migration
```bash
npx prisma migrate dev
```

### Generate Prisma Client
```bash
npx prisma generate
```

### View Database
```bash
npx prisma studio
```

### Build for Production
```bash
npm run build
npm run start
```

---

## 🐛 TROUBLESHOOTING

### Issue: Cannot login
**Solution:** Check credentials, ensure user exists, verify JWT_SECRET is set

### Issue: 401 Unauthorized
**Solution:** Get fresh token via login, check token not expired

### Issue: Order status update fails
**Solution:** Verify valid transition, check order belongs to merchant

### Issue: Revenue shows 0
**Solution:** Ensure orders are COMPLETED status, check date range

### Issue: Data isolation not working
**Solution:** Verify using correct merchant token, check merchant_id in query

---

## ✅ VERIFIED FEATURES

All features below are 100% tested and working:

- ✅ Login/Logout with JWT
- ✅ First-time password change
- ✅ Merchant profile management
- ✅ Category CRUD (create, read, update, delete)
- ✅ Menu CRUD
- ✅ Public merchant lookup
- ✅ Public menu browsing
- ✅ Order creation (public API)
- ✅ Order listing
- ✅ Order status update (full workflow)
- ✅ Revenue calculation
- ✅ Multi-merchant data isolation
- ✅ Session management & revocation
- ✅ BigInt/Decimal serialization
- ✅ Input validation
- ✅ Error handling

---

**Last Updated:** November 10, 2025  
**Version:** 1.0  
**Status:** Production Ready ✅

**For complete documentation, see:** `docs/PROJECT_SUMMARY.md`
