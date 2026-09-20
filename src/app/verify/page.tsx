'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';
import { 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  ArrowRight, 
  GraduationCap, 
  Lock, 
  Award, 
  ExternalLink 
} from 'lucide-react';

export default function VerifySearchPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const [certId, setCertId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = certId.trim();
    if (!trimmed) {
      setErrorMsg(language === 'mn' ? 'Батламжийн дугаарыг оруулна уу.' : 'Please enter a Certificate ID.');
      return;
    }
    router.push(`/verify/${encodeURIComponent(trimmed)}`);
  };

  const sampleCertificates = [
    { id: 'MN-ACAD-2026-0091', name: 'Temuulen Bat-Erdene', subject: 'Cambridge A-Level Mathematics' },
    { id: 'MN-EDU-2026-7A4F', name: 'Anar Erdenebileg', subject: 'National Physics Olympiad' },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 text-white shadow-sm">
          <ShieldCheck className="h-6 w-6 text-emerald-400" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
          {language === 'mn' ? 'Академик Батламж Шалгах' : 'Verify Academic Credential'}
        </h1>
        <p className="text-sm text-zinc-500 leading-relaxed">
          {language === 'mn'
            ? 'Mentor.mn-ээс олгогдсон албан ёсны академик батламж, сертификатын үнэн зөвийг SHA-256 криптограф шалгалтаар баталгаажуулна.'
            : 'Validate the authenticity of official academic credentials issued by Mentor.mn via tamper-proof cryptographic verification.'}
        </p>
      </div>

      {/* Verification Lookup Card */}
      <div className="saas-card p-6 sm:p-8 max-w-xl mx-auto shadow-sm space-y-4">
        <form onSubmit={handleVerify} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
              {language === 'mn' ? 'Батламжийн дугаар (Certificate ID)' : 'Certificate ID or Digest'}
            </label>
            <div className="relative">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                placeholder="e.g. MN-ACAD-2026-0091"
                value={certId}
                onChange={(e) => { setCertId(e.target.value); setErrorMsg(''); }}
                className="saas-input pl-10 text-sm font-mono"
              />
            </div>
            {errorMsg && (
              <p className="text-xs text-rose-600 font-medium">{errorMsg}</p>
            )}
          </div>

          <button
            type="submit"
            className="btn-primary w-full py-2.5 text-xs font-medium text-white flex items-center justify-center gap-2 shadow-sm"
          >
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>{language === 'mn' ? 'Батламжийг шалгах' : 'Verify Authenticity'}</span>
          </button>
        </form>

        {/* Sample verifiable IDs */}
        <div className="pt-4 border-t border-zinc-100 space-y-2">
          <span className="text-[11px] font-medium text-zinc-400 block">
            {language === 'mn' ? 'Жишээ батламжууд:' : 'Try a sample certificate:'}
          </span>
          <div className="flex flex-col gap-1.5">
            {sampleCertificates.map((sample) => (
              <Link
                key={sample.id}
                href={`/verify/${sample.id}`}
                className="flex items-center justify-between p-2.5 rounded-lg border border-zinc-200/70 bg-zinc-50/60 hover:bg-zinc-100 transition-colors text-xs"
              >
                <div>
                  <span className="font-mono font-semibold text-zinc-800">{sample.id}</span>
                  <span className="text-zinc-500 ml-2">— {sample.name} ({sample.subject})</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-zinc-400" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Security & Verification Explanation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto pt-6">
        <div className="saas-card p-5 space-y-2">
          <div className="h-8 w-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-800 font-bold">
            <Lock className="h-4 w-4" />
          </div>
          <h3 className="text-xs font-bold text-zinc-900">
            {language === 'mn' ? 'Хуурамчаар үйлдэх боломжгүй' : 'Tamper-Proof'}
          </h3>
          <p className="text-xs text-zinc-500 leading-relaxed">
            {language === 'mn'
              ? 'Бүх батламж нь SHA-256 криптограф хээгээр баталгаажсан тул ямар ч засвар оруулах боломжгүй.'
              : 'Every certificate is cryptographically signed with a SHA-256 digest that prevents any alteration.'}
          </p>
        </div>

        <div className="saas-card p-5 space-y-2">
          <div className="h-8 w-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-800 font-bold">
            <Award className="h-4 w-4" />
          </div>
          <h3 className="text-xs font-bold text-zinc-900">
            {language === 'mn' ? 'Их сургуулиудад хүчинтэй' : 'University Recognized'}
          </h3>
          <p className="text-xs text-zinc-500 leading-relaxed">
            {language === 'mn'
              ? 'Олон улсын болон дотоодын их дээд сургуулиудын өргөдөлд албан ёсны эх сурвалж болгон хавсаргах боломжтой.'
              : 'Directly acceptable as official evidence of peer teaching and leadership on college applications.'}
          </p>
        </div>

        <div className="saas-card p-5 space-y-2">
          <div className="h-8 w-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-800 font-bold">
            <GraduationCap className="h-4 w-4" />
          </div>
          <h3 className="text-xs font-bold text-zinc-900">
            {language === 'mn' ? 'Бодит бүтээлээр баталгаажсан' : 'Deliverable-Backed'}
          </h3>
          <p className="text-xs text-zinc-500 leading-relaxed">
            {language === 'mn'
              ? 'Зөвхөн сургалтад суусан бус, сурагчдын бодит бодлого, төсөл, бүтээлийг бүрэн шалгаж олгодог.'
              : 'Conferred only upon completion and verification of real-world problem sets, projects, and papers.'}
          </p>
        </div>
      </div>

    </div>
  );
}
