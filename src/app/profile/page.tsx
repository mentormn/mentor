'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { useLanguage } from '@/lib/i18n';
import { TIER_CONFIGS, getNextTierProgress } from '@/lib/engine/tierProgression';
import { FormalTier } from '@/lib/types';
import { 
  User as UserIcon, 
  GraduationCap, 
  BookOpen, 
  Award, 
  Sparkles, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  PlusCircle, 
  ShieldCheck, 
  ExternalLink,
  Flame,
  Clock,
  Edit3
} from 'lucide-react';

export default function ProfilePage() {
  const { language, t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  
  const [enrolledClasses, setEnrolledClasses] = useState<any[]>([]);
  const [teachingClasses, setTeachingClasses] = useState<any[]>([]);
  const [userDeliverables, setUserDeliverables] = useState<any[]>([]);
  const [userCertificates, setUserCertificates] = useState<any[]>([]);

  const [activeTab, setActiveTab] = useState<'learning' | 'mentoring'>('learning');

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          window.location.href = '/login?redirectTo=/profile';
          return;
        }
        setCurrentUser(session.user);

        // Fetch profile
        const { data: profData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        setProfile(profData);

        // Fetch enrolled classes
        const { data: enrollments } = await supabase
          .from('class_enrollments')
          .select(`
            class_id,
            status,
            sprint_classes (
              id,
              title,
              subject,
              mentor_name,
              mentor_school,
              schedule_summary,
              duration_weeks,
              price_mnt
            )
          `)
          .eq('student_id', session.user.id);

        if (enrollments) {
          setEnrolledClasses(
            enrollments
              .filter((e) => e.sprint_classes)
              .map((e) => ({
                ...e.sprint_classes,
                enrollmentStatus: e.status,
              }))
          );
        }

        // Fetch teaching classes
        const { data: classesData } = await supabase
          .from('sprint_classes')
          .select(`
            *,
            class_enrollments (id)
          `)
          .eq('mentor_id', session.user.id);

        setTeachingClasses(classesData || []);

        // Fetch deliverables
        const { data: delivData } = await supabase
          .from('deliverables')
          .select('*')
          .eq('student_id', session.user.id);

        setUserDeliverables(delivData || []);

        // Fetch certificates
        const { data: certData } = await supabase
          .from('certificates')
          .select('*')
          .eq('mentor_id', session.user.id);

        setUserCertificates(certData || []);

      } catch (err: any) {
        console.error('Error loading profile:', err);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-20 text-center space-y-4">
        <div className="h-8 w-48 bg-zinc-800 rounded mx-auto animate-pulse" />
        <div className="h-64 bg-zinc-900/50 rounded-2xl animate-pulse" />
      </div>
    );
  }

  const mentorTier = (profile?.mentor_tier || 'JUNIOR_MENTOR') as FormalTier;
  const tierConfig = TIER_CONFIGS[mentorTier] || TIER_CONFIGS['JUNIOR_MENTOR'];
  const mentorXp = profile?.mentor_xp || 0;
  const nextTierProgress = getNextTierProgress(mentorXp, mentorTier);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      
      {/* Unified Profile Header Card */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          
          <div className="flex items-center gap-4">
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={profile?.name || 'User'}
                className="h-20 w-20 rounded-2xl object-cover border border-white/10 shadow-lg"
              />
              <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white ring-2 ring-[#09090b]">
                <CheckCircle2 className="h-3.5 w-3.5" />
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  {profile?.name || currentUser?.email?.split('@')[0] || 'Academic Member'}
                </h1>
                <span
                  className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-bold uppercase border ${tierConfig.badgeClass}`}
                >
                  <Sparkles className="h-2.5 w-2.5" />
                  {language === 'mn' ? tierConfig.titleMn : tierConfig.titleEn}
                </span>
              </div>

              <p className="text-xs text-zinc-400">
                {currentUser?.email}
              </p>

              <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400 pt-1">
                <span className="flex items-center gap-1">
                  <GraduationCap className="h-3.5 w-3.5 text-zinc-500" />
                  {profile?.grade || '11th Grade'} • {profile?.school || 'School'}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-zinc-500" />
                  {profile?.location || 'Ulaanbaatar'}
                </span>
              </div>
            </div>
          </div>

          {/* Actions & Metrics */}
          <div className="flex items-center gap-4 border-t sm:border-t-0 sm:border-l border-white/[0.08] pt-4 sm:pt-0 sm:pl-6">
            <div className="text-center px-2">
              <p className="text-[11px] font-medium text-zinc-400">{t('mentorXpLabel')}</p>
              <p className="text-lg font-bold text-blue-400">{mentorXp}</p>
            </div>
            <div className="text-center px-2">
              <p className="text-[11px] font-medium text-zinc-400">{t('studentsTaughtLabel')}</p>
              <p className="text-lg font-bold text-emerald-400">{profile?.total_students || 0}</p>
            </div>
            <div className="text-center px-2">
              <p className="text-[11px] font-medium text-zinc-400">{t('enrolledClassesLabel')}</p>
              <p className="text-lg font-bold text-white">{enrolledClasses.length}</p>
            </div>

            <Link
              href="/onboarding"
              className="btn-secondary p-2 rounded-lg text-xs"
              title={language === 'mn' ? 'Профайл засах' : 'Edit Profile'}
            >
              <Edit3 className="h-4 w-4" />
            </Link>
          </div>

        </div>

        {/* Specializations & Learning Goals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-5 border-t border-white/[0.06] text-xs">
          <div className="space-y-1.5">
            <span className="font-semibold text-zinc-400 text-[11px] uppercase tracking-wider">
              {t('canMentorLabel')}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(profile?.specializations || []).length > 0 ? (
                profile.specializations.map((spec: string) => (
                  <span
                    key={spec}
                    className="rounded-md bg-emerald-500/10 text-emerald-300 px-2 py-0.5 text-[11px] border border-emerald-500/20"
                  >
                    ✓ {spec}
                  </span>
                ))
              ) : (
                <span className="text-zinc-500 text-[11px]">
                  {language === 'mn' ? 'Заах сэдэв тохируулаагүй байна' : 'No mentoring subjects configured'}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="font-semibold text-zinc-400 text-[11px] uppercase tracking-wider">
              {t('learningGoalsLabel')}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(profile?.learning_goals || []).length > 0 ? (
                profile.learning_goals.map((goal: string) => (
                  <span
                    key={goal}
                    className="rounded-md bg-blue-500/10 text-blue-300 px-2 py-0.5 text-[11px] border border-blue-500/20"
                  >
                    ⚡ {goal}
                  </span>
                ))
              ) : (
                <span className="text-zinc-500 text-[11px]">
                  {language === 'mn' ? 'Сурах зорилт тохируулаагүй байна' : 'No learning goals set'}
                </span>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Dual-Identity View Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-white/[0.08] pb-1">
        <button
          onClick={() => setActiveTab('learning')}
          className={`px-4 py-2 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
            activeTab === 'learning'
              ? 'bg-white/[0.08] text-white'
              : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <BookOpen className="h-3.5 w-3.5" />
          <span>{t('profileMyLearning')}</span>
          <span className="rounded-full bg-zinc-800 px-1.5 py-0.2 text-[10px] font-semibold text-zinc-300">
            {enrolledClasses.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('mentoring')}
          className={`px-4 py-2 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
            activeTab === 'mentoring'
              ? 'bg-white/[0.08] text-white'
              : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <GraduationCap className="h-3.5 w-3.5" />
          <span>{t('profileMyMentoring')}</span>
          <span className="rounded-full bg-zinc-800 px-1.5 py-0.2 text-[10px] font-semibold text-zinc-300">
            {teachingClasses.length}
          </span>
        </button>
      </div>

      {/* TAB 1: Learner View */}
      {activeTab === 'learning' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">
              {language === 'mn' ? 'Элссэн спринт хичээлүүд' : 'Enrolled Sprint Classes'}
            </h2>
            <Link
              href="/classes"
              className="text-xs font-medium text-blue-400 hover:underline"
            >
              {language === 'mn' ? 'Бусад хичээл хайх →' : 'Browse More Classes →'}
            </Link>
          </div>

          {enrolledClasses.length === 0 ? (
            <div className="glass-panel rounded-2xl p-8 text-center text-xs text-zinc-500 border-dashed border-white/[0.08] space-y-3">
              <p>{language === 'mn' ? 'Та одоогоор ямар нэг спринт ангид элсээгүй байна.' : 'You are not currently enrolled in any sprint classes.'}</p>
              <Link
                href="/classes"
                className="btn-primary inline-block px-4 py-2 text-xs font-medium text-white rounded-lg"
              >
                {language === 'mn' ? 'Хичээл үзэх' : 'Find a Class to Join'}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {enrolledClasses.map((cls) => (
                <div
                  key={cls.id}
                  className="glass-panel-interactive rounded-2xl p-5 sm:p-6 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <span className="text-[11px] font-medium text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-md">
                      {cls.subject}
                    </span>
                    <h3 className="text-sm font-bold text-white">
                      {cls.title}
                    </h3>
                    <p className="text-xs text-zinc-400">
                      Mentor: <strong className="text-zinc-200">{cls.mentor_name}</strong> ({cls.mentor_school})
                    </p>
                    <p className="text-[11px] text-zinc-500">
                      {cls.schedule_summary}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                      <CheckCircle2 className="h-3 w-3" /> Enrolled
                    </span>
                    <Link
                      href={`/class/${cls.id}`}
                      className="btn-primary px-3 py-1.5 text-xs font-medium text-white rounded-lg"
                    >
                      {t('classSpaceBtn')} →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Submissions Section */}
          <div className="pt-6 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              {language === 'mn' ? 'Илгээсэн бүтээлүүд' : 'My Submitted Artifacts'}
            </h3>
            {userDeliverables.length === 0 ? (
              <p className="text-xs text-zinc-500">
                {language === 'mn' ? 'Бүтээл илгээгээгүй байна.' : 'No deliverables submitted yet.'}
              </p>
            ) : (
              <div className="space-y-2">
                {userDeliverables.map((del) => (
                  <div
                    key={del.id}
                    className="glass-panel rounded-xl p-4 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-semibold text-white">{del.title}</p>
                      <a
                        href={del.url_or_notes}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline text-[11px]"
                      >
                        {del.url_or_notes}
                      </a>
                    </div>
                    <span
                      className={`font-medium px-2 py-0.5 rounded-full text-[10px] ${
                        del.status === 'approved'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {del.status === 'approved' ? 'Certified ✓' : 'Under Review'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Mentor View */}
      {activeTab === 'mentoring' && (
        <div className="space-y-8">
          
          {/* Formal Tier Level-Up Card */}
          <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-6 border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.1)]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">
                  Formal Mentor Distinction Tier
                </span>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-amber-400" />
                  {language === 'mn' ? tierConfig.titleMn : tierConfig.titleEn}
                </h2>
                <p className="text-xs text-zinc-300">
                  {tierConfig.description}
                </p>
              </div>

              <div className="rounded-xl bg-zinc-900/80 border border-white/[0.08] px-4 py-2 backdrop-blur text-right">
                <p className="text-[10px] uppercase font-semibold text-zinc-400">Current XP</p>
                <p className="text-xl font-bold text-amber-300">{mentorXp} XP</p>
              </div>
            </div>

            {/* Progress Bar to Next Tier */}
            {nextTierProgress.nextTierConfig && (
              <div className="space-y-2 pt-2 border-t border-white/[0.06]">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-300">
                    Progress to{' '}
                    <strong className="text-white font-semibold">
                      {language === 'mn' ? nextTierProgress.nextTierConfig.titleMn : nextTierProgress.nextTierConfig.titleEn}
                    </strong>
                  </span>
                  <span className="text-amber-400 font-medium">
                    {nextTierProgress.progressPercent}% ({nextTierProgress.xpNeeded} XP needed)
                  </span>
                </div>

                <div className="h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-amber-400 transition-all"
                    style={{ width: `${nextTierProgress.progressPercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Classes Taught */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">
                {t('classesTeachingTitle')} ({teachingClasses.length})
              </h3>
              <Link
                href="/classes/create"
                className="btn-primary inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white rounded-lg"
              >
                <PlusCircle className="h-3.5 w-3.5" /> 
                <span>{language === 'mn' ? 'Хичээл нээх' : 'Open Class'}</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {teachingClasses.map((cls) => {
                const enrollCount = (cls.class_enrollments || []).length;
                return (
                  <div
                    key={cls.id}
                    className="glass-panel-interactive rounded-2xl p-5 sm:p-6 space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <span className="text-[11px] font-medium text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-md">
                        {cls.subject}
                      </span>
                      <h4 className="text-sm font-bold text-white">
                        {cls.title}
                      </h4>
                      <p className="text-xs text-zinc-400">
                        {language === 'mn' ? 'Сурагчид:' : 'Enrolled:'} <strong>{enrollCount} / {cls.max_seats}</strong>
                      </p>
                      <p className="text-[11px] text-zinc-500">
                        {cls.duration_weeks} Weeks ({cls.start_date} – {cls.end_date})
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                      <span className="text-xs text-zinc-400">
                        {cls.max_seats - enrollCount} seat(s) open
                      </span>
                      <Link
                        href={`/class/${cls.id}`}
                        className="btn-secondary px-3 py-1.5 text-xs font-medium rounded-lg"
                      >
                        {language === 'mn' ? 'Танхим руу орох →' : 'Manage Class →'}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ministry-Accredited Verifiable Certificates */}
          <div className="space-y-4 pt-6 border-t border-white/[0.08]">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>{t('ministryCertsTitle')}</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                {t('ministryCertsSub')}
              </p>
            </div>

            {userCertificates.length === 0 ? (
              <p className="text-xs text-zinc-500">
                {language === 'mn'
                  ? 'Сертификат гараагүй байна. Ангиа амжилттай удирдаж төгсгөн анхны сертификатаа аваарай!'
                  : 'No certificates issued yet. Complete a sprint cohort to earn your first verifiable credential!'}
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {userCertificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="glass-panel rounded-2xl p-5 space-y-3 border-amber-500/20"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-amber-400">
                        {cert.id}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[9px] font-bold uppercase text-amber-400">
                        Official Seal
                      </span>
                    </div>

                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white">
                        {cert.class_title}
                      </h4>
                      <p className="text-xs text-zinc-400 mt-1">
                        Total Hours: <strong>{cert.total_hours} hrs</strong> • Students: <strong>{cert.students_impacted}</strong>
                      </p>
                      <p className="text-[10px] font-mono text-zinc-500 truncate mt-1">
                        SHA-256: {cert.sha256_hash}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs">
                      <span className="text-[11px] text-zinc-500">
                        {cert.issued_date}
                      </span>
                      <Link
                        href={`/verify/${cert.id}`}
                        className="text-blue-400 hover:underline text-[11px] font-medium"
                      >
                        Verify ↗
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
