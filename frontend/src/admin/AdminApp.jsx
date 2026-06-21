import { Outlet } from 'react-router-dom'
import { AdminAuthProvider } from './AdminAuthContext'
import { ToastProvider } from './ToastContext'
import './admin.css'

export default function AdminApp() {
  return (
    <AdminAuthProvider>
      <ToastProvider>
        <Outlet />
      </ToastProvider>
    </AdminAuthProvider>
  )
}
