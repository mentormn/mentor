'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/i18n';
import { 
  GraduationCap, 
  ArrowRight, 
  CheckCircle2, 
  Award, 
  Users, 
  BookOpen, 
  Sparkles,
  Target,
  School,
  Globe2,
  ShieldCheck,
  Zap
} from 'lucide-react';

const NATIONAL_SUBJECTS = [
  'Mathematics (Математик)',
  'Physics (Физик)',
  'Chemistry (Хими)',
  'Biology (Биологи)',
  'ICT (Мэдээлэл зүй)',
  'Mongolian Language (Монгол хэл)',
  'English Language (Англи хэл)',
  'History & Social Science (Түүх, нийгэм)',
  'Geography (Газар зүй)',
  'Art & Design (Дүрслэх урлаг)',
  'Music (Хөгжим)',
  'Physical Education (Биеийн тамир)'
];

const CAMBRIDGE_SUBJECTS = [
  'Mathematics (IGCSE / AS / A-Level)',
  'Physics (IGCSE / AS / A-Level)',
  'Chemistry (IGCSE / AS / A-Level)',
  'Biology (IGCSE / AS / A-Level)',
  'English Language (First / Second)',
  'ICT / Computer Science',
  'Business Studies',
  'History & Social Science',
  'Geography',
  'Chinese Language',
  'Japanese Language',
  'Art & Design',
  'Music',
  'Physical Education'
];

export default function HomePage() {
  const { language } = useLanguage();

  return (
    <div className="space-y-24 pb-20">
      
      {/* 1. HERO SECTION: Introduction & Purpose */}
      <section className="relative pt-12 pb-8 sm:pt-20 sm:pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center space-y-6">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3.5 py-1 text-xs font-medium text-zinc-800 shadow-sm">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{language === 'mn' ? 'Монгол Улсын Үндэсний Академик Дэд Бүтэц' : 'National Academic Peer Mentorship Infrastructure'}</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-900 leading-[1.15]">
          {language === 'mn' ? (
            <>
              Монголын шилдэг оюутнууд <br />
              <span className="text-zinc-500">дүү нартаа заана.</span>
            </>
          ) : (
            <>
              Where Mongolia&apos;s brightest <br />
              <span className="text-zinc-500">teach the next generation.</span>
            </>
          )}
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-zinc-600 max-w-2xl mx-auto leading-relaxed">
          {language === 'mn'
            ? 'Үндэсний болон Кембрижийн хөтөлбөрийн дагуу олимпиадын медальтнууд, шилдэг их сургуулийн оюутнууд 21 аймгийн сурагчдад 1–10 сурагчтай бичил ангиар биечлэн зааж, их дээд сургуульд хүчинтэй албан ёсны батламж олгох платформ.'
            : 'Connecting ambitious students across Mongolia with verified olympiad medalists and top university scholars for intensive 1–4 week academic sprints under National and Cambridge curricula.'}
        </p>

        {/* Primary Action Button */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/login"
            className="btn-primary px-8 py-3.5 text-sm font-medium text-white shadow-sm flex items-center justify-center gap-2 rounded-xl w-full sm:w-auto"
          >
            <span>{language === 'mn' ? 'Платформд нэвтрэх / Бүртгүүлэх' : 'Sign In / Join Mentor.mn'}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/verify"
            className="btn-secondary px-6 py-3.5 text-sm font-medium text-zinc-800 shadow-sm flex items-center justify-center gap-2 rounded-xl border border-zinc-300 w-full sm:w-auto"
          >
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>{language === 'mn' ? 'Батламж шалгах' : 'Verify Certificate'}</span>
          </Link>
        </div>

        {/* Key Stats Bar */}
        <div className="pt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-zinc-200 text-left">
          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100">
            <div className="text-2xl font-bold text-zinc-900">1–4 Weeks</div>
            <div className="text-xs text-zinc-500 mt-0.5">
              {language === 'mn' ? 'Эрчимжүүлсэн спринт' : 'Intensive sprints'}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100">
            <div className="text-2xl font-bold text-zinc-900">2 Хөтөлбөр</div>
            <div className="text-xs text-zinc-500 mt-0.5">
              {language === 'mn' ? 'Үндэсний & Кембриж' : 'National & Cambridge'}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100">
            <div className="text-2xl font-bold text-zinc-900">1–10</div>
            <div className="text-xs text-zinc-500 mt-0.5">
              {language === 'mn' ? 'Суудалтай бичил ангиуд' : 'Seats per cohort pod'}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100">
            <div className="text-2xl font-bold text-zinc-900">21 Aimag</div>
            <div className="text-xs text-zinc-500 mt-0.5">
              {language === 'mn' ? 'Хүртээмжтэй сүлжээ' : 'Nationwide reach'}
            </div>
          </div>
        </div>

      </section>

      {/* 2. CURRICULUMS OFFERED */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <span className="badge-accent text-xs">
            {language === 'mn' ? 'Хөтөлбөрүүд' : 'Supported Curricula'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
            {language === 'mn' ? 'Манай сургуулийн хөтөлбөрүүд' : 'National & Cambridge Standards'}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 max-w-xl mx-auto">
            {language === 'mn'
              ? 'Бид эхний ээлжинд Үндэсний болон Кембрижийн хөтөлбөрийн хичээлүүдээр дагнасан сургалтуудыг зохион байгуулж байна.'
              : 'Focusing on rigorous mastery across all core subject areas.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* National Curriculum */}
          <div className="saas-card p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2">
                <School className="h-5 w-5 text-blue-600" />
                <h3 className="text-base font-bold text-zinc-900">
                  National Curriculum (Үндэсний хөтөлбөр)
                </h3>
              </div>
              <span className="badge-accent text-xs">12 Хичээл</span>
            </div>
            <p className="text-xs text-zinc-500">
              {language === 'mn'
                ? 'Ерөнхий боловсролын сургуулийн хичээл, улсын олимпиад, ЭЕШ-д бэлтгэх гүнзгийрүүлсэн бичил ангиуд.'
                : 'National curriculum subjects for domestic olympiad prep and academic excellence.'}
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {NATIONAL_SUBJECTS.map((sub) => (
                <span key={sub} className="text-[11px] px-2.5 py-1 rounded-md bg-zinc-100 text-zinc-700 font-medium">
                  {sub}
                </span>
              ))}
            </div>
          </div>

          {/* Cambridge Curriculum */}
          <div className="saas-card p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2">
                <Globe2 className="h-5 w-5 text-emerald-600" />
                <h3 className="text-base font-bold text-zinc-900">
                  Cambridge Curriculum (IGCSE / AS / A-Levels)
                </h3>
              </div>
              <span className="badge-accent text-xs">14 Хичээл</span>
            </div>
            <p className="text-xs text-zinc-500">
              {language === 'mn'
                ? 'Кембрижийн олон улсын хөтөлбөрийн IGCSE, AS болон A-Level түвшний хичээлүүд.'
                : 'Cambridge international qualifications for students targeting global universities.'}
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {CAMBRIDGE_SUBJECTS.map((sub) => (
                <span key={sub} className="text-[11px] px-2.5 py-1 rounded-md bg-zinc-100 text-zinc-700 font-medium">
                  {sub}
                </span>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 3. HOW IT WORKS: The 3 Core Pillars */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="badge-accent text-xs">
            {language === 'mn' ? 'Платформын ажиллах зарчим' : 'How Mentor.mn Works'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
            {language === 'mn' ? 'Үе тэнгийн боловсролын 3 үндсэн тулгуур' : 'Three Pillars of Peer Academic Leadership'}
          </h2>
          <p className="text-sm text-zinc-500 max-w-xl mx-auto">
            {language === 'mn'
              ? 'Уламжлалт том танхимын лекцийг халж, 1-10 сурагчтай эрчимтэй спринтээр үр дүнд хүргэнэ.'
              : 'Moving beyond passive video lectures to intensive, cohort-based mastery with personal mentor feedback.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Pillar 1 */}
          <div className="saas-card p-6 space-y-4">
            <div className="h-10 w-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              <Users className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-900">
              {language === 'mn' ? '1. Бичил ангиуд (1–10 суудал)' : '1. Small Cohorts (1–10 Seats)'}
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              {language === 'mn'
                ? 'Нэг ангид цөөн сурагч суралцана. Ментор сурагч бүрийн гаргасан алдааг тухай бүрт нь тайлбарлаж, ганцаарчилсан санал шүүмж өгнө.'
                : 'Cohorts are kept small. Mentors provide individualized line-by-line feedback on your work.'}
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="saas-card p-6 space-y-4">
            <div className="h-10 w-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              <Target className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-900">
              {language === 'mn' ? '2. Бодит бүтээл (Weekly Proof)' : '2. Verifiable Deliverables'}
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              {language === 'mn'
                ? 'Долоо хоног бүр шалгуулах бодлогын бодолт, төсөл, судалгааны бүтээлүүдээ танхимдаа илгээнэ. Хоосон сертификат бус, бодит чадварыг үнэлнэ.'
                : 'Students submit solved problem sets, annotated research reviews, and code artifacts.'}
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="saas-card p-6 space-y-4">
            <div className="h-10 w-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              <Award className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-zinc-900">
              {language === 'mn' ? '3. Албан ёсны батламж' : '3. Verified Credential'}
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              {language === 'mn'
                ? 'Спринтийн турш гүйцэтгэсэн бодит бүтээл, бодлогын бодолтуудыг ментор шалган баталгаажуулж, их сургуульд хүчинтэй дижитал батламж олгоно.'
                : 'Submit real deliverables and solved problem sets to earn a tamper-proof, verified academic credential signed by your mentor.'}
            </p>
          </div>

        </div>
      </section>

      {/* 3.5 CERTIFICATE VERIFICATION BANNER */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="saas-card p-6 sm:p-8 bg-gradient-to-r from-zinc-900 to-zinc-800 text-white flex flex-col sm:flex-row items-center justify-between gap-6 rounded-2xl shadow-md">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-400">
              <ShieldCheck className="h-4 w-4" />
              <span>{language === 'mn' ? 'Криптограф баталгаажуулалт' : 'Cryptographic Integrity'}</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold">
              {language === 'mn' ? 'Академик Батламжийн Үнэн Зөвийг Шалгах' : 'Verify Academic Credential Authenticity'}
            </h3>
            <p className="text-xs text-zinc-300 max-w-xl leading-relaxed">
              {language === 'mn'
                ? 'Их дээд сургуулиуд, ажил олгогчид болон эцэг эхчүүд сурагчийн батламжийн дугаарыг оруулж, SHA-256 криптограф шалгалтаар жинхэнэ эсэхийг нь шууд шалгах боломжтой.'
                : 'Universities and institutions can verify issued certificates and student deliverables instantly via SHA-256 tamper-proof verification.'}
            </p>
          </div>
          <Link
            href="/verify"
            className="px-5 py-2.5 text-xs font-semibold bg-white text-zinc-900 rounded-xl hover:bg-zinc-100 transition-colors shadow-sm inline-flex items-center gap-2 shrink-0"
          >
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>{language === 'mn' ? 'Батламж шалгах' : 'Verify Certificate'}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      {/* 3.7 10-MINUTE SOS FLASH MENTORING */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="saas-card p-6 sm:p-8 border-blue-200 bg-gradient-to-br from-blue-50/50 via-white to-amber-50/30 rounded-2xl space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-blue-100 pb-5">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-0.5 text-xs font-semibold text-blue-800">
                <Zap className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                <span>{language === 'mn' ? 'Шинэ боломж: Шуурхай тусламж' : 'New Feature: 10-Min Flash Help'}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-zinc-900">
                {language === 'mn' ? 'Гацсан бодлогоо 10 минутад ойлгоорой' : 'Get Unstuck in 10 Minutes with a Mentor'}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 max-w-xl">
                {language === 'mn'
                  ? 'Хичээлээ хийж байх үед ойлгохгүй бодлого, томьёо эсвэл даалгавар гарвал платформд нийтэлж, шилдэг ментороос 10 минутын ганцаарчилсан шууд тайлбар аваарай.'
                  : 'Stuck on any academic question or exam problem? Post your request and get connected with an experienced peer mentor for a focused 10-minute 1-on-1 sprint.'}
              </p>
            </div>
            <Link
              href="/sos"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-blue-700 shadow-sm transition-colors shrink-0"
            >
              <Zap className="h-4 w-4 text-amber-300 fill-amber-300" />
              <span>{language === 'mn' ? 'Шуурхай тусламж руу очих' : 'Explore 10-Min SOS'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            <div className="rounded-xl border border-blue-100 bg-white p-4 space-y-1.5 shadow-sm">
              <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h4 className="text-sm font-semibold text-zinc-900">
                {language === 'mn' ? 'Бодлогоо нийтэлнэ' : 'Post Your Problem'}
              </h4>
              <p className="text-xs text-zinc-500">
                {language === 'mn'
                  ? 'Ойлгохгүй байгаа сэдэв, бодлогынхоо зураг эсвэл текстийг сургууль, ангийнхаа мэдээлэлтэй оруулна.'
                  : 'Snap a picture or describe the concept you cannot understand.'}
              </p>
            </div>

            <div className="rounded-xl border border-blue-100 bg-white p-4 space-y-1.5 shadow-sm">
              <div className="h-8 w-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h4 className="text-sm font-semibold text-zinc-900">
                {language === 'mn' ? 'Ментор сонгож холбогдоно' : 'Mentor Claims Call'}
              </h4>
              <p className="text-xs text-zinc-500">
                {language === 'mn'
                  ? 'Шилдэг ментор таны хүсэлтийг сонгон шууд Google Meet линкээр дуудлага эхлүүлнэ.'
                  : 'A qualified mentor claims your request and initiates an instant Google Meet call.'}
              </p>
            </div>

            <div className="rounded-xl border border-blue-100 bg-white p-4 space-y-1.5 shadow-sm">
              <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
                3
              </div>
              <h4 className="text-sm font-semibold text-zinc-900">
                {language === 'mn' ? '10 минутад ойлгож авна' : '10-Minute Rapid Mastery'}
              </h4>
              <p className="text-xs text-zinc-500">
                {language === 'mn'
                  ? 'Алдаагаа ойлгож, зөв бодох аргачлалаа 10 минутад баталгаажуулан цааш үргэлжлүүлнэ.'
                  : 'Get directly to the core mistake, master the method in 10 minutes, and keep moving.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHO CAN JOIN SECTION */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="saas-card p-8 sm:p-12 border-zinc-200 space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              {language === 'mn' ? 'Платформын оролцогчид' : 'Platform Roles'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
              {language === 'mn' ? 'Та суралцагч эсвэл ментор уу?' : 'Are you a Learner or a Mentor?'}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600">
              {language === 'mn'
                ? 'Нэвтэрсний дараа сурагчийн болон менторын эрхээр сургалтад хамрагдах эсвэл шинэ анги нээх боломжтой.'
                : 'Once you sign in, your dashboard gives you access to both learning in cohorts and hosting sprints as a verified mentor.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            
            {/* For Students */}
            <div className="rounded-xl border border-zinc-200 bg-zinc-50/60 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  {language === 'mn' ? 'Сурагчдын хувьд' : 'For Scholars & Students'}
                </span>
                <span className="badge-accent text-xs">Learner</span>
              </div>
              <h3 className="text-lg font-bold text-zinc-900">
                {language === 'mn' ? 'Шилдгүүдээс суралцах' : 'Learn Directly from Proven Peers'}
              </h3>
              <ul className="space-y-2 text-xs text-zinc-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>{language === 'mn' ? 'Олимпиад, SAT, Cambridge шалгалтын бодит туршлага' : 'Direct prep for Olympiads, SAT, and Cambridge AS/A-Levels'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>{language === 'mn' ? '1-10 сурагчтай ангид асуулт асуух, чөлөөтэй ярилцах' : 'Interactive small-group cohorts with open Q&A'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>{language === 'mn' ? 'Бүтээл бүрээ баталгаажуулж дижитал портфолио үүсгэх' : 'Build a verified deliverable portfolio for college applications'}</span>
                </li>
              </ul>
              <div className="pt-2">
                <Link
                  href="/login"
                  className="btn-secondary w-full py-2 text-xs font-medium text-zinc-900 text-center flex items-center justify-center gap-1.5"
                >
                  <span>{language === 'mn' ? 'Сурагчаар нэвтрэх' : 'Sign in as Student'}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* For Mentors */}
            <div className="rounded-xl border border-zinc-200 bg-zinc-50/60 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                  {language === 'mn' ? 'Менторуудын хувьд' : 'For Proven Scholars & Medalists'}
                </span>
                <span className="badge-accent text-xs">Mentor</span>
              </div>
              <h3 className="text-lg font-bold text-zinc-900">
                {language === 'mn' ? 'Мэдлэгээ хуваалцах & Зэрэг ахих' : 'Teach Younger Peers & Earn Standing'}
              </h3>
              <ul className="space-y-2 text-xs text-zinc-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>{language === 'mn' ? 'Өөрийн хуваарьт тохируулан 3 өдөр, 1-4 долоо хоногийн спринт нээх' : 'Host 3-day or 1-4 week cohorts on your own schedule'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>{language === 'mn' ? 'Ментор XP цуглуулан National Laureate зэрэг хүртэх' : 'Earn Mentor XP and advance to National Laureate tier'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>{language === 'mn' ? 'Их сургуульд хүчинтэй албан ёсны манлайллын батламж' : 'Receive official peer pedagogical leadership certificates'}</span>
                </li>
              </ul>
              <div className="pt-2">
                <Link
                  href="/login?mode=signup"
                  className="btn-primary w-full py-2 text-xs font-medium text-white text-center flex items-center justify-center gap-1.5"
                >
                  <span>{language === 'mn' ? 'Ментороор бүртгүүлэх' : 'Sign in as Mentor'}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. FAQ SECTION */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
            {language === 'mn' ? 'Түгээмэл асуултууд' : 'Frequently Asked Questions'}
          </h2>
          <p className="text-xs text-zinc-500">
            {language === 'mn' ? 'Платформын тухай дэлгэрэнгүй мэдээлэл' : 'Everything you need to know about the platform'}
          </p>
        </div>

        <div className="space-y-4">
          <div className="saas-card p-5 space-y-1.5">
            <h3 className="text-sm font-semibold text-zinc-900">
              {language === 'mn' ? 'Хичээлүүд хаана явагддаг вэ?' : 'Where do the classes take place?'}
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              {language === 'mn'
                ? 'Бүх хичээлүүд Google Meet-ээр онлайнаар шууд явагддаг бөгөөд даалгавар, хэлэлцүүлэг нь тухайн ангийн Mentor.mn танхимд явагддаг.'
                : 'All live sprint sessions take place online via Google Meet, while weekly missions, discussions, and deliverable reviews happen inside your cohort space.'}
            </p>
          </div>

          <div className="saas-card p-5 space-y-1.5">
            <h3 className="text-sm font-semibold text-zinc-900">
              {language === 'mn' ? 'Хичээлүүд хэрхэн зохион байгуулагддаг вэ?' : 'How are sprint sessions structured?'}
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              {language === 'mn'
                ? 'Спринт хичээл бүр 1-10 сурагчтай бичил бүлгээр явагддаг бөгөөд долоо хоног бүр тодорхой бодлого, төсөл, судалгааны бүтээлийг менторын шууд удирдлага дор хийж гүйцэтгэдэг.'
                : 'Each sprint is hosted in small pods (1-10 seats) with live weekly Google Meet sessions, problem sets, and personal mentor reviews.'}
            </p>
          </div>

          <div className="saas-card p-5 space-y-1.5">
            <h3 className="text-sm font-semibold text-zinc-900">
              {language === 'mn' ? 'Хэн ментор болох боломжтой вэ?' : 'Who can become a mentor?'}
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              {language === 'mn'
                ? 'Улс, олон улсын олимпиадад амжилт гаргасан, SAT, Cambridge шалгалтын өндөр оноотой, эсвэл дотоод гадаадын их сургуулийн шилдэг оюутнууд ментороор бүртгүүлэн анги нээх боломжтой.'
                : 'Olympiad medalists, students with top scores, and university scholars can register and launch sprint cohorts.'}
            </p>
          </div>
        </div>
      </section>

      {/* 6. BOTTOM CALL TO ACTION */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        <div className="saas-card p-10 sm:p-14 space-y-6 bg-zinc-900 text-white shadow-xl rounded-3xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white shadow-inner">
            <GraduationCap className="h-7 w-7 text-amber-300" />
          </div>
          <div className="space-y-2 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {language === 'mn' ? 'Үндэсний академик сүлжээнд нэгдээрэй' : 'Join the National Mentorship Network'}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              {language === 'mn'
                ? 'Өөрийн хаягаар нэвтэрч, идэвхтэй бичил ангиуд, менторууд болон хуваарьт хичээлүүдэд нэвтрээрэй.'
                : 'Sign in to access cohort sprints, verified mentors, and interactive class spaces.'}
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/login"
              className="px-8 py-3 text-xs font-semibold text-zinc-900 bg-white rounded-xl hover:bg-zinc-100 transition-colors shadow-sm inline-flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <span>{language === 'mn' ? 'Нэвтрэх / Бүртгүүлэх' : 'Sign In / Register'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/verify"
              className="px-6 py-3 text-xs font-semibold text-white bg-zinc-800 border border-zinc-700 rounded-xl hover:bg-zinc-700 transition-colors inline-flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>{language === 'mn' ? 'Батламж шалгах' : 'Verify Certificate'}</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
