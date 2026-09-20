import Link from 'next/link';
import { GraduationCap, ShieldCheck, Mail, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50/50 mt-20">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Mission */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-900 text-white">
                <GraduationCap className="h-4 w-4" />
              </div>
              <span className="text-base font-bold tracking-tight text-zinc-900">
                Mentor<span className="text-blue-600">.mn</span>
              </span>
            </div>
            <p className="text-xs text-zinc-600 max-w-sm leading-relaxed">
              Mongolia&apos;s academic peer mentorship platform. Connecting ambitious students with proven peer champions for focused 1–3 week sprint classes with tangible deliverables.
            </p>
            <div className="flex items-center gap-3 text-xs text-zinc-500 pt-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                Verified Academic Credentials
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Mail className="h-3.5 w-3.5 text-zinc-400" />
                team@mentor.mn
              </span>
            </div>
          </div>

          {/* Col 2: Platform Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-3">
              Platform
            </h3>
            <ul className="space-y-2 text-xs text-zinc-600">
              <li>
                <Link href="/classes" className="hover:text-zinc-900 transition-colors">
                  Browse Sprint Classes
                </Link>
              </li>
              <li>
                <Link href="/classes/create" className="hover:text-zinc-900 transition-colors">
                  Host a Sprint as Mentor
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-zinc-900 transition-colors">
                  Student Dashboard
                </Link>
              </li>
              <li>
                <Link href="/verify/MN-EDU-2026-7A4F" className="hover:text-zinc-900 transition-colors">
                  Verify Credentials
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Academic Domains */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-3">
              Popular Sprints
            </h3>
            <ul className="space-y-2 text-xs text-zinc-600">
              <li>
                <Link href="/classes?subject=Mathematics" className="hover:text-zinc-900 transition-colors">
                  Cambridge & Olympiad Math
                </Link>
              </li>
              <li>
                <Link href="/classes?subject=Computer%20Science" className="hover:text-zinc-900 transition-colors">
                  Python & Web Engineering
                </Link>
              </li>
              <li>
                <Link href="/classes?subject=Physics" className="hover:text-zinc-900 transition-colors">
                  Physics Circuit Analysis
                </Link>
              </li>
              <li>
                <Link href="/classes?subject=English" className="hover:text-zinc-900 transition-colors">
                  SAT Prep & College Admissions
                </Link>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-12 border-t border-zinc-200 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500">
          <p>© 2026 Mentor.mn. Peer Education Network of Mongolia.</p>
          <p className="flex items-center gap-1 mt-2 sm:mt-0">
            Made with <Heart className="h-3 w-3 text-red-500 fill-red-500" /> for Mongolian youth.
          </p>
        </div>
      </div>
    </footer>
  );
}
