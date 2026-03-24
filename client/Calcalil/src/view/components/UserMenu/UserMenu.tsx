import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import styles from './UserMenu.module.scss'

const UserMenu = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    if (confirm('האם אתה בטוח שברצונך להתנתק?')) {
      await signOut()
    }
    setIsOpen(false)
  }

  const handleLogin = () => {
    navigate('/login')
    setIsOpen(false)
  }

  // If no user - show Login button
  if (!user) {
    return (
      <div className={styles.userMenu}>
        <button 
          className={styles.loginButton} 
          onClick={handleLogin}
        >
          🔐 התחבר
        </button>
      </div>
    )
  }

  // If user logged in - show avatar menu
  const userEmail = user.email || 'משתמש'
  const userInitial = userEmail.charAt(0).toUpperCase()

  return (
    <div className={styles.userMenu} ref={menuRef}>
      <button 
        className={styles.userButton} 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="תפריט משתמש"
      >
        <div className={styles.avatar}>{userInitial}</div>
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>{userInitial}</div>
            <div className={styles.userDetails}>
              <div className={styles.userName}>{userEmail.split('@')[0]}</div>
              <div className={styles.userEmail}>{userEmail}</div>
            </div>
          </div>

          <div className={styles.divider}></div>

          <button className={styles.menuItem} onClick={handleSignOut}>
            <span className={styles.menuIcon}>🚪</span>
            <span>התנתק</span>
          </button>
        </div>
      )}
    </div>
  )
}

export default UserMenu
