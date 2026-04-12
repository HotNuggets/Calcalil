import { useNavigate } from 'react-router-dom'
import styles from './AuthRequiredModal.module.scss'

interface AuthRequiredModalProps {
  onClose: () => void
}

const AuthRequiredModal = ({ onClose }: AuthRequiredModalProps) => {
  const navigate = useNavigate()

  const handleLogin = () => {
    navigate('/login')
  }

  const handleCancel = () => {
    onClose()
    navigate('/') 
    
  }

  return (
    <div className={styles.overlay} onClick={handleCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.icon}>🔐</div>
        
        <h2 className={styles.title}>נדרש חשבון משתמש</h2>
        
        <p className={styles.message}>
          כדי להשתמש במעקב הוצאות ולשמור את הנתונים שלך, עליך להתחבר או להירשם למערכת.
        </p>

        <div className={styles.features}>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>💾</span>
            <span>שמירת נתונים בענן</span>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>📊</span>
            <span>מעקב חודשי ושנתי</span>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>🔒</span>
            <span>מאובטח ופרטי</span>
          </div>
        </div>

        <div className={styles.buttons}>
          <button 
            className={styles.primaryBtn} 
            onClick={handleLogin}
          >
            התחבר / הירשם
          </button>
          
          <button 
            className={styles.secondaryBtn} 
            onClick={handleCancel}
          >
            ביטול
          </button>
        </div>
      </div>
    </div>
  )
}

export default AuthRequiredModal
