# Supabase Patient Database for Fast Profiles

This directory contains SQL scripts and documentation for setting up and populating the Supabase database for the Fast Profiles application.

## Files Overview

1. **`supabase_schema.sql`**: The main SQL script that creates all tables, indexes, constraints, and security policies for the database.

2. **`supabase_sample_data.sql`**: A script that inserts sample data into the database for testing purposes.

3. **`supabase_setup_instructions.md`**: Detailed instructions on how to set up the database in Supabase.

## Database Structure

The database is designed to support the Fast Profiles application, which allows healthcare professionals to create medication profiles for hospital patients. The main tables are:

- **`druglist`**: Master list of available drugs
- **`patients`**: Patient demographic information
- **`patient_profiles`**: Medication profiles for patients
- **`profile_access_links`**: Patient viewing links
- **`audit_log`**: Tracks changes and accesses
- **`app_settings`**: Application settings

## Setup Process

To set up the database:

1. Follow the instructions in `supabase_setup_instructions.md` to create the database schema.
2. Run the sample data script (`supabase_sample_data.sql`) to populate the database with test data.

## Security Features

The database includes several security features:

- Row Level Security (RLS) to control access to data
- Access policies that restrict data access to authenticated users
- Audit logging to track all changes to sensitive data
- Automatic timestamps to record when records are created and updated

## Data Model

### Patients

The `patients` table stores basic demographic information about patients, including:
- Medicare number
- Date of birth
- Contact information
- Name

### Medication Profiles

The `patient_profiles` table stores medication profiles for patients. Each profile:
- Links to a patient
- Contains medication data in a JSONB field
- Tracks status (Draft/Released)
- Records pharmacist authorization

### Profile Access

The `profile_access_links` table manages secure links for patients to view their profiles:
- Generates unique hashes for access
- Sets expiry times for links
- Tracks active status

## Development Notes

- The database is designed to work with the Supabase JavaScript client
- The schema includes indexes for optimizing common queries
- Triggers are used to automatically update timestamps and create audit logs

## Future Enhancements

Potential future enhancements to the database schema: // TODO

1. Add support for multiple healthcare facilities
2. Implement versioning for medication profiles
3. Add more detailed drug interaction data
4. Support for patient allergies and contraindications

## Troubleshooting

If you encounter issues with the database setup:

1. Check the Supabase SQL Editor for error messages
2. Verify that all required extensions are enabled
3. Ensure you have the correct permissions to execute SQL in your project

For more detailed troubleshooting, refer to the `supabase_setup_instructions.md` file.