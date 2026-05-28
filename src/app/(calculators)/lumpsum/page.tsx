'use client';
import { Metadata } from 'next';
import CalcEngine from '@/components/calculator/CalcEngine';
import { calcLumpsum } from '@/lib/calculators';


const config = {
  id: 'lumpsum', icon: '💰', color: '#dcfce7',
  title: 'Lumpsum Calculator',
  subtitle: 'One-time investment · Choose mutual fund · Compounding projection',
  category: 'invest',
  formula: {
    eq: 'FV = P × (1 + r/100)ⁿ',
    vars: 'P = principal · r = annual % · n = years',
    source: 'Standard CAGR — SEBI MF guidelines',
    
  },
  steps: ['Apply annual compound formula', 'Wealth gain = FV − Principal', 'Compare year-by-year growth'],
  inputs: [{id:"principal",label:"Investment Amount",pfx:"₹",def:100000,step:1000},{id:"rate",label:"Expected Annual Return",sfx:"%",def:12,min:1,max:30,step:0.5},{id:"years",label:"Period",sfx:"Yrs",def:10,min:1,max:40,step:1}],
  note: undefined,
  hasFundSearch:true,hasChart:true,
  compute: (v: Record<string, number | string>) => {
    const n = v as Record<string, number>;
    return calcLumpsum(n.principal,n.rate,n.years);
  },
};

export default function Page() {
  return <CalcEngine config={config} />;
}
