import { useState, useEffect } from 'react'
import { supabase } from '../../../lib/supabase'
import { useNavigate } from 'react-router-dom'
import styles from './LoginPage.module.scss'

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    // Check if we have a valid session from the reset link
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        alert('קישור האיפוס לא תקין או פג תוקפו')
        navigate('/login')
      }
    })
  }, [navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!password || !confirmPassword) {
      setError('נא למלא את כל השדות')
      return
    }

    if (password.length < 6) {
      setError('הסיסמה חייבת להכיל לפחות 6 תווים')
      return
    }

    if (password !== confirmPassword) {
      setError('הסיסמאות לא תואמות')
      return
    }

    setSubmitting(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) throw error

      alert('✅ הסיסמה עודכנה בהצלחה!')
      navigate('/login')
    } catch (error: any) {
      console.error('Error updating password:', error)
      setError(`שגיאה: ${error.message}`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logo}>🔐</div>
        <h1 className={styles.title}>איפוס סיסמה</h1>
        <p className={styles.subtitle}>הכנס סיסמה חדשה לחשבון שלך</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="password">סיסמה חדשה</label>
            <input
              id="password"
              type="password"
              placeholder="לפחות 6 תווים"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
              className={styles.input}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword">אימות סיסמה</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="הכנס את הסיסמה שוב"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
              className={styles.input}
            />
          </div>

          {error && (
            <div className={styles.errorMessage}>
              ❌ {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={submitting}
            className={styles.submitBtn}
          >
            {submitting ? '⏳ מעדכן...' : '✅ עדכן סיסמה'}
          </button>
        </form>

        <button 
          onClick={() => navigate('/login')}
          className={styles.backToLogin}
          type="button"
        >
          ← חזור להתחברות
        </button>
      </div>
    </div>
  )
}

export default ResetPasswordPage
