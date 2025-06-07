# Fast Profiles - Project Guidelines

**Version:** 0.0.1
**Last Updated:** 2025-06-07

## Overview

Fast Profiles is a mobile-friendly application designed to quickly generate medication profiles for hospital patient discharge. This document provides comprehensive guidelines for developing and maintaining this application.

## Purpose and Scope

### Primary Purpose
To streamline the creation of medication profiles for hospital patients upon discharge, ensuring accuracy and efficiency.

### Target Audience
Healthcare professionals (e.g., doctors, nurses, pharmacists) involved in patient discharge processes within a hospital setting.

### Problems Solved
- Reduces the time and effort required to compile medication lists
- Minimizes errors in medication information provided to patients
- Provides a standardized and easily accessible format for medication profiles
- Facilitates communication of medication plans to patients

### Core Functionalities
- User authentication for healthcare professionals
- Creation and management of patient medication profiles
- Quick addition of common drugs to profiles
- Detailed drug entry (generic name, dose, frequency, status: new/updated/ceased)
- Exporting medication profiles to PDF
- Sharing viewable medication profiles with patients via text or email
- Adding new drugs to the application's database

### Out of Scope (for initial version)
- Integration with Electronic Health Record (EHR) systems
- Complex drug interaction checking (basic information only)
- Prescription ordering directly through the app

## Technology Stack

- **Framework:** Quasar Framework (Vue.js 3.4.18)
- **Database:** Supabase
- **Package Manager:** Yarn
- **Authentication:** Supabase Authentication
- **Hosting:** Vercel

## Key Features and Workflow

### User Interface and Experience

- **Mobile Responsiveness:** The application must be fully responsive and optimized for mobile devices
- **Top Toolbar:** Will display the application name "Fast Profiles" and version number
- **Colour Scheme:** Primary colors will be blue, grey, and orange

### Authentication

- Healthcare professionals will be required to log in to access the application
- Supabase Authentication will be used for secure user management

### Medication Profile Creation Workflow

1. **Patient Selection:**
   - Select a patient via search/lookup mechanism
   - Option to add a new patient if record doesn't exist

2. **Drug Selection - "Favourites" (Common Drugs):**
   - Display section for "Favourites" (commonly used drugs)
   - Present as buttons for quick selection or table with checkboxes for multiple selection
   - Selected drugs added to patient's profile table

3. **Profile Table Management:**
   - Dynamic table where each row represents a medication
   - Editable fields for each drug (generic name, dose, frequency, etc.)
   - Quick access controls to set drug status (New, Updated, Ceased)
   - Sorting logic: "New" and "Updated" drugs at top, "Ceased" drugs at bottom
   - Field for pharmacist authorization
   - Draft mode until explicitly "Signed Off for Release"

### Data Management & Release

- **Release Process:**
  - Mark profile as final
  - Enable PDF generation and printing
  - Create access codes for online patient access

- **Patient Sharing:**
  - Send patients a link to view their profile
  - Share via text message or email

- **"Favourites" Management:**
  - Manage list of common drugs in settings
  - Search main drug list and toggle "favourites" flag

## Database Structure

### Tables in Supabase

- **`users`**: Authentication details for healthcare professionals

- **`druglist`**: Master list of available drugs
  - `id` (Primary Key)
  - `generic_name`
  - `common_drug` (Boolean, for "Favourites")
  - Other relevant drug details

- **`patients`**: Patient demographic information
  - `id` (Primary Key)
  - `medicare_number` (Optional)
  - `date_of_birth`
  - `mobile_phone_number`
  - `first_name`
  - `last_name`
  - Other relevant identifiers

- **`patient_profiles`**: Medication profiles
  - `id` (Primary Key)
  - `patient_id` (Foreign Key)
  - `created_at`
  - `created_by` (Foreign Key)
  - `pharmacist_authorizing`
  - `status` (Draft/Released)
  - `profile_data` (JSONB field with medication data)
  - `viewable_link_id` (Foreign Key)

- **`profile_access_links`**: Patient viewing links
  - `id` (Primary Key)
  - `profile_id` (Foreign Key)
  - `unique_hash`
  - `expiry_time`
  - `is_active`

- **`audit_log`**: Track changes and accesses
  - `id` (Primary Key)
  - `timestamp`
  - `user_id` (Foreign Key)
  - `patient_id` (Foreign Key)
  - `profile_id` (Foreign Key)
  - `action_type`
  - `details` (JSONB field)
  - `ip_address`

- **`app_settings`**: Application settings

## Secure Patient Access

1. **Unique, Time-Limited Viewing Link:** Generate secure URL when sharing profile

2. **Patient Identification Challenge:** Require at least two verification points:
   - Medicare Number
   - Date of Birth
   - Mobile Phone Number
   - Patient Access Code

3. **Backend Verification:** Verify entered information against patient record

4. **Display Profile:** Show clear, easy-to-understand view of medication regime

5. **Access Limitations:** Links become inactive after view or expire after set time

## Error Handling

- Implement robust error handling across all functionalities
- Use toaster messages for user-facing errors
- Include client-side validation for immediate feedback

## Data Security & Privacy

- **Encryption in Transit:** TLS/SSL for all communication
- **Encryption at Rest:** Supabase default encryption
- **Audit Trail:** Track all significant interactions with sensitive data
- **Compliance:** Ensure adherence to relevant healthcare data regulations

## Testing Strategy

- **Unit Tests:** Individual functions and components
- **Component Tests:** Vue components rendering and interaction
- **Integration Tests:** Component interactions
- **End-to-End Tests:** Full user flows
- **API/Backend Tests:** Supabase functionality
- **Usability Testing:** Healthcare professional feedback
- **Security Testing:** Vulnerability assessment

## Development Guidelines

- Follow Vue.js and Quasar best practices
- Maintain consistent code style with ESLint and Prettier
- Document code thoroughly
- Create reusable components where possible
- Use Git for version control with descriptive commit messages
- Follow semantic versioning for releases

---

This document serves as a blueprint for the Fast Profiles application. It should be reviewed and updated as the project evolves.
