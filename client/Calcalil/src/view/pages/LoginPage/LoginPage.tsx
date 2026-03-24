import { useState } from 'react'
import { supabase } from '../../../lib/supabase'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext'
import styles from './LoginPage.module.scss'
import PageHeader from '../../components/HeaderComponent/PageHeader/PageHeader'

const LoginPage = () => {
  const { user, loading } = useAuth()
  const [mode, setMode] = useState<'login' | 'signup' | 'reset'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      alert('נא למלא את כתובת המייל')
      return
    }

    if (mode === 'reset') {
      // Password Reset
      setSubmitting(true)
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`
        })

        if (error) throw error

        alert('✅ נשלח קישור לאיפוס סיסמה למייל שלך!')
        setMode('login')
      } catch (error: any) {
        alert(`❌ שגיאה: ${error.message}`)
      } finally {
        setSubmitting(false)
      }
      return
    }

    if (!password) {
      alert('נא למלא את הסיסמה')
      return
    }

    if (password.length < 6) {
      alert('הסיסמה חייבת להכיל לפחות 6 תווים')
      return
    }

    setSubmitting(true)

    try {
      if (mode === 'signup') {
        // Register new user
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin
          }
        })

        if (error) throw error

        if (data.user) {
          if (data.user.identities?.length === 0) {
            alert('כתובת המייל כבר רשומה במערכת. נסה להתחבר או לאפס סיסמה.')
            setMode('login')
          } else {
            alert('✅ נשלח אימייל אישור! בדוק את תיבת הדואר שלך ולחץ על הקישור לאימות החשבון.')
          }
        }
      } else {
        // Login existing user
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error
      }
    } catch (error: any) {
      console.error('Auth error:', error)
      
      if (error.message?.includes('Invalid login credentials')) {
        alert('❌ אימייל או סיסמה שגויים. אם שכחת את הסיסמה, לחץ על "שכחתי סיסמה"')
      } else if (error.message?.includes('Email not confirmed')) {
        alert('❌ עליך לאמת את המייל לפני ההתחברות. בדוק את תיבת הדואר שלך.')
      } else {
        alert(`❌ שגיאה: ${error.message}`)
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>טוען...</p>
      </div>
    )
  }

  if (user) {
    return <Navigate to="/" replace />
  }

  return (
    
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logo}>💰</div>
        <h1 className={styles.title}>CalCalil</h1>
        <p className={styles.subtitle}>
          מערכת חכמה לניהול הוצאות והכנסות
        </p>

        {/* Toggle between Login, Signup, and Reset */}
        {mode !== 'reset' && (
          <div className={styles.modeToggle}>
            <button
              className={mode === 'login' ? styles.active : ''}
              onClick={() => setMode('login')}
              type="button"
            >
              התחברות
            </button>
            <button
              className={mode === 'signup' ? styles.active : ''}
              onClick={() => setMode('signup')}
              type="button"
            >
              הרשמה
            </button>
          </div>
        )}

        {mode === 'reset' && (
          <div className={styles.resetHeader}>
            <h2>איפוס סיסמה</h2>
            <p>נשלח לך קישור למייל לאיפוס הסיסמה</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">אימייל</label>
            <input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className={styles.input}
            />
          </div>

          {mode !== 'reset' && (
            <div className={styles.inputGroup}>
              <label htmlFor="password">סיסמה</label>
              <input
                id="password"
                type="password"
                placeholder="לפחות 6 תווים"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                className={styles.input}
              />
            </div>
          )}

          <button 
            type="submit" 
            disabled={submitting}
            className={styles.submitBtn}
          >
            {submitting 
              ? '⏳ מעבד...' 
              : mode === 'login' 
                ? '🔐 התחבר' 
                : mode === 'signup'
                  ? '✨ הירשם'
                  : '📧 שלח קישור לאיפוס'}
          </button>
        </form>

        {mode === 'login' && (
          <button 
            onClick={() => setMode('reset')}
            className={styles.forgotPassword}
            type="button"
          >
            שכחתי סיסמה
          </button>
        )}

        {mode === 'reset' && (
          <button 
            onClick={() => setMode('login')}
            className={styles.backToLogin}
            type="button"
          >
            ← חזור להתחברות
          </button>
        )}

        <div className={styles.hint}>
          {mode === 'login' 
            ? '💡 עדיין אין לך חשבון? לחץ על "הרשמה" למעלה'
            : mode === 'signup'
              ? '💡 כבר יש לך חשבון? לחץ על "התחברות" למעלה'
              : ''}
        </div>

        <div className={styles.features}>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>📊</span>
            <span>מעקב הוצאות</span>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>💵</span>
            <span>מחשבונים פיננסיים</span>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>📈</span>
            <span>דוחות חודשיים</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
