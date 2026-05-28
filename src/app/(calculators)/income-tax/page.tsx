'use client';
import { Metadata } from 'next';
import CalcEngine from '@/components/calculator/CalcEngine';
import { calcIncomeTax } from '@/lib/calculators';


const config = {
  id: 'income_tax', icon: '📋', color: '#fef3c7',
  title: 'Income Tax Calculator',
  subtitle: 'FY 2026-27 · New Regime vs Old Regime · Budget 2026 slabs · Section 87A rebate',
  category: 'tax',
  formula: {
    eq: 'New: 0%≤₹4L, 5% ₹4-8L, 10% ₹8-12L, 15% ₹12-16L, 20% ₹16-20L, 25% ₹20-24L, 30%>₹24L',
    vars: 'Std deduction ₹75K (new) / ₹50K (old). 87A rebate ₹60K if income ≤ ₹12L',
    source: 'Income Tax Dept India — Budget 2025/2026 (no change in slabs for FY26-27)',
    url: 'https://www.incometax.gov.in',
  },
  steps: [
    'New regime default from FY 2023-24. Basic exemption: ₹4L. Section 87A rebate ₹60,000 → nil tax up to ₹12L',
    'Standard deduction: ₹75,000 (new) / ₹50,000 (old) for salaried employees',
    'Old Regime: all deductions available — 80C (₹1.5L), 80D, HRA, NPS 80CCD(1B) ₹50K, Home loan 24(b) ₹2L',
    'Add 4% Health & Education Cess on final tax amount',
  ],
  inputs: [
    { id: 'income', label: 'Annual Gross Income (CTC)', pfx: '₹', def: 1200000, step: 10000, hint: 'Salary before deductions' },
    { id: 'd80c', label: '80C Investments (Old regime)', pfx: '₹', def: 150000, step: 5000, hint: 'PPF/ELSS/PF/LIC max ₹1.5L' },
    { id: 'd80d', label: '80D Health Insurance', pfx: '₹', def: 25000, step: 1000, hint: 'Self ₹25K, Senior parent ₹50K' },
    { id: 'hraEx', label: 'HRA Exemption', pfx: '₹', def: 120000, step: 5000, hint: 'Use HRA calculator above' },
    { id: 'nps', label: 'NPS 80CCD(1B)', pfx: '₹', def: 50000, step: 5000, hint: 'Extra ₹50K over 80C' },
    { id: 'homeLoan', label: 'Home Loan Interest 24(b)', pfx: '₹', def: 0, step: 5000, hint: 'Max ₹2L self-occupied' },
  ],
  note: 'Budget 2026: No change in slabs. New regime is default. Sec 87A rebate ₹60,000 — zero tax for income ≤ ₹12L in new regime.',
  hasUpload: true,
  uploadType: 'salary' as const,
  compute: (v: Record<string, number | string>) => {
    const n = v as Record<string, number>;
    return calcIncomeTax(n.income, n.d80c, n.d80d, n.hraEx, n.nps, n.homeLoan);
  },
};

export default function IncomeTaxPage() {
  return <CalcEngine config={config} />;
}
