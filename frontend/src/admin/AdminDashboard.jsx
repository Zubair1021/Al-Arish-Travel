import { useEffect, useState } from 'react'
import { Link, useNavigate, useOutletContext } from 'react-router-dom'
import { fetchSubmissions } from '../api/submissions'
import { STATUS_LABELS, STATUS_TONES, TYPE_LABELS } from './adminConstants'
import Loader from './components/Loader'
import SubmissionListCards from './components/SubmissionListCards'

export default function AdminDashboard() {
  const { summary } = useOutletContext()
  const navigate = useNavigate()
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    fetchSubmissions({ limit: 6 })
      .then((data) => {
        if (!cancelled) setRecent(data?.submissions || [])
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const tiles = [
    { label: 'Total submissions', value: summary.total },
    { label: 'New (unread)', value: summary.unread, accent: 'amber' },
    { label: 'Quote requests', value: summary.byType?.quote || 0 },
    { label: 'Contact messages', value: summary.byType?.contact || 0 },
    { label: 'Hajj registrations', value: summary.byType?.hajj || 0 },
  ]

  return (
    <div className="adm-page">
      <header className="adm-page-head">
        <div>
          <h1>Dashboard</h1>
          <p>Activity at a glance and quick actions.</p>
        </div>
      </header>

      <div className="adm-tiles">
        {tiles.map((tile) => (
          <div key={tile.label} className={`adm-tile${tile.accent ? ` adm-tile-${tile.accent}` : ''}`}>
            <span className="adm-tile-label">{tile.label}</span>
            <span className="adm-tile-value">{tile.value}</span>
          </div>
        ))}
      </div>

      <section className="adm-panel">
        <div className="adm-panel-head">
          <div>
            <h2>Recent submissions</h2>
            <p>Latest enquiries from the website.</p>
          </div>
          <Link className="adm-btn adm-btn-ghost" to="/admin/submissions">View all</Link>
        </div>

        {loading ? (
          <Loader label="Loading recent submissions…" />
        ) : recent.length === 0 ? (
          <p className="adm-muted">No submissions yet.</p>
        ) : (
          <div className="adm-dash-recent">
            <div className="adm-sub-table-wrap">
              <table className="adm-table adm-table-submissions adm-table-dash">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>When</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((s) => (
                    <tr key={s._id} className={s.read ? '' : 'is-unread'}>
                      <td><span className="adm-chip">{TYPE_LABELS[s.type] || s.type}</span></td>
                      <td>{s.name}</td>
                      <td className="adm-muted">{s.email}</td>
                      <td>
                        <span className={`adm-chip adm-chip-${STATUS_TONES[s.status] || 'gray'}`}>
                          {STATUS_LABELS[s.status] || s.status}
                        </span>
                      </td>
                      <td className="adm-muted adm-cell-when">{formatWhen(s.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <SubmissionListCards
              submissions={recent}
              onOpen={() => navigate('/admin/submissions')}
            />
          </div>
        )}
      </section>

      <section className="adm-panel">
        <div className="adm-panel-head">
          <div>
            <h2>Quick links</h2>
            <p>Jump straight to common tasks.</p>
          </div>
        </div>
        <div className="adm-quick-grid">
          <Link to="/admin/packages" className="adm-quick">
            <strong>Manage packages</strong>
            <span>Create, edit, hide or feature packages on the homepage.</span>
          </Link>
          <Link to="/admin/submissions" className="adm-quick">
            <strong>Review submissions</strong>
            <span>Read enquiries, update statuses and contact pilgrims.</span>
          </Link>
          <Link to="/admin/settings" className="adm-quick">
            <strong>Site settings</strong>
            <span>Update WhatsApp number, contact email and address.</span>
          </Link>
        </div>
      </section>
    </div>
  )
}

function formatWhen(iso) {
  if (!iso) return ''
  const date = new Date(iso)
  const diff = Date.now() - date.getTime()
  if (diff < 60_000) return 'just now'
  if (diff < 3600_000) return `${Math.floor(diff / 60_000)}m ago`
  if (diff < 86_400_000) return `${Math.floor(diff / 3600_000)}h ago`
  return date.toLocaleString()
}
