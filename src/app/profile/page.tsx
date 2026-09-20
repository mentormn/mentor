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
  MapPin, 
  Calendar, 
  CheckCircle2, 
  PlusCircle, 
  ShieldCheck, 
  ExternalLink,
  Clock,
  Edit3,
  Video,
  ChevronRight,
  FileCheck,
  Phone
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

  const [activeTab, setActiveTab] = useState<'learning' | 'mentoring' | 'credentials'>('learning');
  const [isEditing, setIsEditing] = useState(false);
  const [editSchool, setEditSchool] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editGrade, setEditGrade] = useState('10-р анги');
  const [editCurriculums, setEditCurriculums] = useState<string[]>(['National']);
  const [editBio, setEditBio] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

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

        if (profData) {
          setProfile(profData);
          setEditSchool(profData.school || '');
          setEditLocation(profData.location || '');
          setEditPhone(profData.phone || '');
          setEditGrade(profData.grade || '10-р анги');
          setEditCurriculums(profData.curriculums || ['National']);
          setEditBio(profData.bio || '');
        }

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
              price_mnt,
              meeting_link
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

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          school: editSchool,
          location: editLocation,
          phone: editPhone,
          grade: editGrade,
          curriculums: editCurriculums,
          bio: editBio,
          updated_at: new Date().toISOString(),
        })
        .eq('id', currentUser.id);

      if (error) throw error;

      setProfile({
        ...profile,
        school: editSchool,
        location: editLocation,
        phone: editPhone,
        grade: editGrade,
        curriculums: editCurriculums,
        bio: editBio,
      });
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Error updating profile');
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 space-y-6">
        <div className="h-40 saas-card bg-zinc-100 animate-pulse" />
        <div className="h-96 saas-card bg-zinc-100 animate-pulse" />
      </div>
    );
  }

  const mentorTier = (profile?.mentor_tier || 'JUNIOR_MENTOR') as FormalTier;
  const tierConfig = TIER_CONFIGS[mentorTier] || TIER_CONFIGS['JUNIOR_MENTOR'];
  const mentorXp = profile?.mentor_xp || 0;
  const nextTierProgress = getNextTierProgress(mentorXp, mentorTier);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      
      {/* Top Profile Header Card */}
      <div className="saas-card p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-2xl shadow-sm">
              {profile?.name ? profile.name.charAt(0) : currentUser?.email?.charAt(0).toUpperCase()}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900">
                  {profile?.name || currentUser?.email?.split('@')[0]}
                </h1>
                <span className="badge-accent text-xs">
                  {profile?.role === 'mentor' ? 'Verified Mentor' : 'Student Scholar'}
                </span>
                {profile?.grade && (
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700">
                    {profile.grade}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500">
                <span className="flex items-center gap-1">
                  <GraduationCap className="h-3.5 w-3.5 text-zinc-400" />
                  {profile?.school || 'Secondary School'}
                </span>
                {profile?.phone && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-zinc-700 font-mono">
                      <Phone className="h-3 w-3 text-zinc-400" />
                      {profile.phone}
                    </span>
                  </>
                )}
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-zinc-400" />
                  {profile?.location || 'Ulaanbaatar, Mongolia'}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="btn-secondary px-3.5 py-2 text-xs font-medium text-zinc-700 inline-flex items-center gap-1.5"
          >
            <Edit3 className="h-3.5 w-3.5 text-zinc-500" />
            <span>{isEditing ? (language === 'mn' ? 'Хаах' : 'Cancel') : (language === 'mn' ? 'Мэдээлэл засах' : 'Edit Profile')}</span>
          </button>
        </div>

        {/* Edit Profile Form */}
        {isEditing && (
          <form onSubmit={handleSaveProfile} className="pt-4 border-t border-zinc-200 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-700">
                  {language === 'mn' ? 'Сургууль / Их сургууль' : 'School / University'}
                </label>
                <input
                  type="text"
                  value={editSchool}
                  onChange={(e) => setEditSchool(e.target.value)}
                  className="saas-input"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-700">
                  {language === 'mn' ? 'Утасны дугаар' : 'Phone Number'}
                </label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="9911-XXXX"
                  className="saas-input font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-700">
                  {language === 'mn' ? 'Анги' : 'Grade'}
                </label>
                <select
                  value={editGrade}
                  onChange={(e) => setEditGrade(e.target.value)}
                  className="saas-input bg-white"
                >
                  {['6-р анги', '7-р анги', '8-р анги', '9-р анги', '10-р анги', '11-р анги', '12-р анги'].map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-700">
                  {language === 'mn' ? 'Байршил / Аймаг, Дүүрэг' : 'Location / District'}
                </label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="saas-input"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-700">
                {language === 'mn' ? 'Товч танилцуулга' : 'Bio & Academic Goals'}
              </label>
              <textarea
                rows={2}
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                className="saas-input"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="btn-primary px-4 py-2 text-xs font-medium text-white"
              >
                {language === 'mn' ? 'Хадгалах' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}

        {/* Mentor Tier & Standing Bar (if mentor) */}
        {profile?.role === 'mentor' && (
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-amber-600" />
                <span className="text-xs font-bold text-zinc-900">
                  {language === 'mn' ? tierConfig.titleMn : tierConfig.titleEn}
                </span>
                <span className="text-[11px] text-zinc-500">
                  ({mentorXp} XP)
                </span>
              </div>
              <span className="text-xs font-semibold text-zinc-700">
                Next: {nextTierProgress.nextTier?.replace('_', ' ')}
              </span>
            </div>

            <div className="h-1.5 w-full rounded-full bg-zinc-200 overflow-hidden">
              <div
                className="h-full rounded-full bg-zinc-900 transition-all"
                style={{ width: `${Math.min(100, Math.max(5, nextTierProgress.progressPercent))}%` }}
              />
            </div>
          </div>
        )}

      </div>

      {/* Tabs */}
      <div className="border-b border-zinc-200 flex items-center gap-6">
        <button
          onClick={() => setActiveTab('learning')}
          className={`pb-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'learning'
              ? 'border-zinc-900 text-zinc-900'
              : 'border-transparent text-zinc-500 hover:text-zinc-800'
          }`}
        >
          <BookOpen className="h-4 w-4" />
          <span>{language === 'mn' ? 'Суралцсан түүх' : 'Learning & Sprints'}</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600">
            {enrolledClasses.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('mentoring')}
          className={`pb-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'mentoring'
              ? 'border-zinc-900 text-zinc-900'
              : 'border-transparent text-zinc-500 hover:text-zinc-800'
          }`}
        >
          <GraduationCap className="h-4 w-4" />
          <span>{language === 'mn' ? 'Хөтөлсөн ангиуд' : 'Teaching & Sprints'}</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600">
            {teachingClasses.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('credentials')}
          className={`pb-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'credentials'
              ? 'border-zinc-900 text-zinc-900'
              : 'border-transparent text-zinc-500 hover:text-zinc-800'
          }`}
        >
          <ShieldCheck className="h-4 w-4" />
          <span>{language === 'mn' ? 'Батламж & Баталгаажуулалт' : 'Official Credentials'}</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600">
            {userCertificates.length || 1}
          </span>
        </button>
      </div>

      {/* Tab 1: Learning & Sprints */}
      {activeTab === 'learning' && (
        <div className="space-y-6">
          <div className="saas-card overflow-hidden">
            <div className="border-b border-zinc-200 bg-zinc-50/50 px-6 py-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-900">
                {language === 'mn' ? 'Суралцаж буй ангиуд' : 'Enrolled Sprint Cohorts'}
              </h3>
              <Link href="/classes" className="text-xs font-medium text-blue-600 hover:underline">
                {language === 'mn' ? 'Шинэ анги хайх →' : 'Explore Sprints →'}
              </Link>
            </div>

            <div className="divide-y divide-zinc-200">
              {enrolledClasses.length === 0 ? (
                <p className="text-xs text-zinc-500 p-8 text-center">
                  {language === 'mn' ? 'Одоогоор бүртгэлтэй анги байхгүй байна.' : 'No enrolled sprint classes yet.'}
                </p>
              ) : (
                enrolledClasses.map((cls) => (
                  <div key={cls.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="badge-accent text-xs">
                          {cls.subject}
                        </span>
                        <span className="text-xs text-zinc-400">•</span>
                        <span className="text-xs font-medium text-zinc-600">
                          {cls.mentor_name}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-zinc-900">
                        {cls.title}
                      </h4>
                      <p className="text-xs text-zinc-500 flex items-center gap-3">
                        <span>{cls.schedule_summary}</span>
                        <span>•</span>
                        <span>{cls.duration_weeks} weeks</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/class/${cls.id}`}
                        className="btn-primary px-3.5 py-1.5 text-xs font-medium text-white flex items-center gap-1"
                      >
                        <span>{language === 'mn' ? 'Танхим' : 'Open Space'}</span>
                        <ChevronRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Submitted Deliverables Status */}
          <div className="saas-card overflow-hidden">
            <div className="border-b border-zinc-200 bg-zinc-50/50 px-6 py-4">
              <h3 className="text-sm font-semibold text-zinc-900">
                {language === 'mn' ? 'Илгээсэн даалгаврууд & Үнэлгээ' : 'Deliverables & Verified Submissions'}
              </h3>
            </div>

            <div className="divide-y divide-zinc-200">
              {userDeliverables.length === 0 ? (
                <p className="text-xs text-zinc-500 p-8 text-center">
                  {language === 'mn' ? 'Илгээсэн бүтээл байхгүй байна.' : 'No deliverables submitted yet.'}
                </p>
              ) : (
                userDeliverables.map((deliv) => (
                  <div key={deliv.id} className="p-5 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-zinc-900">
                        Week {deliv.week_number}: {deliv.title}
                      </div>
                      <div className="text-[11px] text-zinc-500 mt-0.5">
                        Submitted on {new Date(deliv.submitted_at).toLocaleDateString()}
                      </div>
                      {deliv.mentor_feedback && (
                        <p className="text-xs text-zinc-700 bg-zinc-50 p-2 rounded-lg mt-2 border border-zinc-100">
                          💬 Mentor Feedback: {deliv.mentor_feedback}
                        </p>
                      )}
                    </div>

                    <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                      deliv.status === 'verified'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {deliv.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Teaching & Sprints */}
      {activeTab === 'mentoring' && (
        <div className="saas-card overflow-hidden">
          <div className="border-b border-zinc-200 bg-zinc-50/50 px-6 py-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-zinc-900">
              {language === 'mn' ? 'Миний үүсгэсэн сургалтууд' : 'Sprints You are Mentoring'}
            </h3>
            <Link href="/classes/create" className="text-xs font-medium text-blue-600 hover:underline">
              {language === 'mn' ? '+ Шинэ анги нээх' : '+ Launch Sprint'}
            </Link>
          </div>

          <div className="divide-y divide-zinc-200">
            {teachingClasses.length === 0 ? (
              <p className="text-xs text-zinc-500 p-8 text-center">
                {language === 'mn' ? 'Та одоогоор ямар нэгэн анги хөтлөөгүй байна.' : 'You have not created any sprint classes yet.'}
              </p>
            ) : (
              teachingClasses.map((cls) => (
                <div key={cls.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="badge-accent text-xs">
                      {cls.subject}
                    </span>
                    <h4 className="text-sm font-semibold text-zinc-900">
                      {cls.title}
                    </h4>
                    <p className="text-xs text-zinc-500">
                      {cls.schedule_summary} • {cls.max_seats} seats max
                    </p>
                  </div>

                  <Link
                    href={`/class/${cls.id}`}
                    className="btn-primary px-3.5 py-1.5 text-xs font-medium text-white flex items-center gap-1"
                  >
                    <span>{language === 'mn' ? 'Танхим' : 'Manage Cohort'}</span>
                    <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Official Credentials */}
      {activeTab === 'credentials' && (
        <div className="space-y-6">
          <div className="saas-card p-6 sm:p-8 space-y-6 bg-gradient-to-b from-white to-zinc-50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center">
                <ShieldCheck className="h-5 w-5 text-amber-300" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-zinc-900">
                  {language === 'mn' ? 'Улсын хэмжээний баталгаажсан дижитал батламж' : 'Verifiable National Academic Credential'}
                </h3>
                <p className="text-xs text-zinc-500">
                  {language === 'mn' ? 'БШУЯ, Олон улсын олимпиадын хороо & Их дээд сургуулиудад хүчинтэй' : 'Standardized verifiable record for university applications'}
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    Credential Certificate ID
                  </span>
                  <div className="text-base font-mono font-bold text-zinc-900 mt-0.5">
                    MN-ACAD-2026-0091
                  </div>
                </div>
                <span className="badge-accent text-xs">
                  Active & Verified
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-zinc-600 border-t border-zinc-100 pt-4">
                <div>
                  <span className="text-zinc-400 block">{language === 'mn' ? 'Эзэмшигч:' : 'Recipient:'}</span>
                  <span className="font-semibold text-zinc-900">{profile?.name || currentUser?.email}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block">{language === 'mn' ? 'Байгууллага / Сургууль:' : 'Institution:'}</span>
                  <span className="font-semibold text-zinc-900">{profile?.school || 'Mentor.mn National Network'}</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/verify/demo"
                  className="btn-secondary w-full py-2 text-xs font-medium text-zinc-800 text-center flex items-center justify-center gap-2"
                >
                  <span>{language === 'mn' ? 'Нийтийн баталгаажуулах хуудсыг харах' : 'View Public Verification Page'}</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
