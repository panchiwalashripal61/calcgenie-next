'use client';
import { Metadata } from 'next';
import CalcEngine from '@/components/calculator/CalcEngine';
import { calcCarLoan } from '@/lib/calculators';


const config = {
  id: 'car_loan', icon: '🚗', color: '#dbeafe',
  title: 'Car Loan Calculator',
  subtitle: 'New & used car · Total cost of ownership',
  category: 'loan',
  formula: {
    eq: 'EMI = P × r × (1+r)ⁿ / ((1+r)ⁿ−1)',
    vars: 'P = On-road price − Down payment',
    source: 'Standard reducing-balance EMI',
    
  },
  steps: ['Loan = On-road price − Down payment', 'Apply EMI formula', 'Total cost = Down payment + Total EMI'],
  inputs: [{id:"price",label:"Car On-Road Price",pfx:"₹",def:800000,step:10000},{id:"down",label:"Down Payment",pfx:"₹",def:160000,step:5000,hint:"Typically 20%"},{id:"rate",label:"Interest Rate",sfx:"%",def:9.5,min:5,max:20,step:0.1},{id:"years",label:"Tenure",sfx:"Yrs",def:5,min:1,max:8,step:1}],
  note: undefined,
  
  compute: (v: Record<string, number | string>) => {
    const n = v as Record<string, number>;
    return calcCarLoan(n.price,n.down,n.rate,n.years);
  },
};

export default function Page() {
  return <CalcEngine config={config} />;
}
