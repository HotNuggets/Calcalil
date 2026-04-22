import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import emailjs from '@emailjs/browser'
import styles from './ContactPage.module.scss'

const ContactPage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [sending, setSending] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.message) {
      alert('נא למלא את כל השדות')
      return
    }

    setSending(true)
    setStatus('idle')

    try {
      // Replace these with your EmailJS credentials
      const SERVICE_ID = 'service_vo7z9xa'  // e.g., 'service_abc123'
      const TEMPLATE_ID = 'template_axhyd7g' // e.g., 'template_xyz789'
      const PUBLIC_KEY = 'fUVX6rW18nXlo3nIZ'   // e.g., 'abc123xyz789'

      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
        },
        PUBLIC_KEY
      )

      setStatus('success')
      setFormData({ name: '', email: '', message: '' })
      
      setTimeout(() => {
        navigate('/')
      }, 3000)
    } catch (error) {
      console.error('EmailJS error:', error)
      setStatus('error')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <button onClick={() => navigate(-1)} className={styles.backBtn}>
          ← חזור
        </button>

        <div className={styles.header}>
          <h1 className={styles.title}>צור קשר</h1>
          <p className={styles.subtitle}>
            יש לך שאלה, הצעה או בעיה? נשמח לשמוע ממך!
          </p>
        </div>

        {status === 'success' ? (
          <div className={styles.successMessage}>
            <div className={styles.successIcon}>✅</div>
            <h2>ההודעה נשלחה בהצלחה!</h2>
            <p>נחזור אליך בהקדם האפשרי.</p>
            <p className={styles.redirecting}>מועבר חזרה לדף הבית...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="name">שם מלא *</label>
              <input
                id="name"
                type="text"
                placeholder="השם שלך"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                disabled={sending}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="email">אימייל *</label>
              <input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={sending}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="message">הודעה *</label>
              <textarea
                id="message"
                rows={6}
                placeholder="כתוב את הודעתך כאן..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                disabled={sending}
              />
            </div>

            {status === 'error' && (
              <div className={styles.errorMessage}>
                ❌ אירעה שגיאה בשליחת ההודעה. נסה שוב.
              </div>
            )}

            <button 
              type="submit" 
              className={styles.submitBtn}
              disabled={sending}
            >
              {sending ? '⏳ שולח...' : '📧 שלח הודעה'}
            </button>

            <p className={styles.privacy}>
              על ידי שליחת הודעה, אתה מסכים ל
              <a href="/Terms" target="_blank">תנאי השימוש</a>
              {' '}ול
              <a href="/privacy" target="_blank">מדיניות הפרטיות</a>
            </p>
          </form>
        )}

        {/* <div className={styles.info}>
          <h3>דרכים נוספות ליצור קשר:</h3>
          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <span className={styles.infoIcon}>💬</span>
              <h4>שאלות נפוצות</h4>
              <p>בדוק את דף השאלות הנפוצות למענה מהיר</p>
            </div>
            <div className={styles.infoCard}>
              <span className={styles.infoIcon}>📖</span>
              <h4>מדריך שימוש</h4>
              <p>למד כיצד להשתמש בכלי החישוב השונים</p>
            </div>
            <div className={styles.infoCard}>
              <span className={styles.infoIcon}>🐛</span>
              <h4>דיווח על באג</h4>
              <p>מצאת בעיה? ספר לנו ונתקן במהירות</p>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  )
}

export default ContactPage
