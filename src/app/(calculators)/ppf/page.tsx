'use client';
import { Metadata } from 'next';
import CalcEngine from '@/components/calculator/CalcEngine';
import { calcPPF } from '@/lib/calculators';


const config = {
  id: 'ppf', icon: '🏛️', color: '#fef3c7',
  title: 'PPF Calculator',
  subtitle: 'Public Provident Fund · EEE tax benefit · 7.1% p.a. (Q1 FY2026-27)',
  category: 'tax',
  formula: {
    eq: 'Balance(n) = [Balance(n-1) + Contribution] × (1 + 7.1%)',
    vars: 'Rate: 7.1% (Govt. notified Apr 2026). EEE — entirely tax free',
    source: 'Ministry of Finance India · NSI India',
    url: 'https://www.nsiindia.gov.in',
  },
  steps: ['Deposit before 5th April for full year interest', 'Compounded annually at government notified rate', 'EEE: deductible under 80C, interest tax-free, maturity tax-free'],
  inputs: [{id:"yearly",label:"Annual Contribution",pfx:"₹",def:150000,min:500,max:150000,step:1000,hint:"Max ₹1.5L/year"},{id:"years",label:"Investment Period",sfx:"Yrs",def:15,min:15,max:50,step:5,hint:"Min 15 yrs"}],
  note: 'PPF rate: 7.1% p.a. (April 2026, Q1 FY2026-27). Max contribution ₹1,50,000/year. EEE tax benefit.',
  hasChart:true,
  compute: (v: Record<string, number | string>) => {
    const n = v as Record<string, number>;
    return calcPPF(n.yearly,n.years);
  },
};

export default function Page() {
  return <CalcEngine config={config} />;
}
