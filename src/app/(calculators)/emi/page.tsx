'use client';
import { Metadata } from 'next';
import CalcEngine from '@/components/calculator/CalcEngine';
import { calcEMI } from '@/lib/calculators';


const config = {
  id: 'emi', icon: '🏦', color: '#dbeafe',
  title: 'EMI Calculator',
  subtitle: 'Home · Car · Personal loan · Reducing balance method · Amortisation schedule',
  category: 'loan',
  formula: {
    eq: 'EMI = P × r × (1+r)ⁿ / ((1+r)ⁿ−1)',
    vars: 'P = principal · r = monthly rate · n = months',
    source: 'RBI reducing balance EMI mandate',
    url: 'https://www.rbi.org.in',
  },
  steps: ['r = Annual rate ÷ 12 ÷ 100', 'n = Years × 12', 'Apply reducing-balance EMI formula', 'Total interest = (EMI×n)−P'],
  inputs: [{id:"principal",label:"Loan Amount",pfx:"₹",def:2000000,step:50000},{id:"rate",label:"Annual Interest Rate",sfx:"%",def:8.5,min:1,max:25,step:0.05,hint:"RBI repo: 6.5%"},{id:"years",label:"Loan Tenure",sfx:"Yrs",def:20,min:1,max:30,step:1}],
  note: 'EMI calculated on reducing balance method as mandated by RBI. Does not include processing fees.',
  hasBankRates:true,
  compute: (v: Record<string, number | string>) => {
    const n = v as Record<string, number>;
    return calcEMI(n.principal,n.rate,n.years);
  },
};

export default function Page() {
  return <CalcEngine config={config} />;
}
