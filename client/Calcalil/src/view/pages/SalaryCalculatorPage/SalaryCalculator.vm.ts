import { useState, useMemo } from 'react';

// ─── Constants ────────────────────────────────────────────────────────────────

export const CURRENCIES = ['₪', '$', '€', '£', '¥'] as const;
export type Currency = (typeof CURRENCIES)[number];

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SalarySnapshot {
  base: number;
  bonus: number;
  total: number;
}

export interface ProjectionRow extends SalarySnapshot {
  year: number;
}

export interface BreakdownItem {
  label: string;
  value: string;
  sub: string;
  color: string;
}

// ─── Pure formatting helpers ──────────────────────────────────────────────────

export function fmt(n: number, currency: Currency = '₪'): string {
  return (
    n.toLocaleString('he-IL', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) +
    ' ' +
    currency
  );
}

export function fmtDelta(n: number, currency: Currency = '₪'): string {
  const sign = n >= 0 ? '+' : '-';
  return (
    sign +
    Math.abs(n).toLocaleString('he-IL', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) +
    ' ' +
    currency
  );
}

// ─── Pure calculation functions ───────────────────────────────────────────────

/**
 * Calculates the salary snapshot at a specific future year,
 * applying compound raises where each raise is split between base and bonus.
 */
export function calcAtYear(
  base: number,
  bonus: number,
  raisePercent: number,
  bonusSplit: number,
  targetYear: number
): SalarySnapshot {
  let b = base;
  let bon = bonus;

  for (let y = 0; y < targetYear; y++) {
    const raiseAmount = b * (raisePercent / 100);
    const bonusIncrease = raiseAmount * (bonusSplit / 100);
    b = b + raiseAmount - bonusIncrease;
    bon = bon + bonusIncrease;
  }

  return { base: b, bonus: bon, total: b + bon };
}

/**
 * Builds the full year-by-year projection array from year 0 to `years`.
 */
export function buildProjection(
  base: number,
  bonus: number,
  raisePercent: number,
  bonusSplit: number,
  years: number
): ProjectionRow[] {
  let b = base;
  let bon = bonus;
  const rows: ProjectionRow[] = [];

  for (let y = 0; y <= years; y++) {
    rows.push({ year: y, base: b, bonus: bon, total: b + bon });
    if (y < years) {
      const ra = b * (raisePercent / 100);
      const bi = ra * (bonusSplit / 100);
      b = b + ra - bi;
      bon = bon + bi;
    }
  }

  return rows;
}

/**
 * Builds the 6 breakdown items shown in the "Year 1 split" section.
 */
export function buildBreakdownItems(
  base: number,
  bonus: number,
  raisePercent: number,
  bonusSplit: number,
  currency: Currency
): BreakdownItem[] {
  const ra = base * (raisePercent / 100);
  const bi = ra * (bonusSplit / 100);
  const bai = ra - bi;

  return [
    { label: 'סך ההעלאה',     value: fmt(ra, currency),              sub: `${raisePercent}% מהבסיס`,       color: '#4F46E5' },
    { label: '→ נוסף לבסיס',  value: fmt(bai, currency),             sub: `${100 - bonusSplit}% מההעלאה`,  color: '#0EA5E9' },
    { label: '→ נוסף לבונוס', value: fmt(bi, currency),              sub: `${bonusSplit}% מההעלאה`,        color: '#7C3AED' },
    { label: 'בסיס חדש',       value: fmt(base + bai, currency),     sub: 'שנה 1',                          color: '#0EA5E9' },
    { label: 'בונוס חדש',      value: fmt(bonus + bi, currency),     sub: 'שנה 1',                          color: '#7C3AED' },
    { label: 'סך חדש',         value: fmt(base + bai + bonus + bi, currency), sub: 'שנה 1',                color: '#4F46E5' },
  ];
}

// ─── ViewModel hook ───────────────────────────────────────────────────────────

export interface SalaryCalculatorVM {
  // State
  base: number;
  bonus: number;
  raisePercent: number;
  bonusSplit: number;
  years: number;
  currency: Currency;
  lookupYear: number;
  lookupInput: string;

  // Setters
  setBase: (v: number) => void;
  setBonus: (v: number) => void;
  setRaisePercent: (v: number) => void;
  setBonusSplit: (v: number) => void;
  setYears: (v: number) => void;
  setCurrency: (v: Currency) => void;
  handleLookupChange: (v: string) => void;
  stepLookupYear: (delta: 1 | -1) => void;

  // Derived values
  total: number;
  projection: ProjectionRow[];
  finalYear: ProjectionRow;
  totalGain: number;
  maxTotal: number;
  breakdownItems: BreakdownItem[];
  lookupResult: SalarySnapshot;
  lookupGain: number;
  lookupGainPct: string;
}

export function useSalaryCalculatorVM(): SalaryCalculatorVM {
  const [base, setBase] = useState<number>(8000);
  const [bonus, setBonus] = useState<number>(2000);
  const [raisePercent, setRaisePercent] = useState<number>(10);
  const [bonusSplit, setBonusSplit] = useState<number>(20);
  const [years, setYears] = useState<number>(5);
  const [currency, setCurrency] = useState<Currency>('₪');
  const [lookupYear, setLookupYear] = useState<number>(10);
  const [lookupInput, setLookupInput] = useState<string>('10');

  const total = base + bonus;

  const projection = useMemo(
    () => buildProjection(base, bonus, raisePercent, bonusSplit, years),
    [base, bonus, raisePercent, bonusSplit, years]
  );

  const finalYear = projection[projection.length - 1];
  const totalGain = finalYear.total - total;
  const maxTotal = Math.max(...projection.map((r) => r.total));

  const breakdownItems = useMemo(
    () => buildBreakdownItems(base, bonus, raisePercent, bonusSplit, currency),
    [base, bonus, raisePercent, bonusSplit, currency]
  );

  const lookupResult = useMemo(
    () => calcAtYear(base, bonus, raisePercent, bonusSplit, lookupYear),
    [base, bonus, raisePercent, bonusSplit, lookupYear]
  );

  const lookupGain = lookupResult.total - total;
  const lookupGainPct = ((lookupGain / total) * 100).toFixed(1);

  const handleLookupChange = (v: string): void => {
    setLookupInput(v);
    const n = parseInt(v, 10);
    if (!isNaN(n) && n >= 1 && n <= 100) setLookupYear(n);
  };

  const stepLookupYear = (delta: 1 | -1): void => {
    const n = Math.min(100, Math.max(1, lookupYear + delta));
    setLookupYear(n);
    setLookupInput(String(n));
  };

  return {
    base, bonus, raisePercent, bonusSplit, years, currency,
    lookupYear, lookupInput,
    setBase, setBonus, setRaisePercent, setBonusSplit, setYears, setCurrency,
    handleLookupChange, stepLookupYear,
    total, projection, finalYear, totalGain, maxTotal,
    breakdownItems, lookupResult, lookupGain, lookupGainPct,
  };
}
