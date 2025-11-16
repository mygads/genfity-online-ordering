-- Add location fields to merchants table
-- Migration: add_merchant_location_fields

ALTER TABLE merchants
ADD COLUMN IF NOT EXISTS timezone VARCHAR(100) DEFAULT 'Australia/Sydney' NOT NULL,
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);

-- Add index for location-based queries
CREATE INDEX IF NOT EXISTS idx_merchants_location ON merchants(latitude, longitude) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- Update existing records with default timezone based on country
UPDATE merchants
SET timezone = CASE
  WHEN country = 'Australia' THEN 'Australia/Sydney'
  WHEN country = 'United States' THEN 'America/New_York'
  WHEN country = 'United Kingdom' THEN 'Europe/London'
  WHEN country = 'Singapore' THEN 'Asia/Singapore'
  WHEN country = 'Malaysia' THEN 'Asia/Kuala_Lumpur'
  WHEN country = 'Indonesia' THEN 'Asia/Jakarta'
  ELSE 'Australia/Sydney'
END
WHERE timezone IS NULL OR timezone = 'Australia/Sydney';
