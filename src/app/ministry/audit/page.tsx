'use client';

import Link from 'next/link';
import { 
  BarChart3, 
  MapPin, 
  Flame, 
  Users, 
  ShieldCheck, 
  CheckCircle2, 
  Building2, 
  ArrowLeft,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { NATIONAL_TELEMETRY, INITIAL_DELIVERABLES } from '@/lib/mockData';
import { useMentorStore } from '@/lib/store';

export default function MinistryAuditPage() {
  const { classes, deliverables } = useMentorStore();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-10">
      
      {/* Top back button */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>
      </div>

      {/* Header Banner */}
      <div className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-8 text-white shadow-md space-y-4">
        <div className="inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-1 text-xs font-bold text-blue-200 backdrop-blur">
          <Building2 className="h-4 w-4 text-amber-400" />
          Ministry of Education & Institutional Telemetry
        </div>
        <h1 className="text-3xl font-black tracking-tight text-white">
          National Academic Knowledge Transfer Audit
        </h1>
        <p className="text-sm text-blue-100 max-w-3xl leading-relaxed">
          Real-time oversight into student-led academic mentorship, provincial reach across Mongolia&apos;s 21 aimags, and the self-sustaining peer education multiplier.
        </p>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-1">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Active Sprint Classes
          </p>
          <p className="text-3xl font-black text-slate-900 dark:text-white">
            {classes.length}
          </p>
          <p className="text-[11px] text-emerald-600 font-medium">
            100% deliverable-gated
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-1">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Provincial Reach
          </p>
          <p className="text-3xl font-black text-blue-600">
            {NATIONAL_TELEMETRY.aimagsReached} / 21 Aimags
          </p>
          <p className="text-[11px] text-slate-500">
            Urban-to-rural knowledge transfer
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-1">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Urban-to-Rural Transfer
          </p>
          <p className="text-3xl font-black text-emerald-600">
            {NATIONAL_TELEMETRY.urbanToRuralTransferRate}
          </p>
          <p className="text-[11px] text-slate-500">
            Rural students guided by top mentors
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-1">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Knowledge Multiplier
          </p>
          <p className="text-3xl font-black text-amber-500">
            {NATIONAL_TELEMETRY.knowledgeMultiplier}
          </p>
          <p className="text-[11px] text-slate-500">
            Mentees who become mentors
          </p>
        </div>
      </div>

      {/* Provincial Distribution Breakdown */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              Provincial Participation & Knowledge Transfer
            </h2>
            <p className="text-xs text-slate-500">
              Distribution of active students across Ulaanbaatar and the 21 Aimags
            </p>
          </div>
          <span className="text-xs font-bold text-blue-600">
            National Coverage: 76%
          </span>
        </div>

        <div className="space-y-4">
          {NATIONAL_TELEMETRY.provincialDistribution.map((prov) => (
            <div key={prov.province} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {prov.province}
                </span>
                <span className="font-semibold text-slate-500">
                  {prov.count} students ({prov.percentage}%)
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all"
                  style={{ width: `${prov.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deliverable Integrity & Spot-Check Audit */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            Deliverable Integrity & Anti-Gaming Spot-Check
          </h2>
          <p className="text-xs text-slate-500">
            Institutional ledger of verified learning artifacts ensuring no hours are credited without tangible proof.
          </p>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          {deliverables.map((del) => (
            <div key={del.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <p className="font-bold text-slate-900 dark:text-white text-sm">
                  {del.title}
                </p>
                <p className="text-slate-500">
                  Student: <strong>{del.studentName}</strong> • Submitted: {del.submittedAt.split('T')[0]}
                </p>
                {del.mentorFeedback && (
                  <p className="text-slate-600 dark:text-slate-300 italic">
                    &quot;{del.mentorFeedback}&quot;
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={del.urlOrNotes}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:underline"
                >
                  Artifact URL <ExternalLink className="h-3 w-3" />
                </a>

                <span
                  className={`font-bold px-2.5 py-1 rounded-full ${
                    del.status === 'approved'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}
                >
                  {del.status === 'approved' ? 'Verified ✓' : 'Under Review'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
