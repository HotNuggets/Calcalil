
import styles from './LegalPage.module.scss'
import PageHeader from '../../components/HeaderComponent/PageHeader/PageHeader'

const TermsOfServicePage = () => {

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <PageHeader />
      

        <h1 className={styles.title}>תנאי שימוש – CalCalil</h1>
        <p className={styles.lastUpdated}>
          עודכן לאחרונה: {new Date().toLocaleDateString('he-IL')}
        </p>

        <section className={styles.section}>
          <h2>1. מהות השירות</h2>
          <p>
            CalCalil הוא כלי פיננסי אינפורמטיבי המספק מחשבונים ותצוגות נתונים בנושאי חיסכון, הוצאות ותכנון פיננסי.
            השירות ניתן ללא תשלום ומיועד למטרות מידע ולמידה בלבד.
          </p>
          <p>
            CalCalil אינו שירות ייעוץ פיננסי. כל הנתונים, החישובים והתחזיות באתר הם תוצאה אוטומטית המבוססת על קלט משתמש ואינם מהווים ייעוץ מקצועי.
          </p>
        </section>

        <section className={styles.section}>
          <h2>2. היעדר אחריות או הבטחת דיוק</h2>
          <p>המידע באתר מסופק "כפי שהוא" וללא התחייבות כלשהי.</p>
          <ul>
            <li>אין התחייבות לדיוק או שלמות הנתונים</li>
            <li>אין התחייבות לאמינות התוצאות</li>
            <li>אין התחייבות לזמינות רציפה של השירות</li>
            <li>התוצאות הן הערכות בלבד ועשויות להשתנות</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>3. ⚠️ אין מדובר בייעוץ מקצועי</h2>
          <div className={styles.disclaimer}>
            <p className={styles.warning}>
              <strong>קרא בעיון:</strong>
            </p>
            <ul>
              <li>
                <strong>CalCalil אינו מספק ייעוץ פיננסי, השקעות, מיסוי או ייעוץ משפטי.</strong>
              </li>
              <li>
                <strong>המידע באתר אינו מהווה תחליף לייעוץ מקצועי.</strong>
              </li>
              <li>
                <strong>החלטות פיננסיות:</strong> כל החלטה שאתה מקבל היא באחריותך בלבד.
              </li>
              <li>
                <strong>תוצאות חישוב:</strong> כל החישובים הם הערכות בלבד ואינם מבטיחים תוצאה בפועל.
              </li>
            </ul>
          </div>
        </section>

        <section className={styles.section}>
          <h2>4. שימוש מותר</h2>
          <p>אתה מסכים להשתמש בשירות בהתאם לחוק בלבד. אסור לך:</p>
          <ul>
            <li>להשתמש בשירות למטרות לא חוקיות</li>
            <li>לנסות לפגוע או לשבש את פעילות האתר</li>
            <li>להשתמש בבוטים או כלים אוטומטיים באופן שפוגע בשירות</li>
            <li>להציג את הנתונים כייעוץ מקצועי או רשמי</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>5. מקורות נתונים חיצוניים</h2>
          <p>
            האתר עשוי להשתמש במקורות נתונים חיצוניים (כגון נתוני שוק או שערי מטבע).
            אין לנו אחריות על דיוק, זמינות או אמינות של נתונים אלו.
          </p>
        </section>

        <section className={styles.section}>
          <h2>6. קניין רוחני</h2>
          <p>
            כל התוכן, העיצוב והקוד באתר הם קניין של CalCalil.
          </p>
          <ul>
            <li>מותר להשתמש באתר לשימוש אישי בלבד</li>
            <li>מותר לשתף קישורים</li>
            <li>אסור להעתיק או להפיץ תוכן למטרות מסחריות ללא אישור</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>7. הגבלת אחריות</h2>
          <div className={styles.disclaimer}>
            <p className={styles.warning}>
              <strong>קרא בעיון:</strong>
            </p>
            <ul>
              <li>
                השירות ניתן "כפי שהוא" ללא אחריות מכל סוג
              </li>
              <li>
                איננו אחראים לנזקים ישירים או עקיפים
              </li>
              <li>
                איננו אחראים להפסדים כספיים או אובדן נתונים
              </li>
              <li>
                השימוש באתר הוא על אחריות המשתמש בלבד
              </li>
            </ul>
          </div>
        </section>

        <section className={styles.section}>
          <h2>8. זמינות השירות</h2>
          <ul>
            <li>השירות עשוי להיות לא זמין מעת לעת</li>
            <li>אנו רשאים לשנות או להפסיק את השירות בכל עת</li>
            <li>אין התחייבות לפעולה רציפה</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2>9. שינויים בתנאים</h2>
          <p>
            אנו עשויים לעדכן תנאים אלו מעת לעת. המשך שימוש באתר מהווה הסכמה לתנאים המעודכנים.
          </p>
        </section>

        <section className={styles.section}>
          <h2>10. דין חל</h2>
          <p>
            תנאים אלו יהיו כפופים לדין החל.
          </p>
        </section>

        <section className={styles.section}>
          <h2>11. יצירת קשר</h2>
          <p>
            [פרטי יצירת קשר יתווספו כאן]
          </p>
        </section>

        <div className={styles.footer}>
          <p>© {new Date().getFullYear()} CalCalil. כל הזכויות שמורות.</p>
          <p className={styles.warning}>
            שימוש באתר מהווה הסכמה לתנאי שימוש אלו.
          </p>
        </div>
      </div>
    </div>
  )
}

export default TermsOfServicePage