import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "CalcGenie — India's Most Accurate Financial Calculators",
  description: '25 free, SEBI-formula-verified financial calculators. Real mutual fund CAGR, income tax FY 2026-27, SIP, EMI, PPF and more.',
  keywords: ['sip calculator india','emi calculator','income tax calculator 2026-27','ppf calculator','mutual fund calculator','gst calculator india'],
  openGraph: {
    title: "CalcGenie — India's Most Accurate Financial Calculators",
    description: '25 free Indian financial calculators. AMFI verified. RBI formula. Budget 2026.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
