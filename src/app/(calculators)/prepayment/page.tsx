'use client';
import { Metadata } from 'next';
import CalcEngine from '@/components/calculator/CalcEngine';
import { calcPrepayment } from '@/lib/calculators';


const config = {
  id: 'prepayment', icon: '⚡', color: '#dbeafe',
  title: 'Loan Prepayment Calculator',
  subtitle: 'How much interest you save with extra monthly payments',
  category: 'loan',
  formula: {
    eq: 'Extra payment reduces principal → recalculate amortisation',
    vars: 'Every extra ₹1 saved = ₹1-4 in interest avoided',
    source: 'Standard amortisation prepayment method',
    
  },
  steps: ['Run amortisation with extra payment on principal', 'Find new payoff date', 'Compare total interest old vs new'],
  inputs: [{id:"principal",label:"Outstanding Loan",pfx:"₹",def:2000000,step:10000},{id:"rate",label:"Interest Rate",sfx:"%",def:8.5,min:1,max:20,step:0.1},{id:"years",label:"Remaining Tenure",sfx:"Yrs",def:15,min:1,max:30,step:1},{id:"extra",label:"Extra Monthly Payment",pfx:"₹",def:5000,step:500,hint:"Applied to principal"}],
  note: undefined,
  
  compute: (v: Record<string, number | string>) => {
    const n = v as Record<string, number>;
    return calcPrepayment(n.principal,n.rate,n.years,n.extra);
  },
};

export default function Page() {
  return <CalcEngine config={config} />;
}
