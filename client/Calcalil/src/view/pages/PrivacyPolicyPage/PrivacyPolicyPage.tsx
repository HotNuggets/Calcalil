import styles from './LegalPage.module.scss'
import PageHeader from '../../components/HeaderComponent/PageHeader/PageHeader'

const PrivacyPolicyPage = () => {
  

  return (
    <div className={styles.container}>
      <div className={styles.content}>
       <PageHeader />

        <h1 className={styles.title}>מדיניות פרטיות</h1>
        <p className={styles.lastUpdated}>
          עודכן לאחרונה: {new Date().toLocaleDateString('he-IL')}
        </p>

        <section className={styles.section}>
          <h2>1. מי אנחנו</h2>
          <p>
            CalcaLil הוא אתר המספק כלים פיננסיים וחישובים לצרכים אישיים. האתר מופעל באופן עצמאי.
          </p>
        </section>

        <section className={styles.section}>
          <h2>2. איזה מידע אנו אוספים</h2>
          <p>אנו עשויים לאסוף את סוגי המידע הבאים:</p>
          <ul>
            <li>
              <strong>מידע שמשתמש מזין:</strong> בחלק מהעמודים ניתן ליצור משתמש ולהזין נתונים פיננסיים
              (כגון הכנסות, הוצאות, חסכונות). מידע זה נשמר לצורך חישובים והתאמה אישית של התוצאות.
            </li>
            <li>
              <strong>מידע טכני ואנליטיקה:</strong> אנו משתמשים ב-Vercel Analytics לצורך הבנת שימוש באתר.
              המידע כולל נתונים כמו עמודים שנצפו, זמן שימוש, סוג מכשיר ודפדפן.
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>3. למה אנו אוספים את המידע</h2>
          <ul>
            <li>כדי לספק חישובים מותאמים אישית למשתמש</li>
            <li>כדי לשפר את חוויית המשתמש באתר</li>
            <li>כדי להבין כיצד משתמשים משתמשים בשירות</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>4. בסיס חוקי לעיבוד מידע</h2>
          <p>
            אנו מסתמכים על הסכמת המשתמש בעת הזנת מידע אישי, בהתאם לחוק הגנת הפרטיות בישראל.
            שימוש באתר מהווה הסכמה לעיבוד הנתונים בהתאם למדיניות זו.
          </p>
        </section>

        <section className={styles.section}>
          <h2>5. אחסון ושמירת מידע</h2>
          <ul>
            <li>מידע פיננסי שהוזן על ידי המשתמש עשוי להישמר לצורך שימוש עתידי</li>
            <li>אנו נוקטים באמצעים סבירים להגן על המידע</li>
            <li>אין התחייבות לאבטחה מוחלטת של הנתונים</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>6. צדדים שלישיים</h2>
          <p>
            אנו משתמשים בשירותי Vercel Analytics לצורך איסוף נתוני שימוש. שירותים אלה עשויים
            לעבד מידע טכני בהתאם למדיניות הפרטיות שלהם.
          </p>
        </section>

        <section className={styles.section}>
          <h2>7. זכויות המשתמש</h2>
          <ul>
            <li>לבקש גישה למידע שנשמר עליך</li>
            <li>לבקש תיקון או מחיקה של מידע</li>
            <li>להפסיק שימוש בשירות בכל עת</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>8. פרטיות ילדים</h2>
          <p>
            האתר אינו מיועד לילדים מתחת לגיל 16 ואיננו אוספים מידע ביודעין מקטינים.
          </p>
        </section>

        <section className={styles.section}>
          <h2>9. שינויים במדיניות</h2>
          <p>
            אנו עשויים לעדכן מדיניות זו מעת לעת. השינויים יפורסמו בעמוד זה עם תאריך עדכון חדש.
          </p>
        </section>

        <section className={styles.section}>
          <h2>10. יצירת קשר</h2>
          <p>
            לפרטים נוספים או שאלות בנושא פרטיות, ניתן לפנות אלינו (פרטי יצירת קשר יתווספו בהמשך).
          </p>
        </section>

        <div className={styles.footer}>
          <p>© {new Date().getFullYear()} CalcaLil. כל הזכויות שמורות.</p>
          <p className={styles.warning}>
            שימוש באתר מהווה הסכמה למדיניות פרטיות זו.
          </p>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicyPage