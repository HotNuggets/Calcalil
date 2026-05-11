import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext'  // adjust path if needed
import { supabase } from '../../../lib/supabase'        // adjust path if needed
import styles from './DeleteAccountPage.module.scss'
import PageHeader from '../../components/HeaderComponent/PageHeader/PageHeader'

type Step = 'confirm' | 'deleting' | 'done' | 'error'

const DeleteAccountPage = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const [step, setStep]           = useState<Step>('confirm')
  const [typedEmail, setTypedEmail] = useState('')
  const [errorMsg, setErrorMsg]   = useState('')

  const userEmail = user?.email ?? ''

  const emailMatches = typedEmail.trim().toLowerCase() === userEmail.toLowerCase()

  const handleDelete = async () => {
    if (!emailMatches) return

    setStep('deleting')
    setErrorMsg('')

    try {
      // Get the current session token to pass to the edge function
      const { data: sessionData } = await supabase.auth.getSession()
      const token = sessionData.session?.access_token

      if (!token) {
        setErrorMsg('לא נמצא חיבור פעיל. נסה להתחבר מחדש.')
        setStep('error')
        return
      }

      // Call our edge function which uses the service role to delete the user
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/delete-account`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      )

      const json = await res.json()

      if (!res.ok || !json.ok) {
        setErrorMsg(json.error ?? 'אירעה שגיאה. נסה שוב.')
        setStep('error')
        return
      }

      // Sign out locally and show success
      await signOut()
      setStep('done')
    } catch (e) {
      console.error(e)
      setErrorMsg('אירעה שגיאה בלתי צפויה.')
      setStep('error')
    }
  }

  // ── Done state ────────────────────────────────────────────────────────────
  if (step === 'done') {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <div className={styles.icon}>✅</div>
          <h2 className={styles.title}>החשבון נמחק</h2>
          <p className={styles.subtitle}>
            החשבון שלך נמחק לצמיתות. מקווים לראותך שוב.
          </p>
          <button className={styles.btnPrimary} onClick={() => navigate('/')}>
            חזור לדף הבית
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <PageHeader showBackButton />

      <div className={styles.card}>
        {/* ── Header ── */}
        <div className={styles.icon}>🗑️</div>
        <h2 className={styles.title}>מחיקת חשבון</h2>
        <p className={styles.subtitle}>
          פעולה זו תמחק את החשבון שלך <strong>לצמיתות</strong> ולא ניתן לשחזר אותו.
        </p>

        {/* ── Warning box ── */}
        <div className={styles.warningBox}>
          <p>⚠️ כל הנתונים שלך יימחקו ולא ניתן לשחזרם.</p>
        </div>

        {step === 'error' && (
          <div className={styles.errorBox}>
            <p>❌ {errorMsg}</p>
          </div>
        )}

        {/* ── Email confirmation input ── */}
        <div className={styles.field}>
          <label className={styles.label}>
            להאשרה, הקלד/י את כתובת המייל שלך:
          </label>
          <input
            className={styles.input}
            type="email"
            value={typedEmail}
            onChange={(e) => setTypedEmail(e.target.value)}
            placeholder={userEmail}
            disabled={step === 'deleting'}
            autoComplete="off"
          />
          {typedEmail.length > 0 && !emailMatches && (
            <span className={styles.inputHint}>המייל אינו תואם</span>
          )}
        </div>

        {/* ── Actions ── */}
        <div className={styles.actions}>
          <button
            className={styles.btnCancel}
            onClick={() => navigate(-1)}
            disabled={step === 'deleting'}
          >
            ביטול
          </button>

          <button
            className={styles.btnDanger}
            onClick={handleDelete}
            disabled={!emailMatches || step === 'deleting'}
          >
            {step === 'deleting' ? '⏳ מוחק...' : '🗑️ מחק חשבון'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteAccountPage
