'use client';
import { Metadata } from 'next';
import CalcEngine from '@/components/calculator/CalcEngine';
import { calcSIP } from '@/lib/calculators';


const config = {
  id: 'sip', icon: '📈', color: '#dcfce7',
  title: 'SIP Calculator',
  subtitle: 'Systematic Investment Plan · Monthly mutual fund investments',
  category: 'invest',
  formula: {
    eq: 'FV = P × [((1+r)ⁿ−1)/r] × (1+r)',
    vars: 'P = monthly · r = monthly rate · n = months',
    source: 'AMFI India SIP methodology',
    url: 'https://www.amfiindia.com',
  },
  steps: ['Convert annual rate to monthly: r = rate ÷ 12 ÷ 100', 'n = years × 12', 'Apply SIP future value formula', 'Wealth gain = FV − (monthly × n)'],
  inputs: [{id:"monthly",label:"Monthly SIP Amount",pfx:"₹",def:5000,min:100,step:100,hint:"Min ₹100"},{id:"rate",label:"Expected Annual Return",sfx:"%",def:12,min:1,max:30,step:0.5,hint:"Select fund below"},{id:"years",label:"Investment Period",sfx:"Yrs",def:10,min:1,max:40,step:1}],
  note: 'Past returns are shown for reference. SEBI mandates: Past performance is not indicative of future results.',
  hasFundSearch:true,hasChart:true,
  compute: (v: Record<string, number | string>) => {
    const n = v as Record<string, number>;
    return calcSIP(n.monthly,n.rate,n.years);
  },
};

export default function Page() {
  return <CalcEngine config={config} />;
}
