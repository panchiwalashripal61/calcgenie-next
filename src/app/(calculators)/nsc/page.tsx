'use client';
import { Metadata } from 'next';
import CalcEngine from '@/components/calculator/CalcEngine';
import { calcNSC } from '@/lib/calculators';


const config = {
  id: 'nsc', icon: '📜', color: '#fef3c7',
  title: 'NSC Calculator',
  subtitle: 'National Savings Certificate · 5 years · 7.7% p.a. · Half-yearly compounding',
  category: 'tax',
  formula: {
    eq: 'A = P × (1 + 7.7/200)^10',
    vars: '7.7% compounded half-yearly · Fixed 5-year term',
    source: 'India Post / NSI India — Q1 FY2025-26 rate 7.7%',
    url: 'https://www.nsiindia.gov.in',
  },
  steps: ['Half-yearly rate = 7.7/2/100', '10 half-yearly periods in 5 years', 'Interest in years 1-4 reinvested → qualifies for 80C'],
  inputs: [{id:"principal",label:"Investment Amount",pfx:"₹",def:100000,step:1000},{id:"rate",label:"NSC Rate",sfx:"%",def:7.7,min:5,max:12,step:0.1,hint:"Current: 7.7%"}],
  note: 'NSC interest is taxable but years 1-4 interest is deemed reinvested qualifying for 80C.',
  
  compute: (v: Record<string, number | string>) => {
    const n = v as Record<string, number>;
    return calcNSC(n.principal,n.rate);
  },
};

export default function Page() {
  return <CalcEngine config={config} />;
}
