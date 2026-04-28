import PageHeader from "../../components/HeaderComponent/PageHeader/PageHeader";
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
      <PageHeader />

      <h1 className={styles.title}>מחשבון הלוואות</h1>

      <div className={styles.toggleSection}>
        <span className={styles.toggleLabel}>לחשב את:</span>
        <div className={styles.toggleButtons}>
          <button
            className={`${styles.toggleBtn} ${selectedOption === "monthly" ? styles.active : ""}`}
            onClick={() => chooseCalculationType("monthly")}
          >
            החזר חודשי 💵
          </button>
          <button
            className={`${styles.toggleBtn} ${selectedOption === "loan" ? styles.active : ""}`}
            onClick={() => chooseCalculationType("loan")}
          >
            סכום ההלוואה 💰
          </button>
        </div>
      </div>

      <div className={styles.toggleSection}>
        <span className={styles.toggleLabel}>אופן החזר ההלוואה:</span>
        <div className={styles.toggleButtons}>
          <button
            className={`${styles.toggleBtn} ${loanOption === "keren" ? styles.active : ""}`}
            onClick={() => chooseRepaymentMethod("keren")}
          >
            החזר קרן שווה
          </button>
          <button
            className={`${styles.toggleBtn} ${loanOption === "spizer" ? styles.active : ""}`}
            onClick={() => chooseRepaymentMethod("spizer")}
          >
            חזר קבוע (לוח שפיצר)
          </button>
        </div>
      </div>

      <div className={styles.formWindow}>
        {selectedOption === "loan" && (
          <div className={styles.inputGroup}>
            <label>החזר חודשי</label>
            <input
              type="number"
              placeholder="₪"
              value={monthlyPayment || ""}
              onChange={(e) => setMonthlyPayment(Number(e.target.value))}
            />
          </div>
        )}

        {selectedOption === "monthly" && (
          <div className={styles.inputGroup}>
            <label>סכום הלוואה</label>
            <input
              type="number"
              placeholder="₪"
              value={loanAmount || ""}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
            />
          </div>
        )}

        <div className={styles.inputGroup}>
          <label>תקופת הלוואה (חודשים)</label>
          <input
            type="number"
            value={months || ""}
            onChange={(e) => setMonths(Number(e.target.value))}
          />
        </div>

        <div className={styles.inputGroup}>
          <label>אחוז הריבית</label>
          <input
            type="number"
            placeholder="%"
            value={interest || ""}
            onChange={(e) => setInterest(Number(e.target.value))}
          />
        </div>

        <button className={styles.calculateBtn} onClick={calculate}>
          חשב תוצאות 📊
        </button>

        {result && (
          <div className={styles.results}>
            <h2 className={styles.resultsTitle}>תוצאות החישוב</h2>
            
            {loanOption === "spizer" ? (
              <div className={styles.resultCards}>
                <div className={styles.resultCard}>
                  <span className={styles.resultLabel}>החזר חודשי קבוע</span>
                  <span className={styles.resultValue}>{result.monthlyPayment?.toLocaleString()} ₪</span>
                </div>
                <div className={styles.resultCard}>
                  <span className={styles.resultLabel}>סה"כ החזר</span>
                  <span className={styles.resultValue}>{result.totalRepayment?.toLocaleString()} ₪</span>
                </div>
                <div className={styles.resultCard}>
                  <span className={styles.resultLabel}>סה"כ ריבית</span>
                  <span className={styles.resultValue}>{result.totalInterest?.toLocaleString()} ₪</span>
                </div>
              </div>
            ) : (
              <div className={styles.resultCards}>
                <div className={styles.resultCard}>
                  <span className={styles.resultLabel}>החזר ראשון</span>
                  <span className={styles.resultValue}>{result.firstPayment?.toLocaleString()} ₪</span>
                </div>
                <div className={styles.resultCard}>
                  <span className={styles.resultLabel}>החזר אחרון</span>
                  <span className={styles.resultValue}>{result.lastPayment?.toLocaleString()} ₪</span>
                </div>
                <div className={styles.resultCard}>
                  <span className={styles.resultLabel}>סה"כ החזר</span>
                  <span className={styles.resultValue}>{result.totalRepayment?.toLocaleString()} ₪</span>
                </div>
                <div className={styles.resultCard}>
                  <span className={styles.resultLabel}>סה"כ ריבית</span>
                  <span className={styles.resultValue}>{result.totalInterest?.toLocaleString()} ₪</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanCalculatorPage;
