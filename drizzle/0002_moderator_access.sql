-- Create function to get user role from JWT claims
CREATE OR REPLACE FUNCTION auth.user_role() RETURNS text AS $$
  SELECT COALESCE(
    nullif(current_setting('request.jwt.claims', true)::json->>'role', ''),
    'user'
  )::text;
$$ LANGUAGE sql STABLE;--> statement-breakpoint

-- Drop existing SELECT policy
DROP POLICY IF EXISTS "crud-authenticated-policy-select" ON "notes";--> statement-breakpoint

-- Create new SELECT policy allowing admin/moderator to read all notes
-- Regular users can only read their own notes
CREATE POLICY "notes-select-policy" ON "notes" AS PERMISSIVE
FOR SELECT TO "authenticated"
USING (
  auth.user_id() = "notes"."user_id"
  OR auth.user_role() IN ('admin', 'moderator')
);
