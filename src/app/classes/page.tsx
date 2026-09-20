'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useLanguage } from '@/lib/i18n';
import { 
  BookOpen, 
  Search, 
  Filter, 
  GraduationCap, 
  Calendar, 
  Users, 
  PlusCircle, 
  CheckCircle2, 
  Clock,
  ArrowRight,
  X,
  ChevronRight,
  Award
} from 'lucide-react';

function ClassesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language } = useLanguage();

  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [userEnrollments, setUserEnrollments] = useState<string[]>([]);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCurriculum, setSelectedCurriculum] = useState('All');
  const [selectedSize, setSelectedSize] = useState('All');
  
  // Slide-over drawer state
  const [selectedClassForDrawer, setSelectedClassForDrawer] = useState<any | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const curriculums = [
    { key: 'All', labelEn: 'All Curriculums', labelMn: 'Бүх хөтөлбөр' },
    { key: 'National', labelEn: 'National Curriculum', labelMn: 'Үндэсний хөтөлбөр' },
    { key: 'Cambridge', labelEn: 'Cambridge Curriculum', labelMn: 'Кембриж хөтөлбөр' },
  ];

  const sizes = [
    { key: 'All', labelEn: 'All Sizes', labelMn: 'Бүх хэмжээ' },
    { key: '1-on-1', labelEn: '1-on-1 (1 Seat)', labelMn: 'Ганцаарчилсан' },
    { key: 'Small', labelEn: 'Small (2–5 Seats)', labelMn: '2–5 суудал' },
    { key: 'Cohort', labelEn: 'Cohort (6+ Seats)', labelMn: '6+ суудал' },
  ];

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setCurrentUserId(session.user.id);
        const { data: enrollments } = await supabase
          .from('class_enrollments')
          .select('class_id')
          .eq('student_id', session.user.id);
        if (enrollments) {
          setUserEnrollments(enrollments.map((e) => e.class_id));
        }
      }

      const { data: classesData, error } = await supabase
        .from('sprint_classes')
        .select(`
          *,
          class_enrollments (
            id,
            student_id,
            status
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClasses(classesData || []);
    } catch (err: any) {
      console.error('Error loading classes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleClaimSeat = async (classItem: any) => {
    if (!currentUserId) {
      router.push(`/login?redirectTo=/classes`);
      return;
    }

    try {
      const { error } = await supabase
        .from('class_enrollments')
        .insert({
          class_id: classItem.id,
          student_id: currentUserId,
          status: classItem.enrollment_mode === 'instant' ? 'confirmed' : 'pending',
        });

      if (error) {
        if (error.code === '23505') {
          setNotification(language === 'mn' ? 'Та аль хэдийн энэ ангид бүртгүүлсэн байна.' : 'You are already enrolled in this sprint.');
        } else {
          throw error;
        }
      } else {
        setNotification(
          classItem.enrollment_mode === 'instant'
            ? language === 'mn' ? 'Суудал амжилттай баталгаажлаа! Танхимдаа нэвтэрнэ үү.' : 'Seat confirmed! Welcome to your cohort.'
            : language === 'mn' ? 'Хүсэлт илгээгдлээ. Ментор шалгасны дараа мэдэгдэнэ.' : 'Application submitted. Mentor will review shortly.'
        );
        fetchClasses();
      }
      setTimeout(() => setNotification(null), 5000);
    } catch (err: any) {
      alert(err.message || 'Enrollment error');
    }
  };

  const filteredClasses = classes.filter((cls) => {
    const matchesSearch =
      cls.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.mentor_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.subject.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesCurriculum = true;
    if (selectedCurriculum === 'National') {
      matchesCurriculum = cls.curriculum?.toLowerCase().includes('national');
    } else if (selectedCurriculum === 'Cambridge') {
      matchesCurriculum = cls.curriculum?.toLowerCase().includes('cambridge');
    }

    let matchesSize = true;
    if (selectedSize === '1-on-1') {
      matchesSize = cls.max_seats === 1;
    } else if (selectedSize === 'Small') {
      matchesSize = cls.max_seats >= 2 && cls.max_seats <= 5;
    } else if (selectedSize === 'Cohort') {
      matchesSize = cls.max_seats >= 6;
    }

    return matchesSearch && matchesCurriculum && matchesSize;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
              {language === 'mn' ? 'Сургалтуудын Жагсаалт' : 'Sprint Classes'}
            </h1>
            <span className="badge-accent text-xs">
              {filteredClasses.length} {language === 'mn' ? 'анги' : 'available'}
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              Үнэгүй / Free
            </span>
          </div>
          <p className="text-sm text-zinc-500 mt-1">
            {language === 'mn'
              ? 'Үндэсний болон Кембрижийн хөтөлбөрийн дагуу олимпиад, хичээлийн гүнзгийрүүлсэн сургалтууд.'
              : 'Peer-guided sprints under National and Cambridge curricula.'}
          </p>
        </div>

        <Link
          href="/classes/create"
          className="btn-primary inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-white self-start md:self-auto"
        >
          <PlusCircle className="h-4 w-4" />
          {language === 'mn' ? 'Шинэ хичээл зарлах' : 'Host a Sprint'}
        </Link>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-medium text-emerald-900 flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>{notification}</span>
          </div>
          <Link href="/dashboard" className="underline text-emerald-700 hover:text-emerald-900 ml-3">
            {language === 'mn' ? 'Хяналтын самбар луу очих →' : 'Go to Dashboard →'}
          </Link>
        </div>
      )}

      {/* Search & Filter Control Bar */}
      <div className="saas-card p-4 sm:p-5 space-y-4">
        
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder={language === 'mn' ? 'Хичээл, сэдэв, менторын нэрээр хайх...' : 'Search by subject, topic, or mentor name...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="saas-input pl-10"
          />
        </div>

        {/* Curriculum & Size Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
          {/* Curriculum Filter Pills */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-zinc-500">
              {language === 'mn' ? 'Хөтөлбөр:' : 'Curriculum:'}
            </span>
            <div className="inline-flex rounded-lg border border-zinc-200 p-0.5 bg-zinc-50">
              {curriculums.map((c) => (
                <button
                  key={c.key}
                  onClick={() => setSelectedCurriculum(c.key)}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    selectedCurriculum === c.key
                      ? 'bg-white text-zinc-900 shadow-sm border border-zinc-200/60 font-semibold'
                      : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  {language === 'mn' ? c.labelMn : c.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Size Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-zinc-500">
              {language === 'mn' ? 'Суудал:' : 'Seats:'}
            </span>
            <div className="inline-flex rounded-lg border border-zinc-200 p-0.5 bg-zinc-50">
              {sizes.map((s) => (
                <button
                  key={s.key}
                  onClick={() => setSelectedSize(s.key)}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors ${
                    selectedSize === s.key
                      ? 'bg-white text-zinc-900 shadow-sm border border-zinc-200/60 font-semibold'
                      : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  {language === 'mn' ? s.labelMn : s.labelEn}
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Sprint Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-72 saas-card animate-pulse bg-zinc-100" />
          ))}
        </div>
      ) : filteredClasses.length === 0 ? (
        <div className="saas-card p-16 text-center space-y-4">
          <div className="h-12 w-12 rounded-full bg-zinc-100 text-zinc-400 flex items-center justify-center mx-auto">
            <Search className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-zinc-900">
              {language === 'mn' ? 'Шалгуурт тохирох хичээл олдсонгүй' : 'No sprints match your filters'}
            </h3>
            <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
              {language === 'mn'
                ? 'Хайлтын үгээ өөрчлөх эсвэл шинэ анги зарлаарай.'
                : 'Try adjusting your search keywords or host a new sprint.'}
            </p>
          </div>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCurriculum('All');
              setSelectedSize('All');
            }}
            className="btn-secondary px-4 py-2 text-xs font-medium text-zinc-800"
          >
            {language === 'mn' ? 'Бүх шүүлтүүрийг арилгах' : 'Clear all filters'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map((cls) => {
            const confirmedCount = cls.class_enrollments?.filter((e: any) => e.status === 'confirmed').length || 0;
            const remainingSeats = Math.max(0, cls.max_seats - confirmedCount);
            const isEnrolled = userEnrollments.includes(cls.id);
            const isMentor = currentUserId === cls.mentor_id;

            return (
              <div 
                key={cls.id} 
                className="saas-card hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden"
              >
                <div className="p-6 space-y-4">
                  
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="badge-accent text-xs font-semibold">
                      {cls.subject}
                    </span>
                    <span className="text-[11px] font-semibold text-zinc-600 bg-zinc-100 px-2.5 py-0.5 rounded-md">
                      {cls.curriculum || 'National Curriculum'}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 
                      onClick={() => setSelectedClassForDrawer(cls)}
                      className="text-base font-semibold text-zinc-900 hover:text-blue-600 transition-colors cursor-pointer line-clamp-2"
                    >
                      {cls.title}
                    </h3>
                    <p className="text-xs text-zinc-500 line-clamp-2 mt-1.5 leading-relaxed">
                      {cls.description}
                    </p>
                  </div>

                  {/* Mentor Profile info */}
                  <div className="flex items-center gap-3 pt-2 border-t border-zinc-100">
                    <div className="h-9 w-9 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-xs">
                      {cls.mentor_name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-zinc-900 truncate">
                        {cls.mentor_name}
                      </div>
                      <div className="text-[11px] text-zinc-500 truncate flex items-center gap-1">
                        <GraduationCap className="h-3 w-3 text-zinc-400" />
                        <span>{cls.mentor_school}</span>
                      </div>
                    </div>
                  </div>

                  {/* Logistics: Schedule & Duration (No price) */}
                  <div className="rounded-lg bg-zinc-50 p-3 space-y-1.5 text-xs text-zinc-600">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500 flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-zinc-400" />
                        {cls.duration_weeks} {language === 'mn' ? 'долоо хоног' : 'weeks'}
                      </span>
                      <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                        Үнэгүй / Free
                      </span>
                    </div>
                    <div className="text-[11px] text-zinc-500 truncate">
                      {cls.schedule_summary}
                    </div>
                  </div>

                  {/* Seat Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-500">
                        {remainingSeats === 0 ? (
                          <span className="text-rose-600 font-medium">{language === 'mn' ? 'Суудал дүүрсэн' : 'Cohort Full'}</span>
                        ) : (
                          <span>{remainingSeats} {language === 'mn' ? 'суудал үлдсэн' : 'seats left'}</span>
                        )}
                      </span>
                      <span className="text-[11px] font-medium text-zinc-700">
                        {confirmedCount} / {cls.max_seats} {language === 'mn' ? 'бүртгэгдсэн' : 'enrolled'}
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-zinc-100 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${remainingSeats === 0 ? 'bg-zinc-400' : 'bg-zinc-900'}`}
                        style={{ width: `${Math.min(100, (confirmedCount / cls.max_seats) * 100)}%` }}
                      />
                    </div>
                  </div>

                </div>

                {/* Card Actions Footer */}
                <div className="border-t border-zinc-100 bg-zinc-50/50 p-4 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedClassForDrawer(cls)}
                    className="btn-secondary flex-1 py-2 text-xs font-medium text-zinc-800 text-center"
                  >
                    {language === 'mn' ? 'Дэлгэрэнгүй' : 'Details'}
                  </button>

                  {isEnrolled ? (
                    <Link
                      href={`/class/${cls.id}`}
                      className="btn-primary flex-1 py-2 text-xs font-medium text-white text-center flex items-center justify-center gap-1"
                    >
                      <span>{language === 'mn' ? 'Танхим' : 'Open Space'}</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  ) : isMentor ? (
                    <Link
                      href={`/class/${cls.id}`}
                      className="btn-primary flex-1 py-2 text-xs font-medium text-white text-center"
                    >
                      {language === 'mn' ? 'Удирдах' : 'Manage'}
                    </Link>
                  ) : remainingSeats === 0 ? (
                    <button
                      disabled
                      className="flex-1 py-2 text-xs font-medium text-zinc-400 bg-zinc-100 rounded-lg cursor-not-allowed text-center"
                    >
                      {language === 'mn' ? 'Дүүрсэн' : 'Full'}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleClaimSeat(cls)}
                      className="btn-primary flex-1 py-2 text-xs font-medium text-white text-center"
                    >
                      {cls.enrollment_mode === 'instant'
                        ? language === 'mn' ? 'Суудал авах' : 'Claim Seat'
                        : language === 'mn' ? 'Хүсэлт илгээх' : 'Apply'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Slide-over Detail Drawer */}
      {selectedClassForDrawer && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div 
            onClick={() => setSelectedClassForDrawer(null)}
            className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm transition-opacity" 
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
              
              {/* Drawer Header */}
              <div className="p-6 border-b border-zinc-200 flex items-start justify-between">
                <div>
                  <span className="badge-accent text-xs">
                    {selectedClassForDrawer.subject}
                  </span>
                  <h2 className="text-lg font-bold text-zinc-900 mt-2">
                    {selectedClassForDrawer.title}
                  </h2>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {selectedClassForDrawer.curriculum} • {selectedClassForDrawer.duration_weeks} {language === 'mn' ? 'долоо хоног' : 'weeks'}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedClassForDrawer(null)}
                  className="rounded-lg p-1.5 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="p-6 overflow-y-auto space-y-6 text-xs text-zinc-600">
                
                {/* Mentor Bio */}
                <div className="rounded-xl border border-zinc-200 p-4 space-y-2 bg-zinc-50/50">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                    {language === 'mn' ? 'Хөтлөх Ментор' : 'Mentor'}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-sm">
                      {selectedClassForDrawer.mentor_name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-zinc-900">
                        {selectedClassForDrawer.mentor_name}
                      </div>
                      <div className="text-xs text-zinc-500 flex items-center gap-1">
                        <GraduationCap className="h-3.5 w-3.5 text-zinc-400" />
                        <span>{selectedClassForDrawer.mentor_school}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-900">
                    {language === 'mn' ? 'Сургалтын тухай' : 'Sprint Overview'}
                  </h4>
                  <p className="text-xs text-zinc-600 leading-relaxed whitespace-pre-line">
                    {selectedClassForDrawer.description}
                  </p>
                </div>

                {/* Schedule & Logistics */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-900">
                    {language === 'mn' ? 'Хуваарь' : 'Schedule'}
                  </h4>
                  <div className="rounded-xl border border-zinc-100 bg-zinc-50 p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500">{language === 'mn' ? 'Цагийн хуваарь' : 'Timing'}</span>
                      <span className="font-medium text-zinc-900">{selectedClassForDrawer.schedule_summary}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500">{language === 'mn' ? 'Суудлын тоо' : 'Capacity'}</span>
                      <span className="font-medium text-zinc-900">{selectedClassForDrawer.max_seats} {language === 'mn' ? 'сурагч' : 'seats'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500">{language === 'mn' ? 'Төлбөр' : 'Cost'}</span>
                      <span className="font-semibold text-emerald-700">{language === 'mn' ? 'Үнэгүй (100% Free)' : 'Free'}</span>
                    </div>
                  </div>
                </div>

                {/* Weekly Missions Breakdown */}
                {selectedClassForDrawer.missions && Array.isArray(selectedClassForDrawer.missions) && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-900">
                      {language === 'mn' ? 'Даалгаврын төлөвлөгөө' : 'Missions Roadmap'}
                    </h4>
                    <div className="space-y-2.5">
                      {selectedClassForDrawer.missions.map((m: any, idx: number) => (
                        <div key={idx} className="rounded-lg border border-zinc-200 p-3 space-y-1">
                          <div className="font-semibold text-zinc-900">
                            Week {m.weekNumber || idx + 1}: {m.title}
                          </div>
                          {m.description && (
                            <p className="text-zinc-500 text-[11px] leading-relaxed">
                              {m.description}
                            </p>
                          )}
                          {m.deliverablePrompt && (
                            <div className="pt-1 text-[11px] text-zinc-700 font-medium">
                              🎯 Deliverable: {m.deliverablePrompt}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Drawer Footer CTA */}
              <div className="p-6 border-t border-zinc-200 bg-zinc-50/50 flex items-center gap-3">
                {userEnrollments.includes(selectedClassForDrawer.id) ? (
                  <Link
                    href={`/class/${selectedClassForDrawer.id}`}
                    className="btn-primary w-full py-2.5 text-xs font-medium text-white text-center flex items-center justify-center gap-2"
                  >
                    <span>{language === 'mn' ? 'Танхим руу орох' : 'Open Cohort Space'}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      handleClaimSeat(selectedClassForDrawer);
                      setSelectedClassForDrawer(null);
                    }}
                    className="btn-primary w-full py-2.5 text-xs font-medium text-white text-center"
                  >
                    {selectedClassForDrawer.enrollment_mode === 'instant'
                      ? language === 'mn' ? 'Суудал авах (Үнэгүй)' : 'Claim Free Seat'
                      : language === 'mn' ? 'Хүсэлт илгээх' : 'Apply'}
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function ClassesPage() {
  return (
    <Suspense fallback={
      <div className="mx-auto max-w-7xl px-4 py-12 text-center text-zinc-400">
        Loading sprint directory...
      </div>
    }>
      <ClassesContent />
    </Suspense>
  );
}
