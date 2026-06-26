import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from './App.jsx'
import { SettingsProvider } from './context/SettingsContext.jsx'
import { PackagesProvider } from './context/PackagesContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import './index.css'

const HomePage = lazy(() => import('./pages/HomePage.jsx'))
const PackagesPage = lazy(() => import('./pages/PackagesPage.jsx'))
const AboutPage = lazy(() => import('./pages/AboutPage.jsx'))
const ContactPage = lazy(() => import('./pages/ContactPage.jsx'))
const HajjPage = lazy(() => import('./pages/HajjPage.jsx'))
const LegalPage = lazy(() => import('./pages/LegalPage.jsx'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'))
const AdminApp = lazy(() => import('./admin/AdminApp.jsx'))
const AdminLogin = lazy(() => import('./admin/AdminLogin.jsx'))
const AdminLayout = lazy(() => import('./admin/AdminLayout.jsx'))
const AdminDashboard = lazy(() => import('./admin/AdminDashboard.jsx'))
const AdminPackages = lazy(() => import('./admin/AdminPackages.jsx'))
const AdminSubmissions = lazy(() => import('./admin/AdminSubmissions.jsx'))
const AdminSettings = lazy(() => import('./admin/AdminSettings.jsx'))

function PageFallback() {
  return null
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Suspense fallback={<PageFallback />}>
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
            <Route path="/privacy" element={<LegalPage slug="privacy" />} />
            <Route path="/terms" element={<LegalPage slug="terms" />} />
            <Route path="/atol" element={<LegalPage slug="atol" />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  </StrictMode>,
)
