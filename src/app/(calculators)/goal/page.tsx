'use client';
import { Metadata } from 'next';
import CalcEngine from '@/components/calculator/CalcEngine';
import { calcGoal } from '@/lib/calculators';


const config = {
  id: 'goal', icon: '🎯', color: '#ede9fe',
  title: 'Financial Goal Planner',
  subtitle: 'House · Car · Education · Travel · Any goal',
  category: 'pf',
  formula: {
    eq: 'Monthly SIP = Future Goal × r / [(1+r)^n−1] / (1+r)',
    vars: 'Inflate goal at specific rate · Back-calculate SIP',
    source: 'Goal-based investing — SIP formula',
    
  },
  steps: ['Inflate goal amount to future value', 'Calculate monthly SIP needed at target return', 'Choose instrument based on time horizon'],
  inputs: [{id:"goal",label:"Goal Amount (today's price)",pfx:"₹",def:5000000,step:100000},{id:"years",label:"Years to Goal",sfx:"Yrs",def:10,min:1,max:30,step:1},{id:"inflation",label:"Goal Inflation",sfx:"%",def:6,min:0,max:15,step:0.5},{id:"ret",label:"Investment Return",sfx:"%",def:12,min:4,max:20,step:0.5}],
  note: undefined,
  hasFundSearch:true,hasChart:true,
  compute: (v: Record<string, number | string>) => {
    const n = v as Record<string, number>;
    return calcGoal(n.goal,n.years,n.inflation,n.ret);
  },
};

export default function Page() {
  return <CalcEngine config={config} />;
}
