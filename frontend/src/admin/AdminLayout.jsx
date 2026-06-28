import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAdminAuth } from './AdminAuthContext'
import Loader from './components/Loader'
import { useToast } from './ToastContext'
import { fetchRecentSubmissions, fetchSubmissionsSummary } from '../api/submissions'
import logoWhite from '../assets/images/logo-white.jpg'

const NAV = [
  { to: '/admin', label: 'Dashboard', end: true, icon: 'home' },
  { to: '/admin/packages', label: 'Packages', icon: 'box' },
  { to: '/admin/categories', label: 'Categories', icon: 'tag' },
  { to: '/admin/submissions', label: 'Submissions', icon: 'inbox', counter: 'unread' },
  { to: '/admin/settings', label: 'Settings', icon: 'cog' },
]

function Icon({ name }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  }
  switch (name) {
    case 'home':
      return (
        <svg {...common}>
          <path d="M3 11l9-7 9 7" />
          <path d="M5 10v10h14V10" />
        </svg>
      )
    case 'box':
      return (
        <svg {...common}>
          <path d="M3 7l9-4 9 4-9 4-9-4z" />
          <path d="M3 7v10l9 4 9-4V7" />
        </svg>
      )
    case 'tag':
      return (
        <svg {...common}>
          <path d="M4 9V4h5" />
          <path d="M20 13 9 4 4 9l11 11 5-7Z" />
        </svg>
      )
    case 'inbox':
      return (
        <svg {...common}>
          <path d="M22 12h-6l-2 3h-4l-2-3H2" />
          <path d="M5.5 5h13l3 7v6a2 2 0 0 1-2 2H4.5a2 2 0 0 1-2-2v-6l3-7z" />
        </svg>
      )
    case 'cog':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3h0a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9v0a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
        </svg>
      )
    default:
      return null
  }
}

export default function AdminLayout() {
  const { admin, ready, logout } = useAdminAuth()
  const { push } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const [summary, setSummary] = useState({ unread: 0, total: 0, byType: {}, byStatus: {} })
  const [drawerOpen, setDrawerOpen] = useState(false)
  const lastSeenRef = useRef(new Date().toISOString())

  useEffect(() => {
    if (ready && !admin) {
      navigate('/admin/login', { replace: true })
    }
  }, [ready, admin, navigate])

  const refreshSummary = useCallback(async () => {
    try {
      const data = await fetchSubmissionsSummary()
      setSummary({
        unread: data?.unread || 0,
        total: data?.total || 0,
        byType: data?.byType || {},
        byStatus: data?.byStatus || {},
      })
    } catch {
      /* ignore */
    }
  }, [])

  useEffect(() => {
    if (!admin) return undefined
    refreshSummary()
    const interval = setInterval(refreshSummary, 30000)
    return () => clearInterval(interval)
  }, [admin, refreshSummary])

  // Poll for brand-new submissions and surface a toast
  useEffect(() => {
    if (!admin) return undefined
    let cancelled = false
    const poll = async () => {
      try {
        const data = await fetchRecentSubmissions(lastSeenRef.current)
        const newOnes = data?.submissions || []
        if (newOnes.length && !cancelled) {
          lastSeenRef.current = newOnes[0].createdAt
          push({
            title: `New ${newOnes.length === 1 ? 'submission' : 'submissions'} received`,
            body: newOnes
              .slice(0, 3)
              .map((s) => `${labelType(s.type)}: ${s.name}`)
              .join(' · '),
            tone: 'success',
          })
          refreshSummary()
        }
      } catch {
        /* ignore */
      }
    }
    const interval = setInterval(poll, 25000)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [admin, push, refreshSummary])

  useEffect(() => {
    setDrawerOpen(false)
  }, [location.pathname])

  const handleLogout = () => {
    logout()
    navigate('/admin/login', { replace: true })
  }

  const counters = useMemo(() => ({ unread: summary.unread }), [summary.unread])

  if (!ready) {
    return (
      <div className="adm-shell adm-shell-loading">
        <Loader label="Loading admin…" />
      </div>
    )
  }

  if (!admin) {
    return null
  }

  return (
    <div className={`adm-shell${drawerOpen ? ' is-open' : ''}`}>
      <aside className="adm-side">
        <div className="adm-side-brand">
          <span className="adm-side-logo">
            <img src={logoWhite} alt="Al Arish Travel" />
          </span>
          <div>
            <strong>Al Arish</strong>
            <span>Admin Portal</span>
          </div>
        </div>

        <nav className="adm-nav" aria-label="Admin">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `adm-nav-link${isActive ? ' is-active' : ''}`}
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
              {item.counter && counters[item.counter] > 0 && (
                <span className="adm-nav-badge">{counters[item.counter]}</span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="adm-side-foot">
          <div className="adm-side-user">
            <span className="adm-side-avatar">{(admin.email || 'A')[0].toUpperCase()}</span>
            <div>
              <strong>{admin.name || 'Administrator'}</strong>
              <span>{admin.email}</span>
            </div>
          </div>
          <button type="button" className="adm-btn adm-btn-ghost" onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </aside>

      <div className="adm-main">
        <header className="adm-topbar">
          <button
            type="button"
            className="adm-burger"
            aria-label="Open menu"
            onClick={() => setDrawerOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>

          <div className="adm-topbar-meta">
            <span className="adm-topbar-status">
              <span className="adm-status-dot" /> Connected
            </span>
            {summary.unread > 0 && (
              <button
                type="button"
                className="adm-topbar-pill"
                onClick={() => navigate('/admin/submissions?status=new')}
              >
                {summary.unread} new submission{summary.unread === 1 ? '' : 's'}
              </button>
            )}
          </div>
        </header>

        <main className="adm-content">
          <Outlet context={{ summary, refreshSummary }} />
        </main>
      </div>

      <button
        type="button"
        className="adm-backdrop"
        aria-hidden={!drawerOpen}
        tabIndex={-1}
        onClick={() => setDrawerOpen(false)}
      />
    </div>
  )
}

function labelType(type) {
  switch (type) {
    case 'quote':
      return 'Quote'
    case 'contact':
      return 'Contact'
    case 'hajj':
      return 'Hajj'
    default:
      return 'Submission'
  }
}
