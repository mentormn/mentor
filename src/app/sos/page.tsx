'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useLanguage } from '@/lib/i18n';
import { QuickHelpRequest } from '@/lib/types';
import { 
  Zap, 
  Search, 
  Filter, 
  Phone, 
  School, 
  GraduationCap, 
  Clock, 
  Video, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  ExternalLink, 
  ArrowRight, 
  Sparkles,
  HelpCircle,
  MessageSquare,
  BookOpen,
  User,
  Image as ImageIcon,
  Check,
  ChevronRight
} from 'lucide-react';

const SUBJECT_LIST = [
  'Mathematics (Математик)',
  'Physics (Физик)',
  'Chemistry (Хими)',
  'Biology (Биологи)',
  'ICT (Мэдээлэл зүй)',
  'English Language (Англи хэл)',
  'Mongolian Language (Монгол хэл)',
  'History & Social Science (Түүх, нийгэм)',
  'Geography (Газар зүй)',
  'Business Studies',
  'Chinese Language',
  'Japanese Language'
];

function SOSContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language } = useLanguage();

  const initialTab = searchParams.get('tab') === 'queue' ? 'queue' : searchParams.get('tab') === 'my' ? 'my' : 'ask';
  const [activeTab, setActiveTab] = useState<'ask' | 'queue' | 'my'>(initialTab);

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Form states (Topic / Concept / Problem / Assignment)
  const [helpType, setHelpType] = useState<'topic' | 'problem' | 'assignment' | 'general'>('topic');
  const [curriculum, setCurriculum] = useState<'National' | 'Cambridge' | 'Both'>('National');
  const [selectedSubject, setSelectedSubject] = useState(SUBJECT_LIST[0]);
  const [topicTitle, setTopicTitle] = useState('');
  const [topicDescription, setTopicDescription] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Queue states
  const [requests, setRequests] = useState<QuickHelpRequest[]>([]);
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [gradeFilter, setGradeFilter] = useState('All');
  const [helpTypeFilter, setHelpTypeFilter] = useState('All');

  // Load auth & profile
  useEffect(() => {
    async function loadUser() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setCurrentUser(session.user);
          const { data: prof } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (prof) {
            setProfile(prof);
            if (prof.curriculums?.includes('National') && prof.curriculums?.includes('Cambridge')) {
              setCurriculum('Both');
            } else if (prof.curriculums?.includes('Cambridge')) {
              setCurriculum('Cambridge');
            } else if (prof.curriculums?.includes('National')) {
              setCurriculum('National');
            }
          }
        }
      } catch (err) {
        console.error('Error loading session:', err);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  // Fetch quick help requests
  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('quick_help_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.log('Using local memory for SOS requests fallback:', error.message);
        const saved = localStorage.getItem('mentormn_sos_requests');
        if (saved) {
          setRequests(JSON.parse(saved));
        }
      } else if (data) {
        const mapped: QuickHelpRequest[] = data.map((r: any) => ({
          id: r.id,
          studentId: r.student_id,
          studentName: r.student_name,
          phoneNumber: r.phone_number,
          school: r.school,
          grade: r.grade,
          gender: r.gender,
          curriculum: r.curriculum,
          subject: r.subject,
          helpType: r.help_type || 'topic',
          title: r.title,
          description: r.description,
          attachmentUrl: r.attachment_url,
          mentorId: r.mentor_id,
          mentorName: r.mentor_name,
          meetingLink: r.meeting_link,
          status: r.status,
          createdAt: r.created_at,
          claimedAt: r.claimed_at,
          resolvedAt: r.resolved_at,
        }));
        setRequests(mapped);
      }
    } catch (e) {
      console.error('Fetch requests error:', e);
    }
  };

  useEffect(() => {
    fetchRequests();

    // Supabase Realtime subscription
    const channel = supabase
      .channel('quick_help_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'quick_help_requests' },
        () => {
          fetchRequests();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Handle student submit
  const handleAskHelp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!currentUser) {
      router.push('/login?redirectTo=/sos?tab=ask');
      return;
    }

    const studentName = profile?.name || currentUser?.user_metadata?.name || currentUser?.email?.split('@')[0] || 'Student';
    const phoneNumber = profile?.phone || currentUser?.user_metadata?.phone || '';
    const school = profile?.school || currentUser?.user_metadata?.school || 'Secondary School';
    const grade = profile?.grade || currentUser?.user_metadata?.grade || '10-р анги';
    const gender = profile?.gender || currentUser?.user_metadata?.gender || 'Male';

    if (!phoneNumber.trim()) {
      setErrorMessage(
        language === 'mn'
          ? 'Таны утасны дугаар бүртгэгдээгүй байна. Профайл хэсэгтээ утасны дугаараа оруулна уу.'
          : 'Please add your phone number in your profile so mentors can contact you.'
      );
      return;
    }

    if (!topicTitle.trim() || !topicDescription.trim()) {
      setErrorMessage(
        language === 'mn'
          ? 'Сэдэв, бодлогын гарчиг болон ойлгохгүй байгаа зүйлээ тайлбарлана уу.'
          : 'Please enter topic/problem title and description.'
      );
      return;
    }

    setSubmitting(true);

    const newRequest: Partial<QuickHelpRequest> = {
      studentId: currentUser.id,
      studentName,
      phoneNumber: phoneNumber.trim(),
      school,
      grade,
      gender,
      curriculum,
      subject: selectedSubject.split(' (')[0],
      helpType,
      title: topicTitle.trim(),
      description: topicDescription.trim(),
      attachmentUrl: attachmentUrl.trim() || undefined,
      status: 'open',
    };

    try {
      const { data, error } = await supabase
        .from('quick_help_requests')
        .insert({
          student_id: newRequest.studentId,
          student_name: newRequest.studentName,
          phone_number: newRequest.phoneNumber,
          school: newRequest.school,
          grade: newRequest.grade,
          gender: newRequest.gender,
          curriculum: newRequest.curriculum,
          subject: newRequest.subject,
          help_type: newRequest.helpType,
          title: newRequest.title,
          description: newRequest.description,
          attachment_url: newRequest.attachmentUrl,
          status: 'open',
        })
        .select()
        .single();

      if (error) {
        console.log('Falling back to local storage for SOS request:', error.message);
        const mockItem: QuickHelpRequest = {
          id: 'local-' + Date.now(),
          studentId: currentUser.id,
          studentName: newRequest.studentName!,
          phoneNumber: newRequest.phoneNumber!,
          school: newRequest.school!,
          grade: newRequest.grade!,
          gender: newRequest.gender,
          curriculum: newRequest.curriculum as any,
          subject: newRequest.subject!,
          helpType: newRequest.helpType,
          title: newRequest.title!,
          description: newRequest.description!,
          attachmentUrl: newRequest.attachmentUrl,
          status: 'open',
          createdAt: new Date().toISOString(),
        };
        const current = [...requests, mockItem];
        setRequests(current);
        localStorage.setItem('mentormn_sos_requests', JSON.stringify(current));
      }

      setTopicTitle('');
      setTopicDescription('');
      setAttachmentUrl('');
      setNotification(
        language === 'mn'
          ? 'Таны хүсэлт амжилттай нийтлэгдлээ! Шилдэг ментор удахгүй холбогдож 10 минутад тайлбарлаж өгнө.'
          : 'Your request has been posted! A verified mentor will claim it shortly for a 10-minute explanation.'
      );
      setActiveTab('my');
      fetchRequests();
      setTimeout(() => setNotification(null), 6000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error submitting request');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle mentor claim
  const handleClaimRequest = async (item: QuickHelpRequest) => {
    if (!currentUser) {
      router.push('/login?redirectTo=/sos?tab=queue');
      return;
    }

    const mentorName = profile?.name || currentUser.user_metadata?.name || currentUser.email?.split('@')[0] || 'Mentor';
    const meetLink = `https://meet.google.com/new`;

    try {
      const { error } = await supabase
        .from('quick_help_requests')
        .update({
          mentor_id: currentUser.id,
          mentor_name: mentorName,
          meeting_link: meetLink,
          status: 'claimed',
          claimed_at: new Date().toISOString(),
        })
        .eq('id', item.id);

      if (error) {
        // Local fallback
        const updated = requests.map((r) => 
          r.id === item.id 
            ? { ...r, mentorId: currentUser.id, mentorName, meetingLink: meetLink, status: 'claimed' as const, claimedAt: new Date().toISOString() }
            : r
        );
        setRequests(updated);
        localStorage.setItem('mentormn_sos_requests', JSON.stringify(updated));
      }

      setNotification(
        language === 'mn'
          ? `Та ${item.studentName}-ийн асуултыг авлаа! 10 минутын хичээлээ эхлүүлнэ үү.`
          : `You claimed ${item.studentName}'s question! Launch the 10-minute session.`
      );
      fetchRequests();
      setTimeout(() => setNotification(null), 5000);
    } catch (e: any) {
      alert(e.message || 'Error claiming request');
    }
  };

  // Handle mark resolved
  const handleResolveRequest = async (item: QuickHelpRequest) => {
    try {
      const { error } = await supabase
        .from('quick_help_requests')
        .update({
          status: 'resolved',
          resolved_at: new Date().toISOString(),
        })
        .eq('id', item.id);

      if (error) {
        const updated = requests.map((r) => 
          r.id === item.id ? { ...r, status: 'resolved' as const, resolvedAt: new Date().toISOString() } : r
        );
        setRequests(updated);
        localStorage.setItem('mentormn_sos_requests', JSON.stringify(updated));
      }

      setNotification(
        language === 'mn' ? '10 минутын хичээл амжилттай дууслаа!' : '10-minute session marked as resolved!'
      );
      fetchRequests();
      setTimeout(() => setNotification(null), 4000);
    } catch (e: any) {
      alert(e.message || 'Error updating status');
    }
  };

  // Filter requests for Queue
  const filteredRequests = requests.filter((r) => {
    if (subjectFilter !== 'All' && !r.subject.toLowerCase().includes(subjectFilter.toLowerCase())) return false;
    if (statusFilter !== 'All' && r.status !== statusFilter) return false;
    if (gradeFilter !== 'All' && !r.grade.includes(gradeFilter)) return false;
    return true;
  });

  // Filter for student's own requests
  const myRequests = requests.filter((r) => {
    if (currentUser && r.studentId === currentUser.id) return true;
    if (profile?.phone && r.phoneNumber === profile.phone) return true;
    return false;
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 space-y-10">
      
      {/* Top Hero Banner */}
      <div className="saas-card p-6 sm:p-10 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white rounded-3xl shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-400/20 border border-amber-400/30 px-3.5 py-1 text-xs font-semibold text-amber-300">
              <Zap className="h-4 w-4 animate-pulse" />
              <span>{language === 'mn' ? '10-Минутын Шуурхай Тусламж' : '10-Minute SOS Peer Help'}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              {language === 'mn' ? (
                <>
                  Ойлгохгүй байгаа сэдэв, бодлогоо оруулж, <br />
                  <span className="text-amber-300">10 минутад шуурхай тайлбар ав.</span>
                </>
              ) : (
                <>
                  Stuck on a topic or problem? <br />
                  <span className="text-amber-300">Get a quick 10-minute 1-on-1 explanation.</span>
                </>
              )}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {language === 'mn'
                ? 'Хичээлийн сэдэв, онол, бодлого эсвэл даалгаврын ойлгохгүй байгаа хэсгээ нийтэл. Шилдэг менторууд таны хүсэлтийг сонгон авч шууд Google Meet-ээр 10 минутад ганцаарчлан тайлбарлаж өгнө.'
                : 'Post any topic, concept, problem, or assignment you are struggling with. A proven mentor will pick up your question and explain it in a fast, focused 10-minute live session.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('ask')}
              className="px-6 py-3 rounded-xl text-xs font-bold bg-white text-zinc-900 hover:bg-zinc-100 transition-all shadow-md flex items-center justify-center gap-2"
            >
              <HelpCircle className="h-4 w-4 text-amber-500" />
              <span>{language === 'mn' ? 'Тусламж хүсэх' : 'Ask for Help'}</span>
            </button>
            <button
              onClick={() => setActiveTab('queue')}
              className="px-6 py-3 rounded-xl text-xs font-bold bg-zinc-800 text-white border border-zinc-700 hover:bg-zinc-700 transition-all flex items-center justify-center gap-2"
            >
              <Zap className="h-4 w-4 text-amber-400" />
              <span>{language === 'mn' ? 'Хүсэлтүүдэд туслах' : 'Mentor Queue'}</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-400 text-zinc-950 text-[10px] font-bold">
                {requests.filter((r) => r.status === 'open').length}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-medium text-emerald-900 flex items-center gap-2 shadow-sm animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-zinc-200 flex items-center gap-6">
        <button
          onClick={() => setActiveTab('ask')}
          className={`pb-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'ask'
              ? 'border-zinc-900 text-zinc-900'
              : 'border-transparent text-zinc-500 hover:text-zinc-800'
          }`}
        >
          <HelpCircle className="h-4 w-4" />
          <span>{language === 'mn' ? 'Тусламж хүсэх' : 'Request Help'}</span>
        </button>

        <button
          onClick={() => setActiveTab('queue')}
          className={`pb-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'queue'
              ? 'border-zinc-900 text-zinc-900'
              : 'border-transparent text-zinc-500 hover:text-zinc-800'
          }`}
        >
          <Zap className="h-4 w-4 text-amber-500" />
          <span>{language === 'mn' ? 'Шуурхай хүсэлтүүдийн сан (Ментор)' : 'Mentor SOS Queue'}</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700 font-bold">
            {requests.filter((r) => r.status === 'open').length} нээлттэй
          </span>
        </button>

        <button
          onClick={() => setActiveTab('my')}
          className={`pb-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'my'
              ? 'border-zinc-900 text-zinc-900'
              : 'border-transparent text-zinc-500 hover:text-zinc-800'
          }`}
        >
          <Clock className="h-4 w-4" />
          <span>{language === 'mn' ? 'Миний хүсэлтүүд' : 'My Requests'}</span>
          {myRequests.length > 0 && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold">
              {myRequests.length}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: ASK 10-MIN HELP (STUDENT FORM) */}
      {activeTab === 'ask' && (
        <div className="saas-card p-6 sm:p-10 max-w-3xl mx-auto space-y-6 shadow-sm">
          <div className="space-y-1.5 border-b border-zinc-100 pb-4">
            <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-500" />
              <span>{language === 'mn' ? '10-Минутын Шуурхай Тусламж Хүсэх' : 'Request 10-Minute Peer Help'}</span>
            </h2>
            <p className="text-xs text-zinc-500">
              {language === 'mn'
                ? 'Хичээлийн сэдэв, онол, бодлого эсвэл даалгавар дээрээ гацсан бол энд нийтлээрэй. Шилдэг ментор 10 минутын дотор ганцаарчлан зааж өгнө.'
                : 'Stuck on a topic, theory, problem, or assignment? Post it here and a proven mentor will explain it in a fast 10-minute 1-on-1 session.'}
            </p>
          </div>

          {errorMessage && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {!currentUser ? (
            /* If Not Logged In */
            <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-8 text-center space-y-4">
              <div className="h-12 w-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-sm">
                <User className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-zinc-900">
                  {language === 'mn' ? 'Шуурхай тусламж авахын тулд нэвтэрнэ үү' : 'Please Sign In to Request 10-Min Help'}
                </h3>
                <p className="text-xs text-zinc-600 max-w-md mx-auto">
                  {language === 'mn'
                    ? 'Таныг бүртгүүлэхэд оруулсан нэр, утасны дугаар, сургууль, анги, хүйс автоматаар менторт харагдах тул дахин бөглөх шаардлагагүй.'
                    : 'Your registered name, phone, school, grade, and gender will be attached automatically so you don’t need to re-type them.'}
                </p>
              </div>
              <Link
                href="/login?redirectTo=/sos"
                className="btn-primary inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white shadow-sm rounded-xl"
              >
                <span>{language === 'mn' ? 'Нэвтрэх / Бүртгүүлэх' : 'Sign In / Register'}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            /* Logged In Form */
            <form onSubmit={handleAskHelp} className="space-y-6">
              
              {/* Student Information Auto-attached Badge */}
              <div className="rounded-xl border border-zinc-200 bg-zinc-50/80 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                    {language === 'mn' ? 'Сурагчийн мэдээлэл (Таны бүртгэлээс автоматаар хавсаргагдана):' : 'Student Info (Auto-attached from your account):'}
                  </span>
                  <div className="flex flex-wrap items-center gap-2 text-zinc-700">
                    <span className="font-bold text-zinc-900 flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-blue-600" />
                      {profile?.name || currentUser.user_metadata?.name || currentUser.email?.split('@')[0]}
                    </span>
                    <span>•</span>
                    <span className="font-mono text-zinc-600">
                      {profile?.phone || currentUser.user_metadata?.phone || (
                        <Link href="/profile" className="text-amber-600 underline font-sans font-semibold">Утасны дугаараа оруулах</Link>
                      )}
                    </span>
                    <span>•</span>
                    <span className="text-zinc-600">{profile?.school || currentUser.user_metadata?.school || 'Сургууль'}</span>
                    <span>•</span>
                    <span className="font-semibold text-zinc-800">{profile?.grade || currentUser.user_metadata?.grade || 'Анги'}</span>
                    {(profile?.gender || currentUser.user_metadata?.gender) && (
                      <>
                        <span>•</span>
                        <span className="text-zinc-600">
                          {(profile?.gender || currentUser.user_metadata?.gender) === 'Female' ? 'Эмэгтэй' : 'Эрэгтэй'}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <Link href="/profile" className="text-[11px] text-blue-600 hover:underline font-semibold shrink-0">
                  {language === 'mn' ? 'Мэдээлэл засах' : 'Edit Info'}
                </Link>
              </div>

              {/* Help Type Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-zinc-800 flex items-center gap-1.5">
                  <HelpCircle className="h-3.5 w-3.5 text-zinc-600" />
                  <span>{language === 'mn' ? 'Ямар төрлийн тусламж хэрэгтэй байна вэ?' : 'What kind of help do you need?'}</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'topic', labelMn: '📖 Сэдэв / Онол', labelEn: '📖 Topic / Theory' },
                    { id: 'problem', labelMn: '✏️ Бодлого бодох арга', labelEn: '✏️ Problem Solving' },
                    { id: 'assignment', labelMn: '📝 Даалгавар / Шалгалт', labelEn: '📝 Assignment / Exam' },
                    { id: 'general', labelMn: '💡 Чөлөөт асуулт', labelEn: '💡 General Question' }
                  ].map((t) => (
                    <button
                      type="button"
                      key={t.id}
                      onClick={() => setHelpType(t.id as any)}
                      className={`p-2.5 rounded-xl text-xs font-semibold border transition-all text-left flex items-center justify-between ${
                        helpType === t.id
                          ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
                          : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                      }`}
                    >
                      <span>{language === 'mn' ? t.labelMn : t.labelEn}</span>
                      {helpType === t.id && <Check className="h-3 w-3 text-amber-300" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject & Curriculum */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-700">
                    {language === 'mn' ? 'Хичээл' : 'Subject'} *
                  </label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="saas-input bg-white text-xs"
                  >
                    {SUBJECT_LIST.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-700">
                    {language === 'mn' ? 'Хөтөлбөр' : 'Curriculum'}
                  </label>
                  <select
                    value={curriculum}
                    onChange={(e) => setCurriculum(e.target.value as any)}
                    className="saas-input bg-white text-xs"
                  >
                    <option value="National">{language === 'mn' ? 'Үндэсний хөтөлбөр (National)' : 'National Curriculum'}</option>
                    <option value="Cambridge">{language === 'mn' ? 'Кембриж хөтөлбөр (Cambridge)' : 'Cambridge Curriculum'}</option>
                    <option value="Both">{language === 'mn' ? 'Хоёулаа (National & Cambridge)' : 'Both Curricula'}</option>
                  </select>
                </div>
              </div>

              {/* Topic / Problem Title */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-700">
                  {language === 'mn' ? 'Сэдэв, бодлого эсвэл асуултын гарчиг' : 'Topic, problem or concept title'} *
                </label>
                <input
                  type="text"
                  required
                  placeholder={language === 'mn' ? 'e.g. Квадрат тэгшитгэл, Ньютоны 2-р хууль, Эсийн хуваагдал, 15-р хуудасны 3-р бодлого г.м' : 'e.g. Projectile Motion, Photosynthesis, Quadratic Equations'}
                  value={topicTitle}
                  onChange={(e) => setTopicTitle(e.target.value)}
                  className="saas-input text-xs"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-700">
                  {language === 'mn' ? 'Яг юун дээр гацаж, юуг нь ойлгохгүй байна вэ?' : 'What specifically do you not understand?'} *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder={language === 'mn' 
                    ? 'e.g. Энэ сэдвийн томьёог хэрэглэх үед яагаад ийм үр дүн гарч байгааг огт ойлгохгүй байна, эсвэл бодлогын 2-р алхам дээр гацсан. 10 минутад ойлгомжтой тайлбарлаж өгөөч...'
                    : 'e.g. I got stuck on this concept / formula. Looking for a mentor to clarify how it works in 10 minutes...'}
                  value={topicDescription}
                  onChange={(e) => setTopicDescription(e.target.value)}
                  className="saas-input text-xs leading-relaxed"
                />
              </div>

              {/* Attachment Link */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-zinc-700">
                    {language === 'mn' ? 'Зураг, даалгаврын холбоос' : 'Problem Photo or Doc Link'}
                  </label>
                  <span className="text-[10px] text-zinc-400">
                    {language === 'mn' ? 'Заавал биш / Optional' : 'Optional'}
                  </span>
                </div>
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                  <input
                    type="url"
                    placeholder="https://drive.google.com/... or image URL"
                    value={attachmentUrl}
                    onChange={(e) => setAttachmentUrl(e.target.value)}
                    className="saas-input pl-9 text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
              >
                <Zap className="h-4 w-4 text-amber-400" />
                <span>{submitting ? (language === 'mn' ? 'Илгээж байна...' : 'Submitting...') : (language === 'mn' ? '10-Минутын Шуурхай Тусламж Хүсэх' : 'Submit 10-Min SOS Request')}</span>
              </button>
            </form>
          )}
        </div>
      )}

      {/* TAB 2: MENTOR SOS QUEUE */}
      {activeTab === 'queue' && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="saas-card p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-zinc-500 mr-2 flex items-center gap-1">
                <Filter className="h-3.5 w-3.5" />
                {language === 'mn' ? 'Шүүлтүүр:' : 'Filters:'}
              </span>

              {/* Subject Filter */}
              <select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="saas-input py-1 px-2.5 text-xs bg-white w-auto"
              >
                <option value="All">{language === 'mn' ? 'Бүх хичээл' : 'All Subjects'}</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
                <option value="English">English</option>
                <option value="ICT">ICT</option>
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="saas-input py-1 px-2.5 text-xs bg-white w-auto"
              >
                <option value="All">{language === 'mn' ? 'Бүх төлөв' : 'All Statuses'}</option>
                <option value="open">{language === 'mn' ? 'Хүлээгдэж буй (Open)' : 'Open'}</option>
                <option value="claimed">{language === 'mn' ? 'Зааж буй (Claimed)' : 'In Progress'}</option>
                <option value="resolved">{language === 'mn' ? 'Шийдэгдсэн (Resolved)' : 'Resolved'}</option>
              </select>

              {/* Grade Filter */}
              <select
                value={gradeFilter}
                onChange={(e) => setGradeFilter(e.target.value)}
                className="saas-input py-1 px-2.5 text-xs bg-white w-auto"
              >
                <option value="All">{language === 'mn' ? 'Бүх анги' : 'All Grades'}</option>
                {['6', '7', '8', '9', '10', '11', '12'].map((g) => (
                  <option key={g} value={g}>{g}-р анги</option>
                ))}
              </select>

              {/* Help Type Filter */}
              <select
                value={helpTypeFilter}
                onChange={(e) => setHelpTypeFilter(e.target.value)}
                className="saas-input py-1 px-2.5 text-xs bg-white w-auto"
              >
                <option value="All">{language === 'mn' ? 'Бүх төрөл' : 'All Types'}</option>
                <option value="topic">{language === 'mn' ? '📖 Сэдэв / Онол' : 'Topic / Theory'}</option>
                <option value="problem">{language === 'mn' ? '✏️ Бодлого' : 'Problem Solving'}</option>
                <option value="assignment">{language === 'mn' ? '📝 Даалгавар' : 'Assignment'}</option>
                <option value="general">{language === 'mn' ? '💡 Чөлөөт асуулт' : 'General'}</option>
              </select>
            </div>

            <div className="text-xs text-zinc-500 font-medium">
              {filteredRequests.length} {language === 'mn' ? 'хүсэлт олдлоо' : 'requests found'}
            </div>
          </div>

          {/* Request Cards Grid */}
          {filteredRequests.length === 0 ? (
            <div className="saas-card p-16 text-center space-y-3">
              <div className="h-12 w-12 rounded-full bg-zinc-100 text-zinc-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-6 w-6 text-emerald-500" />
              </div>
              <h3 className="text-base font-bold text-zinc-900">
                {language === 'mn' ? 'Одоогоор хүлээгдэж буй асуулт байхгүй байна' : 'No pending requests in queue'}
              </h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                {language === 'mn'
                  ? 'Сурагчид шинээр сэдэв, бодлого оруулах үед энд шууд гарч ирнэ.'
                  : 'New student questions will appear here in real time.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredRequests.map((item) => {
                const isClaimedByMe = currentUser && item.mentorId === currentUser.id;
                return (
                  <div
                    key={item.id}
                    className={`saas-card p-6 space-y-4 transition-all flex flex-col justify-between ${
                      item.status === 'open' 
                        ? 'border-amber-200 bg-amber-50/20' 
                        : item.status === 'claimed' 
                        ? 'border-blue-200 bg-blue-50/20' 
                        : 'border-zinc-200 bg-white opacity-80'
                    }`}
                  >
                    <div className="space-y-3">
                      {/* Top Badges */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-100">
                            {item.helpType === 'topic' ? '📖 Сэдэв' : item.helpType === 'problem' ? '✏️ Бодлого' : item.helpType === 'assignment' ? '📝 Даалгавар' : '💡 Асуулт'}
                          </span>
                          <span className="badge-accent text-xs">
                            {item.subject}
                          </span>
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700">
                            {item.grade}
                          </span>
                          <span className="text-[11px] text-zinc-400">• {item.curriculum}</span>
                        </div>

                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          item.status === 'open'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : item.status === 'claimed'
                            ? 'bg-blue-100 text-blue-900 border border-blue-300'
                            : 'bg-emerald-100 text-emerald-900'
                        }`}>
                          {item.status === 'open' ? '🟡 Хүлээгдэж буй' : item.status === 'claimed' ? '🔵 Зааж байна' : '🟢 Шийдэгдсэн'}
                        </span>
                      </div>

                      {/* Problem Title & Description */}
                      <div className="space-y-1.5">
                        <h3 className="text-base font-bold text-zinc-900">
                          {item.title}
                        </h3>
                        <p className="text-xs text-zinc-700 leading-relaxed bg-white/70 p-3 rounded-xl border border-zinc-200/60">
                          {item.description}
                        </p>
                      </div>

                      {/* Attachment URL */}
                      {item.attachmentUrl && (
                        <div className="text-xs">
                          <a
                            href={item.attachmentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline font-medium inline-flex items-center gap-1"
                          >
                            <ExternalLink className="h-3 w-3" />
                            <span>{language === 'mn' ? 'Хавсаргасан файл / зураг үзэх' : 'View Attachment'}</span>
                          </a>
                        </div>
                      )}

                      {/* Student Info Card (Pulled automatically from student signup profile) */}
                      <div className="pt-2.5 border-t border-zinc-100 text-xs text-zinc-600 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <User className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                            <span className="font-bold text-zinc-900">{item.studentName}</span>
                            {item.gender && (
                              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600">
                                {item.gender === 'Female' ? 'Эмэгтэй' : 'Эрэгтэй'}
                              </span>
                            )}
                          </div>
                          <span className="text-zinc-500 font-medium">{item.school}</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                          <a
                            href={`tel:${item.phoneNumber}`}
                            className="flex items-center gap-1.5 text-blue-600 hover:underline font-mono font-semibold"
                            title="Шууд залгах"
                          >
                            <Phone className="h-3 w-3 text-blue-500" />
                            <span>Утас: {item.phoneNumber}</span>
                          </a>
                          <span className="text-zinc-500 font-medium">{item.grade}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="pt-4 border-t border-zinc-100 flex items-center justify-between gap-3">
                      <span className="text-[10px] text-zinc-400">
                        {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>

                      {item.status === 'open' && (
                        <button
                          onClick={() => handleClaimRequest(item)}
                          className="btn-primary px-4 py-2 text-xs font-bold text-white inline-flex items-center gap-1.5 shadow-sm"
                        >
                          <Zap className="h-3.5 w-3.5 text-amber-300" />
                          <span>{language === 'mn' ? 'Туслах (10-Min Call)' : 'Claim 10-Min Call'}</span>
                        </button>
                      )}

                      {item.status === 'claimed' && (
                        <div className="flex items-center gap-2">
                          {item.meetingLink && (
                            <a
                              href={item.meetingLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-secondary px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border-emerald-200 inline-flex items-center gap-1.5"
                            >
                              <Video className="h-3.5 w-3.5" />
                              <span>Meet</span>
                            </a>
                          )}
                          {isClaimedByMe && (
                            <button
                              onClick={() => handleResolveRequest(item)}
                              className="btn-primary px-3 py-1.5 text-xs font-medium text-white"
                            >
                              Шийдэгдсэн ✓
                            </button>
                          )}
                        </div>
                      )}

                      {item.status === 'resolved' && (
                        <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Амжилттай заасан</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: MY REQUESTS (STUDENT TRACKER) */}
      {activeTab === 'my' && (
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-zinc-900">
              {language === 'mn' ? 'Миний илгээсэн шуурхай хүсэлтүүд' : 'My 10-Min SOS Requests'}
            </h2>
            <p className="text-xs text-zinc-500">
              {language === 'mn'
                ? 'Таны оруулсан бодлогыг ментор авсан даруйд энд шууд Google Meet холбоос гарч ирнэ.'
                : 'Track the status of your questions. When a mentor claims your problem, your Google Meet link appears here.'}
            </p>
          </div>

          {myRequests.length === 0 ? (
            <div className="saas-card p-12 text-center space-y-4">
              <div className="h-12 w-12 rounded-full bg-zinc-100 text-zinc-400 flex items-center justify-center mx-auto">
                <HelpCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-zinc-900">
                  {language === 'mn' ? 'Одоогоор илгээсэн хүсэлт байхгүй байна' : 'No requests yet'}
                </h3>
                <p className="text-xs text-zinc-500 mt-1">
                  {language === 'mn' ? 'Ойлгохгүй гацсан бодлогоо оруулан 10 минутад тайлбар авна уу.' : 'Ask a question to receive a 10-minute explanation.'}
                </p>
              </div>
              <button
                onClick={() => setActiveTab('ask')}
                className="btn-primary px-4 py-2 text-xs font-bold text-white inline-flex items-center gap-2"
              >
                <Zap className="h-3.5 w-3.5 text-amber-400" />
                <span>{language === 'mn' ? 'Бодлого оруулах' : 'Ask for Help'}</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {myRequests.map((item) => (
                <div key={item.id} className="saas-card p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="badge-accent text-xs">{item.subject}</span>
                      <span className="text-xs font-semibold text-zinc-900">{item.title}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      item.status === 'open'
                        ? 'bg-amber-100 text-amber-900'
                        : item.status === 'claimed'
                        ? 'bg-blue-100 text-blue-900'
                        : 'bg-emerald-100 text-emerald-900'
                    }`}>
                      {item.status === 'open' ? '🟡 Хүлээгдэж буй (Open)' : item.status === 'claimed' ? '🔵 Ментор холбогдож байна' : '🟢 Шийдэгдсэн'}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-700 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Mentor Claimed Alert Box */}
                  {item.status === 'claimed' && (
                    <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4 space-y-3">
                      <div className="flex items-center gap-2 text-blue-950 font-bold text-xs">
                        <Sparkles className="h-4 w-4 text-amber-500" />
                        <span>
                          {language === 'mn'
                            ? `🎉 Ментор ${item.mentorName || 'Шилдэг ментор'} таны бодлогыг сонголоо!`
                            : `🎉 Mentor ${item.mentorName} claimed your problem!`}
                        </span>
                      </div>
                      <p className="text-xs text-blue-800">
                        {language === 'mn'
                          ? 'Доорх Google Meet холбоосоор орж 10 минутын хичээлдээ хамрагдана уу:'
                          : 'Join your 10-minute session via the Google Meet link below:'}
                      </p>
                      {item.meetingLink && (
                        <a
                          href={item.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white shadow-md"
                        >
                          <Video className="h-4 w-4 text-emerald-400" />
                          <span>{language === 'mn' ? 'Google Meet хичээлд орох' : 'Join Google Meet Now'}</span>
                          <ExternalLink className="h-3 w-3 opacity-70" />
                        </a>
                      )}
                    </div>
                  )}

                  {item.status === 'open' && (
                    <div className="text-xs text-amber-700 bg-amber-50 p-3 rounded-xl border border-amber-200/60 flex items-center gap-2">
                      <Clock className="h-4 w-4 shrink-0 animate-spin" />
                      <span>{language === 'mn' ? 'Таны хүсэлт нийтлэгдсэн байна. Ментор удахгүй холбогдоно.' : 'Waiting for a mentor to claim your request...'}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}

export default function SOSPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-16 text-center space-y-3">
          <div className="h-8 w-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin mx-auto" />
          <p className="text-xs text-zinc-500 font-medium">Уншиж байна / Loading...</p>
        </div>
      }
    >
      <SOSContent />
    </Suspense>
  );
}
