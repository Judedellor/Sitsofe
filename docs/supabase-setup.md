# Supabase Setup Guide

## Database Schema Setup

1. Log in to your Supabase dashboard at https://app.supabase.com
2. Select your project
3. Navigate to the SQL Editor in the left sidebar
4. Click "New Query"
5. Paste the entire contents of the `db/schema.sql` file
6. Click "Run" to execute the SQL

## Storage Setup

For property images, you'll need to set up a storage bucket:

1. Go to the Storage section in the Supabase dashboard
2. Click "Create a new bucket"
3. Name it "property-images"
4. Set the access level to "Private" (we'll use RLS policies to control access)
5. Add the following RLS policy to allow authenticated users to upload images:

```sql
-- Allow authenticated users to upload images
CREATE POLICY "Allow authenticated users to upload images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'property-images');

-- Allow users to view their own uploaded images
CREATE POLICY "Allow users to view their own uploaded images"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'property-images');
