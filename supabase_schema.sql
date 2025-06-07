-- SQL script to create Supabase database schema for Fast Profiles application
-- Based on requirements from GUIDELINES.md

-- Enable Row Level Security (RLS)
ALTER DATABASE postgres SET "app.jwt_secret" TO 'PVJcYGlCZzdPE0xpdrETn4FI7dWx5fl9IZkAAoOd2PF5FoY/m/isgT6GP7z4AdgN7TKYzjRueVZDLjnhFK/W0Q==';

-- Users table is managed by Supabase Auth, but we can extend it with additional fields if needed
-- This is automatically created by Supabase

-- Drug list table
CREATE TABLE druglist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  generic_name TEXT NOT NULL,
  common_drug BOOLEAN DEFAULT FALSE,
  brand_name TEXT,
  form TEXT,
  strength TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on generic_name for faster searches
CREATE INDEX idx_druglist_generic_name ON druglist(generic_name);
CREATE INDEX idx_druglist_common_drug ON druglist(common_drug);

-- Patients table
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  medicare_number TEXT,
  date_of_birth DATE NOT NULL,
  mobile_phone_number TEXT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for patient searches
CREATE INDEX idx_patients_names ON patients(first_name, last_name);
CREATE INDEX idx_patients_medicare ON patients(medicare_number);
CREATE INDEX idx_patients_dob ON patients(date_of_birth);

-- Patient profiles table
CREATE TABLE patient_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES auth.users(id),
  pharmacist_authorizing TEXT,
  status TEXT NOT NULL CHECK (status IN ('Draft', 'Released')),
  profile_data JSONB NOT NULL DEFAULT '{}',
  viewable_link_id UUID,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for profile queries
CREATE INDEX idx_patient_profiles_patient_id ON patient_profiles(patient_id);
CREATE INDEX idx_patient_profiles_status ON patient_profiles(status);
CREATE INDEX idx_patient_profiles_created_by ON patient_profiles(created_by);

-- Profile access links table
CREATE TABLE profile_access_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES patient_profiles(id) ON DELETE CASCADE,
  unique_hash TEXT NOT NULL UNIQUE,
  expiry_time TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for access link lookups
CREATE INDEX idx_profile_access_links_hash ON profile_access_links(unique_hash);
CREATE INDEX idx_profile_access_links_profile_id ON profile_access_links(profile_id);
CREATE INDEX idx_profile_access_links_active_expiry ON profile_access_links(is_active, expiry_time);

-- Update patient_profiles to reference profile_access_links
ALTER TABLE patient_profiles ADD CONSTRAINT fk_viewable_link_id FOREIGN KEY (viewable_link_id) REFERENCES profile_access_links(id) ON DELETE SET NULL;

-- Audit log table
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  patient_id UUID REFERENCES patients(id) ON DELETE SET NULL,
  profile_id UUID REFERENCES patient_profiles(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  ip_address TEXT
);

-- Create indexes for audit log queries
CREATE INDEX idx_audit_log_timestamp ON audit_log(timestamp);
CREATE INDEX idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX idx_audit_log_patient_id ON audit_log(patient_id);
CREATE INDEX idx_audit_log_profile_id ON audit_log(profile_id);
CREATE INDEX idx_audit_log_action_type ON audit_log(action_type);

-- App settings table
CREATE TABLE app_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for settings lookups
CREATE INDEX idx_app_settings_key ON app_settings(setting_key);

-- Row Level Security Policies

-- Enable RLS on all tables
ALTER TABLE druglist ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_access_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for druglist
CREATE POLICY "Allow authenticated users to read druglist" ON druglist
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert into druglist" ON druglist
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update druglist" ON druglist
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policies for patients
CREATE POLICY "Allow authenticated users to read patients" ON patients
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert into patients" ON patients
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update patients" ON patients
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policies for patient_profiles
CREATE POLICY "Allow authenticated users to read patient_profiles" ON patient_profiles
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert into patient_profiles" ON patient_profiles
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update patient_profiles" ON patient_profiles
  FOR UPDATE USING (auth.role() = 'authenticated' AND (created_by = auth.uid() OR status = 'Draft'));

-- Create policies for profile_access_links
CREATE POLICY "Allow authenticated users to read profile_access_links" ON profile_access_links
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert into profile_access_links" ON profile_access_links
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update profile_access_links" ON profile_access_links
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policies for audit_log
CREATE POLICY "Allow authenticated users to read audit_log" ON audit_log
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert into audit_log" ON audit_log
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create policies for app_settings
CREATE POLICY "Allow authenticated users to read app_settings" ON app_settings
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert into app_settings" ON app_settings
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update app_settings" ON app_settings
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create functions and triggers for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add update timestamp triggers to relevant tables
CREATE TRIGGER update_druglist_timestamp
BEFORE UPDATE ON druglist
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_patients_timestamp
BEFORE UPDATE ON patients
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_patient_profiles_timestamp
BEFORE UPDATE ON patient_profiles
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_app_settings_timestamp
BEFORE UPDATE ON app_settings
FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- Create function to automatically create audit log entries
CREATE OR REPLACE FUNCTION create_audit_log()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_log (
    user_id,
    patient_id,
    profile_id,
    action_type,
    details,
    ip_address
  ) VALUES (
    auth.uid(),
    CASE 
      WHEN TG_TABLE_NAME = 'patients' THEN NEW.id
      WHEN TG_TABLE_NAME = 'patient_profiles' THEN NEW.patient_id
      ELSE NULL
    END,
    CASE 
      WHEN TG_TABLE_NAME = 'patient_profiles' THEN NEW.id
      WHEN TG_TABLE_NAME = 'profile_access_links' THEN NEW.profile_id
      ELSE NULL
    END,
    TG_OP || '_' || TG_TABLE_NAME,
    jsonb_build_object('new', to_jsonb(NEW), 'old', to_jsonb(OLD)),
    current_setting('request.headers')::json->>'x-forwarded-for'
  );
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Add audit log triggers to relevant tables
CREATE TRIGGER audit_patients_changes
AFTER INSERT OR UPDATE OR DELETE ON patients
FOR EACH ROW EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER audit_patient_profiles_changes
AFTER INSERT OR UPDATE OR DELETE ON patient_profiles
FOR EACH ROW EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER audit_profile_access_links_changes
AFTER INSERT OR UPDATE OR DELETE ON profile_access_links
FOR EACH ROW EXECUTE FUNCTION create_audit_log();