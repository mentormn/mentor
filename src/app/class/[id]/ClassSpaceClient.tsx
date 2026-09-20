'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { useLanguage } from '@/lib/i18n';
import { FormalTier, Mission, SprintDiscussion } from '@/lib/types';
import { 
  GraduationCap, 
  Video, 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle2, 
  Upload, 
  ExternalLink, 
  ArrowLeft,
  FileCheck,
  MessageSquare,
  Send,
  Award,
  BookOpen,
  ChevronRight,
  ShieldCheck,
  AlertCircle
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
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
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

  const isMentor = currentUser && currentClass && currentUser.id === currentClass.mentor_id;
  const isEnrolled = currentUser && enrollments.some((e) => e.student_id === currentUser.id && e.status === 'confirmed');

  const handleSubmitDeliverable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !deliverableUrl.trim()) return;
    setSubmitting(true);

    try {
      const studentName = profile?.name || currentUser.user_metadata?.name || currentUser.email?.split('@')[0] || 'Student';

      const { error } = await supabase
        .from('deliverables')
        .insert({
          class_id: classId,
          student_id: currentUser.id,
          student_name: studentName,
          week_number: selectedWeek,
          title: deliverableTitle.trim() || `Week ${selectedWeek} Deliverable`,
          file_url: deliverableUrl.trim(),
          status: 'submitted',
        });

      if (error) throw error;

      setDeliverableTitle('');
      setDeliverableUrl('');
      setNotification(language === 'mn' ? 'Бүтээл амжилттай илгээгдлээ!' : 'Deliverable submitted successfully!');
      setTimeout(() => setNotification(null), 4000);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReviewDeliverable = async (deliverableId: string, status: 'verified' | 'rejected') => {
    try {
      const feedback = mentorFeedbackMap[deliverableId] || '';
      const { error } = await supabase
        .from('deliverables')
        .update({
          status,
          mentor_feedback: feedback,
        })
        .eq('id', deliverableId);

      if (error) throw error;
      setNotification(language === 'mn' ? 'Бүтээлийг шалгаж үнэлгээ өглөө.' : 'Deliverable status updated.');
      setTimeout(() => setNotification(null), 4000);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Review failed');
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !newMessage.trim()) return;

    try {
      const senderName = profile?.name || currentUser.user_metadata?.name || currentUser.email?.split('@')[0] || 'Scholar';
      const { error } = await supabase
        .from('sprint_discussions')
        .insert({
          class_id: classId,
          user_id: currentUser.id,
          user_name: senderName,
          user_avatar: profile?.avatar_url || null,
          is_mentor: isMentor,
          content: newMessage.trim(),
        });

      if (error) throw error;
      setNewMessage('');
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to send message');
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 space-y-6">
        <div className="h-8 w-64 bg-zinc-200 rounded animate-pulse" />
        <div className="h-64 bg-zinc-100 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (!currentClass) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center space-y-4">
        <h1 className="text-xl font-bold text-zinc-900">Class Not Found</h1>
        <p className="text-xs text-zinc-500">The requested sprint class does not exist or has ended.</p>
        <Link href="/classes" className="btn-primary inline-block px-4 py-2 text-xs font-medium text-white rounded-lg">
          Back to Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      
      {/* Top Breadcrumb & Sprint Header */}
      <div className="space-y-4 border-b border-zinc-200 pb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {language === 'mn' ? 'Хяналтын самбар луу буцах' : 'Back to Dashboard'}
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="badge-accent text-xs">
                {currentClass.subject}
              </span>
              <span className="text-xs text-zinc-400">•</span>
              <span className="text-xs font-semibold text-zinc-600">
                {currentClass.curriculum}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
              {currentClass.title}
            </h1>
            <p className="text-xs text-zinc-500 flex items-center gap-2">
              <GraduationCap className="h-3.5 w-3.5 text-zinc-400" />
              <span>Mentor: {currentClass.mentor_name} ({currentClass.mentor_school})</span>
              <span className="text-zinc-300">•</span>
              <Clock className="h-3.5 w-3.5 text-zinc-400" />
              <span>{currentClass.schedule_summary}</span>
            </p>
          </div>

          {/* Google Meet CTA button */}
          <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
            {currentClass.meeting_link && (
              <a
                href={currentClass.meeting_link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-white shadow-sm"
              >
                <Video className="h-4 w-4 text-emerald-400" />
                <span>{language === 'mn' ? 'Google Meet хичээлд орох' : 'Join Google Meet'}</span>
                <ExternalLink className="h-3 w-3 opacity-70" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-medium text-emerald-900 flex items-center gap-2 shadow-sm animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>{notification}</span>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-zinc-200 flex items-center gap-6">
        <button
          onClick={() => setActiveTab('missions')}
          className={`pb-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'missions'
              ? 'border-zinc-900 text-zinc-900'
              : 'border-transparent text-zinc-500 hover:text-zinc-800'
          }`}
        >
          <BookOpen className="h-4 w-4" />
          <span>{language === 'mn' ? 'Долоо хоногийн даалгавар' : 'Weekly Missions & Proof'}</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600">
            {currentClass.missions?.length || 0}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('discussions')}
          className={`pb-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'discussions'
              ? 'border-zinc-900 text-zinc-900'
              : 'border-transparent text-zinc-500 hover:text-zinc-800'
          }`}
        >
          <MessageSquare className="h-4 w-4" />
          <span>{language === 'mn' ? 'Танхимын хэлэлцүүлэг' : 'Cohort Discussion'}</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600">
            {discussions.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('roster')}
          className={`pb-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'roster'
              ? 'border-zinc-900 text-zinc-900'
              : 'border-transparent text-zinc-500 hover:text-zinc-800'
          }`}
        >
          <Users className="h-4 w-4" />
          <span>{language === 'mn' ? 'Сурагчдын нэрс' : 'Cohort Roster'}</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600">
            {enrollments.length}
          </span>
        </button>
      </div>

      {/* Tab 1: Weekly Missions & Deliverables */}
      {activeTab === 'missions' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left 2 Cols: Mission Roadmap & Deliverable Dropzone */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Missions List */}
            <div className="space-y-4">
              {currentClass.missions && Array.isArray(currentClass.missions) && currentClass.missions.map((m: any, idx: number) => {
                const isSelected = selectedWeek === (m.weekNumber || idx + 1);
                const weekDeliverables = deliverables.filter((d) => d.week_number === (m.weekNumber || idx + 1));
                const studentDeliv = weekDeliverables.find((d) => d.student_id === currentUser?.id);

                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedWeek(m.weekNumber || idx + 1)}
                    className={`saas-card p-6 cursor-pointer transition-all ${
                      isSelected ? 'ring-2 ring-zinc-900 shadow-sm' : 'hover:border-zinc-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                        Week {m.weekNumber || idx + 1}
                      </span>
                      {studentDeliv ? (
                        <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                          studentDeliv.status === 'verified'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {studentDeliv.status === 'verified' ? 'Verified ✓' : 'Submitted'}
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-zinc-400">
                          {isMentor ? `${weekDeliverables.length} submitted` : 'Pending Submission'}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-semibold text-zinc-900 mt-2">
                      {m.title}
                    </h3>
                    <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                      {m.description}
                    </p>

                    {m.deliverablePrompt && (
                      <div className="mt-3 rounded-lg bg-zinc-50 p-3 text-xs text-zinc-700 border border-zinc-100">
                        <span className="font-semibold text-zinc-900">🎯 Required Deliverable:</span> {m.deliverablePrompt}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Submission Dropzone (for enrolled students) */}
            {isEnrolled && (
              <div className="saas-card p-6 sm:p-8 space-y-4">
                <h3 className="text-base font-semibold text-zinc-900 flex items-center gap-2">
                  <Upload className="h-4 w-4 text-blue-600" />
                  <span>{language === 'mn' ? `Week ${selectedWeek} даалгавар илгээх` : `Submit Week ${selectedWeek} Deliverable`}</span>
                </h3>
                <p className="text-xs text-zinc-500">
                  {language === 'mn'
                    ? 'Google Docs, Drive, GitHub холбоос эсвэл бодлогын зургийг оруулна уу.'
                    : 'Provide a link to your solved PDF, Google Drive, or GitHub repository.'}
                </p>

                <form onSubmit={handleSubmitDeliverable} className="space-y-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-700">
                      {language === 'mn' ? 'Бүтээлийн нэр' : 'Submission Title'}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Problem Set 1 Solutions - Batch A"
                      value={deliverableTitle}
                      onChange={(e) => setDeliverableTitle(e.target.value)}
                      className="saas-input"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-700">
                      {language === 'mn' ? 'Холбоос (Drive, GitHub, PDF URL)' : 'Deliverable URL (Google Drive, GitHub, PDF)'} *
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://drive.google.com/... or https://github.com/..."
                      value={deliverableUrl}
                      onChange={(e) => setDeliverableUrl(e.target.value)}
                      className="saas-input"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || !deliverableUrl.trim()}
                    className="btn-primary px-5 py-2.5 text-xs font-medium text-white inline-flex items-center gap-2"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    <span>{submitting ? 'Submitting...' : (language === 'mn' ? 'Даалгавар илгээх' : 'Submit Deliverable')}</span>
                  </button>
                </form>
              </div>
            )}

            {/* Mentor Deliverable Review Queue */}
            {isMentor && (
              <div className="saas-card p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                  <h3 className="text-base font-semibold text-zinc-900 flex items-center gap-2">
                    <FileCheck className="h-4 w-4 text-emerald-600" />
                    <span>{language === 'mn' ? 'Сурагчдын бүтээл шалгах' : 'Deliverables Review Queue'}</span>
                  </h3>
                  <span className="badge-accent text-xs">
                    {deliverables.length} {language === 'mn' ? 'бүтээл' : 'submissions'}
                  </span>
                </div>

                {deliverables.length === 0 ? (
                  <p className="text-xs text-zinc-500 py-4 text-center">
                    {language === 'mn' ? 'Одоогоор илгээсэн бүтээл байхгүй байна.' : 'No submissions received yet.'}
                  </p>
                ) : (
                  <div className="divide-y divide-zinc-200">
                    {deliverables.map((d) => (
                      <div key={d.id} className="py-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xs font-semibold text-zinc-900">
                              {d.student_name}
                            </span>
                            <span className="text-xs text-zinc-400 ml-2">
                              • Week {d.week_number} ({d.title})
                            </span>
                          </div>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            d.status === 'verified'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {d.status}
                          </span>
                        </div>

                        <div className="text-xs">
                          <a
                            href={d.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline font-medium inline-flex items-center gap-1"
                          >
                            <span>{language === 'mn' ? 'Бүтээл үзэх' : 'View Submitted File/Link'}</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>

                        {/* Feedback & Actions */}
                        <div className="flex items-center gap-2 pt-1">
                          <input
                            type="text"
                            placeholder="Mentor feedback notes..."
                            value={mentorFeedbackMap[d.id] || d.mentor_feedback || ''}
                            onChange={(e) => setMentorFeedbackMap({ ...mentorFeedbackMap, [d.id]: e.target.value })}
                            className="saas-input py-1 text-xs flex-1"
                          />
                          <button
                            onClick={() => handleReviewDeliverable(d.id, 'verified')}
                            className="btn-primary px-3 py-1.5 text-xs text-white"
                          >
                            Verify ✓
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Right 1 Col: Sprint Summary & Live Call Info */}
          <div className="space-y-6">
            
            <div className="saas-card p-6 space-y-4">
              <h3 className="text-sm font-semibold text-zinc-900 border-b border-zinc-100 pb-2">
                {language === 'mn' ? 'Танхимын хуваарь' : 'Class Logistics'}
              </h3>
              <div className="space-y-3 text-xs text-zinc-600">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">{language === 'mn' ? 'Цаг' : 'Schedule'}</span>
                  <span className="font-medium text-zinc-900">{currentClass.schedule_summary}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">{language === 'mn' ? 'Хугацаа' : 'Duration'}</span>
                  <span className="font-medium text-zinc-900">{currentClass.duration_weeks} weeks</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-500">{language === 'mn' ? 'Сурагч' : 'Cohort Size'}</span>
                  <span className="font-medium text-zinc-900">{enrollments.length} / {currentClass.max_seats}</span>
                </div>
              </div>

              {currentClass.meeting_link && (
                <div className="pt-2">
                  <a
                    href={currentClass.meeting_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary w-full py-2 text-xs font-medium text-white text-center flex items-center justify-center gap-2"
                  >
                    <Video className="h-4 w-4" />
                    <span>{language === 'mn' ? 'Шууд уулзалт эхлүүлэх' : 'Join Google Meet'}</span>
                  </a>
                </div>
              )}
            </div>

            {/* Academic Credential Card */}
            <div className="saas-card p-6 space-y-3 bg-gradient-to-b from-white to-zinc-50">
              <div className="flex items-center gap-2 text-amber-700">
                <Award className="h-5 w-5" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Verified Outcome
                </span>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed">
                {language === 'mn'
                  ? 'Энэхүү спринтийг бүрэн дүүргэж, даалгавруудаа шалгуулснаар албан ёсны батламж олгогдоно.'
                  : 'Students who submit and verify all weekly deliverables receive an official academic credential.'}
              </p>
            </div>

          </div>

        </div>
      )}

      {/* Tab 2: Cohort Discussion */}
      {activeTab === 'discussions' && (
        <div className="saas-card p-6 sm:p-8 space-y-6">
          <div className="border-b border-zinc-100 pb-3 flex items-center justify-between">
            <h3 className="text-base font-semibold text-zinc-900">
              {language === 'mn' ? 'Танхимын хэлэлцүүлэг & Асуулт хариулт' : 'Cohort Q&A and Discussions'}
            </h3>
            <span className="text-xs text-zinc-400">
              {discussions.length} messages
            </span>
          </div>

          {/* Discussion Messages */}
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {discussions.length === 0 ? (
              <p className="text-xs text-zinc-500 py-12 text-center">
                {language === 'mn' ? 'Хэлэлцүүлэг эхлээгүй байна. Анхны асуултаа үлдээнэ үү!' : 'No messages yet. Be the first to start the conversation!'}
              </p>
            ) : (
              discussions.map((msg) => (
                <div key={msg.id} className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-xs font-semibold shrink-0">
                    {msg.userName.charAt(0)}
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-zinc-900">
                        {msg.userName}
                      </span>
                      {msg.isMentor && (
                        <span className="text-[10px] font-semibold px-2 py-0.2 rounded bg-zinc-900 text-white">
                          Mentor
                        </span>
                      )}
                      <span className="text-[10px] text-zinc-400">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="text-xs text-zinc-700 bg-zinc-50 border border-zinc-200/60 p-3 rounded-xl leading-relaxed">
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Send Message Form */}
          <form onSubmit={handleSendMessage} className="flex items-center gap-3 pt-4 border-t border-zinc-100">
            <input
              type="text"
              placeholder={language === 'mn' ? 'Асуулт, санаагаа хуваалцах...' : 'Ask a question or share thoughts...'}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="saas-input flex-1"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="btn-primary px-4 py-2 text-xs font-medium text-white inline-flex items-center gap-1.5 shrink-0"
            >
              <Send className="h-3.5 w-3.5" />
              <span>{language === 'mn' ? 'Илгээх' : 'Send'}</span>
            </button>
          </form>
        </div>
      )}

      {/* Tab 3: Cohort Roster */}
      {activeTab === 'roster' && (
        <div className="saas-card overflow-hidden">
          <div className="border-b border-zinc-200 bg-zinc-50/50 px-6 py-4 flex items-center justify-between">
            <h3 className="text-base font-semibold text-zinc-900">
              {language === 'mn' ? 'Бүртгэлтэй сурагчид' : 'Enrolled Students'}
            </h3>
            <span className="text-xs text-zinc-500 font-medium">
              {enrollments.length} / {currentClass.max_seats} {language === 'mn' ? 'сурагч' : 'students'}
            </span>
          </div>

          <div className="divide-y divide-zinc-200">
            {enrollments.length === 0 ? (
              <p className="text-xs text-zinc-500 p-8 text-center">
                {language === 'mn' ? 'Одоогоор сурагч бүртгүүлээгүй байна.' : 'No students enrolled yet.'}
              </p>
            ) : (
              enrollments.map((enr) => (
                <div key={enr.id} className="p-4 sm:px-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-xs font-bold text-zinc-700">
                      {enr.profiles?.name?.charAt(0) || 'S'}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-zinc-900">
                        {enr.profiles?.name || 'Student'}
                      </div>
                      <div className="text-[11px] text-zinc-500">
                        {enr.profiles?.school || 'High School'} • {enr.profiles?.location || 'Mongolia'}
                      </div>
                    </div>
                  </div>

                  <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                    enr.status === 'confirmed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {enr.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

    </div>
  );
}
