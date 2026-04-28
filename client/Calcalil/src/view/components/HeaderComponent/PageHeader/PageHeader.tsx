import UserMenu from '../../UserMenu/UserMenu'
import KofiButton from '../../KofiButton/KofiButton'
import { useNavigate } from 'react-router-dom'
import styles from './PageHeader.module.scss'

interface PageHeaderProps {
  showBackButton?: boolean
}

const PageHeader = ({ showBackButton = true }: PageHeaderProps) => {
  const navigate = useNavigate()

  return (
    <div className={styles.pageHeader}>
      <div className={styles.leftSection}>
        {showBackButton && (
          <button
            className={styles.backButton}
            onClick={() => navigate("/")}
          >
            ← חזור לדף הבית
          </button>
        )}
        <KofiButton />
      </div>

      <div className={styles.userMenuContainer}>
        <UserMenu />
      </div>
    </div>
  )
}

export default PageHeader
