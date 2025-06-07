-- Add dose and frequency columns to druglist table
ALTER TABLE druglist ADD COLUMN dose TEXT;
ALTER TABLE druglist ADD COLUMN frequency TEXT;

-- Update existing records with default values if needed
-- This is optional and can be customized based on requirements
-- UPDATE druglist SET dose = 'Standard dose', frequency = 'As directed' WHERE dose IS NULL;

-- Add comment to explain the purpose of these fields
COMMENT ON COLUMN druglist.dose IS 'The recommended dosage of the drug';
COMMENT ON COLUMN druglist.frequency IS 'The recommended frequency of administration';