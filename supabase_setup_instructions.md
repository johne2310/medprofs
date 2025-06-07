# Supabase Database Setup Instructions

This document provides instructions for setting up the Supabase database for the Fast Profiles application.

## Prerequisites

- A Supabase account and project
- Access to the Supabase SQL Editor

## Setup Steps

1. **Log in to your Supabase account** and navigate to your project.

2. **Open the SQL Editor** from the left sidebar.

3. **Copy the contents of the `supabase_schema.sql` file** and paste it into the SQL Editor.

4. **Before executing the script**, update the JWT secret in line 5:
   ```sql
   ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';
   ```
   Replace `'your-jwt-secret'` with your actual JWT secret from your Supabase project settings.

5. **Execute the script** by clicking the "Run" button.

6. **Verify the setup** by checking that all tables have been created:
   - druglist
   - patients
   - patient_profiles
   - profile_access_links
   - audit_log
   - app_settings

## Database Structure Overview

The database consists of the following tables:

1. **druglist**: Master list of available drugs
   - Contains drug information including generic name, brand name, form, and strength
   - Tracks which drugs are marked as "common" (favorites)

2. **patients**: Patient demographic information
   - Stores patient details like name, date of birth, medicare number, and contact information

3. **patient_profiles**: Medication profiles for patients
   - Links to a patient
   - Contains medication data in a JSONB field
   - Tracks status (Draft/Released) and pharmacist authorization

4. **profile_access_links**: Patient viewing links
   - Generates secure, time-limited links for patients to view their profiles
   - Includes expiry time and active status

5. **audit_log**: Tracks changes and accesses
   - Automatically logs all significant database operations
   - Records user, patient, profile, action type, and details

6. **app_settings**: Application settings
   - Stores application-wide configuration

## Security Features

The script implements several security features:

1. **Row Level Security (RLS)** is enabled on all tables
2. **Access policies** restrict data access to authenticated users
3. **Audit logging** tracks all changes to sensitive data
4. **Automatic timestamps** record when records are created and updated

## Extending the Schema

If you need to extend the schema:

1. Create a new SQL script with your changes
2. Test the changes in a development environment first
3. Apply the changes to production using the SQL Editor

## Troubleshooting

If you encounter errors during execution:

1. Check for any syntax errors in the SQL
2. Ensure your Supabase project has the necessary extensions enabled
3. Verify that you have the correct permissions to execute SQL in your project