# Adding Strength and Form to Common Drugs

This update adds strength and form information to the common drugs buttons in the medication profile page, building on the previous update that added dose and frequency.

## Changes Made

1. **UI Changes**:
   - Updated the common drug buttons in `ProfilesPage.vue` to display strength and form information
   - Added conditional rendering to handle cases where strength or form might be missing
   - Maintained the existing dose and frequency display

2. **Data Handling**:
   - Updated the `addDrugToProfile` function to include strength and form when adding a drug to a profile
   - No database schema changes were needed as the strength and form fields already exist in the druglist table

## Implementation Instructions

### 1. Verify Database Fields

The strength and form fields should already exist in your druglist table. You can verify this with:

```sql
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'druglist' 
AND column_name IN ('strength', 'form');
```

### 2. Update Drug Data

Ensure your drug records have appropriate strength and form values. This can be done through:

- The Supabase dashboard (Table Editor)
- A SQL UPDATE statement
- A data import script

Example SQL to update a specific drug:

```sql
UPDATE druglist 
SET strength = '500mg', form = 'Tablet' 
WHERE generic_name = 'Paracetamol';
```

### 3. Verify the Changes

After updating the drug data:

1. Open the application and navigate to the Medication Profile page
2. Check that the common drug buttons now display strength and form information
3. Verify that adding a drug to a profile correctly includes the strength and form

## Notes

- The UI changes are designed to handle cases where strength or form might be missing
- The strength and form fields are displayed on separate lines for better readability
- When a drug is added to a profile, all fields (generic name, brand name, strength, form, dose, and frequency) are now included