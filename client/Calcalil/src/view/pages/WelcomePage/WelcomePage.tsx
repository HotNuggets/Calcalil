//import React from "react";
import { Link } from "react-router-dom";
import styles from "./WelcomePage.module.scss";

const WelcomePage = () => {
  return (
    <div className={styles.welcome}>
      <h1 className={styles.title}>ברוך הבא!</h1>
      <p className={styles.subtitle}>בחר מחשבון כדי להתחיל:</p>
      <div className={styles.buttons}>
        <Link to="/loan">
          <button>מחשבון הלוואות</button>
        </Link>
        <Link to="/savings">
          <button>מחשבון חיסכון</button>
        </Link> 
        {/* <Link to="/mortgage">
          <button>מחשבון משכנתא</button>
        </Link> */}
        <Link to="/expenses">
          <button>דף הוצאות</button>
        </Link>
      </div>
    </div>
  );
};

export default WelcomePage;
