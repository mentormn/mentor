import { Certificate, FormalTier } from '../types';

/**
 * Deterministic SHA-256 hash generator using Web Crypto API.
 * Works seamlessly in both browser and Node.js Next.js runtime.
 */
export async function generateCertificateSha256(payload: {
  id: string;
  mentorName: string;
  mentorSchool: string;
  tier: FormalTier;
  totalHours: number;
  studentsImpacted: number;
  classTitle: string;
  issuedDate: string;
}): Promise<string> {
  const normalizedString = [
    payload.id,
    payload.mentorName.trim().toLowerCase(),
    payload.mentorSchool.trim().toLowerCase(),
    payload.tier,
    payload.totalHours.toString(),
    payload.studentsImpacted.toString(),
    payload.classTitle.trim().toLowerCase(),
    payload.issuedDate,
    'GOV-MN-MINISTRY-OF-EDUCATION-ACCREDITATION-SECRET-2026',
  ].join('|');

  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(normalizedString);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  } else {
    // Node.js runtime fallback
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(normalizedString).digest('hex');
  }
}

/**
 * Generates an official Certificate ID in format MN-EDU-2026-XXXX.
 */
export function generateCertificateId(): string {
  const randomHex = Math.random().toString(16).substring(2, 6).toUpperCase();
  return `MN-EDU-2026-${randomHex}`;
}

/**
 * Verifies whether a certificate's SHA-256 fingerprint matches its contents.
 * Returns true if authentic, false if tampered with.
 */
export async function verifyCertificateTamperProof(
  cert: Certificate
): Promise<boolean> {
  const expectedHash = await generateCertificateSha256({
    id: cert.id,
    mentorName: cert.mentorName,
    mentorSchool: cert.mentorSchool,
    tier: cert.tier,
    totalHours: cert.totalHours,
    studentsImpacted: cert.studentsImpacted,
    classTitle: cert.classTitle,
    issuedDate: cert.issuedDate,
  });

  return expectedHash.toLowerCase() === cert.sha256Hash.toLowerCase();
}
