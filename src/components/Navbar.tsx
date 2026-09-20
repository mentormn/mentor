'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/i18n';
import { supabase } from '@/lib/supabase/client';
import { 
  GraduationCap, 
  BookOpen, 
  PlusCircle, 
  ShieldCheck, 
  BarChart3, 
  Globe,
  Sparkles,
  UserCheck,
  LogOut,
  Menu,
  X
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { language, toggleLanguage, t } = useLanguage();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check active Supabase auth state
    async function loadUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setCurrentUser(session.user);
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        if (data) setProfile(data);
      } else {
        setCurrentUser(null);
        setProfile(null);
      }
    }

    loadUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setCurrentUser(session.user);
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => {
            if (data) setProfile(data);
          });
      } else {
        setCurrentUser(null);
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setProfile(null);
    router.push('/');
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#09090b]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand & Badge */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600/10 border border-blue-500/20 text-blue-400 group-hover:border-blue-500/40 group-hover:bg-blue-600/20 transition-all shadow-[0_0_15px_rgba(59,130,246,0.15)]">
              <GraduationCap className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold tracking-tight text-white">
                  Mentor<span className="text-blue-500">.mn</span>
                </span>
                <span className="rounded-full bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.2 text-[9px] font-semibold text-blue-400 uppercase tracking-wide">
                  {t('nationalTag')}
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 hidden sm:block">
                {t('brandTitle')}
              </p>
            </div>
          </Link>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            href="/classes"
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              pathname === '/classes'
                ? 'bg-white/[0.08] text-white border border-white/[0.1]'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            {t('navClasses')}
          </Link>

          <Link
            href="/ministry/audit"
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              pathname === '/ministry/audit'
                ? 'bg-white/[0.08] text-white border border-white/[0.1]'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5 text-emerald-400" />
            {t('navMinistry')}
          </Link>

          <Link
            href="/verify/MN-EDU-2026-7A4F"
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              pathname.startsWith('/verify')
                ? 'bg-white/[0.08] text-white border border-white/[0.1]'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5 text-blue-400" />
            {t('navVerify')}
          </Link>
        </nav>

        {/* Right Action Items */}
        <div className="flex items-center gap-2.5">
          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-zinc-900/60 px-2.5 py-1.5 text-xs font-medium text-zinc-300 hover:text-white hover:border-white/[0.15] transition-all"
            title="Switch Language / Хэл солих"
          >
            <Globe className="h-3.5 w-3.5 text-blue-400" />
            <span>{language === 'mn' ? 'EN' : 'МН'}</span>
          </button>

          {/* Open a Class CTA */}
          <Link
            href="/classes/create"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 px-3 py-1.5 text-xs font-medium text-white shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all active:scale-95"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            {t('navOpenClass')}
          </Link>

          {/* Auth State Button */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              <Link
                href="/profile"
                className={`flex items-center gap-2 rounded-full border border-white/[0.08] bg-zinc-900/80 p-1 pr-2.5 hover:border-white/[0.16] transition-all ${
                  pathname === '/profile' ? 'ring-1 ring-blue-500' : ''
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt={profile?.name || 'User'}
                  className="h-6 w-6 rounded-full object-cover border border-white/10"
                />
                <span className="text-xs font-medium text-zinc-200 line-clamp-1 max-w-[90px]">
                  {profile?.name ? profile.name.split(' ')[0] : 'Profile'}
                </span>
                {profile?.mentor_status === 'verified' && (
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                )}
              </Link>

              <button
                onClick={handleSignOut}
                className="p-1.5 text-zinc-400 hover:text-zinc-200 rounded-lg hover:bg-white/[0.04] transition-colors"
                title={t('navLogout')}
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-lg border border-white/[0.08] bg-zinc-900/60 px-3 py-1.5 text-xs font-medium text-zinc-200 hover:text-white hover:border-white/[0.16] transition-all"
              >
                {t('navLogin')}
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-zinc-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/[0.08] bg-[#09090b] px-4 py-4 space-y-2">
          <Link
            href="/classes"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm text-zinc-300 hover:text-white"
          >
            {t('navClasses')}
          </Link>
          <Link
            href="/classes/create"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm text-blue-400 hover:text-blue-300 font-medium"
          >
            + {t('navOpenClass')}
          </Link>
          <Link
            href="/ministry/audit"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm text-zinc-300 hover:text-white"
          >
            {t('navMinistry')}
          </Link>
          <Link
            href="/verify/MN-EDU-2026-7A4F"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm text-zinc-300 hover:text-white"
          >
            {t('navVerify')}
          </Link>
          {currentUser ? (
            <Link
              href="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm text-zinc-300 hover:text-white"
            >
              {t('navProfile')}
            </Link>
          ) : (
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm text-zinc-300 hover:text-white"
            >
              {t('navLogin')}
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
