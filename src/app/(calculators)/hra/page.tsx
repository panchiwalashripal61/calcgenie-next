'use client';
import { Metadata } from 'next';
import CalcEngine from '@/components/calculator/CalcEngine';
import { calcHRA } from '@/lib/calculators';


const config = {
  id: 'hra', icon: '🏘️', color: '#fee2e2',
  title: 'HRA Exemption Calculator',
  subtitle: 'Section 10(13A) · Rule 2A · Metro vs non-metro',
  category: 'pf',
  formula: {
    eq: 'Exempt = Min of [Actual HRA | 50%/40% of Basic | Rent − 10% Basic]',
    vars: '50% for Delhi/Mumbai/Chennai/Kolkata · 40% all others',
    source: 'Income Tax Act Section 10(13A) · Rule 2A',
    
  },
  steps: ['Calculate all 3 values: Actual HRA, 50/40% of basic, Rent−10% basic', 'Exempt = minimum of three', 'Need rent receipts and landlord PAN if rent >₹1L/year'],
  inputs: [{id:"basic",label:"Monthly Basic Salary",pfx:"₹",def:50000,step:1000},{id:"hraRec",label:"Monthly HRA Received",pfx:"₹",def:20000,step:500},{id:"rent",label:"Monthly Rent Paid",pfx:"₹",def:18000,step:500},{id:"city",label:"City Type",type:"sel",opts:[{v:50,l:"Metro (Delhi/Mumbai/Chennai/Kolkata)"},{v:40,l:"Non-metro city"}],def:50}],
  note: undefined,
  
  compute: (v: Record<string, number | string>) => {
    const n = v as Record<string, number>;
    return calcHRA(n.basic,n.hraRec,n.rent,Number(v.city));
  },
};

export default function Page() {
  return <CalcEngine config={config} />;
}
