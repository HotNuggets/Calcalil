import  { useState } from "react";
import styles from "./SavingsCalculatorPage.module.scss";

const SavingsCalculatorPage = () => {
  const [mode, setMode] = useState<"oneTime" | "monthly">("oneTime");
  const [deposit, setDeposit] = useState<number | null>(null);
  const [monthlyDeposit, setMonthlyDeposit] = useState<number | null>(null);
  const [years, setYears] = useState<number | null>(null);
  const [interest, setInterest] = useState<number | null>(null);
  const [tax, setTax] = useState<number | null>(0);
  const [fee, setFee] = useState<number | null>(0);
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const yrs = Number(years || 0);
    const annualRate = Number(interest || 0) / 100;
    const monthlyRate = annualRate / 12;
    const totalMonths = yrs * 12;
    const feeRate = Number(fee || 0) / 100; // yearly %
    const taxRate = Number(tax || 0) / 100;

    if (yrs <= 0 || (!deposit && !monthlyDeposit)) {
      setResult(null);
      return;
    }

    let balance = 0;
    let totalDeposited = 0;
    let feesPaid = 0;

    if (mode === "oneTime" && deposit) {
      balance = deposit;
      totalDeposited = deposit;

      for (let m = 1; m <= totalMonths; m++) {
        balance *= 1 + monthlyRate;

        // yearly management fee
        if (m % 12 === 0 && feeRate > 0) {
          const yearlyFee = balance * feeRate;
          balance -= yearlyFee;
          feesPaid += yearlyFee;
        }
      }
    }

    if (mode === "monthly" && monthlyDeposit) {
      for (let m = 1; m <= totalMonths; m++) {
        balance += monthlyDeposit;
        totalDeposited += monthlyDeposit;

        balance *= 1 + monthlyRate;

        if (m % 12 === 0 && feeRate > 0) {
          const yearlyFee = balance * feeRate;
          balance -= yearlyFee;
          feesPaid += yearlyFee;
        }
      }
    }

    const earnedBeforeTax = balance - totalDeposited;
    const taxPaid = earnedBeforeTax * taxRate;
    const finalAmount = balance - taxPaid;
    const earned = earnedBeforeTax - taxPaid;

    setResult({
      totalSaved: finalAmount,
      totalDeposited,
      earned,
      taxPaid,
      feesPaid,
    });
  };

  return (
    <div className={styles.calculator}>
      <div className={styles.parameters}>
        <span className={styles.parameter}>בחר סוג חיסכון:</span>
        <button
          className={`${styles.option} ${mode === "oneTime" ? styles.active : ""}`}
          onClick={() => setMode("oneTime")}
        >
          הפקדה חד פעמית
        </button>
        <button
          className={`${styles.option} ${mode === "monthly" ? styles.active : ""}`}
          onClick={() => setMode("monthly")}
        >
          הפקדה חודשית
        </button>
      </div>

      <div className={styles.formWindow}>
        {mode === "oneTime" && (
          <>
            <span>סכום הפקדה חד פעמית</span>
            <input
              type="number"
              min={0}
              max={1000000000}
              placeholder="₪"
              value={deposit ?? ""}
              onChange={(e) => setDeposit(Number(e.target.value))}
            />
          </>
        )}

        {mode === "monthly" && (
          <>
            <span>סכום הפקדה חודשית</span>
            <input
              type="number"
              min={0}
              max={1000000}
              placeholder="₪"
              value={monthlyDeposit ?? ""}
              onChange={(e) => setMonthlyDeposit(Number(e.target.value))}
            />
          </>
        )}

        <span>מספר שנים</span>
        <input
          type="number"
          min={1}
          max={100}
          value={years ?? ""}
          onChange={(e) => setYears(Number(e.target.value))}
        />

        <span>ריבית שנתית (%)</span>
        <input
          type="number"
          min={0}
          max={100}
          value={interest ?? ""}
          onChange={(e) => setInterest(Number(e.target.value))}
        />

        <span>מס רווחי הון (%)</span>
        <input
          type="number"
          min={0}
          max={100}
          value={tax ?? ""}
          onChange={(e) => setTax(Number(e.target.value))}
        />

        <span>עמלת ניהול שנתית (%)</span>
        <input
          type="number"
          min={0}
          max={10}
          value={fee ?? ""}
          onChange={(e) => setFee(Number(e.target.value))}
        />

        <button type="button" onClick={calculate}>
          חשב
        </button>

        {result && (
  <div className={styles.result}>
    <p>סה״כ חיסכון: ₪{result.totalSaved.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    <p>סה״כ הופקד: ₪{result.totalDeposited.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    <p>רווחים נטו: ₪{result.earned.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    <p>מס ששולם: ₪{result.taxPaid.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    <p>עמלות ניהול: ₪{result.feesPaid.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
  </div>
)}
      </div>
    </div>
  );
};

export default SavingsCalculatorPage;
