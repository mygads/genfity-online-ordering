# GENFITY API Documentation# GENFITY Online Ordering - API Documentation



**Version**: 1.0.0  **Version:** 1.0.0  

**Base URL**: `http://localhost:3000` (Development)  **Base URL:** `http://localhost:3000/api`  

**Last Updated**: November 10, 2025**Date:** November 9, 2025



---## Table of Contents



## 📋 Table of Contents1. [Authentication](#authentication)

2. [Admin API](#admin-api)

1. [Authentication](#authentication)3. [Merchant API](#merchant-api)

2. [Admin Endpoints](#admin-endpoints)4. [Public API](#public-api)

3. [Merchant Endpoints](#merchant-endpoints)5. [Error Codes](#error-codes)

4. [Public Endpoints](#public-endpoints)6. [Testing Guide](#testing-guide)

5. [Error Handling](#error-handling)

6. [Testing Guide](#testing-guide)---



---## Authentication



## 🔐 AuthenticationAll authenticated endpoints require a JWT token in the Authorization header:



All authenticated endpoints require a JWT token:```

Authorization: Bearer <your-jwt-token>

``````

Authorization: Bearer <your-jwt-token>

```### Login Endpoint



### Authentication Flow**POST** `/api/auth/login`



1. **Login** → Receive JWT access token**Request:**

2. **First-time users** → Must change password```json

3. **Use token** → Access protected endpoints{

4. **Token expires** → Use refresh token or re-login (expires in 1 hour)  "email": "admin@genfity.com",

  "password": "Admin@123456"

---}

```

## 1. Authentication Endpoints

**Response:**

### 1.1 Login```json

{

**POST** `/api/auth/login`  "success": true,

  "data": {

**Request**:    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",

```json    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",

{    "expiresIn": 3600,

  "email": "siti@kopi.com",    "user": {

  "password": "YourPassword123!"      "id": "1",

}      "name": "Super Admin",

```      "email": "admin@genfity.com",

      "role": "SUPER_ADMIN"

**Response** (200):    }

```json  },

{  "message": "Login successful",

  "success": true,  "statusCode": 200

  "data": {}

    "user": {```

      "id": "3",

      "name": "Siti Nurhaliza",### Default Test Users

      "email": "siti@kopi.com",

      "role": "MERCHANT_OWNER",| Email | Password | Role |

      "merchantId": "2"|-------|----------|------|

    },| admin@genfity.com | Admin@123456 | SUPER_ADMIN |

    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",| merchant@example.com | Password123! | MERCHANT_OWNER |

    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."| customer@example.com | Password123! | CUSTOMER |

  },

  "message": "Login successful",---

  "statusCode": 200

}## Admin API

```

**Authentication Required:** Super Admin only  

---**Middleware:** `withSuperAdmin`



### 1.2 First-Time Password Change### 1. List All Merchants



**POST** `/api/auth/first-time-password`  **GET** `/api/admin/merchants?activeOnly=true`

**Auth**: None required

**Headers:**

**Request**:```

```jsonAuthorization: Bearer <super-admin-token>

{```

  "email": "ahmad@padang.com",

  "currentPassword": "TempPassword123",**Query Parameters:**

  "newPassword": "NewSecurePass456!"- `activeOnly` (boolean, optional): Filter active merchants only

}

```**Response:**

```json

**Response** (200):{

```json  "success": true,

{  "data": [

  "success": true,    {

  "data": {      "id": "1",

    "user": { ...user object... },      "code": "REST001",

    "accessToken": "...",      "name": "Warung Makan Sederhana",

    "refreshToken": "..."      "email": "warung@example.com",

  },      "phone": "+61412345678",

  "message": "Password changed successfully"      "address": "123 Main St, Sydney",

}      "isActive": true,

```      "enableTax": true,

      "taxPercentage": "10.00",

---      "createdAt": "2025-11-09T00:00:00.000Z"

    }

### 1.3 Logout  ],

  "message": "Merchants retrieved successfully",

**POST** `/api/auth/logout`    "statusCode": 200

**Auth**: Required}

```

**Response** (200):

```json### 2. Create Merchant

{

  "success": true,**POST** `/api/admin/merchants`

  "message": "Logout successful"

}**Headers:**

``````

Authorization: Bearer <super-admin-token>

---Content-Type: application/json

```

## 2. Admin Endpoints

**Request:**

### 2.1 Create Merchant```json

{

**POST** `/api/admin/merchants`    "name": "Warung Makan Sederhana",

**Auth**: SUPER_ADMIN only  "code": "REST001",

  "description": "Indonesian restaurant serving authentic dishes",

**Request**:  "address": "123 Main St, Sydney NSW 2000",

```json  "phoneNumber": "+61412345678",

{  "email": "warung@example.com",

  "merchantCode": "KOPI001",  "taxRate": 10,

  "merchantName": "Kedai Kopi Santai",  "taxIncluded": false,

  "email": "kedai@kopi.com",  "ownerName": "John Doe",

  "phone": "+628123456789",  "ownerEmail": "john@example.com"

  "address": "Jl. Sudirman No. 123, Jakarta",}

  "country": "Indonesia",```

  "description": "Cozy coffee shop",

  "currency": "IDR",**Response:**

  "enableTax": true,```json

  "taxPercentage": 10,{

  "ownerName": "Siti Nurhaliza",  "success": true,

  "ownerEmail": "siti@kopi.com",  "data": {

  "temporaryPassword": "TempPass123!"    "merchant": {

}      "id": "1",

```      "code": "REST001",

      "name": "Warung Makan Sederhana",

**Response** (201):      "isActive": true

```json    },

{    "owner": {

  "success": true,      "id": "2",

  "data": {      "name": "John Doe",

    "merchant": {      "email": "john@example.com",

      "id": "2",      "role": "MERCHANT_OWNER"

      "code": "KOPI001",    },

      "name": "Kedai Kopi Santai"    "tempPassword": "abc12345"

    },  },

    "owner": {  "message": "Merchant created successfully",

      "id": "3",  "statusCode": 201

      "email": "siti@kopi.com",}

      "mustChangePassword": true```

    }

  },**Note:** Temporary password is sent via email to owner.

  "message": "Merchant created successfully"

}### 3. Get Merchant Details

```

**GET** `/api/admin/merchants/:id`

---

**Example:** `GET /api/admin/merchants/1`

## 3. Merchant Endpoints

**Response:**

### 3.1 Get Profile```json

{

**GET** `/api/merchant/profile`    "success": true,

**Auth**: MERCHANT_OWNER or MERCHANT_STAFF  "data": {

    "id": "1",

**Response** (200):    "code": "REST001",

```json    "name": "Warung Makan Sederhana",

{    "email": "warung@example.com",

  "success": true,    "openingHours": [

  "data": {      {

    "id": "2",        "dayOfWeek": 1,

    "code": "KOPI001",        "openTime": "09:00",

    "name": "Kedai Kopi Santai",        "closeTime": "22:00",

    "email": "kedai@kopi.com",        "isClosed": false

    "phone": "+628123456789",      }

    "address": "Jl. Sudirman No. 123, Jakarta",    ],

    "isActive": true,    "merchantUsers": [

    "enableTax": true,      {

    "taxPercentage": 10.00,        "user": {

    "currency": "IDR"          "id": "2",

  }          "name": "John Doe",

}          "email": "john@example.com"

```        },

        "role": "OWNER"

---      }

    ]

### 3.2 Update Profile  },

  "message": "Merchant retrieved successfully",

**PUT** `/api/merchant/profile`    "statusCode": 200

**Auth**: MERCHANT_OWNER only}

```

**Request**:

```json### 4. Update Merchant

{

  "name": "Updated Name",**PUT** `/api/admin/merchants/:id`

  "phone": "+628123456790",

  "description": "Updated description"**Request:**

}```json

```{

  "name": "Warung Makan Sederhana Updated",

---  "description": "Updated description",

  "phoneNumber": "+61412345679",

### 3.3 Create Category  "taxRate": 15

}

**POST** `/api/merchant/categories`  ```

**Auth**: Required

**Response:**

**Request**:```json

```json{

{  "success": true,

  "name": "Beverages",  "data": {

  "description": "All drinks",    "id": "1",

  "isActive": true    "name": "Warung Makan Sederhana Updated",

}    "taxRate": 15

```  },

  "message": "Merchant updated successfully",

---  "statusCode": 200

}

### 3.4 Create Menu Item```



**POST** `/api/merchant/menus`  ### 5. Toggle Merchant Status

**Auth**: Required

**POST** `/api/admin/merchants/:id/toggle`

**Request**:

```json**Response:**

{```json

  "name": "Kopi Susu Gula Aren",{

  "categoryId": 1,  "success": true,

  "description": "Sweet coffee",  "data": {

  "price": 25000,    "id": "1",

  "isAvailable": true    "isActive": false

}  },

```  "message": "Merchant status updated successfully",

  "statusCode": 200

---}

```

### 3.5 Get Orders

### 6. Delete Merchant (Soft Delete)

**GET** `/api/merchant/orders`  

**Auth**: Required**DELETE** `/api/admin/merchants/:id`



**Query Parameters**:**Response:**

- `status` (optional): PENDING, ACCEPTED, IN_PROGRESS, READY, COMPLETED, CANCELLED```json

- `limit` (optional): default 50{

- `offset` (optional): default 0  "success": true,

  "message": "Merchant deleted successfully",

**Response** (200):  "statusCode": 200

```json}

{```

  "success": true,

  "data": [---

    {

      "id": "1",## Merchant API

      "orderNumber": "ORD-20251109-0001",

      "customerName": "Budi Santoso",**Authentication Required:** Merchant Owner or Staff  

      "status": "PENDING",**Middleware:** `withMerchant`

      "totalAmount": 55000.00,

      "orderItems": [...]### Profile Management

    }

  ]#### 1. Get Merchant Profile

}

```**GET** `/api/merchant/profile`



---**Headers:**

```

### 3.6 Update Order StatusAuthorization: Bearer <merchant-token>

```

**PUT** `/api/merchant/orders/:id`  

**Auth**: Required**Response:**

```json

**Request**:{

```json  "success": true,

{  "data": {

  "status": "ACCEPTED",    "id": "1",

  "notes": "Order accepted"    "code": "REST001",

}    "name": "Warung Makan Sederhana",

```    "description": "Indonesian restaurant",

    "email": "warung@example.com",

**Valid Transitions**:    "phone": "+61412345678",

- PENDING → ACCEPTED or CANCELLED    "address": "123 Main St, Sydney",

- ACCEPTED → IN_PROGRESS or CANCELLED    "enableTax": true,

- IN_PROGRESS → READY or CANCELLED    "taxPercentage": "10.00",

- READY → COMPLETED or CANCELLED    "openingHours": []

  },

---  "message": "Merchant profile retrieved successfully",

  "statusCode": 200

### 3.7 Revenue Report}

```

**GET** `/api/merchant/reports/revenue`  

**Auth**: Required#### 2. Update Merchant Profile



**Query Parameters**:**PUT** `/api/merchant/profile`

- `startDate` (optional): YYYY-MM-DD

- `endDate` (optional): YYYY-MM-DD**Request:**

```json

**Response** (200):{

```json  "name": "Warung Makan Sederhana",

{  "description": "Updated description",

  "success": true,  "phoneNumber": "+61412345678",

  "data": {  "taxRate": 10

    "totalRevenue": 123800.00,}

    "totalOrders": 2,```

    "averageOrderValue": 61900.00

  }### Category Management

}

```#### 3. List Categories



---**GET** `/api/merchant/categories`



## 4. Public Endpoints**Response:**

```json

### 4.1 Get Merchant{

  "success": true,

**GET** `/api/public/merchants/:code`    "data": [

**Auth**: None    {

      "id": "1",

**Response** (200):      "name": "Main Course",

```json      "description": "Main dishes",

{      "sortOrder": 1,

  "success": true,      "isActive": true

  "data": {    }

    "code": "KOPI001",  ],

    "name": "Kedai Kopi Santai",  "message": "Categories retrieved successfully",

    "description": "Cozy coffee shop",  "statusCode": 200

    "phone": "+628123456789",}

    "address": "Jl. Sudirman No. 123"```

  }

}#### 4. Create Category

```

**POST** `/api/merchant/categories`

---

**Request:**

### 4.2 Browse Menu```json

{

**GET** `/api/public/merchants/:merchantCode/menu`    "name": "Appetizers",

**Auth**: None  "description": "Starter dishes",

  "sortOrder": 1

**Response** (200):}

```json```

{

  "success": true,#### 5. Update Category

  "data": {

    "merchant": {...},**PUT** `/api/merchant/categories/:id`

    "categories": [

      {**Request:**

        "id": "1",```json

        "name": "Beverages",{

        "menus": [  "name": "Appetizers Updated",

          {  "sortOrder": 2

            "id": "1",}

            "name": "Kopi Susu",```

            "price": 25000,

            "isAvailable": true#### 6. Delete Category

          }

        ]**DELETE** `/api/merchant/categories/:id`

      }

    ]### Menu Management

  }

}#### 7. List Menus

```

**GET** `/api/merchant/menu?categoryId=1`

---

**Query Parameters:**

### 4.3 Create Order- `categoryId` (optional): Filter by category



**POST** `/api/public/orders`  **Response:**

**Auth**: None```json

{

**Request**:  "success": true,

```json  "data": [

{    {

  "merchantCode": "KOPI001",      "id": "1",

  "customerName": "John Doe",      "name": "Nasi Goreng",

  "customerEmail": "john@example.com",      "description": "Indonesian fried rice",

  "customerPhone": "+628123456789",      "price": "15.00",

  "orderType": "DINE_IN",      "categoryId": "1",

  "tableNumber": "Table 5",      "imageUrl": null,

  "items": [      "isActive": true,

    {      "trackStock": true,

      "menuId": 1,      "stockQty": 50

      "quantity": 2,    }

      "notes": "Less sugar"  ],

    }  "message": "Menus retrieved successfully",

  ]  "statusCode": 200

}}

``````



**Response** (201):#### 8. Create Menu

```json

{**POST** `/api/merchant/menu`

  "success": true,

  "data": {**Request:**

    "orderNumber": "ORD-20251109-0001",```json

    "status": "PENDING",{

    "totalAmount": 55000.00  "categoryId": "1",

  }  "name": "Nasi Goreng",

}  "description": "Indonesian fried rice with chicken",

```  "price": 15.00,

  "imageUrl": "https://example.com/image.jpg",

---  "isAvailable": true,

  "hasStock": true,

## 5. Error Handling  "stockQuantity": 50

}

### Error Response Format```



```json**Response:**

{```json

  "success": false,{

  "error": "ERROR_CODE",  "success": true,

  "message": "User-friendly message",  "data": {

  "statusCode": 400    "id": "1",

}    "name": "Nasi Goreng",

```    "price": "15.00",

    "isActive": true,

### Common Error Codes    "trackStock": true,

    "stockQty": 50

| Code | Status | Description |  },

|------|--------|-------------|  "message": "Menu created successfully",

| VALIDATION_ERROR | 400 | Invalid input |  "statusCode": 201

| INVALID_CREDENTIALS | 401 | Wrong email/password |}

| UNAUTHORIZED | 401 | No/invalid token |```

| FORBIDDEN | 403 | Insufficient permissions |

| NOT_FOUND | 404 | Resource not found |#### 9. Get Menu Details

| INTERNAL_ERROR | 500 | Server error |

**GET** `/api/merchant/menu/:id`

---

#### 10. Update Menu

## 6. Testing Guide

**PUT** `/api/merchant/menu/:id`

### Using cURL

**Request:**

**Login**:```json

```bash{

curl -X POST http://localhost:3000/api/auth/login \  "name": "Nasi Goreng Special",

  -H "Content-Type: application/json" \  "price": 18.00,

  -d '{"email":"siti@kopi.com","password":"YourPassword"}'  "stockQuantity": 30

```}

```

**Get Orders** (Authenticated):

```bash#### 11. Delete Menu

curl -X GET http://localhost:3000/api/merchant/orders \

  -H "Authorization: Bearer YOUR_TOKEN"**DELETE** `/api/merchant/menu/:id`

```

### Order Management

**Create Public Order**:

```bash#### 12. List Orders

curl -X POST http://localhost:3000/api/public/orders \

  -H "Content-Type: application/json" \**GET** `/api/merchant/orders?status=PENDING&orderType=DINE_IN&startDate=2025-11-01&endDate=2025-11-09`

  -d '{

    "merchantCode":"KOPI001",**Query Parameters:**

    "customerName":"John",- `status` (optional): PENDING, ACCEPTED, IN_PROGRESS, READY, COMPLETED, CANCELLED

    "customerEmail":"john@test.com",- `orderType` (optional): DINE_IN, TAKEAWAY

    "customerPhone":"+628123456789",- `startDate` (optional): ISO date string

    "orderType":"TAKEAWAY",- `endDate` (optional): ISO date string

    "items":[{"menuId":1,"quantity":2}]

  }'**Response:**

``````json

{

---  "success": true,

  "data": [

## Test Credentials    {

      "id": "1",

### Admin      "orderNumber": "ORD-20251109-0001",

- Email: `admin@genfity.com`      "status": "PENDING",

- Password: `Admin123!`      "orderType": "DINE_IN",

      "tableNumber": "5",

### Merchant Owner (KOPI001)      "customerName": "Jane Smith",

- Email: `siti@kopi.com`      "subtotal": "45.00",

- Password: Set after first login      "taxAmount": "4.50",

      "totalAmount": "49.50",

### Merchant Owner (RPM001)      "placedAt": "2025-11-09T10:30:00.000Z"

- Email: `ahmad@padang.com`    }

- Password: Set after first login  ],

  "message": "Orders retrieved successfully",

---  "statusCode": 200

}

**For complete testing guide, see**: `docs/TESTING_GUIDE.md````



**Last Updated**: November 10, 2025#### 13. Update Order Status


**PUT** `/api/merchant/orders/:id/status`

**Request:**
```json
{
  "status": "ACCEPTED",
  "notes": "Order accepted, preparing food"
}
```

**Valid Status Transitions:**
- PENDING → ACCEPTED, CANCELLED
- ACCEPTED → IN_PROGRESS, CANCELLED
- IN_PROGRESS → READY, CANCELLED
- READY → COMPLETED, CANCELLED

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "orderNumber": "ORD-20251109-0001",
    "status": "ACCEPTED"
  },
  "message": "Order status updated successfully",
  "statusCode": 200
}
```

### Revenue Analytics

#### 14. Get Revenue Report

**GET** `/api/merchant/revenue?type=daily&startDate=2025-11-01&endDate=2025-11-09`

**Query Parameters:**
- `type`: "daily" or "total"
- `startDate` (optional): Defaults to 30 days ago
- `endDate` (optional): Defaults to today

**Response (Daily):**
```json
{
  "success": true,
  "data": {
    "type": "daily",
    "startDate": "2025-11-01T00:00:00.000Z",
    "endDate": "2025-11-09T23:59:59.999Z",
    "report": [
      {
        "date": "2025-11-09",
        "totalOrders": 15,
        "totalRevenue": 750.50
      }
    ]
  },
  "message": "Revenue report retrieved successfully",
  "statusCode": 200
}
```

**Response (Total):**
```json
{
  "success": true,
  "data": {
    "type": "total",
    "startDate": "2025-11-01T00:00:00.000Z",
    "endDate": "2025-11-09T23:59:59.999Z",
    "totalOrders": 150,
    "totalRevenue": 7500.50,
    "averageOrderValue": 50.00
  },
  "message": "Total revenue retrieved successfully",
  "statusCode": 200
}
```

---

## Public API

**Authentication:** Not required  
**Middleware:** None

### 1. Lookup Merchant by Code

**GET** `/api/public/merchant/:code`

**Example:** `GET /api/public/merchant/REST001`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "1",
    "code": "REST001",
    "name": "Warung Makan Sederhana",
    "email": "warung@example.com",
    "phone": "+61412345678",
    "address": "123 Main St, Sydney",
    "description": "Indonesian restaurant",
    "logoUrl": null,
    "isActive": true,
    "enableTax": true,
    "taxPercentage": "10.00",
    "currency": "AUD",
    "openingHours": [
      {
        "dayOfWeek": 1,
        "openTime": "09:00",
        "closeTime": "22:00",
        "isClosed": false
      }
    ]
  },
  "message": "Merchant retrieved successfully",
  "statusCode": 200
}
```

### 2. Browse Menu

**GET** `/api/public/menu/:merchantCode`

**Example:** `GET /api/public/menu/REST001`

**Response:**
```json
{
  "success": true,
  "data": {
    "merchant": {
      "code": "REST001",
      "name": "Warung Makan Sederhana",
      "description": "Indonesian restaurant",
      "logoUrl": null
    },
    "menusByCategory": [
      {
        "category": {
          "id": "1",
          "name": "Main Course",
          "description": "Main dishes",
          "sortOrder": 1
        },
        "menus": [
          {
            "id": "1",
            "name": "Nasi Goreng",
            "description": "Indonesian fried rice",
            "price": "15.00",
            "imageUrl": null,
            "isActive": true,
            "trackStock": true,
            "stockQty": 50
          }
        ]
      }
    ]
  },
  "message": "Menu retrieved successfully",
  "statusCode": 200
}
```

### 3. Create Order

**POST** `/api/public/orders`

**Request:**
```json
{
  "merchantId": "1",
  "orderType": "DINE_IN",
  "tableNumber": "5",
  "customerName": "Jane Smith",
  "customerEmail": "jane@example.com",
  "customerPhone": "+61412345678",
  "items": [
    {
      "menuId": "1",
      "quantity": 2,
      "selectedAddons": [],
      "specialInstructions": "Extra spicy please"
    },
    {
      "menuId": "2",
      "quantity": 1,
      "selectedAddons": ["3", "4"],
      "specialInstructions": null
    }
  ],
  "notes": "Please prepare quickly"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "orderId": "1",
    "orderNumber": "ORD-20251109-0001",
    "status": "PENDING",
    "orderType": "DINE_IN",
    "tableNumber": "5",
    "subtotal": "45.00",
    "taxAmount": "4.50",
    "totalAmount": "49.50",
    "customerName": "Jane Smith",
    "customerEmail": "jane@example.com",
    "createdAt": "2025-11-09T10:30:00.000Z"
  },
  "message": "Order created successfully",
  "statusCode": 201
}
```

**Note:** If customer email doesn't exist, a new customer account is automatically created.

### 4. Track Order

**GET** `/api/public/orders/:orderNumber`

**Example:** `GET /api/public/orders/ORD-20251109-0001`

**Response:**
```json
{
  "success": true,
  "data": {
    "orderNumber": "ORD-20251109-0001",
    "status": "IN_PROGRESS",
    "orderType": "DINE_IN",
    "tableNumber": "5",
    "customerName": "Jane Smith",
    "subtotal": "45.00",
    "taxAmount": "4.50",
    "totalAmount": "49.50",
    "notes": "Please prepare quickly",
    "placedAt": "2025-11-09T10:30:00.000Z",
    "statusHistory": [
      {
        "fromStatus": null,
        "toStatus": "PENDING",
        "note": "Order placed",
        "createdAt": "2025-11-09T10:30:00.000Z"
      },
      {
        "fromStatus": "PENDING",
        "toStatus": "ACCEPTED",
        "note": "Order accepted",
        "createdAt": "2025-11-09T10:32:00.000Z"
      },
      {
        "fromStatus": "ACCEPTED",
        "toStatus": "IN_PROGRESS",
        "note": "Preparing food",
        "createdAt": "2025-11-09T10:35:00.000Z"
      }
    ],
    "merchant": {
      "name": "Warung Makan Sederhana",
      "code": "REST001",
      "phone": "+61412345678",
      "address": "123 Main St, Sydney"
    }
  },
  "message": "Order retrieved successfully",
  "statusCode": 200
}
```

---

## Error Codes

All error responses follow this format:

```json
{
  "success": false,
  "error": "ERROR_CODE",
  "message": "Human-readable error message",
  "statusCode": 400
}
```

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| UNAUTHORIZED | 401 | Missing or invalid authentication token |
| FORBIDDEN | 403 | User doesn't have permission |
| VALIDATION_ERROR | 400 | Invalid request data |
| NOT_FOUND | 404 | Resource not found |
| MERCHANT_NOT_FOUND | 404 | Merchant not found |
| ORDER_NOT_FOUND | 404 | Order not found |
| MENU_NOT_FOUND | 404 | Menu item not found |
| MERCHANT_INACTIVE | 400 | Merchant is not active |
| MERCHANT_CLOSED | 400 | Merchant is currently closed |
| MENU_INACTIVE | 400 | Menu item not available |
| MENU_OUT_OF_STOCK | 400 | Insufficient stock |
| INVALID_STATUS_TRANSITION | 400 | Invalid order status change |
| EMPTY_CART | 400 | Order has no items |
| INTERNAL_ERROR | 500 | Server error |

---

## Testing Guide

### Prerequisites

1. Start the development server:
```bash
npm run dev
```

2. Ensure database is running and migrated:
```bash
npx prisma migrate deploy
npx prisma generate
npx prisma db seed
```

### Testing Flow

#### 1. Login as Super Admin

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@genfity.com",
    "password": "Admin123!@#"
  }'
```

Save the `accessToken` for subsequent requests.

#### 2. Create Merchant (as Super Admin)

```bash
curl -X POST http://localhost:3000/api/admin/merchants \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <super-admin-token>" \
  -d '{
    "name": "Test Restaurant",
    "code": "TEST001",
    "email": "test@restaurant.com",
    "phoneNumber": "+61400000000",
    "address": "123 Test St",
    "taxRate": 10,
    "ownerName": "Test Owner",
    "ownerEmail": "owner@test.com"
  }'
```

#### 3. Login as Merchant Owner

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "owner@test.com",
    "password": "<temp-password-from-email>"
  }'
```

#### 4. Create Category (as Merchant)

```bash
curl -X POST http://localhost:3000/api/merchant/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <merchant-token>" \
  -d '{
    "name": "Main Course",
    "description": "Main dishes",
    "sortOrder": 1
  }'
```

#### 5. Create Menu Item (as Merchant)

```bash
curl -X POST http://localhost:3000/api/merchant/menu \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <merchant-token>" \
  -d '{
    "categoryId": "1",
    "name": "Nasi Goreng",
    "description": "Fried rice",
    "price": 15.00,
    "isAvailable": true,
    "hasStock": true,
    "stockQuantity": 50
  }'
```

#### 6. Create Order (Public - No Auth)

```bash
curl -X POST http://localhost:3000/api/public/orders \
  -H "Content-Type: application/json" \
  -d '{
    "merchantId": "1",
    "orderType": "DINE_IN",
    "tableNumber": "5",
    "customerName": "Test Customer",
    "customerEmail": "customer@test.com",
    "customerPhone": "+61400000001",
    "items": [
      {
        "menuId": "1",
        "quantity": 2,
        "selectedAddons": [],
        "specialInstructions": "Extra spicy"
      }
    ]
  }'
```

#### 7. Track Order (Public - No Auth)

```bash
curl http://localhost:3000/api/public/orders/ORD-20251109-0001
```

#### 8. Update Order Status (as Merchant)

```bash
curl -X PUT http://localhost:3000/api/merchant/orders/1/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <merchant-token>" \
  -d '{
    "status": "ACCEPTED",
    "notes": "Order accepted"
  }'
```

#### 9. View Revenue (as Merchant)

```bash
curl "http://localhost:3000/api/merchant/revenue?type=total&startDate=2025-11-01&endDate=2025-11-09" \
  -H "Authorization: Bearer <merchant-token>"
```

### Postman Collection

Import the following collection to Postman for easier testing:

**Collection URL:** (To be created)

---

## Support

For issues or questions:
- Email: support@genfity.com
- GitHub: https://github.com/genfity/online-ordering

---

**Last Updated:** November 9, 2025  
**Version:** 1.0.0
