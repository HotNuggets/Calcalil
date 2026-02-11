import { useState } from "react";

export type SavingsResult = {
  finalAmount: number;
  totalDeposited: number;
  earnedNet: number;
  earnedGross: number;
  taxPaid: number;
  feesPaid: number;
};

export function useSavingsCalculatorPageVM() {
  const [calcType, setCalcType] = useState<"oneTime" | "monthly">("oneTime");

  const [deposit, setDeposit] = useState<number | null>(null);
  const [monthlyDeposit, setMonthlyDeposit] = useState<number | null>(null);

  const [interest, setInterest] = useState<number | null>(null);
  const [years, setYears] = useState<number | null>(null);

  const [tax, setTax] = useState<number | null>(0);

  // ✅ NEW FEES
  const [depositFee, setDepositFee] = useState<number | null>(0);       // %
  const [accumulationFee, setAccumulationFee] = useState<number | null>(0); // %

  const [result, setResult] = useState<SavingsResult | null>(null);

  function calculate() {
    const yrs = Math.max(0, Number(years || 0));
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

    if (calcType === "oneTime") {
      const P = Number(deposit || 0);
      if (P <= 0) return;

      const feeFromDeposit = P * depositFeeRate;
      const netDeposit = P - feeFromDeposit;

      balance = netDeposit;
      totalDeposited = P;
      feesPaid += feeFromDeposit;

      for (let m = 1; m <= totalMonths; m++) {
        balance *= 1 + monthlyRate;

        if (m % 12 === 0 && accumulationFeeRate > 0) {
          const yearlyFee = balance * accumulationFeeRate;
          balance -= yearlyFee;
          feesPaid += yearlyFee;
        }
      }
    }

    if (calcType === "monthly") {
  const initialDeposit = Number(deposit || 0); // initial capital
  const PMT = Number(monthlyDeposit || 0);

  if (initialDeposit <= 0 && PMT <= 0) {
    setResult(null);
    return;
  }

  // ---- Initial Deposit ----
  if (initialDeposit > 0) {
    const feeFromInitial = initialDeposit * depositFeeRate;
    const netInitial = initialDeposit - feeFromInitial;

    balance = netInitial;
    totalDeposited += initialDeposit;
    feesPaid += feeFromInitial;
  }

  // ---- Monthly Deposits ----
  for (let m = 1; m <= totalMonths; m++) {
    if (PMT > 0) {
      const feeFromDeposit = PMT * depositFeeRate;
      const netDeposit = PMT - feeFromDeposit;

      balance += netDeposit;
      totalDeposited += PMT;
      feesPaid += feeFromDeposit;
    }

    balance *= 1 + monthlyRate;

    if (m % 12 === 0 && accumulationFeeRate > 0) {
      const yearlyFee = balance * accumulationFeeRate;
      balance -= yearlyFee;
      feesPaid += yearlyFee;
    }
  }
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
