'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useLanguage } from '@/lib/i18n';
import { 
  GraduationCap, 
  School, 
  MapPin, 
  BookOpen, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

const COMMON_SCHOOLS = [
  '1-р сургууль (School No. 1)',
  'Сант сургууль (Sant School)',
  'Орчлон сургууль (Orchlon School)',
  'Шинэ Үе сургууль (Shine Ue)',
  '11-р сургууль (School No. 11)',
  'Олонлог сургууль (Olonlog)',
  'МУИС (National University of Mongolia)',
  'ШУТИС (MUST)',
  'Хөдөө орон нутгийн сургууль (Provincial High School)',
  'Бусад / Өөр сургууль (Other)'
];

const GRADES = [
  '8th Grade',
  '9th Grade',
  '10th Grade',
  '11th Grade',
  '12th Grade',
  'University 1st Year',
  'University 2nd Year',
  'University 3rd Year',
  'University 4th Year',
  'Postgraduate / Self-Taught'
];

const SUBJECT_OPTIONS = [
  'Математик / Олимпиад (Math & Olympiad)',
  'Пайтон & Алгоритм (Python & Algorithms)',
  'SAT Математик & Эссэ (SAT Prep)',
  'IELTS & Academic English',
  'Физик & Цахилгаан хэлхээ (Physics & Circuits)',
  'Хими & Молекул биологи (Chemistry & Biology)',
  'Вэб хөгжүүлэлт (React, Next.js, Web)',
  'Их сургуулийн өргөдөл & Тэтгэлэг (College Applications)'
];

export default function OnboardingPage() {
  const router = useRouter();
  const { language, t } = useLanguage();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Form states
  const [school, setSchool] = useState('');
  const [customSchool, setCustomSchool] = useState('');
  const [grade, setGrade] = useState('11th Grade');
  const [location, setLocation] = useState('Улаанбаатар (Ulaanbaatar)');
  
  const [learningGoals, setLearningGoals] = useState<string[]>([]);
  const [specializations, setSpecializations] = useState<string[]>([]);
  
  const [wantsToMentor, setWantsToMentor] = useState(false);
  const [achievements, setAchievements] = useState('');

  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        router.push('/login?redirectTo=/onboarding');
        return;
      }
      setUserId(session.user.id);

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profile) {
        if (profile.school && profile.school !== 'General Education School') setSchool(profile.school);
        if (profile.grade) setGrade(profile.grade);
        if (profile.location) setLocation(profile.location);
        if (profile.learning_goals) setLearningGoals(profile.learning_goals);
        if (profile.specializations) setSpecializations(profile.specializations);
        if (profile.mentor_status === 'pending' || profile.mentor_status === 'verified') {
          setWantsToMentor(true);
        }
        if (profile.achievements) setAchievements(profile.achievements.join('\n'));
      }
    }

    checkAuth();
  }, [router]);

  const toggleLearningGoal = (sub: string) => {
    setLearningGoals((prev) => 
      prev.includes(sub) ? prev.filter((s) => s !== sub) : [...prev, sub]
    );
  };

  const toggleSpecialization = (sub: string) => {
    setSpecializations((prev) => 
      prev.includes(sub) ? prev.filter((s) => s !== sub) : [...prev, sub]
    );
  };

  const handleComplete = async () => {
    if (!userId) return;
    setLoading(true);

    const finalSchool = school === 'Бусад / Өөр сургууль (Other)' && customSchool ? customSchool : school || 'School No. 1';
    const achievementList = achievements
      .split('\n')
      .map((a) => a.trim())
      .filter(Boolean);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          school: finalSchool,
          grade,
          location,
          learning_goals: learningGoals,
          specializations: specializations,
          mentor_status: wantsToMentor ? 'pending' : 'none',
          achievements: achievementList,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) throw error;

      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 space-y-8">
      
      {/* Step Indicator */}
      <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            {language === 'mn' ? `Алхам ${step} / 3` : `Step ${step} of 3`}
          </span>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 mt-1">
            {step === 1 && (language === 'mn' ? 'Таны сургууль & байршил' : 'School & Location')}
            {step === 2 && (language === 'mn' ? 'Сонирхож буй хичээлүүд' : 'Subject Interests')}
            {step === 3 && (language === 'mn' ? 'Ментор болох сонирхол' : 'Mentorship & Goals')}
          </h1>
        </div>
        <div className="flex gap-1.5">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all ${
                s === step ? 'w-8 bg-zinc-900' : s < step ? 'w-2 bg-emerald-600' : 'w-2 bg-zinc-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step 1: School & Location */}
      {step === 1 && (
        <div className="saas-card p-6 sm:p-8 space-y-6">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-700">
              {language === 'mn' ? 'Сургууль' : 'School or University'}
            </label>
            <select
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              className="saas-input"
            >
              <option value="">{language === 'mn' ? 'Сургуулиа сонгоно уу...' : 'Select your school...'}</option>
              {COMMON_SCHOOLS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {school === 'Бусад / Өөр сургууль (Other)' && (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-700">
                {language === 'mn' ? 'Сургуулийн нэр' : 'Enter school name'}
              </label>
              <input
                type="text"
                placeholder="Жишээ нь: Дархан 1-р сургууль"
                value={customSchool}
                onChange={(e) => setCustomSchool(e.target.value)}
                className="saas-input"
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-700">
                {language === 'mn' ? 'Анги / Түвшин' : 'Grade / Year'}
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="saas-input"
              >
                {GRADES.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-700">
                {language === 'mn' ? 'Аймаг / Хот' : 'Province / City'}
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="saas-input"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="btn-primary px-5 py-2 text-xs font-medium text-white inline-flex items-center gap-2"
            >
              <span>{language === 'mn' ? 'Дараах' : 'Next'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Learning Goals */}
      {step === 2 && (
        <div className="saas-card p-6 sm:p-8 space-y-6">
          <p className="text-xs text-zinc-500">
            {language === 'mn'
              ? 'Та ямар чиглэлээр өөрийгөө хөгжүүлэх, олимпиад шалгалтад бэлдэхийг хүсэж байна вэ?'
              : 'Select the subjects or areas you want to master in small sprints:'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SUBJECT_OPTIONS.map((sub) => {
              const selected = learningGoals.includes(sub);
              return (
                <button
                  key={sub}
                  type="button"
                  onClick={() => toggleLearningGoal(sub)}
                  className={`p-3.5 rounded-xl border text-left text-xs font-medium transition-all ${
                    selected
                      ? 'border-zinc-900 bg-zinc-900 text-white shadow-sm'
                      : 'border-zinc-200 bg-zinc-50/50 text-zinc-700 hover:bg-zinc-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{sub}</span>
                    {selected && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="btn-secondary px-4 py-2 text-xs font-medium text-zinc-700"
            >
              {language === 'mn' ? 'Буцах' : 'Back'}
            </button>

            <button
              type="button"
              onClick={() => setStep(3)}
              className="btn-primary px-5 py-2 text-xs font-medium text-white inline-flex items-center gap-2"
            >
              <span>{language === 'mn' ? 'Дараах' : 'Next'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Mentor Option */}
      {step === 3 && (
        <div className="saas-card p-6 sm:p-8 space-y-6">
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={wantsToMentor}
                onChange={(e) => setWantsToMentor(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
              />
              <div>
                <div className="text-xs font-bold text-zinc-900">
                  {language === 'mn' ? 'Би бусдад заах, ментор болох сонирхолтой' : 'I want to mentor other students'}
                </div>
                <p className="text-[11px] text-zinc-500 mt-0.5 leading-relaxed">
                  {language === 'mn'
                    ? 'Олимпиад, улсын шалгалт, тэтгэлэг авсан туршлагаасаа дүү нартаа зааж албан ёсны батламж, тэтгэлэг авах боломжтой.'
                    : 'Teach younger scholars, earn verified teaching credentials, and help students across 21 provinces.'}
                </p>
              </div>
            </label>
          </div>

          {wantsToMentor && (
            <div className="space-y-4 animate-in fade-in">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-700">
                  {language === 'mn' ? 'Гаргасан амжилтууд (Мөр бүрт нэг амжилт)' : 'Key Academic Achievements (One per line)'}
                </label>
                <textarea
                  rows={3}
                  placeholder="Жишээ нь: Улсын Математикийн олимпиад Хүрэл медаль 2024&#10;SAT Math 800"
                  value={achievements}
                  onChange={(e) => setAchievements(e.target.value)}
                  className="saas-input"
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="btn-secondary px-4 py-2 text-xs font-medium text-zinc-700"
            >
              {language === 'mn' ? 'Буцах' : 'Back'}
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={handleComplete}
              className="btn-primary px-6 py-2 text-xs font-medium text-white inline-flex items-center gap-2"
            >
              {loading ? (
                <span>{language === 'mn' ? 'Хадгалж байна...' : 'Saving...'}</span>
              ) : (
                <>
                  <span>{language === 'mn' ? 'Бүртгэл дуусгах' : 'Complete Profile'}</span>
                  <CheckCircle2 className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
