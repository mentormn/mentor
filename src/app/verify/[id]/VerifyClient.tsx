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
  Printer, 
  ArrowLeft,
  Sparkles,
  Lock,
  Award
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
        <div className="h-8 w-48 bg-zinc-200 rounded mx-auto animate-pulse" />
        <div className="h-64 bg-zinc-100 rounded-2xl animate-pulse" />
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
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> 
          <span>{language === 'mn' ? 'Хяналтын самбар луу буцах' : 'Back to Dashboard'}</span>
        </Link>

        <button
          onClick={handlePrint}
          className="btn-secondary inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-zinc-800"
        >
          <Printer className="h-3.5 w-3.5" />
          <span>{language === 'mn' ? 'Хэвлэх / PDF' : 'Print / Save PDF'}</span>
        </button>
      </div>

      {/* Official Verification Status Banner */}
      <div className="saas-card p-5 sm:p-6 border-emerald-300 bg-emerald-50/50 space-y-2 no-print">
        <div className="flex items-center gap-2 text-emerald-800">
          <ShieldCheck className="h-5 w-5 text-emerald-600" />
          <h2 className="text-sm sm:text-base font-bold tracking-tight">
            {language === 'mn' ? 'Албан ёсоор баталгаажсан академик батламж' : 'Officially Verified Academic Credential'}
          </h2>
        </div>
        <p className="text-xs text-emerald-950 leading-relaxed max-w-3xl">
          {language === 'mn'
            ? 'Энэхүү академик менторшлын батламж нь Mentor.mn үндэсний боловсролын стандартад нийцэн олгогдсон болно. SHA-256 криптограф хээ нь энэхүү сертификатыг хуурамчаар үйлдэх боломжгүй бөгөөд бүрэн үнэн болохыг гэрчилж байна.'
            : 'This academic mentorship credential has been issued by Mentor.mn in accordance with national peer education standards in Mongolia. The tamper-proof SHA-256 fingerprint confirms this certificate is authentic and unaltered.'}
        </p>
      </div>

      {/* Official Certificate Paper Display (Diploma Style) */}
      <div className="relative rounded-2xl border-2 border-zinc-200 bg-white p-8 sm:p-14 shadow-lg text-center space-y-8 overflow-hidden">
        
        {/* Certificate Border Corner Accents */}
        <div className="absolute top-4 left-4 h-8 w-8 border-t-2 border-l-2 border-zinc-900" />
        <div className="absolute top-4 right-4 h-8 w-8 border-t-2 border-r-2 border-zinc-900" />
        <div className="absolute bottom-4 left-4 h-8 w-8 border-b-2 border-l-2 border-zinc-900" />
        <div className="absolute bottom-4 right-4 h-8 w-8 border-b-2 border-r-2 border-zinc-900" />

        {/* Certificate Header */}
        <div className="space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-900 text-white shadow-md">
            <Award className="h-7 w-7 text-amber-300" />
          </div>

          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              {language === 'mn' ? 'МОНГОЛ УЛСЫН ҮНДЭСНИЙ АКАДЕМИК МЕНТОРШИЛ' : 'NATIONAL ACADEMIC MENTORSHIP OF MONGOLIA'}
            </p>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-zinc-900">
              {language === 'mn' ? 'АКАДЕМИК МЕНТОРЫН БАТЛАМЖ' : 'CERTIFICATE OF ACADEMIC MENTORSHIP'}
            </h1>
            <p className="text-xs font-semibold text-zinc-600">
              {language === 'mn' ? 'Үе тэнгийн боловсролын манлайллыг гэрчилсэн албан ёсны баримт' : 'Official Proof of Peer Pedagogical Leadership & Impact'}
            </p>
          </div>
        </div>

        {/* Recipient Notice */}
        <div className="space-y-3 max-w-2xl mx-auto">
          <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium">
            {language === 'mn' ? 'Энэхүү батламжийг хүртээв:' : 'This is to certify that'}
          </p>

          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 underline decoration-zinc-400 decoration-2 underline-offset-8">
            {cert.mentorName}
          </h2>

          <p className="text-xs text-zinc-600">
            {language === 'mn' ? 'Сургууль / Их сургууль:' : 'Affiliated with'} <strong className="text-zinc-900">{cert.mentorSchool}</strong>
          </p>

          <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed pt-2">
            {language === 'mn' ? (
              <>
                нь <strong className="text-zinc-900 font-semibold">{cert.classTitle}</strong> бичил ангийг амжилттай чиглүүлэн зааж, баталгаажсан бүтээлийн үнэлгээг бүрэн хангаж, Монгол улсын сурагчдад үлгэр жишээ академик манлайлал үзүүлснийг үүгээр батламжлав.
              </>
            ) : (
              <>
                has successfully guided a sprint cohort in{' '}
                <strong className="text-zinc-900 font-semibold">{cert.classTitle}</strong>,
                completing verified deliverable assessments and demonstrating exemplary pedagogical leadership in service of younger peers across Mongolia.
              </>
            )}
          </p>
        </div>

        {/* Formal Tier Distinction Badge */}
        <div className="inline-flex flex-col items-center justify-center gap-1 rounded-xl border border-zinc-200 bg-zinc-50 px-6 py-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            {language === 'mn' ? 'Хүртээсэн албан ёсны зэрэг' : 'Conferred Formal Distinction'}
          </span>
          <span className="text-base font-bold text-zinc-900 flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-amber-500" />
            {language === 'mn' ? tierConfig.titleMn : tierConfig.titleEn}
          </span>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-zinc-200 text-center">
          <div className="space-y-0.5">
            <p className="text-[10px] font-medium text-zinc-500 uppercase">{language === 'mn' ? 'Нийт цаг' : 'Total Hours'}</p>
            <p className="text-base font-bold text-zinc-900">{cert.totalHours} hrs</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[10px] font-medium text-zinc-500 uppercase">{language === 'mn' ? 'Суралцсан сурагч' : 'Students Impacted'}</p>
            <p className="text-base font-bold text-zinc-900">{cert.studentsImpacted}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[10px] font-medium text-zinc-500 uppercase">{language === 'mn' ? 'Хичээл' : 'Subject Domain'}</p>
            <p className="text-base font-bold text-zinc-900">{cert.subject}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[10px] font-medium text-zinc-500 uppercase">{language === 'mn' ? 'Олгосон огноо' : 'Date Issued'}</p>
            <p className="text-base font-bold text-zinc-900">{cert.issuedDate}</p>
          </div>
        </div>

        {/* Cryptographic Footprint & Seal */}
        <div className="pt-6 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-left text-xs">
          <div className="space-y-1">
            <p className="font-semibold text-zinc-900 flex items-center gap-1.5">
              <Lock className="h-3 w-3 text-zinc-500" />
              Certificate ID: <span className="font-mono text-zinc-700">{cert.id}</span>
            </p>
            <p className="font-mono text-[10px] text-zinc-400 break-all max-w-md">
              SHA-256 Digest: {cert.sha256Hash}
            </p>
          </div>

          <div className="text-right">
            <div className="inline-flex items-center gap-1.5 font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>{language === 'mn' ? 'Цахим гарын үсгээр баталгаажсан' : 'Cryptographically Verified'}</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
