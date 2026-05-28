'use client';
import { Metadata } from 'next';
import CalcEngine from '@/components/calculator/CalcEngine';
import { calcRetirement } from '@/lib/calculators';


const config = {
  id: 'retirement', icon: '🌅', color: '#ede9fe',
  title: 'Retirement Corpus Planner',
  subtitle: '25x rule · Inflation-adjusted · Monthly SIP needed',
  category: 'retire',
  formula: {
    eq: 'Corpus = Annual Future Expenses × 25 (4% withdrawal rate)',
    vars: 'India inflation 6% avg · Safe withdrawal 4%/yr = 25x corpus',
    source: 'William Bengen 4% rule adapted for India',
    
  },
  steps: ['Inflate current expenses at 6% inflation', 'Multiply annual future expense by 25', 'Back-calculate monthly SIP at expected return'],
  inputs: [{id:"age",label:"Current Age",sfx:"Yrs",def:30,min:18,max:60,step:1},{id:"retireAge",label:"Retirement Age",sfx:"Yrs",def:60,min:40,max:70,step:1},{id:"monthly",label:"Current Monthly Expenses",pfx:"₹",def:50000,step:1000},{id:"inflation",label:"Inflation Rate",sfx:"%",def:6,min:3,max:12,step:0.5},{id:"returnRate",label:"Investment Return",sfx:"%",def:12,min:6,max:20,step:0.5}],
  note: undefined,
  hasFundSearch:true,hasChart:true,
  compute: (v: Record<string, number | string>) => {
    const n = v as Record<string, number>;
    return calcRetirement(n.age,n.retireAge,n.monthly,n.inflation,n.returnRate);
  },
};

export default function Page() {
  return <CalcEngine config={config} />;
}
