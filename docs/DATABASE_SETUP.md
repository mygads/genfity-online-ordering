# Database Setup Instructions

## Prerequisites
- PostgreSQL 14+ installed and running
- Database credentials configured in `.env.local`

## Step 1: Create Database

### Option A: Using PostgreSQL CLI (psql)
```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE genfity_db;

# Grant privileges (if needed)
GRANT ALL PRIVILEGES ON DATABASE genfity_db TO postgres;

# Exit
\q
```

### Option B: Using pgAdmin
1. Open pgAdmin
2. Right-click on "Databases"
3. Select "Create" → "Database"
4. Enter name: `genfity_db`
5. Click "Save"

## Step 2: Configure Environment Variables

Update `.env.local` with your actual PostgreSQL credentials:

```env
DATABASE_URL="postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/genfity_db?schema=public"
```

Replace:
- `YOUR_USERNAME` with your PostgreSQL username (default: `postgres`)
- `YOUR_PASSWORD` with your PostgreSQL password

## Step 3: Run Migrations

```bash
# Run database migrations to create all tables
npm run db:migrate

# Seed initial data (Super Admin)
npm run db:seed
```

## Step 4: Verify Setup

```bash
# Open Prisma Studio to view your database
npm run db:studio
```

This will open Prisma Studio in your browser where you can see all tables and data.

## Default Super Admin Credentials

After seeding, you can login with:
- **Email**: admin@genfity.com
- **Password**: Admin@123456

⚠️ **IMPORTANT**: Change this password immediately in production!

## Database Tables Created

The migration will create the following tables:
1. `users` - All user accounts
2. `user_sessions` - JWT session tracking
3. `merchant_users` - User-merchant relationships
4. `merchants` - Merchant/restaurant profiles
5. `merchant_opening_hours` - Operating hours
6. `menu_categories` - Menu categories
7. `menus` - Menu items
8. `addon_categories` - Addon categories
9. `addon_items` - Addon items
10. `menu_addon_categories` - Menu-addon relationships
11. `orders` - Customer orders
12. `order_items` - Order line items
13. `order_item_addons` - Selected addons per order item
14. `order_status_history` - Order status audit trail

## Troubleshooting

### Error: Database does not exist
- Make sure you created the database in Step 1
- Verify the database name in your `DATABASE_URL`

### Error: Connection refused
- Check if PostgreSQL is running
- Verify the host and port in `DATABASE_URL`
- Check firewall settings

### Error: Authentication failed
- Verify username and password in `DATABASE_URL`
- Try connecting with `psql` to confirm credentials

### Reset Database (Development Only)
```bash
# WARNING: This will delete all data!
npm run db:reset
```

## Next Steps

After successful database setup:
1. Start the development server: `npm run dev`
2. Login at: http://localhost:3000/auth/signin
3. Use super admin credentials to create first merchant
