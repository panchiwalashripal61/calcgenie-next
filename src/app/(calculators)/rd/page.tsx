'use client';
import { Metadata } from 'next';
import CalcEngine from '@/components/calculator/CalcEngine';
import { calcRD } from '@/lib/calculators';


const config = {
  id: 'rd', icon: '🐷', color: '#fef3c7',
  title: 'Recurring Deposit Calculator',
  subtitle: 'Monthly deposit · Quarterly compounding · Indian bank standard',
  category: 'tax',
  formula: {
    eq: 'A = Σ R × (1+r/4)^(remaining quarters)',
    vars: 'R = monthly · r = annual rate · Standard Indian bank RD formula',
    source: 'Standard RD formula — Indian banks',
    
  },
  steps: ['Each monthly deposit earns from deposit date to maturity', 'Quarterly compounding applied', 'Sum FV of all installments = maturity value'],
  inputs: [{id:"monthly",label:"Monthly Deposit",pfx:"₹",def:5000,min:100,step:100},{id:"rate",label:"Interest Rate",sfx:"%",def:6.5,min:1,max:12,step:0.1},{id:"years",label:"Tenure",sfx:"Yrs",def:3,min:0.5,max:10,step:0.5}],
  note: undefined,
  hasBankRates:true,
  compute: (v: Record<string, number | string>) => {
    const n = v as Record<string, number>;
    return calcRD(n.monthly,n.rate,n.years);
  },
};

export default function Page() {
  return <CalcEngine config={config} />;
}
