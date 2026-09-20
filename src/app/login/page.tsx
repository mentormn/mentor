'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { useLanguage } from '@/lib/i18n';
import { 
  GraduationCap, 
  Mail, 
  Lock, 
  User as UserIcon, 
  ArrowRight, 
  AlertCircle,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/profile';
  const { language, t } = useLanguage();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: name || email.split('@')[0],
            },
          },
        });

        if (error) throw error;

        // If user is immediately signed in or session is established
        if (data.session) {
          router.push('/onboarding');
        } else {
          setSuccessMsg(
            language === 'mn'
              ? 'Амжилттай бүртгүүллээ! Баталгаажуулах имэйлээ шалгана уу эсвэл нэвтэрнэ үү.'
              : 'Sign-up successful! Please verify your email or sign in.'
          );
          setMode('signin');
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        // Check if user has completed onboarding
        if (data.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('school, grade')
            .eq('id', data.user.id)
            .single();

          if (!profile || !profile.school || profile.school === 'General Education School') {
            router.push('/onboarding');
          } else {
            router.push(redirectTo);
          }
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/onboarding`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setErrorMsg(err.message || 'Google sign-in error');
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-grid-pattern">
      <div className="absolute inset-0 bg-radial-glow pointer-events-none" />
      
      <div className="relative w-full max-w-md space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 group-hover:scale-105 transition-transform shadow-[0_0_20px_rgba(59,130,246,0.2)]">
              <GraduationCap className="h-5 w-5" />
            </div>
          </Link>
          <h1 className="text-xl font-bold tracking-tight text-white">
            {mode === 'signin'
              ? language === 'mn' ? 'Тавтай морил' : 'Welcome back'
              : language === 'mn' ? 'Бүртгэл үүсгэх' : 'Create an Account'}
          </h1>
          <p className="text-xs text-zinc-400">
            {language === 'mn'
              ? 'Үндэсний академик менторшлын платформд нэвтрэх'
              : 'Access Mongolia\'s national academic mentorship platform'}
          </p>
        </div>

        {/* Card */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-5 shadow-2xl">
          
          {/* Mode Switcher */}
          <div className="flex rounded-lg bg-zinc-900/80 p-1 border border-white/[0.06] text-xs font-medium">
            <button
              type="button"
              onClick={() => { setMode('signin'); setErrorMsg(null); }}
              className={`flex-1 rounded-md py-1.5 transition-all ${
                mode === 'signin'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {language === 'mn' ? 'Нэвтрэх' : 'Sign In'}
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setErrorMsg(null); }}
              className={`flex-1 rounded-md py-1.5 transition-all ${
                mode === 'signup'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {language === 'mn' ? 'Бүртгүүлэх' : 'Sign Up'}
            </button>
          </div>

          {/* Feedback */}
          {errorMsg && (
            <div className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-400">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleAuth} className="space-y-3.5">
            {mode === 'signup' && (
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-zinc-300">
                  {language === 'mn' ? 'Таны бүтэн нэр' : 'Full Name'}
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                  <input
                    type="text"
                    required
                    placeholder={language === 'mn' ? 'Батбаяр Тэмүүлэн' : 'Temuulen Batbayar'}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-white/[0.08] bg-zinc-900/50 pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-zinc-300">
                {language === 'mn' ? 'Имэйл хаяг' : 'Email Address'}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-white/[0.08] bg-zinc-900/50 pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-zinc-300">
                {language === 'mn' ? 'Нууц үг' : 'Password'}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-white/[0.08] bg-zinc-900/50 pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2.5 rounded-lg text-xs font-medium text-white flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            >
              {loading ? (
                <span className="animate-pulse">{language === 'mn' ? 'Түр хүлээнэ үү...' : 'Authenticating...'}</span>
              ) : (
                <>
                  <span>{mode === 'signin' ? (language === 'mn' ? 'Нэвтрэх' : 'Sign In') : (language === 'mn' ? 'Үргэлжлүүлэх' : 'Create Account')}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Social */}
          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-white/[0.06]" />
            <span className="bg-[#121215] px-2 text-[10px] text-zinc-500 uppercase tracking-wider">
              {language === 'mn' ? 'Эсвэл' : 'Or'}
            </span>
          </div>

          <button
            onClick={handleGoogleLogin}
            type="button"
            className="w-full flex items-center justify-center gap-2 rounded-lg border border-white/[0.08] bg-zinc-900/50 hover:bg-zinc-800/80 py-2 text-xs font-medium text-zinc-300 hover:text-white transition-all"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Google-ээр нэвтрэх</span>
          </button>

        </div>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center text-zinc-500 text-xs">
        Loading...
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
