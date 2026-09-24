/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  PieChart as PieChartIcon,
  BarChart3,
  Search,
  RefreshCw,
  SlidersHorizontal,
  Wallet,
  Clock,
  Star,
  Check,
  Copy,
  X,
  HelpCircle,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  DollarSign,
  FileText,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  Layers,
  Sparkles,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';

// ==========================================
// TYPES & INTERFACES
// ==========================================
export type RiskLevel = 'low' | 'moderate' | 'high';

export interface MarketIndex {
  symbol: string;
  name: string;
  points: number;
  change: number;
  percentChange: number;
  high: number;
  low: number;
  valueMB: number; // Million Baht
  chartData: number[];
}

export interface StockMover {
  symbol: string;
  name: string;
  sector: string;
  lastPrice: number;
  change: number;
  percentChange: number;
  valueMB: number;
  volume: number;
  high52w: number;
  low52w: number;
  pe: number;
  pbv: number;
  divYield: number;
  marketCapBillion: number;
  description: string;
  trend7d: number[];
}

export interface AssetAllocationItem {
  name: string;
  percentage: number;
  color: string;
  category: string;
  thaiInstrument: string;
  rationale: string;
  expectedYield: string;
}

export interface PortfolioStrategy {
  level: RiskLevel;
  title: string;
  subtitle: string;
  tagline: string;
  expectedAnnualReturn: string;
  volatilityRating: 'Low' | 'Moderate' | 'High';
  volatilityScore: number; // 1-10
  timeHorizon: string;
  recommendedRebalance: string;
  suitability: string;
  thesis: string;
  allocations: AssetAllocationItem[];
  sampleTickers: string[];
}

export interface SectorData {
  sector: string;
  fullName: string;
  percentChange: number;
  valueMB: number;
  points: number;
  leaders: string;
}

// ==========================================
// CONSTANT DATA (SETTRADE MOCK REAL-TIME DATA)
// ==========================================

const INITIAL_INDICES: MarketIndex[] = [
  {
    symbol: 'SET',
    name: 'Stock Exchange of Thailand',
    points: 1464.32,
    change: 8.45,
    percentChange: 0.58,
    high: 1468.90,
    low: 1456.12,
    valueMB: 54820.65,
    chartData: [1456, 1458, 1460, 1459, 1463, 1461, 1464],
  },
  {
    symbol: 'SET50',
    name: 'SET50 Blue-Chip Index',
    points: 898.74,
    change: 5.62,
    percentChange: 0.63,
    high: 902.10,
    low: 892.40,
    valueMB: 37450.12,
    chartData: [893, 894, 896, 895, 897, 896, 899],
  },
  {
    symbol: 'mai',
    name: 'Market for Alternative Investment',
    points: 341.80,
    change: -1.75,
    percentChange: -0.51,
    high: 344.60,
    low: 340.25,
    valueMB: 2894.40,
    chartData: [344, 343, 342, 342, 341, 342, 342],
  },
];

const INITIAL_STOCKS: StockMover[] = [
  {
    symbol: 'DELTA',
    name: 'Delta Electronics (Thailand) PCL',
    sector: 'Technology',
    lastPrice: 154.50,
    change: 6.00,
    percentChange: 4.04,
    valueMB: 6850.25,
    volume: 44620100,
    high52w: 165.00,
    low52w: 68.00,
    pe: 72.4,
    pbv: 18.2,
    divYield: 0.45,
    marketCapBillion: 1927.4,
    description: 'Leading global manufacturer of power electronics and automotive thermal management components.',
    trend7d: [142, 145, 144, 148, 150, 149, 154.5],
  },
  {
    symbol: 'PTT',
    name: 'PTT Public Company Limited',
    sector: 'Energy & Utilities',
    lastPrice: 33.75,
    change: 0.50,
    percentChange: 1.50,
    valueMB: 4910.15,
    volume: 145800000,
    high52w: 36.50,
    low52w: 31.00,
    pe: 9.8,
    pbv: 0.88,
    divYield: 5.92,
    marketCapBillion: 964.0,
    description: 'State-owned oil and gas conglomerate with dominant position in Thai downstream and upstream energy.',
    trend7d: [32.5, 33.0, 33.25, 33.0, 33.5, 33.25, 33.75],
  },
  {
    symbol: 'ADVANC',
    name: 'Advanced Info Service PCL',
    sector: 'Technology / Telecom',
    lastPrice: 284.00,
    change: 2.00,
    percentChange: 0.71,
    valueMB: 4210.80,
    volume: 14890000,
    high52w: 292.00,
    low52w: 205.00,
    pe: 26.1,
    pbv: 8.4,
    divYield: 3.48,
    marketCapBillion: 844.7,
    description: 'Largest mobile telecommunications provider in Thailand with resilient 5G and high-speed broadband moat.',
    trend7d: [278, 280, 281, 282, 283, 282, 284],
  },
  {
    symbol: 'KBANK',
    name: 'Kasikornbank Public Company Limited',
    sector: 'Banking',
    lastPrice: 156.00,
    change: 1.50,
    percentChange: 0.97,
    valueMB: 3950.40,
    volume: 25480000,
    high52w: 162.00,
    low52w: 120.50,
    pe: 7.9,
    pbv: 0.68,
    divYield: 4.81,
    marketCapBillion: 369.6,
    description: 'Leading digital retail and commercial bank in Thailand driving high Net Interest Margin and regional growth.',
    trend7d: [152, 153, 154, 153.5, 155, 154.5, 156],
  },
  {
    symbol: 'CPALL',
    name: 'CP ALL Public Company Limited',
    sector: 'Commerce',
    lastPrice: 64.75,
    change: -0.25,
    percentChange: -0.38,
    valueMB: 3420.60,
    volume: 52700000,
    high52w: 69.50,
    low52w: 52.00,
    pe: 28.5,
    pbv: 4.6,
    divYield: 1.85,
    marketCapBillion: 581.6,
    description: 'Exclusive 7-Eleven operator in Thailand and controlling shareholder of CP Axtra (Makro & Lotus).',
    trend7d: [65.5, 66.0, 65.0, 65.25, 64.5, 65.0, 64.75],
  },
  {
    symbol: 'BDMS',
    name: 'Bangkok Dusit Medical Services PCL',
    sector: 'Health Care Services',
    lastPrice: 28.00,
    change: 0.25,
    percentChange: 0.90,
    valueMB: 2890.30,
    volume: 103400000,
    high52w: 31.00,
    low52w: 25.50,
    pe: 29.8,
    pbv: 4.4,
    divYield: 2.68,
    marketCapBillion: 445.0,
    description: 'Thailand’s largest private hospital operator benefiting strongly from medical tourism and affluent aging demographics.',
    trend7d: [27.25, 27.5, 27.5, 27.75, 28.0, 27.75, 28.0],
  },
  {
    symbol: 'GULF',
    name: 'Gulf Energy Development PCL',
    sector: 'Energy & Utilities',
    lastPrice: 65.25,
    change: 1.25,
    percentChange: 1.95,
    valueMB: 2750.90,
    volume: 42300000,
    high52w: 68.00,
    low52w: 40.00,
    pe: 34.2,
    pbv: 4.8,
    divYield: 1.35,
    marketCapBillion: 765.8,
    description: 'Major independent power producer with expanding digital infrastructure, telecom stakes, and clean energy portfolio.',
    trend7d: [62.0, 63.5, 64.0, 64.25, 64.5, 64.0, 65.25],
  },
  {
    symbol: 'AOT',
    name: 'Airports of Thailand PCL',
    sector: 'Transportation',
    lastPrice: 61.50,
    change: -0.75,
    percentChange: -1.20,
    valueMB: 2610.75,
    volume: 42100000,
    high52w: 72.00,
    low52w: 55.00,
    pe: 42.1,
    pbv: 7.2,
    divYield: 1.15,
    marketCapBillion: 878.6,
    description: 'Sole operator of 6 international gateway airports in Thailand, central to the Kingdom’s tourism gateway revenue.',
    trend7d: [63.0, 63.5, 62.5, 62.0, 62.5, 62.25, 61.5],
  },
  {
    symbol: 'SCB',
    name: 'SCB X Public Company Limited',
    sector: 'Banking',
    lastPrice: 114.50,
    change: 1.00,
    percentChange: 0.88,
    valueMB: 2340.50,
    volume: 20450000,
    high52w: 118.00,
    low52w: 99.00,
    pe: 8.5,
    pbv: 0.76,
    divYield: 9.15,
    marketCapBillion: 385.5,
    description: 'Leading financial technology group with market-beating dividend yield and aggressive fintech expansion.',
    trend7d: [112.5, 113.0, 113.5, 113.5, 114.0, 113.5, 114.5],
  },
  {
    symbol: 'TRUE',
    name: 'True Corporation Public Company Limited',
    sector: 'Technology / Telecom',
    lastPrice: 12.10,
    change: 0.30,
    percentChange: 2.54,
    valueMB: 1980.20,
    volume: 164200000,
    high52w: 13.00,
    low52w: 5.15,
    pe: 48.0,
    pbv: 5.1,
    divYield: 1.20,
    marketCapBillion: 418.1,
    description: 'Post-merger telecom powerhouse demonstrating rapid EBITDA expansion, spectrum synergy, and ARPU recovery.',
    trend7d: [11.4, 11.6, 11.5, 11.8, 11.9, 11.8, 12.1],
  },
];

const SECTOR_PERFORMANCE: SectorData[] = [
  {
    sector: 'ENERG',
    fullName: 'Energy & Utilities',
    percentChange: 1.42,
    valueMB: 14250,
    points: 21340.2,
    leaders: 'PTT, GULF, PTTEP',
  },
  {
    sector: 'TECH',
    fullName: 'Technology',
    percentChange: 2.15,
    valueMB: 11820,
    points: 312.4,
    leaders: 'DELTA, CCET, HANA',
  },
  {
    sector: 'BANK',
    fullName: 'Banking',
    percentChange: 0.85,
    valueMB: 9450,
    points: 388.9,
    leaders: 'KBANK, SCB, BBL',
  },
  {
    sector: 'COMM',
    fullName: 'Commerce',
    percentChange: -0.22,
    valueMB: 6810,
    points: 34120.5,
    leaders: 'CPALL, CRC, BJC',
  },
  {
    sector: 'HELTH',
    fullName: 'Health Care',
    percentChange: 0.68,
    valueMB: 4320,
    points: 6245.1,
    leaders: 'BDMS, BH, PR9',
  },
  {
    sector: 'TRANS',
    fullName: 'Transportation',
    percentChange: -0.94,
    valueMB: 3950,
    points: 315.6,
    leaders: 'AOT, BEM, BTS',
  },
  {
    sector: 'PROP',
    fullName: 'Property Development',
    percentChange: 0.18,
    valueMB: 2840,
    points: 218.4,
    leaders: 'CPN, SPALI, AP',
  },
  {
    sector: 'FOOD',
    fullName: 'Food & Beverage',
    percentChange: -0.45,
    valueMB: 2210,
    points: 11250.3,
    leaders: 'CBG, OSP, TU',
  },
];

// PORTFOLIO STRATEGIES FOR LOW, MODERATE, HIGH
const STRATEGIES: Record<RiskLevel, PortfolioStrategy> = {
  low: {
    level: 'low',
    title: 'Conservative Capital Preservation',
    subtitle: 'Low Volatility • Defensive Income',
    tagline: 'Prioritizes safety of principal with steady dividend income and stable yield.',
    expectedAnnualReturn: '4.5% – 6.5%',
    volatilityRating: 'Low',
    volatilityScore: 3,
    timeHorizon: '1 – 3 Years',
    recommendedRebalance: 'Semi-Annually',
    suitability: 'Ideal for near-retirees, first-time investors, or capital needed within 36 months.',
    thesis:
      'This conservative allocation anchors 60% in high-grade sovereign and investment-grade corporate bonds to cushion against market volatility. 20% in Thai income-focused mutual funds and 10% in high-dividend SET50 giants provide inflation protection without exposing capital to sudden equity drawdowns. 10% liquidity buffer protects your peace of mind.',
    allocations: [
      {
        name: 'Bonds (Govt & Corporate)',
        percentage: 60,
        color: '#1E40AF', // Blue 800
        category: 'Fixed Income',
        thaiInstrument: 'Thai ESG Bonds / KT-BOND / K-FIXED',
        rationale: 'Supplies predictable coupon income with minimal default risk and lower drawdowns.',
        expectedYield: '2.8% – 3.8% p.a.',
      },
      {
        name: 'Thai Mutual Funds',
        percentage: 20,
        color: '#0D9488', // Teal 600
        category: 'Mutual Funds',
        thaiInstrument: 'SCBBLN / K-VALUE / B-SENIOR',
        rationale: 'Professionally managed basket of stable dividend-yielding blue chips and money market.',
        expectedYield: '4.0% – 5.5% p.a.',
      },
      {
        name: 'SET50 Dividend Stocks',
        percentage: 10,
        color: '#2563EB', // Blue 600
        category: 'Equities',
        thaiInstrument: 'TDEX ETF (SET50) or SCB, ADVANC, PTT',
        rationale: 'Targeted exposure to high cash-generative Thai monopolies with 4%+ dividend yields.',
        expectedYield: '4.5% – 6.0% yield',
      },
      {
        name: 'Cash & Short-Term Money Market',
        percentage: 10,
        color: '#64748B', // Slate 500
        category: 'Cash Equivalents',
        thaiInstrument: 'High-yield e-Savings / SCBTREASURY',
        rationale: 'Immediate liquidity buffer for emergencies or tactical dip-buying.',
        expectedYield: '1.5% – 2.0% p.a.',
      },
    ],
    sampleTickers: ['SCB', 'ADVANC', 'PTT', 'TDEX', 'KT-BOND'],
  },
  moderate: {
    level: 'moderate',
    title: 'Balanced Growth & Total Return',
    subtitle: 'Balanced Risk • Moderate Capital Appreciation',
    tagline: 'Harmonizes equity growth potential with fixed income stabilization and gold hedging.',
    expectedAnnualReturn: '8.0% – 11.5%',
    volatilityRating: 'Moderate',
    volatilityScore: 6,
    timeHorizon: '3 – 5 Years',
    recommendedRebalance: 'Quarterly',
    suitability: 'Great for professionals accumulating long-term wealth who tolerate moderate market swings.',
    thesis:
      'The classic modern balanced engine. 40% in core SET100 leaders captures Thai national infrastructure, banking, and retail consumption. 30% in high-quality bonds acts as shock absorption, while 20% in Global Technology funds taps into secular AI and semiconductor expansion. 10% in physical Gold serves as an anti-inflation & geopolitical geopolitical hedge.',
    allocations: [
      {
        name: 'SET100 Core Equities',
        percentage: 40,
        color: '#0F766E', // Teal 700
        category: 'Equities',
        thaiInstrument: 'SET100 ETF / KBANK, BDMS, CPALL, GULF',
        rationale: 'Captures the backbone of Thailand’s commercial, healthcare, and energy powerhouse.',
        expectedYield: '7.5% – 10.0% total return',
      },
      {
        name: 'Bonds & Fixed Income',
        percentage: 30,
        color: '#1D4ED8', // Blue 700
        category: 'Fixed Income',
        thaiInstrument: 'Government Bond 5Y / SCBFIXED',
        rationale: 'Dampens equity swings and reinvests periodic coupon cash flows.',
        expectedYield: '3.0% – 4.0% p.a.',
      },
      {
        name: 'Global Tech & Innovation Funds',
        percentage: 20,
        color: '#7C3AED', // Violet 600
        category: 'Foreign Funds',
        thaiInstrument: 'B-INNOTECH / ONE-UGG / K-USXNDQ',
        rationale: 'Unlocks exponential secular growth in global cloud, AI, and enterprise tech.',
        expectedYield: '12.0% – 16.0% target CAGR',
      },
      {
        name: 'Physical Gold / Commodity',
        percentage: 10,
        color: '#D97706', // Amber 600
        category: 'Commodity',
        thaiInstrument: 'GLD ETF / Baojia Gold 96.5% / SCBGOLD',
        rationale: 'Historically uncorrelated safe haven against currency devaluation and global tensions.',
        expectedYield: 'Hedge asset / 5.0% long-term',
      },
    ],
    sampleTickers: ['KBANK', 'CPALL', 'GULF', 'B-INNOTECH', 'GLD'],
  },
  high: {
    level: 'high',
    title: 'Aggressive Capital Appreciation',
    subtitle: 'High Growth • Maximum Upside Potential',
    tagline: 'Geared towards maximum long-term capital compounding across small-cap & global tech disruptors.',
    expectedAnnualReturn: '14.0% – 20.0%',
    volatilityRating: 'High',
    volatilityScore: 9,
    timeHorizon: '5+ Years',
    recommendedRebalance: 'Quarterly',
    suitability: 'For growth-oriented investors with high risk appetite seeking high multifold upside.',
    thesis:
      'Engineered for maximum equity compounders. 50% deployed into high-beta Thai growth stocks (sSET/mai) and domestic semiconductor champions (DELTA, CCET) targeting fast earnings momentum. 30% in Global Equities captures world-class enterprise giants. 10% in high-risk crypto/alternatives offers asymmetric convexity, while a 10% bond anchor ensures rebalancing liquidity on deep dips.',
    allocations: [
      {
        name: 'Growth Stocks (mai / sSET)',
        percentage: 50,
        color: '#059669', // Emerald 600
        category: 'High-Growth Equities',
        thaiInstrument: 'DELTA, CCET, JTS, mai tech index',
        rationale: 'High operational leverage and earnings acceleration in electronics and agile enterprises.',
        expectedYield: '15.0% – 25.0% target upside',
      },
      {
        name: 'Global Equities & ETFs',
        percentage: 30,
        color: '#3B82F6', // Blue 500
        category: 'Global Equities',
        thaiInstrument: 'TMBGQG / SCBWORLD / K-CHANGE',
        rationale: 'Broad geographic diversification across US, European, and Asian industry leaders.',
        expectedYield: '10.0% – 14.0% target CAGR',
      },
      {
        name: 'Crypto / Alternative Assets',
        percentage: 10,
        color: '#E11D48', // Rose 600
        category: 'Alternative Assets',
        thaiInstrument: 'Regulated Thai Digital Asset Exchange (BTC, ETH)',
        rationale: 'Asymmetric upside potential and digital store of value with uncorrelated alpha.',
        expectedYield: 'High volatility / Asymmetric',
      },
      {
        name: 'Strategic Bonds Anchor',
        percentage: 10,
        color: '#475569', // Slate 600
        category: 'Fixed Income',
        thaiInstrument: 'Short-term Thai Sovereign Debentures',
        rationale: 'Dry powder reserve to rebalance aggressively during sudden market corrections.',
        expectedYield: '2.5% – 3.2% yield',
      },
    ],
    sampleTickers: ['DELTA', 'CCET', 'TMBGQG', 'BTC', 'KT-BOND'],
  },
};

// ==========================================
// MAIN COMPONENT
// ==========================================
export default function App() {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'dashboard' | 'allocation' | 'sectors' | 'watchlist'>('dashboard');

  // Market indices and stock movers state
  const [indices, setIndices] = useState<MarketIndex[]>(INITIAL_INDICES);
  const [stocks, setStocks] = useState<StockMover[]>(INITIAL_STOCKS);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [flashSymbol, setFlashSymbol] = useState<string | null>(null);

  // Risk Allocation State
  const [selectedRisk, setSelectedRisk] = useState<RiskLevel>('moderate');
  const [capitalInput, setCapitalInput] = useState<number>(500000); // 500,000 THB default
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);

  // Movers Filter Tab
  const [moverFilter, setMoverFilter] = useState<'active' | 'gainers' | 'losers'>('active');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Watchlist state (persisted locally)
  const [watchlist, setWatchlist] = useState<string[]>(['DELTA', 'KBANK', 'PTT']);

  // Selected Stock for deep dive inspection modal
  const [inspectedStock, setInspectedStock] = useState<StockMover | null>(null);

  // Risk Profiler Questionnaire Modal
  const [isQuestionnaireOpen, setIsQuestionnaireOpen] = useState<boolean>(false);
  const [qAnswers, setQAnswers] = useState<{ q1: number; q2: number; q3: number }>({
    q1: 2,
    q2: 2,
    q3: 2,
  });

  // ----------------------------------------
  // SIMULATED REAL-TIME PRICE TICKER
  // ----------------------------------------
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      // Pick a random stock to tick
      const randomIndex = Math.floor(Math.random() * INITIAL_STOCKS.length);
      const target = INITIAL_STOCKS[randomIndex];
      const deltaPercent = (Math.random() * 0.8 - 0.38) / 100; // -0.38% to +0.42%
      const newPrice = Number((target.lastPrice * (1 + deltaPercent)).toFixed(2));
      const priceDiff = Number((newPrice - (target.lastPrice - target.change)).toFixed(2));
      const newPct = Number(((priceDiff / (newPrice - priceDiff)) * 100).toFixed(2));

      setStocks((prev) =>
        prev.map((s, idx) => {
          if (idx === randomIndex) {
            return {
              ...s,
              lastPrice: newPrice,
              change: priceDiff,
              percentChange: newPct,
              valueMB: Number((s.valueMB + Math.random() * 8.5).toFixed(2)),
            };
          }
          return s;
        })
      );

      // Micro-tick SET Index
      const setTick = (Math.random() * 0.4 - 0.18);
      setIndices((prev) =>
        prev.map((idxItem) => {
          const newPts = Number((idxItem.points + setTick).toFixed(2));
          const newChg = Number((idxItem.change + setTick).toFixed(2));
          const newPchg = Number(((newChg / (newPts - newChg)) * 100).toFixed(2));
          return {
            ...idxItem,
            points: newPts,
            change: newChg,
            percentChange: newPchg,
            high: Math.max(idxItem.high, newPts),
            low: Math.min(idxItem.low, newPts),
          };
        })
      );

      setFlashSymbol(target.symbol);
      setTimeout(() => setFlashSymbol(null), 800);
      setLastUpdated(new Date());
    }, 3800);

    return () => clearInterval(interval);
  }, [isSimulating]);

  // Current active Strategy
  const currentStrategy = useMemo(() => STRATEGIES[selectedRisk], [selectedRisk]);

  // Filtered stocks based on tab and search
  const filteredStocks = useMemo(() => {
    let list = [...stocks];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.symbol.toLowerCase().includes(q) ||
          s.name.toLowerCase().includes(q) ||
          s.sector.toLowerCase().includes(q)
      );
    }

    if (moverFilter === 'gainers') {
      list.sort((a, b) => b.percentChange - a.percentChange);
    } else if (moverFilter === 'losers') {
      list.sort((a, b) => a.percentChange - b.percentChange);
    } else {
      list.sort((a, b) => b.valueMB - a.valueMB);
    }

    return list;
  }, [stocks, moverFilter, searchQuery]);

  // Watchlist stocks
  const watchlistStocks = useMemo(() => {
    return stocks.filter((s) => watchlist.includes(s.symbol));
  }, [stocks, watchlist]);

  const toggleWatchlist = (symbol: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setWatchlist((prev) =>
      prev.includes(symbol) ? prev.filter((item) => item !== symbol) : [...prev, symbol]
    );
  };

  // Copy portfolio thesis to clipboard
  const handleCopyThesis = () => {
    const breakdownText = currentStrategy.allocations
      .map(
        (a) =>
          `• ${a.name}: ${a.percentage}% (฿${((capitalInput * a.percentage) / 100).toLocaleString('en-US', {
            maximumFractionDigits: 0,
          })}) - ${a.thaiInstrument}`
      )
      .join('\n');

    const copyText = `Fukudu Invest - Recommended Portfolio: ${currentStrategy.title}
Risk Profile: ${currentStrategy.level.toUpperCase()}
Target Annual Return: ${currentStrategy.expectedAnnualReturn}
Total Capital: ฿${capitalInput.toLocaleString()}

Asset Breakdown:
${breakdownText}

Investment Thesis:
${currentStrategy.thesis}

Generated via Fukudu Invest Smart Analyzer.`;

    navigator.clipboard.writeText(copyText);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  // Submit Questionnaire to determine risk profile
  const handleCalculateRiskProfile = () => {
    const totalScore = qAnswers.q1 + qAnswers.q2 + qAnswers.q3;
    if (totalScore <= 4) {
      setSelectedRisk('low');
    } else if (totalScore <= 7) {
      setSelectedRisk('moderate');
    } else {
      setSelectedRisk('high');
    }
    setIsQuestionnaireOpen(false);
  };

  // Format currency helpers
  const formatTHB = (val: number) => {
    return `฿${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatPoints = (val: number) => {
    return val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* ========================================================= */}
      {/* 1. TOP HEADER & BRANDING */}
      {/* ========================================================= */}
      <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo & Tagline */}
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-emerald-500 p-0.5 shadow-lg flex items-center justify-center">
                <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-emerald-400 stroke-[2.5]" />
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-white">
                    Fukudu<span className="text-emerald-400">Invest</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/80 hidden md:inline-block">
                    SETTRADE Model
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-medium hidden sm:block">
                  Smart Investment Analyzer &amp; Portfolio Recommender
                </p>
              </div>
            </div>

            {/* Market Status & Controls */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* SET Live Market indicator */}
              <div className="hidden lg:flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 text-xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-slate-300 font-semibold">SET Market Open</span>
                <span className="text-slate-500">|</span>
                <span className="text-slate-400 font-mono">
                  {lastUpdated.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>

              {/* Simulation Toggle */}
              <button
                onClick={() => setIsSimulating(!isSimulating)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
                  isSimulating
                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60 hover:bg-emerald-900/60'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                }`}
                title={isSimulating ? 'Pause live market simulation' : 'Resume live simulated ticks'}
              >
                <Activity className={`h-3.5 w-3.5 ${isSimulating ? 'text-emerald-400 animate-pulse' : 'text-slate-400'}`} />
                <span className="hidden sm:inline">{isSimulating ? 'Live Ticks On' : 'Ticks Paused'}</span>
              </button>

              {/* Quick Risk Button */}
              <button
                onClick={() => setIsQuestionnaireOpen(true)}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition"
              >
                <Sparkles className="h-3.5 w-3.5 text-blue-200" />
                <span>Risk Profiler</span>
              </button>
            </div>
          </div>

          {/* Navigation Bar */}
          <nav className="flex space-x-1 overflow-x-auto py-2 border-t border-slate-800/80 no-scrollbar text-sm">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition flex items-center space-x-2 ${
                activeTab === 'dashboard'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              <span>Market &amp; Allocation</span>
            </button>

            <button
              onClick={() => setActiveTab('allocation')}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition flex items-center space-x-2 ${
                activeTab === 'allocation'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <PieChartIcon className="h-4 w-4" />
              <span>Asset Allocation Tool</span>
            </button>

            <button
              onClick={() => setActiveTab('sectors')}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition flex items-center space-x-2 ${
                activeTab === 'sectors'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Layers className="h-4 w-4" />
              <span>Sector Analysis</span>
            </button>

            <button
              onClick={() => setActiveTab('watchlist')}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition flex items-center space-x-2 ${
                activeTab === 'watchlist'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Star className="h-4 w-4" />
              <span>Watchlist</span>
              {watchlist.length > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[11px] bg-slate-700 text-slate-200">
                  {watchlist.length}
                </span>
              )}
            </button>
          </nav>
        </div>
      </header>

      {/* Copy Toast Notification */}
      {copiedNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center space-x-3 transition transform animate-in fade-in duration-200">
          <Check className="h-5 w-5 text-emerald-400" />
          <span className="text-sm font-semibold">Portfolio recommendation copied to clipboard!</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. MAIN BODY CONTENT */}
      {/* ========================================================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 flex-1 w-full">
        {/* ========================================================= */}
        {/* 2.1 MARKET OVERVIEW (SETTRADE DATA CARDS) */}
        {/* ========================================================= */}
        <section aria-label="Market Overview">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 gap-2">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <Building2 className="h-5 w-5 text-blue-700" />
                <span>Thai Stock Market Overview</span>
                <span className="text-xs font-normal text-slate-500">(Real-time SETTRADE Data Feed)</span>
              </h2>
            </div>
            <div className="flex items-center space-x-2 text-xs text-slate-500">
              <span>Total Turnover:</span>
              <span className="font-semibold text-slate-900 font-mono">฿95,165.17 MB</span>
              <span className="hidden md:inline">· Foreign Net:</span>
              <span className="font-semibold text-emerald-600 font-mono hidden md:inline">+฿1,420.50 MB</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {indices.map((idx) => {
              const isPositive = idx.change >= 0;
              return (
                <div
                  key={idx.symbol}
                  className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-5 hover:shadow-md transition relative overflow-hidden"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xl font-black text-slate-900 tracking-tight">{idx.symbol}</span>
                        <span className="text-xs text-slate-500 font-medium truncate max-w-[150px]">{idx.name}</span>
                      </div>
                      <div className="mt-2 flex items-baseline space-x-3">
                        <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
                          {formatPoints(idx.points)}
                        </span>
                        <div
                          className={`flex items-center space-x-1 font-semibold text-sm ${
                            isPositive ? 'text-emerald-600' : 'text-rose-600'
                          }`}
                        >
                          {isPositive ? (
                            <ArrowUpRight className="h-4 w-4 stroke-[2.5]" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4 stroke-[2.5]" />
                          )}
                          <span>
                            {isPositive ? '+' : ''}
                            {idx.change.toFixed(2)} ({isPositive ? '+' : ''}
                            {idx.percentChange.toFixed(2)}%)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`h-9 w-9 rounded-lg flex items-center justify-center ${
                        isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                      }`}
                    >
                      {isPositive ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                    </div>
                  </div>

                  {/* Day High / Low range progress bar */}
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Low: {formatPoints(idx.low)}</span>
                      <span className="font-medium text-slate-700">Val: {idx.valueMB.toLocaleString()} MB</span>
                      <span>High: {formatPoints(idx.high)}</span>
                    </div>
                    {/* Visual range indicator */}
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isPositive ? 'bg-emerald-500' : 'bg-rose-500'
                        }`}
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(10, ((idx.points - idx.low) / (idx.high - idx.low || 1)) * 100)
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================= */}
        {/* CONDITIONAL TAB VIEWS */}
        {/* ========================================================= */}

        {/* VIEW 1: DASHBOARD (COMBINED OVERVIEW + ALLOCATION TOOL) */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT / CENTER: Core Asset Allocation Tool (7 Columns) */}
            <div className="lg:col-span-7 space-y-6">
              <RiskAllocationCard
                selectedRisk={selectedRisk}
                setSelectedRisk={setSelectedRisk}
                strategy={currentStrategy}
                capitalInput={capitalInput}
                setCapitalInput={setCapitalInput}
                onOpenQuestionnaire={() => setIsQuestionnaireOpen(true)}
                onCopyThesis={handleCopyThesis}
              />

              {/* Sector Money Flow preview on dashboard */}
              <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                      <BarChart3 className="h-4 w-4 text-blue-700" />
                      <span>Sector Performance &amp; Money Flow</span>
                    </h3>
                    <p className="text-xs text-slate-500">Daily % Change across major Thai industries</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('sectors')}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                  >
                    <span>Full Analysis</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={SECTOR_PERFORMANCE}
                      margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis
                        dataKey="sector"
                        tick={{ fontSize: 11, fill: '#64748B' }}
                        interval={0}
                        angle={-25}
                        textAnchor="end"
                      />
                      <YAxis
                        tick={{ fontSize: 11, fill: '#64748B' }}
                        tickFormatter={(v) => `${v}%`}
                      />
                      <RechartsTooltip
                        formatter={(val: any) => [`${Number(val).toFixed(2)}%`, 'Daily Change']}
                        labelFormatter={(label: any) => {
                          const item = SECTOR_PERFORMANCE.find((s) => s.sector === label);
                          return item ? `${item.fullName} (${label})` : label;
                        }}
                        contentStyle={{
                          backgroundColor: '#0F172A',
                          borderRadius: '8px',
                          border: 'none',
                          color: '#fff',
                          fontSize: '12px',
                        }}
                      />
                      <ReferenceLine y={0} stroke="#94A3B8" strokeWidth={1} />
                      <Bar
                        dataKey="percentChange"
                        radius={[4, 4, 0, 0]}
                      >
                        {SECTOR_PERFORMANCE.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.percentChange >= 0 ? '#10B981' : '#F43F5E'}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* RIGHT: Top Active Stocks / Market Movers (5 Columns) */}
            <div className="lg:col-span-5 space-y-6">
              <MarketMoversCard
                stocks={filteredStocks}
                moverFilter={moverFilter}
                setMoverFilter={setMoverFilter}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                watchlist={watchlist}
                toggleWatchlist={toggleWatchlist}
                onSelectStock={(s) => setInspectedStock(s)}
                flashSymbol={flashSymbol}
              />
            </div>
          </div>
        )}

        {/* VIEW 2: DEDICATED ASSET ALLOCATION TOOL */}
        {activeTab === 'allocation' && (
          <div className="space-y-6">
            <RiskAllocationCard
              selectedRisk={selectedRisk}
              setSelectedRisk={setSelectedRisk}
              strategy={currentStrategy}
              capitalInput={capitalInput}
              setCapitalInput={setCapitalInput}
              onOpenQuestionnaire={() => setIsQuestionnaireOpen(true)}
              onCopyThesis={handleCopyThesis}
              expandedView
            />
          </div>
        )}

        {/* VIEW 3: DEDICATED SECTOR ANALYSIS */}
        {activeTab === 'sectors' && (
          <div className="space-y-6">
            <SectorFullAnalysisView data={SECTOR_PERFORMANCE} />
          </div>
        )}

        {/* VIEW 4: WATCHLIST */}
        {activeTab === 'watchlist' && (
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                  <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                  <span>My Investment Watchlist</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Track key stocks earmarked for your personalized portfolio rebalancing.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('dashboard')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
              >
                <span>Browse More Stocks</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {watchlistStocks.length === 0 ? (
              <div className="text-center py-12 text-slate-400 space-y-2">
                <Star className="h-10 w-10 mx-auto text-slate-300 stroke-1" />
                <p className="text-sm font-medium">Your watchlist is currently empty.</p>
                <p className="text-xs">Click the star icon next to any stock symbol to track it here.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs text-slate-500 uppercase">
                      <th className="py-3 px-3">Symbol</th>
                      <th className="py-3 px-3">Company</th>
                      <th className="py-3 px-3 text-right">Price (THB)</th>
                      <th className="py-3 px-3 text-right">Change</th>
                      <th className="py-3 px-3 text-right">% Change</th>
                      <th className="py-3 px-3 text-right">P/E</th>
                      <th className="py-3 px-3 text-right">Div Yield</th>
                      <th className="py-3 px-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {watchlistStocks.map((stock) => {
                      const isPos = stock.change >= 0;
                      return (
                        <tr
                          key={stock.symbol}
                          onClick={() => setInspectedStock(stock)}
                          className="hover:bg-slate-50 cursor-pointer transition"
                        >
                          <td className="py-3 px-3 font-bold text-slate-900 font-sans flex items-center space-x-2">
                            <span>{stock.symbol}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                              {stock.sector}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-slate-600 text-xs font-sans max-w-[200px] truncate">
                            {stock.name}
                          </td>
                          <td className="py-3 px-3 text-right font-bold text-slate-900">
                            {stock.lastPrice.toFixed(2)}
                          </td>
                          <td className={`py-3 px-3 text-right font-semibold ${isPos ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {isPos ? '+' : ''}
                            {stock.change.toFixed(2)}
                          </td>
                          <td className={`py-3 px-3 text-right font-semibold ${isPos ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {isPos ? '+' : ''}
                            {stock.percentChange.toFixed(2)}%
                          </td>
                          <td className="py-3 px-3 text-right text-slate-600 text-xs">
                            {stock.pe}x
                          </td>
                          <td className="py-3 px-3 text-right text-emerald-600 text-xs font-semibold">
                            {stock.divYield}%
                          </td>
                          <td className="py-3 px-3 text-center font-sans">
                            <button
                              onClick={(e) => toggleWatchlist(stock.symbol, e)}
                              className="text-amber-500 hover:text-amber-600 p-1"
                              title="Remove from watchlist"
                            >
                              <Star className="h-4 w-4 fill-amber-500" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ========================================================= */}
      {/* 3. STOCK DEEP DIVE MODAL */}
      {/* ========================================================= */}
      {inspectedStock && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-black text-slate-900">{inspectedStock.symbol}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                    {inspectedStock.sector}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{inspectedStock.name}</p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleWatchlist(inspectedStock.symbol)}
                  className={`p-2 rounded-lg transition ${
                    watchlist.includes(inspectedStock.symbol)
                      ? 'text-amber-500 bg-amber-50'
                      : 'text-slate-400 hover:bg-slate-100'
                  }`}
                  title="Toggle Watchlist"
                >
                  <Star
                    className={`h-5 w-5 ${
                      watchlist.includes(inspectedStock.symbol) ? 'fill-amber-500' : ''
                    }`}
                  />
                </button>
                <button
                  onClick={() => setInspectedStock(null)}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Price & Change Banner */}
            <div className="bg-slate-50 rounded-xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 uppercase font-semibold">Last Traded Price</span>
                <div className="text-3xl font-extrabold text-slate-900 font-mono">
                  ฿{inspectedStock.lastPrice.toFixed(2)}
                </div>
              </div>
              <div
                className={`text-right ${
                  inspectedStock.change >= 0 ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                <div className="text-sm font-bold flex items-center justify-end space-x-1">
                  {inspectedStock.change >= 0 ? '+' : ''}
                  {inspectedStock.change.toFixed(2)}
                </div>
                <div className="text-xs font-semibold">
                  ({inspectedStock.change >= 0 ? '+' : ''}
                  {inspectedStock.percentChange.toFixed(2)}%)
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-600 leading-relaxed bg-blue-50/50 p-3 rounded-lg border border-blue-100">
              {inspectedStock.description}
            </p>

            {/* Valuation Multiples Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100">
                <span className="text-[11px] text-slate-400 block font-medium">P/E Ratio</span>
                <span className="text-sm font-bold text-slate-900 font-mono">{inspectedStock.pe}x</span>
              </div>
              <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100">
                <span className="text-[11px] text-slate-400 block font-medium">P/BV</span>
                <span className="text-sm font-bold text-slate-900 font-mono">{inspectedStock.pbv}x</span>
              </div>
              <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100">
                <span className="text-[11px] text-slate-400 block font-medium">Div Yield</span>
                <span className="text-sm font-bold text-emerald-600 font-mono">{inspectedStock.divYield}%</span>
              </div>
              <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100">
                <span className="text-[11px] text-slate-400 block font-medium">Market Cap</span>
                <span className="text-sm font-bold text-slate-900 font-mono">฿{inspectedStock.marketCapBillion}B</span>
              </div>
            </div>

            {/* 52-Week Range Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-500">
                <span>52W Low: ฿{inspectedStock.low52w.toFixed(2)}</span>
                <span className="font-semibold text-slate-700">52W Position</span>
                <span>52W High: ฿{inspectedStock.high52w.toFixed(2)}</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(
                        5,
                        ((inspectedStock.lastPrice - inspectedStock.low52w) /
                          (inspectedStock.high52w - inspectedStock.low52w || 1)) *
                          100
                      )
                    )}%`,
                  }}
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex items-center space-x-3">
              <button
                onClick={() => {
                  toggleWatchlist(inspectedStock.symbol);
                  setInspectedStock(null);
                }}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold border border-slate-300 text-slate-700 hover:bg-slate-50 transition"
              >
                {watchlist.includes(inspectedStock.symbol) ? 'Remove from Watchlist' : 'Add to Watchlist'}
              </button>
              <button
                onClick={() => setInspectedStock(null)}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. RISK PROFILER QUESTIONNAIRE MODAL */}
      {/* ========================================================= */}
      {isQuestionnaireOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-50 text-blue-700 rounded-lg">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Investor Risk Assessment</h3>
                  <p className="text-xs text-slate-500">Determine your ideal Thai asset allocation strategy</p>
                </div>
              </div>
              <button
                onClick={() => setIsQuestionnaireOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 text-sm">
              {/* Question 1 */}
              <div className="space-y-2">
                <label className="font-semibold text-slate-800 text-xs block">
                  1. What is your intended investment horizon for this capital?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { text: '< 2 Years', score: 1 },
                    { text: '3 – 5 Years', score: 2 },
                    { text: '5+ Years', score: 3 },
                  ].map((opt) => (
                    <button
                      key={opt.text}
                      type="button"
                      onClick={() => setQAnswers({ ...qAnswers, q1: opt.score })}
                      className={`py-2 px-3 text-xs rounded-lg border font-medium transition ${
                        qAnswers.q1 === opt.score
                          ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {opt.text}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 2 */}
              <div className="space-y-2">
                <label className="font-semibold text-slate-800 text-xs block">
                  2. If the stock market drops 15% in a single month, what is your immediate reaction?
                </label>
                <div className="space-y-2">
                  {[
                    { text: 'Panic and sell to prevent further capital loss (Low Tolerance)', score: 1 },
                    { text: 'Hold tight and wait for fundamental recovery (Moderate)', score: 2 },
                    { text: 'View it as a buying discount and allocate more capital (High)', score: 3 },
                  ].map((opt) => (
                    <button
                      key={opt.text}
                      type="button"
                      onClick={() => setQAnswers({ ...qAnswers, q2: opt.score })}
                      className={`w-full text-left py-2 px-3 text-xs rounded-lg border font-medium transition ${
                        qAnswers.q2 === opt.score
                          ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {opt.text}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 3 */}
              <div className="space-y-2">
                <label className="font-semibold text-slate-800 text-xs block">
                  3. What is your primary investment objective?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { text: 'Capital Preservation', score: 1 },
                    { text: 'Balanced Return', score: 2 },
                    { text: 'Max Growth', score: 3 },
                  ].map((opt) => (
                    <button
                      key={opt.text}
                      type="button"
                      onClick={() => setQAnswers({ ...qAnswers, q3: opt.score })}
                      className={`py-2 px-3 text-xs rounded-lg border font-medium transition ${
                        qAnswers.q3 === opt.score
                          ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {opt.text}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Calculated recommendation pill */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-600">Calculated Profile Score:</span>
              <span className="font-bold text-blue-700 uppercase">
                {qAnswers.q1 + qAnswers.q2 + qAnswers.q3 <= 4
                  ? 'Low Risk (Conservative)'
                  : qAnswers.q1 + qAnswers.q2 + qAnswers.q3 <= 7
                  ? 'Moderate Risk (Balanced)'
                  : 'High Risk (Aggressive Growth)'}
              </span>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setIsQuestionnaireOpen(false)}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCalculateRiskProfile}
                className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
              >
                Apply Recommended Strategy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. FOOTER */}
      {/* ========================================================= */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-8 mt-12 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <div className="h-6 w-6 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                F
              </div>
              <span className="font-bold text-white text-sm">Fukudu Invest</span>
              <span className="text-slate-600">|</span>
              <span>Thai Capital Market Analytics &amp; Asset Allocation</span>
            </div>
            <div className="flex items-center space-x-4 text-slate-400">
              <span>SETTRADE Model Data</span>
              <span>•</span>
              <span>SEC Thailand Aligned Framework</span>
              <span>•</span>
              <span>Recharts Engine</span>
            </div>
          </div>
          <div className="border-t border-slate-800/80 pt-4 text-[11px] text-slate-500 text-center md:text-left leading-relaxed">
            Disclaimer: Fukudu Invest provides algorithmic model portfolios and market analysis based on mock Thai
            stock exchange market feeds for research and educational purposes. Historical performance does not guarantee
            future investment returns. Investors should carefully assess risk tolerance and consult a certified financial
            planner prior to actual execution.
          </div>
        </div>
      </footer>
    </div>
  );
}

// =========================================================
// SUBCOMPONENT: RISK ASSESSMENT & ASSET ALLOCATION CARD
// =========================================================
interface RiskAllocationCardProps {
  selectedRisk: RiskLevel;
  setSelectedRisk: (lvl: RiskLevel) => void;
  strategy: PortfolioStrategy;
  capitalInput: number;
  setCapitalInput: (val: number) => void;
  onOpenQuestionnaire: () => void;
  onCopyThesis: () => void;
  expandedView?: boolean;
}

function RiskAllocationCard({
  selectedRisk,
  setSelectedRisk,
  strategy,
  capitalInput,
  setCapitalInput,
  onOpenQuestionnaire,
  onCopyThesis,
  expandedView = false,
}: RiskAllocationCardProps) {
  const [activeSegmentIndex, setActiveSegmentIndex] = useState<number | null>(null);

  // Capital presets
  const presets = [100000, 500000, 1000000, 3000000];

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-6 space-y-6">
      {/* Title & Risk Tolerance Selector Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <PieChartIcon className="h-5 w-5 text-blue-700" />
              <span>Risk Assessment &amp; Asset Allocation</span>
            </h3>
            <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
              Interactive
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Select your risk tolerance profile to dynamically adjust asset distributions.
          </p>
        </div>

        {/* Quick Profiler Button */}
        <button
          onClick={onOpenQuestionnaire}
          className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center space-x-1 self-start sm:self-auto"
        >
          <HelpCircle className="h-4 w-4" />
          <span>Need help finding your risk?</span>
        </button>
      </div>

      {/* 3-Level Risk Selector Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {(['low', 'moderate', 'high'] as RiskLevel[]).map((lvl) => {
          const item = STRATEGIES[lvl];
          const isSelected = selectedRisk === lvl;
          return (
            <button
              key={lvl}
              onClick={() => setSelectedRisk(lvl)}
              className={`p-3.5 rounded-xl border text-left transition relative flex flex-col justify-between ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/50 shadow-sm ring-2 ring-blue-500/20'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs uppercase font-extrabold tracking-wider ${
                      lvl === 'low'
                        ? 'text-blue-700'
                        : lvl === 'moderate'
                        ? 'text-teal-700'
                        : 'text-emerald-700'
                    }`}
                  >
                    {lvl} Risk
                  </span>
                  {isSelected && (
                    <span className="h-2 w-2 rounded-full bg-blue-600 ring-4 ring-blue-100" />
                  )}
                </div>
                <div className="text-sm font-bold text-slate-900 mt-1">{item.title}</div>
                <div className="text-xs text-slate-500 mt-0.5">{item.subtitle}</div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Target Return:</span>
                <span className="font-bold text-slate-800">{item.expectedAnnualReturn}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Interactive Donut Chart & Allocation Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Recharts Donut Chart */}
        <div className="md:col-span-6 flex flex-col items-center justify-center relative min-h-[260px]">
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={strategy.allocations}
                  dataKey="percentage"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={100}
                  paddingAngle={3}
                  onMouseEnter={(_, index) => setActiveSegmentIndex(index)}
                  onMouseLeave={() => setActiveSegmentIndex(null)}
                >
                  {strategy.allocations.map((entry, index) => (
                    <Cell
                      key={`slice-${index}`}
                      fill={entry.color}
                      stroke="#fff"
                      strokeWidth={2}
                      className="cursor-pointer transition-transform duration-200 hover:opacity-90"
                    />
                  ))}
                </Pie>
                <RechartsTooltip
                  formatter={(val: any, name: any) => [`${val}%`, name]}
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderRadius: '8px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Centered Donut Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Annual Return
            </span>
            <span className="text-xl font-extrabold text-slate-900 font-mono">
              {strategy.expectedAnnualReturn}
            </span>
            <span className="text-[10px] text-slate-500 font-medium capitalize">
              {strategy.volatilityRating} Volatility
            </span>
          </div>
        </div>

        {/* Breakdown List with Calculations */}
        <div className="md:col-span-6 space-y-2.5">
          {strategy.allocations.map((alloc, idx) => {
            const isHovered = activeSegmentIndex === idx;
            const sliceBaht = (capitalInput * alloc.percentage) / 100;
            return (
              <div
                key={alloc.name}
                onMouseEnter={() => setActiveSegmentIndex(idx)}
                onMouseLeave={() => setActiveSegmentIndex(null)}
                className={`p-2.5 rounded-lg border transition ${
                  isHovered
                    ? 'border-blue-400 bg-blue-50/60 shadow-xs'
                    : 'border-slate-100 hover:border-slate-200 bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span
                      className="h-3 w-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: alloc.color }}
                    />
                    <span className="text-xs font-bold text-slate-800">{alloc.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-slate-900 font-mono">
                      {alloc.percentage}%
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono ml-2">
                      (฿{sliceBaht.toLocaleString('en-US', { maximumFractionDigits: 0 })})
                    </span>
                  </div>
                </div>

                <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="truncate max-w-[210px] text-slate-600 font-medium">
                    {alloc.thaiInstrument}
                  </span>
                  <span className="text-emerald-700 font-medium">{alloc.expectedYield}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Capital Allocation Calculator Input */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
            <Wallet className="h-4 w-4 text-blue-700" />
            <span>Investment Capital Simulator (THB)</span>
          </label>
          {/* Quick presets */}
          <div className="flex items-center space-x-1.5 overflow-x-auto">
            {presets.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setCapitalInput(amt)}
                className={`px-2 py-1 text-[11px] rounded font-semibold border transition ${
                  capitalInput === amt
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                ฿{(amt / 1000).toLocaleString()}k
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-bold text-sm">
            ฿
          </span>
          <input
            type="number"
            value={capitalInput}
            onChange={(e) => setCapitalInput(Math.max(0, Number(e.target.value)))}
            step="10000"
            className="w-full pl-8 pr-4 py-2 bg-white rounded-lg border border-slate-300 text-slate-900 font-mono font-bold text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="500,000"
          />
        </div>
      </div>

      {/* Recommendation Thesis & Rationale */}
      <div className="bg-slate-900 text-white rounded-xl p-5 space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">
              Institutional Investment Thesis
            </span>
            <h4 className="text-base font-extrabold text-white">Why this allocation fits your profile</h4>
          </div>

          <button
            onClick={onCopyThesis}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            title="Copy recommendation summary"
          >
            <Copy className="h-3.5 w-3.5" />
            <span>Copy Plan</span>
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed font-normal">{strategy.thesis}</p>

        {/* Key Strategy Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800 text-xs">
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Rebalancing</span>
            <span className="font-semibold text-slate-100">{strategy.recommendedRebalance}</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Recommended Horizon</span>
            <span className="font-semibold text-slate-100">{strategy.timeHorizon}</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Targeted Return</span>
            <span className="font-semibold text-emerald-400 font-mono">{strategy.expectedAnnualReturn}</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Sample Core Assets</span>
            <span className="font-semibold text-slate-100 truncate block">
              {strategy.sampleTickers.join(', ')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// =========================================================
// SUBCOMPONENT: TOP ACTIVE STOCKS / MARKET MOVERS CARD
// =========================================================
interface MarketMoversCardProps {
  stocks: StockMover[];
  moverFilter: 'active' | 'gainers' | 'losers';
  setMoverFilter: (f: 'active' | 'gainers' | 'losers') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  watchlist: string[];
  toggleWatchlist: (sym: string, e?: React.MouseEvent) => void;
  onSelectStock: (s: StockMover) => void;
  flashSymbol: string | null;
}

function MarketMoversCard({
  stocks,
  moverFilter,
  setMoverFilter,
  searchQuery,
  setSearchQuery,
  watchlist,
  toggleWatchlist,
  onSelectStock,
  flashSymbol,
}: MarketMoversCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <Activity className="h-4 w-4 text-blue-700" />
            <span>Market Movers (SET)</span>
          </h3>
          <p className="text-xs text-slate-500">SETTRADE top active and price momentum</p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg text-xs">
          <button
            onClick={() => setMoverFilter('active')}
            className={`px-2.5 py-1 rounded-md font-semibold transition ${
              moverFilter === 'active'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Most Active
          </button>
          <button
            onClick={() => setMoverFilter('gainers')}
            className={`px-2.5 py-1 rounded-md font-semibold transition ${
              moverFilter === 'gainers'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-emerald-600'
            }`}
          >
            Top Gainers
          </button>
          <button
            onClick={() => setMoverFilter('losers')}
            className={`px-2.5 py-1 rounded-md font-semibold transition ${
              moverFilter === 'losers'
                ? 'bg-white text-rose-700 shadow-xs'
                : 'text-slate-600 hover:text-rose-600'
            }`}
          >
            Top Losers
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by Symbol (e.g. DELTA, PTT, KBANK)..."
          className="w-full pl-9 pr-4 py-2 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto -mx-2 sm:mx-0">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-semibold">
              <th className="py-2.5 px-2">Symbol</th>
              <th className="py-2.5 px-2 text-right">Price</th>
              <th className="py-2.5 px-2 text-right">Change</th>
              <th className="py-2.5 px-2 text-right">% Chg</th>
              <th className="py-2.5 px-2 text-right">Value (MB)</th>
              <th className="py-2.5 px-1 text-center"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono">
            {stocks.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400 font-sans">
                  No stocks match &quot;{searchQuery}&quot;
                </td>
              </tr>
            ) : (
              stocks.map((stock) => {
                const isPos = stock.change >= 0;
                const isFlashing = flashSymbol === stock.symbol;
                const isWatched = watchlist.includes(stock.symbol);

                return (
                  <tr
                    key={stock.symbol}
                    onClick={() => onSelectStock(stock)}
                    className={`cursor-pointer transition-colors ${
                      isFlashing
                        ? isPos
                          ? 'bg-emerald-100/70'
                          : 'bg-rose-100/70'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    {/* Symbol */}
                    <td className="py-3 px-2 font-sans">
                      <div className="font-extrabold text-slate-900 text-xs">{stock.symbol}</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[90px]">
                        {stock.sector}
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-2 text-right font-bold text-slate-900">
                      {stock.lastPrice.toFixed(2)}
                    </td>

                    {/* Change */}
                    <td
                      className={`py-3 px-2 text-right font-bold ${
                        isPos ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {isPos ? '+' : ''}
                      {stock.change.toFixed(2)}
                    </td>

                    {/* % Change */}
                    <td
                      className={`py-3 px-2 text-right font-bold ${
                        isPos ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {isPos ? '+' : ''}
                      {stock.percentChange.toFixed(2)}%
                    </td>

                    {/* Value MB */}
                    <td className="py-3 px-2 text-right text-slate-600 font-medium">
                      {stock.valueMB.toLocaleString('en-US', { maximumFractionDigits: 1 })}
                    </td>

                    {/* Watchlist toggle */}
                    <td className="py-3 px-1 text-center font-sans">
                      <button
                        onClick={(e) => toggleWatchlist(stock.symbol, e)}
                        className={`p-1 rounded hover:bg-slate-100 ${
                          isWatched ? 'text-amber-500' : 'text-slate-300 hover:text-slate-400'
                        }`}
                        title={isWatched ? 'Remove from Watchlist' : 'Add to Watchlist'}
                      >
                        <Star className={`h-3.5 w-3.5 ${isWatched ? 'fill-amber-500' : ''}`} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="pt-2 text-[11px] text-slate-400 text-center flex items-center justify-center space-x-1">
        <span>Click any row for deep-dive valuation metrics &amp; 52W range</span>
      </div>
    </div>
  );
}

// =========================================================
// SUBCOMPONENT: FULL SECTOR ANALYSIS VIEW
// =========================================================
interface SectorFullAnalysisViewProps {
  data: SectorData[];
}

function SectorFullAnalysisView({ data }: SectorFullAnalysisViewProps) {
  const sorted = [...data].sort((a, b) => b.percentChange - a.percentChange);
  const bestSector = sorted[0];
  const worstSector = sorted[sorted.length - 1];

  return (
    <div className="space-y-6">
      {/* Top Banner Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-5">
          <span className="text-xs font-bold text-slate-400 uppercase">Top Performing Sector</span>
          <div className="text-xl font-black text-slate-900 mt-1">{bestSector.fullName}</div>
          <div className="text-sm font-bold text-emerald-600 mt-0.5">
            +{bestSector.percentChange.toFixed(2)}% Today
          </div>
          <p className="text-xs text-slate-500 mt-2">Driven by: {bestSector.leaders}</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-5">
          <span className="text-xs font-bold text-slate-400 uppercase">Lagging Sector</span>
          <div className="text-xl font-black text-slate-900 mt-1">{worstSector.fullName}</div>
          <div className="text-sm font-bold text-rose-600 mt-0.5">
            {worstSector.percentChange.toFixed(2)}% Today
          </div>
          <p className="text-xs text-slate-500 mt-2">Key constituents: {worstSector.leaders}</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-5">
          <span className="text-xs font-bold text-slate-400 uppercase">Sector Capital Rotation</span>
          <div className="text-xl font-black text-blue-700 mt-1">Tech &amp; Energy Outflow</div>
          <div className="text-xs text-slate-600 mt-1 leading-relaxed">
            Capital is heavily rotating into export electronics and dividend banking, supporting the SET Index at 1,460+ support level.
          </div>
        </div>
      </div>

      {/* Main Bar Chart */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-6 space-y-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Thai Industry Sector Performance (% Change)</h3>
          <p className="text-xs text-slate-500">SET Industry Group Indices compared to previous market close</p>
        </div>

        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sorted}
              margin={{ top: 20, right: 30, left: 10, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis
                dataKey="sector"
                tick={{ fontSize: 12, fill: '#475569', fontWeight: 600 }}
                interval={0}
                angle={-30}
                textAnchor="end"
              />
              <YAxis
                tick={{ fontSize: 12, fill: '#64748B' }}
                tickFormatter={(v) => `${v}%`}
              />
              <RechartsTooltip
                formatter={(val: any) => [`${Number(val).toFixed(2)}%`, 'Daily Change']}
                labelFormatter={(label: any) => {
                  const item = sorted.find((s) => s.sector === label);
                  return item ? `${item.fullName} (${label})` : label;
                }}
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderRadius: '8px',
                  border: 'none',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <ReferenceLine y={0} stroke="#94A3B8" strokeWidth={1.5} />
              <Bar
                dataKey="percentChange"
                radius={[6, 6, 0, 0]}
              >
                {sorted.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.percentChange >= 0 ? '#10B981' : '#F43F5E'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sector Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-6 space-y-3">
        <h4 className="text-sm font-bold text-slate-900">Sector Flow Breakdown</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase font-semibold">
                <th className="py-2.5 px-3">Sector Code</th>
                <th className="py-2.5 px-3">Industry Name</th>
                <th className="py-2.5 px-3 text-right">Points</th>
                <th className="py-2.5 px-3 text-right">% Change</th>
                <th className="py-2.5 px-3 text-right">Turnover (MB)</th>
                <th className="py-2.5 px-3">Leading Stocks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {sorted.map((s) => {
                const isPos = s.percentChange >= 0;
                return (
                  <tr key={s.sector} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-3 font-bold text-slate-900 font-sans">{s.sector}</td>
                    <td className="py-3 px-3 font-sans text-slate-700">{s.fullName}</td>
                    <td className="py-3 px-3 text-right text-slate-700">{s.points.toFixed(1)}</td>
                    <td className={`py-3 px-3 text-right font-bold ${isPos ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {isPos ? '+' : ''}
                      {s.percentChange.toFixed(2)}%
                    </td>
                    <td className="py-3 px-3 text-right text-slate-700">
                      ฿{s.valueMB.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 font-sans text-slate-500">{s.leaders}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
