'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { useLanguage } from '@/lib/i18n';
import { TIER_CONFIGS } from '@/lib/engine/tierProgression';
import { FormalTier } from '@/lib/types';
import { 
  BookOpen, 
  Search, 
  Filter, 
  GraduationCap, 
  Calendar, 
  Users, 
  PlusCircle, 
  Sparkles, 
  CheckCircle2, 
  Clock,
  ArrowRight,
  Coins,
  ShieldCheck
} from 'lucide-react';

export default function ClassesPage() {
  const { language, t } = useLanguage();
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [userEnrollments, setUserEnrollments] = useState<string[]>([]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedSize, setSelectedSize] = useState('All');
  const [selectedPrice, setSelectedPrice] = useState('All');
  const [notification, setNotification] = useState<string | null>(null);

  const subjects = ['All', 'Mathematics', 'Physics', 'Computer Science', 'Informatics', 'Chemistry'];
  const sizes = [
    { key: 'All', labelEn: 'All', labelMn: 'Бүгд' },
    { key: '1-on-1', labelEn: '1-on-1 (1 Seat)', labelMn: 'Ганцаарчилсан (1 суудал)' },
    { key: 'Micro-Pod', labelEn: 'Micro-Pod (2-3 Seats)', labelMn: 'Бичил анги (2-3 суудал)' },
    { key: 'Cohort', labelEn: 'Cohort (4-10 Seats)', labelMn: 'Бүлэг анги (4-10 суудал)' },
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

      // Fetch classes with enrollment counts
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

  const handleClaimSeat = async (classId: string, enrollmentMode: string) => {
    if (!currentUserId) {
      window.location.href = `/login?redirectTo=/classes`;
      return;
    }

    try {
      const { error } = await supabase
        .from('class_enrollments')
        .insert({
          class_id: classId,
          student_id: currentUserId,
          status: enrollmentMode === 'instant' ? 'confirmed' : 'pending',
        });

      if (error) {
        if (error.code === '23505') {
          setNotification(language === 'mn' ? 'Та аль хэдийн энэ ангид бүртгүүлсэн байна.' : 'You are already enrolled in this sprint.');
        } else {
          throw error;
        }
      } else {
        setNotification(
          enrollmentMode === 'instant'
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

    const matchesSubject = selectedSubject === 'All' || cls.subject.toLowerCase() === selectedSubject.toLowerCase();

    let matchesSize = true;
    if (selectedSize === '1-on-1') {
      matchesSize = cls.max_seats === 1;
    } else if (selectedSize === 'Micro-Pod') {
      matchesSize = cls.max_seats >= 2 && cls.max_seats <= 3;
    } else if (selectedSize === 'Cohort') {
      matchesSize = cls.max_seats >= 4;
    }

    let matchesPrice = true;
    if (selectedPrice === 'Free') {
      matchesPrice = !cls.price_mnt || cls.price_mnt === 0;
    } else if (selectedPrice === 'Paid') {
      matchesPrice = cls.price_mnt > 0;
    }

    return matchesSearch && matchesSubject && matchesSize && matchesPrice;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-400" />
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {t('classesTitle')}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            {t('classesSub')}
          </p>
        </div>

        <Link
          href="/classes/create"
          className="btn-primary inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium text-white"
        >
          <PlusCircle className="h-4 w-4" />
          {t('navOpenClass')}
        </Link>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="rounded-xl border border-blue-500/30 bg-blue-950/50 p-4 text-xs font-medium text-blue-200 flex items-center justify-between shadow-lg animate-in fade-in">
          <span>{notification}</span>
          <Link href="/profile" className="underline text-blue-400 hover:text-blue-300 ml-3">
            {language === 'mn' ? 'Профайлаа харах →' : 'View in Profile →'}
          </Link>
        </div>
      )}

      {/* Search & Filters */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-white/[0.08] bg-zinc-900/60 pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none transition-all"
            />
          </div>

          {/* Subject Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <Filter className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
            {subjects.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`rounded-lg px-2.5 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedSubject === sub
                    ? 'bg-blue-600 text-white'
                    : 'bg-zinc-900/60 text-zinc-400 hover:text-white border border-white/[0.06]'
                }`}
              >
                {sub === 'All' ? (language === 'mn' ? 'Бүх салбар' : 'All') : sub}
              </button>
            ))}
          </div>

        </div>

        {/* Filters Row (Size & Price) */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-white/[0.06] text-xs">
          <div className="flex items-center gap-2">
            <span className="text-zinc-500 text-[11px]">{t('filterSize')}:</span>
            {sizes.map((s) => (
              <button
                key={s.key}
                onClick={() => setSelectedSize(s.key)}
                className={`rounded-md px-2 py-1 text-[11px] transition-colors ${
                  selectedSize === s.key
                    ? 'bg-zinc-800 text-white border border-white/[0.1]'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {language === 'mn' ? s.labelMn : s.labelEn}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-zinc-500 text-[11px]">{t('filterPrice')}:</span>
            {['All', 'Free', 'Paid'].map((p) => (
              <button
                key={p}
                onClick={() => setSelectedPrice(p)}
                className={`rounded-md px-2 py-1 text-[11px] transition-colors ${
                  selectedPrice === p
                    ? 'bg-zinc-800 text-white border border-white/[0.1]'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {p === 'All' ? t('priceAll') : p === 'Free' ? t('priceFree') : t('pricePaid')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-panel rounded-2xl p-6 h-64 animate-pulse space-y-4">
              <div className="h-4 bg-zinc-800 rounded w-1/3" />
              <div className="h-6 bg-zinc-800 rounded w-3/4" />
              <div className="h-12 bg-zinc-800/50 rounded w-full" />
            </div>
          ))}
        </div>
      )}

      {/* Classes Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredClasses.map((cls) => {
            const enrollments = cls.class_enrollments || [];
            const seatsLeft = cls.max_seats - enrollments.length;
            const tierKey = (cls.mentor_tier || 'JUNIOR_MENTOR') as FormalTier;
            const tierConfig = TIER_CONFIGS[tierKey] || TIER_CONFIGS['JUNIOR_MENTOR'];
            const isUserEnrolled = userEnrollments.includes(cls.id);
            const isUserMentor = cls.mentor_id === currentUserId;

            return (
              <div
                key={cls.id}
                className="glass-panel-interactive rounded-2xl p-5 sm:p-6 flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  
                  {/* Subject & Formal Tier Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-medium text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-md">
                      {cls.subject} • {cls.curriculum}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${tierConfig.badgeClass}`}
                    >
                      <Sparkles className="h-2.5 w-2.5" />
                      {language === 'mn' ? tierConfig.titleMn : tierConfig.titleEn}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-blue-300 transition-colors leading-snug">
                    {cls.title}
                  </h3>

                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {cls.description}
                  </p>

                  {/* Mentor & Schedule Details */}
                  <div className="pt-3 border-t border-white/[0.06] space-y-1.5 text-xs text-zinc-400">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                        <span>{cls.mentor_name}</span>
                      </div>
                      <span className="text-[11px] text-zinc-500">{cls.mentor_school}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                        <span>{cls.duration_weeks} {language === 'mn' ? 'долоо хоног' : 'weeks'}</span>
                      </div>
                      <span className="text-[11px] font-medium text-emerald-400">
                        {!cls.price_mnt || cls.price_mnt === 0 ? t('priceFree') : `${cls.price_mnt.toLocaleString()} ₮`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                      <span className="line-clamp-1 text-[11px] text-zinc-400">{cls.schedule_summary}</span>
                    </div>
                  </div>

                  {/* Seat Capacity Bar */}
                  <div className="pt-2 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-zinc-400">
                        {enrollments.length} / {cls.max_seats} {t('seatsFilled')}
                      </span>
                      {seatsLeft > 0 ? (
                        <span className="font-medium text-emerald-400">
                          {seatsLeft} {seatsLeft === 1 ? t('seatLeft') : t('seatsLeftPlural')}
                        </span>
                      ) : (
                        <span className="font-medium text-amber-400">{t('classFull')}</span>
                      )}
                    </div>

                    <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          seatsLeft === 0 ? 'bg-amber-500' : 'bg-blue-500'
                        }`}
                        style={{
                          width: `${Math.min(100, Math.round((enrollments.length / cls.max_seats) * 100))}%`,
                        }}
                      />
                    </div>
                  </div>

                </div>

                {/* Action Buttons */}
                <div className="mt-5 pt-3 border-t border-white/[0.06] flex items-center gap-2">
                  <Link
                    href={`/class/${cls.id}`}
                    className="flex-1 text-center rounded-lg border border-white/[0.08] bg-zinc-900/60 py-2 text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all"
                  >
                    {t('classSpaceBtn')}
                  </Link>

                  {isUserMentor ? (
                    <span className="rounded-lg bg-blue-500/10 border border-blue-500/20 px-3 py-2 text-xs font-medium text-blue-400">
                      {t('teachingBadge')}
                    </span>
                  ) : isUserEnrolled ? (
                    <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 text-xs font-medium text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5" /> {t('enrolledBadge')}
                    </span>
                  ) : seatsLeft > 0 ? (
                    <button
                      onClick={() => handleClaimSeat(cls.id, cls.enrollment_mode || 'instant')}
                      className="flex-1 btn-primary py-2 rounded-lg text-xs font-medium text-white transition-all active:scale-95"
                    >
                      {cls.enrollment_mode === 'application' ? t('applySeat') : t('claimSeat')}
                    </button>
                  ) : (
                    <button
                      disabled
                      className="flex-1 rounded-lg bg-zinc-800 py-2 text-xs font-medium text-zinc-500 cursor-not-allowed"
                    >
                      {t('classFull')}
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {!loading && filteredClasses.length === 0 && (
        <div className="glass-panel text-center py-16 space-y-4 rounded-2xl border-dashed border-white/[0.1] p-8">
          <BookOpen className="mx-auto h-10 w-10 text-zinc-600" />
          <h3 className="text-sm font-semibold text-white">
            {t('noClassesFound')}
          </h3>
          <Link
            href="/classes/create"
            className="btn-primary inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium text-white"
          >
            <PlusCircle className="h-4 w-4" /> {t('navOpenClass')}
          </Link>
        </div>
      )}

    </div>
  );
}
