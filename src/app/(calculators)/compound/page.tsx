'use client';
import { Metadata } from 'next';
import CalcEngine from '@/components/calculator/CalcEngine';
import { calcCompound } from '@/lib/calculators';


const config = {
  id: 'compound', icon: '🔢', color: '#fee2e2',
  title: 'Compound Interest Calculator',
  subtitle: 'Any compounding frequency · Compare CI vs SI · Rule of 72',
  category: 'pf',
  formula: {
    eq: 'A = P × (1 + r/n)^(n×t)',
    vars: 'n: 1=annual 4=quarterly 12=monthly 365=daily',
    source: 'Standard compound interest formula',
    
  },
  steps: ['Annual: n=1 · Half-yearly: n=2 · Quarterly: n=4 · Monthly: n=12', 'CI is always higher than SI for same rate', 'Rule of 72: Years to double ≈ 72 ÷ rate%'],
  inputs: [{id:"principal",label:"Principal",pfx:"₹",def:100000,step:1000},{id:"rate",label:"Annual Rate",sfx:"%",def:8,min:0.1,max:30,step:0.1},{id:"years",label:"Period",sfx:"Yrs",def:5,min:1,max:50,step:1},{id:"freq",label:"Compounding",type:"sel",opts:[{v:1,l:"Annually"},{v:2,l:"Half-yearly"},{v:4,l:"Quarterly"},{v:12,l:"Monthly"},{v:365,l:"Daily"}],def:4}],
  note: undefined,
  hasChart:true,
  compute: (v: Record<string, number | string>) => {
    const n = v as Record<string, number>;
    return calcCompound(n.principal,n.rate,n.years,Number(v.freq));
  },
};

export default function Page() {
  return <CalcEngine config={config} />;
}
