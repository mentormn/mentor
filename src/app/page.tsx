'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useLanguage } from '@/lib/i18n';
import { 
  GraduationCap, 
  Users, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Calendar, 
  Sparkles,
  BookOpen,
  Clock,
  Coins
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredClasses, setFeaturedClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadClasses() {
      try {
        const { data, error } = await supabase
          .from('sprint_classes')
          .select(`
            *,
            class_enrollments (id)
          `)
          .order('created_at', { ascending: false })
          .limit(3);

        if (!error && data && data.length > 0) {
          setFeaturedClasses(data);
        }
      } catch (err) {
        console.error('Error loading featured classes:', err);
      } finally {
        setLoading(false);
      }
    }

    loadClasses();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/classes?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/classes');
    }
  };

  return (
    <div className="space-y-20 pb-20">
      
      {/* Hero Section */}
      <section className="pt-16 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center space-y-6">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3.5 py-1 text-xs font-semibold text-zinc-700">
          <span className="h-2 w-2 rounded-full bg-blue-600" />
          <span>{language === 'mn' ? 'Монголын үе тэнгийн академик менторшил' : 'Peer Academic Mentorship in Mongolia'}</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-zinc-900 leading-[1.12]">
          {language === 'mn' ? (
            <>
              Өөрийн хичээл зүтгэлээр эзэмшсэн{' '}
              <span className="text-blue-600">үе тэнгийнхнээсээ</span> суралц.
            </>
          ) : (
            <>
              Learn directly from students who{' '}
              <span className="text-blue-600">actually mastered it.</span>
            </>
          )}
        </h1>

        {/* Subhead */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-zinc-600 leading-relaxed">
          {language === 'mn'
            ? 'Хуучирсан лекцээр цаг үрэхээ боль. Монголын шилдэг сургууль, их сургуулийн үе тэнгийн менторуудтай 1–3 долоо хоногийн богино спринт ангид (1-10 суудал) нэгдэж, бодит бүтээл хийн суралцаарай.'
            : 'Skip passive, boring classroom lectures. Join focused 1–3 week sprint cohorts (1 to 10 seats) led by proven peer champions from Mongolia\'s top schools and universities.'}
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-xl mx-auto pt-2">
          <div className="flex items-center gap-2 p-1.5 rounded-xl border border-zinc-300 bg-white shadow-sm focus-within:border-zinc-900 focus-within:ring-2 focus-within:ring-zinc-900/10 transition-all">
            <Search className="h-4 w-4 text-zinc-400 ml-2.5 shrink-0" />
            <input
              type="text"
              placeholder={language === 'mn' ? 'Хичээл эсвэл сэдвээр хайх (Жишээ: Математик, SAT, Python)...' : 'Search by topic (e.g. Cambridge Math, SAT, Python, Physics)...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs sm:text-sm text-zinc-900 placeholder-zinc-400 bg-transparent outline-none"
            />
            <button
              type="submit"
              className="btn-primary px-4 py-2 rounded-lg text-xs font-medium shrink-0"
            >
              {language === 'mn' ? 'Хайх' : 'Search'}
            </button>
          </div>
        </form>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/classes"
            className="w-full sm:w-auto btn-primary inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs font-medium shadow-sm"
          >
            <span>{language === 'mn' ? 'Бүх хичээлүүдийг үзэх' : 'Explore All Sprints'}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>

          <Link
            href="/classes/create"
            className="w-full sm:w-auto btn-secondary inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs font-medium"
          >
            <GraduationCap className="h-4 w-4 text-zinc-600" />
            <span>{language === 'mn' ? 'Ментороор хичээл нээх' : 'Host a Sprint as Mentor'}</span>
          </Link>
        </div>

      </section>

      {/* Trust & Stats Bar */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-2xl sm:text-3xl font-bold text-zinc-900">28</p>
            <p className="text-xs text-zinc-500 mt-0.5">
              {language === 'mn' ? 'Идэвхтэй спринт ангиуд' : 'Active Sprint Classes'}
            </p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-bold text-zinc-900">94</p>
            <p className="text-xs text-zinc-500 mt-0.5">
              {language === 'mn' ? 'Суралцсан сурагчид' : 'Students Guided'}
            </p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-bold text-zinc-900">16</p>
            <p className="text-xs text-zinc-500 mt-0.5">
              {language === 'mn' ? 'Хамрагдсан 21 аймаг' : 'Aimags Reached'}
            </p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-bold text-zinc-900">1–10</p>
            <p className="text-xs text-zinc-500 mt-0.5">
              {language === 'mn' ? 'Суудлын хязгаар (Бичил анги)' : 'Seats per Cohort'}
            </p>
          </div>
        </div>
      </section>

      {/* Featured Sprints */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900">
              {language === 'mn' ? 'Нээлттэй спринт хичээлүүд' : 'Open Sprint Classes'}
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              {language === 'mn' ? 'Удахгүй эхлэх, сул суудалтай ангиуд' : 'Upcoming cohorts with open seats'}
            </p>
          </div>

          <Link
            href="/classes"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>{language === 'mn' ? 'Бүгдийг үзэх' : 'View all'}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {featuredClasses.map((cls) => {
            const enrollCount = (cls.class_enrollments || []).length;
            const seatsLeft = cls.max_seats - enrollCount;

            return (
              <div
                key={cls.id}
                className="saas-card p-5 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                      {cls.subject}
                    </span>
                    <span className="text-zinc-500 text-[11px]">
                      {cls.curriculum}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-zinc-900 leading-snug line-clamp-2">
                    {cls.title}
                  </h3>

                  <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed">
                    {cls.description}
                  </p>

                  <div className="pt-3 border-t border-zinc-100 space-y-1 text-xs text-zinc-600">
                    <div className="flex items-center justify-between">
                      <span>Mentor: <strong className="text-zinc-900">{cls.mentor_name}</strong></span>
                      <span className="text-zinc-500 text-[11px]">{cls.mentor_school}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>{cls.duration_weeks} {language === 'mn' ? 'долоо хоног' : 'weeks'}</span>
                      <span className="font-semibold text-zinc-900">
                        {!cls.price_mnt || cls.price_mnt === 0 ? (language === 'mn' ? 'Үнэгүй (0 ₮)' : 'Free') : `${cls.price_mnt.toLocaleString()} ₮`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
                  <span className="text-zinc-500">
                    {enrollCount} / {cls.max_seats} {language === 'mn' ? 'суудал дүүрсэн' : 'seats filled'}
                  </span>

                  <Link
                    href={`/class/${cls.id}`}
                    className="btn-secondary px-3 py-1.5 rounded-lg text-xs font-medium"
                  >
                    {language === 'mn' ? 'Дэлгэрэнгүй' : 'View Class'}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works (3 Steps) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-zinc-900">
            {language === 'mn' ? 'Мэдлэгийн хүрд хэрхэн ажилладаг вэ?' : 'How Mentor.mn Works'}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 max-w-lg mx-auto">
            {language === 'mn'
              ? 'Сурагчид бие биенээ хөгжүүлж, бодит бүтээл хийх тогтолцоо'
              : 'A transparent peer-driven system focused on tangible mastery'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="saas-card p-6 space-y-3">
            <div className="h-8 w-8 rounded-lg bg-zinc-100 flex items-center justify-center font-bold text-xs text-zinc-800">
              1
            </div>
            <h3 className="text-sm font-bold text-zinc-900">
              {language === 'mn' ? 'Спринт хичээлээ сонгох' : '1. Claim Your Seat'}
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              {language === 'mn'
                ? 'Өөрийн сонирхсон сэдвээр (Олимпиад, SAT, Кодчилол) 1–10 суудлын бичил ангиас сонгон шууд суудал захиална.'
                : 'Browse 1–3 week micro-cohorts (1 to 10 seats) in Math, SAT, Coding, and Physics led by top peer mentors.'}
            </p>
          </div>

          <div className="saas-card p-6 space-y-3">
            <div className="h-8 w-8 rounded-lg bg-zinc-100 flex items-center justify-center font-bold text-xs text-zinc-800">
              2
            </div>
            <h3 className="text-sm font-bold text-zinc-900">
              {language === 'mn' ? 'Бодит бүтээл хийж эзэмших' : '2. Build Tangible Artifacts'}
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              {language === 'mn'
                ? 'Лекц сонсохоос илүүтэй долоо хоног бүр бодит бодлого бодох, код бичих эсвэл судалгаа хийж ментороороо батлуулна.'
                : 'No passive lectures. Submit working codebases, solved olympiad proofs, or project writeups for 1-on-1 mentor verification.'}
            </p>
          </div>

          <div className="saas-card p-6 space-y-3">
            <div className="h-8 w-8 rounded-lg bg-zinc-100 flex items-center justify-center font-bold text-xs text-zinc-800">
              3
            </div>
            <h3 className="text-sm font-bold text-zinc-900">
              {language === 'mn' ? 'Дүү нартаа заах & Зэрэг ахих' : '3. Pay It Forward & Mentor'}
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              {language === 'mn'
                ? 'Хичээлээ амжилттай дүүргэсэн сурагч өөрөө дараагийн дүү нартаа зааж өгөх эрхтэй болж албан ёсны зэрэг ахина.'
                : 'Graduated students unlock mentor credentials, hosting their own micro-cohorts and guiding younger peers across Mongolia.'}
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <h2 className="text-xl font-bold text-zinc-900 text-center">
          {language === 'mn' ? 'Сурагч, менторуудын сэтгэгдэл' : 'Trusted by Students & Mentors'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="saas-card p-6 space-y-3">
            <p className="text-xs sm:text-sm text-zinc-700 italic leading-relaxed">
              &ldquo;Багшийн танхимын лекцээс илүүтэй саяхан олимпиадад амжилттай оролцсон ах эгч нар маань яг хаана гацдагийг маш сайн ойлгож, шууд бодлогын гол санааг хэлж өгсөн нь үнэхээр тус болсон.&rdquo;
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700">
                М
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-900">Мөнхжин А.</p>
                <p className="text-[11px] text-zinc-500">Ховд 1-р сургууль, 11-р анги</p>
              </div>
            </div>
          </div>

          <div className="saas-card p-6 space-y-3">
            <p className="text-xs sm:text-sm text-zinc-700 italic leading-relaxed">
              &ldquo;Өөрөө сурсан зүйлээ 3 дүү нартаа зааж өгөх үед өөрийнхөө ойлголт улам батжиж, өөртөө итгэлтэй болдог юм байна. Албан ёсны сертификат нь гадаадын их сургуулийн анкет бөглөхөд маш том давуу тал болсон.&rdquo;
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-700">
                Т
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-900">Тэмүүлэн Б.</p>
                <p className="text-[11px] text-zinc-500">1-р сургууль, Ахлах Ментор</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
