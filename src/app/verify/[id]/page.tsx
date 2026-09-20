import { INITIAL_CERTIFICATES } from '@/lib/mockData';
import VerifyClient from './VerifyClient';

export function generateStaticParams() {
  return INITIAL_CERTIFICATES.map((cert) => ({ id: cert.id }));
}

export default function VerifyPage() {
  return <VerifyClient />;
}
