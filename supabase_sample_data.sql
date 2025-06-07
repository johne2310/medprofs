-- Sample data insertion script for Fast Profiles Supabase database
-- This script provides example data for testing purposes

-- Sample drugs for the druglist table
INSERT INTO druglist (generic_name, common_drug, brand_name, form, strength) VALUES
('Atorvastatin', TRUE, 'Lipitor', 'Tablet', '10mg'),
('Atorvastatin', TRUE, 'Lipitor', 'Tablet', '20mg'),
('Atorvastatin', TRUE, 'Lipitor', 'Tablet', '40mg'),
('Atorvastatin', TRUE, 'Lipitor', 'Tablet', '80mg'),
('Metformin', TRUE, 'Glucophage', 'Tablet', '500mg'),
('Metformin', TRUE, 'Glucophage', 'Tablet', '850mg'),
('Metformin', TRUE, 'Glucophage', 'Tablet', '1000mg'),
('Amlodipine', TRUE, 'Norvasc', 'Tablet', '5mg'),
('Amlodipine', TRUE, 'Norvasc', 'Tablet', '10mg'),
('Lisinopril', TRUE, 'Prinivil', 'Tablet', '5mg'),
('Lisinopril', TRUE, 'Prinivil', 'Tablet', '10mg'),
('Lisinopril', TRUE, 'Prinivil', 'Tablet', '20mg'),
('Levothyroxine', TRUE, 'Synthroid', 'Tablet', '25mcg'),
('Levothyroxine', TRUE, 'Synthroid', 'Tablet', '50mcg'),
('Levothyroxine', TRUE, 'Synthroid', 'Tablet', '100mcg'),
('Omeprazole', TRUE, 'Prilosec', 'Capsule', '20mg'),
('Omeprazole', TRUE, 'Prilosec', 'Capsule', '40mg'),
('Simvastatin', FALSE, 'Zocor', 'Tablet', '10mg'),
('Simvastatin', FALSE, 'Zocor', 'Tablet', '20mg'),
('Simvastatin', FALSE, 'Zocor', 'Tablet', '40mg'),
('Aspirin', TRUE, 'Bayer', 'Tablet', '81mg'),
('Aspirin', TRUE, 'Bayer', 'Tablet', '325mg'),
('Ibuprofen', TRUE, 'Advil', 'Tablet', '200mg'),
('Ibuprofen', TRUE, 'Advil', 'Tablet', '400mg'),
('Ibuprofen', TRUE, 'Advil', 'Tablet', '600mg'),
('Acetaminophen', TRUE, 'Tylenol', 'Tablet', '325mg'),
('Acetaminophen', TRUE, 'Tylenol', 'Tablet', '500mg'),
('Acetaminophen', TRUE, 'Tylenol', 'Tablet', '650mg'),
('Warfarin', FALSE, 'Coumadin', 'Tablet', '1mg'),
('Warfarin', FALSE, 'Coumadin', 'Tablet', '2mg'),
('Warfarin', FALSE, 'Coumadin', 'Tablet', '5mg');

-- Sample patients
INSERT INTO patients (medicare_number, date_of_birth, mobile_phone_number, first_name, last_name, email, address) VALUES
('1234567890', '1965-05-15', '555-123-4567', 'John', 'Smith', 'john.smith@example.com', '123 Main St, Anytown, USA'),
('2345678901', '1972-08-22', '555-234-5678', 'Jane', 'Doe', 'jane.doe@example.com', '456 Oak Ave, Somewhere, USA'),
('3456789012', '1980-03-10', '555-345-6789', 'Robert', 'Johnson', 'robert.johnson@example.com', '789 Pine Rd, Nowhere, USA'),
('4567890123', '1955-11-30', '555-456-7890', 'Mary', 'Williams', 'mary.williams@example.com', '101 Elm St, Anywhere, USA'),
('5678901234', '1990-01-25', '555-567-8901', 'Michael', 'Brown', 'michael.brown@example.com', '202 Maple Dr, Everywhere, USA');

-- Sample app settings
INSERT INTO app_settings (setting_key, setting_value) VALUES
('app_version', '{"version": "0.0.1", "release_date": "2025-06-07"}'),
('default_profile_expiry', '{"hours": 24}'),
('email_settings', '{"sender": "noreply@fastprofiles.com", "template_id": "profile-share"}'),
('sms_settings', '{"provider": "twilio", "template_id": "profile-share-sms"}');

-- Note: The following sections require actual user IDs from auth.users
-- Replace 'YOUR_USER_ID' with an actual user ID from your Supabase auth.users table

-- This is a placeholder for how to insert patient profiles once you have user IDs
/*
-- Sample patient profiles
INSERT INTO patient_profiles (patient_id, created_by, pharmacist_authorizing, status, profile_data) VALUES
((SELECT id FROM patients WHERE first_name = 'John' AND last_name = 'Smith'), 
 'YOUR_USER_ID', 
 'Dr. Jane Pharmacist', 
 'Draft', 
 '{"medications": [
    {"drug_id": (SELECT id FROM druglist WHERE generic_name = "Atorvastatin" AND strength = "20mg" LIMIT 1), 
     "status": "New", 
     "frequency": "Once daily", 
     "notes": "Take with evening meal"},
    {"drug_id": (SELECT id FROM druglist WHERE generic_name = "Aspirin" AND strength = "81mg" LIMIT 1), 
     "status": "Continued", 
     "frequency": "Once daily", 
     "notes": "Take with breakfast"}
  ]}'
);

-- Sample profile access links (requires a patient_profile id)
INSERT INTO profile_access_links (profile_id, unique_hash, expiry_time) VALUES
((SELECT id FROM patient_profiles WHERE patient_id = (SELECT id FROM patients WHERE first_name = 'John' AND last_name = 'Smith') LIMIT 1),
 'abc123xyz456', 
 NOW() + INTERVAL '24 HOURS');

-- Update the patient_profile with the access link
UPDATE patient_profiles 
SET viewable_link_id = (SELECT id FROM profile_access_links WHERE unique_hash = 'abc123xyz456')
WHERE patient_id = (SELECT id FROM patients WHERE first_name = 'John' AND last_name = 'Smith');
*/

-- Note: The audit_log table will be populated automatically by triggers
-- when changes are made to the patients, patient_profiles, and profile_access_links tables