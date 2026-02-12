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
              type="text"
              inputMode="decimal"
              pattern="[0-9]*"
              min={0}
              placeholder="₪"
              value={vm.deposit ?? ""}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9.]/g, "");
                vm.setDeposit(Number(value))}}
            />
          </>
        )}

        {vm.calcType === "monthly" && (
  <>
    <span>הפקדה ראשונית</span>
        <input
      type="text"
      inputMode="decimal"
      pattern="[0-9]*"
      placeholder="₪"
      value={vm.deposit ?? ""}
      onChange={(e) => {
      const value = e.target.value.replace(/[^0-9.]/g, "");
      vm.setDeposit(Number(value));
      }}
/>

    <span>הפקדה חודשית</span>
    <input
      type="text"
      inputMode="decimal"
      pattern="[0-9]*"
      min={0}
      placeholder="₪"
      value={vm.monthlyDeposit ?? ""}
      onChange={(e) => {
        const value = e.target.value.replace(/[^0-9.]/g, "");
        vm.setMonthlyDeposit(Number(value))}}
    />
  </>
)}

        <span>מספר שנים</span>
        <input
          type="text"
          inputMode="decimal"
          pattern="[0-9]*"
          min={1}
          max={100}
          value={vm.years ?? ""}
          onChange={(e) => {
             const value = e.target.value.replace(/[^0-9.]/g, "");
             vm.setYears(Number(value))}}
        />

        <span>ריבית שנתית (%)</span>
        <input
          type="text"
          inputMode="decimal"
          pattern="[0-9]*"
          min={0}
          max={100}
          value={vm.interest ?? ""}
          onChange={(e) => {
             const value = e.target.value.replace(/[^0-9.]/g, "");
             vm.setInterest(Number(value))}}
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
          type="text"
          inputMode="decimal"
          pattern="[0-9]*"
          min={0}
          max={100}
          value={vm.tax ?? ""}
          onChange={(e) => {
            const value = e.target.value.replace(/[^0-9.]/g, "");
            vm.setTax(Number(value))}}
        />

        <span>דמי ניהול מהפקדה (%)</span>
        <input
          type="text"
          inputMode="decimal"
          pattern="[0-9]*"
          min={0}
          max={10}
          value={vm.depositFee ?? ""}
          onChange={(e) => {
            const value = e.target.value.replace(/[^0-9.]/g, "");
            vm.setDepositFee(Number(value))}}
        />

        <span>דמי ניהול מצבירה שנתית (%)</span>
        <input
          type="text"
          inputMode="decimal"
          pattern="[0-9]*"
          min={0}
          max={5}
          value={vm.accumulationFee ?? ""}
          onChange={(e) => {
            const value = e.target.value.replace(/[^0-9.]/g, "");
            vm.setAccumulationFee(Number(value))}}
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
