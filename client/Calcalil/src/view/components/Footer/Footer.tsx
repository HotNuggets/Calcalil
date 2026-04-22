import { Link } from 'react-router-dom'
import styles from './Footer.module.scss'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.disclaimer}>
          ⚠️ <strong>חשוב:</strong> CalCalil אינו מחליף ייעוץ מקצועי. התייעץ עם רואה חשבון או יועץ פיננסי לפני החלטות משמעותיות.
        </div>

        <div className={styles.links}>
          <Link to="/Terms">תנאי שימוש</Link>
          <span className={styles.separator}>•</span>
          <Link to="/privacy">מדיניות פרטיות</Link>
          <span className={styles.separator}>•</span>
          <Link to="/contact">צור קשר</Link>
        </div>

        <div className={styles.copyright}>
          © {currentYear} CalCalil. כל הזכויות שמורות.
        </div>
      </div>
    </footer>
  )
}

export default Footer
