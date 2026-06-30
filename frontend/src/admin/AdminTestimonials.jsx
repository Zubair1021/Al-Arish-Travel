import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  createTestimonial,
  deleteTestimonial,
  fetchAdminTestimonials,
  setTestimonialVisibility,
  updateTestimonial,
} from '../api/testimonials'
import { ACCENT_PRESETS, getInitials } from '../components/testimonials/testimonialData'
import Loader from './components/Loader'
import Pagination from './components/Pagination'
import Select from '../components/ui/Select'
import { useToast } from './ToastContext'
import { useConfirm } from '../context/ConfirmContext'

const EMPTY_FORM = {
  name: '',
  location: '',
  rating: 5,
  review: '',
  photo: '',
  accentPreset: 'green',
  accentPrimary: '#1f6b50',
  accentSecondary: '#0d3326',
  sortOrder: 0,
  hidden: false,
}

function presetFromColors(primary, secondary) {
  const match = ACCENT_PRESETS.find(
    (p) => p.accent[0] === primary && p.accent[1] === secondary,
  )
  return match?.id || 'custom'
}

const STATUS_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'live', label: 'Live on website' },
  { value: 'hidden', label: 'Hidden' },
]

const RATING_OPTIONS = [
  { value: 'all', label: 'All ratings' },
  { value: '5', label: '5 stars' },
  { value: '4', label: '4 stars' },
  { value: '3', label: '3 stars' },
  { value: '2', label: '2 stars' },
  { value: '1', label: '1 star' },
]

const PAGE_SIZE = 6

export default function AdminTestimonials() {
  const { push } = useToast()
  const confirm = useConfirm()
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [filters, setFilters] = useState({ search: '', status: 'all', rating: 'all' })
  const [page, setPage] = useState(1)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchAdminTestimonials()
      setTestimonials(data?.testimonials || [])
    } catch (e) {
      push({ title: 'Failed to load testimonials', body: e.message, tone: 'error' })
    } finally {
      setLoading(false)
    }
  }, [push])

  useEffect(() => {
    load()
  }, [load])

  const sorted = useMemo(
    () => [...testimonials].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)),
    [testimonials],
  )

  const filtered = useMemo(() => {
    const q = filters.search.trim().toLowerCase()
    return sorted.filter((item) => {
      if (
        q &&
        !`${item.name} ${item.location} ${item.review}`.toLowerCase().includes(q)
      ) {
        return false
      }
      if (filters.status === 'live' && item.hidden) return false
      if (filters.status === 'hidden' && !item.hidden) return false
      if (filters.rating !== 'all' && String(item.rating) !== filters.rating) return false
      return true
    })
  }, [sorted, filters])

  useEffect(() => {
    setPage(1)
  }, [filters])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page],
  )

  const resetFilters = () => setFilters({ search: '', status: 'all', rating: 'all' })

  const startCreate = () => {
    setForm({
      ...EMPTY_FORM,
      sortOrder: testimonials.length
        ? Math.max(...testimonials.map((t) => t.sortOrder || 0)) + 1
        : 1,
    })
    setEditing('new')
  }

  const startEdit = (item) => {
    const preset = presetFromColors(item.accentPrimary, item.accentSecondary)
    setForm({
      name: item.name,
      location: item.location,
      rating: item.rating,
      review: item.review,
      photo: item.photo || '',
      accentPreset: preset,
      accentPrimary: item.accentPrimary,
      accentSecondary: item.accentSecondary,
      sortOrder: item.sortOrder || 0,
      hidden: !!item.hidden,
    })
    setEditing(item._id)
  }

  const cancelEdit = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
  }

  const applyAccentPreset = (presetId) => {
    if (presetId === 'custom') {
      setForm((f) => ({ ...f, accentPreset: 'custom' }))
      return
    }
    const preset = ACCENT_PRESETS.find((p) => p.id === presetId)
    if (!preset) return
    setForm((f) => ({
      ...f,
      accentPreset: presetId,
      accentPrimary: preset.accent[0],
      accentSecondary: preset.accent[1],
    }))
  }

  const handleSave = async (event) => {
    event.preventDefault()
    if (saving) return
    setSaving(true)
    const payload = {
      name: form.name,
      location: form.location,
      rating: Math.min(5, Math.max(1, Number(form.rating) || 5)),
      review: form.review,
      photo: form.photo,
      accentPrimary: form.accentPrimary,
      accentSecondary: form.accentSecondary,
      sortOrder: Number(form.sortOrder) || 0,
      hidden: form.hidden,
    }
    try {
      if (editing === 'new') {
        await createTestimonial(payload)
        push({ title: 'Testimonial published', tone: 'success' })
      } else {
        await updateTestimonial(editing, payload)
        push({ title: 'Testimonial updated', tone: 'success' })
      }
      cancelEdit()
      load()
    } catch (e) {
      push({ title: 'Save failed', body: e.message, tone: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const toggleVisibility = async (item) => {
    try {
      await setTestimonialVisibility(item._id, !item.hidden)
      push({
        title: item.hidden ? 'Testimonial published' : 'Testimonial hidden',
        tone: 'success',
      })
      load()
    } catch (e) {
      push({ title: 'Update failed', body: e.message, tone: 'error' })
    }
  }

  const remove = async (item) => {
    const ok = await confirm({
      title: `Delete review from "${item.name}"?`,
      message: 'This cannot be undone.',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
      tone: 'danger',
    })
    if (!ok) return
    try {
      await deleteTestimonial(item._id)
      push({ title: 'Testimonial deleted', tone: 'success' })
      load()
    } catch (e) {
      push({ title: 'Delete failed', body: e.message, tone: 'error' })
    }
  }

  return (
    <div className="adm-page">
      <header className="adm-page-head">
        <div>
          <h1>Testimonials</h1>
          <p>Manage pilgrim reviews shown on the homepage and about page.</p>
        </div>
        {editing === null && (
          <button type="button" className="adm-btn adm-btn-primary" onClick={startCreate}>
            + New testimonial
          </button>
        )}
      </header>

      {editing !== null ? (
        <form className="adm-panel adm-form" onSubmit={handleSave}>
          <div className="adm-form-head">
            <h2>{editing === 'new' ? 'New testimonial' : 'Edit testimonial'}</h2>
            <p>Reviews are published on the website unless marked as hidden.</p>
          </div>

          <div className="adm-form-grid">
            <label className="adm-field">
              <span>Name</span>
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
                maxLength={80}
                placeholder="e.g. Ahmed Khan"
              />
            </label>

            <label className="adm-field">
              <span>Location</span>
              <input
                value={form.location}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                required
                maxLength={80}
                placeholder="e.g. London, UK"
              />
            </label>

            <div className="adm-field">
              <span>Rating (1–5)</span>
              <Select
                theme="admin"
                value={String(form.rating)}
                onChange={(v) => setForm((f) => ({ ...f, rating: Number(v) }))}
                options={[5, 4, 3, 2, 1].map((n) => ({
                  value: String(n),
                  label: `${n} ${n === 1 ? 'star' : 'stars'}`,
                }))}
                ariaLabel="Rating"
              />
            </div>

            <label className="adm-field">
              <span>Sort order</span>
              <input
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) || 0 }))}
                step="1"
              />
            </label>

            <label className="adm-field adm-field-wide">
              <span>Review</span>
              <textarea
                value={form.review}
                onChange={(e) => setForm((f) => ({ ...f, review: e.target.value }))}
                rows={4}
                required
                maxLength={500}
                placeholder="The pilgrim's review…"
              />
            </label>

            <label className="adm-field adm-field-wide">
              <span>Photo URL (optional)</span>
              <input
                type="url"
                value={form.photo}
                onChange={(e) => setForm((f) => ({ ...f, photo: e.target.value }))}
                placeholder="https://…"
              />
            </label>

            <div className="adm-field adm-field-wide">
              <span>Avatar colour</span>
              <Select
                theme="admin"
                value={form.accentPreset}
                onChange={applyAccentPreset}
                options={[
                  ...ACCENT_PRESETS.map((p) => ({ value: p.id, label: p.label })),
                  { value: 'custom', label: 'Custom' },
                ]}
                ariaLabel="Avatar colour"
              />
            </div>

            {form.accentPreset === 'custom' && (
              <>
                <label className="adm-field">
                  <span>Colour start</span>
                  <input
                    type="color"
                    className="adm-color-input"
                    value={form.accentPrimary}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, accentPrimary: e.target.value }))
                    }
                  />
                </label>

                <label className="adm-field">
                  <span>Colour end</span>
                  <input
                    type="color"
                    className="adm-color-input"
                    value={form.accentSecondary}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, accentSecondary: e.target.value }))
                    }
                  />
                </label>
              </>
            )}

            <label className="adm-field adm-checkbox">
              <input
                type="checkbox"
                checked={form.hidden}
                onChange={(e) => setForm((f) => ({ ...f, hidden: e.target.checked }))}
              />
              <span>Hide from website</span>
            </label>
          </div>

          <div className="adm-tst-preview adm-panel">
            <span className="adm-muted">Preview</span>
            <div className="adm-tst-preview-card">
              <p className="adm-tst-preview-review">{form.review || 'Review text…'}</p>
              <div className="adm-tst-preview-person">
                <span
                  className="adm-tst-preview-avatar"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${form.accentPrimary}, ${form.accentSecondary})`,
                  }}
                >
                  {form.photo ? (
                    <img src={form.photo} alt="" />
                  ) : (
                    getInitials(form.name || 'AA')
                  )}
                </span>
                <span>
                  <strong>{form.name || 'Name'}</strong>
                  <span className="adm-muted">{form.location || 'Location'}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="adm-form-actions">
            <button type="button" className="adm-btn adm-btn-ghost" onClick={cancelEdit} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="adm-btn adm-btn-primary" disabled={saving}>
              {saving ? 'Saving…' : editing === 'new' ? 'Publish testimonial' : 'Save changes'}
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="adm-panel adm-filters">
            <label className="adm-field adm-filter-field adm-filter-search">
              <span>Search</span>
              <input
                value={filters.search}
                placeholder="Search by name, location or review…"
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </label>
            <div className="adm-field adm-filter-field">
              <span>Status</span>
              <Select
                theme="admin"
                value={filters.status}
                onChange={(v) => setFilters({ ...filters, status: v })}
                options={STATUS_OPTIONS}
                ariaLabel="Filter by status"
              />
            </div>
            <div className="adm-field adm-filter-field">
              <span>Rating</span>
              <Select
                theme="admin"
                value={filters.rating}
                onChange={(v) => setFilters({ ...filters, rating: v })}
                options={RATING_OPTIONS}
                ariaLabel="Filter by rating"
              />
            </div>
            <div className="adm-filter-actions">
              <button type="button" className="adm-btn adm-btn-ghost" onClick={resetFilters}>
                Reset
              </button>
            </div>
          </div>

          {loading ? (
            <Loader label="Loading testimonials…" />
          ) : filtered.length === 0 ? (
            <div className="adm-panel adm-empty">
              <p>
                {testimonials.length === 0
                  ? 'No testimonials yet.'
                  : 'No testimonials match these filters.'}
              </p>
              {testimonials.length === 0 && (
                <button type="button" className="adm-btn adm-btn-primary" onClick={startCreate}>
                  Add your first review
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="adm-tst-grid">
                {paged.map((item) => (
                  <article key={item._id} className={`adm-tst-card${item.hidden ? ' is-hidden' : ''}`}>
                    <div className="adm-tst-card-top">
                      <span
                        className="adm-tst-card-avatar"
                        style={{
                          backgroundImage: `linear-gradient(135deg, ${item.accentPrimary}, ${item.accentSecondary})`,
                        }}
                      >
                        {item.photo ? (
                          <img src={item.photo} alt="" />
                        ) : (
                          getInitials(item.name)
                        )}
                      </span>
                      <div>
                        <strong>{item.name}</strong>
                        <span className="adm-muted">{item.location}</span>
                        <span className="adm-tst-card-rating">{'★'.repeat(item.rating)}</span>
                      </div>
                      {item.hidden ? (
                        <span className="adm-chip adm-chip-gray">Hidden</span>
                      ) : (
                        <span className="adm-chip adm-chip-green">Live</span>
                      )}
                    </div>
                    <p className="adm-tst-card-review">{item.review}</p>
                    <div className="adm-pkg-actions">
                      <button type="button" className="adm-btn adm-btn-ghost" onClick={() => startEdit(item)}>
                        Edit
                      </button>
                      <button type="button" className="adm-btn adm-btn-ghost" onClick={() => toggleVisibility(item)}>
                        {item.hidden ? 'Publish' : 'Hide'}
                      </button>
                      <button type="button" className="adm-btn adm-btn-danger" onClick={() => remove(item)}>
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              <div className="adm-panel">
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
        </>
      )}
    </div>
  )
}
