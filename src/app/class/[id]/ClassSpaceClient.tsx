'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { useLanguage } from '@/lib/i18n';
import { TIER_CONFIGS } from '@/lib/engine/tierProgression';
import { FormalTier, Mission, SprintDiscussion } from '@/lib/types';
import { 
  GraduationCap, 
  Video, 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle2, 
  Upload, 
  Sparkles, 
  ExternalLink, 
  ArrowLeft,
  Flame,
  PlusCircle,
  FileCheck,
  MessageSquare,
  Send,
  Coins,
  ShieldCheck,
  Award
} from 'lucide-react';

export default function ClassSpaceClient({ classId }: { classId: string }) {
  const { language, t } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [currentClass, setCurrentClass] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [deliverables, setDeliverables] = useState<any[]>([]);
  const [discussions, setDiscussions] = useState<SprintDiscussion[]>([]);

  // Interactive states
  const [activeTab, setActiveTab] = useState<'missions' | 'discussions' | 'roster'>('missions');
  const [deliverableTitle, setDeliverableTitle] = useState('');
  const [deliverableUrl, setDeliverableUrl] = useState('');
  const [mentorFeedbackMap, setMentorFeedbackMap] = useState<{ [key: string]: string }>({});
  const [newMessage, setNewMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setCurrentUser(session.user);
        const { data: prof } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        if (prof) setProfile(prof);
      }

      // Fetch class details
      const { data: clsData, error: clsError } = await supabase
        .from('sprint_classes')
        .select('*')
        .eq('id', classId)
        .single();

      if (clsError) throw clsError;
      setCurrentClass(clsData);

      // Fetch enrollments
      const { data: enrollData } = await supabase
        .from('class_enrollments')
        .select(`
          id,
          student_id,
          status,
          enrolled_at,
          profiles (
            id,
            name,
            school,
            grade,
            location,
            avatar_url
          )
        `)
        .eq('class_id', classId);

      setEnrollments(enrollData || []);

      // Fetch deliverables
      const { data: delivData } = await supabase
        .from('deliverables')
        .select('*')
        .eq('class_id', classId)
        .order('submitted_at', { ascending: false });

      setDeliverables(delivData || []);

      // Fetch discussions
      const { data: discData } = await supabase
        .from('sprint_discussions')
        .select('*')
        .eq('class_id', classId)
        .order('created_at', { ascending: true });

      if (discData) {
        setDiscussions(discData.map((d: any) => ({
          id: d.id,
          classId: d.class_id,
          userId: d.user_id,
          userName: d.user_name,
          userAvatar: d.user_avatar,
          isMentor: d.is_mentor,
          content: d.content,
          createdAt: d.created_at,
        })));
      }

    } catch (err: any) {
      console.error('Error loading class space:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [classId]);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-20 text-center space-y-4">
        <div className="h-8 w-48 bg-zinc-800 rounded mx-auto animate-pulse" />
        <div className="h-64 bg-zinc-900/50 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (!currentClass) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center space-y-4">
        <h1 className="text-xl font-bold text-white">Class Not Found</h1>
        <p className="text-xs text-zinc-400">The requested sprint class does not exist or has ended.</p>
        <Link href="/classes" className="btn-primary inline-block px-4 py-2 text-xs font-medium text-white rounded-lg">
          Back to Directory
        </Link>
      </div>
    );
  }

  const isMentor = currentUser && currentClass.mentor_id === currentUser.id;
  const isEnrolled = currentUser && enrollments.some((e) => e.student_id === currentUser.id);
  const seatsLeft = currentClass.max_seats - enrollments.length;
  const tierKey = (currentClass.mentor_tier || 'JUNIOR_MENTOR') as FormalTier;
  const tierConfig = TIER_CONFIGS[tierKey] || TIER_CONFIGS['JUNIOR_MENTOR'];

  const userDeliverable = currentUser && deliverables.find((d) => d.student_id === currentUser.id);
  const missionsList: Mission[] = currentClass.missions && Array.isArray(currentClass.missions) && currentClass.missions.length > 0
    ? currentClass.missions
    : [
        {
          weekNumber: 1,
          title: 'Foundational Proofs & Core Diagnostic',
          description: currentClass.description,
          deliverablePrompt: 'Submit initial proof set or codebase repository.',
        },
      ];

  const handleEnroll = async () => {
    if (!currentUser) {
      window.location.href = `/login?redirectTo=/class/${classId}`;
      return;
    }

    try {
      const { error } = await supabase
        .from('class_enrollments')
        .insert({
          class_id: classId,
          student_id: currentUser.id,
          status: currentClass.enrollment_mode === 'instant' ? 'confirmed' : 'pending',
        });

      if (error) throw error;
      setNotification(
        currentClass.enrollment_mode === 'instant'
          ? (language === 'mn' ? 'Суудал амжилттай захиалагдлаа!' : 'Seat successfully claimed!')
          : (language === 'mn' ? 'Хүсэлт илгээгдлээ. Ментор шалгах болно.' : 'Application submitted for review.')
      );
      loadData();
      setTimeout(() => setNotification(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Enrollment error');
    }
  };

  const handleSubmitDeliverable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !deliverableTitle.trim() || !deliverableUrl.trim()) return;
    setSubmitting(true);

    try {
      const studentName = profile?.name || currentUser.user_metadata?.name || currentUser.email?.split('@')[0] || 'Student';

      const { error } = await supabase
        .from('deliverables')
        .insert({
          class_id: classId,
          student_id: currentUser.id,
          student_name: studentName,
          title: deliverableTitle,
          url_or_notes: deliverableUrl,
          status: 'pending',
        });

      if (error) throw error;

      setDeliverableTitle('');
      setDeliverableUrl('');
      setNotification(language === 'mn' ? 'Бүтээл амжилттай илгээгдлээ!' : 'Deliverable submitted for mentor review!');
      loadData();
      setTimeout(() => setNotification(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Error submitting deliverable');
    } finally {
      setSubmitting(false);
    }
  };

  const handleApproveDeliverable = async (deliverableId: string) => {
    const feedback = mentorFeedbackMap[deliverableId] || 'Deliverable verified meeting national mastery standards.';
    try {
      const { error } = await supabase
        .from('deliverables')
        .update({
          status: 'approved',
          mentor_feedback: feedback,
          approved_at: new Date().toISOString(),
        })
        .eq('id', deliverableId);

      if (error) throw error;

      setNotification(language === 'mn' ? 'Бүтээл баталгаажлаа! XP нэмэгдлээ.' : 'Deliverable approved! XP awarded.');
      loadData();
      setTimeout(() => setNotification(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Error approving deliverable');
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !newMessage.trim()) return;

    try {
      const senderName = profile?.name || currentUser.user_metadata?.name || currentUser.email?.split('@')[0] || 'User';
      const senderAvatar = profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

      const { error } = await supabase
        .from('sprint_discussions')
        .insert({
          class_id: classId,
          user_id: currentUser.id,
          user_name: senderName,
          user_avatar: senderAvatar,
          is_mentor: isMentor,
          content: newMessage.trim(),
        });

      if (error) throw error;

      setNewMessage('');
      loadData();
    } catch (err: any) {
      alert(err.message || 'Error posting message');
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      
      {/* Back Link */}
      <div>
        <Link
          href="/classes"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> 
          <span>{language === 'mn' ? 'Хичээлүүд рүү буцах' : 'Back to Classes Directory'}</span>
        </Link>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="rounded-xl border border-blue-500/30 bg-blue-950/50 p-4 text-xs font-medium text-blue-200 flex items-center justify-between shadow-lg animate-in fade-in">
          <span>{notification}</span>
        </div>
      )}

      {/* Class Space Header Banner */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded-md">
                {currentClass.subject} • {currentClass.curriculum}
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${tierConfig.badgeClass}`}
              >
                <Sparkles className="h-2.5 w-2.5" />
                {language === 'mn' ? tierConfig.titleMn : tierConfig.titleEn}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {currentClass.title}
            </h1>
            <p className="text-xs text-zinc-400 max-w-3xl leading-relaxed">
              {currentClass.description}
            </p>
          </div>

          {/* Video Launcher */}
          <div className="shrink-0 w-full md:w-auto">
            <a
              href={currentClass.meeting_link}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-medium text-white rounded-xl shadow-lg active:scale-95"
            >
              <Video className="h-4 w-4" />
              <span>{t('joinVideoBtn')}</span>
            </a>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5 border-t border-white/[0.06] text-xs">
          <div className="space-y-1">
            <span className="text-zinc-500 text-[11px]">{t('leadMentor')}</span>
            <p className="font-semibold text-white">
              {currentClass.mentor_name}
            </p>
            <p className="text-zinc-400 text-[11px]">{currentClass.mentor_school}</p>
          </div>

          <div className="space-y-1">
            <span className="text-zinc-500 text-[11px]">{t('sprintWindow')}</span>
            <p className="font-semibold text-white">
              {currentClass.duration_weeks} {language === 'mn' ? 'долоо хоног' : 'Weeks'} ({currentClass.start_date} – {currentClass.end_date})
            </p>
            <p className="text-zinc-400 text-[11px]">{currentClass.schedule_summary}</p>
          </div>

          <div className="space-y-1">
            <span className="text-zinc-500 text-[11px]">{t('cohortStatus')}</span>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">
                {enrollments.length} / {currentClass.max_seats} {t('seatsFilled')}
              </span>
              {seatsLeft > 0 ? (
                <span className="text-[11px] font-medium text-emerald-400">
                  ({seatsLeft} {seatsLeft === 1 ? t('seatLeft') : t('seatsLeftPlural')})
                </span>
              ) : (
                <span className="text-[11px] font-medium text-amber-400">({t('classFull')})</span>
              )}
            </div>
            {!isEnrolled && !isMentor && seatsLeft > 0 && (
              <button
                onClick={handleEnroll}
                className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300"
              >
                {currentClass.enrollment_mode === 'application' ? t('applySeat') : t('claimSeat')} →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-white/[0.08] pb-1">
        <button
          onClick={() => setActiveTab('missions')}
          className={`px-4 py-2 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
            activeTab === 'missions'
              ? 'bg-white/[0.08] text-white'
              : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <FileCheck className="h-3.5 w-3.5" />
          <span>{t('tabMissions')}</span>
        </button>

        <button
          onClick={() => setActiveTab('discussions')}
          className={`px-4 py-2 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
            activeTab === 'discussions'
              ? 'bg-white/[0.08] text-white'
              : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <MessageSquare className="h-3.5 w-3.5" />
          <span>{t('tabDiscussions')} ({discussions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('roster')}
          className={`px-4 py-2 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
            activeTab === 'roster'
              ? 'bg-white/[0.08] text-white'
              : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <Users className="h-3.5 w-3.5" />
          <span>{t('tabRoster')} ({enrollments.length})</span>
        </button>
      </div>

      {/* TAB 1: Missions & Deliverables */}
      {activeTab === 'missions' && (
        <div className="space-y-6">
          
          {/* Weekly Mission Roadmap */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              {language === 'mn' ? 'Долоо хоног бүрийн зорилтууд' : 'Weekly Mission Roadmap'}
            </h3>

            <div className="grid grid-cols-1 gap-3">
              {missionsList.map((m, idx) => (
                <div key={idx} className="glass-panel rounded-xl p-4 sm:p-5 space-y-2 border-l-4 border-l-blue-500">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">
                      {language === 'mn' ? `${m.weekNumber || idx + 1}-р Долоо хоног` : `Week ${m.weekNumber || idx + 1} Mission`}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-white">
                    {m.title}
                  </h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {m.description}
                  </p>
                  <div className="pt-2 flex items-center gap-2 text-[11px] text-zinc-300 bg-zinc-900/50 p-2 rounded-lg border border-white/[0.04]">
                    <Sparkles className="h-3 w-3 text-amber-400 shrink-0" />
                    <span><strong>{language === 'mn' ? 'Шаардагдах бүтээл:' : 'Required Deliverable:'}</strong> {m.deliverablePrompt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Deliverable Box for Enrolled Students */}
          {isEnrolled && (
            <div className="glass-panel rounded-2xl p-6 space-y-4 border border-blue-500/20 shadow-[0_0_25px_rgba(59,130,246,0.08)]">
              <div className="flex items-center gap-2">
                <Upload className="h-4 w-4 text-blue-400" />
                <h3 className="text-sm font-bold text-white">
                  {t('submitDeliverableTitle')}
                </h3>
              </div>
              <p className="text-xs text-zinc-400">
                {t('submitDeliverableDesc')}
              </p>

              <form onSubmit={handleSubmitDeliverable} className="space-y-3 pt-1">
                <div>
                  <input
                    type="text"
                    required
                    placeholder={language === 'mn'
                      ? 'Бүтээлийн гарчиг (Жишээ: Физикийн олимпиадын 10 бодлогын бүрэн бодолт)'
                      : 'Deliverable Title (e.g. Differentiation Problem Set & Code)'}
                    value={deliverableTitle}
                    onChange={(e) => setDeliverableTitle(e.target.value)}
                    className="w-full rounded-xl border border-white/[0.08] bg-zinc-900/60 p-2.5 text-xs text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <input
                    type="url"
                    required
                    placeholder={language === 'mn'
                      ? 'Холбоос (GitHub, Google Drive, эсвэл PDF линк)'
                      : 'Link to Artifact (GitHub, Google Drive, or Demo URL)'}
                    value={deliverableUrl}
                    onChange={(e) => setDeliverableUrl(e.target.value)}
                    className="w-full rounded-xl border border-white/[0.08] bg-zinc-900/60 p-2.5 text-xs text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary px-4 py-2 text-xs font-medium text-white rounded-lg shadow-sm disabled:opacity-50"
                >
                  {submitting ? 'Илгээж байна...' : t('submitDeliverableBtn')}
                </button>
              </form>
            </div>
          )}

          {/* Pay It Forward Callout (Shown when student has an approved deliverable) */}
          {userDeliverable && userDeliverable.status === 'approved' && (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/30 p-6 space-y-3">
              <div className="flex items-center gap-2 text-emerald-300">
                <Flame className="h-5 w-5 text-amber-400" />
                <h3 className="text-base font-bold">
                  {t('payItForwardTitle')}
                </h3>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed max-w-2xl">
                {t('payItForwardDesc')}
              </p>
              <div className="pt-1">
                <Link
                  href="/classes/create"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-xs font-medium text-white shadow-sm transition-all"
                >
                  <PlusCircle className="h-4 w-4" />
                  {t('openClassBtn')}
                </Link>
              </div>
            </div>
          )}

          {/* Deliverables List */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              {t('tabDeliverables')} ({deliverables.length})
            </h3>

            {deliverables.length === 0 ? (
              <div className="glass-panel rounded-2xl p-8 text-center text-xs text-zinc-500 border-dashed border-white/[0.08]">
                {language === 'mn' ? 'Энэ ангид одоогоор бүтээл илгээгдээгүй байна.' : 'No deliverables submitted yet for this sprint class.'}
              </div>
            ) : (
              deliverables.map((del) => (
                <div
                  key={del.id}
                  className="glass-panel rounded-xl p-5 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-white">
                        {del.title}
                      </h4>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        {language === 'mn' ? 'Илгээсэн сурагч:' : 'Submitted by'} <strong className="text-zinc-200">{del.student_name}</strong>
                      </p>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                        del.status === 'approved'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {del.status === 'approved' ? (
                        <>
                          <CheckCircle2 className="h-3 w-3" /> Certified
                        </>
                      ) : (
                        'Under Review'
                      )}
                    </span>
                  </div>

                  <div>
                    <a
                      href={del.url_or_notes}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-medium text-blue-400 hover:underline"
                    >
                      <span>{language === 'mn' ? 'Бүтээлийн холбоос үзэх' : 'View Artifact Link'}</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>

                  {del.mentor_feedback && (
                    <div className="rounded-lg bg-zinc-900/60 p-2.5 text-xs text-zinc-300 border border-white/[0.04]">
                      <strong className="text-zinc-200">{t('mentorFeedbackLabel')}</strong> {del.mentor_feedback}
                    </div>
                  )}

                  {/* Mentor Review Controls */}
                  {isMentor && del.status === 'pending' && (
                    <div className="pt-3 border-t border-white/[0.06] space-y-2">
                      <input
                        type="text"
                        placeholder="Provide feedback on the deliverable..."
                        value={mentorFeedbackMap[del.id] || ''}
                        onChange={(e) => setMentorFeedbackMap({ ...mentorFeedbackMap, [del.id]: e.target.value })}
                        className="w-full rounded-lg border border-white/[0.08] bg-zinc-900/60 p-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                      />
                      <button
                        onClick={() => handleApproveDeliverable(del.id)}
                        className="rounded-lg bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 text-xs font-medium text-white transition-colors"
                      >
                        {t('approveDeliverableBtn')}
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

        </div>
      )}

      {/* TAB 2: Cohort Discussions */}
      {activeTab === 'discussions' && (
        <div className="space-y-4">
          
          {/* Message List */}
          <div className="glass-panel rounded-2xl p-5 space-y-4 min-h-[300px] max-h-[500px] overflow-y-auto">
            {discussions.length === 0 ? (
              <div className="text-center py-16 text-xs text-zinc-500">
                {language === 'mn' ? 'Хэлэлцүүлэг эхлээгүй байна. Ангидаа асуулт тавьж эхлээрэй!' : 'No messages yet. Start the conversation with your cohort!'}
              </div>
            ) : (
              discussions.map((msg) => (
                <div key={msg.id} className="flex items-start gap-3 text-xs">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={msg.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                    alt={msg.userName}
                    className="h-7 w-7 rounded-full object-cover border border-white/10 shrink-0"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{msg.userName}</span>
                      {msg.isMentor && (
                        <span className="rounded bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.2 text-[9px] font-bold text-blue-400">
                          MENTOR
                        </span>
                      )}
                      <span className="text-[10px] text-zinc-500">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-zinc-300 leading-relaxed bg-zinc-900/40 p-2.5 rounded-lg border border-white/[0.04]">
                      {msg.content}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* New Message Input */}
          {currentUser ? (
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                placeholder={t('discussionPlaceholder')}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 rounded-xl border border-white/[0.08] bg-zinc-900/60 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none"
              />
              <button
                type="submit"
                className="btn-primary px-4 py-2.5 rounded-xl text-xs font-medium text-white flex items-center gap-1.5 shrink-0"
              >
                <span>{t('postMessage')}</span>
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          ) : (
            <div className="glass-panel p-3 text-center text-xs text-zinc-400 rounded-xl">
              <Link href={`/login?redirectTo=/class/${classId}`} className="text-blue-400 underline font-medium">
                {language === 'mn' ? 'Нэвтэрч хэлэлцүүлэгт оролцоно уу' : 'Sign in to join the cohort discussion'}
              </Link>
            </div>
          )}

        </div>
      )}

      {/* TAB 3: Class Roster */}
      {activeTab === 'roster' && (
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
              {t('tabRoster')} ({enrollments.length} / {currentClass.max_seats})
            </h3>
            {seatsLeft > 0 && (
              <span className="text-xs font-medium text-emerald-400">
                {seatsLeft} {seatsLeft === 1 ? t('seatLeft') : t('seatsLeftPlural')}
              </span>
            )}
          </div>

          <div className="divide-y divide-white/[0.06]">
            {enrollments.map((enr, idx) => {
              const student = enr.profiles || {};
              return (
                <div key={enr.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-800 font-bold text-zinc-300 text-xs">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{student.name || 'Student'}</p>
                      <p className="text-zinc-500 text-[11px]">
                        {student.grade || '11th Grade'} • {student.school || 'High School'} ({student.location || 'UB'})
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    {enr.status || 'Confirmed'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
