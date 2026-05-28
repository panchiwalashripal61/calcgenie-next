'use client';
import { Metadata } from 'next';
import CalcEngine from '@/components/calculator/CalcEngine';
import { calcCAGR } from '@/lib/calculators';


const config = {
  id: 'cagr', icon: '📐', color: '#ccfbf1',
  title: 'CAGR Calculator',
  subtitle: 'Compound Annual Growth Rate · Compare any investment with benchmarks',
  category: 'pf',
  formula: {
    eq: 'CAGR = ((Ending / Beginning)^(1/Years) − 1) × 100',
    vars: 'Smoothed annual growth rate — SEBI uses for MF comparisons',
    source: 'SEBI — Standard CAGR for mutual fund performance disclosure',
    
  },
  steps: ['Divide ending value by beginning', 'Raise to power of 1/years', 'Compare with Nifty 50 (~13%), FD (~7%), Gold (~10%)'],
  inputs: [{id:"begin",label:"Beginning Value",pfx:"₹",def:100000,step:1000},{id:"end",label:"Ending Value",pfx:"₹",def:250000,step:1000},{id:"years",label:"Number of Years",sfx:"Yrs",def:5,min:0.5,max:50,step:0.5}],
  note: undefined,
  
  compute: (v: Record<string, number | string>) => {
    const n = v as Record<string, number>;
    return calcCAGR(n.begin,n.end,n.years);
  },
};

export default function Page() {
  return <CalcEngine config={config} />;
}
