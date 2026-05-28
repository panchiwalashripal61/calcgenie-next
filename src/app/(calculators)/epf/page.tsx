'use client';
import { Metadata } from 'next';
import CalcEngine from '@/components/calculator/CalcEngine';
import { calcEPF } from '@/lib/calculators';


const config = {
  id: 'epf', icon: '👷', color: '#ede9fe',
  title: 'EPF Calculator',
  subtitle: 'Employee Provident Fund · 8.25% (FY24-25) · 12%+12% contribution',
  category: 'retire',
  formula: {
    eq: 'Both contribute 12% of basic. Employer: 3.67% EPF + 8.33% EPS',
    vars: 'Rate: 8.25% (EPFO FY2024-25). EPS pension after 10 yrs service',
    source: 'EPFO — EPF Act 1952',
    url: 'https://www.epfindia.gov.in',
  },
  steps: ['Employee: 12% of basic salary → EPF', 'Employer: 3.67% → EPF + 8.33% → EPS', 'Interest at 8.25% compounded annually'],
  inputs: [{id:"basic",label:"Monthly Basic Salary",pfx:"₹",def:30000,step:1000,hint:"EPF on basic+DA"},{id:"age",label:"Current Age",sfx:"Yrs",def:25,min:18,max:58,step:1},{id:"increment",label:"Annual Increment",sfx:"%",def:8,min:0,max:20,step:1}],
  note: 'EPF interest rate 8.25% for FY 2024-25. Withdrawal before 5 years attracts TDS.',
  
  compute: (v: Record<string, number | string>) => {
    const n = v as Record<string, number>;
    return calcEPF(n.basic,n.age,n.increment);
  },
};

export default function Page() {
  return <CalcEngine config={config} />;
}
