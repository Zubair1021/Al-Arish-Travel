import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminAuth } from './AdminAuthContext'
import logo from '../assets/images/logo.png'

function EyeIcon({ off }) {
  if (off) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 3l18 18" />
        <path d="M10.6 6.1A10.9 10.9 0 0 1 12 6c5 0 9 4.5 10 6-0.45 0.68-1.5 2.15-3 3.6" />
        <path d="M6.6 6.6C4.6 8 3.4 9.7 2 12c1 1.5 5 6 10 6 1.7 0 3.2-0.5 4.6-1.3" />
        <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6-10-6-10-6z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

export default function AdminLogin() {
  const navigate = useNavigate()
  const { admin, ready, login, loading, error } = useAdminAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (ready && admin) navigate('/admin', { replace: true })
  }, [admin, ready, navigate])

  const submit = async (event) => {
    event.preventDefault()
    try {
      await login({ email: form.email.trim(), password: form.password })
      navigate('/admin', { replace: true })
    } catch {
      /* error message comes from context */
    }
  }

  return (
    <div className="adm-login">
      <form className="adm-login-card" onSubmit={submit}>
        <div className="adm-login-brand">
          <span className="adm-login-logo">
            <img src={logo} alt="Al Arish Travel" />
          </span>
          <h1>Admin Portal</h1>
          <p>Al Arish Travel</p>
        </div>

        <label className="adm-field">
          <span>Email</span>
          <input
            type="email"
            autoComplete="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@example.com"
          />
        </label>

        <label className="adm-field">
          <span>Password</span>
          <div className="adm-pw-wrap">
            <input
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
            />
            <button
              type="button"
              className="adm-pw-toggle"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showPassword}
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={-1}
            >
              <EyeIcon off={showPassword} />
            </button>
          </div>
        </label>

        {error && <p className="adm-error">{error}</p>}

        <button type="submit" className="adm-btn adm-btn-primary adm-btn-block" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign In'}
        </button>

        <p className="adm-login-foot">Authorised personnel only.</p>

        <p className="adm-credit">
          Developed by{' '}
          <a
            href="https://zubairdeveloper.tech/"
            target="_blank"
            rel="noopener noreferrer"
          >
            ZJ Developers
          </a>
        </p>
      </form>
    </div>
  )
}
