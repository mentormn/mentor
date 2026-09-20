'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMentorStore } from '@/lib/store';
import { useLanguage } from '@/lib/i18n';
import { TIER_CONFIGS } from '@/lib/engine/tierProgression';
import { 
  GraduationCap, 
  BookOpen, 
  PlusCircle, 
  ShieldCheck, 
  BarChart3, 
  Globe,
  Sparkles 
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { user } = useMentorStore();
  const { language, toggleLanguage, t } = useLanguage();
  const tierConfig = TIER_CONFIGS[user.mentorTier];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand & National Badge */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-900 text-white shadow-md group-hover:bg-blue-800 transition-colors">
              <GraduationCap className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                  Mentor<span className="text-blue-600">.mn</span>
                </span>
                <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                  {t('nationalTag')}
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                {t('brandTitle')}
              </p>
            </div>
          </Link>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            href="/classes"
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
              pathname === '/classes'
                ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            {t('navClasses')}
          </Link>

          <Link
            href="/ministry/audit"
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
              pathname === '/ministry/audit'
                ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
            }`}
          >
            <BarChart3 className="h-4 w-4 text-emerald-600" />
            {t('navMinistry')}
          </Link>

          <Link
            href="/verify/MN-EDU-2026-7A4F"
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
              pathname.startsWith('/verify')
                ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="h-4 w-4 text-blue-600" />
            {t('navVerify')}
          </Link>
        </nav>

        {/* Right CTA & Dual-Identity Profile Pill */}
        <div className="flex items-center gap-3">
          
          {/* Language Switcher Button */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 transition-colors"
            title="Switch Language / Хэл солих"
          >
            <Globe className="h-3.5 w-3.5 text-blue-600" />
            <span>{language === 'mn' ? 'EN' : 'МН'}</span>
          </button>

          <Link
            href="/classes/create"
            className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-all active:scale-95"
          >
            <PlusCircle className="h-4 w-4" />
            {t('navOpenClass')}
          </Link>

          {/* Unified Profile Link */}
          <Link
            href="/profile"
            className={`flex items-center gap-2.5 rounded-full border p-1 pr-3 transition-all hover:shadow-md ${
              pathname === '/profile'
                ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30'
                : 'border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900'
            }`}
          >
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={user.avatar}
                alt={user.name}
                className="h-8 w-8 rounded-full object-cover border border-white shadow-sm"
              />
              <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white">
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
              </span>
            </div>

            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 max-w-[110px]">
                  {user.name.split(' ')[0]}
                </span>
                <span
                  className={`inline-flex items-center gap-0.5 rounded px-1 py-0.2 text-[9px] font-extrabold uppercase border ${tierConfig.badgeClass}`}
                >
                  <Sparkles className="h-2.5 w-2.5" />
                  {language === 'mn' ? tierConfig.titleMn.split(' ')[0] : tierConfig.titleEn.split(' ')[0]}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                {user.mentorXp} XP • {t('navProfile')}
              </p>
            </div>
          </Link>
        </div>

      </div>
    </header>
  );
}
