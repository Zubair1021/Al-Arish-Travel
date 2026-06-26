import { Outlet } from 'react-router-dom'
import { AdminAuthProvider } from './AdminAuthContext'
import { ToastProvider } from './ToastContext'
import Seo from '../seo/Seo'
import './admin.css'

export default function AdminApp() {
  return (
    <AdminAuthProvider>
      <ToastProvider>
        <Seo
          title="Admin | Al Arish Travel"
          description="Admin portal"
          noindex
        />
        <Outlet />
      </ToastProvider>
    </AdminAuthProvider>
  )
}
