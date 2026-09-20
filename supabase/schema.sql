-- ================================================================
-- Mentor.mn: National Academic Mentorship Database Schema (v2 Production)
-- ================================================================

-- 1. Profiles Table (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  bio TEXT,
  gender TEXT DEFAULT 'Prefer not to say',
  age INTEGER DEFAULT 17,
  grade TEXT DEFAULT '11th Grade',
  school TEXT DEFAULT 'General Education School',
  location TEXT DEFAULT 'Ulaanbaatar',
  specializations TEXT[] DEFAULT '{}',
  learning_goals TEXT[] DEFAULT '{}',
  mentor_tier TEXT DEFAULT 'JUNIOR_MENTOR',
  mentor_status TEXT DEFAULT 'none', -- 'none' | 'pending' | 'verified'
  achievements TEXT[] DEFAULT '{}',
  mentor_xp INTEGER DEFAULT 0,
  total_students INTEGER DEFAULT 0,
  completed_classes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Sprint Classes Table
CREATE TABLE IF NOT EXISTS public.sprint_classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  mentor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  mentor_name TEXT NOT NULL,
  mentor_school TEXT NOT NULL,
  mentor_tier TEXT NOT NULL DEFAULT 'JUNIOR_MENTOR',
  subject TEXT NOT NULL,
  curriculum TEXT NOT NULL,
  missions JSONB DEFAULT '[]'::jsonb, -- Array of { week_number: number, title: string, description: string, deliverable_prompt: string }
  max_seats INTEGER NOT NULL CHECK (max_seats BETWEEN 1 AND 10),
  price_mnt INTEGER NOT NULL DEFAULT 0, -- 0 for Free
  enrollment_mode TEXT NOT NULL DEFAULT 'instant', -- 'instant' | 'application'
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  duration_weeks INTEGER NOT NULL DEFAULT 2,
  schedule_summary TEXT NOT NULL,
  meeting_link TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open', -- 'open' | 'in_progress' | 'completed'
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Class Enrollments Table (Seat Booking & Applications)
CREATE TABLE IF NOT EXISTS public.class_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES public.sprint_classes(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'confirmed', -- 'confirmed' | 'pending' | 'rejected'
  application_note TEXT,
  enrolled_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(class_id, student_id)
);

-- 4. Deliverables Table (Proof of Work / Artifacts)
CREATE TABLE IF NOT EXISTS public.deliverables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES public.sprint_classes(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  title TEXT NOT NULL,
  url_or_notes TEXT NOT NULL,
  mentor_feedback TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'approved' | 'revision_requested'
  submitted_at TIMESTAMPTZ DEFAULT now(),
  approved_at TIMESTAMPTZ
);

-- 5. Sprint Discussions Table (Cohort Group Chat & Announcements)
CREATE TABLE IF NOT EXISTS public.sprint_discussions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES public.sprint_classes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_avatar TEXT,
  is_mentor BOOLEAN DEFAULT false,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Certificates Table (Cryptographic Verification Ledger)
CREATE TABLE IF NOT EXISTS public.certificates (
  id TEXT PRIMARY KEY, -- e.g. MN-EDU-2026-XXXX
  mentor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  mentor_name TEXT NOT NULL,
  mentor_school TEXT NOT NULL,
  tier TEXT NOT NULL,
  total_hours INTEGER NOT NULL,
  students_impacted INTEGER NOT NULL,
  class_title TEXT NOT NULL,
  subject TEXT NOT NULL,
  sha256_hash TEXT NOT NULL,
  issued_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Trigger: Automatically create profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 8. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sprint_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deliverables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sprint_discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Sprint Classes Policies
DROP POLICY IF EXISTS "Classes are viewable by everyone" ON public.sprint_classes;
CREATE POLICY "Classes are viewable by everyone" ON public.sprint_classes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can create classes" ON public.sprint_classes;
CREATE POLICY "Authenticated users can create classes" ON public.sprint_classes FOR INSERT WITH CHECK (auth.uid() = mentor_id);

DROP POLICY IF EXISTS "Mentors can update their own classes" ON public.sprint_classes;
CREATE POLICY "Mentors can update their own classes" ON public.sprint_classes FOR UPDATE USING (auth.uid() = mentor_id);

-- Class Enrollments Policies
DROP POLICY IF EXISTS "Enrollments viewable by everyone" ON public.class_enrollments;
CREATE POLICY "Enrollments viewable by everyone" ON public.class_enrollments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Students can enroll in classes" ON public.class_enrollments;
CREATE POLICY "Students can enroll in classes" ON public.class_enrollments FOR INSERT WITH CHECK (auth.uid() = student_id);

DROP POLICY IF EXISTS "Students can leave classes" ON public.class_enrollments;
CREATE POLICY "Students can leave classes" ON public.class_enrollments FOR DELETE USING (auth.uid() = student_id);

DROP POLICY IF EXISTS "Mentors can update enrollment status" ON public.class_enrollments;
CREATE POLICY "Mentors can update enrollment status" ON public.class_enrollments FOR UPDATE USING (
  auth.uid() IN (SELECT mentor_id FROM public.sprint_classes WHERE id = class_id)
);

-- Deliverables Policies
DROP POLICY IF EXISTS "Deliverables viewable by everyone" ON public.deliverables;
CREATE POLICY "Deliverables viewable by everyone" ON public.deliverables FOR SELECT USING (true);

DROP POLICY IF EXISTS "Students can submit deliverables" ON public.deliverables;
CREATE POLICY "Students can submit deliverables" ON public.deliverables FOR INSERT WITH CHECK (auth.uid() = student_id);

DROP POLICY IF EXISTS "Mentors or students can update deliverables" ON public.deliverables;
CREATE POLICY "Mentors or students can update deliverables" ON public.deliverables FOR UPDATE USING (
  auth.uid() = student_id OR 
  auth.uid() IN (SELECT mentor_id FROM public.sprint_classes WHERE id = class_id)
);

-- Sprint Discussions Policies
DROP POLICY IF EXISTS "Discussions viewable by everyone" ON public.sprint_discussions;
CREATE POLICY "Discussions viewable by everyone" ON public.sprint_discussions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can post discussions" ON public.sprint_discussions;
CREATE POLICY "Authenticated users can post discussions" ON public.sprint_discussions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Certificates Policies
DROP POLICY IF EXISTS "Certificates are publicly verifiable by everyone" ON public.certificates;
CREATE POLICY "Certificates are publicly verifiable by everyone" ON public.certificates FOR SELECT USING (true);

DROP POLICY IF EXISTS "System can issue certificates" ON public.certificates;
CREATE POLICY "System can issue certificates" ON public.certificates FOR INSERT WITH CHECK (true);
