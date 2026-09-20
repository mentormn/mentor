import Link from 'next/link';
import { 
  GraduationCap, 
  Users, 
  Compass, 
  Award, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Flame,
  Sparkles,
  MapPin,
  Calendar,
  Layers
} from 'lucide-react';
import { NATIONAL_TELEMETRY, INITIAL_CLASSES } from '@/lib/mockData';
import { TIER_CONFIGS } from '@/lib/engine/tierProgression';

export default function Home() {
  const featuredClasses = INITIAL_CLASSES.slice(0, 3);

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-blue-50/60 via-white to-slate-50 dark:from-slate-900/60 dark:via-slate-950 dark:to-slate-950 py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl text-center space-y-6">
          
          {/* Institutional Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-100/70 px-4 py-1.5 text-xs font-semibold text-blue-900 dark:border-blue-800 dark:bg-blue-950/80 dark:text-blue-300 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
            National Academic Mentorship & Intelligence Infrastructure
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Learn from students who{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 bg-clip-text text-transparent">
              actually mastered it.
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            Outdated classroom lecturing leaves curiosity behind. Mentor.mn connects ambitious students with proven peer mentors for focused <strong>1–3 week sprint classes</strong> (1 to 10 seats). Build tangible deliverables, earn Ministry-accredited formal credentials, and pay it forward.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
            <Link
              href="/classes"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-md hover:bg-blue-500 transition-all hover:scale-[1.02] active:scale-95"
            >
              <Compass className="h-4 w-4" />
              Find a Class & Claim a Seat
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/classes/create"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-bold text-slate-800 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 transition-all hover:scale-[1.02] active:scale-95"
            >
              <GraduationCap className="h-4 w-4 text-blue-600" />
              Open a Class as a Mentor
            </Link>
          </div>

          {/* Guarantee Badges */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Flexible Cohorts (1 to 10 Seats)
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Deliverable-Gated Progression
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              SHA-256 Verifiable Ministry Credentials
            </span>
          </div>

        </div>
      </section>

      {/* Live Flywheel Telemetry Stats */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-amber-500" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Live National Knowledge Flywheel
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Real-time impact telemetry across Mongolia&apos;s schools and provinces
              </p>
            </div>
            <Link
              href="/ministry/audit"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-500"
            >
              View Full Ministry Audit <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Active Sprint Classes
              </p>
              <p className="text-3xl font-black text-slate-900 dark:text-white">
                {NATIONAL_TELEMETRY.activeClasses}
              </p>
              <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                In-session this week
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Students Guided
              </p>
              <p className="text-3xl font-black text-slate-900 dark:text-white">
                {NATIONAL_TELEMETRY.totalStudentsTaught}
              </p>
              <p className="text-[11px] text-slate-500">Across 1 to 10-seat cohorts</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Aimags Reached
              </p>
              <p className="text-3xl font-black text-blue-600">
                {NATIONAL_TELEMETRY.aimagsReached} / 21
              </p>
              <p className="text-[11px] text-slate-500">Urban-to-rural knowledge transfer</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Knowledge Multiplier
              </p>
              <p className="text-3xl font-black text-amber-500">
                {NATIONAL_TELEMETRY.knowledgeMultiplier}
              </p>
              <p className="text-[11px] text-slate-500">Graduates who become mentors</p>
            </div>
          </div>
        </div>
      </section>

      {/* The 3-Step Flywheel Explained */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            How the Knowledge Flywheel Works
          </h2>
          <p className="mx-auto max-w-xl text-sm text-slate-600 dark:text-slate-400">
            A self-sustaining system designed to improve all students over time
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-black text-lg">
              01
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Sprint Classes (1 to 10 Seats)
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Mentors open focused 1–3 week sprint classes on topics they mastered (e.g. Cambridge Differentiation, Pygame Dev, Olympiad Circuits) with custom seat limits.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-black text-lg">
              02
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Deliverable Verification
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              No time-farming. At the end of the sprint, students submit genuine proof: a working codebase, solved proof set, or lab analysis. Mentors review and verify.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-black text-lg">
              03
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Pay It Forward & Formal Tiers
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Mentors level up through formal tiers (**Junior $\rightarrow$ Senior $\rightarrow$ Master $\rightarrow$ National Laureate**), while graduated students open their own sprint classes for younger peers!
            </p>
          </div>

        </div>
      </section>

      {/* Featured Open Sprint Classes */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Open Sprint Classes
            </h2>
            <p className="text-xs text-slate-500">Classes starting soon with open seats</p>
          </div>
          <Link
            href="/classes"
            className="text-xs font-bold text-blue-600 hover:text-blue-500 flex items-center gap-1"
          >
            Browse All Classes <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredClasses.map((cls) => {
            const seatsLeft = cls.maxSeats - cls.enrolledStudents.length;
            const tierConfig = TIER_CONFIGS[cls.mentorTier];

            return (
              <div
                key={cls.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-blue-600 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-md">
                      {cls.subject}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${tierConfig.badgeClass}`}
                    >
                      <Sparkles className="h-2.5 w-2.5" />
                      {tierConfig.titleEn}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2">
                    {cls.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {cls.description}
                  </p>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-3.5 w-3.5 text-slate-400" />
                      <span>Mentor: <strong className="font-semibold text-slate-900 dark:text-white">{cls.mentorName}</strong> ({cls.mentorSchool})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      <span>{cls.durationWeeks} Weeks • {cls.scheduleSummary}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="text-xs">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {cls.enrolledStudents.length} / {cls.maxSeats}
                    </span>{' '}
                    <span className="text-slate-500">seats filled</span>
                    {seatsLeft > 0 ? (
                      <p className="text-[11px] font-semibold text-emerald-600">
                        {seatsLeft} {seatsLeft === 1 ? 'seat' : 'seats'} left
                      </p>
                    ) : (
                      <p className="text-[11px] font-semibold text-amber-600">Class full</p>
                    )}
                  </div>

                  <Link
                    href={`/class/${cls.id}`}
                    className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-blue-500 transition-colors"
                  >
                    View Class
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Formal Tier Progression Showcase */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 uppercase tracking-wider">
            <Award className="h-4 w-4" /> Official Ministry Recognition
          </div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Formal Academic Mentor Tiers
          </h2>
          <p className="mx-auto max-w-xl text-sm text-slate-600 dark:text-slate-400">
            Mentors advance by teaching cohorts and verifying genuine deliverables, unlocking prestigious credentials for university admissions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.values(TIER_CONFIGS).map((tier) => (
            <div
              key={tier.tier}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <span
                  className={`inline-flex items-center gap-1 rounded px-2.5 py-1 text-xs font-extrabold uppercase border ${tier.badgeClass}`}
                >
                  <Sparkles className="h-3 w-3" />
                  {tier.titleEn}
                </span>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {tier.titleMn}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {tier.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 space-y-1">
                <div>Min Classes: <strong className="text-slate-800 dark:text-slate-200">{tier.minClasses}</strong></div>
                <div>Min Students: <strong className="text-slate-800 dark:text-slate-200">{tier.minStudents}</strong></div>
                <div>Min XP: <strong className="text-slate-800 dark:text-slate-200">{tier.minXp} XP</strong></div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
