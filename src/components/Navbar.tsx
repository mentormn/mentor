'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/i18n';
import { supabase } from '@/lib/supabase/client';
import { 
  GraduationCap, 
  ShieldCheck, 
  Globe,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  BookOpen,
  PlusCircle,
  User as UserIcon
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { language, toggleLanguage } = useLanguage();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
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
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-white shadow-sm">
              <GraduationCap className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold tracking-tight text-zinc-900">
                Mentor<span className="text-blue-600">.mn</span>
              </span>
              <span className="rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] font-semibold text-zinc-600 border border-zinc-200">
                MONGOLIA
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-zinc-600">
            {currentUser ? (
              <>
                <Link
                  href="/dashboard"
                  className={`hover:text-zinc-900 transition-colors ${
                    pathname === '/dashboard' ? 'text-zinc-900 font-semibold' : ''
                  }`}
                >
                  {language === 'mn' ? 'Хяналтын самбар' : 'Dashboard'}
                </Link>
                <Link
                  href="/classes"
                  className={`hover:text-zinc-900 transition-colors ${
                    pathname === '/classes' ? 'text-zinc-900 font-semibold' : ''
                  }`}
                >
                  {language === 'mn' ? 'Спринт хичээлүүд' : 'Sprint Classes'}
                </Link>
                <Link
                  href="/classes/create"
                  className={`hover:text-zinc-900 transition-colors ${
                    pathname === '/classes/create' ? 'text-zinc-900 font-semibold' : ''
                  }`}
                >
                  {language === 'mn' ? 'Хичээл нээх' : 'Host a Sprint'}
                </Link>
                <Link
                  href="/verify"
                  className={`hover:text-zinc-900 transition-colors ${
                    pathname.startsWith('/verify') ? 'text-zinc-900 font-semibold' : ''
                  }`}
                >
                  {language === 'mn' ? 'Батламж шалгах' : 'Verify Certificate'}
                </Link>
              </>
            ) : (
              /* Public / Unauthenticated visitor only sees Verify Certificate */
              <Link
                href="/verify"
                className={`hover:text-zinc-900 transition-colors flex items-center gap-1.5 ${
                  pathname.startsWith('/verify') ? 'text-zinc-900 font-semibold' : ''
                }`}
              >
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>{language === 'mn' ? 'Батламж шалгах' : 'Verify Certificate'}</span>
              </Link>
            )}
          </nav>
        </div>

        {/* Right CTA / Auth */}
        <div className="flex items-center gap-3">
          
          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100 transition-colors"
            title="Switch Language / Хэл солих"
          >
            <Globe className="h-3.5 w-3.5 text-zinc-500" />
            <span>{language === 'mn' ? 'EN' : 'МН'}</span>
          </button>

          {currentUser ? (
            <div className="flex items-center gap-3">
              <Link
                href="/profile"
                className="flex items-center gap-2 rounded-full border border-zinc-200 p-1 pr-2.5 hover:bg-zinc-50 transition-colors"
              >
                <div className="h-6 w-6 rounded-full bg-zinc-900 text-white flex items-center justify-center text-[10px] font-bold">
                  {profile?.name ? profile.name.charAt(0) : currentUser?.email?.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-medium text-zinc-800 line-clamp-1 max-w-[90px]">
                  {profile?.name ? profile.name.split(' ')[0] : 'Profile'}
                </span>
              </Link>

              <button
                onClick={handleSignOut}
                className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-lg hover:bg-zinc-100 transition-colors"
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="btn-primary inline-flex items-center gap-1 px-4 py-1.5 rounded-lg text-xs font-medium text-white shadow-sm"
              >
                <span>{language === 'mn' ? 'Нэвтрэх' : 'Sign In'}</span>
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-zinc-500 hover:text-zinc-900"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-200 bg-white px-4 py-4 space-y-2">
          {currentUser ? (
            <>
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-zinc-700 hover:text-zinc-900"
              >
                {language === 'mn' ? 'Хяналтын самбар' : 'Dashboard'}
              </Link>
              <Link
                href="/classes"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-zinc-700 hover:text-zinc-900"
              >
                {language === 'mn' ? 'Спринт хичээлүүд' : 'Sprint Classes'}
              </Link>
              <Link
                href="/classes/create"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-zinc-700 hover:text-zinc-900"
              >
                {language === 'mn' ? 'Хичээл нээх' : 'Host a Sprint'}
              </Link>
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-zinc-700 hover:text-zinc-900"
              >
                {language === 'mn' ? 'Профайл' : 'Profile'}
              </Link>
              <Link
                href="/verify"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-zinc-700 hover:text-zinc-900"
              >
                {language === 'mn' ? 'Батламж шалгах' : 'Verify Certificate'}
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleSignOut();
                }}
                className="w-full text-left py-2 text-sm font-medium text-rose-600 hover:text-rose-700"
              >
                {language === 'mn' ? 'Гарах' : 'Sign Out'}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/verify"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-zinc-700 hover:text-zinc-900"
              >
                {language === 'mn' ? 'Батламж шалгах' : 'Verify Certificate'}
              </Link>
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-zinc-900 font-bold"
              >
                {language === 'mn' ? 'Нэвтрэх' : 'Sign In'}
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
