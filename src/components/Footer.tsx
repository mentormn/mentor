import Link from 'next/link';
import { GraduationCap, ShieldCheck, Landmark, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50 mt-20">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Mission */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-900 text-white">
                <GraduationCap className="h-5 w-5 text-amber-400" />
              </div>
              <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                Mentor<span className="text-blue-600">.mn</span>
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
              A national-scale peer-driven mentorship infrastructure. We replace passive, outdated classroom lectures with proven students who taught themselves, guiding younger peers through focused 1–3 week sprint classes with flexible cohorts.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Landmark className="h-3.5 w-3.5 text-blue-600" />
                In Partnership with Mongolian Educational Research
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                Cryptographically Verifiable
              </span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Platform
            </h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/classes" className="hover:text-blue-600 transition-colors">
                  Explore Sprint Classes
                </Link>
              </li>
              <li>
                <Link href="/classes/create" className="hover:text-blue-600 transition-colors">
                  Open a Class as Mentor
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-blue-600 transition-colors">
                  Dual-Identity Profile
                </Link>
              </li>
              <li>
                <Link href="/ministry/audit" className="hover:text-blue-600 transition-colors">
                  Ministry Telemetry Audit
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Institutional Tiers */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Formal Tiers
            </h3>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                <span>Tier 1: Junior Mentor</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>Tier 2: Senior Mentor</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-purple-500" />
                <span>Tier 3: Master Mentor</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                <span>Tier 4: National Laureate Mentor</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-10 border-t border-slate-200 dark:border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 Mentor.mn. National Academic Mentorship Infrastructure of Mongolia.</p>
          <p className="flex items-center gap-1 mt-2 sm:mt-0">
            Built with <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500" /> for the youth of Mongolia.
          </p>
        </div>
      </div>
    </footer>
  );
}
