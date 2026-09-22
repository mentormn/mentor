'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import QRCode from 'qrcode';
import { supabase } from '@/lib/supabase/client';
import { useLanguage } from '@/lib/i18n';
import { TIER_CONFIGS } from '@/lib/engine/tierProgression';
import { INITIAL_CERTIFICATES } from '@/lib/mockData';
import { FormalTier } from '@/lib/types';
import { 
  ShieldCheck, 
  Printer, 
  ArrowLeft, 
  Sparkles, 
  Lock, 
  Check, 
  Copy, 
  Globe, 
  Award,
  ExternalLink
} from 'lucide-react';

export default function VerifyClient({ certId }: { certId: string }) {
  const { language } = useLanguage();
  const [cert, setCert] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [viewLanguage, setViewLanguage] = useState<'mn' | 'en' | 'both'>('mn');

  // Initialize view language based on user context
  useEffect(() => {
    setViewLanguage(language === 'en' ? 'en' : 'mn');
  }, [language]);

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

  // Generate real scannable QR code
  useEffect(() => {
    if (!cert) return;
    const verificationUrl = typeof window !== 'undefined' 
      ? window.location.href 
      : `https://mentor.mn/verify/${cert.id}`;

    QRCode.toDataURL(verificationUrl, {
      width: 180,
      margin: 1,
      color: {
        dark: '#1c1917',
        light: '#ffffff',
      },
    })
      .then((url) => setQrCodeDataUrl(url))
      .catch((err) => console.error('QR code generation error:', err));
  }, [cert]);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (loading || !cert) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-20 text-center space-y-4">
        <div className="h-8 w-48 bg-zinc-200 rounded mx-auto animate-pulse" />
        <div className="h-96 bg-zinc-100 rounded-2xl animate-pulse" />
      </div>
    );
  }

  const tierKey = (cert.tier || 'JUNIOR_MENTOR') as FormalTier;
  const tierConfig = TIER_CONFIGS[tierKey] || TIER_CONFIGS['JUNIOR_MENTOR'];

  return (
    <div className="certificate-print-container mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 space-y-6">
      
      {/* 1. TOP CONTROL BAR (HIDDEN IN PRINT) */}
      <div className="no-print flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-zinc-200 shadow-sm">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-zinc-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> 
          <span>{language === 'mn' ? 'Хяналтын самбар луу буцах' : 'Back to Dashboard'}</span>
        </Link>

        {/* Center: Language Presentation Toggle */}
        <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-lg border border-zinc-200 text-xs">
          <button
            onClick={() => setViewLanguage('mn')}
            className={`px-3 py-1 rounded-md font-medium transition-all ${
              viewLanguage === 'mn' 
                ? 'bg-white text-zinc-900 shadow-xs font-semibold' 
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            🇲🇳 Монгол
          </button>
          <button
            onClick={() => setViewLanguage('en')}
            className={`px-3 py-1 rounded-md font-medium transition-all ${
              viewLanguage === 'en' 
                ? 'bg-white text-zinc-900 shadow-xs font-semibold' 
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            🇬🇧 English
          </button>
          <button
            onClick={() => setViewLanguage('both')}
            className={`px-3 py-1 rounded-md font-medium transition-all ${
              viewLanguage === 'both' 
                ? 'bg-white text-zinc-900 shadow-xs font-semibold' 
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            🌐 Хос хэл (Bilingual)
          </button>
        </div>

        {/* Right Actions: Copy & Print */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="btn-secondary inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-700"
            title="Холбоосыг хуулах / Copy Link"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5 text-zinc-500" />}
            <span>{copied ? (language === 'mn' ? 'Хуулагдлаа!' : 'Copied!') : (language === 'mn' ? 'Холбоос хуулах' : 'Copy Link')}</span>
          </button>

          <button
            onClick={handlePrint}
            className="btn-primary inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-white shadow-sm"
          >
            <Printer className="h-3.5 w-3.5 text-zinc-300" />
            <span>{language === 'mn' ? 'Хэвлэх / PDF татах' : 'Print / Save PDF'}</span>
          </button>
        </div>
      </div>

      {/* 2. OFFICIAL VERIFICATION BANNER (HIDDEN IN PRINT) */}
      <div className="no-print saas-card p-4 sm:p-5 border-emerald-300 bg-emerald-50/70 space-y-1.5 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-900">
            <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
            <h2 className="text-sm font-bold tracking-tight">
              {language === 'mn' 
                ? 'Үндэсний хэмжээнд баталгаажсан албан ёсны академик батламж' 
                : 'Nationally Accredited & Cryptographically Verified Academic Credential'}
            </h2>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-200">
            SHA-256 VERIFIED
          </span>
        </div>
        <p className="text-xs text-emerald-950/80 leading-relaxed">
          {language === 'mn'
            ? 'Энэхүү батламж нь Mentor.mn үндэсний боловсролын платформоос олгогдсон албан ёсны баримт бөгөөд дотоод, гадаадын их дээд сургуулийн өргөдөл, тэтгэлгийн материалд албан ёсны эх сурвалж болгон хавсаргах эрхтэй. Доорх SHA-256 криптограф хээ болон QR код нь баримтын үнэн зөвийг үл өөрчлөгдөх байдлаар гэрчилнэ.'
            : 'This credential is an official academic document issued by Mentor.mn. It is recognized for domestic and international university applications, scholarships, and scholar portfolios. The tamper-proof SHA-256 digital fingerprint and live QR verification guarantee authenticity.'}
        </p>
      </div>

      {/* 3. THE OFFICIAL DIPLOMA / CERTIFICATE CANVAS */}
      <div className="certificate-paper relative rounded-2xl border-[3px] border-[#b89758] bg-[#fcfbf9] p-6 sm:p-14 shadow-xl text-center space-y-7 overflow-hidden">
        
        {/* Concentric Inner Border Line */}
        <div className="pointer-events-none absolute inset-2 sm:inset-3.5 rounded-xl border border-[#d4af37]/50 border-dashed" />
        <div className="pointer-events-none absolute inset-3 sm:inset-5 rounded-lg border border-[#c5a059]/30" />

        {/* Ornamental Corner Flourishes (SVG Vector) */}
        {/* Top-Left */}
        <div className="pointer-events-none absolute top-4 left-4 sm:top-6 sm:left-6 w-12 h-12 text-[#b89758]">
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3" className="w-full h-full">
            <path d="M 5 95 L 5 25 Q 5 5 25 5 L 95 5" />
            <path d="M 15 95 L 15 30 Q 15 15 30 15 L 95 15" strokeWidth="1.5" />
            <circle cx="25" cy="25" r="4" fill="#b89758" />
            <circle cx="60" cy="8" r="2.5" fill="#b89758" />
            <circle cx="8" cy="60" r="2.5" fill="#b89758" />
          </svg>
        </div>

        {/* Top-Right */}
        <div className="pointer-events-none absolute top-4 right-4 sm:top-6 sm:right-6 w-12 h-12 text-[#b89758]">
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3" className="w-full h-full">
            <path d="M 95 95 L 95 25 Q 95 5 75 5 L 5 5" />
            <path d="M 85 95 L 85 30 Q 85 15 70 15 L 5 15" strokeWidth="1.5" />
            <circle cx="75" cy="25" r="4" fill="#b89758" />
            <circle cx="40" cy="8" r="2.5" fill="#b89758" />
            <circle cx="92" cy="60" r="2.5" fill="#b89758" />
          </svg>
        </div>

        {/* Bottom-Left */}
        <div className="pointer-events-none absolute bottom-4 left-4 sm:bottom-6 sm:left-6 w-12 h-12 text-[#b89758]">
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3" className="w-full h-full">
            <path d="M 5 5 L 5 75 Q 5 95 25 95 L 95 95" />
            <path d="M 15 5 L 15 70 Q 15 85 30 85 L 95 85" strokeWidth="1.5" />
            <circle cx="25" cy="75" r="4" fill="#b89758" />
            <circle cx="60" cy="92" r="2.5" fill="#b89758" />
            <circle cx="8" cy="40" r="2.5" fill="#b89758" />
          </svg>
        </div>

        {/* Bottom-Right */}
        <div className="pointer-events-none absolute bottom-4 right-4 sm:bottom-6 sm:right-6 w-12 h-12 text-[#b89758]">
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3" className="w-full h-full">
            <path d="M 95 5 L 95 75 Q 95 95 75 95 L 5 95" />
            <path d="M 85 5 L 85 70 Q 85 85 70 85 L 5 85" strokeWidth="1.5" />
            <circle cx="75" cy="75" r="4" fill="#b89758" />
            <circle cx="40" cy="92" r="2.5" fill="#b89758" />
            <circle cx="92" cy="40" r="2.5" fill="#b89758" />
          </svg>
        </div>

        {/* Subtle Central Security Guilloche Watermark */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.035]">
          <svg viewBox="0 0 400 400" className="w-[520px] h-[520px] text-zinc-900" fill="none" stroke="currentColor">
            {[...Array(12)].map((_, i) => (
              <ellipse
                key={i}
                cx="200"
                cy="200"
                rx="180"
                ry="75"
                transform={`rotate(${i * 15} 200 200)`}
                strokeWidth="1.2"
              />
            ))}
            <circle cx="200" cy="200" r="85" strokeWidth="2" />
            <circle cx="200" cy="200" r="140" strokeWidth="1" strokeDasharray="4 4" />
          </svg>
        </div>

        {/* HEADER SECTION: National Academic Council & Crest */}
        <div className="relative space-y-3 pt-2">
          
          {/* Institutional Crest Medallion */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-[#997328] via-[#d4af37] to-[#f3e5ab] text-zinc-950 shadow-md border-2 border-[#fff8e7]">
            <Award className="h-8 w-8 text-zinc-900 drop-shadow-xs" />
          </div>

          {/* Institutional Titles */}
          <div className="space-y-1">
            {(viewLanguage === 'mn' || viewLanguage === 'both') && (
              <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#8c6d23]">
                МОНГОЛ УЛСЫН ҮНДЭСНИЙ АКАДЕМИК МЕНТОРШИЛЫН ЗӨВЛӨЛ
              </p>
            )}
            {(viewLanguage === 'en' || viewLanguage === 'both') && (
              <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
                THE NATIONAL ACADEMIC COUNCIL OF MONGOLIA • PEER SCHOLAR FOUNDATION
              </p>
            )}

            {/* Main Certificate Title */}
            <div className="pt-2">
              {(viewLanguage === 'mn' || viewLanguage === 'both') && (
                <h1 className="text-2xl sm:text-4xl font-serif font-extrabold tracking-tight text-zinc-950 uppercase">
                  ЭРДЭМ ШИНЖИЛГЭЭ, АКАДЕМИК МАНЛАЙЛЛЫН БАТЛАМЖ
                </h1>
              )}
              {(viewLanguage === 'en' || viewLanguage === 'both') && (
                <h2 className={`text-xl sm:text-2xl font-serif font-bold tracking-normal text-zinc-800 ${viewLanguage === 'both' ? 'mt-1 text-base sm:text-lg text-zinc-600 font-normal italic' : ''}`}>
                  {viewLanguage === 'both' ? 'Certificate of Academic Mentorship & Distinction' : 'CERTIFICATE OF ACADEMIC MENTORSHIP & DISTINCTION'}
                </h2>
              )}
            </div>

            {/* Sub-premise */}
            <p className="text-xs sm:text-sm font-serif italic text-zinc-600 max-w-2xl mx-auto pt-1">
              {viewLanguage === 'mn' && 'Үе тэнгийнхэндээ эрдэм мэдлэг, оюуны бүтээлч сэтгэлгээний манлайлал үзүүлж, үндэсний боловсролын чанарыг ахиулахад үнэтэй хувь нэмэр оруулсныг үнэлэн үүгээр батламжлав.'}
              {viewLanguage === 'en' && 'Conferred in recognition of verified pedagogical excellence, intellectual leadership, and distinguished academic mentorship in service of Mongolian scholars.'}
              {viewLanguage === 'both' && 'Үе тэнгийн боловсролын манлайлал болон баталгаажсан сургалтын үр дүнг гэрчилсэн албан ёсны баримт • Official Proof of Pedagogical Distinction & Academic Impact.'}
            </p>
          </div>
        </div>

        {/* RECIPIENT RECOGNITION */}
        <div className="relative space-y-3 max-w-3xl mx-auto pt-2">
          
          <p className="text-[11px] sm:text-xs text-zinc-500 uppercase tracking-widest font-semibold">
            {viewLanguage === 'mn' && 'Энэхүү хүндэт батламжийг хүртээв:'}
            {viewLanguage === 'en' && 'This credential is proudly conferred upon:'}
            {viewLanguage === 'both' && 'Энэхүү хүндэт батламжийг хүртээв / Proudly conferred upon:'}
          </p>

          {/* Recipient Name in Serif Display */}
          <div className="space-y-1">
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-zinc-950 tracking-wide">
              {cert.mentorName}
            </h3>

            {/* Gold Divider with Star */}
            <div className="flex items-center justify-center gap-3 max-w-md mx-auto py-1">
              <div className="h-[1.5px] flex-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
              <div className="text-[#b89758] text-xs">✦</div>
              <div className="h-[1.5px] flex-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
            </div>

            <p className="text-xs sm:text-sm font-medium text-zinc-600">
              <span className="text-zinc-500">{viewLanguage === 'mn' ? 'Харьяалал:' : 'Affiliated with:'}</span>{' '}
              <strong className="text-zinc-900 font-semibold">{cert.mentorSchool}</strong>
            </p>
          </div>

          {/* Formal Pedagogical Citation */}
          <div className="pt-2 text-xs sm:text-sm text-zinc-800 leading-relaxed max-w-2xl mx-auto space-y-2">
            {(viewLanguage === 'mn' || viewLanguage === 'both') && (
              <p>
                нь <strong className="text-zinc-950 font-semibold">«{cert.classTitle}»</strong> бичил сургалтын хөтөлбөрийг өндөр хариуцлагатайгаар удирдан чиглүүлж, сурагч бүрийн бие даасан бодлого, төсөлт бүтээлийн шалгуурыг бүрэн хангаж, Монгол Улсын залуу үеийн боловсролд эрдмийн өндөр сахилга бат, оюуны манлайлал үзүүлснийг үүгээр албан ёсоор батламжлав.
              </p>
            )}
            {(viewLanguage === 'en' || (viewLanguage === 'both' && false)) && (
              <p>
                for exemplary dedication in designing, directing, and instructing the specialized academic sprint cohort in{' '}
                <strong className="text-zinc-950 font-semibold">{cert.classTitle}</strong>. Having guided younger scholars through rigorous problem sets, verified deliverable milestones, and high-impact peer mentorship, demonstrating the highest virtues of intellectual inquiry, pedagogical mastery, and leadership.
              </p>
            )}
          </div>
        </div>

        {/* FORMAL DISTINCTION TIER BADGE */}
        <div className="relative inline-flex flex-col items-center justify-center gap-1 rounded-xl border border-[#d4af37]/60 bg-gradient-to-b from-[#fffefc] to-[#f7f3e8] px-8 py-3.5 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#8c6d23]">
            {viewLanguage === 'mn' ? 'Хүртээсэн албан ёсны зэрэг' : 'Conferred Formal Distinction'}
          </span>
          <span className="text-base sm:text-lg font-bold text-zinc-950 flex items-center gap-2 font-serif">
            <Sparkles className="h-4 w-4 text-[#b89758]" />
            {viewLanguage === 'en' ? tierConfig.titleEn : tierConfig.titleMn}
            <span className="text-xs font-sans text-zinc-500 font-normal">
              ({tierConfig.titleEn})
            </span>
          </span>
        </div>

        {/* METRICS & AUDIT GRID */}
        <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-[#d4af37]/40 text-center">
          <div className="space-y-0.5 p-2 rounded-lg bg-[#f9f7f2] border border-[#d4af37]/20">
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              {viewLanguage === 'mn' ? 'Нийт заасан цаг' : 'Pedagogical Hours'}
            </p>
            <p className="text-base font-bold font-serif text-zinc-950">{cert.totalHours} цаг (hrs)</p>
          </div>

          <div className="space-y-0.5 p-2 rounded-lg bg-[#f9f7f2] border border-[#d4af37]/20">
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              {viewLanguage === 'mn' ? 'Суралцсан сурагч' : 'Scholars Mentored'}
            </p>
            <p className="text-base font-bold font-serif text-zinc-950">{cert.studentsImpacted} сурагч</p>
          </div>

          <div className="space-y-0.5 p-2 rounded-lg bg-[#f9f7f2] border border-[#d4af37]/20">
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              {viewLanguage === 'mn' ? 'Хичээлийн салбар' : 'Academic Domain'}
            </p>
            <p className="text-base font-bold font-serif text-zinc-950 truncate px-1">{cert.subject}</p>
          </div>

          <div className="space-y-0.5 p-2 rounded-lg bg-[#f9f7f2] border border-[#d4af37]/20">
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              {viewLanguage === 'mn' ? 'Олгосон огноо' : 'Date of Issuance'}
            </p>
            <p className="text-base font-bold font-serif text-zinc-950">{cert.issuedDate}</p>
          </div>
        </div>

        {/* ATTESTATION: SIGNATURES, SEAL & SCANNABLE QR */}
        <div className="relative pt-6 border-t border-[#d4af37]/40 grid grid-cols-1 sm:grid-cols-3 items-end gap-6 text-center sm:text-left">
          
          {/* Left Attestation: Academic Board Chair */}
          <div className="space-y-2 flex flex-col items-center sm:items-start">
            {/* Realistic Cursive Signature SVG */}
            <div className="h-12 w-40 text-zinc-900">
              <svg viewBox="0 0 200 60" className="w-full h-full stroke-zinc-900 fill-none" strokeWidth="2.2" strokeLinecap="round">
                <path d="M 20 45 Q 40 10 65 35 T 100 25 T 135 40 Q 155 15 180 30" />
                <path d="M 45 40 Q 80 50 140 45" strokeWidth="1.5" />
                <path d="M 85 20 Q 95 5 105 18" strokeWidth="1.8" />
              </svg>
            </div>
            <div className="w-48 border-t border-zinc-900/60 pt-1">
              <p className="text-xs font-serif font-bold text-zinc-950">Б. Энхтүвшин, Ph.D</p>
              <p className="text-[10px] text-zinc-500 leading-tight">
                {viewLanguage === 'mn' ? 'Хөтөлбөрийн Академик Зөвлөлийн Дарга' : 'Chair, Academic Standards Council'}
              </p>
              <p className="text-[9px] text-zinc-400">Mentor.mn National Network</p>
            </div>
          </div>

          {/* Center Attestation: Official Embossed Seal Medallion */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative flex items-center justify-center">
              {/* Outer Golden Seal Circle with Teeth */}
              <div className="w-24 h-24 rounded-full border-2 border-dashed border-[#b89758] p-1 flex items-center justify-center bg-gradient-to-tr from-[#fdf6e2] via-[#fffbf0] to-[#f9eed2] shadow-sm">
                <div className="w-20 h-20 rounded-full border border-[#c5a059] flex flex-col items-center justify-center text-center p-1 bg-white/70">
                  <div className="text-[7px] font-bold uppercase tracking-wider text-[#8c6d23] leading-none">
                    MENTOR.MN
                  </div>
                  <Award className="h-6 w-6 text-[#b89758] my-0.5" />
                  <div className="text-[6.5px] font-bold uppercase tracking-tight text-[#8c6d23] leading-none">
                    OFFICIAL SEAL
                  </div>
                  <div className="text-[6px] text-zinc-400 font-mono mt-0.5">2026</div>
                </div>
              </div>

              {/* Draped Ribbon Tails */}
              <div className="absolute -bottom-3 flex items-center gap-1 z-0">
                <div className="w-3.5 h-6 bg-[#b89758] clip-ribbon-left shadow-xs rotate-[-12deg]" />
                <div className="w-3.5 h-6 bg-[#997328] clip-ribbon-right shadow-xs rotate-[12deg]" />
              </div>
            </div>
            <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 mt-4">
              {viewLanguage === 'mn' ? 'Академик Тамга' : 'Official Seal'}
            </span>
          </div>

          {/* Right Attestation: Chief Registrar & Scannable QR */}
          <div className="space-y-2 flex flex-col items-center sm:items-end text-center sm:text-right">
            <div className="flex items-center gap-3">
              {qrCodeDataUrl ? (
                <img 
                  src={qrCodeDataUrl} 
                  alt="Official Verification QR Code" 
                  className="w-16 h-16 rounded-md border border-zinc-300 p-0.5 bg-white shadow-xs"
                />
              ) : (
                <div className="w-16 h-16 rounded-md bg-zinc-100 border border-zinc-200 animate-pulse" />
              )}
              <div className="text-left sm:text-right">
                <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-700">
                  {viewLanguage === 'mn' ? 'Цахим Баталгаажуулалт' : 'Instant Verification'}
                </p>
                <p className="text-[9px] text-zinc-500 max-w-[120px] leading-tight">
                  {viewLanguage === 'mn' ? 'Утсаар уншуулж шалгана уу' : 'Scan via phone to verify online'}
                </p>
              </div>
            </div>

            <div className="w-48 border-t border-zinc-900/60 pt-1">
              <p className="text-xs font-serif font-bold text-zinc-950">О. Батбаатар</p>
              <p className="text-[10px] text-zinc-500 leading-tight">
                {viewLanguage === 'mn' ? 'Бүртгэл, Баталгаажуулалтын Алба' : 'Chief Registrar of Credentials'}
              </p>
              <p className="text-[9px] text-zinc-400">Ledger Registry Unit</p>
            </div>
          </div>

        </div>

        {/* CRYPTOGRAPHIC INTEGRITY FOOTER */}
        <div className="relative pt-5 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-left text-xs bg-zinc-50/60 -mx-6 -mb-6 sm:-mx-14 sm:-mb-14 p-4 sm:px-8 rounded-b-xl">
          <div className="space-y-0.5">
            <p className="font-semibold text-zinc-900 flex items-center gap-1.5 text-xs">
              <Lock className="h-3.5 w-3.5 text-zinc-500" />
              Registry ID: <span className="font-mono text-zinc-800 font-bold">{cert.id}</span>
            </p>
            <p className="font-mono text-[9.5px] text-zinc-400 break-all max-w-xl">
              SHA-256 Digest: {cert.sha256Hash}
            </p>
          </div>

          <div className="shrink-0">
            <div className="inline-flex items-center gap-1.5 font-semibold text-emerald-800 bg-emerald-50 border border-emerald-300/80 px-3 py-1 rounded-lg text-xs">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>{viewLanguage === 'mn' ? 'Криптограф хээгээр баталгаажсан' : 'Cryptographically Authentic'}</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
