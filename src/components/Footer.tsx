import Link from 'next/link';
import { GraduationCap, ShieldCheck, Landmark, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#09090b] mt-24">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Mission */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600/10 border border-blue-500/20 text-blue-400">
                <GraduationCap className="h-4 w-4" />
              </div>
              <span className="text-base font-bold tracking-tight text-white">
                Mentor<span className="text-blue-500">.mn</span>
              </span>
            </div>
            <p className="text-xs text-zinc-400 max-w-md leading-relaxed">
              Mongolia&apos;s national academic peer-mentorship infrastructure. Connecting ambitious students with proven peer champions through focused 1–3 week sprint cohorts. Real mastery, tangible deliverables, and cryptographically verified civic credentials.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-zinc-500">
              <span className="flex items-center gap-1">
                <Landmark className="h-3 w-3 text-blue-400" />
                Mongolian Educational Research Network
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-emerald-400" />
                SHA-256 Tamper-Proof Ledger
              </span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-300 mb-3">
              Platform
            </h3>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>
                <Link href="/classes" className="hover:text-white transition-colors">
                  Sprint Classes Directory
                </Link>
              </li>
              <li>
                <Link href="/classes/create" className="hover:text-white transition-colors">
                  Open a Sprint as Mentor
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-white transition-colors">
                  Dual-Identity Profile
                </Link>
              </li>
              <li>
                <Link href="/ministry/audit" className="hover:text-white transition-colors">
                  Ministry Telemetry Audit
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Institutional Tiers */}
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-300 mb-3">
              Mentor Hierarchy
            </h3>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                <span>Tier 1: Junior Mentor</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>Tier 2: Senior Mentor</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                <span>Tier 3: Master Mentor</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                <span>Tier 4: National Laureate</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-12 border-t border-white/[0.06] pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-500">
          <p>© 2026 Mentor.mn. National Academic Mentorship Infrastructure of Mongolia.</p>
          <p className="flex items-center gap-1 mt-2 sm:mt-0">
            Engineered with <Heart className="h-3 w-3 text-red-500 fill-red-500" /> for the youth of Mongolia.
          </p>
        </div>
      </div>
    </footer>
  );
}
