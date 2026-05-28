# CalcGenie — India's Most Accurate Financial Calculators

25 free, SEBI-formula-verified financial calculators. Real mutual fund CAGR from AMFI NAV history. Income tax FY 2026-27. Document upload via Claude API.

## Live
Deployed at: https://your-project.vercel.app

## Features
- 25 fully functional calculators
- Real mutual fund CAGR — live from AMFI via mfapi.in proxy
- Income Tax FY 2026-27 — Budget 2026 slabs, Sec 87A rebate
- GST Calculator — CGST/SGST/IGST split
- Document upload — salary slip / Form 16 / GST invoice parsed by Claude AI
- 500+ mutual funds with verified CAGR data
- All major bank FD rates (Apr 2026)
- Year-by-year projection tables
- Growth charts

## Setup

### 1. Clone & install
```bash
git clone https://github.com/YOUR_USERNAME/calcgenie.git
cd calcgenie
npm install
```

### 2. Environment variables
```bash
cp .env.example .env.local
# Edit .env.local and add your Anthropic API key
```

### 3. Run locally
```bash
npm run dev
# Open http://localhost:3000
```

## Deploy to Vercel

### Step 1 — Push to GitHub
```bash
git init
git add .
git commit -m "CalcGenie v1.0 — 25 calculators, live AMFI data, document upload"
git remote add origin https://github.com/YOUR_USERNAME/calcgenie.git
git push -u origin main
```

### Step 2 — Connect Vercel
1. Go to vercel.com/dashboard
2. Click "Add New Project"
3. Import your GitHub repo
4. Vercel auto-detects Next.js — click Deploy

### Step 3 — Add API Key in Vercel
1. Go to your Vercel project → Settings → Environment Variables
2. Add: `ANTHROPIC_API_KEY` = your key from console.anthropic.com
3. Redeploy

That's it. CalcGenie is live.

## Calculators
| Category | Calculators |
|----------|-------------|
| Investments | SIP, Lumpsum, Step-Up SIP, MF Returns |
| Loans & EMI | EMI, Home Loan Eligibility, Car Loan, Prepayment |
| Tax & Savings | Income Tax FY26-27, PPF, FD, RD, NSC |
| Retirement | Retirement Planner, NPS, EPF |
| Business | GST, ROI, Break-Even |
| Personal Finance | Compound Interest, Inflation, HRA, Salary/CTC, Goal, Gratuity, CAGR |

## Data Sources
- **Mutual Funds:** mfapi.in (AMFI NAV data, 14,000+ schemes)
- **PPF Rate:** 7.1% — Ministry of Finance Q1 FY2026-27
- **EPF Rate:** 8.25% — EPFO FY2024-25
- **Tax Slabs:** IT Dept India — Budget 2026 (no change from FY25-26)
- **EMI Formula:** RBI reducing balance mandate
- **GST:** GSTN India, GST Act 2017

## Document Upload
The Income Tax and GST calculators support document upload:
- **Income Tax:** Upload salary slip or Form 16 → auto-fills all income and deduction fields
- **GST:** Upload invoice or bill → auto-fills amount, rate, and transaction type
- Powered by Claude claude-haiku-4-5-20251001 (affordable, accurate)
- Requires `ANTHROPIC_API_KEY` environment variable

## Tech Stack
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS v4
- Chart.js 4 (lazy loaded)
- Anthropic SDK (@anthropic-ai/sdk)
