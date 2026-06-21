import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from './App.jsx'
import HomePage from './pages/HomePage.jsx'
import PackagesPage from './pages/PackagesPage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import ContactPage from './pages/ContactPage.jsx'
import HajjPage from './pages/HajjPage.jsx'
import AdminApp from './admin/AdminApp.jsx'
import AdminLogin from './admin/AdminLogin.jsx'
import AdminLayout from './admin/AdminLayout.jsx'
import AdminDashboard from './admin/AdminDashboard.jsx'
import AdminPackages from './admin/AdminPackages.jsx'
import AdminSubmissions from './admin/AdminSubmissions.jsx'
import AdminSettings from './admin/AdminSettings.jsx'
import { SettingsProvider } from './context/SettingsContext.jsx'
import { PackagesProvider } from './context/PackagesContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Admin portal — own provider tree, no public navbar/footer */}
        <Route path="/admin" element={<AdminApp />}>
          <Route path="login" element={<AdminLogin />} />
          <Route element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="packages" element={<AdminPackages />} />
            <Route path="submissions" element={<AdminSubmissions />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Route>

        {/* Public website */}
        <Route
          element={
            <SettingsProvider>
              <PackagesProvider>
                <ToastProvider>
                  <App />
                </ToastProvider>
              </PackagesProvider>
            </SettingsProvider>
          }
        >
          <Route path="/" element={<HomePage />} />
          <Route path="/packages" element={<PackagesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/hajj" element={<HajjPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<HomePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
