import BackToWelcomeButton from "../../components/BackToWelcomeButton/BackToWelcomeButton";
import styles from "./LoanCalculatorPage.module.scss";
import { useLoanCalculatorVM } from "./LoanCalculatorPageVM";

const LoanCalculatorPage = () => {
  const {
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
  } = useLoanCalculatorVM();

  return (
    <div className={styles.calculator}>
       <BackToWelcomeButton />
      <div className={styles.parameters}>
        <div className={styles.monthOrSum}>
          <span className={styles.parameter}>לחשב את:</span>
          <button
            className={`${styles.option} ${selectedOption === "monthly" ? styles.active : ""}`}
            onClick={() => chooseCalculationType("monthly")}>החזר החודשי</button>
          <button
            className={`${styles.option} ${selectedOption === "loan" ? styles.active : ""}`}
            onClick={() => chooseCalculationType("loan")}>סכום ההלוואה</button>
        </div>

        <div className={styles.method}>
          <span className={styles.parameter}>אופן החזר ההלוואה:</span>
          <button
            className={`${styles.option} ${loanOption === "spizer" ? styles.active : ""}`}
            onClick={() => chooseRepaymentMethod("spizer")}>חזר קבוע (לוח שפיצר)</button>
          <button
            className={`${styles.option} ${loanOption === "keren" ? styles.active : ""}`}
            onClick={() => chooseRepaymentMethod("keren")}>החזר קרן שווה</button>
        </div>
      </div>

      <div id={styles.formWindow}>
        {selectedOption === "loan" && (
          <>
            <span>החזר חודשי</span>
            <input
              type="number"
              placeholder="₪"
              value={monthlyPayment ?? ""}
              max={1000000000}
              min={0}
              onChange={(e) => setMonthlyPayment(Number(e.target.value))}
            />
          </>
        )}

        {selectedOption === "monthly" && (
          <>
            <span>סכום הלוואה</span>
            <input
              type="number"
              placeholder="₪"
              value={loanAmount ?? ""}
              max={1000000000}
              min={0}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
            />
          </>
        )}

        <span>תקופת הלוואה (חודשים)</span>
        <input
          type="number"
          value={months ?? ""}
          max={1000}
          min={0}
          onChange={(e) => setMonths(Number(e.target.value))}
        />

        <span>אחוז הריבית</span>
        <input
          type="number"
          placeholder="%"
          value={interest ?? ""}
          max={100}
          min={0}
          onChange={(e) => setInterest(Number(e.target.value))}
        />

        <button type="button" onClick={calculate}>
          חשב
        </button>

        {result && loanOption === "spizer" && (
          <div className={styles.result}>
            {result.type === "monthly" && <p>החזר חודשי משוער: ₪{result.value.toFixed(2)}</p>}
            {result.type === "loan" && <p>סכום הלוואה משוער: ₪{result.value.toFixed(2)}</p>}
          </div>
        )}

        {result && loanOption === "keren" && (
          <div className={styles.result}>
            <p>תשלום ראשון: ₪{result.first.toFixed(2)}</p>
            <p>תשלום אחרון: ₪{result.last.toFixed(2)}</p>
            <p>ממוצע חודשי: ₪{result.avg.toFixed(2)}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanCalculatorPage;
