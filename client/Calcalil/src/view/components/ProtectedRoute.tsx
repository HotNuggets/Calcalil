import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import AuthRequiredModal from './AuthRequiredModal/AuthRequiredModal'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth()
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    // Show modal when not logged in
    if (!loading && !user) {
      setShowModal(true)
    }
  }, [loading, user])

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontSize: '18px',
        color: '#7B83A8'
      }}>
        טוען...
      </div>
    )
  }

  if (!user) {
    return (
      <>
        {showModal && (
          <AuthRequiredModal 
            onClose={() => setShowModal(false)}
          />
        )}
        {/* Show blurred background */}
        <div style={{ filter: 'blur(5px)', pointerEvents: 'none' }}>
          {children}
        </div>
      </>
    )
  }

  return <>{children}</>
}

export default ProtectedRoute
