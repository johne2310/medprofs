# Adding Dose and Frequency to Common Drugs

This update adds dose and frequency information to the common drugs buttons in the medication profile page.

## Changes Made

1. **UI Changes**:
   - Updated the common drug buttons in `ProfilesPage.vue` to display dose and frequency information
   - Added conditional rendering to handle cases where dose or frequency might be missing

2. **Database Changes**:
   - Created a migration script (`add_dose_frequency_to_druglist.sql`) to add dose and frequency columns to the druglist table

## Implementation Instructions

### 1. Run the Database Migration

Execute the SQL script to add the new columns to the druglist table:

```bash
# Connect to your Supabase database and run the script
psql -h your-supabase-host -d postgres -U postgres -f scripts/add_dose_frequency_to_druglist.sql
```

Alternatively, you can run the SQL commands directly in the Supabase SQL editor.

### 2. Update Drug Data

After adding the columns, you'll need to update the existing drug records with appropriate dose and frequency values. This can be done through:

- The Supabase dashboard (Table Editor)
- A SQL UPDATE statement
- A data import script

Example SQL to update a specific drug:

```sql
UPDATE druglist 
SET dose = '500mg', frequency = 'Twice daily' 
WHERE generic_name = 'Paracetamol';
```

### 3. Verify the Changes

After updating the database:

1. Open the application and navigate to the Medication Profile page
2. Check that the common drug buttons now display dose and frequency information
3. Verify that adding a drug to a profile correctly includes the dose and frequency

## Notes

- The UI changes are designed to handle cases where dose or frequency might be missing
- If both dose and frequency are missing, the button will display only the drug name
- The database migration script includes commented-out code for setting default values if needed