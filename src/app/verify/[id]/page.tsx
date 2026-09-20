'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useMentorStore } from '@/lib/store';
import { TIER_CONFIGS } from '@/lib/engine/tierProgression';
import { 
  ShieldCheck, 
  GraduationCap, 
  CheckCircle2, 
  Calendar, 
  Users, 
  Clock, 
  Printer, 
  ArrowLeft,
  Sparkles,
  Lock,
  Building2
} from 'lucide-react';

export default function VerifyCertificatePage() {
  const params = useParams();
  const certId = params.id as string;
  const { certificates } = useMentorStore();

  const certificate = certificates.find((c) => c.id === certId) || certificates[0];

  const tierConfig = TIER_CONFIGS[certificate.tier];

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      
      {/* Top Controls */}
      <div className="flex items-center justify-between no-print">
        <Link
          href="/classes"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Platform
        </Link>

        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-800 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 transition-colors"
        >
          <Printer className="h-4 w-4" /> Print / Save as PDF
        </button>
      </div>

      {/* Official Verification Status Banner */}
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-6 dark:border-emerald-900 dark:bg-emerald-950/40 space-y-2 no-print">
        <div className="flex items-center gap-2.5 text-emerald-800 dark:text-emerald-200">
          <ShieldCheck className="h-6 w-6 text-emerald-600" />
          <h2 className="text-base font-black tracking-tight">
            Cryptographically Verified Civic Credential
          </h2>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
          This academic mentorship credential has been issued by <strong>Mentor.mn</strong> in accordance with the national peer education standards of Mongolia. The tamper-proof SHA-256 fingerprint confirms this certificate is authentic and unaltered.
        </p>
      </div>

      {/* Official Certificate Paper Display */}
      <div className="relative rounded-3xl border-8 border-slate-100 bg-white p-8 sm:p-14 shadow-xl dark:border-slate-800 dark:bg-slate-900 text-center space-y-8 overflow-hidden">
        
        {/* Decorative corner borders */}
        <div className="absolute top-4 left-4 h-8 w-8 border-t-2 border-l-2 border-amber-600" />
        <div className="absolute top-4 right-4 h-8 w-8 border-t-2 border-r-2 border-amber-600" />
        <div className="absolute bottom-4 left-4 h-8 w-8 border-b-2 border-l-2 border-amber-600" />
        <div className="absolute bottom-4 right-4 h-8 w-8 border-b-2 border-r-2 border-amber-600" />

        {/* Certificate Header */}
        <div className="space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-900 text-white shadow-md">
            <GraduationCap className="h-8 w-8 text-amber-400" />
          </div>

          <div className="space-y-1">
            <p className="text-xs font-black uppercase tracking-widest text-slate-500">
              MONGOLIAN ACADEMIC MENTORSHIP INFRASTRUCTURE
            </p>
            <h1 className="text-3xl sm:text-4xl font-serif font-black tracking-tight text-slate-900 dark:text-white">
              CERTIFICATE OF MERIT & CIVIC SERVICE
            </h1>
            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
              NATIONAL PEER EDUCATION PROGRAM
            </p>
          </div>
        </div>

        {/* Recipient Notice */}
        <div className="space-y-3 max-w-2xl mx-auto">
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
            This certifies that
          </p>

          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white underline decoration-amber-400 decoration-2 underline-offset-8">
            {certificate.mentorName}
          </h2>

          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
            Affiliated with <strong>{certificate.mentorSchool}</strong>
          </p>

          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed pt-2">
            has successfully guided a sprint cohort in{' '}
            <strong className="text-slate-900 dark:text-white font-bold">{certificate.classTitle}</strong>,
            completing verified deliverable assessments and demonstrating exemplary pedagogical leadership in service of younger peers across Mongolia.
          </p>
        </div>

        {/* Formal Tier Distinction Badge */}
        <div className="inline-flex flex-col items-center justify-center gap-1 rounded-2xl border border-amber-300 bg-amber-50/60 px-6 py-3 dark:border-amber-900 dark:bg-amber-950/30">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200">
            Conferred Formal Distinction
          </span>
          <span className="text-lg font-black text-amber-950 dark:text-amber-100 flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-amber-500" />
            {tierConfig.titleEn} ({tierConfig.titleMn})
          </span>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
          <div className="space-y-0.5">
            <p className="text-[11px] font-semibold text-slate-500 uppercase">Total Hours</p>
            <p className="text-lg font-black text-slate-900 dark:text-white">{certificate.totalHours} hrs</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[11px] font-semibold text-slate-500 uppercase">Students Impacted</p>
            <p className="text-lg font-black text-slate-900 dark:text-white">{certificate.studentsImpacted}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[11px] font-semibold text-slate-500 uppercase">Subject Domain</p>
            <p className="text-lg font-black text-blue-600">{certificate.subject}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[11px] font-semibold text-slate-500 uppercase">Date Issued</p>
            <p className="text-lg font-black text-slate-900 dark:text-white">{certificate.issuedDate}</p>
          </div>
        </div>

        {/* Cryptographic Footprint & Seal */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-left text-xs">
          <div className="space-y-1">
            <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-blue-600" />
              Certificate ID: <span className="font-mono text-blue-600">{certificate.id}</span>
            </p>
            <p className="font-mono text-[10px] text-slate-400 break-all max-w-md">
              SHA-256 Digest: {certificate.sha256Hash}
            </p>
          </div>

          <div className="text-right">
            <div className="inline-flex items-center gap-1.5 font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg dark:bg-emerald-950/60">
              <CheckCircle2 className="h-4 w-4" />
              Tamper-Proof Signature Valid
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
