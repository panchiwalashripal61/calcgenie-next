'use client';
import { Metadata } from 'next';
import CalcEngine from '@/components/calculator/CalcEngine';
import { calcStepUpSIP } from '@/lib/calculators';


const config = {
  id: 'step_up_sip', icon: '🪜', color: '#dcfce7',
  title: 'Step-Up SIP Calculator',
  subtitle: 'Annual increment SIP — most realistic wealth building tool',
  category: 'invest',
  formula: {
    eq: 'FV = Σ P(1+g)ᵏ × [(1+r)^(n−k×12)−1]/r×(1+r)',
    vars: 'g = annual step-up % · P = initial SIP · r = monthly rate',
    source: 'AMFI India Step-up methodology',
    
  },
  steps: ['For each year k, SIP = P×(1+g)^k', 'Calculate FV for each year separately', 'Sum all year FV contributions'],
  inputs: [{id:"monthly",label:"Initial Monthly SIP",pfx:"₹",def:5000,min:100,step:100},{id:"stepup",label:"Annual Step-Up",sfx:"%",def:10,min:1,max:50,step:1,hint:"Increase every year"},{id:"rate",label:"Expected Return",sfx:"%",def:12,min:1,max:30,step:0.5},{id:"years",label:"Period",sfx:"Yrs",def:15,min:1,max:40,step:1}],
  note: undefined,
  hasFundSearch:true,hasChart:true,
  compute: (v: Record<string, number | string>) => {
    const n = v as Record<string, number>;
    return calcStepUpSIP(n.monthly,n.stepup,n.rate,n.years);
  },
};

export default function Page() {
  return <CalcEngine config={config} />;
}
