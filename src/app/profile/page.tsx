'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useMentorStore } from '@/lib/store';
import { TIER_CONFIGS, getNextTierProgress } from '@/lib/engine/tierProgression';
import { 
  User as UserIcon, 
  GraduationCap, 
  BookOpen, 
  Award, 
  Sparkles, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  PlusCircle, 
  ShieldCheck, 
  ExternalLink,
  Flame,
  Clock,
  Layers
} from 'lucide-react';

export default function ProfilePage() {
  const { user, classes, deliverables, certificates } = useMentorStore();
  const [activeTab, setActiveTab] = useState<'learning' | 'mentoring'>('learning');

  const tierConfig = TIER_CONFIGS[user.mentorTier];
  const nextTierProgress = getNextTierProgress(user.mentorXp, user.mentorTier);

  // Enrolled classes (learner view)
  const enrolledClasses = classes.filter((c) =>
    user.enrolledClassIds.includes(c.id) || c.enrolledStudents.some((s) => s.id === user.id)
  );

  // Teaching classes (mentor view)
  const teachingClasses = classes.filter((c) => c.mentorId === user.id);

  // User deliverables
  const userDeliverables = deliverables.filter((d) => d.studentId === user.id);

  // User certificates
  const userCertificates = certificates.filter((c) => c.mentorId === user.id);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      
      {/* Unified Profile Header Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          
          <div className="flex items-center gap-4">
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={user.avatar}
                alt={user.name}
                className="h-20 w-20 rounded-2xl object-cover border-2 border-slate-200 dark:border-slate-700 shadow-sm"
              />
              <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white ring-2 ring-white">
                <CheckCircle2 className="h-4 w-4" />
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                  {user.name}
                </h1>
                <span
                  className={`inline-flex items-center gap-1 rounded-md px-2.5 py-0.5 text-xs font-extrabold uppercase border ${tierConfig.badgeClass}`}
                >
                  <Sparkles className="h-3 w-3" />
                  {tierConfig.titleEn}
                </span>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                {user.email} • {user.gender}, {user.age} y/o
              </p>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-300 pt-1">
                <span className="flex items-center gap-1">
                  <GraduationCap className="h-3.5 w-3.5 text-slate-400" />
                  {user.grade} • {user.school}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  {user.location}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-3 border-t sm:border-t-0 sm:border-l border-slate-100 dark:border-slate-800 pt-4 sm:pt-0 sm:pl-6">
            <div className="text-center px-2">
              <p className="text-xs font-semibold text-slate-500">Mentor XP</p>
              <p className="text-xl font-black text-blue-600">{user.mentorXp}</p>
            </div>
            <div className="text-center px-2">
              <p className="text-xs font-semibold text-slate-500">Students Taught</p>
              <p className="text-xl font-black text-emerald-600">{user.totalStudentsMentored}</p>
            </div>
            <div className="text-center px-2">
              <p className="text-xs font-semibold text-slate-500">Enrolled</p>
              <p className="text-xl font-black text-slate-800 dark:text-slate-200">
                {enrolledClasses.length}
              </p>
            </div>
          </div>

        </div>

        {/* Specializations & Learning Goals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="space-y-1.5">
            <span className="font-bold uppercase tracking-wider text-slate-500">
              Can Mentor (Specializations):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {user.specializations.map((spec) => (
                <span
                  key={spec}
                  className="rounded-lg bg-emerald-50 text-emerald-800 px-2.5 py-1 font-semibold border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800"
                >
                  ✓ {spec}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="font-bold uppercase tracking-wider text-slate-500">
              Currently Learning (Goals):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {user.learningGoals.map((goal) => (
                <span
                  key={goal}
                  className="rounded-lg bg-blue-50 text-blue-800 px-2.5 py-1 font-semibold border border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800"
                >
                  ⚡ {goal}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Dual-Identity View Switcher Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('learning')}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'learning'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <BookOpen className="h-4 w-4" />
          My Learning (As a Student)
          <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
            {enrolledClasses.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('mentoring')}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'mentoring'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <GraduationCap className="h-4 w-4" />
          My Mentoring (As a Mentor)
          <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
            {teachingClasses.length}
          </span>
        </button>
      </div>

      {/* TAB 1: Learner View */}
      {activeTab === 'learning' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Enrolled Sprint Classes
            </h2>
            <Link
              href="/classes"
              className="text-xs font-bold text-blue-600 hover:text-blue-500 flex items-center gap-1"
            >
              Browse More Classes →
            </Link>
          </div>

          {enrolledClasses.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-8 text-center text-xs text-slate-500 space-y-3">
              <p>You are not currently enrolled in any sprint classes.</p>
              <Link
                href="/classes"
                className="inline-block rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500"
              >
                Find a Class to Join
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {enrolledClasses.map((cls) => (
                <div
                  key={cls.id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-md">
                      {cls.subject}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {cls.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Mentor: <strong>{cls.mentorName}</strong> ({cls.mentorSchool})
                    </p>
                    <p className="text-xs text-slate-500">
                      Schedule: {cls.scheduleSummary}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Enrolled
                    </span>
                    <Link
                      href={`/class/${cls.id}`}
                      className="rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-blue-500"
                    >
                      Enter Class Space →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Submissions Section */}
          <div className="pt-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              My Submitted Artifacts
            </h3>
            {userDeliverables.length === 0 ? (
              <p className="text-xs text-slate-500">No deliverables submitted yet.</p>
            ) : (
              <div className="space-y-3">
                {userDeliverables.map((del) => (
                  <div
                    key={del.id}
                    className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{del.title}</p>
                      <a
                        href={del.urlOrNotes}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {del.urlOrNotes}
                      </a>
                    </div>
                    <span
                      className={`font-bold px-2.5 py-1 rounded-full ${
                        del.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {del.status === 'approved' ? 'Certified ✓' : 'Under Review'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Mentor View */}
      {activeTab === 'mentoring' && (
        <div className="space-y-8">
          
          {/* Formal Tier Level-Up Card */}
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">
                  Formal Mentor Distinction Tier
                </span>
                <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-amber-400" />
                  {tierConfig.titleEn}
                </h2>
                <p className="text-xs text-blue-200">
                  {tierConfig.description}
                </p>
              </div>

              <div className="rounded-xl bg-white/10 px-4 py-2 backdrop-blur text-right">
                <p className="text-[10px] uppercase font-bold text-blue-300">Current XP</p>
                <p className="text-2xl font-black text-amber-300">{user.mentorXp} XP</p>
              </div>
            </div>

            {/* Progress Bar to Next Tier */}
            {nextTierProgress.nextTierConfig && (
              <div className="space-y-2 pt-2 border-t border-white/10">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-blue-200">
                    Progress to{' '}
                    <strong className="text-white font-bold">
                      {nextTierProgress.nextTierConfig.titleEn}
                    </strong>
                  </span>
                  <span className="text-amber-300 font-bold">
                    {nextTierProgress.progressPercent}% ({nextTierProgress.xpNeeded} XP needed)
                  </span>
                </div>

                <div className="h-2.5 w-full rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-400 to-amber-400 transition-all"
                    style={{ width: `${nextTierProgress.progressPercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Classes Taught */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Classes You Are Teaching ({teachingClasses.length})
              </h3>
              <Link
                href="/classes/create"
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-blue-500 shadow-sm"
              >
                <PlusCircle className="h-3.5 w-3.5" /> Open Another Class
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {teachingClasses.map((cls) => (
                <div
                  key={cls.id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-md">
                      {cls.subject}
                    </span>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      {cls.title}
                    </h4>
                    <p className="text-xs text-slate-500">
                      Roster: <strong>{cls.enrolledStudents.length} / {cls.maxSeats} students</strong>
                    </p>
                    <p className="text-xs text-slate-500">
                      Duration: {cls.durationWeeks} Weeks ({cls.startDate} – {cls.endDate})
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      {cls.maxSeats - cls.enrolledStudents.length} seat(s) open
                    </span>
                    <Link
                      href={`/class/${cls.id}`}
                      className="rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 px-3.5 py-1.5 text-xs font-bold hover:opacity-90"
                    >
                      Manage Class & Reviews →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ministry-Accredited Verifiable Certificates */}
          <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                Ministry-Accredited Civic Certificates
              </h3>
              <p className="text-xs text-slate-500">
                Cryptographically signed credentials verifiable by universities and educational ministries worldwide.
              </p>
            </div>

            {userCertificates.length === 0 ? (
              <p className="text-xs text-slate-500">No certificates issued yet. Complete a class sprint to earn your first certificate!</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userCertificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="rounded-2xl border border-amber-200 bg-amber-50/40 p-6 shadow-sm dark:border-amber-900/60 dark:bg-amber-950/20 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-amber-900 dark:text-amber-300">
                        {cert.id}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded bg-amber-200/80 px-2 py-0.5 text-[10px] font-black uppercase text-amber-900 dark:bg-amber-900 dark:text-amber-200">
                        Official Seal
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {cert.classTitle}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        Total Hours: <strong>{cert.totalHours} hrs</strong> • Students Guided: <strong>{cert.studentsImpacted}</strong>
                      </p>
                      <p className="text-[11px] font-mono text-slate-400 truncate mt-2">
                        SHA-256: {cert.sha256Hash}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-amber-200/60 dark:border-amber-900/40 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">
                        Issued: {cert.issuedDate}
                      </span>
                      <Link
                        href={`/verify/${cert.id}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline"
                      >
                        Public Verification Page ↗
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
