'use client';
import { Metadata } from 'next';
import CalcEngine from '@/components/calculator/CalcEngine';
import { calcInflation } from '@/lib/calculators';


const config = {
  id: 'inflation', icon: '📉', color: '#fee2e2',
  title: 'Inflation Impact Calculator',
  subtitle: 'Real value erosion · India CPI context · Minimum return needed',
  category: 'pf',
  formula: {
    eq: 'Future Cost = Present × (1 + inflation%)^years',
    vars: 'India RBI target: 4% (±2% band). Historical CPI avg ~6%',
    source: 'RBI Inflation targeting framework — CPI',
    url: 'https://www.rbi.org.in',
  },
  steps: ['Future cost shows what same item will cost', "Real value shows what today's money is worth", 'Real return = Nominal return − Inflation rate'],
  inputs: [{id:"amount",label:"Current Amount/Price",pfx:"₹",def:100000,step:1000},{id:"inflation",label:"Annual Inflation",sfx:"%",def:6,min:1,max:20,step:0.5,hint:"India CPI avg 5-6%"},{id:"years",label:"Period",sfx:"Yrs",def:10,min:1,max:40,step:1}],
  note: 'India RBI inflation target: 4% (±2% band). Historical CPI avg 2015-2025 approx 5.8%.',
  hasChart:true,
  compute: (v: Record<string, number | string>) => {
    const n = v as Record<string, number>;
    return calcInflation(n.amount,n.inflation,n.years);
  },
};

export default function Page() {
  return <CalcEngine config={config} />;
}
