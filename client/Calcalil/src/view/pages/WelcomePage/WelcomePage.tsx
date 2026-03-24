//import React from "react";
import { Link } from "react-router-dom";
import styles from "./WelcomePage.module.scss";
import PageHeader from "../../components/HeaderComponent/PageHeader/PageHeader";

const WelcomePage = () => {
  return (
    <div className={styles.welcome}>
      <div className={styles.userMenuContainer}>
        <PageHeader showBackButton={false} />
      </div>

      <h1 className={styles.title}>ברוך הבא!</h1>
      <p className={styles.subtitle}>בחר מחשבון כדי להתחיל:</p>
      <div className={styles.buttons}>
        <Link to="/loan">
          <button>מחשבון הלוואות</button>
        </Link>
        <Link to="/savings">
          <button>מחשבון חיסכון</button>
        </Link> 
         <Link to="/expenses">
          <button>מעקב הוצאות</button>
        </Link> 
        <Link to="/SNP">
          <button>מדד סנ"פ בישראל</button>
        </Link> 
        <Link to="/Salary">
          <button>מחשבון צמיחת שכר</button>
        </Link> 
      </div>
    </div>
  );
};

export default WelcomePage;
