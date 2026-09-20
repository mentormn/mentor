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

      // Fetch existing profile if partially completed
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

      router.push('/profile');
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-grid-pattern">
      <div className="absolute inset-0 bg-radial-glow pointer-events-none" />

      <div className="relative w-full max-w-xl space-y-6">
        
        {/* Step Indicator Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{language === 'mn' ? `АЛХАМ ${step} / 3` : `STEP ${step} OF 3`}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            {t('onboardingTitle')}
          </h1>
          <p className="text-xs text-zinc-400">
            {t('onboardingSub')}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-zinc-800/80 rounded-full h-1.5 overflow-hidden">
          <div 
            className="bg-blue-500 h-full transition-all duration-300 ease-out"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* Card Content */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
          
          {/* STEP 1: Academic Identity */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-white/[0.06]">
                <School className="h-4 w-4 text-blue-400" />
                <h2 className="text-sm font-semibold text-white">{t('step1Identity')}</h2>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-300">
                    {t('fieldSchool')}
                  </label>
                  <select
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    className="w-full rounded-lg border border-white/[0.08] bg-zinc-900/70 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">-- Сургуулиа сонгоно уу --</option>
                    {COMMON_SCHOOLS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {school === 'Бусад / Өөр сургууль (Other)' && (
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-300">
                      Сургуулийн нэрээ бичнэ үү
                    </label>
                    <input
                      type="text"
                      placeholder="Жишээ: 84-р сургууль"
                      value={customSchool}
                      onChange={(e) => setCustomSchool(e.target.value)}
                      className="w-full rounded-lg border border-white/[0.08] bg-zinc-900/70 px-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-300">
                      {t('fieldGrade')}
                    </label>
                    <select
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      className="w-full rounded-lg border border-white/[0.08] bg-zinc-900/70 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                    >
                      {GRADES.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-300">
                      {t('fieldCity')}
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Улаанбаатар / Дархан / Ховд"
                      className="w-full rounded-lg border border-white/[0.08] bg-zinc-900/70 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="btn-primary px-4 py-2 rounded-lg text-xs font-medium text-white flex items-center gap-2"
                >
                  <span>{t('saveAndContinue')}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Focus & Learning Goals */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-white/[0.06]">
                <BookOpen className="h-4 w-4 text-blue-400" />
                <h2 className="text-sm font-semibold text-white">{t('step2Focus')}</h2>
              </div>

              <p className="text-xs text-zinc-400">
                {language === 'mn'
                  ? 'Та Mentor.mn дээр ямар чиглэлээр гүнзгийрүүлэн суралцахыг хүсэж байна вэ? (Олон сонголттой)'
                  : 'Which subjects do you want to master through peer sprints? (Select all that apply)'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SUBJECT_OPTIONS.map((sub) => {
                  const active = learningGoals.includes(sub);
                  return (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => toggleLearningGoal(sub)}
                      className={`text-left p-2.5 rounded-lg border text-xs transition-all ${
                        active
                          ? 'border-blue-500/50 bg-blue-500/10 text-white font-medium shadow-[0_0_10px_rgba(59,130,246,0.15)]'
                          : 'border-white/[0.08] bg-zinc-900/40 text-zinc-400 hover:text-zinc-200 hover:border-white/[0.15]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="line-clamp-1">{sub}</span>
                        {active && <CheckCircle2 className="h-3.5 w-3.5 text-blue-400 shrink-0 ml-1" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn-secondary px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Буцах</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="btn-primary px-4 py-2 rounded-lg text-xs font-medium text-white flex items-center gap-2"
                >
                  <span>{t('saveAndContinue')}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Dual-Identity & Mentor Verification */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-white/[0.06]">
                <Award className="h-4 w-4 text-blue-400" />
                <h2 className="text-sm font-semibold text-white">{t('step3Mentor')}</h2>
              </div>

              {/* Mentor Application Toggle */}
              <div className="rounded-xl border border-white/[0.08] bg-zinc-900/60 p-4 space-y-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={wantsToMentor}
                    onChange={(e) => setWantsToMentor(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-zinc-700 text-blue-600 focus:ring-blue-500 bg-zinc-800"
                  />
                  <div>
                    <span className="text-xs font-semibold text-white block">
                      {t('applyAsMentorLabel')}
                    </span>
                    <span className="text-[11px] text-zinc-400 leading-relaxed block mt-0.5">
                      {language === 'mn'
                        ? 'Өөрийн эзэмшсэн сэдвээр 1–3 долоо хоногийн спринт хичээл нээж, дүү нартаа заан албан ёсны зэрэг дэв авах боломж.'
                        : 'Host 1–3 week sprint classes in subjects you mastered, guide younger peers, and earn formal Ministry credentials.'}
                    </span>
                  </div>
                </label>

                {wantsToMentor && (
                  <div className="pt-3 border-t border-white/[0.06] space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-medium text-zinc-300">
                        {t('fieldCanMentor')}
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {SUBJECT_OPTIONS.map((sub) => {
                          const active = specializations.includes(sub);
                          return (
                            <button
                              key={sub}
                              type="button"
                              onClick={() => toggleSpecialization(sub)}
                              className={`text-left p-2 rounded-md border text-[11px] transition-all ${
                                active
                                  ? 'border-blue-500/50 bg-blue-500/10 text-white font-medium'
                                  : 'border-white/[0.06] bg-zinc-900/40 text-zinc-400 hover:text-zinc-200'
                              }`}
                            >
                              <span className="line-clamp-1">{sub}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-zinc-300">
                        {t('fieldAchievements')}
                      </label>
                      <textarea
                        rows={3}
                        value={achievements}
                        onChange={(e) => setAchievements(e.target.value)}
                        placeholder={language === 'mn'
                          ? 'Жишээ: \n- Улсын физикийн олимпиадын мөнгөн медаль\n- SAT 1520 (Math 800)\n- IELTS 7.5'
                          : 'Example:\n- National Physics Olympiad Silver Medal\n- SAT 1520 (Math 800)\n- IELTS 7.5'}
                        className="w-full rounded-lg border border-white/[0.08] bg-zinc-900/70 p-2.5 text-xs text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="btn-secondary px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Буцах</span>
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleComplete}
                  className="btn-primary px-5 py-2 rounded-lg text-xs font-medium text-white flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <span className="animate-pulse">Хадгалж байна...</span>
                  ) : (
                    <>
                      <span>{t('completeOnboarding')}</span>
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
