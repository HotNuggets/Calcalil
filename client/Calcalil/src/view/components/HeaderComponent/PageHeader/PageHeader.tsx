import UserMenu from '../../UserMenu/UserMenu'
import { useNavigate } from 'react-router-dom'
import styles from './PageHeader.module.scss'

interface PageHeaderProps {
  showBackButton?: boolean
}

const PageHeader = ({ showBackButton = true }: PageHeaderProps) => {
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
    </div>
  )
}

export default PageHeader
