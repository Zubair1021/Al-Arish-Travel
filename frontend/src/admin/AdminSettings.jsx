import { useCallback, useEffect, useState } from 'react'
import { fetchAdminSettings, updateSettings } from '../api/settings'
import { changeAdminPassword } from '../api/auth'
import { useSettings } from '../context/SettingsContext'
import { useToast } from './ToastContext'
import Loader from './components/Loader'

const EMPTY = {
  siteName: '',
  tagline: '',
  email: '',
  phone: '',
  address: '',
  businessHours: '',
  whatsappNumber: '',
  whatsappMessage: '',
  socials: { facebook: '', instagram: '', twitter: '', youtube: '' },
}

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

export default function AdminSettings() {
  const { push } = useToast()
  const { refresh: refreshPublic } = useSettings()
  const [form, setForm] = useState(EMPTY)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' })
  const [showPw, setShowPw] = useState({ currentPassword: false, newPassword: false, confirm: false })

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchAdminSettings()
      if (data?.settings) {
        setForm({ ...EMPTY, ...data.settings, socials: { ...EMPTY.socials, ...(data.settings.socials || {}) } })
      }
    } catch (e) {
      push({ title: 'Failed to load settings', body: e.message, tone: 'error' })
    } finally {
      setLoading(false)
    }
  }, [push])

  useEffect(() => {
    load()
  }, [load])

  const update = (key) => (event) => {
    setForm((f) => ({ ...f, [key]: event.target.value }))
  }

  const updateSocial = (key) => (event) => {
    setForm((f) => ({ ...f, socials: { ...f.socials, [key]: event.target.value } }))
  }

  const handleSave = async (event) => {
    event.preventDefault()
    setSaving(true)
    try {
      await updateSettings(form)
      push({ title: 'Settings saved', body: 'Live site will reflect the changes immediately.', tone: 'success' })
      refreshPublic()
    } catch (e) {
      push({ title: 'Save failed', body: e.message, tone: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordChange = async (event) => {
    event.preventDefault()
    if (pwForm.newPassword !== pwForm.confirm) {
      push({ title: 'Passwords do not match', tone: 'error' })
      return
    }
    try {
      await changeAdminPassword({
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      })
      setPwForm({ currentPassword: '', newPassword: '', confirm: '' })
      push({ title: 'Password updated', tone: 'success' })
    } catch (e) {
      push({ title: 'Update failed', body: e.message, tone: 'error' })
    }
  }

  if (loading) {
    return (
      <div className="adm-page">
        <header className="adm-page-head">
          <div>
            <h1>Site Settings</h1>
            <p>These values appear on the live website (footer, contact page, navbar WhatsApp button).</p>
          </div>
        </header>
        <Loader label="Loading settings…" />
      </div>
    )
  }

  return (
    <div className="adm-page">
      <header className="adm-page-head">
        <div>
          <h1>Site Settings</h1>
          <p>These values appear on the live website (footer, contact page, navbar WhatsApp button).</p>
        </div>
      </header>

      <form className="adm-panel adm-form" onSubmit={handleSave}>
        <div className="adm-form-head">
          <h2>Brand</h2>
          <p>Identity used across the site.</p>
        </div>
        <div className="adm-form-grid">
          <label className="adm-field">
            <span>Site name</span>
            <input value={form.siteName} onChange={update('siteName')} maxLength={60} />
          </label>
          <label className="adm-field adm-field-wide">
            <span>Tagline</span>
            <textarea rows={2} value={form.tagline} onChange={update('tagline')} maxLength={240} />
          </label>
        </div>

        <div className="adm-form-head adm-form-head-sub">
          <h2>Contact</h2>
          <p>Updates the footer, contact page channels and inline links.</p>
        </div>
        <div className="adm-form-grid">
          <label className="adm-field">
            <span>Email</span>
            <input type="email" value={form.email} onChange={update('email')} />
          </label>
          <label className="adm-field">
            <span>Phone</span>
            <input value={form.phone} onChange={update('phone')} placeholder="+44 20 ..." />
          </label>
          <label className="adm-field adm-field-wide">
            <span>Address</span>
            <input value={form.address} onChange={update('address')} />
          </label>
          <label className="adm-field adm-field-wide">
            <span>Business hours</span>
            <input value={form.businessHours} onChange={update('businessHours')} />
          </label>
        </div>

        <div className="adm-form-head adm-form-head-sub">
          <h2>WhatsApp</h2>
          <p>Used for the WhatsApp buttons on every page.</p>
        </div>
        <div className="adm-form-grid">
          <label className="adm-field">
            <span>WhatsApp number (digits only)</span>
            <input
              value={form.whatsappNumber}
              onChange={update('whatsappNumber')}
              placeholder="447712345678"
              inputMode="numeric"
            />
          </label>
          <label className="adm-field adm-field-wide">
            <span>Default message</span>
            <textarea rows={2} value={form.whatsappMessage} onChange={update('whatsappMessage')} />
          </label>
        </div>

        <div className="adm-form-head adm-form-head-sub">
          <h2>Social links (optional)</h2>
          <p>Leave blank to hide the icon on the website.</p>
        </div>
        <div className="adm-form-grid">
          <label className="adm-field"><span>Facebook URL</span><input value={form.socials.facebook} onChange={updateSocial('facebook')} /></label>
          <label className="adm-field"><span>Instagram URL</span><input value={form.socials.instagram} onChange={updateSocial('instagram')} /></label>
          <label className="adm-field"><span>Twitter / X URL</span><input value={form.socials.twitter} onChange={updateSocial('twitter')} /></label>
          <label className="adm-field"><span>YouTube URL</span><input value={form.socials.youtube} onChange={updateSocial('youtube')} /></label>
        </div>

        <div className="adm-form-actions">
          <button type="submit" className="adm-btn adm-btn-primary" disabled={saving}>
            {saving ? 'Saving…' : 'Save settings'}
          </button>
        </div>
      </form>

      <form className="adm-panel adm-form" onSubmit={handlePasswordChange}>
        <div className="adm-form-head">
          <h2>Change password</h2>
          <p>Updates the admin account password. Use at least 8 characters.</p>
        </div>
        <div className="adm-form-grid">
          <label className="adm-field">
            <span>Current password</span>
            <div className="adm-pw-wrap">
              <input
                type={showPw.currentPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={pwForm.currentPassword}
                onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
              />
              <button
                type="button"
                className="adm-pw-toggle"
                aria-label={showPw.currentPassword ? 'Hide current password' : 'Show current password'}
                aria-pressed={showPw.currentPassword}
                onClick={() => setShowPw((v) => ({ ...v, currentPassword: !v.currentPassword }))}
              >
                <EyeIcon off={showPw.currentPassword} />
              </button>
            </div>
          </label>
          <label className="adm-field">
            <span>New password</span>
            <div className="adm-pw-wrap">
              <input
                type={showPw.newPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                minLength={8}
                value={pwForm.newPassword}
                onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
              />
              <button
                type="button"
                className="adm-pw-toggle"
                aria-label={showPw.newPassword ? 'Hide new password' : 'Show new password'}
                aria-pressed={showPw.newPassword}
                onClick={() => setShowPw((v) => ({ ...v, newPassword: !v.newPassword }))}
              >
                <EyeIcon off={showPw.newPassword} />
              </button>
            </div>
          </label>
          <label className="adm-field">
            <span>Confirm new password</span>
            <div className="adm-pw-wrap">
              <input
                type={showPw.confirm ? 'text' : 'password'}
                autoComplete="new-password"
                required
                minLength={8}
                value={pwForm.confirm}
                onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })}
              />
              <button
                type="button"
                className="adm-pw-toggle"
                aria-label={showPw.confirm ? 'Hide confirm password' : 'Show confirm password'}
                aria-pressed={showPw.confirm}
                onClick={() => setShowPw((v) => ({ ...v, confirm: !v.confirm }))}
              >
                <EyeIcon off={showPw.confirm} />
              </button>
            </div>
          </label>
        </div>
        <div className="adm-form-actions">
          <button type="submit" className="adm-btn adm-btn-primary">Update password</button>
        </div>
      </form>
    </div>
  )
}
