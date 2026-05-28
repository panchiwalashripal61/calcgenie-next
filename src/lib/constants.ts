// CalcGenie — All verified Indian financial constants
// Sources cited inline. Update quarterly.

export const RATES = {
  PPF_RATE: 0.071,           // 7.1% — Ministry of Finance Q1 FY2026-27
  EPF_RATE: 0.0825,          // 8.25% — EPFO FY2024-25
  NSC_RATE: 0.077,           // 7.7% — NSI India Q1 FY2025-26
  RBI_REPO_RATE: 0.065,      // 6.5% — RBI April 2026
  INDIA_INFLATION: 0.06,     // 6% — RBI long-term CPI average
  NIFTY_5Y_CAGR: 13.2,       // 13.2% — AMFI NAV history
  SECTION_87A_REBATE: 60000,
  SECTION_87A_LIMIT: 1200000,
  STD_DED_NEW: 75000,        // Budget 2024-25
  STD_DED_OLD: 50000,
  CESS: 0.04,                // 4% Health & Education cess
  MAX_80C: 150000,
  MAX_80D_SELF: 25000,
  MAX_80D_PARENT_SENIOR: 50000,
  MAX_HOME_LOAN_INT: 200000, // Section 24(b)
  MAX_NPS_80CCD1B: 50000,    // Over and above 80C
} as const;

export const NEW_REGIME_SLABS = [
  { from: 0,        to: 400000,   rate: 0    },
  { from: 400000,   to: 800000,   rate: 0.05 },
  { from: 800000,   to: 1200000,  rate: 0.10 },
  { from: 1200000,  to: 1600000,  rate: 0.15 },
  { from: 1600000,  to: 2000000,  rate: 0.20 },
  { from: 2000000,  to: 2400000,  rate: 0.25 },
  { from: 2400000,  to: Infinity, rate: 0.30 },
] as const;

export const OLD_REGIME_SLABS = [
  { from: 0,       to: 250000,   rate: 0    },
  { from: 250000,  to: 500000,   rate: 0.05 },
  { from: 500000,  to: 1000000,  rate: 0.20 },
  { from: 1000000, to: Infinity, rate: 0.30 },
] as const;

export const FD_RATES = [
  { bank:'SBI',         rate1:6.80, rate2:7.00, rate3:6.50, rateMax:7.10, senior:7.30 },
  { bank:'HDFC Bank',   rate1:7.10, rate2:7.20, rate3:7.00, rateMax:7.40, senior:7.90 },
  { bank:'ICICI Bank',  rate1:7.00, rate2:7.15, rate3:7.00, rateMax:7.25, senior:7.75 },
  { bank:'Kotak Bank',  rate1:7.10, rate2:7.25, rate3:7.10, rateMax:7.40, senior:7.90 },
  { bank:'Axis Bank',   rate1:7.00, rate2:7.10, rate3:7.10, rateMax:7.25, senior:7.75 },
  { bank:'Yes Bank',    rate1:7.25, rate2:7.50, rate3:7.25, rateMax:8.00, senior:8.50 },
  { bank:'IndusInd',    rate1:7.50, rate2:7.75, rate3:7.50, rateMax:8.25, senior:8.75 },
  { bank:'IDFC First',  rate1:7.50, rate2:7.75, rate3:7.50, rateMax:8.50, senior:9.00 },
  { bank:'Post Office', rate1:6.90, rate2:7.00, rate3:7.10, rateMax:7.50, senior:7.50 },
];

export const DATA_SOURCES = {
  PPF: 'https://www.nsiindia.gov.in',
  EPF: 'https://www.epfindia.gov.in',
  INCOME_TAX: 'https://www.incometax.gov.in',
  RBI: 'https://www.rbi.org.in',
  AMFI: 'https://www.amfiindia.com',
  GSTN: 'https://www.gst.gov.in',
} as const;
