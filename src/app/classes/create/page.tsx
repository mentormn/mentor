'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { useLanguage } from '@/lib/i18n';
import { 
  GraduationCap, 
  Users, 
  Calendar, 
  Video, 
  Clock, 
  BookOpen, 
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Coins,
  Shield,
  Plus,
  Trash2
} from 'lucide-react';

interface MissionDraft {
  weekNumber: number;
  title: string;
  description: string;
  deliverablePrompt: string;
}

export default function CreateClassPage() {
  const router = useRouter();
  const { language, t } = useLanguage();

  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('Mathematics');
  const [curriculum, setCurriculum] = useState('Cambridge AS/A-Level');
  const [maxSeats, setMaxSeats] = useState<number>(4);
  const [durationWeeks, setDurationWeeks] = useState<number>(2);
  const [priceMnt, setPriceMnt] = useState<number>(0);
  const [enrollmentMode, setEnrollmentMode] = useState<'instant' | 'application'>('instant');
  const [startDate, setStartDate] = useState('2026-09-25');
  const [endDate, setEndDate] = useState('2026-10-09');
  const [scheduleSummary, setScheduleSummary] = useState('Tuesdays & Thursdays, 18:30 - 20:00 (MNT)');
  const [meetingLink, setMeetingLink] = useState('https://meet.google.com/new');

  // Weekly missions state
  const [missions, setMissions] = useState<MissionDraft[]>([
    {
      weekNumber: 1,
      title: 'Foundational Proofs & Problem Set',
      description: 'Review core definitions and tackle the baseline diagnostic challenges together.',
      deliverablePrompt: 'Submit solved PDF or photos of your handwritten problem set solutions.',
    },
    {
      weekNumber: 2,
      title: 'Advanced Applied Sprint Project',
      description: 'Synthesize concepts into an applied project or past competition paper review.',
      deliverablePrompt: 'Submit working GitHub repo link or annotated final project writeup.',
    },
  ]);

  useEffect(() => {
    async function loadAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        router.push('/login?redirectTo=/classes/create');
        return;
      }
      setCurrentUser(session.user);

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (data) setProfile(data);
    }

    loadAuth();
  }, [router]);

  // Synchronize mission count with durationWeeks
  const handleDurationChange = (weeks: number) => {
    setDurationWeeks(weeks);
    setMissions((prev) => {
      const newMissions = [...prev];
      if (weeks > prev.length) {
        for (let i = prev.length + 1; i <= weeks; i++) {
          newMissions.push({
            weekNumber: i,
            title: `Week ${i} Mastery Challenge`,
            description: 'Deep dive into advanced topics and real-world synthesis.',
            deliverablePrompt: 'Submit deliverable link or code artifact.',
          });
        }
      } else if (weeks < prev.length) {
        return newMissions.slice(0, weeks);
      }
      return newMissions;
    });
  };

  const updateMission = (index: number, field: keyof MissionDraft, value: any) => {
    setMissions((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !title.trim()) return;
    setLoading(true);

    try {
      const mentorName = profile?.name || currentUser.user_metadata?.name || currentUser.email?.split('@')[0] || 'Mentor';
      const mentorSchool = profile?.school || 'Academic Mentor';
      const mentorTier = profile?.mentor_tier || 'JUNIOR_MENTOR';

      const { data, error } = await supabase
        .from('sprint_classes')
        .insert({
          title,
          description,
          mentor_id: currentUser.id,
          mentor_name: mentorName,
          mentor_school: mentorSchool,
          mentor_tier: mentorTier,
          subject,
          curriculum,
          max_seats: maxSeats,
          price_mnt: priceMnt,
          enrollment_mode: enrollmentMode,
          missions: missions,
          duration_weeks: durationWeeks,
          start_date: startDate,
          end_date: endDate,
          schedule_summary: scheduleSummary,
          meeting_link: meetingLink,
          status: 'open',
        })
        .select()
        .single();

      if (error) throw error;

      router.push(`/class/${data.id}`);
    } catch (err: any) {
      alert(err.message || 'Error creating sprint class');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      
      {/* Back button */}
      <div>
        <Link
          href="/classes"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> 
          <span>{language === 'mn' ? 'Хичээлүүдийн жагсаалт руу буцах' : 'Back to Classes Directory'}</span>
        </Link>
      </div>

      {/* Header */}
      <div className="space-y-2 border-b border-white/[0.08] pb-6">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-400">
          <GraduationCap className="h-3.5 w-3.5" />
          <span>{language === 'mn' ? 'Менторын хичээл үүсгэх танхим' : 'Mentor Class Creation Studio'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          {t('createTitle')}
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400">
          {t('createSub')}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Topic Title */}
        <div className="glass-panel rounded-2xl p-5 space-y-3">
          <label className="text-xs font-semibold text-zinc-200 block">
            {t('fieldTitle')}
          </label>
          <input
            type="text"
            required
            placeholder={language === 'mn' 
              ? 'Жишээ: Кембрижийн Математик: Дифференциал ба Хөдөлгөөний механик'
              : 'e.g. Cambridge AS Mathematics: Differentiation Mastery & Mechanics'}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-white/[0.08] bg-zinc-900/60 p-3 text-xs text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Subject & Curriculum */}
        <div className="glass-panel rounded-2xl p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-200 block">
                {t('fieldSubject')}
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full rounded-xl border border-white/[0.08] bg-zinc-900/60 p-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Informatics">Informatics & Olympiad</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Robotics">Robotics & Engineering</option>
                <option value="English">Academic English</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-200 block">
                {t('fieldCurriculum')}
              </label>
              <select
                value={curriculum}
                onChange={(e) => setCurriculum(e.target.value)}
                className="w-full rounded-xl border border-white/[0.08] bg-zinc-900/60 p-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="Cambridge AS/A-Level">Cambridge AS/A-Level</option>
                <option value="Mongolian 12-Year">Mongolian 12-Year General Standard</option>
                <option value="National Olympiad">National Olympiad Preparation</option>
                <option value="IB Diploma">IB Diploma</option>
                <option value="Practical Engineering">Practical Project / Engineering</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-semibold text-zinc-200 block">
              {t('fieldDesc')}
            </label>
            <textarea
              rows={3}
              required
              placeholder={language === 'mn'
                ? 'Хичээлийн явцад ямар бодлогуудыг шийдвэрлэх, сурагчид ямар бодит бүтээл (код, бодсон бодлогын эмхэтгэл, эссэ) хийж гүйцэтгэхийг тайлбарлана уу...'
                : 'Explain what problems you will solve together, and what tangible artifact students will complete by the end of the sprint...'}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-white/[0.08] bg-zinc-900/60 p-3 text-xs text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Capacity, Pricing & Enrollment Mode */}
        <div className="glass-panel rounded-2xl p-5 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-zinc-200 flex items-center gap-1.5">
                <Users className="h-4 w-4 text-blue-400" />
                <span>{t('fieldSeats')}:</span>
                <span className="text-blue-400 font-bold">{maxSeats} {maxSeats === 1 ? 'Seat' : 'Seats'}</span>
              </label>
              <span className="text-zinc-500">
                {maxSeats === 1 ? '1-on-1' : maxSeats <= 3 ? 'Micro-Pod (Recommended)' : 'Small Cohort'}
              </span>
            </div>

            <input
              type="range"
              min={1}
              max={10}
              step={1}
              value={maxSeats}
              onChange={(e) => setMaxSeats(Number(e.target.value))}
              className="w-full accent-blue-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-white/[0.06]">
            {/* Price */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                <Coins className="h-3.5 w-3.5 text-amber-400" />
                <span>{t('fieldPrice')}</span>
              </label>
              <input
                type="number"
                min={0}
                step={5000}
                value={priceMnt}
                onChange={(e) => setPriceMnt(Number(e.target.value))}
                placeholder="0 for Free"
                className="w-full rounded-xl border border-white/[0.08] bg-zinc-900/60 p-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Mode */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-200 block">
                {t('fieldEnrollmentMode')}
              </label>
              <select
                value={enrollmentMode}
                onChange={(e) => setEnrollmentMode(e.target.value as any)}
                className="w-full rounded-xl border border-white/[0.08] bg-zinc-900/60 p-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="instant">{t('modeInstant')}</option>
                <option value="application">{t('modeApplication')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Duration & Schedule */}
        <div className="glass-panel rounded-2xl p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-200 block">
                {t('fieldDuration')}
              </label>
              <select
                value={durationWeeks}
                onChange={(e) => handleDurationChange(Number(e.target.value))}
                className="w-full rounded-xl border border-white/[0.08] bg-zinc-900/60 p-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
              >
                <option value={1}>1 Week (Intensive)</option>
                <option value={2}>2 Weeks (Standard Sprint)</option>
                <option value={3}>3 Weeks (Deep Mastery)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-200 block">
                {t('fieldStartDate')}
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-xl border border-white/[0.08] bg-zinc-900/60 p-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-200 block">
                {t('fieldEndDate')}
              </label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-xl border border-white/[0.08] bg-zinc-900/60 p-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-200 block">
                {t('fieldSchedule')}
              </label>
              <input
                type="text"
                required
                value={scheduleSummary}
                onChange={(e) => setScheduleSummary(e.target.value)}
                className="w-full rounded-xl border border-white/[0.08] bg-zinc-900/60 p-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-200 block">
                {t('fieldMeetingLink')}
              </label>
              <input
                type="url"
                required
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                className="w-full rounded-xl border border-white/[0.08] bg-zinc-900/60 p-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Weekly Mission Milestones Builder */}
        <div className="glass-panel rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-400" />
              <h2 className="text-xs font-semibold text-white">
                {t('sectionMissions')} ({missions.length} {language === 'mn' ? 'Долоо хоног' : 'Weeks'})
              </h2>
            </div>
          </div>

          <div className="space-y-4">
            {missions.map((m, idx) => (
              <div key={idx} className="rounded-xl border border-white/[0.06] bg-zinc-900/40 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-400">
                    {language === 'mn' ? `${idx + 1}-р Долоо хоногийн даалгавар` : `Week ${idx + 1} Mission`}
                  </span>
                </div>

                <div className="space-y-2">
                  <input
                    type="text"
                    required
                    placeholder={t('missionTitle')}
                    value={m.title}
                    onChange={(e) => updateMission(idx, 'title', e.target.value)}
                    className="w-full rounded-lg border border-white/[0.08] bg-zinc-900/60 p-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                  />
                  <textarea
                    rows={2}
                    required
                    placeholder={t('missionDesc')}
                    value={m.description}
                    onChange={(e) => updateMission(idx, 'description', e.target.value)}
                    className="w-full rounded-lg border border-white/[0.08] bg-zinc-900/60 p-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    required
                    placeholder={t('missionDeliverable')}
                    value={m.deliverablePrompt}
                    onChange={(e) => updateMission(idx, 'deliverablePrompt', e.target.value)}
                    className="w-full rounded-lg border border-white/[0.08] bg-zinc-900/60 p-2 text-xs text-zinc-300 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3.5 rounded-xl text-xs font-semibold text-white shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="animate-pulse">{language === 'mn' ? 'Үүсгэж байна...' : 'Publishing...'}</span>
            ) : (
              <>
                <span>{t('publishBtn')}</span>
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
}
