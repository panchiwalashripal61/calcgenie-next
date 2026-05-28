'use client';
import { Metadata } from 'next';
import CalcEngine from '@/components/calculator/CalcEngine';
import { calcGratuity } from '@/lib/calculators';


const config = {
  id: 'gratuity', icon: '🎁', color: '#ccfbf1',
  title: 'Gratuity Calculator',
  subtitle: 'Payment of Gratuity Act 1972 · Eligible after 5 continuous years',
  category: 'pf',
  formula: {
    eq: 'Gratuity = (Last Basic+DA / 26) × 15 × Years of Service',
    vars: '26 working days/month · 15 days wages per year · Tax-free up to ₹20L',
    source: 'Payment of Gratuity Act 1972 · Income Tax Act Sec 10(10)',
    
  },
  steps: ['Daily wage = Monthly basic+DA ÷ 26 (statutory working days)', '15 days per year of service', 'Tax-free up to ₹20L. Excess taxable as income'],
  inputs: [{id:"basic",label:"Last Basic + DA (monthly)",pfx:"₹",def:50000,step:1000},{id:"years",label:"Years of Service",sfx:"Yrs",def:8,min:5,max:40,step:1,hint:"Min 5 years for eligibility"}],
  note: 'Eligible only after 5 years of continuous service. For companies with 10+ employees.',
  
  compute: (v: Record<string, number | string>) => {
    const n = v as Record<string, number>;
    return calcGratuity(n.basic,n.years);
  },
};

export default function Page() {
  return <CalcEngine config={config} />;
}
