import { useCallback, useEffect, useMemo, useState } from 'react'
import { useOutletContext, useSearchParams } from 'react-router-dom'
import {
  deleteSubmission,
  fetchSubmissions,
  markAllRead,
  updateSubmissionNotes,
  updateSubmissionStatus,
} from '../api/submissions'
import {
  STATUS_LABELS,
  STATUS_OPTIONS,
  STATUS_TONES,
  TYPE_LABELS,
  TYPE_OPTIONS,
} from './adminConstants'
import { useToast } from './ToastContext'
import Loader from './components/Loader'
import Pagination from './components/Pagination'
import Modal from './components/Modal'
import SubmissionKanban from './components/SubmissionKanban'
import SubmissionDetail from './components/SubmissionDetail'
import Select from '../components/ui/Select'

const PAGE_SIZE = 15

function ViewIcon({ kind }) {
  const common = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  }
  if (kind === 'list') {
    return (
      <svg {...common}>
        <path d="M8 6h13" />
        <path d="M8 12h13" />
        <path d="M8 18h13" />
        <circle cx="4" cy="6" r="1" />
        <circle cx="4" cy="12" r="1" />
        <circle cx="4" cy="18" r="1" />
      </svg>
    )
  }
  return (
    <svg {...common}>
      <rect x="3" y="4" width="5" height="16" rx="1" />
      <rect x="10" y="4" width="5" height="10" rx="1" />
      <rect x="17" y="4" width="4" height="13" rx="1" />
    </svg>
  )
}

export default function AdminSubmissions() {
  const { push } = useToast()
  const { refreshSummary } = useOutletContext()
  const [searchParams, setSearchParams] = useSearchParams()

  const [filters, setFilters] = useState({
    type: searchParams.get('type') || '',
    status: searchParams.get('status') || '',
    search: searchParams.get('search') || '',
  })
  const [view, setView] = useState(searchParams.get('view') || 'list')
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [page, setPage] = useState(1)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchSubmissions({ limit: 500 })
      setSubmissions(data?.submissions || [])
    } catch (e) {
      push({ title: 'Failed to load submissions', body: e.message, tone: 'error' })
    } finally {
      setLoading(false)
    }
  }, [push])

  useEffect(() => {
    load()
  }, [load])

  const updateFilter = (key, value) => {
    setFilters((f) => ({ ...f, [key]: value }))
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    setSearchParams(next, { replace: true })
  }

  const updateView = (next) => {
    setView(next)
    const params = new URLSearchParams(searchParams)
    if (next === 'list') params.delete('view')
    else params.set('view', next)
    setSearchParams(params, { replace: true })
  }

  const filtered = useMemo(() => {
    const q = filters.search.trim().toLowerCase()
    return submissions.filter((s) => {
      if (filters.type && s.type !== filters.type) return false
      if (filters.status && s.status !== filters.status) return false
      if (
        q &&
        !`${s.name} ${s.email} ${s.phone || ''} ${s.message || ''} ${s.packageName || ''}`
          .toLowerCase()
          .includes(q)
      ) {
        return false
      }
      return true
    })
  }, [submissions, filters])

  useEffect(() => {
    setPage(1)
  }, [filters, view])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page],
  )

  const openDetail = (sub) => {
    setSelected(sub)
    setModalOpen(true)
  }
  const closeDetail = () => {
    setModalOpen(false)
  }

  const handleStatusChange = async (id, status) => {
    try {
      const data = await updateSubmissionStatus(id, status)
      setSubmissions((current) => current.map((s) => (s._id === id ? data.submission : s)))
      setSelected((current) => (current && current._id === id ? data.submission : current))
      refreshSummary()
      push({ title: 'Status updated', body: STATUS_LABELS[status], tone: 'success' })
    } catch (e) {
      push({ title: 'Update failed', body: e.message, tone: 'error' })
    }
  }

  const handleSaveNotes = async (id, notes) => {
    try {
      const data = await updateSubmissionNotes(id, notes)
      setSubmissions((current) => current.map((s) => (s._id === id ? data.submission : s)))
      setSelected((current) => (current && current._id === id ? data.submission : current))
      push({ title: 'Notes saved', tone: 'success' })
    } catch (e) {
      push({ title: 'Save failed', body: e.message, tone: 'error' })
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this submission?')) return
    try {
      await deleteSubmission(id)
      setSubmissions((current) => current.filter((s) => s._id !== id))
      setModalOpen(false)
      refreshSummary()
      push({ title: 'Submission deleted', tone: 'success' })
    } catch (e) {
      push({ title: 'Delete failed', body: e.message, tone: 'error' })
    }
  }

  const handleMarkAllRead = async () => {
    try {
      await markAllRead()
      setSubmissions((current) => current.map((s) => ({ ...s, read: true })))
      refreshSummary()
      push({ title: 'Marked all as read', tone: 'success' })
    } catch (e) {
      push({ title: 'Failed', body: e.message, tone: 'error' })
    }
  }

  const resetFilters = () => {
    setFilters({ type: '', status: '', search: '' })
    setSearchParams({}, { replace: true })
  }

  return (
    <div className="adm-page">
      <header className="adm-page-head">
        <div>
          <h1>Submissions</h1>
          <p>Quote, contact and Hajj enquiries from the website.</p>
        </div>
        <div className="adm-filter-actions">
          <div className="adm-view-toggle" role="tablist" aria-label="View mode">
            <button
              type="button"
              role="tab"
              aria-selected={view === 'list'}
              className={view === 'list' ? 'is-active' : ''}
              onClick={() => updateView('list')}
            >
              <ViewIcon kind="list" /> List
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={view === 'kanban'}
              className={view === 'kanban' ? 'is-active' : ''}
              onClick={() => updateView('kanban')}
            >
              <ViewIcon kind="kanban" /> Kanban
            </button>
          </div>
          <button type="button" className="adm-btn adm-btn-ghost" onClick={handleMarkAllRead}>
            Mark all as read
          </button>
        </div>
      </header>

      <div className="adm-panel adm-filters">
        <label className="adm-field adm-filter-field adm-filter-search">
          <span>Search</span>
          <input
            value={filters.search}
            placeholder="Name, email, phone, package or message…"
            onChange={(e) => updateFilter('search', e.target.value)}
          />
        </label>
        <div className="adm-field adm-filter-field">
          <span>Type</span>
          <Select
            theme="admin"
            value={filters.type}
            onChange={(v) => updateFilter('type', v)}
            options={TYPE_OPTIONS.map((opt) => ({ value: opt.value, label: opt.label }))}
            ariaLabel="Filter by type"
          />
        </div>
        <div className="adm-field adm-filter-field">
          <span>Status</span>
          <Select
            theme="admin"
            value={filters.status}
            onChange={(v) => updateFilter('status', v)}
            options={[
              { value: '', label: 'All statuses' },
              ...STATUS_OPTIONS,
            ]}
            ariaLabel="Filter by status"
          />
        </div>
        <div className="adm-filter-actions">
          <button type="button" className="adm-btn adm-btn-ghost" onClick={resetFilters}>
            Reset
          </button>
        </div>
      </div>

      {loading ? (
        <Loader label="Loading submissions…" />
      ) : view === 'kanban' ? (
        <div className="adm-panel" style={{ padding: '0.85rem' }}>
          {filtered.length === 0 ? (
            <div className="adm-empty"><p>No submissions match these filters.</p></div>
          ) : (
            <SubmissionKanban
              submissions={filtered}
              onCardClick={openDetail}
              onStatusChange={handleStatusChange}
            />
          )}
        </div>
      ) : (
        <div className="adm-panel" style={{ padding: '0.4rem 0.4rem 1rem' }}>
          {filtered.length === 0 ? (
            <div className="adm-empty"><p>No submissions match these filters.</p></div>
          ) : (
            <>
              <table className="adm-table adm-table-clickable">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Package</th>
                    <th>Status</th>
                    <th>When</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((s) => (
                    <tr key={s._id} className={s.read ? '' : 'is-unread'} onClick={() => openDetail(s)}>
                      <td><span className="adm-chip">{TYPE_LABELS[s.type] || s.type}</span></td>
                      <td>
                        {!s.read && <span className="adm-dot" aria-label="Unread" />}
                        {s.name}
                      </td>
                      <td className="adm-muted">{s.email}</td>
                      <td className="adm-muted">{s.phone || '—'}</td>
                      <td className="adm-muted">{s.packageName || '—'}</td>
                      <td>
                        <span className={`adm-chip adm-chip-${STATUS_TONES[s.status] || 'gray'}`}>
                          {STATUS_LABELS[s.status] || s.status}
                        </span>
                      </td>
                      <td className="adm-muted">{new Date(s.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ padding: '0 0.85rem' }}>
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                  total={filtered.length}
                  pageSize={PAGE_SIZE}
                />
              </div>
            </>
          )}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={closeDetail}
        title={selected ? `${TYPE_LABELS[selected.type] || selected.type} — ${selected.name}` : 'Submission'}
        size="lg"
      >
        <SubmissionDetail
          submission={selected}
          onStatusChange={handleStatusChange}
          onSaveNotes={handleSaveNotes}
          onDelete={handleDelete}
        />
      </Modal>
    </div>
  )
}
