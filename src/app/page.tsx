'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
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
  Layers,
  Coins,
  ChevronRight
} from 'lucide-react';
import { NATIONAL_TELEMETRY } from '@/lib/mockData';
import { TIER_CONFIGS } from '@/lib/engine/tierProgression';
import { useLanguage } from '@/lib/i18n';
import { FormalTier } from '@/lib/types';

export default function Home() {
  const { language, t } = useLanguage();
  const [featuredClasses, setFeaturedClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeatured() {
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

    loadFeatured();
  }, []);

  return (
    <div className="relative space-y-20 pb-20 overflow-hidden bg-grid-pattern">
      <div className="absolute inset-0 bg-radial-top pointer-events-none" />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 text-center">
        <div className="mx-auto max-w-4xl space-y-6">
          
          {/* Institutional Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3.5 py-1.5 text-xs font-semibold text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
            <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
            <span>{t('heroBadge')}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white leading-[1.12]">
            {t('heroTitlePrefix')}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
              {t('heroTitleHighlight')}
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-sm sm:text-base text-zinc-400 leading-relaxed font-normal">
            {t('heroDesc')}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href="/classes"
              className="btn-primary w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-medium text-white shadow-xl"
            >
              <Compass className="h-4 w-4" />
              <span>{t('heroFindClass')}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/classes/create"
              className="btn-secondary w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-medium text-zinc-300 hover:text-white"
            >
              <GraduationCap className="h-4 w-4 text-blue-400" />
              <span>{t('heroOpenClass')}</span>
            </Link>
          </div>

          {/* Guarantee Badges */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-[11px] text-zinc-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              {t('badgeCohorts')}
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              {t('badgeDeliverables')}
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              {t('badgeCredentials')}
            </span>
          </div>

        </div>
      </section>

      {/* Live Flywheel Telemetry Stats */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-white/[0.06]">
            <div>
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-amber-400" />
                <h2 className="text-sm sm:text-base font-bold text-white">
                  {t('flywheelTitle')}
                </h2>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                {t('flywheelSubtitle')}
              </p>
            </div>
            <Link
              href="/ministry/audit"
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300"
            >
              <span>{t('flywheelAuditLink')}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
            <div className="space-y-1">
              <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
                {t('statActiveClasses')}
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-white">
                {NATIONAL_TELEMETRY.activeClasses}
              </p>
              <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                {t('statActiveSub')}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
                {t('statStudents')}
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-white">
                {NATIONAL_TELEMETRY.totalStudentsTaught}
              </p>
              <p className="text-[11px] text-zinc-500">{t('statStudentsSub')}</p>
            </div>

            <div className="space-y-1">
              <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
                {t('statAimags')}
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-blue-400">
                {NATIONAL_TELEMETRY.aimagsReached} / 21
              </p>
              <p className="text-[11px] text-zinc-500">{t('statAimagsSub')}</p>
            </div>

            <div className="space-y-1">
              <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
                {t('statMultiplier')}
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-amber-400">
                {NATIONAL_TELEMETRY.knowledgeMultiplier}
              </p>
              <p className="text-[11px] text-zinc-500">{t('statMultiplierSub')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* The 3-Step Flywheel */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {t('howItWorksTitle')}
          </h2>
          <p className="mx-auto max-w-xl text-xs sm:text-sm text-zinc-400">
            {t('howItWorksSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="glass-panel-interactive rounded-2xl p-6 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold text-sm">
              01
            </div>
            <h3 className="text-sm font-bold text-white">
              {t('step1Title')}
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {t('step1Desc')}
            </p>
          </div>

          <div className="glass-panel-interactive rounded-2xl p-6 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-sm">
              02
            </div>
            <h3 className="text-sm font-bold text-white">
              {t('step2Title')}
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {t('step2Desc')}
            </p>
          </div>

          <div className="glass-panel-interactive rounded-2xl p-6 space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold text-sm">
              03
            </div>
            <h3 className="text-sm font-bold text-white">
              {t('step3Title')}
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {t('step3Desc')}
            </p>
          </div>

        </div>
      </section>

      {/* Featured Sprints */}
      {featuredClasses.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                {t('openClassesTitle')}
              </h2>
              <p className="text-xs text-zinc-400">{t('openClassesSub')}</p>
            </div>
            <Link
              href="/classes"
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              <span>{t('browseAllClasses')}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {featuredClasses.map((cls) => {
              const enrollCount = (cls.class_enrollments || []).length;
              const seatsLeft = cls.max_seats - enrollCount;
              const tierKey = (cls.mentor_tier || 'JUNIOR_MENTOR') as FormalTier;
              const tierConfig = TIER_CONFIGS[tierKey] || TIER_CONFIGS['JUNIOR_MENTOR'];

              return (
                <div
                  key={cls.id}
                  className="glass-panel-interactive rounded-2xl p-5 sm:p-6 flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[11px] font-medium text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-md">
                        {cls.subject}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${tierConfig.badgeClass}`}
                      >
                        <Sparkles className="h-2.5 w-2.5" />
                        {language === 'mn' ? tierConfig.titleMn : tierConfig.titleEn}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-2">
                      {cls.title}
                    </h3>

                    <p className="text-xs text-zinc-400 line-clamp-2">
                      {cls.description}
                    </p>

                    <div className="pt-2 border-t border-white/[0.06] space-y-1.5 text-xs text-zinc-400">
                      <div className="flex items-center justify-between">
                        <span>Mentor: <strong className="text-zinc-200">{cls.mentor_name}</strong></span>
                        <span className="text-[11px] text-zinc-500">{cls.mentor_school}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>{cls.duration_weeks} Weeks • {cls.schedule_summary}</span>
                        <span className="text-emerald-400 font-medium">
                          {!cls.price_mnt || cls.price_mnt === 0 ? t('priceFree') : `${cls.price_mnt.toLocaleString()} ₮`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                    <div className="text-xs">
                      <span className="font-semibold text-white">
                        {enrollCount} / {cls.max_seats}
                      </span>{' '}
                      <span className="text-zinc-500 text-[11px]">{t('seatsFilled')}</span>
                    </div>

                    <Link
                      href={`/class/${cls.id}`}
                      className="btn-primary px-3 py-1.5 text-xs font-medium text-white rounded-lg"
                    >
                      {t('viewClass')}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Formal Tier Distinction Showcase */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1 text-xs font-semibold text-blue-400 uppercase tracking-wider">
            <Award className="h-3.5 w-3.5" />
            <span>{t('tiersTitle')}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {t('tiersTitle')}
          </h2>
          <p className="mx-auto max-w-xl text-xs sm:text-sm text-zinc-400">
            {t('tiersSub')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {Object.values(TIER_CONFIGS).map((tier) => (
            <div
              key={tier.tier}
              className="glass-panel-interactive rounded-2xl p-5 sm:p-6 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <span
                  className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-bold uppercase border ${tier.badgeClass}`}
                >
                  <Sparkles className="h-2.5 w-2.5" />
                  {language === 'mn' ? tier.titleMn : tier.titleEn}
                </span>
                <p className="text-[11px] font-medium text-zinc-400">
                  {language === 'mn' ? tier.titleEn : tier.titleMn}
                </p>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {tier.description}
                </p>
              </div>

              <div className="pt-3 border-t border-white/[0.06] text-[11px] text-zinc-500 space-y-0.5">
                <div>Min Classes: <strong className="text-zinc-300">{tier.minClasses}</strong></div>
                <div>Min Students: <strong className="text-zinc-300">{tier.minStudents}</strong></div>
                <div>Min XP: <strong className="text-zinc-300">{tier.minXp} XP</strong></div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
