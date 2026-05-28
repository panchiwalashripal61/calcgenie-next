export interface Fund {
  c: number;
  n: string;
  h: string;
  cat: string;
  r1?: number;
  r3?: number;
  r5?: number;
  r10?: number;
}

export const ALL_FUNDS: Fund[] = [
  // LARGE CAP
  {c:119551,n:'Mirae Asset Large Cap Fund - Direct Plan - Growth',h:'Mirae Asset',cat:'large cap',r1:14.1,r3:17.5,r5:15.3,r10:16.2},
  {c:125497,n:'HDFC Top 100 Fund - Direct Plan - Growth',h:'HDFC MF',cat:'large cap',r1:12.8,r3:15.9,r5:14.6,r10:14.1},
  {c:120586,n:'ICICI Prudential Bluechip Fund - Direct Plan - Growth',h:'ICICI MF',cat:'large cap',r1:14.2,r3:17.1,r5:15.8,r10:15.4},
  {c:120505,n:'SBI Bluechip Fund - Direct Plan - Growth',h:'SBI MF',cat:'large cap',r1:13.4,r3:16.2,r5:14.8,r10:14.3},
  {c:120684,n:'Axis Bluechip Fund - Direct Plan - Growth',h:'Axis MF',cat:'large cap',r1:11.8,r3:13.9,r5:13.2,r10:14.8},
  {c:101105,n:'Nippon India Large Cap Fund - Direct Plan - Growth',h:'Nippon MF',cat:'large cap',r1:16.8,r3:20.4,r5:18.6,r10:16.8},
  {c:100025,n:'Aditya Birla SL Frontline Equity Fund - Direct Plan - Growth',h:'ABSL MF',cat:'large cap',r1:13.2,r3:16.4,r5:14.9,r10:14.5},
  {c:125354,n:'UTI Large Cap Fund - Direct Plan - Growth',h:'UTI MF',cat:'large cap',r1:12.6,r3:15.8,r5:14.1,r10:13.6},
  // MID CAP
  {c:120503,n:'HDFC Mid-Cap Opportunities Fund - Direct Plan - Growth',h:'HDFC MF',cat:'mid cap',r1:16.8,r3:24.2,r5:22.4,r10:19.6},
  {c:120147,n:'Nippon India Growth Fund - Direct Plan - Growth',h:'Nippon MF',cat:'mid cap',r1:18.4,r3:26.8,r5:24.2,r10:20.4},
  {c:103504,n:'Kotak Emerging Equity Fund - Direct Plan - Growth',h:'Kotak MF',cat:'mid cap',r1:17.6,r3:24.8,r5:22.8,r10:19.4},
  {c:120848,n:'Motilal Oswal Midcap Fund - Direct Plan - Growth',h:'Motilal Oswal',cat:'mid cap',r1:22.4,r3:32.1,r5:28.6},
  {c:120843,n:'SBI Magnum Midcap Fund - Direct Plan - Growth',h:'SBI MF',cat:'mid cap',r1:16.4,r3:23.2,r5:21.8,r10:18.4},
  // SMALL CAP
  {c:120468,n:'Axis Small Cap Fund - Direct Plan - Growth',h:'Axis MF',cat:'small cap',r1:22.4,r3:28.6,r5:26.8,r10:24.2},
  {c:125494,n:'SBI Small Cap Fund - Direct Plan - Growth',h:'SBI MF',cat:'small cap',r1:20.1,r3:26.4,r5:25.2,r10:22.8},
  {c:120716,n:'Quant Small Cap Fund - Direct Plan - Growth',h:'Quant MF',cat:'small cap',r1:28.4,r3:32.1,r5:30.4,r10:27.8},
  {c:118778,n:'Nippon India Small Cap Fund - Direct Plan - Growth',h:'Nippon MF',cat:'small cap',r1:26.2,r3:33.8,r5:32.4,r10:28.6},
  {c:120206,n:'HDFC Small Cap Fund - Direct Plan - Growth',h:'HDFC MF',cat:'small cap',r1:20.8,r3:28.4,r5:26.2,r10:22.4},
  {c:120822,n:'Kotak Small Cap Fund - Direct Plan - Growth',h:'Kotak MF',cat:'small cap',r1:18.6,r3:24.8,r5:23.6,r10:21.2},
  {c:120469,n:'DSP Small Cap Fund - Direct Plan - Growth',h:'DSP MF',cat:'small cap',r1:19.4,r3:26.2,r5:24.8,r10:22.6},
  // FLEXI CAP
  {c:122639,n:'Parag Parikh Flexi Cap Fund - Direct Plan - Growth',h:'PPFAS MF',cat:'flexi cap',r1:18.2,r3:22.4,r5:20.1,r10:18.8},
  {c:101117,n:'Nippon India Flexi Cap Fund - Direct Plan - Growth',h:'Nippon MF',cat:'flexi cap',r1:24.6,r3:30.2,r5:27.4},
  {c:120716,n:'Quant Flexi Cap Fund - Direct Plan - Growth',h:'Quant MF',cat:'flexi cap',r1:32.4,r3:38.6,r5:34.2},
  {c:148629,n:'Franklin India Flexi Cap Fund - Direct Plan - Growth',h:'Franklin',cat:'flexi cap',r1:22.6,r3:26.8,r5:24.4,r10:20.2},
  // ELSS
  {c:130503,n:'Quant ELSS Tax Saver Fund - Direct Plan - Growth',h:'Quant MF',cat:'elss',r1:28.4,r3:34.6,r5:32.2,r10:29.4},
  {c:120175,n:'Mirae Asset ELSS Tax Saver Fund - Direct Plan - Growth',h:'Mirae Asset',cat:'elss',r1:15.8,r3:20.4,r5:18.6},
  {c:108389,n:'HDFC ELSS Tax Saver Fund - Direct Plan - Growth',h:'HDFC MF',cat:'elss',r1:22.6,r3:28.4,r5:25.8,r10:18.6},
  {c:120184,n:'SBI Long Term Equity Fund - Direct Plan - Growth',h:'SBI MF',cat:'elss',r1:24.8,r3:30.6,r5:28.4,r10:21.4},
  {c:101557,n:'Nippon India ELSS Tax Saver Fund - Direct Plan - Growth',h:'Nippon MF',cat:'elss',r1:20.4,r3:26.8,r5:24.6,r10:20.2},
  {c:120187,n:'Kotak ELSS Tax Saver Fund - Direct Plan - Growth',h:'Kotak MF',cat:'elss',r1:16.4,r3:21.6,r5:19.8,r10:18.6},
  // INDEX
  {c:120478,n:'UTI Nifty 50 Index Fund - Direct Plan - Growth',h:'UTI MF',cat:'index',r1:12.4,r3:16.2,r5:13.2,r10:12.8},
  {c:120479,n:'HDFC Index Fund - Nifty 50 Plan - Direct Plan - Growth',h:'HDFC MF',cat:'index',r1:12.4,r3:16.2,r5:13.1,r10:12.8},
  {c:120480,n:'ICICI Prudential Nifty 50 Index Fund - Direct Plan - Growth',h:'ICICI MF',cat:'index',r1:12.3,r3:16.1,r5:13.0,r10:12.7},
  {c:120484,n:'UTI Nifty Next 50 Index Fund - Direct Plan - Growth',h:'UTI MF',cat:'index',r1:15.2,r3:18.8,r5:16.4,r10:14.8},
  {c:147627,n:'Motilal Oswal Nifty Midcap 150 Index Fund - Direct Plan',h:'Motilal Oswal',cat:'index',r1:18.4,r3:24.6,r5:22.8},
  {c:147628,n:'Motilal Oswal Nifty Smallcap 250 Index Fund - Direct Plan',h:'Motilal Oswal',cat:'index',r1:22.6,r3:29.4,r5:27.2},
  {c:148780,n:'UTI Nifty 200 Momentum 30 Index Fund - Direct Plan',h:'UTI MF',cat:'index',r1:24.6,r3:32.4,r5:29.2},
  {c:148001,n:'Groww Nifty 50 Index Fund - Direct Plan - Growth',h:'Groww MF',cat:'index',r1:12.3,r3:16.0},
  // HYBRID
  {c:119775,n:'HDFC Balanced Advantage Fund - Direct Plan - Growth',h:'HDFC MF',cat:'hybrid',r1:20.6,r3:25.8,r5:22.4,r10:17.8},
  {c:120844,n:'ICICI Prudential Balanced Advantage Fund - Direct Plan',h:'ICICI MF',cat:'hybrid',r1:13.2,r3:15.8,r5:14.2,r10:13.8},
  {c:120843,n:'SBI Equity Hybrid Fund - Direct Plan - Growth',h:'SBI MF',cat:'hybrid',r1:16.8,r3:21.4,r5:19.6,r10:17.2},
  {c:148640,n:'Quant Absolute Fund - Direct Plan - Growth',h:'Quant MF',cat:'hybrid',r1:26.4,r3:32.8,r5:29.6},
  // DEBT
  {c:119528,n:'Aditya Birla SL Short Term Fund - Direct Plan - Growth',h:'ABSL MF',cat:'debt',r1:7.8,r3:6.9,r5:7.2,r10:7.8},
  {c:148650,n:'HDFC Corporate Bond Fund - Direct Plan - Growth',h:'HDFC MF',cat:'debt',r1:8.1,r3:7.2,r5:7.6,r10:8.2},
  {c:148651,n:'ICICI Prudential Corporate Bond Fund - Direct Plan',h:'ICICI MF',cat:'debt',r1:8.0,r3:7.1,r5:7.5,r10:8.1},
  // LIQUID
  {c:119801,n:'SBI Liquid Fund - Direct Plan - Growth',h:'SBI MF',cat:'liquid',r1:7.2,r3:6.8,r5:6.5,r10:6.8},
  {c:119775,n:'HDFC Liquid Fund - Direct Plan - Growth',h:'HDFC MF',cat:'liquid',r1:7.3,r3:6.9,r5:6.6,r10:6.9},
  {c:101206,n:'ICICI Prudential Liquid Fund - Direct Plan - Growth',h:'ICICI MF',cat:'liquid',r1:7.2,r3:6.8,r5:6.5,r10:6.8},
  // GILT
  {c:148661,n:'SBI Magnum Gilt Fund - Direct Plan - Growth',h:'SBI MF',cat:'gilt',r1:8.6,r3:7.4,r5:7.8,r10:8.4},
  {c:148663,n:'ICICI Prudential Gilt Fund - Direct Plan - Growth',h:'ICICI MF',cat:'gilt',r1:8.8,r3:7.6,r5:8.0,r10:8.6},
  // SECTORAL
  {c:148670,n:'HDFC Defence Fund - Direct Plan - Growth',h:'HDFC MF',cat:'sectoral',r1:28.4},
  {c:148671,n:'SBI Defence Opportunities Fund - Direct Plan - Growth',h:'SBI MF',cat:'sectoral',r1:26.8},
  {c:148688,n:'ICICI Prudential Infrastructure Fund - Direct Plan',h:'ICICI MF',cat:'sectoral',r1:36.4,r3:44.2,r5:40.8},
  {c:148676,n:'ICICI Prudential Technology Fund - Direct Plan',h:'ICICI MF',cat:'sectoral',r1:19.2,r3:23.6,r5:21.4},
  {c:148681,n:'SBI Healthcare Opportunities Fund - Direct Plan',h:'SBI MF',cat:'sectoral',r1:38.4,r3:26.8,r5:24.6,r10:20.4},
  // GOLD
  {c:108374,n:'SBI Gold Fund - Direct Plan - Growth',h:'SBI MF',cat:'gold',r1:28.6,r3:18.4,r5:14.8,r10:11.2},
  {c:108376,n:'ICICI Prudential Gold ETF FOF - Direct Plan',h:'ICICI MF',cat:'gold',r1:28.8,r3:18.6,r5:15.0},
  {c:108378,n:'Kotak Gold Fund - Direct Plan - Growth',h:'Kotak MF',cat:'gold',r1:28.6,r3:18.4,r5:14.8,r10:11.2},
  // INTERNATIONAL
  {c:148711,n:'Motilal Oswal S&P 500 Index Fund - Direct Plan',h:'Motilal Oswal',cat:'international',r1:14.8,r3:18.6,r5:16.4},
  {c:148712,n:'Kotak NASDAQ 100 FOF - Direct Plan - Growth',h:'Kotak MF',cat:'international',r1:16.4,r3:20.8,r5:18.6},
  {c:148715,n:'Edelweiss US Technology Equity FOF - Direct Plan',h:'Edelweiss',cat:'international',r1:18.6,r3:24.4,r5:21.8},
];

export const FUND_CATEGORIES = ['all','equity','large cap','mid cap','small cap','flexi cap','elss','index','hybrid','debt','liquid','gilt','sectoral','gold','international'] as const;
