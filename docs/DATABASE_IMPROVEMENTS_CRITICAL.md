# 🔴 CRITICAL: Database Schema Improvements for Menu Management

**Date:** November 16, 2025  
**Status:** REVIEW REQUIRED  
**Risk Level:** MEDIUM (Breaking Changes)

---

## ⚠️ IMPORTANT NOTICE

This document proposes **CRITICAL database changes** that will:
- Improve data integrity
- Enhance query performance
- Enable better UI/UX features
- Fix architectural issues

**BREAKING CHANGES:** Some migrations may require data transformation.

---

## Table of Contents

1. [Current Database Analysis](#current-database-analysis)
2. [Critical Issues Found](#critical-issues-found)
3. [Proposed Schema Changes](#proposed-schema-changes)
4. [Migration Strategy](#migration-strategy)
5. [Impact Assessment](#impact-assessment)

---

## Current Database Analysis

### Existing Schema (Menu Management)

```prisma
// Current structure from schema.prisma

model Menu {
  id                  BigInt
  merchantId          BigInt
  categoryId          BigInt?              // ⚠️ ISSUE 1: Backward compat
  name                String
  price               Decimal
  trackStock          Boolean
  stockQty            Int?
  dailyStockTemplate  Int?
  autoResetStock      Boolean
  
  // Relations
  category            MenuCategory?        // ⚠️ ISSUE 1
  categories          MenuCategoryItem[]   // Many-to-many
  addonCategories     MenuAddonCategory[]
}

model MenuCategory {
  id          BigInt
  merchantId  BigInt
  name        String
  sortOrder   Int                          // ⚠️ ISSUE 2: Confusing name
  
  menus       Menu[]                       // ⚠️ ISSUE 1: Backward compat
  menuItems   MenuCategoryItem[]
}

model AddonItem {
  id              BigInt
  addonCategoryId BigInt
  name            String
  price           Decimal
  inputType       AddonInputType
  displayOrder    Int                      // ⚠️ ISSUE 3: Not used in UI
  trackStock      Boolean
  stockQty        Int?
  
  // ⚠️ ISSUE 4: No dailyStockTemplate like Menu
}

model MenuAddonCategory {
  menuId          BigInt
  addonCategoryId BigInt
  isRequired      Boolean
  displayOrder    Int                      // ✅ Good
}
```

---

## Critical Issues Found

### 🔴 ISSUE 1: Backward Compatibility Clutter

**Problem:**
```prisma
model Menu {
  categoryId  BigInt?        // Old single category
  category    MenuCategory?  // Old relation
  categories  MenuCategoryItem[]  // New many-to-many
}
```

**Impact:**
- Confusing for developers
- API returns both `category` and `categories`
- Database bloat (unused columns)
- Query inefficiency

**Evidence from Code:**
```tsx
// From menu/page.tsx line 243
const getCategoryNames = (item: MenuItem): string => {
  // First check many-to-many categories
  if (item.categories && item.categories.length > 0) {
    return item.categories.map(c => c.category.name).join(', ');
  }
  // Fallback to single category for backward compatibility
  if (item.category?.name) return item.category.name;
  // ...
};
```

**Recommendation:** ✅ SAFE TO REMOVE (if migration complete)

---

### 🟡 ISSUE 2: Ambiguous Column Naming

**Problem:**
```prisma
model MenuCategory {
  sortOrder   Int  // What does this sort?
  displayOrder Int? // Missing but needed
}
```

**Confusion:**
- `sortOrder` sounds like internal sorting
- Actual purpose: Customer-facing display order
- No field for admin panel sorting

**Recommendation:** RENAME for clarity

---

### 🟡 ISSUE 3: Inconsistent Stock Management

**Problem:**

Menu has:
```prisma
trackStock          Boolean
stockQty            Int?
dailyStockTemplate  Int?      // ✅ Has template
autoResetStock      Boolean   // ✅ Has auto-reset
```

AddonItem has:
```prisma
trackStock          Boolean
stockQty            Int?
// ❌ Missing dailyStockTemplate
// ❌ Missing autoResetStock
```

**Impact:**
- Addon items can't use auto-reset feature
- Inconsistent UX (users expect same features)
- Duplicate stock management code

**Recommendation:** ADD missing fields to AddonItem

---

### 🟢 ISSUE 4: Missing Audit Trail

**Problem:**
- No `updatedBy` field in Menu, AddonItem
- Can't track who made changes
- Business requirement for multi-user teams

**Recommendation:** ADD audit fields

---

### 🟢 ISSUE 5: Missing Soft Delete Timestamp

**Problem:**
```prisma
model Menu {
  isActive  Boolean  // Soft delete flag
  // ❌ Missing deletedAt timestamp
}
```

**Impact:**
- Can't see when item was deactivated
- Can't restore recently deleted items
- No deletion audit

**Recommendation:** ADD `deletedAt` field

---

## Proposed Schema Changes

### Change 1: Remove Backward Compatibility (CRITICAL)

**Migration:** `20251117_remove_menu_category_backward_compat`

```sql
-- Step 1: Verify all menus have many-to-many categories
SELECT m.id, m.name, m.categoryId, 
       COUNT(mci.categoryId) as many_to_many_count
FROM menus m
LEFT JOIN menu_category_items mci ON m.id = mci.menuId
WHERE m.categoryId IS NOT NULL
GROUP BY m.id
HAVING COUNT(mci.categoryId) = 0;
-- Expected: 0 rows (all migrated)

-- Step 2: If any found, migrate them
INSERT INTO menu_category_items (menuId, categoryId, createdAt)
SELECT id, categoryId, NOW()
FROM menus
WHERE categoryId IS NOT NULL
  AND id NOT IN (SELECT menuId FROM menu_category_items);

-- Step 3: Drop old columns (BREAKING)
ALTER TABLE menus DROP COLUMN categoryId;

-- Step 4: Update Prisma schema
```

**Updated Prisma Schema:**
```prisma
model Menu {
  id                  BigInt              @id @default(autoincrement())
  merchantId          BigInt              @map("merchant_id")
  // ❌ REMOVED: categoryId
  // ❌ REMOVED: category relation
  
  name                String
  price               Decimal             @db.Decimal(10, 2)
  trackStock          Boolean             @default(false)
  
  categories          MenuCategoryItem[]  // ✅ Only this remains
  addonCategories     MenuAddonCategory[]
  
  @@index([merchantId])
  @@map("menus")
}

model MenuCategory {
  id          BigInt             @id @default(autoincrement())
  merchantId  BigInt             @map("merchant_id")
  name        String
  sortOrder   Int                @default(0) @map("sort_order")
  
  // ❌ REMOVED: menus relation
  menuItems   MenuCategoryItem[] // ✅ Only this remains
  
  @@index([merchantId])
  @@index([sortOrder])
  @@map("menu_categories")
}
```

**Risk:** 🟡 MEDIUM
- Requires data verification
- Breaking change for API consumers
- Rollback possible if caught early

---

### Change 2: Rename sortOrder → customerDisplayOrder (HIGH)

**Migration:** `20251117_rename_sort_order_fields`

```sql
-- Rename column for clarity
ALTER TABLE menu_categories 
  RENAME COLUMN sort_order TO customer_display_order;

-- Optional: Add admin_sort_order for future use
ALTER TABLE menu_categories 
  ADD COLUMN admin_sort_order INTEGER DEFAULT 0;

-- Copy existing values
UPDATE menu_categories 
  SET admin_sort_order = customer_display_order;
```

**Updated Prisma Schema:**
```prisma
model MenuCategory {
  id                    BigInt   @id @default(autoincrement())
  merchantId            BigInt   @map("merchant_id")
  name                  String
  customerDisplayOrder  Int      @default(0) @map("customer_display_order") // ✅ Renamed
  adminSortOrder        Int      @default(0) @map("admin_sort_order")      // ✅ New
  
  @@index([customerDisplayOrder])
  @@map("menu_categories")
}
```

**Benefits:**
- ✅ Clear purpose (customer vs admin)
- ✅ Enables different orderings
- ✅ Better documentation

**Risk:** 🟢 LOW
- Non-breaking (just rename)
- Easy rollback

---

### Change 3: Add Stock Template to AddonItem (HIGH)

**Migration:** `20251117_addon_item_stock_template`

```sql
-- Add missing stock management fields
ALTER TABLE addon_items 
  ADD COLUMN daily_stock_template INTEGER,
  ADD COLUMN auto_reset_stock BOOLEAN DEFAULT FALSE,
  ADD COLUMN last_stock_reset_at TIMESTAMPTZ;

-- Create index for auto-reset query
CREATE INDEX idx_addon_items_auto_reset 
  ON addon_items(auto_reset_stock, last_stock_reset_at)
  WHERE auto_reset_stock = TRUE;
```

**Updated Prisma Schema:**
```prisma
model AddonItem {
  id                  BigInt    @id @default(autoincrement())
  addonCategoryId     BigInt    @map("addon_category_id")
  name                String
  price               Decimal   @default(0) @db.Decimal(10, 2)
  inputType           AddonInputType @default(SELECT)
  displayOrder        Int       @default(0)
  isActive            Boolean   @default(true)
  trackStock          Boolean   @default(false)
  stockQty            Int?      @map("stock_qty")
  
  // ✅ NEW: Stock template fields (matching Menu)
  dailyStockTemplate  Int?      @map("daily_stock_template")
  autoResetStock      Boolean   @default(false) @map("auto_reset_stock")
  lastStockResetAt    DateTime? @map("last_stock_reset_at") @db.Timestamptz(6)
  
  createdAt           DateTime  @default(now()) @map("created_at")
  updatedAt           DateTime  @updatedAt @map("updated_at")
  
  @@index([autoResetStock, lastStockResetAt])
  @@map("addon_items")
}
```

**Benefits:**
- ✅ Consistent stock management across all items
- ✅ Auto-reset works for addon items
- ✅ Unified stock dashboard possible

**Risk:** 🟢 LOW
- Purely additive (no breaking changes)
- Nullable fields (backward compatible)

---

### Change 4: Add Audit Trail Fields (MEDIUM)

**Migration:** `20251117_add_audit_trail`

```sql
-- Add audit fields to menus
ALTER TABLE menus 
  ADD COLUMN created_by_user_id BIGINT REFERENCES users(id),
  ADD COLUMN updated_by_user_id BIGINT REFERENCES users(id),
  ADD COLUMN deleted_at TIMESTAMPTZ,
  ADD COLUMN deleted_by_user_id BIGINT REFERENCES users(id);

-- Add audit fields to addon_items
ALTER TABLE addon_items 
  ADD COLUMN created_by_user_id BIGINT REFERENCES users(id),
  ADD COLUMN updated_by_user_id BIGINT REFERENCES users(id),
  ADD COLUMN deleted_at TIMESTAMPTZ,
  ADD COLUMN deleted_by_user_id BIGINT REFERENCES users(id);

-- Add audit fields to menu_categories
ALTER TABLE menu_categories 
  ADD COLUMN created_by_user_id BIGINT REFERENCES users(id),
  ADD COLUMN updated_by_user_id BIGINT REFERENCES users(id),
  ADD COLUMN deleted_at TIMESTAMPTZ,
  ADD COLUMN deleted_by_user_id BIGINT REFERENCES users(id);

-- Add audit fields to addon_categories
ALTER TABLE addon_categories 
  ADD COLUMN created_by_user_id BIGINT REFERENCES users(id),
  ADD COLUMN updated_by_user_id BIGINT REFERENCES users(id),
  ADD COLUMN deleted_at TIMESTAMPTZ,
  ADD COLUMN deleted_by_user_id BIGINT REFERENCES users(id);

-- Create indexes for soft delete queries
CREATE INDEX idx_menus_deleted_at ON menus(deleted_at) WHERE deleted_at IS NOT NULL;
CREATE INDEX idx_addon_items_deleted_at ON addon_items(deleted_at) WHERE deleted_at IS NOT NULL;
```

**Updated Prisma Schema:**
```prisma
model Menu {
  id                  BigInt    @id @default(autoincrement())
  // ... existing fields ...
  
  // ✅ NEW: Audit trail
  createdByUserId     BigInt?   @map("created_by_user_id")
  updatedByUserId     BigInt?   @map("updated_by_user_id")
  deletedAt           DateTime? @map("deleted_at") @db.Timestamptz(6)
  deletedByUserId     BigInt?   @map("deleted_by_user_id")
  
  createdBy           User?     @relation("MenuCreatedBy", fields: [createdByUserId], references: [id])
  updatedBy           User?     @relation("MenuUpdatedBy", fields: [updatedByUserId], references: [id])
  deletedBy           User?     @relation("MenuDeletedBy", fields: [deletedByUserId], references: [id])
  
  @@index([deletedAt])
  @@map("menus")
}

// Similar for AddonItem, MenuCategory, AddonCategory
```

**Benefits:**
- ✅ Full audit trail (who, when)
- ✅ Soft delete with timestamp
- ✅ Compliance-ready
- ✅ Enables "Recently Deleted" feature

**Risk:** 🟡 MEDIUM
- Requires code changes (pass userId in all mutations)
- Larger database size (~20% increase)
- Migration time proportional to table size

---

### Change 5: Add Menu Item Templates (OPTIONAL)

**Migration:** `20251117_add_menu_templates`

```sql
-- New table for menu templates
CREATE TABLE menu_templates (
  id BIGSERIAL PRIMARY KEY,
  merchant_id BIGINT NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  base_price DECIMAL(10, 2),
  default_addon_categories JSONB, -- Store addon category IDs
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_menu_templates_merchant ON menu_templates(merchant_id);

-- Link menus to templates
ALTER TABLE menus 
  ADD COLUMN template_id BIGINT REFERENCES menu_templates(id);
```

**Use Case:**
```
Template: "Coffee"
├─ Base Price: $4.00
├─ Default Addons: Size, Extras, Milk Type
└─ Used by: Espresso, Latte, Cappuccino, Mocha
```

**Benefits:**
- ✅ Faster menu creation
- ✅ Consistency across similar items
- ✅ Bulk updates (change template = update all)

**Risk:** 🟢 LOW
- Purely additive
- Optional feature
- Can skip if time-constrained

---

## Migration Strategy

### Pre-Migration Checklist

```bash
# 1. Backup database
pg_dump genfity_db > backup_$(date +%Y%m%d).sql

# 2. Run verification queries
psql genfity_db << EOF
-- Check backward compat migration status
SELECT COUNT(*) as menus_with_old_category
FROM menus 
WHERE categoryId IS NOT NULL
  AND id NOT IN (SELECT menuId FROM menu_category_items);
-- Expected: 0

-- Check data integrity
SELECT COUNT(*) as menus_without_categories
FROM menus m
LEFT JOIN menu_category_items mci ON m.id = mci.menuId
WHERE mci.menuId IS NULL;
-- Expected: Low number (intentional uncategorized items)
EOF

# 3. Test on staging environment
npm run prisma:migrate:deploy -- --environment=staging
```

### Migration Order

**Phase 1: Additive Changes (Low Risk)**
1. ✅ Add stock template fields to AddonItem
2. ✅ Add audit trail fields
3. ✅ Add menu templates (optional)

**Phase 2: Rename Changes (Medium Risk)**
1. ✅ Rename sortOrder → customerDisplayOrder
2. ✅ Add adminSortOrder

**Phase 3: Removal Changes (High Risk)**
1. ⚠️ Verify backward compat migration
2. ⚠️ Remove categoryId from Menu
3. ⚠️ Remove old relations from Prisma

### Rollback Plan

```sql
-- Rollback Change 1 (Remove backward compat)
ALTER TABLE menus ADD COLUMN categoryId BIGINT;
UPDATE menus m
SET categoryId = (
  SELECT mci.categoryId 
  FROM menu_category_items mci 
  WHERE mci.menuId = m.id 
  LIMIT 1
);

-- Rollback Change 2 (Rename)
ALTER TABLE menu_categories 
  RENAME COLUMN customer_display_order TO sort_order;
ALTER TABLE menu_categories 
  DROP COLUMN admin_sort_order;

-- Rollback Change 3-5 (Additive changes)
ALTER TABLE addon_items 
  DROP COLUMN daily_stock_template,
  DROP COLUMN auto_reset_stock,
  DROP COLUMN last_stock_reset_at;
-- ... repeat for other additive changes
```

---

## Impact Assessment

### Code Changes Required

**Files to Update:**

1. **API Endpoints (6 files)**
   ```
   src/app/api/merchant/menu/route.ts
   src/app/api/merchant/menu/[id]/route.ts
   src/app/api/merchant/addon-items/route.ts
   src/app/api/merchant/addon-items/[id]/route.ts
   src/app/api/merchant/categories/route.ts
   src/app/api/merchant/addon-categories/route.ts
   ```
   - Remove `categoryId` from menu queries
   - Add audit fields to create/update mutations
   - Add stock template fields to addon items

2. **Frontend Pages (4 files)**
   ```
   src/app/(admin)/admin/dashboard/(merchant)/menu/page.tsx
   src/app/(admin)/admin/dashboard/(merchant)/categories/page.tsx
   src/app/(admin)/admin/dashboard/(merchant)/addon-items/page.tsx
   src/app/(admin)/admin/dashboard/(merchant)/addon-categories/page.tsx
   ```
   - Update TypeScript interfaces
   - Remove backward compat code
   - Add stock template UI for addon items

3. **Prisma Schema (1 file)**
   ```
   prisma/schema.prisma
   ```
   - Apply all schema changes above

4. **Services/Repositories (4 files)**
   ```
   src/lib/repositories/MenuRepository.ts
   src/lib/repositories/AddonItemRepository.ts
   src/lib/services/MenuService.ts
   src/lib/services/AddonService.ts
   ```
   - Update query methods
   - Add audit trail logic
   - Remove deprecated fields

### Database Size Impact

**Before:**
- menus: ~500 rows × 15 columns = 7,500 cells
- addon_items: ~200 rows × 10 columns = 2,000 cells
- Total: ~9,500 cells

**After:**
- menus: ~500 rows × 18 columns = 9,000 cells (+20%)
- addon_items: ~200 rows × 16 columns = 3,200 cells (+60%)
- Total: ~12,200 cells (+28%)

**Storage:** +5-10 MB per 10,000 rows (negligible)

### Performance Impact

**Query Performance:**
- ✅ **IMPROVED**: Removal of `categoryId` simplifies queries
- ✅ **IMPROVED**: Indexes on audit fields help soft delete queries
- ⚠️ **NEUTRAL**: Additional columns add minimal overhead
- ⚠️ **SLIGHT DECREASE**: Audit trail foreign keys add join cost

**Estimated Impact:** <2% query time increase (acceptable)

---

## Testing Plan

### Unit Tests

```typescript
// tests/repositories/MenuRepository.test.ts
describe('MenuRepository after schema changes', () => {
  it('should not return menus with deletedAt set', async () => {
    const menus = await menuRepo.findAll();
    expect(menus.every(m => !m.deletedAt)).toBe(true);
  });

  it('should populate audit fields on create', async () => {
    const menu = await menuRepo.create({
      name: 'Test',
      price: 10,
      merchantId: '1',
      createdByUserId: '123'
    });
    expect(menu.createdByUserId).toBe('123');
  });
});

// tests/repositories/AddonItemRepository.test.ts
describe('AddonItem stock template', () => {
  it('should support auto-reset stock', async () => {
    const item = await addonRepo.create({
      name: 'Extra Shot',
      price: 0.5,
      trackStock: true,
      stockQty: 100,
      dailyStockTemplate: 100,
      autoResetStock: true
    });
    expect(item.autoResetStock).toBe(true);
  });
});
```

### Integration Tests

```bash
# Test migration on fresh database
docker-compose up -d postgres-test
npm run prisma:migrate:reset -- --force
npm run test:integration

# Test on production snapshot
pg_dump production_db > test_snapshot.sql
createdb test_db
psql test_db < test_snapshot.sql
npm run prisma:migrate:deploy
# Verify data integrity
```

### Manual QA Checklist

- [ ] Create menu without category (should work)
- [ ] Assign multiple categories to menu
- [ ] Remove backward compat code doesn't break UI
- [ ] Addon item stock auto-reset works
- [ ] Audit trail populates correctly
- [ ] Soft delete shows in "Recently Deleted"
- [ ] Performance: Menu list loads <500ms
- [ ] Performance: Stock dashboard loads <1s

---

## Recommendation

### Must Implement (Phase 1)

✅ **Change 3: Add Stock Template to AddonItem**
- **Why:** Enables unified stock management UI
- **Risk:** LOW (purely additive)
- **Value:** HIGH (user-requested feature)

✅ **Change 4: Add Audit Trail Fields**
- **Why:** Business requirement for compliance
- **Risk:** MEDIUM (requires code changes)
- **Value:** HIGH (security, accountability)

### Should Implement (Phase 2)

✅ **Change 2: Rename sortOrder**
- **Why:** Reduces developer confusion
- **Risk:** LOW (just rename)
- **Value:** MEDIUM (code clarity)

### Can Skip (Phase 3)

❌ **Change 1: Remove Backward Compat**
- **Why:** Not urgent if migration complete
- **Risk:** MEDIUM (breaking change)
- **Value:** LOW (just code cleanup)
- **Defer:** Until next major version

⚠️ **Change 5: Add Menu Templates**
- **Why:** Nice-to-have, not critical
- **Risk:** LOW (optional feature)
- **Value:** MEDIUM (power user feature)
- **Defer:** Post-MVP

---

## Implementation Timeline

### Week 1: Preparation
- [ ] Review this document with team
- [ ] Backup production database
- [ ] Create staging environment snapshot
- [ ] Write migration scripts

### Week 2: Phase 1 (Low Risk)
- [ ] Implement Change 3 (AddonItem stock template)
- [ ] Implement Change 4 (Audit trail)
- [ ] Deploy to staging
- [ ] QA testing

### Week 3: Phase 2 (Medium Risk)
- [ ] Implement Change 2 (Rename sortOrder)
- [ ] Update all API endpoints
- [ ] Update frontend components
- [ ] Deploy to staging
- [ ] Performance testing

### Week 4: Production Rollout
- [ ] Deploy Phase 1 to production
- [ ] Monitor for 48 hours
- [ ] Deploy Phase 2 to production
- [ ] Post-deployment verification

---

## Conclusion

These database improvements will:
- ✅ **Enable** new UI/UX features (unified stock dashboard)
- ✅ **Fix** architectural issues (backward compat cleanup)
- ✅ **Improve** code maintainability (clear naming)
- ✅ **Add** compliance features (audit trail)

**Total Risk:** 🟡 MEDIUM (manageable with proper testing)  
**Total Value:** 🟢 HIGH (unlocks future features)  
**Recommendation:** **APPROVE** Phase 1 & 2, defer Phase 3

---

**Prepared by:** AI Coding Agent  
**Review Required:** Technical Lead, Database Admin  
**Approval Required:** CTO, Product Manager  
**Document Version:** 1.0  
**Last Updated:** November 16, 2025
