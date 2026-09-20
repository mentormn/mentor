'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useMentorStore } from '@/lib/store';
import { TIER_CONFIGS } from '@/lib/engine/tierProgression';
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
  ArrowRight
} from 'lucide-react';

export default function ClassesPage() {
  const { classes, user, claimSeat } = useMentorStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedSize, setSelectedSize] = useState('All');
  const [notification, setNotification] = useState<string | null>(null);

  const subjects = ['All', 'Mathematics', 'Physics', 'Computer Science', 'Informatics', 'Chemistry'];
  const sizes = ['All', '1-on-1 (1 Seat)', 'Micro-Pod (2-3 Seats)', 'Cohort (4-10 Seats)'];

  const filteredClasses = classes.filter((cls) => {
    const matchesSearch =
      cls.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.mentorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.subject.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSubject = selectedSubject === 'All' || cls.subject === selectedSubject;

    let matchesSize = true;
    if (selectedSize === '1-on-1 (1 Seat)') {
      matchesSize = cls.maxSeats === 1;
    } else if (selectedSize === 'Micro-Pod (2-3 Seats)') {
      matchesSize = cls.maxSeats >= 2 && cls.maxSeats <= 3;
    } else if (selectedSize === 'Cohort (4-10 Seats)') {
      matchesSize = cls.maxSeats >= 4;
    }

    return matchesSearch && matchesSubject && matchesSize;
  });

  const handleClaimSeat = (classId: string) => {
    const result = claimSeat(classId);
    setNotification(result.message);
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-blue-600" />
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Sprint Classes Directory
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Browse 1–3 week focused sprint classes. Join a micro-pod or cohort and learn from peers who mastered the subject.
          </p>
        </div>

        <Link
          href="/classes/create"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-500 transition-all active:scale-95"
        >
          <PlusCircle className="h-4 w-4" />
          Open a Class as Mentor
        </Link>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm font-semibold text-blue-900 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-200 flex items-center justify-between shadow-sm animate-in fade-in">
          <span>{notification}</span>
          <Link href="/profile" className="text-xs underline font-bold">
            View in My Learning →
          </Link>
        </div>
      )}

      {/* Search & Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by topic, subject, or mentor name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:focus:border-blue-400 text-slate-900 dark:text-white transition-all"
            />
          </div>

          {/* Subject Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            <Filter className="h-4 w-4 text-slate-400 shrink-0" />
            {subjects.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedSubject === sub
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>

        </div>

        {/* Size Filter Pills */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <span className="text-slate-500 font-medium">Cohort Size:</span>
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`rounded-md px-2.5 py-1 font-medium transition-colors ${
                selectedSize === size
                  ? 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.map((cls) => {
          const seatsLeft = cls.maxSeats - cls.enrolledStudents.length;
          const tierConfig = TIER_CONFIGS[cls.mentorTier];
          const isUserEnrolled = cls.enrolledStudents.some((s) => s.id === user.id);
          const isUserMentor = cls.mentorId === user.id;

          return (
            <div
              key={cls.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="space-y-3.5">
                
                {/* Subject & Formal Tier Badge */}
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-xs text-blue-600 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-md">
                    {cls.subject} • {cls.curriculum}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${tierConfig.badgeClass}`}
                  >
                    <Sparkles className="h-2.5 w-2.5" />
                    {tierConfig.titleEn}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                  {cls.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                  {cls.description}
                </p>

                {/* Mentor & Schedule Details */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span>
                      Mentor: <strong className="font-semibold text-slate-900 dark:text-white">{cls.mentorName}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span>{cls.durationWeeks} Weeks ({cls.startDate} to {cls.endDate})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span className="line-clamp-1">{cls.scheduleSummary}</span>
                  </div>
                </div>

                {/* Visual Seat Capacity Bar */}
                <div className="pt-2 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Seats: {cls.enrolledStudents.length} / {cls.maxSeats}
                    </span>
                    {seatsLeft > 0 ? (
                      <span className="text-[11px] font-bold text-emerald-600">
                        {seatsLeft} {seatsLeft === 1 ? 'seat left' : 'seats left'}
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-amber-600">Class Full</span>
                    )}
                  </div>

                  <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        seatsLeft === 0 ? 'bg-amber-500' : 'bg-blue-600'
                      }`}
                      style={{
                        width: `${Math.round((cls.enrolledStudents.length / cls.maxSeats) * 100)}%`,
                      }}
                    />
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <Link
                  href={`/class/${cls.id}`}
                  className="flex-1 text-center rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Class Space
                </Link>

                {isUserMentor ? (
                  <span className="rounded-xl bg-blue-100 px-3 py-2.5 text-xs font-bold text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                    Teaching
                  </span>
                ) : isUserEnrolled ? (
                  <span className="inline-flex items-center gap-1 rounded-xl bg-emerald-100 px-3 py-2.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Enrolled
                  </span>
                ) : seatsLeft > 0 ? (
                  <button
                    onClick={() => handleClaimSeat(cls.id)}
                    className="flex-1 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white hover:bg-blue-500 transition-all shadow-sm active:scale-95"
                  >
                    Claim Seat
                  </button>
                ) : (
                  <button
                    disabled
                    className="flex-1 rounded-xl bg-slate-200 py-2.5 text-xs font-bold text-slate-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-600"
                  >
                    Full
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {filteredClasses.length === 0 && (
        <div className="text-center py-16 space-y-4 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-8">
          <BookOpen className="mx-auto h-12 w-12 text-slate-400" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No sprint classes found matching your criteria
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search terms or subject filters, or open a new class on this topic as a mentor!
          </p>
          <Link
            href="/classes/create"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500"
          >
            <PlusCircle className="h-4 w-4" /> Open a Class Now
          </Link>
        </div>
      )}

    </div>
  );
}
