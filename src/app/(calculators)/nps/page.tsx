'use client';
import { Metadata } from 'next';
import CalcEngine from '@/components/calculator/CalcEngine';
import { calcNPS } from '@/lib/calculators';


const config = {
  id: 'nps', icon: '🏗️', color: '#ede9fe',
  title: 'NPS Calculator',
  subtitle: 'National Pension System · 80CCD(1B) extra ₹50K deduction · 60% tax-free',
  category: 'retire',
  formula: {
    eq: 'Corpus = Monthly × [(1+r)^n−1]/r × (1+r)',
    vars: '60% lumpsum tax-free · 40% annuity @6% est. pension · PFRDA regulated',
    source: 'PFRDA — NPS Scheme Rules',
    url: 'https://www.pfrda.org.in',
  },
  steps: ['NPS grows at market rate (equity-heavy ≈ 9-12%)', 'At 60: 60% lumpsum (tax-free), 40% → annuity', 'Extra ₹50,000 deduction under 80CCD(1B) over 80C'],
  inputs: [{id:"monthly",label:"Monthly Contribution",pfx:"₹",def:5000,step:500},{id:"age",label:"Current Age",sfx:"Yrs",def:30,min:18,max:60,step:1},{id:"rate",label:"Expected Annual Return",sfx:"%",def:10,min:6,max:15,step:0.5}],
  note: 'NPS Tier-1 is locked until age 60. Returns depend on fund manager and asset allocation.',
  
  compute: (v: Record<string, number | string>) => {
    const n = v as Record<string, number>;
    return calcNPS(n.monthly,n.age,n.rate);
  },
};

export default function Page() {
  return <CalcEngine config={config} />;
}
