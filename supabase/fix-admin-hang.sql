-- ============================================
-- Fix for Admin Hang / RLS Recursion
-- Run this in your Supabase SQL Editor
-- ============================================

-- 1. Use the auth.jwt() to check admin role instead, OR just remove the problematic policy.
-- The most common cause of recursion is a table policy calling a function that queries the same table.

-- Drop the recursive policy on profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- Make sure is_admin() is completely safe by explicitly bypassing RLS within it if needed, 
-- but since we dropped the recursive policy, it should stop hanging automatically.
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER SET search_path = public;

-- To prevent the frontend from calling loadData() before auth is checked,
-- we'll also update the React component logic.
