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
    <span>הפקדה ראשונית</span>
    <input
      type="number"
      min={0}
      placeholder="₪"
      value={vm.deposit ?? ""}
      onChange={(e) => vm.setDeposit(Number(e.target.value))}
    />

    <span>הפקדה חודשית</span>
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

        <div className={styles.labelWithInfo}>
           <span>מס רווחי הון (%)</span>

            <button
              type="button"
              className={styles.infoButton}
              onClick={() => alert("מס רווחי הון בישראל נע בין 15% ל-25%")}
              aria-label="מידע על מס רווחי הון">
              ?
            </button>
        </div>
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
  <>
    <div className={styles.result}>
      <div className={styles.positive}>
        <p><strong>סה״כ חיסכון:</strong> ₪{vm.result.finalAmount.toLocaleString()}</p>
        <p><strong>סה״כ הופקד:</strong> ₪{vm.result.totalDeposited.toLocaleString()}</p>
        <p><strong>רווחים נטו:</strong> ₪{vm.result.earnedNet.toLocaleString()}</p>
      </div>

      <div className={styles.negative}>
        <p><strong>מס ששולם:</strong> ₪{vm.result.taxPaid.toLocaleString()}</p>
        <p><strong>עמלות ניהול:</strong> ₪{vm.result.feesPaid.toLocaleString()}</p>
      </div>
    </div>

    {/* ✅ MONTHLY BREAKDOWN TABLE */}
    <div className={styles.tableWrapper}>
      <h3>פירוט חודשי</h3>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>חודש</th>
            <th>סה״כ הופקד</th>
            <th>ריבית לחודש</th>
            <th>יתרה</th>
          </tr>
        </thead>
        <tbody>
          {vm.result.schedule.map(row => (
            <tr key={row.month}>
              <td>{row.month}</td>
              <td>₪{row.depositedTotal.toFixed(2)}</td>
              <td className={styles.positive}>
                ₪{row.interestEarned.toFixed(2)}
              </td>
              <td>₪{row.balance.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
)}

      </div>
    </div>
  );
};

export default SavingsCalculatorPage;
