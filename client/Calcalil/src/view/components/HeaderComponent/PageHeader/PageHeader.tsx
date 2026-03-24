import UserMenu from '../../UserMenu/UserMenu'
import { useNavigate } from 'react-router-dom'
import styles from './PageHeader.module.scss'

interface PageHeaderProps {
  title?: string
  subtitle?: string
  showBackButton?: boolean
}

const PageHeader = ({ title, subtitle, showBackButton = true }: PageHeaderProps) => {
  const navigate = useNavigate()

  return (
    <div className={styles.pageHeader}>
      

      <div className={styles.userMenuContainer}>
        <UserMenu />
      </div>

      {showBackButton && (
        <button
          className={styles.backButton}
          onClick={() => navigate("/")}
        >
          ← חזור לדף הבית
        </button>
      )}
      
      {title && (
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>{title}</h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
      )}
    </div>
  )
}

export default PageHeader
