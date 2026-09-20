'use client';

import { useState, useEffect, useRef } from 'react';
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
  CheckCircle2, 
  ChevronRight,
  Sparkles,
  HelpCircle,
  Tag
} from 'lucide-react';

interface MissionDraft {
  weekNumber: number;
  title: string;
  description: string;
  deliverablePrompt: string;
}

const NATIONAL_SUBJECTS = [
  'Mathematics (Математик)',
  'Physics (Физик)',
  'Chemistry (Хими)',
  'Biology (Биологи)',
  'ICT (Мэдээлэл зүй)',
  'Mongolian Language (Монгол хэл, бичиг)',
  'English Language (Англи хэл)',
  'History & Social Science (Түүх, нийгэм судлал)',
  'Geography (Газар зүй)',
  'Art & Design (Дүрслэх урлаг, зураг төсөл)',
  'Music (Хөгжим)',
  'Physical Education (Биеийн тамир)'
];

const CAMBRIDGE_SUBJECTS = [
  'Mathematics (Cambridge IGCSE / AS / A-Level)',
  'Physics (Cambridge IGCSE / AS / A-Level)',
  'Chemistry (Cambridge IGCSE / AS / A-Level)',
  'Biology (Cambridge IGCSE / AS / A-Level)',
  'English Language (First / Second Language)',
  'ICT / Computer Science (Cambridge)',
  'Business Studies (Cambridge)',
  'History & Social Science (Cambridge)',
  'Geography (Cambridge)',
  'Chinese Language (Хятад хэл)',
  'Japanese Language (Япон хэл)',
  'Art & Design (Cambridge)',
  'Music (Cambridge)',
  'Physical Education'
];

const DAYS_OF_WEEK = [
  { key: 'Mon', mn: 'Дав', fullMn: 'Даваа' },
  { key: 'Tue', mn: 'Мяг', fullMn: 'Мягмар' },
  { key: 'Wed', mn: 'Лха', fullMn: 'Лхагва' },
  { key: 'Thu', mn: 'Пүр', fullMn: 'Пүрэв' },
  { key: 'Fri', mn: 'Баа', fullMn: 'Баасан' },
  { key: 'Sat', mn: 'Бям', fullMn: 'Бямба' },
  { key: 'Sun', mn: 'Ням', fullMn: 'Ням' },
];

const GRADE_OPTIONS = [
  '1–5-р анги (Бага анги)',
  '6–8-р анги (Суурь боловсрол)',
  '9–10-р анги (IGCSE / АДСБ)',
  '11–12-р анги (AS / A-Levels / Төгсөх анги)',
  'Бүх анги / Олимпиад',
  'Их сургууль / Бусад'
];

export default function CreateClassPage() {
  const router = useRouter();
  const { language } = useLanguage();

  const [loading, setLoading] = useState(false);
  const submittingRef = useRef(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [draftSaved, setDraftSaved] = useState(false);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Step 1: Overview
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [curriculum, setCurriculum] = useState<'National' | 'Cambridge'>('National');
  const [subject, setSubject] = useState('');
  const [recommendedGrade, setRecommendedGrade] = useState('9–10-р анги (IGCSE / АДСБ)');

  // Step 2: Seats & Schedule (All free, no price)
  const [maxSeats, setMaxSeats] = useState<number>(10);
  const [duration, setDuration] = useState<'3_days' | '1_week' | '2_weeks' | '4_weeks'>('2_weeks');
  const [selectedDays, setSelectedDays] = useState<string[]>(['Tue', 'Thu']);
  const [startTime, setStartTime] = useState('18:30');
  const [endTime, setEndTime] = useState('20:00');
  const [meetingLink, setMeetingLink] = useState('https://meet.google.com/new');
  const [enrollmentMode, setEnrollmentMode] = useState<'instant' | 'application'>('instant');

  // Step 3: Missions (Clear default on click / transparent placeholder)
  const [missions, setMissions] = useState<MissionDraft[]>([
    {
      weekNumber: 1,
      title: '',
      description: '',
      deliverablePrompt: '',
    },
    {
      weekNumber: 2,
      title: '',
      description: '',
      deliverablePrompt: '',
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

      // Restore draft
      try {
        const savedDraft = localStorage.getItem('mentormn_sprint_draft_v2');
        if (savedDraft) {
          const parsed = JSON.parse(savedDraft);
          if (parsed.title) setTitle(parsed.title);
          if (parsed.description) setDescription(parsed.description);
          if (parsed.subject) setSubject(parsed.subject);
          if (parsed.curriculum) setCurriculum(parsed.curriculum);
          if (parsed.recommendedGrade) setRecommendedGrade(parsed.recommendedGrade);
          if (parsed.maxSeats) setMaxSeats(parsed.maxSeats);
          if (parsed.duration) setDuration(parsed.duration);
          if (parsed.selectedDays) setSelectedDays(parsed.selectedDays);
          if (parsed.startTime) setStartTime(parsed.startTime);
          if (parsed.endTime) setEndTime(parsed.endTime);
          if (parsed.meetingLink) setMeetingLink(parsed.meetingLink);
          if (parsed.missions) setMissions(parsed.missions);
        }
      } catch (e) {
        console.warn('Could not restore draft');
      }
    }

    loadAuth();
  }, [router]);

  // Autosave draft
  useEffect(() => {
    if (!title && !subject && !description) return;
    const timeout = setTimeout(() => {
      const draft = {
        title,
        description,
        subject,
        curriculum,
        recommendedGrade,
        maxSeats,
        duration,
        selectedDays,
        startTime,
        endTime,
        meetingLink,
        missions,
      };
      localStorage.setItem('mentormn_sprint_draft_v2', JSON.stringify(draft));
      setDraftSaved(true);
      setTimeout(() => setDraftSaved(false), 2000);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [title, description, subject, curriculum, recommendedGrade, maxSeats, duration, selectedDays, startTime, endTime, meetingLink, missions]);

  // Adjust missions count when duration changes
  const handleDurationChange = (dur: '3_days' | '1_week' | '2_weeks' | '4_weeks') => {
    setDuration(dur);
    let count = 2;
    if (dur === '3_days') count = 1;
    else if (dur === '1_week') count = 1;
    else if (dur === '2_weeks') count = 2;
    else if (dur === '4_weeks') count = 4;

    setMissions((prev) => {
      const updated: MissionDraft[] = [];
      for (let i = 1; i <= count; i++) {
        const existing = prev[i - 1];
        updated.push({
          weekNumber: i,
          title: existing?.title || '',
          description: existing?.description || '',
          deliverablePrompt: existing?.deliverablePrompt || '',
        });
      }
      return updated;
    });
  };

  const toggleDay = (dayKey: string) => {
    setSelectedDays((prev) => 
      prev.includes(dayKey) ? prev.filter((d) => d !== dayKey) : [...prev, dayKey]
    );
  };

  const updateMission = (index: number, field: keyof MissionDraft, value: any) => {
    setMissions((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Build schedule summary string
  const formatScheduleSummary = () => {
    const dayNames = selectedDays.map((d) => DAYS_OF_WEEK.find((item) => item.key === d)?.fullMn || d).join(', ');
    return `${dayNames || 'Хуваарь сонгоогүй'}, ${startTime} - ${endTime} (MNT)`;
  };

  const durationWeeksNumber = duration === '3_days' ? 1 : duration === '1_week' ? 1 : duration === '2_weeks' ? 2 : 4;
  const durationLabel = duration === '3_days' ? '3 өдөр (3 Days)' : duration === '1_week' ? '1 долоо хоног (1 Week)' : duration === '2_weeks' ? '2 долоо хоног (2 Weeks)' : '4 долоо хоног (4 Weeks)';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submittingRef.current || loading) return;
    if (!currentUser || !title.trim() || !subject.trim()) {
      alert(language === 'mn' ? 'Сургалтын нэр болон хичээлийн чиглэлийг оруулна уу.' : 'Please enter sprint title and subject.');
      return;
    }

    submittingRef.current = true;
    setLoading(true);

    try {
      const mentorName = profile?.name || currentUser.user_metadata?.name || currentUser.email?.split('@')[0] || 'Mentor';
      const mentorSchool = profile?.school || 'Academic Mentor';
      const mentorTier = profile?.mentor_tier || 'JUNIOR_MENTOR';

      // Ensure missions have titles
      const formattedMissions = missions.map((m, idx) => ({
        weekNumber: m.weekNumber || idx + 1,
        title: m.title.trim() || (duration === '3_days' ? 'Sprint Mastery Challenge' : `Week ${idx + 1} Mastery Challenge`),
        description: m.description.trim() || 'Deep dive into topic fundamentals, problem solving, and synthesis.',
        deliverablePrompt: m.deliverablePrompt.trim() || 'Submit solved problem set PDF or project link.',
      }));

      const { data, error } = await supabase
        .from('sprint_classes')
        .insert({
          title: title.trim(),
          description: description.trim(),
          mentor_id: currentUser.id,
          mentor_name: mentorName,
          mentor_school: mentorSchool,
          mentor_tier: mentorTier,
          subject: subject.trim(),
          curriculum: curriculum === 'Cambridge' ? 'Cambridge Curriculum' : 'National Curriculum',
          max_seats: Math.max(1, Number(maxSeats) || 10),
          price_mnt: 0, // 100% Free!
          enrollment_mode: enrollmentMode,
          missions: formattedMissions,
          duration_weeks: durationWeeksNumber,
          schedule_summary: formatScheduleSummary(),
          meeting_link: meetingLink.trim() || 'https://meet.google.com/new',
          status: 'open',
        })
        .select()
        .single();

      if (error) throw error;

      localStorage.removeItem('mentormn_sprint_draft_v2');
      router.push(`/class/${data.id}`);
    } catch (err: any) {
      alert(err.message || 'Error creating sprint');
      submittingRef.current = false;
      setLoading(false);
    }
  };

  const subjectSuggestions = curriculum === 'Cambridge' ? CAMBRIDGE_SUBJECTS : NATIONAL_SUBJECTS;

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
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
              {language === 'mn' ? 'Шинэ хичээл зарлах' : 'Create a Free Sprint'}
            </h1>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              100% Үнэгүй / Free
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            {language === 'mn'
              ? 'Үндэсний болон Кембрижийн хөтөлбөрийн дагуу сурагчдад зориулсан бичил анги үүсгэх.'
              : 'Launch a peer mentorship cohort under National or Cambridge curriculum.'}
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
            {language === 'mn' ? 'Хөтөлбөр & Хичээл' : 'Curriculum & Subject'}
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
            {language === 'mn' ? 'Суудал & Хуваарь' : 'Seats & Timing'}
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
        
        {/* STEP 1: Curriculum & Subject */}
        {currentStep === 1 && (
          <div className="saas-card p-6 sm:p-8 space-y-6">
            <h2 className="text-base font-semibold text-zinc-900 border-b border-zinc-100 pb-3">
              {language === 'mn' ? '1. Хөтөлбөр ба хичээлийн мэдээлэл' : '1. Curriculum & Subject Details'}
            </h2>

            {/* Curriculum Selection */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-700">
                {language === 'mn' ? 'Хөтөлбөр сонгох' : 'Select Curriculum'} *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setCurriculum('National')}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    curriculum === 'National'
                      ? 'border-zinc-900 bg-zinc-900 text-white shadow-sm'
                      : 'border-zinc-200 bg-zinc-50/50 text-zinc-700 hover:bg-zinc-100'
                  }`}
                >
                  <div className="text-xs font-bold">National Curriculum</div>
                  <div className="text-[11px] opacity-80 mt-0.5">Үндэсний хөтөлбөр (Монгол хэл, Математик, Физик...)</div>
                </button>

                <button
                  type="button"
                  onClick={() => setCurriculum('Cambridge')}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    curriculum === 'Cambridge'
                      ? 'border-zinc-900 bg-zinc-900 text-white shadow-sm'
                      : 'border-zinc-200 bg-zinc-50/50 text-zinc-700 hover:bg-zinc-100'
                  }`}
                >
                  <div className="text-xs font-bold">Cambridge Curriculum</div>
                  <div className="text-[11px] opacity-80 mt-0.5">Кембриж хөтөлбөр (IGCSE / AS / A-Levels)</div>
                </button>
              </div>
            </div>

            {/* Subject Input (Text box as requested) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-zinc-700">
                  {language === 'mn' ? 'Хичээлийн чиглэл (Шууд бичих)' : 'Subject / Field (Text Input)'} *
                </label>
                <span className="text-[11px] text-zinc-400">
                  {language === 'mn' ? 'Өөрөө бичих эсвэл доороос дарж сонгох' : 'Type freely or click below'}
                </span>
              </div>
              <input
                type="text"
                required
                placeholder={language === 'mn' ? 'Жишээ нь: Mathematics (Математик) эсвэл Cambridge A-Level Physics' : 'e.g. Mathematics, Physics, ICT...'}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="saas-input text-sm font-medium"
              />

              {/* Clickable Quick Suggestions */}
              <div className="space-y-1 pt-1">
                <span className="text-[11px] font-medium text-zinc-400 block">
                  {curriculum === 'Cambridge' ? 'Кембрижийн хичээлүүд:' : 'Үндэсний хөтөлбөрийн хичээлүүд:'}
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1 bg-zinc-50 rounded-lg border border-zinc-100">
                  {subjectSuggestions.map((subItem) => (
                    <button
                      key={subItem}
                      type="button"
                      onClick={() => setSubject(subItem)}
                      className={`text-[11px] px-2.5 py-1 rounded-md transition-colors ${
                        subject === subItem
                          ? 'bg-zinc-900 text-white font-semibold'
                          : 'bg-white text-zinc-700 border border-zinc-200/80 hover:bg-zinc-100'
                      }`}
                    >
                      {subItem}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Sprint Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-700">
                {language === 'mn' ? 'Сургалтын нэр' : 'Sprint Title'} *
              </label>
              <input
                type="text"
                required
                placeholder={language === 'mn' ? 'Жишээ нь: Cambridge A-Level Math: Calculus & Mechanics Бэлтгэл' : 'e.g. Cambridge A-Level Math: Calculus & Mechanics'}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="saas-input"
              />
            </div>

            {/* Recommended Target Grade */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-700">
                {language === 'mn' ? 'Зорилтот анги (Хэддүгээр ангийн сурагчид хамрагдвал зохих)' : 'Recommended Target Grade'} *
              </label>
              <select
                value={recommendedGrade}
                onChange={(e) => setRecommendedGrade(e.target.value)}
                className="saas-input"
              >
                {GRADE_OPTIONS.map((gr) => (
                  <option key={gr} value={gr}>{gr}</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-700">
                {language === 'mn' ? 'Сургалтын зорилго, дэлгэрэнгүй тайлбар' : 'Detailed Goals & Overview'}
              </label>
              <textarea
                rows={3}
                placeholder={language === 'mn' 
                  ? 'Энэхүү сургалтаар ямар сэдвүүдийг үзэж, сурагчид юуг эзэмших вэ?' 
                  : 'What will students master during this sprint?'}
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
                <span>{language === 'mn' ? 'Дараах: Суудал & Хуваарь' : 'Next: Seats & Timing'}</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Seats & Timing (No price, custom seats) */}
        {currentStep === 2 && (
          <div className="saas-card p-6 sm:p-8 space-y-6">
            <h2 className="text-base font-semibold text-zinc-900 border-b border-zinc-100 pb-3">
              {language === 'mn' ? '2. Суудлын тоо ба цагийн хуваарь' : '2. Cohort Seats & Schedule'}
            </h2>

            {/* Flexible Seat Count (No 10-seat limit) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-zinc-700">
                  {language === 'mn' ? 'Суудлын тоо (Хүссэн тоогоо оруулна уу)' : 'Total Seat Capacity'} *
                </label>
                <span className="text-xs font-bold text-zinc-900">
                  {maxSeats} {language === 'mn' ? 'суудал' : 'seats'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={maxSeats}
                  onChange={(e) => setMaxSeats(Math.max(1, Number(e.target.value)))}
                  className="saas-input w-32 font-bold text-base"
                />
                <div className="flex flex-wrap gap-1.5">
                  {[1, 3, 5, 10, 15, 20, 30].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setMaxSeats(num)}
                      className={`px-2.5 py-1 text-xs rounded-md border ${
                        maxSeats === num
                          ? 'bg-zinc-900 text-white font-semibold border-zinc-900'
                          : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-[11px] text-zinc-500">
                {language === 'mn' ? 'Хичээлийн зорилгоос хамааран ганцаарчилсан эсвэл бүлэг ангийн тоогоо сонгоно.' : 'Set any number of seats suitable for your mentorship style.'}
              </p>
            </div>

            {/* Duration Options: 3 Days, 1 Week, 2 Weeks, 4 Weeks */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-700">
                {language === 'mn' ? 'Үргэлжлэх хугацаа' : 'Duration'} *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { key: '3_days', mn: '3 өдөр', en: '3 Days' },
                  { key: '1_week', mn: '1 долоо хоног', en: '1 Week' },
                  { key: '2_weeks', mn: '2 долоо хоног', en: '2 Weeks' },
                  { key: '4_weeks', mn: '4 долоо хоног', en: '4 Weeks' },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => handleDurationChange(item.key as any)}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      duration === item.key
                        ? 'border-zinc-900 bg-zinc-900 text-white shadow-sm font-semibold'
                        : 'border-zinc-200 bg-zinc-50/50 text-zinc-700 hover:bg-zinc-100'
                    }`}
                  >
                    <div className="text-xs">{language === 'mn' ? item.mn : item.en}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Easy Day of Week Selector */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-zinc-700">
                {language === 'mn' ? 'Хичээллэх гаригууд' : 'Class Days'} *
              </label>
              <div className="flex flex-wrap gap-2">
                {DAYS_OF_WEEK.map((d) => {
                  const active = selectedDays.includes(d.key);
                  return (
                    <button
                      key={d.key}
                      type="button"
                      onClick={() => toggleDay(d.key)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        active
                          ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
                          : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100'
                      }`}
                    >
                      {d.fullMn}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Pickers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-700">
                  {language === 'mn' ? 'Эхлэх цаг' : 'Start Time'}
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="saas-input"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-700">
                  {language === 'mn' ? 'Дуусах цаг' : 'End Time'}
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="saas-input"
                />
              </div>
            </div>

            {/* Live Meeting Link */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-700">
                {language === 'mn' ? 'Google Meet холбоос' : 'Google Meet Link'}
              </label>
              <input
                type="url"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                className="saas-input"
              />
            </div>

            {/* Schedule Summary Preview */}
            <div className="rounded-lg bg-zinc-50 p-3 border border-zinc-200/70 text-xs text-zinc-600">
              <span className="font-semibold text-zinc-900">{language === 'mn' ? 'Хуваарийн тойм:' : 'Schedule summary:'} </span>
              {formatScheduleSummary()} ({durationLabel})
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

        {/* STEP 3: Weekly Missions (Clear-on-click placeholder feature) */}
        {currentStep === 3 && (
          <div className="saas-card p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div>
                <h2 className="text-base font-semibold text-zinc-900">
                  {language === 'mn' ? '3. Даалгавар & Бүтээлийн төлөвлөгөө' : '3. Missions & Deliverables Roadmap'}
                </h2>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {language === 'mn'
                    ? 'Сурагчдын гүйцэтгэх даалгаврыг оруулна уу. (Жишээ текст дээр дарахад автоматаар арилна)'
                    : 'Specify weekly deliverables. Example placeholders clear automatically when clicked.'}
                </p>
              </div>
              <span className="badge-accent text-xs">
                {missions.length} {duration === '3_days' ? 'Day Challenge' : 'Milestones'}
              </span>
            </div>

            {/* Missions List */}
            <div className="space-y-5">
              {missions.map((m, idx) => (
                <div key={idx} className="rounded-xl border border-zinc-200 p-5 space-y-4 bg-zinc-50/40">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-900">
                      {duration === '3_days' ? 'Day 1–3 Challenge' : `Week ${m.weekNumber}`}
                    </span>
                    <span className="text-[11px] font-medium text-zinc-500">
                      Milestone {idx + 1}
                    </span>
                  </div>

                  {/* Mission Title */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-zinc-600">
                      {language === 'mn' ? 'Сэдэв / Гарчиг' : 'Mission Title'}
                    </label>
                    <input
                      type="text"
                      placeholder={`e.g. ${subject || 'Topic'} Foundational Problem Set & Diagnostics`}
                      value={m.title}
                      onChange={(e) => updateMission(idx, 'title', e.target.value)}
                      className="saas-input"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-zinc-600">
                      {language === 'mn' ? 'Тайлбар' : 'Description'}
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Review definitions, solve baseline practice problems, and annotate key mistakes."
                      value={m.description}
                      onChange={(e) => updateMission(idx, 'description', e.target.value)}
                      className="saas-input text-xs"
                    />
                  </div>

                  {/* Deliverable Prompt */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-zinc-700">
                      🎯 {language === 'mn' ? 'Илгээх шаардлагатай бүтээл (Deliverable)' : 'Required Deliverable'}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Submit solved handwritten PDF or Google Drive folder"
                      value={m.deliverablePrompt}
                      onChange={(e) => updateMission(idx, 'deliverablePrompt', e.target.value)}
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
                disabled={loading || !title.trim() || !subject.trim()}
                className="btn-primary px-6 py-2.5 text-xs font-medium text-white shadow-sm flex items-center gap-2"
              >
                {loading ? (
                  <span>{language === 'mn' ? 'Нийтэлж байна...' : 'Publishing...'}</span>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    <span>{language === 'mn' ? 'Хичээлийг зарлах' : 'Publish Sprint'}</span>
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
