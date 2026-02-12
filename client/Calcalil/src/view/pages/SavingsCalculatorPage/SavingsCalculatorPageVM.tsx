import { useState } from "react";

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
};

export function useSavingsCalculatorPageVM() {
  const [calcType, setCalcType] = useState<"oneTime" | "monthly">("oneTime");

  const [deposit, setDeposit] = useState<number | null>(null);
  const [monthlyDeposit, setMonthlyDeposit] = useState<number | null>(null);

  const [interest, setInterest] = useState<number | null>(null);
  const [years, setYears] = useState<number | null>(null);
  const [tax, setTax] = useState<number | null>(0);

  const [depositFee, setDepositFee] = useState<number | null>(0);
  const [accumulationFee, setAccumulationFee] = useState<number | null>(0);

  const [result, setResult] = useState<SavingsResult | null>(null);

  function calculate() {
    const yrs = Number(years || 0);
    if (yrs <= 0) {
      setResult(null);
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

    // ---- Initial deposit (for both modes) ----
    const initial = Number(deposit || 0);
    if (initial > 0) {
      const fee = initial * depositFeeRate;
      balance = initial - fee;
      totalDeposited += initial;
      feesPaid += fee;
    }

    // ---- Monthly loop ----
    for (let m = 1; m <= totalMonths; m++) {
      if (calcType === "monthly" && monthlyDeposit && monthlyDeposit > 0) {
        const fee = monthlyDeposit * depositFeeRate;
        balance += monthlyDeposit - fee;
        totalDeposited += monthlyDeposit;
        feesPaid += fee;
      }

      const interestEarned = balance * monthlyRate;
      balance += interestEarned;

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

    setResult({
      finalAmount,
      totalDeposited,
      earnedGross,
      earnedNet,
      taxPaid,
      feesPaid,
      schedule,
    });
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
  };
}
