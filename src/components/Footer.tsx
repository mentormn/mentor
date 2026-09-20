import Link from 'next/link';
import { GraduationCap, ShieldCheck, Mail, Heart, Lock, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50/50 mt-20">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Col 1: Mission */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-900 text-white">
                <GraduationCap className="h-4 w-4" />
              </div>
              <span className="text-base font-bold tracking-tight text-zinc-900">
                Mentor<span className="text-blue-600">.mn</span>
              </span>
            </div>
            <p className="text-xs text-zinc-600 max-w-sm leading-relaxed">
              Монгол Улсын Үндэсний Академик Менторшилын Дэд Бүтэц. Шилдэг оюутнууд дүү нартаа 1-10 сурагчтай бичил ангиар зааж, бодит бүтээлээр баталгаажсан дижитал батламж олгоно.
            </p>
            <div className="flex items-center gap-3 text-xs text-zinc-500 pt-1">
              <span className="flex items-center gap-1">
                <Mail className="h-3.5 w-3.5 text-zinc-400" />
                team@mentor.mn
              </span>
            </div>
          </div>

          {/* Col 2: Public Services */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-3">
              Official Verification
            </h3>
            <ul className="space-y-2 text-xs text-zinc-600">
              <li>
                <Link href="/verify" className="hover:text-zinc-900 transition-colors flex items-center gap-1.5 font-medium text-zinc-800">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Verify Certificate Authenticity</span>
                </Link>
              </li>
              <li>
                <Link href="/verify/MN-ACAD-2026-0091" className="hover:text-zinc-900 transition-colors">
                  Sample Credential (MN-ACAD-2026-0091)
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-zinc-900 transition-colors">
                  Platform Sign In / Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Standards & Security */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-3">
              Security & Standards
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed space-y-2">
              <span className="block">
                All certificates issued on Mentor.mn are cryptographically signed with SHA-256 digests and backed by verifiable deliverable proofs.
              </span>
              <span className="flex items-center gap-1.5 text-emerald-700 font-medium pt-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                Tamper-proof academic integrity
              </span>
            </p>
          </div>

        </div>

        <div className="mt-12 border-t border-zinc-200 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500">
          <p>© 2026 Mentor.mn. Peer Education Network of Mongolia.</p>
          <p className="flex items-center gap-1 mt-2 sm:mt-0">
            Made with <Heart className="h-3 w-3 text-red-500 fill-red-500" /> for Mongolian scholars.
          </p>
        </div>
      </div>
    </footer>
  );
}
