import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import AuthRequiredModal from './AuthRequiredModal/AuthRequiredModal'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth()
  const [showModal, setShowModal] = useState(false)
  const [shouldRedirect, setShouldRedirect] = useState(false)

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
    // Show modal first
    if (!showModal && !shouldRedirect) {
      setShowModal(true)
    }

    // If modal was closed and user wants to redirect
    if (shouldRedirect) {
      return <Navigate to="/login" replace />
    }

    // Show modal
    if (showModal) {
      return (
        <>
          <AuthRequiredModal 
            onClose={() => {
              setShowModal(false)
              setShouldRedirect(true)
            }}
          />
          {/* Show page content in background blurred */}
          <div style={{ filter: 'blur(5px)', pointerEvents: 'none' }}>
            {children}
          </div>
        </>
      )
    }

    // Fallback - redirect to home
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
