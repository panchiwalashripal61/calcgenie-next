'use client';
import { Metadata } from 'next';
import CalcEngine from '@/components/calculator/CalcEngine';
import { calcHomeLoan } from '@/lib/calculators';


const config = {
  id: 'home_loan', icon: '🏠', color: '#dbeafe',
  title: 'Home Loan Eligibility',
  subtitle: 'Max loan amount · FOIR calculation · Indian bank norms',
  category: 'loan',
  formula: {
    eq: 'Max EMI = Monthly Income × FOIR (0.45)',
    vars: 'FOIR 40-50% · LTV 80% typical',
    source: 'RBI FOIR lending guidelines',
    
  },
  steps: ['Max EMI = Monthly income × 0.45', 'Subtract existing EMIs', 'Back-calculate max loan from net EMI'],
  inputs: [{id:"income",label:"Monthly Net Income",pfx:"₹",def:80000,step:5000},{id:"existing",label:"Existing EMIs",pfx:"₹",def:0,step:1000,hint:"Car/personal loan"},{id:"rate",label:"Home Loan Rate",sfx:"%",def:8.5,min:6,max:15,step:0.1},{id:"years",label:"Tenure",sfx:"Yrs",def:20,min:5,max:30,step:1}],
  note: 'Based on standard FOIR of 45%. Actual bank eligibility varies.',
  
  compute: (v: Record<string, number | string>) => {
    const n = v as Record<string, number>;
    return calcHomeLoan(n.income,n.existing,n.rate,n.years);
  },
};

export default function Page() {
  return <CalcEngine config={config} />;
}
