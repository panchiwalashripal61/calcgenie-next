'use client';
import { Metadata } from 'next';
import CalcEngine from '@/components/calculator/CalcEngine';
import { calcFD } from '@/lib/calculators';


const config = {
  id: 'fd', icon: '🔒', color: '#fef3c7',
  title: 'Fixed Deposit Calculator',
  subtitle: 'Quarterly compounding · Compare all major bank rates · Senior citizen rates',
  category: 'tax',
  formula: {
    eq: 'A = P × (1 + r/4)^(4×t)',
    vars: 'Quarterly compounding as per RBI mandate · r = annual rate/100',
    source: 'RBI — Banks must compound FD quarterly minimum',
    url: 'https://www.rbi.org.in',
  },
  steps: ['Quarterly rate = Annual rate ÷ 4 ÷ 100', 'Periods = years × 4', 'A = P×(1+r/4)^(4t)', 'TDS 10% if annual interest >₹40,000'],
  inputs: [{id:"principal",label:"Principal Amount",pfx:"₹",def:500000,step:10000},{id:"rate",label:"Interest Rate",sfx:"%",def:7.0,min:1,max:15,step:0.1,hint:"Select bank below"},{id:"years",label:"Tenure",sfx:"Yrs",def:3,min:0.25,max:10,step:0.25},{id:"senior",label:"Senior Citizen?",type:"sel",opts:[{v:0,l:"No"},{v:0.5,l:"Yes (+0.5% extra)"}],def:0}],
  note: 'FD rates shown are indicative for Apr 2026. TDS @10% if annual interest >₹40,000.',
  hasBankRates:true,
  compute: (v: Record<string, number | string>) => {
    const n = v as Record<string, number>;
    return calcFD(n.principal,n.rate,n.years,Number(v.senior));
  },
};

export default function Page() {
  return <CalcEngine config={config} />;
}
