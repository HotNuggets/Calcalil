import { Link } from "react-router-dom";
import styles from "./WelcomePage.module.scss";
import PageHeader from "../../components/HeaderComponent/PageHeader/PageHeader";
import { Analytics } from "@vercel/analytics/react"
import Footer from "../../components/Footer/Footer";

const WelcomePage = () => {
  return (
    <div className={styles.welcome}>
      <PageHeader showBackButton={false} />
      <Analytics /> 
      
      <div className={styles.content}>
        <h1 className={styles.title}>ברוך הבא!</h1>
        <p className={styles.subtitle}>בחר כלי כדי להתחיל:</p>
        
        <div className={styles.sections}>

          {/* --- Calculators group --- */}
          <div className={styles.group}>
            <span className={styles.groupLabel}>מחשבונים</span>
            <div className={styles.buttons}>
              <Link to="/loan">
                <button className={styles.btnCalc}>מחשבון הלוואות</button>
              </Link>
              <Link to="/savings">
                <button className={styles.btnCalc}>מחשבון חיסכון</button>
              </Link>
              <Link to="/Salary">
                <button className={styles.btnCalc}>מחשבון צמיחת שכר</button>
              </Link>
            </div>
          </div>

          <div className={styles.divider} />

          {/* --- Tools group --- */}
          <div className={styles.group}>
            <span className={`${styles.groupLabel} ${styles.groupLabelTeal}`}>כלים נוספים</span>
            <div className={styles.buttons}>
              <Link to="/expenses">
                <button className={styles.btnTool}>מעקב הוצאות</button>
              </Link>
              <Link to="/SNP">
                <button className={styles.btnTool}>מדד סנ"פ בישראל</button>
              </Link>
            </div>
          </div>

        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default WelcomePage;
