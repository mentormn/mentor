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
  Phone,
  School,
  Image as ImageIcon,
  BookOpen
} from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'signin';
  const redirectTo = searchParams.get('redirectTo') || '/dashboard';
  const { language } = useLanguage();

  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [school, setSchool] = useState('');
  const [grade, setGrade] = useState('10');
  const [curriculumDropdown, setCurriculumDropdown] = useState<'National' | 'Cambridge' | 'Both'>('National');
  const [selectedCurriculums, setSelectedCurriculums] = useState<string[]>(['National']);
  const [avatarUrl, setAvatarUrl] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleCurriculumDropdownChange = (val: 'National' | 'Cambridge' | 'Both') => {
    setCurriculumDropdown(val);
    if (val === 'National') setSelectedCurriculums(['National']);
    else if (val === 'Cambridge') setSelectedCurriculums(['Cambridge']);
    else setSelectedCurriculums(['National', 'Cambridge']);
  };

  const handleCurriculumCheckboxToggle = (curr: 'National' | 'Cambridge') => {
    let next: string[];
    if (selectedCurriculums.includes(curr)) {
      next = selectedCurriculums.filter((c) => c !== curr);
      if (next.length === 0) next = [curr]; // prevent empty
    } else {
      next = [...selectedCurriculums, curr];
    }
    setSelectedCurriculums(next);
    if (next.includes('National') && next.includes('Cambridge')) {
      setCurriculumDropdown('Both');
    } else if (next.includes('Cambridge')) {
      setCurriculumDropdown('Cambridge');
    } else {
      setCurriculumDropdown('National');
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (!phone.trim()) {
          setErrorMsg(language === 'mn' ? 'Утасны дугаараа оруулна уу.' : 'Please enter your phone number.');
          setLoading(false);
          return;
        }
        if (!school.trim()) {
          setErrorMsg(language === 'mn' ? 'Сургуулийнхаа нэрийг оруулна уу.' : 'Please enter your school name.');
          setLoading(false);
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: name || email.split('@')[0],
              phone: phone.trim(),
              school: school.trim(),
              grade: `${grade}-р анги`,
              curriculums: selectedCurriculums,
              avatar_url: avatarUrl.trim() || undefined,
            },
          },
        });

        if (error) throw error;

        if (data.user) {
          try {
            await supabase.from('profiles').upsert({
              id: data.user.id,
              name: name.trim() || email.split('@')[0],
              email: email.trim(),
              phone: phone.trim(),
              school: school.trim(),
              grade: `${grade}-р анги`,
              curriculums: selectedCurriculums,
              avatar_url: avatarUrl.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            });
          } catch (profileErr) {
            console.log('Profile upsert note:', profileErr);
          }
        }

        if (data.session) {
          router.push('/dashboard');
        } else {
          setSuccessMsg(
            language === 'mn'
              ? 'Амжилттай бүртгүүллээ! Баталгаажуулах имэйлээ шалгана уу.'
              : 'Sign-up successful! Please check your email to verify.'
          );
          setMode('signin');
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        router.push(redirectTo);
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
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setErrorMsg(err.message || 'Google sign-in error');
    }
  };

  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center px-4 py-16">
      <div className={`w-full transition-all ${mode === 'signup' ? 'max-w-lg' : 'max-w-sm'} space-y-6`}>
        
        {/* Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-white shadow-sm">
              <GraduationCap className="h-5 w-5" />
            </div>
          </Link>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900">
            {mode === 'signin'
              ? language === 'mn' ? 'Тавтай морил' : 'Sign in to Mentor.mn'
              : language === 'mn' ? 'Сурагчийн бүртгэл үүсгэх' : 'Create an Account'}
          </h1>
          <p className="text-xs text-zinc-500">
            {language === 'mn'
              ? 'Үндэсний академик менторшлын платформ'
              : 'Academic Peer Mentorship Platform of Mongolia'}
          </p>
        </div>

        {/* Card */}
        <div className="saas-card p-6 sm:p-7 space-y-5 shadow-sm">
          
          {/* Mode Switcher */}
          <div className="flex rounded-lg bg-zinc-100 p-1 border border-zinc-200 text-xs font-medium">
            <button
              type="button"
              onClick={() => { setMode('signin'); setErrorMsg(null); }}
              className={`flex-1 rounded-md py-1.5 transition-all ${
                mode === 'signin'
                  ? 'bg-white text-zinc-900 shadow-sm font-semibold'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              {language === 'mn' ? 'Нэвтрэх' : 'Sign In'}
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setErrorMsg(null); }}
              className={`flex-1 rounded-md py-1.5 transition-all ${
                mode === 'signup'
                  ? 'bg-white text-zinc-900 shadow-sm font-semibold'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              {language === 'mn' ? 'Бүртгүүлэх' : 'Sign Up'}
            </button>
          </div>

          {/* Feedback */}
          {errorMsg && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 p-3 text-xs text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-700">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleAuth} className="space-y-4">
            {mode === 'signup' && (
              <>
                {/* 1. Full Name */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-700">
                    {language === 'mn' ? 'Таны бүтэн нэр' : 'Full Name'} *
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                    <input
                      type="text"
                      required
                      placeholder={language === 'mn' ? 'Батбаяр Тэмүүлэн' : 'Temuulen Batbayar'}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="saas-input pl-9"
                    />
                  </div>
                </div>

                {/* 2. Phone Number & School (2 cols on desktop) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-700">
                      {language === 'mn' ? 'Утасны дугаар' : 'Phone Number'} *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                      <input
                        type="tel"
                        required
                        placeholder="9911-XXXX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="saas-input pl-9 font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-700">
                      {language === 'mn' ? 'Сургууль' : 'School'} *
                    </label>
                    <div className="relative">
                      <School className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                      <input
                        type="text"
                        required
                        placeholder={language === 'mn' ? '1-р сургууль, Сант г.м.' : 'School Name'}
                        value={school}
                        onChange={(e) => setSchool(e.target.value)}
                        className="saas-input pl-9"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Grade Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-700">
                    {language === 'mn' ? 'Хэддүгээр анги вэ?' : 'Which grade are you in?'}
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {['6', '7', '8', '9', '10', '11', '12'].map((g) => (
                      <button
                        type="button"
                        key={g}
                        onClick={() => setGrade(g)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                          grade === g
                            ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                            : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                        }`}
                      >
                        {g}-р анги
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Curriculum: Both Dropdown AND Checkboxes */}
                <div className="space-y-2 rounded-xl bg-zinc-50/70 border border-zinc-200/80 p-3.5">
                  <label className="text-xs font-semibold text-zinc-800 flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5 text-zinc-600" />
                    <span>{language === 'mn' ? 'Судалж буй хөтөлбөр' : 'Curriculum'}</span>
                  </label>

                  {/* Dropdown */}
                  <div className="space-y-1">
                    <label className="text-[11px] text-zinc-500">
                      {language === 'mn' ? 'Хөтөлбөр сонгох (Dropdown):' : 'Select Curriculum (Dropdown):'}
                    </label>
                    <select
                      value={curriculumDropdown}
                      onChange={(e) => handleCurriculumDropdownChange(e.target.value as any)}
                      className="saas-input py-1.5 text-xs bg-white"
                    >
                      <option value="National">{language === 'mn' ? 'Үндэсний хөтөлбөр (National)' : 'National Curriculum'}</option>
                      <option value="Cambridge">{language === 'mn' ? 'Кембриж хөтөлбөр (Cambridge)' : 'Cambridge Curriculum'}</option>
                      <option value="Both">{language === 'mn' ? 'Хоёулаа (National & Cambridge)' : 'Both (National & Cambridge)'}</option>
                    </select>
                  </div>

                  {/* Checkboxes */}
                  <div className="pt-1">
                    <span className="text-[11px] text-zinc-500 block mb-1.5">
                      {language === 'mn' ? 'Эсвэл шалгах хайрцгаар сонгох (Checkboxes):' : 'Or toggle via checkboxes:'}
                    </span>
                    <div className="flex flex-wrap gap-4 text-xs font-medium text-zinc-700">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={selectedCurriculums.includes('National')}
                          onChange={() => handleCurriculumCheckboxToggle('National')}
                          className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 cursor-pointer"
                        />
                        <span>{language === 'mn' ? 'Үндэсний хөтөлбөр' : 'National'}</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={selectedCurriculums.includes('Cambridge')}
                          onChange={() => handleCurriculumCheckboxToggle('Cambridge')}
                          className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 cursor-pointer"
                        />
                        <span>{language === 'mn' ? 'Кембриж хөтөлбөр' : 'Cambridge'}</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* 5. Profile Picture (Optional) */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-zinc-700">
                      {language === 'mn' ? 'Профайл зураг' : 'Profile Picture'}
                    </label>
                    <span className="text-[10px] text-zinc-400 font-medium">
                      {language === 'mn' ? 'Заавал биш / Optional' : 'Optional'}
                    </span>
                  </div>
                  <div className="relative">
                    <ImageIcon className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                    <input
                      type="url"
                      placeholder="https://... (зургийн холбоос / optional)"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      className="saas-input pl-9 text-xs"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-700">
                {language === 'mn' ? 'Имэйл хаяг' : 'Email Address'} *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="saas-input pl-9"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-700">
                {language === 'mn' ? 'Нууц үг' : 'Password'} *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="saas-input pl-9"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2.5 rounded-lg text-xs font-medium flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            >
              {loading ? (
                <span>{language === 'mn' ? 'Түр хүлээнэ үү...' : 'Signing in...'}</span>
              ) : (
                <>
                  <span>{mode === 'signin' ? (language === 'mn' ? 'Нэвтрэх' : 'Sign In') : (language === 'mn' ? 'Бүртгэл үүсгэх' : 'Create Account')}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Social Divider */}
          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-zinc-200" />
            <span className="bg-white px-2 text-[11px] text-zinc-400 uppercase tracking-wider">
              {language === 'mn' ? 'Эсвэл' : 'Or'}
            </span>
          </div>

          <button
            onClick={handleGoogleLogin}
            type="button"
            className="btn-secondary w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium"
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
      <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center text-zinc-400 text-xs">
        Loading...
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
