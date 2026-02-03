import styles from "./SavingsCalculatorPage.module.scss";
import BackToWelcomeButton from "../../components/BackToWelcomeButton/BackToWelcomeButton";
import { useSavingsCalculatorPageVM } from "./SavingsCalculatorPageVM";

const SavingsCalculatorPage = () => {
  const vm = useSavingsCalculatorPageVM();

  return (
    <div className={styles.calculator}>
      <BackToWelcomeButton />

      <div className={styles.parameters}>
        <span className={styles.parameter}>בחר סוג חיסכון:</span>

        <button
          className={`${styles.option} ${vm.calcType === "oneTime" ? styles.active : ""}`}
          onClick={() => vm.setCalcType("oneTime")}
        >
          הפקדה חד פעמית
        </button>

        <button
          className={`${styles.option} ${vm.calcType === "monthly" ? styles.active : ""}`}
          onClick={() => vm.setCalcType("monthly")}
        >
          הפקדה חודשית
        </button>
      </div>

      <div className={styles.formWindow}>
        {vm.calcType === "oneTime" && (
          <>
            <span>סכום הפקדה חד פעמית</span>
            <input
              type="number"
              min={0}
              placeholder="₪"
              value={vm.deposit ?? ""}
              onChange={(e) => vm.setDeposit(Number(e.target.value))}
            />
          </>
        )}

        {vm.calcType === "monthly" && (
          <>
            <span>סכום הפקדה חודשית</span>
            <input
              type="number"
              min={0}
              placeholder="₪"
              value={vm.monthlyDeposit ?? ""}
              onChange={(e) => vm.setMonthlyDeposit(Number(e.target.value))}
            />
          </>
        )}

        <span>מספר שנים</span>
        <input
          type="number"
          min={1}
          max={100}
          value={vm.years ?? ""}
          onChange={(e) => vm.setYears(Number(e.target.value))}
        />

        <span>ריבית שנתית (%)</span>
        <input
          type="number"
          min={0}
          max={100}
          value={vm.interest ?? ""}
          onChange={(e) => vm.setInterest(Number(e.target.value))}
        />

        <span>מס רווחי הון (%)</span>
        <input
          type="number"
          min={0}
          max={100}
          value={vm.tax ?? ""}
          onChange={(e) => vm.setTax(Number(e.target.value))}
        />

        <span>דמי ניהול מהפקדה (%)</span>
        <input
          type="number"
          min={0}
          max={10}
          value={vm.depositFee ?? ""}
          onChange={(e) => vm.setDepositFee(Number(e.target.value))}
        />

        <span>דמי ניהול מצבירה שנתית (%)</span>
        <input
          type="number"
          min={0}
          max={5}
          value={vm.accumulationFee ?? ""}
          onChange={(e) => vm.setAccumulationFee(Number(e.target.value))}
        />

        <button type="button" onClick={vm.calculate}>
          חשב
        </button>

        {vm.result && (
          <div className={styles.result}>
            <p>סה״כ חיסכון: ₪{vm.result.finalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
            <p>סה״כ הופקד: ₪{vm.result.totalDeposited.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
            <p>רווחים נטו: ₪{vm.result.earnedNet.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
            <p>מס ששולם: ₪{vm.result.taxPaid.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
            <p>עמלות ניהול: ₪{vm.result.feesPaid.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavingsCalculatorPage;
