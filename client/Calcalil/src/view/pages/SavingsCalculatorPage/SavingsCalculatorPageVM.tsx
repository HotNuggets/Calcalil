import { useState } from "react";

export type CalcType = "oneTime" | "monthly";

export type MonthlyRow = {
  month: number;
  depositedTotal: number;
  interestEarned: number;
  balance: number;
};

export type SavingsResult = {
  finalAmount: number;
  totalDeposited: number;
  earnedNet: number;
  earnedGross: number;
  taxPaid: number;
  feesPaid: number;
  schedule: MonthlyRow[];
  
  // Computed metrics
  netReturn: number;         // Net return percentage
  effectiveRate: number;     // Effective annual rate after fees/tax
  monthlyGrowth: number;     // Average monthly growth
};

export interface SavingsCalculatorPageVM {
  calcType: CalcType;
  setCalcType: (type: CalcType) => void;

  // Input values
  deposit: number | null;
  setDeposit: (v: number | null) => void;
  monthlyDeposit: number | null;
  setMonthlyDeposit: (v: number | null) => void;
  interest: number | null;
  setInterest: (v: number | null) => void;
  years: number | null;
  setYears: (v: number | null) => void;
  tax: number | null;
  setTax: (v: number | null) => void;
  depositFee: number | null;
  setDepositFee: (v: number | null) => void;
  accumulationFee: number | null;
  setAccumulationFee: (v: number | null) => void;

  // Actions
  calculate: () => void;
  reset: () => void;

  // Result
  result: SavingsResult | null;
}

export function useSavingsCalculatorPageVM(): SavingsCalculatorPageVM {
  const [calcType, setCalcType] = useState<CalcType>("oneTime");

  const [deposit, setDeposit] = useState<number | null>(10000);
  const [monthlyDeposit, setMonthlyDeposit] = useState<number | null>(1000);

  const [interest, setInterest] = useState<number | null>(5);
  const [years, setYears] = useState<number | null>(10);
  const [tax, setTax] = useState<number | null>(25);

  const [depositFee, setDepositFee] = useState<number | null>(0);
  const [accumulationFee, setAccumulationFee] = useState<number | null>(0.5);
  
  const [result, setResult] = useState<SavingsResult | null>(null);
 

  function calculate() {
    const yrs = Number(years || 0);
    if (yrs <= 0 || yrs > 100) {
      alert("נא להזין מספר שנים בין 1 ל-100");
      return;
    }

    const annualRate = Number(interest || 0) / 100;
    const monthlyRate = annualRate / 12;
    const totalMonths = yrs * 12;

    const depositFeeRate = Number(depositFee || 0) / 100;
    const accumulationFeeRate = Number(accumulationFee || 0) / 100;
    const taxRate = Number(tax || 0) / 100;

    let balance = 0;
    let totalDeposited = 0;
    let feesPaid = 0;

    const schedule: MonthlyRow[] = [];

    // ── Initial deposit (for both modes) ──
    const initial = Number(deposit || 0);
    if (initial > 0) {
      const fee = initial * depositFeeRate;
      balance = initial - fee;
      totalDeposited += initial;
      feesPaid += fee;
    }

    // ── Monthly loop ──
    for (let m = 1; m <= totalMonths; m++) {
      // Add monthly deposit
      if (calcType === "monthly" && monthlyDeposit && monthlyDeposit > 0) {
        const fee = monthlyDeposit * depositFeeRate;
        balance += monthlyDeposit - fee;
        totalDeposited += monthlyDeposit;
        feesPaid += fee;
      }

      // Apply monthly interest
      const interestEarned = balance * monthlyRate;
      balance += interestEarned;

      // Apply annual accumulation fee (once per year)
      if (m % 12 === 0 && accumulationFeeRate > 0) {
        const yearlyFee = balance * accumulationFeeRate;
        balance -= yearlyFee;
        feesPaid += yearlyFee;
      }

      schedule.push({
        month: m,
        depositedTotal: totalDeposited,
        interestEarned,
        balance,
      });
    }

    const earnedGross = balance - totalDeposited;
    const taxPaid = Math.max(0, earnedGross) * taxRate;
    const finalAmount = balance - taxPaid;
    const earnedNet = earnedGross - taxPaid;

    // ── Computed metrics ──
    const netReturn = totalDeposited > 0 
      ? (earnedNet / totalDeposited) * 100 
      : 0;

    const effectiveRate = totalDeposited > 0
      ? (Math.pow(finalAmount / totalDeposited, 1 / yrs) - 1) * 100
      : 0;

    const monthlyGrowth = schedule.length > 0
      ? schedule.reduce((sum, row) => sum + row.interestEarned, 0) / schedule.length
      : 0;

    setResult({
      finalAmount,
      totalDeposited,
      earnedGross,
      earnedNet,
      taxPaid,
      feesPaid,
      schedule,
      netReturn,
      effectiveRate,
      monthlyGrowth,
    });
  }

  function reset() {
    setDeposit(calcType === "oneTime" ? 10000 : 0);
    setMonthlyDeposit(1000);
    setInterest(5);
    setYears(10);
    setTax(25);
    setDepositFee(0);
    setAccumulationFee(0.5);
    setResult(null);
  }

  return {
    calcType,
    setCalcType,
    deposit,
    setDeposit,
    monthlyDeposit,
    setMonthlyDeposit,
    interest,
    setInterest,
    years,
    setYears,
    tax,
    setTax,
    depositFee,
    setDepositFee,
    accumulationFee,
    setAccumulationFee,
    result,
    calculate,
    reset,
    
  };
}
