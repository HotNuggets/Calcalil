import { useState } from "react";

export function useLoanCalculatorVM() {
  const [selectedOption, setSelectedOption] = useState<"monthly" | "loan" | null>(null);
  const [loanOption, setLoanOption] = useState<"spizer" | "keren" | null>(null);

  const [loanAmount, setLoanAmount] = useState<number | null>(null);
  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);
  const [months, setMonths] = useState<number | null>(null);
  const [interest, setInterest] = useState<number | null>(null);

  const [result, setResult] = useState<any>(null);

  const isClicked = selectedOption !== null;

  const chooseCalculationType = (option: "monthly" | "loan") => {
    setSelectedOption(option);
    setResult(null); 
  };

  const chooseRepaymentMethod = (method: "spizer" | "keren") => {
    setLoanOption(method);
    setResult(null);
  };

  const calculate = () => {
    if (!months || !interest) return;

    const r = interest / 100 / 12; 
    const n = months;

    if (loanOption === "spizer") {
     
      if (selectedOption === "monthly" && loanAmount) {
        const M = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        setMonthlyPayment(M);
        setResult({ type: "monthly", value: M });
      }

      if (selectedOption === "loan" && monthlyPayment) {
        const P = (monthlyPayment * (Math.pow(1 + r, n) - 1)) / (r * Math.pow(1 + r, n));
        setLoanAmount(P);
        setResult({ type: "loan", value: P });
      }
    }

    if (loanOption === "keren") {

      if (loanAmount) {
        const principalPortion = loanAmount / n;

        const firstPayment = principalPortion + loanAmount * r;
        const lastPayment = principalPortion + principalPortion * r; 
        const avgPayment = (firstPayment + lastPayment) / 2;

        setResult({
          type: "keren",
          first: firstPayment,
          last: lastPayment,
          avg: avgPayment,
        });
      }
    }
  };

  return {
    isClicked,
    selectedOption,
    loanOption,
    chooseCalculationType,
    chooseRepaymentMethod,
    loanAmount,
    setLoanAmount,
    monthlyPayment,
    setMonthlyPayment,
    months,
    setMonths,
    interest,
    setInterest,
    calculate,
    result,
  };
}