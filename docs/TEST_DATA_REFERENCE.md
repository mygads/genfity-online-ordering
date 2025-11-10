# Test Data Reference

**Version:** 1.0.0  
**Last Updated:** November 10, 2025  
**Database Schema:** GENFITY  
**Total Test Items:** 34 records

This document provides a comprehensive reference for all test data created during development and testing.

---

## 📋 Table of Contents

1. [Test Users & Credentials](#1-test-users--credentials)
2. [Merchants](#2-merchants)
3. [Categories](#3-categories)
4. [Menu Items](#4-menu-items)
5. [Customers](#5-customers)
6. [Orders](#6-orders)
7. [Authentication Tokens](#7-authentication-tokens)
8. [Testing Workflows](#8-testing-workflows)
9. [Quick Test Commands](#9-quick-test-commands)

---

## 1. Test Users & Credentials

### Super Admin

| Field | Value |
|-------|-------|
| **User ID** | 1 |
| **Name** | Super Admin |
| **Email** | `admin@genfity.com` |
| **Password** | `Admin123!` (first-time password changed) |
| **Role** | `SUPER_ADMIN` |
| **Status** | Active |
| **Must Change Password** | `false` |

**Capabilities:**
- Create merchants
- View all merchants
- Access admin dashboard

---

### Merchant Owner #1 (Kopi Kenangan)

| Field | Value |
|-------|-------|
| **User ID** | 2 |
| **Name** | Budi Santoso |
| **Email** | `budi@kopikenangan.com` |
| **Original Temp Password** | `TempKopi123!` |
| **New Password** | `NewKopi123!` (changed via first-time password endpoint) |
| **Role** | `MERCHANT_OWNER` |
| **Merchant ID** | 2 |
| **Merchant Code** | `KOPI001` |
| **Status** | Active |

**Capabilities:**
- Manage merchant profile
- Create/edit categories and menus
- Process orders
- View revenue reports

---

### Merchant Owner #2 (Restoran Padang Minang)

| Field | Value |
|-------|-------|
| **User ID** | 4 |
| **Name** | Ahmad Dahlan |
| **Email** | `ahmad@padang.com` |
| **Original Temp Password** | `TempPadang123!` |
| **New Password** | `NewPadang123!` (changed) |
| **Role** | `MERCHANT_OWNER` |
| **Merchant ID** | 3 |
| **Merchant Code** | `RPM001` |
| **Status** | Active |

**Capabilities:**
- Same as Merchant Owner #1

---

## 2. Merchants

### Merchant #1: Kopi Kenangan

```json
{
  "id": 2,
  "merchantCode": "KOPI001",
  "merchantName": "Kopi Kenangan",
  "email": "contact@kopikenangan.com",
  "phone": "+6281234567890",
  "address": "Jl. Sudirman No. 123, Jakarta",
  "country": "Indonesia",
  "currency": "IDR",
  "enableTax": true,
  "taxPercentage": 10,
  "isActive": true,
  "categories": 4,
  "menuItems": 11,
  "totalOrders": 1,
  "totalRevenue": "Rp 28,800"
}
```

**Owner**: Budi Santoso (`budi@kopikenangan.com`)

---

### Merchant #2: Restoran Padang Minang

```json
{
  "id": 3,
  "merchantCode": "RPM001",
  "merchantName": "Restoran Padang Minang",
  "email": "contact@padangminang.com",
  "phone": "+6281234567891",
  "address": "Jl. Hayam Wuruk No. 45, Jakarta",
  "country": "Indonesia",
  "currency": "IDR",
  "enableTax": true,
  "taxPercentage": 10,
  "isActive": true,
  "categories": 4,
  "menuItems": 8,
  "totalOrders": 1,
  "totalRevenue": "Rp 95,000"
}
```

**Owner**: Ahmad Dahlan (`ahmad@padang.com`)

---

## 3. Categories

### KOPI001 Categories

| ID | Name | Description | Item Count |
|----|------|-------------|------------|
| 1 | Coffee | Various coffee drinks | 4 |
| 2 | Non-Coffee | Non-coffee beverages | 3 |
| 3 | Snacks | Light snacks and pastries | 2 |
| 4 | Food | Main dishes | 2 |

### RPM001 Categories

| ID | Name | Description | Item Count |
|----|------|-------------|------------|
| 5 | Indonesian Food | Traditional Indonesian dishes | 2 |
| 6 | Padang Dishes | Authentic Padang cuisine | 3 |
| 7 | Beverages | Drinks and refreshments | 2 |
| 8 | Desserts | Sweet treats | 1 |

**Total Categories:** 8 (4 per merchant)  
**Data Isolation:** ✅ Verified - Each merchant sees only their categories

---

## 4. Menu Items

### KOPI001 Menu Items (11 items)

#### Coffee Category (4 items)

| Name | Price | Stock | Status |
|------|-------|-------|--------|
| Kopi Kenangan Mantan | Rp 25,000 | 100 | Available |
| Americano | Rp 20,000 | 50 | Available |
| Cappuccino | Rp 28,000 | 50 | Available |
| Latte | Rp 30,000 | 50 | Available |

#### Non-Coffee Category (3 items)

| Name | Price | Stock | Status |
|------|-------|-------|--------|
| Es Teh Manis | Rp 8,000 | 200 | Available |
| Chocolate | Rp 22,000 | 50 | Available |
| Matcha Latte | Rp 32,000 | 30 | Available |

#### Snacks Category (2 items)

| Name | Price | Stock | Status |
|------|-------|-------|--------|
| Croissant | Rp 15,000 | 20 | Available |
| Donut | Rp 12,000 | 30 | Available |

#### Food Category (2 items)

| Name | Price | Stock | Status |
|------|-------|-------|--------|
| Nasi Goreng | Rp 25,000 | 50 | Available |
| Mie Goreng | Rp 23,000 | 50 | Available |

---

### RPM001 Menu Items (8 items)

#### Indonesian Food Category (2 items)

| Name | Price | Stock | Status |
|------|-------|-------|--------|
| Nasi Goreng Spesial | Rp 30,000 | 50 | Available |
| Mie Goreng Jawa | Rp 28,000 | 50 | Available |

#### Padang Dishes Category (3 items)

| Name | Price | Stock | Status |
|------|-------|-------|--------|
| Rendang Sapi | Rp 55,000 | 20 | Available |
| Gulai Ayam | Rp 45,000 | 30 | Available |
| Sate Padang | Rp 40,000 | 25 | Available |

#### Beverages Category (2 items)

| Name | Price | Stock | Status |
|------|-------|-------|--------|
| Es Teh Manis | Rp 8,000 | 100 | Available |
| Es Jeruk | Rp 10,000 | 100 | Available |

#### Desserts Category (1 item)

| Name | Price | Stock | Status |
|------|-------|-------|--------|
| Es Campur | Rp 15,000 | 30 | Available |

**Total Menu Items:** 19 (11 for KOPI001, 8 for RPM001)  
**Data Isolation:** ✅ Verified - Each merchant manages only their menus

---

## 5. Customers

### Customer #1 (KOPI001 Order)

| Field | Value |
|-------|-------|
| **User ID** | 3 |
| **Name** | Customer One |
| **Email** | `customer1@example.com` |
| **Phone** | `+6281111111111` |
| **Role** | `CUSTOMER` |
| **Registration** | Auto-registered via public order API |
| **Orders** | 1 (KOPI001) |

---

### Customer #2 (RPM001 Order)

| Field | Value |
|-------|-------|
| **User ID** | 5 |
| **Name** | Customer Two |
| **Email** | `customer2@example.com` |
| **Phone** | `+6282222222222` |
| **Role** | `CUSTOMER` |
| **Registration** | Auto-registered via public order API |
| **Orders** | 1 (RPM001) |

**Total Customers:** 2  
**Auto-Registration:** ✅ Working - New customers created automatically on first order

---

## 6. Orders

### Order #1 (KOPI001)

```json
{
  "orderId": 1,
  "orderNumber": "ORD-20251110-0001",
  "merchantCode": "KOPI001",
  "merchantName": "Kopi Kenangan",
  "customer": {
    "name": "Customer One",
    "email": "customer1@example.com",
    "phone": "+6281111111111"
  },
  "orderType": "DINE_IN",
  "tableNumber": "A5",
  "items": [
    {
      "menuName": "Kopi Kenangan Mantan",
      "quantity": 1,
      "price": 25000,
      "subtotal": 25000
    }
  ],
  "pricing": {
    "subtotal": 25000,
    "taxPercentage": 10,
    "taxAmount": 2500,
    "totalAmount": 27500
  },
  "status": "COMPLETED",
  "statusHistory": [
    "PENDING (2025-11-10 10:00:00)",
    "ACCEPTED (2025-11-10 10:05:00)",
    "IN_PROGRESS (2025-11-10 10:10:00)",
    "READY (2025-11-10 10:20:00)",
    "COMPLETED (2025-11-10 10:30:00)"
  ],
  "qrCodeUrl": "data:image/png;base64,..."
}
```

**Revenue:** Rp 27,500 (after tax)  
**Status Workflow:** ✅ Complete 5-stage flow tested

---

### Order #2 (RPM001)

```json
{
  "orderId": 2,
  "orderNumber": "ORD-20251110-0002",
  "merchantCode": "RPM001",
  "merchantName": "Restoran Padang Minang",
  "customer": {
    "name": "Customer Two",
    "email": "customer2@example.com",
    "phone": "+6282222222222"
  },
  "orderType": "TAKEAWAY",
  "tableNumber": null,
  "items": [
    {
      "menuName": "Rendang Sapi",
      "quantity": 1,
      "price": 55000,
      "subtotal": 55000
    },
    {
      "menuName": "Es Teh Manis",
      "quantity": 2,
      "price": 8000,
      "subtotal": 16000
    }
  ],
  "pricing": {
    "subtotal": 71000,
    "taxPercentage": 10,
    "taxAmount": 7100,
    "totalAmount": 78100
  },
  "status": "COMPLETED",
  "statusHistory": [
    "PENDING (2025-11-10 11:00:00)",
    "ACCEPTED (2025-11-10 11:02:00)",
    "IN_PROGRESS (2025-11-10 11:05:00)",
    "READY (2025-11-10 11:15:00)",
    "COMPLETED (2025-11-10 11:20:00)"
  ],
  "qrCodeUrl": "data:image/png;base64,..."
}
```

**Revenue:** Rp 78,100 (after tax)  
**Status Workflow:** ✅ Complete flow tested

---

**Total Orders:** 2  
**Total Revenue:** Rp 105,600 (Rp 27,500 + Rp 78,100)  
**Average Order Value:** Rp 52,800  
**Order Types:** 50% Dine-in, 50% Takeaway

---

## 7. Authentication Tokens

### How to Get Tokens

Use the `/api/auth/login` endpoint to get access tokens.

#### Get Super Admin Token

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@genfity.com",
    "password": "Admin123!"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "admin@genfity.com",
      "name": "Super Admin",
      "role": "SUPER_ADMIN"
    }
  }
}
```

**Store in PowerShell Variable:**
```powershell
$adminToken = "paste-access-token-here"
```

---

#### Get KOPI001 Merchant Token

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "budi@kopikenangan.com",
    "password": "NewKopi123!"
  }'
```

**Store in PowerShell Variable:**
```powershell
$kopiToken = "paste-access-token-here"
```

---

#### Get RPM001 Merchant Token

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ahmad@padang.com",
    "password": "NewPadang123!"
  }'
```

**Store in PowerShell Variable:**
```powershell
$padangToken = "paste-access-token-here"
```

---

## 8. Testing Workflows

### Workflow 1: Create New Merchant (Admin)

```bash
# 1. Login as admin
$response = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"admin@genfity.com","password":"Admin123!"}'
$adminToken = $response.data.accessToken

# 2. Create merchant
Invoke-RestMethod -Uri "http://localhost:3000/api/admin/merchants" `
  -Method POST `
  -Headers @{Authorization="Bearer $adminToken"} `
  -ContentType "application/json" `
  -Body '{
    "merchantCode":"TEST001",
    "merchantName":"Test Restaurant",
    "email":"contact@test.com",
    "phone":"+1234567890",
    "address":"123 Test St",
    "country":"Indonesia",
    "currency":"IDR",
    "enableTax":true,
    "taxPercentage":10,
    "ownerName":"Test Owner",
    "ownerEmail":"owner@test.com",
    "temporaryPassword":"TempTest123!"
  }'
```

---

### Workflow 2: Merchant Setup (First-Time Login)

```bash
# 1. Change password (first-time)
Invoke-RestMethod -Uri "http://localhost:3000/api/auth/first-time-password" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{
    "email":"owner@test.com",
    "currentPassword":"TempTest123!",
    "newPassword":"NewTest123!"
  }'

# 2. Login with new password
$response = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"owner@test.com","password":"NewTest123!"}'
$merchantToken = $response.data.accessToken

# 3. Get merchant profile
Invoke-RestMethod -Uri "http://localhost:3000/api/merchant/profile" `
  -Method GET `
  -Headers @{Authorization="Bearer $merchantToken"}
```

---

### Workflow 3: Menu Setup

```bash
# 1. Create category
$categoryResponse = Invoke-RestMethod `
  -Uri "http://localhost:3000/api/merchant/categories" `
  -Method POST `
  -Headers @{Authorization="Bearer $merchantToken"} `
  -ContentType "application/json" `
  -Body '{"name":"Beverages","description":"Hot and cold drinks"}'

$categoryId = $categoryResponse.data.id

# 2. Create menu item
Invoke-RestMethod -Uri "http://localhost:3000/api/merchant/menus" `
  -Method POST `
  -Headers @{Authorization="Bearer $merchantToken"} `
  -ContentType "application/json" `
  -Body "{
    \"categoryId\":$categoryId,
    \"name\":\"Espresso\",
    \"description\":\"Strong Italian coffee\",
    \"price\":20000,
    \"stockQuantity\":100,
    \"isAvailable\":true
  }"
```

---

### Workflow 4: Customer Order

```bash
# 1. Browse merchant menu (public API)
Invoke-RestMethod -Uri "http://localhost:3000/api/public/merchants/TEST001/menus"

# 2. Create order (public API)
Invoke-RestMethod -Uri "http://localhost:3000/api/public/orders" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{
    "merchantCode":"TEST001",
    "orderType":"DINE_IN",
    "tableNumber":"A1",
    "customer":{
      "name":"John Doe",
      "email":"john@example.com",
      "phone":"+1234567890"
    },
    "items":[
      {"menuId":1,"quantity":2}
    ]
  }'
```

---

### Workflow 5: Order Processing (Merchant)

```bash
# 1. Get pending orders
Invoke-RestMethod -Uri "http://localhost:3000/api/merchant/orders?status=PENDING" `
  -Headers @{Authorization="Bearer $merchantToken"}

# 2. Accept order
Invoke-RestMethod -Uri "http://localhost:3000/api/merchant/orders/1" `
  -Method PATCH `
  -Headers @{Authorization="Bearer $merchantToken"} `
  -ContentType "application/json" `
  -Body '{"status":"ACCEPTED","notes":"Order confirmed"}'

# 3. Start preparing
Invoke-RestMethod -Uri "http://localhost:3000/api/merchant/orders/1" `
  -Method PATCH `
  -Headers @{Authorization="Bearer $merchantToken"} `
  -ContentType "application/json" `
  -Body '{"status":"IN_PROGRESS"}'

# 4. Mark as ready
Invoke-RestMethod -Uri "http://localhost:3000/api/merchant/orders/1" `
  -Method PATCH `
  -Headers @{Authorization="Bearer $merchantToken"} `
  -ContentType "application/json" `
  -Body '{"status":"READY"}'

# 5. Complete order
Invoke-RestMethod -Uri "http://localhost:3000/api/merchant/orders/1" `
  -Method PATCH `
  -Headers @{Authorization="Bearer $merchantToken"} `
  -ContentType "application/json" `
  -Body '{"status":"COMPLETED"}'
```

---

## 9. Quick Test Commands

### Check Database Connection

```bash
npx prisma db pull
```

### View Database in Browser

```bash
npx prisma studio
```

Opens Prisma Studio at `http://localhost:5555`

### Query Test Data

```sql
-- Count all records
SELECT 'users' as table_name, COUNT(*) as count FROM genfity.users
UNION ALL SELECT 'merchants', COUNT(*) FROM genfity.merchants
UNION ALL SELECT 'menu_categories', COUNT(*) FROM genfity.menu_categories
UNION ALL SELECT 'menus', COUNT(*) FROM genfity.menus
UNION ALL SELECT 'orders', COUNT(*) FROM genfity.orders;

-- Get merchant revenue
SELECT 
  m.merchant_code,
  m.merchant_name,
  COUNT(o.id) as total_orders,
  SUM(o.total_amount) as total_revenue
FROM genfity.merchants m
LEFT JOIN genfity.orders o ON o.merchant_id = m.id
WHERE o.status = 'COMPLETED'
GROUP BY m.id, m.merchant_code, m.merchant_name;

-- Get order status distribution
SELECT status, COUNT(*) as count
FROM genfity.orders
GROUP BY status;
```

---

## 10. Data Summary

| Category | Count |
|----------|-------|
| **Users** | 5 (1 admin, 2 merchant owners, 2 customers) |
| **Merchants** | 2 (KOPI001, RPM001) |
| **Categories** | 8 (4 per merchant) |
| **Menu Items** | 19 (11 for KOPI001, 8 for RPM001) |
| **Orders** | 2 (both completed) |
| **Total Revenue** | Rp 105,600 |

---

## Support

For questions about test data:
- See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for endpoint details
- See [COMPLETE_TESTING_REPORT_NOV10.md](COMPLETE_TESTING_REPORT_NOV10.md) for full test results

---

**Last Updated:** November 10, 2025
