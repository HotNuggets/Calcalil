import UserMenu from '../../UserMenu/UserMenu'
import { useNavigate } from 'react-router-dom'
import styles from './PageHeader.module.scss'
import KofiButton from '../../KofiButton/KofiButton'

interface PageHeaderProps {
  showBackButton?: boolean
}

const PageHeader = ({ showBackButton = true }: PageHeaderProps) => {
  const navigate = useNavigate()

  return (
    <div className={styles.pageHeader}>
      <KofiButton />
      {showBackButton && (
        <button
          className={styles.backButton}
          onClick={() => navigate("/")}
        >
          ← חזור לדף הבית
        </button>
      )}

      <div className={styles.userMenuContainer}>
        <UserMenu />
      </div>
      
    </div>
  )
}

export default PageHeader