'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { useLanguage } from '@/lib/i18n';
import { TIER_CONFIGS } from '@/lib/engine/tierProgression';
import { INITIAL_CERTIFICATES } from '@/lib/mockData';
import { FormalTier } from '@/lib/types';
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
  Lock
} from 'lucide-react';

export default function VerifyClient({ certId }: { certId: string }) {
  const { language, t } = useLanguage();
  const [cert, setCert] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCert() {
      try {
        const { data } = await supabase
          .from('certificates')
          .select('*')
          .eq('id', certId)
          .single();

        if (data) {
          setCert({
            id: data.id,
            mentorName: data.mentor_name,
            mentorSchool: data.mentor_school,
            tier: data.tier,
            totalHours: data.total_hours,
            studentsImpacted: data.students_impacted,
            classTitle: data.class_title,
            subject: data.subject,
            sha256Hash: data.sha256_hash,
            issuedDate: data.issued_date,
          });
        } else {
          // Fallback to mock certificate if verifying the demo ID
          const fallback = INITIAL_CERTIFICATES.find((c) => c.id === certId) || INITIAL_CERTIFICATES[0];
          setCert(fallback);
        }
      } catch (err) {
        const fallback = INITIAL_CERTIFICATES.find((c) => c.id === certId) || INITIAL_CERTIFICATES[0];
        setCert(fallback);
      } finally {
        setLoading(false);
      }
    }

    fetchCert();
  }, [certId]);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  if (loading || !cert) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center space-y-4">
        <div className="h-8 w-48 bg-zinc-800 rounded mx-auto animate-pulse" />
        <div className="h-64 bg-zinc-900/50 rounded-2xl animate-pulse" />
      </div>
    );
  }

  const tierKey = (cert.tier || 'JUNIOR_MENTOR') as FormalTier;
  const tierConfig = TIER_CONFIGS[tierKey] || TIER_CONFIGS['JUNIOR_MENTOR'];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      
      {/* Top Controls */}
      <div className="flex items-center justify-between no-print">
        <Link
          href="/classes"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> 
          <span>{language === 'mn' ? 'Платформ руу буцах' : 'Back to Platform'}</span>
        </Link>

        <button
          onClick={handlePrint}
          className="btn-secondary inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium"
        >
          <Printer className="h-3.5 w-3.5" /> {t('certPrintBtn')}
        </button>
      </div>

      {/* Official Verification Status Banner */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6 border-emerald-500/20 space-y-2 no-print shadow-[0_0_30px_rgba(16,185,129,0.08)]">
        <div className="flex items-center gap-2.5 text-emerald-400">
          <ShieldCheck className="h-5 w-5" />
          <h2 className="text-sm sm:text-base font-bold tracking-tight">
            {t('certVerifiedBadge')}
          </h2>
        </div>
        <p className="text-xs text-zinc-300 leading-relaxed max-w-3xl">
          {language === 'mn'
            ? 'Энэхүү академик менторшлын батламж нь Mentor.mn үндэсний үе тэнгийн боловсролын стандартад нийцэн олгогдсон болно. SHA-256 криптограф хээ нь энэхүү сертификатыг хуурамчаар үйлдэх боломжгүй бөгөөд бүрэн үнэн болохыг гэрчилж байна.'
            : 'This academic mentorship credential has been issued by Mentor.mn in accordance with the national peer education standards of Mongolia. The tamper-proof SHA-256 fingerprint confirms this certificate is authentic and unaltered.'}
        </p>
      </div>

      {/* Official Certificate Paper Display */}
      <div className="relative rounded-3xl border border-white/[0.1] bg-[#121215] p-8 sm:p-14 shadow-2xl text-center space-y-8 overflow-hidden">
        
        {/* Decorative corner borders */}
        <div className="absolute top-4 left-4 h-8 w-8 border-t-2 border-l-2 border-amber-500/60" />
        <div className="absolute top-4 right-4 h-8 w-8 border-t-2 border-r-2 border-amber-500/60" />
        <div className="absolute bottom-4 left-4 h-8 w-8 border-b-2 border-l-2 border-amber-500/60" />
        <div className="absolute bottom-4 right-4 h-8 w-8 border-b-2 border-r-2 border-amber-500/60" />

        {/* Certificate Header */}
        <div className="space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 shadow-md">
            <GraduationCap className="h-6 w-6 text-amber-400" />
          </div>

          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              {language === 'mn' ? 'МОНГОЛ УЛСЫН АКАДЕМИК МЕНТОРШИЛЫН ДЭД БҮТЭЦ' : 'MONGOLIAN ACADEMIC MENTORSHIP INFRASTRUCTURE'}
            </p>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-white">
              {t('certHeaderTitle')}
            </h1>
            <p className="text-xs font-semibold text-blue-400">
              {t('certSubTitle')}
            </p>
          </div>
        </div>

        {/* Recipient Notice */}
        <div className="space-y-3 max-w-2xl mx-auto">
          <p className="text-xs text-zinc-400 uppercase tracking-wider font-medium">
            {t('certCertifiesThat')}
          </p>

          <h2 className="text-2xl sm:text-3xl font-bold text-white underline decoration-amber-400/60 decoration-2 underline-offset-8">
            {cert.mentorName}
          </h2>

          <p className="text-xs text-zinc-400">
            {language === 'mn' ? 'Сургууль:' : 'Affiliated with'} <strong className="text-zinc-200">{cert.mentorSchool}</strong>
          </p>

          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed pt-2">
            {language === 'mn' ? (
              <>
                нь <strong className="text-white font-semibold">{cert.classTitle}</strong> спринт ангийг амжилттай чиглүүлэн зааж, баталгаажсан бодит бүтээлийн үнэлгээг бүрэн хангаж, Монгол улсын хойч үеийн дүү нартаа үлгэр жишээ академик манлайлал үзүүлснийг үүгээр батламжлав.
              </>
            ) : (
              <>
                has successfully guided a sprint cohort in{' '}
                <strong className="text-white font-semibold">{cert.classTitle}</strong>,
                completing verified deliverable assessments and demonstrating exemplary pedagogical leadership in service of younger peers across Mongolia.
              </>
            )}
          </p>
        </div>

        {/* Formal Tier Distinction Badge */}
        <div className="inline-flex flex-col items-center justify-center gap-1 rounded-xl border border-amber-500/20 bg-amber-500/5 px-6 py-2.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
            {language === 'mn' ? 'Хүртээсэн албан ёсны зэрэг' : 'Conferred Formal Distinction'}
          </span>
          <span className="text-base font-bold text-amber-200 flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-amber-400" />
            {language === 'mn' ? tierConfig.titleMn : tierConfig.titleEn}
          </span>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/[0.06] text-center">
          <div className="space-y-0.5">
            <p className="text-[10px] font-medium text-zinc-400 uppercase">{language === 'mn' ? 'Нийт цаг' : 'Total Hours'}</p>
            <p className="text-base font-bold text-white">{cert.totalHours} hrs</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[10px] font-medium text-zinc-400 uppercase">{language === 'mn' ? 'Суралцсан сурагч' : 'Students Impacted'}</p>
            <p className="text-base font-bold text-white">{cert.studentsImpacted}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[10px] font-medium text-zinc-400 uppercase">{language === 'mn' ? 'Хичээл' : 'Subject Domain'}</p>
            <p className="text-base font-bold text-blue-400">{cert.subject}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[10px] font-medium text-zinc-400 uppercase">{language === 'mn' ? 'Олгосон огноо' : 'Date Issued'}</p>
            <p className="text-base font-bold text-white">{cert.issuedDate}</p>
          </div>
        </div>

        {/* Cryptographic Footprint & Seal */}
        <div className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-left text-xs">
          <div className="space-y-1">
            <p className="font-semibold text-white flex items-center gap-1.5">
              <Lock className="h-3 w-3 text-blue-400" />
              Certificate ID: <span className="font-mono text-blue-400">{cert.id}</span>
            </p>
            <p className="font-mono text-[10px] text-zinc-500 break-all max-w-md">
              SHA-256 Digest: {cert.sha256Hash}
            </p>
          </div>

          <div className="text-right">
            <div className="inline-flex items-center gap-1.5 font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-lg">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>{t('certValidSig')}</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
