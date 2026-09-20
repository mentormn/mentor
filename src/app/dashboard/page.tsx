'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useLanguage } from '@/lib/i18n';
import { 
  BookOpen, 
  Video, 
  Calendar, 
  Clock, 
  Users, 
  Award, 
  PlusCircle, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  ExternalLink,
  GraduationCap,
  ChevronRight,
  TrendingUp,
  FileCheck,
  Compass
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { language, t } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [enrolledClasses, setEnrolledClasses] = useState<any[]>([]);
  const [teachingClasses, setTeachingClasses] = useState<any[]>([]);
  const [recentDeliverables, setRecentDeliverables] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          router.push('/login?redirectTo=/dashboard');
          return;
        }
        setCurrentUser(session.user);

        // 1. Fetch Profile
        const { data: profData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        if (profData) setProfile(profData);

        // 2. Fetch Enrolled Sprints with full sprint details
        const { data: enrollments } = await supabase
          .from('class_enrollments')
          .select(`
            id,
            class_id,
            status,
            enrolled_at,
            sprint_classes (
              id,
              title,
              subject,
              mentor_name,
              mentor_school,
              schedule_summary,
              duration_weeks,
              meeting_link,
              status,
              missions
            )
          `)
          .eq('student_id', session.user.id);

        if (enrollments) {
          setEnrolledClasses(
            enrollments
              .filter((e: any) => e.sprint_classes)
              .map((e: any) => ({
                ...e.sprint_classes,
                enrollmentStatus: e.status,
                enrollmentId: e.id,
              }))
          );
        }

        // 3. Fetch Teaching Sprints (if user is a mentor)
        const { data: teachingData } = await supabase
          .from('sprint_classes')
          .select(`
            *,
            class_enrollments (id, student_id, status)
          `)
          .eq('mentor_id', session.user.id)
          .order('created_at', { ascending: false });

        if (teachingData) {
          setTeachingClasses(teachingData);
        }

        // 4. Fetch Deliverables
        const { data: delivData } = await supabase
          .from('deliverables')
          .select('*')
          .eq('student_id', session.user.id)
          .order('submitted_at', { ascending: false })
          .limit(5);

        if (delivData) setRecentDeliverables(delivData);

        // 5. Fetch Certificates
        const { data: certData } = await supabase
          .from('certificates')
          .select('*')
          .eq('mentor_id', session.user.id);

        if (certData) setCertificates(certData);

      } catch (err: any) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [router]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-6">
        <div className="h-8 w-64 bg-zinc-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-zinc-100 rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-96 bg-zinc-100 rounded-2xl animate-pulse" />
          <div className="h-96 bg-zinc-100 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  const userName = profile?.name || currentUser?.user_metadata?.name || currentUser?.email?.split('@')[0] || 'Scholar';
  const isMentor = profile?.role === 'mentor' || teachingClasses.length > 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      
      {/* Top Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-zinc-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
              {language === 'mn' ? `Сайн байна уу, ${userName}` : `Welcome back, ${userName}`}
            </h1>
            <span className="badge-accent text-xs">
              {profile?.school || (isMentor ? 'Mentor' : 'Student')}
            </span>
          </div>
          <p className="text-sm text-zinc-500 mt-1">
            {language === 'mn'
              ? 'Таны идэвхтэй ангиуд, хуваарьт хичээлүүд болон хичээлийн явц.'
              : 'Your active cohorts, upcoming live sessions, and progress at a glance.'}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/classes"
            className="btn-secondary inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-zinc-800"
          >
            <Compass className="h-4 w-4 text-zinc-600" />
            {language === 'mn' ? 'Анги хайх' : 'Explore Sprints'}
          </Link>
          <Link
            href="/classes/create"
            className="btn-primary inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-white"
          >
            <PlusCircle className="h-4 w-4" />
            {language === 'mn' ? 'Анги нээх' : 'Create Sprint'}
          </Link>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        
        {/* Metric 1: Active Cohorts */}
        <div className="saas-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              {language === 'mn' ? 'Идэвхтэй ангиуд' : 'Enrolled Sprints'}
            </span>
            <span className="rounded-lg bg-blue-50 p-2 text-blue-700">
              <BookOpen className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-zinc-900">
              {enrolledClasses.length}
            </span>
            <span className="text-xs text-zinc-500">
              {language === 'mn' ? 'суралцаж буй' : 'cohorts'}
            </span>
          </div>
        </div>

        {/* Metric 2: Teaching Sprints */}
        <div className="saas-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              {language === 'mn' ? 'Хөтөлж буй ангиуд' : 'Teaching Sprints'}
            </span>
            <span className="rounded-lg bg-emerald-50 p-2 text-emerald-700">
              <GraduationCap className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-zinc-900">
              {teachingClasses.length}
            </span>
            <span className="text-xs text-zinc-500">
              {language === 'mn' ? 'үүсгэсэн' : 'active'}
            </span>
          </div>
        </div>

        {/* Metric 3: Submitted Deliverables */}
        <div className="saas-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              {language === 'mn' ? 'Илгээсэн даалгавар' : 'Completed Missions'}
            </span>
            <span className="rounded-lg bg-purple-50 p-2 text-purple-700">
              <CheckCircle2 className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-zinc-900">
              {recentDeliverables.length}
            </span>
            <span className="text-xs text-zinc-500">
              {language === 'mn' ? 'батлагдсан' : 'submitted'}
            </span>
          </div>
        </div>

        {/* Metric 4: Academic Standing / Certificates */}
        <div className="saas-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              {language === 'mn' ? 'Сертификат / Зэрэг' : 'Verified Certificates'}
            </span>
            <span className="rounded-lg bg-amber-50 p-2 text-amber-700">
              <Award className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-zinc-900">
              {certificates.length || (profile?.mentor_tier ? '1' : '0')}
            </span>
            <span className="text-xs text-emerald-700 font-medium">
              {profile?.mentor_tier || 'Academic'}
            </span>
          </div>
        </div>

      </div>

      {/* Main Grid: Left Cohorts & Right Schedule/Deliverables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Active Sprints */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="saas-card overflow-hidden">
            <div className="border-b border-zinc-200 bg-zinc-50/50 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-zinc-900">
                  {language === 'mn' ? 'Миний суралцаж буй ангиуд' : 'My Active Cohorts'}
                </h2>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {language === 'mn' 
                    ? 'Танхим руу нэвтрэх, даалгавар илгээх болон ментортой шууд холбогдох' 
                    : 'Access cohort space, submit weekly deliverables, and join live sessions'}
                </p>
              </div>
              <Link href="/classes" className="text-xs font-medium text-blue-600 hover:text-blue-700 inline-flex items-center gap-1">
                {language === 'mn' ? 'Бүх ангиуд' : 'Browse All'}
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-zinc-200">
              {enrolledClasses.length === 0 ? (
                <div className="p-12 text-center space-y-4">
                  <div className="h-12 w-12 rounded-full bg-zinc-100 text-zinc-400 flex items-center justify-center mx-auto">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-900">
                      {language === 'mn' ? 'Одоогоор идэвхтэй анги байхгүй байна' : 'No active cohorts yet'}
                    </h3>
                    <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                      {language === 'mn'
                        ? '1-10 сурагчтай бичил ангиудаас сонгон олимпиад, шалгалтын бэлтгэлээ эхлүүлээрэй.'
                        : 'Enroll in small-group sprints (1-10 seats) to prepare for competitions and standardized tests.'}
                    </p>
                  </div>
                  <Link
                    href="/classes"
                    className="btn-primary inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-white"
                  >
                    <Compass className="h-4 w-4" />
                    {language === 'mn' ? 'Ангиудыг үзэх' : 'Explore Sprints'}
                  </Link>
                </div>
              ) : (
                enrolledClasses.map((cls) => (
                  <div key={cls.id} className="p-6 hover:bg-zinc-50/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="badge-accent text-xs">
                          {cls.subject}
                        </span>
                        <span className="text-xs text-zinc-400">•</span>
                        <span className="text-xs font-medium text-zinc-600">
                          {cls.mentor_name} ({cls.mentor_school})
                        </span>
                      </div>

                      <h3 className="text-base font-semibold text-zinc-900">
                        <Link href={`/class/${cls.id}`} className="hover:text-blue-600 transition-colors">
                          {cls.title}
                        </Link>
                      </h3>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                          <span>{cls.schedule_summary}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-zinc-400" />
                          <span>{cls.duration_weeks} {language === 'mn' ? 'долоо хоног' : 'weeks'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      {cls.meeting_link && (
                        <a
                          href={cls.meeting_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-secondary inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100"
                        >
                          <Video className="h-3.5 w-3.5" />
                          <span>{language === 'mn' ? 'Хичээлд орох' : 'Join Meet'}</span>
                        </a>
                      )}
                      <Link
                        href={`/class/${cls.id}`}
                        className="btn-primary inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white"
                      >
                        <span>{language === 'mn' ? 'Танхим' : 'Open Space'}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Teaching Cohorts Section (if mentor) */}
          {teachingClasses.length > 0 && (
            <div className="saas-card overflow-hidden">
              <div className="border-b border-zinc-200 bg-zinc-50/50 px-6 py-4 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-zinc-900">
                    {language === 'mn' ? 'Миний удирдаж буй ангиуд' : 'Sprints You are Mentoring'}
                  </h2>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {language === 'mn'
                      ? 'Сурагчдын ирц, даалгавар шалгах болон танхимын хэлэлцүүлэг'
                      : 'Review submissions, manage cohort roster, and lead live sessions'}
                  </p>
                </div>
                <Link href="/classes/create" className="text-xs font-medium text-blue-600 hover:text-blue-700 inline-flex items-center gap-1">
                  {language === 'mn' ? '+ Шинэ анги' : '+ New Sprint'}
                </Link>
              </div>

              <div className="divide-y divide-zinc-200">
                {teachingClasses.map((cls) => {
                  const confirmedStudents = cls.class_enrollments?.filter((e: any) => e.status === 'confirmed') || [];
                  return (
                    <div key={cls.id} className="p-6 hover:bg-zinc-50/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="badge-accent text-xs">
                            {cls.subject}
                          </span>
                          <span className="text-xs text-zinc-400">•</span>
                          <span className="text-xs font-medium text-zinc-600">
                            {confirmedStudents.length} / {cls.max_seats} {language === 'mn' ? 'сурагч' : 'students'}
                          </span>
                        </div>

                        <h3 className="text-base font-semibold text-zinc-900">
                          <Link href={`/class/${cls.id}`} className="hover:text-blue-600 transition-colors">
                            {cls.title}
                          </Link>
                        </h3>

                        <div className="flex items-center gap-4 text-xs text-zinc-500">
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-zinc-400" />
                            <span>{cls.schedule_summary}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Award className="h-3.5 w-3.5 text-zinc-400" />
                            <span>{cls.price_mnt ? `${cls.price_mnt.toLocaleString()} ₮` : (language === 'mn' ? 'Үнэгүй' : 'Free')}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0">
                        {cls.meeting_link && (
                          <a
                            href={cls.meeting_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-secondary inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-zinc-700"
                          >
                            <Video className="h-3.5 w-3.5 text-emerald-600" />
                            <span>{language === 'mn' ? 'Шууд уулзалт' : 'Launch Meet'}</span>
                          </a>
                        )}
                        <Link
                          href={`/class/${cls.id}`}
                          className="btn-primary inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white"
                        >
                          <span>{language === 'mn' ? 'Танхим' : 'Manage'}</span>
                          <ChevronRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Right 1 Column: Schedule, Progress & Academic Proof */}
        <div className="space-y-6">
          
          {/* Quick Schedule Card */}
          <div className="saas-card p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h3 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                {language === 'mn' ? 'Ойрын хуваарь' : 'Upcoming Sessions'}
              </h3>
              <span className="text-[11px] font-medium text-zinc-400">GMT+8</span>
            </div>

            {enrolledClasses.length === 0 && teachingClasses.length === 0 ? (
              <p className="text-xs text-zinc-500 py-3 text-center">
                {language === 'mn' ? 'Төлөвлөгдсөн хичээл байхгүй байна.' : 'No scheduled sessions yet.'}
              </p>
            ) : (
              <div className="space-y-3">
                {[...enrolledClasses, ...teachingClasses].slice(0, 3).map((item, idx) => (
                  <div key={idx} className="rounded-xl border border-zinc-100 bg-zinc-50/50 p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-zinc-800 truncate max-w-[180px]">
                        {item.title}
                      </span>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                        Live
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-zinc-500">
                      <span>{item.schedule_summary}</span>
                      {item.meeting_link && (
                        <a
                          href={item.meeting_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-0.5"
                        >
                          Meet <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Academic Proof / Verification Card */}
          <div className="saas-card p-6 space-y-4 bg-gradient-to-b from-white to-zinc-50/50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center">
                <Award className="h-5 w-5 text-amber-300" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-zinc-900">
                  {language === 'mn' ? 'Улсын хэмжээний баталгаажуулалт' : 'Official Credentials'}
                </h3>
                <p className="text-xs text-zinc-500">
                  {language === 'mn' ? 'БШУЯ & И-Монголиа холболттой' : 'Verifiable Academic Records'}
                </p>
              </div>
            </div>

            <p className="text-xs text-zinc-600 leading-relaxed">
              {language === 'mn'
                ? 'Таны амжилттай дүүргэсэн анги, гүйцэтгэсэн бүтээлүүд нь олон улсын их сургуулиудад хүчинтэй баталгаажсан профайл болно.'
                : 'Every completed sprint and verified deliverable builds a tamper-proof academic track record for college admissions.'}
            </p>

            <div className="pt-2">
              <Link
                href="/profile"
                className="btn-secondary w-full py-2 text-xs font-medium text-zinc-800 text-center flex items-center justify-center gap-2"
              >
                <span>{language === 'mn' ? 'Миний профайл & Батламж' : 'View Profile & Badges'}</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
