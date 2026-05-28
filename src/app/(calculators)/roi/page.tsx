'use client';
import { Metadata } from 'next';
import CalcEngine from '@/components/calculator/CalcEngine';
import { calcROI } from '@/lib/calculators';


const config = {
  id: 'roi', icon: '📊', color: '#ccfbf1',
  title: 'ROI Calculator',
  subtitle: 'Return on Investment · CAGR · Compare vs benchmarks',
  category: 'biz',
  formula: {
    eq: 'ROI% = (Net Profit / Cost) × 100. CAGR = (FV/PV)^(1/n)−1',
    vars: 'Net Profit = Returns − Investment',
    source: 'Standard financial ROI formula',
    
  },
  steps: ['ROI = (Returns − Invested) ÷ Invested × 100', 'CAGR accounts for time-value of money', 'Compare: FD ~7%, Nifty 50 ~13%, Gold ~10%'],
  inputs: [{id:"invested",label:"Initial Investment",pfx:"₹",def:500000,step:10000},{id:"returns",label:"Total Returns",pfx:"₹",def:750000,step:10000},{id:"years",label:"Time Period",sfx:"Yrs",def:3,min:0.1,max:30,step:0.1}],
  note: undefined,
  
  compute: (v: Record<string, number | string>) => {
    const n = v as Record<string, number>;
    return calcROI(n.invested,n.returns,n.years);
  },
};

export default function Page() {
  return <CalcEngine config={config} />;
}
