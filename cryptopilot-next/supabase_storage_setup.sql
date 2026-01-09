-- Enable Storage by creating the bucket 'avatars'
-- Note: You can run this in the Supabase SQL Editor

-- 1. Create the bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('avatars', 'avatars', true, 5242880, ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp'];

-- 2. Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatars" ON storage.objects;

-- 3. Create RLS Policies

-- Allow public read access (so anyone can view profile pics)
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'avatars' );

-- Allow authenticated users to upload files to the 'avatars' bucket
-- We restrict the folder path so users can't overwrite system files if any (optional but good practice)
-- Usually we just check bucket_id.
-- AND auth.role() = 'authenticated' is implied by 'TO authenticated'? No, actually 'TO authenticated' sets the role.
CREATE POLICY "Authenticated users can upload avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'avatars'
    -- Optional: Enforce that the filename starts with the user ID?
    -- The frontend code does: `${user.id}-${Date.now()}.${fileExt}`
    -- But enforcing it in SQL is complex string parsing.
    -- We'll trust the bucket isolation for now or rely on owner check for update/delete.
);

-- Allow users to update their OWN files
CREATE POLICY "Users can update their own avatars"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'avatars' AND auth.uid() = owner )
WITH CHECK ( bucket_id = 'avatars' AND auth.uid() = owner );

-- Allow users to delete their OWN files
CREATE POLICY "Users can delete their own avatars"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'avatars' AND auth.uid() = owner );

