-- AlterTable
ALTER TABLE "genfity"."addon_items" ADD COLUMN IF NOT EXISTS "display_order" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "addon_items_display_order_idx" ON "genfity"."addon_items"("display_order");
