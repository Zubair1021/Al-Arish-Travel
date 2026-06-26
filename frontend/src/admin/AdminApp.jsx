import { Outlet } from 'react-router-dom'
import { AdminAuthProvider } from './AdminAuthContext'
import { ToastProvider } from './ToastContext'
import { ConfirmProvider } from '../context/ConfirmContext'
import Seo from '../seo/Seo'
import './admin.css'

export default function AdminApp() {
  return (
    <AdminAuthProvider>
      <ToastProvider>
        <ConfirmProvider theme="admin">
          <Seo
            title="Admin | Al Arish Travel"
            description="Admin portal"
            noindex
          />
          <Outlet />
        </ConfirmProvider>
      </ToastProvider>
    </AdminAuthProvider>
  )
}
