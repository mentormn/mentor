-- ================================================================
-- Migration: Add phone and curriculums to profiles, create quick_help_requests table
-- ================================================================

-- 1. Extend profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS gender TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS curriculums TEXT[] DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio TEXT;

-- 2. Create quick_help_requests table (10-Minute SOS Flash Mentoring)
CREATE TABLE IF NOT EXISTS public.quick_help_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  student_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  school TEXT NOT NULL,
  grade TEXT NOT NULL,
  gender TEXT,
  curriculum TEXT NOT NULL DEFAULT 'National', -- 'National' | 'Cambridge' | 'Both'
  subject TEXT NOT NULL,
  help_type TEXT NOT NULL DEFAULT 'topic', -- 'topic' | 'problem' | 'assignment' | 'general'
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  attachment_url TEXT,
  mentor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  mentor_name TEXT,
  meeting_link TEXT,
  status TEXT NOT NULL DEFAULT 'open', -- 'open' | 'claimed' | 'resolved' | 'cancelled'
  created_at TIMESTAMPTZ DEFAULT now(),
  claimed_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ
);

-- 3. Enable RLS
ALTER TABLE public.quick_help_requests ENABLE ROW LEVEL SECURITY;

-- 4. Policies for quick_help_requests
DROP POLICY IF EXISTS "Quick help requests viewable by everyone" ON public.quick_help_requests;
CREATE POLICY "Quick help requests viewable by everyone" ON public.quick_help_requests FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can insert quick help requests" ON public.quick_help_requests;
CREATE POLICY "Anyone can insert quick help requests" ON public.quick_help_requests FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users and mentors can update quick help requests" ON public.quick_help_requests;
CREATE POLICY "Users and mentors can update quick help requests" ON public.quick_help_requests FOR UPDATE USING (true);
