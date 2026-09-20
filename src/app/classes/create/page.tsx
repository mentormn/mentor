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
  Plus,
  Trash2,
  Save,
  HelpCircle,
  ChevronRight,
  Eye
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
  const [draftSaved, setDraftSaved] = useState(false);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

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

  // Load user & restore draft
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

      // Restore draft from localStorage if present
      try {
        const savedDraft = localStorage.getItem('mentormn_sprint_draft');
        if (savedDraft) {
          const parsed = JSON.parse(savedDraft);
          if (parsed.title) setTitle(parsed.title);
          if (parsed.description) setDescription(parsed.description);
          if (parsed.subject) setSubject(parsed.subject);
          if (parsed.curriculum) setCurriculum(parsed.curriculum);
          if (parsed.maxSeats) setMaxSeats(parsed.maxSeats);
          if (parsed.durationWeeks) setDurationWeeks(parsed.durationWeeks);
          if (parsed.priceMnt !== undefined) setPriceMnt(parsed.priceMnt);
          if (parsed.scheduleSummary) setScheduleSummary(parsed.scheduleSummary);
          if (parsed.meetingLink) setMeetingLink(parsed.meetingLink);
          if (parsed.missions) setMissions(parsed.missions);
        }
      } catch (e) {
        console.warn('Could not restore draft from localStorage');
      }
    }

    loadAuth();
  }, [router]);

  // Autosave to localStorage on changes
  useEffect(() => {
    if (!title && !description) return;
    const timeout = setTimeout(() => {
      const draft = {
        title,
        description,
        subject,
        curriculum,
        maxSeats,
        durationWeeks,
        priceMnt,
        scheduleSummary,
        meetingLink,
        missions,
      };
      localStorage.setItem('mentormn_sprint_draft', JSON.stringify(draft));
      setDraftSaved(true);
      setTimeout(() => setDraftSaved(false), 2000);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [title, description, subject, curriculum, maxSeats, durationWeeks, priceMnt, scheduleSummary, meetingLink, missions]);

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
            description: 'Deep dive into advanced topics, problem-solving, and real-world synthesis.',
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

      // Clear draft after successful creation
      localStorage.removeItem('mentormn_sprint_draft');
      router.push(`/class/${data.id}`);
    } catch (err: any) {
      alert(err.message || 'Error creating sprint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-6">
        <div>
          <Link
            href="/classes"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {language === 'mn' ? 'Ангийн жагсаалт руу буцах' : 'Back to Sprints'}
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
            {language === 'mn' ? 'Шинэ бичил анги үүсгэх' : 'Create a Micro-Sprint'}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            {language === 'mn'
              ? '1-10 сурагчтай зорилтот сургалт зарлаж, өөрийн мэдлэг туршлагаа түгээгээрэй.'
              : 'Launch a high-impact, 1-4 week cohort with 1-10 seats and weekly proof deliverables.'}
          </p>
        </div>

        {/* Draft Auto-saved Indicator */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {draftSaved && (
            <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
              <CheckCircle2 className="h-3 w-3" />
              {language === 'mn' ? 'Ноорог хадгалагдлаа' : 'Draft autosaved'}
            </span>
          )}
        </div>
      </div>

      {/* Step Indicators */}
      <div className="grid grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => setCurrentStep(1)}
          className={`p-3 rounded-xl border text-left transition-all ${
            currentStep === 1
              ? 'border-zinc-900 bg-zinc-900 text-white shadow-sm'
              : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50'
          }`}
        >
          <div className="text-[10px] uppercase font-semibold tracking-wider opacity-80">
            Step 1
          </div>
          <div className="text-xs font-bold mt-0.5">
            {language === 'mn' ? 'Үндсэн мэдээлэл' : 'Overview & Subject'}
          </div>
        </button>

        <button
          type="button"
          onClick={() => setCurrentStep(2)}
          className={`p-3 rounded-xl border text-left transition-all ${
            currentStep === 2
              ? 'border-zinc-900 bg-zinc-900 text-white shadow-sm'
              : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50'
          }`}
        >
          <div className="text-[10px] uppercase font-semibold tracking-wider opacity-80">
            Step 2
          </div>
          <div className="text-xs font-bold mt-0.5">
            {language === 'mn' ? 'Суудал & Хуваарь' : 'Seats & Logistics'}
          </div>
        </button>

        <button
          type="button"
          onClick={() => setCurrentStep(3)}
          className={`p-3 rounded-xl border text-left transition-all ${
            currentStep === 3
              ? 'border-zinc-900 bg-zinc-900 text-white shadow-sm'
              : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50'
          }`}
        >
          <div className="text-[10px] uppercase font-semibold tracking-wider opacity-80">
            Step 3
          </div>
          <div className="text-xs font-bold mt-0.5">
            {language === 'mn' ? 'Даалгаврууд (Missions)' : 'Weekly Missions'}
          </div>
        </button>
      </div>

      {/* Main Creation Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Step 1: Overview & Subject */}
        {currentStep === 1 && (
          <div className="saas-card p-6 sm:p-8 space-y-6">
            <h2 className="text-base font-semibold text-zinc-900 border-b border-zinc-100 pb-3">
              {language === 'mn' ? '1. Сургалтын ерөнхий агуулга' : '1. Sprint Overview'}
            </h2>

            {/* Sprint Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-700">
                {language === 'mn' ? 'Сургалтын нэр' : 'Sprint Title'} *
              </label>
              <input
                type="text"
                required
                placeholder={language === 'mn' ? 'Жишээ нь: Cambridge A-Level Math: Calculus & Mechanics' : 'e.g. Cambridge A-Level Math: Calculus & Mechanics'}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="saas-input"
              />
            </div>

            {/* Subject & Curriculum Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-700">
                  {language === 'mn' ? 'Хичээлийн чиглэл' : 'Subject Field'}
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="saas-input"
                >
                  <option value="Mathematics">Mathematics (Математик)</option>
                  <option value="Physics">Physics (Физик)</option>
                  <option value="Computer Science">Computer Science (Компьютер / МТ)</option>
                  <option value="Informatics">Informatics (Мэдээлэл зүй / Алгоритм)</option>
                  <option value="Chemistry">Chemistry (Хими)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-700">
                  {language === 'mn' ? 'Хөтөлбөрийн түвшин' : 'Curriculum Standard'}
                </label>
                <select
                  value={curriculum}
                  onChange={(e) => setCurriculum(e.target.value)}
                  className="saas-input"
                >
                  <option value="Cambridge AS/A-Level">Cambridge AS/A-Level</option>
                  <option value="SAT / AP Advanced">SAT / AP Advanced</option>
                  <option value="National Olympiad (Улсын Олимпиад)">National Olympiad (Улсын Олимпиад)</option>
                  <option value="General Academic (Ерөнхий)">General Academic (Ерөнхий)</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-700">
                {language === 'mn' ? 'Сургалтын зорилго, дэлгэрэнгүй тайлбар' : 'Detailed Syllabus & Goals'}
              </label>
              <textarea
                rows={4}
                placeholder={language === 'mn' 
                  ? 'Сурагчид энэ сургалтаар юу сурч, ямар бодит үр дүнд хүрэх вэ?' 
                  : 'What will students master? What diagnostic problems will be solved?'}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="saas-input"
              />
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="btn-primary px-5 py-2 text-xs font-medium text-white inline-flex items-center gap-1.5"
              >
                <span>{language === 'mn' ? 'Дараах: Суудал & Хуваарь' : 'Next: Seats & Logistics'}</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Seats, Economics & Logistics */}
        {currentStep === 2 && (
          <div className="saas-card p-6 sm:p-8 space-y-6">
            <h2 className="text-base font-semibold text-zinc-900 border-b border-zinc-100 pb-3">
              {language === 'mn' ? '2. Суудал, хуваарь ба төлбөр' : '2. Seats, Logistics & Tuition'}
            </h2>

            {/* Max Seats Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-zinc-700">
                  {language === 'mn' ? 'Дээд суудлын тоо (1-10)' : 'Cohort Capacity (1-10 Seats)'}
                </label>
                <span className="text-xs font-semibold text-zinc-900">
                  {maxSeats === 1 
                    ? '1-on-1 (Ганцаарчилсан)' 
                    : maxSeats <= 3 
                    ? `Micro-Pod (${maxSeats} сурагч)` 
                    : `Small Cohort (${maxSeats} сурагч)`}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={maxSeats}
                onChange={(e) => setMaxSeats(Number(e.target.value))}
                className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-900"
              />
              <p className="text-[11px] text-zinc-500">
                {language === 'mn'
                  ? 'Чанартай заах үүднээс нэг ангид дээд тал нь 10 сурагч сурах боломжтой.'
                  : 'Capped at 10 students maximum to ensure rigorous 1-on-1 mentorship and feedback.'}
              </p>
            </div>

            {/* Duration & Price */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-700">
                  {language === 'mn' ? 'Үргэлжлэх хугацаа (долоо хоног)' : 'Duration (Weeks)'}
                </label>
                <select
                  value={durationWeeks}
                  onChange={(e) => handleDurationChange(Number(e.target.value))}
                  className="saas-input"
                >
                  <option value={1}>1 Week (Хурдавчилсан)</option>
                  <option value={2}>2 Weeks (Спринт)</option>
                  <option value={3}>3 Weeks (Гүнзгийрүүлсэн)</option>
                  <option value={4}>4 Weeks (Бүрэн хөтөлбөр)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-700">
                  {language === 'mn' ? 'Төлбөр (MNT, 0 бол үнэгүй)' : 'Tuition (MNT, 0 for Free)'}
                </label>
                <input
                  type="number"
                  step="5000"
                  min="0"
                  value={priceMnt}
                  onChange={(e) => setPriceMnt(Number(e.target.value))}
                  className="saas-input"
                />
              </div>
            </div>

            {/* Schedule Summary & Meet Link */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-700">
                  {language === 'mn' ? 'Хичээллэх хуваарь' : 'Schedule Summary'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Tue & Thu, 18:30 - 20:00 (MNT)"
                  value={scheduleSummary}
                  onChange={(e) => setScheduleSummary(e.target.value)}
                  className="saas-input"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-700">
                  {language === 'mn' ? 'Google Meet / Zoom холбоос' : 'Live Meeting Link'}
                </label>
                <input
                  type="url"
                  placeholder="https://meet.google.com/..."
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  className="saas-input"
                />
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="btn-secondary px-4 py-2 text-xs font-medium text-zinc-700"
              >
                {language === 'mn' ? 'Буцах' : 'Back'}
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="btn-primary px-5 py-2 text-xs font-medium text-white inline-flex items-center gap-1.5"
              >
                <span>{language === 'mn' ? 'Дараах: Даалгаврууд' : 'Next: Weekly Missions'}</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Weekly Missions Roadmap */}
        {currentStep === 3 && (
          <div className="saas-card p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div>
                <h2 className="text-base font-semibold text-zinc-900">
                  {language === 'mn' ? '3. Долоо хоногийн даалгавар (Missions)' : '3. Weekly Missions Roadmap'}
                </h2>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {language === 'mn'
                    ? 'Сурагчид долоо хоног бүр шалгуулах бодит бүтээл, бодлогын даалгавар.'
                    : 'Each week must culminate in a verifiable deliverable (solved problem set, paper, code).'}
                </p>
              </div>
              <span className="badge-accent text-xs">
                {missions.length} {language === 'mn' ? 'долоо хоног' : 'weeks'}
              </span>
            </div>

            {/* Missions List */}
            <div className="space-y-5">
              {missions.map((m, idx) => (
                <div key={idx} className="rounded-xl border border-zinc-200 p-5 space-y-4 bg-zinc-50/40">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-900">
                      Week {m.weekNumber}
                    </span>
                    <span className="text-[11px] font-medium text-zinc-500">
                      Milestone {idx + 1}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-zinc-600">
                      {language === 'mn' ? 'Сэдэв / Гарчиг' : 'Mission Title'}
                    </label>
                    <input
                      type="text"
                      value={m.title}
                      onChange={(e) => updateMission(idx, 'title', e.target.value)}
                      className="saas-input"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-zinc-600">
                      {language === 'mn' ? 'Тайлбар' : 'Description & Scope'}
                    </label>
                    <textarea
                      rows={2}
                      value={m.description}
                      onChange={(e) => updateMission(idx, 'description', e.target.value)}
                      className="saas-input text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-zinc-700">
                      🎯 {language === 'mn' ? 'Илгээх шаардлагатай бүтээл (Deliverable)' : 'Required Deliverable Prompt'}
                    </label>
                    <input
                      type="text"
                      value={m.deliverablePrompt}
                      onChange={(e) => updateMission(idx, 'deliverablePrompt', e.target.value)}
                      placeholder="e.g. Submit solved handwritten PDF or GitHub repository"
                      className="saas-input"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Submit & Publish CTA */}
            <div className="flex items-center justify-between pt-6 border-t border-zinc-200">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="btn-secondary px-4 py-2 text-xs font-medium text-zinc-700"
              >
                {language === 'mn' ? 'Буцах' : 'Back'}
              </button>

              <button
                type="submit"
                disabled={loading || !title.trim()}
                className="btn-primary px-6 py-2.5 text-xs font-medium text-white shadow-sm flex items-center gap-2"
              >
                {loading ? (
                  <span>{language === 'mn' ? 'Нийтэлж байна...' : 'Publishing...'}</span>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    <span>{language === 'mn' ? 'Спринт ангийг нийтлэх' : 'Publish Sprint Cohort'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </form>

    </div>
  );
}
