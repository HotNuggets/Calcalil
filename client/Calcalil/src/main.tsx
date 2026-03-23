import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './router.tsx'
import './global.css'
import { AuthProvider } from './contexts/AuthContext'  // ← ADD THIS


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>  {/* ← WRAP YOUR APP */}
      <RouterProvider router={router} />
    </AuthProvider>  {/* ← CLOSE THE WRAPPER */}
  </StrictMode>,
)