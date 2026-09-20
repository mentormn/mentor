import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { LanguageProvider } from '@/lib/i18n';

export const metadata: Metadata = {
  title: 'Mentor.mn | National Academic Mentorship & Intelligence Infrastructure',
  description:
    'A peer-driven national academic network in Mongolia. Proven students guide younger peers through focused 1–3 week sprint classes with flexible cohorts (1 to 10 seats), verified deliverables, and Ministry-accredited formal certificates.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="mn">
      <body className="min-h-screen flex flex-col antialiased selection:bg-blue-500 selection:text-white">
        <LanguageProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
