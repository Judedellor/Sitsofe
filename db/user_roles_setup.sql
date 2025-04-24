-- User Roles and Permissions Setup for HomeHub

-- Create application roles
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'app_anonymous') THEN
    CREATE ROLE app_anonymous;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'app_authenticated') THEN
    CREATE ROLE app_authenticated;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'app_admin') THEN
    CREATE ROLE app_admin;
  END IF;
END
$$;

-- Grant permissions to roles
GRANT USAGE ON SCHEMA public TO app_anonymous, app_authenticated, app_admin;

-- Anonymous role permissions (minimal read-only access)
GRANT SELECT ON TABLE properties TO app_anonymous;
GRANT SELECT ON TABLE property_images TO app_anonymous;
GRANT SELECT ON TABLE profiles TO app_anonymous;

-- Authenticated role permissions
GRANT app_anonymous TO app_authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE profiles TO app_authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE properties TO app_authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE property_images TO app_authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE conversations TO app_authenticated;
GRANT SELECT, INSERT ON TABLE messages TO app_authenticated;
GRANT SELECT, UPDATE ON TABLE notifications TO app_authenticated;
GRANT SELECT, INSERT, DELETE ON TABLE saved_properties TO app_authenticated;
GRANT SELECT, INSERT ON TABLE property_inquiries TO app_authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE user_subscriptions TO app_authenticated;

-- Admin role permissions
GRANT app_authenticated TO app_admin;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO app_admin;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app_admin;

-- Create initial admin user (you'll need to replace with actual values)
-- This is just a template - in production you should set this up manually
/*
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, role)
VALUES (
  uuid_generate_v4(),
  'admin@homehub.com',
  crypt('securepassword', gen_salt('bf')),
  now(),
  'authenticated'
);

INSERT INTO profiles (id, username, full_name, role, email, verified)
SELECT 
  id,
  'admin',
  'System Administrator',
  'admin',
  email,
  true
FROM auth.users
WHERE email = 'admin@homehub.com';
*/
