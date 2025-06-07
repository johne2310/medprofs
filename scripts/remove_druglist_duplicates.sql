INSERT INTO patient_profiles (patient_id, created_by, pharmacist_authorizing, status, profile_data)
VALUES
(
  (SELECT id FROM patients WHERE first_name = 'John' AND last_name = 'Smith'),
  (SELECT setting_value FROM app_settings WHERE setting_name = 'current_user_id'),
  'Dr. Jane Pharmacist',
  'Draft',
  (
    SELECT json_build_object(
      'medications', (
        SELECT json_agg(medication_obj)
        FROM (
          SELECT json_build_object(
            'drug_id', (SELECT id FROM druglist WHERE generic_name = 'Atorvastatin' AND strength = '20mg' LIMIT 1),
            'status', 'New',
            'frequency', 'Once daily',
            'notes', 'Take with evening meal'
          ) AS medication_obj
          UNION ALL
          SELECT json_build_object(
            'drug_id', (SELECT id FROM druglist WHERE generic_name = 'Aspirin' AND strength = '81mg' LIMIT 1),
            'status', 'Continued',
            'frequency', 'Once daily',
            'notes', 'Take with breakfast'
          ) AS medication_obj
        ) AS all_medications
      )
    )
  )
);