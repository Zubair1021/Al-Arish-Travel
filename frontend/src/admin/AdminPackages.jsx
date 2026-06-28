import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  createPackage,
  deletePackage,
  fetchAdminPackages,
  setPackageFeatured,
  setPackageVisibility,
  updatePackage,
} from '../api/packages'
import { resolvePackageImage } from '../components/packages/packageImages'
import { PRESET_OPTIONS } from './adminConstants'
import { useToast } from './ToastContext'
import { useConfirm } from '../context/ConfirmContext'
import Loader from './components/Loader'
import Pagination from './components/Pagination'
import Select from '../components/ui/Select'

const EMPTY_FORM = {
  name: '',
  category: '',
  tag: '',
  imageKind: 'preset',
  imageValue: 'pkg-4star',
  duration: '10 Nights',
  shortDescription: '',
  price: '',
  currency: '£',
  featured: false,
  hidden: false,
  sortOrder: 0,
}

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'visible', label: 'Visible' },
  { value: 'hidden', label: 'Hidden' },
  { value: 'featured', label: 'Featured' },
  { value: 'unfeatured', label: 'Not featured' },
]

const PAGE_SIZE = 9

export default function AdminPackages() {
  const { push } = useToast()
  const confirm = useConfirm()
  const [packages, setPackages] = useState([])
  const [categoryOptions, setCategoryOptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [filters, setFilters] = useState({ search: '', category: 'all', status: 'all' })
  const [page, setPage] = useState(1)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchAdminPackages()
      setPackages(data?.packages || [])
      setCategoryOptions(data?.categories || [])
    } catch (e) {
      push({ title: 'Failed to load packages', body: e.message, tone: 'error' })
    } finally {
      setLoading(false)
    }
  }, [push])

  useEffect(() => {
    load()
  }, [load])

  const categoryLabels = useMemo(
    () =>
      categoryOptions.reduce((acc, cat) => {
        acc[cat.value] = cat.label
        return acc
      }, {}),
    [categoryOptions],
  )

  const featuredCount = useMemo(
    () => packages.filter((p) => p.featured).length,
    [packages],
  )

  const filtered = useMemo(() => {
    const q = filters.search.trim().toLowerCase()
    return packages.filter((pkg) => {
      if (q && !`${pkg.name} ${pkg.shortDescription} ${pkg.tag || ''}`.toLowerCase().includes(q)) {
        return false
      }
      if (filters.category !== 'all' && pkg.category !== filters.category) return false
      switch (filters.status) {
        case 'visible':
          return !pkg.hidden
        case 'hidden':
          return !!pkg.hidden
        case 'featured':
          return !!pkg.featured
        case 'unfeatured':
          return !pkg.featured
        default:
          return true
      }
    })
  }, [packages, filters])

  useEffect(() => {
    setPage(1)
  }, [filters])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page],
  )

  const startCreate = () => {
    setForm({
      ...EMPTY_FORM,
      category: categoryOptions[0]?.value || '',
    })
    setEditing('new')
  }

  const startEdit = (pkg) => {
    setForm({
      name: pkg.name,
      category: pkg.category,
      tag: pkg.tag || '',
      imageKind: pkg.imageKind || 'preset',
      imageValue: pkg.imageValue || 'pkg-4star',
      duration: pkg.duration,
      shortDescription: pkg.shortDescription,
      price: pkg.price,
      currency: pkg.currency || '£',
      featured: !!pkg.featured,
      hidden: !!pkg.hidden,
      sortOrder: pkg.sortOrder || 0,
    })
    setEditing(pkg._id)
  }

  const cancelEdit = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
  }

  const handleSave = async (event) => {
    event.preventDefault()
    if (saving) return
    setSaving(true)
    const payload = {
      ...form,
      price: Number(form.price),
      sortOrder: Number(form.sortOrder) || 0,
    }
    try {
      if (editing === 'new') {
        await createPackage(payload)
        push({ title: 'Package created', tone: 'success' })
      } else {
        await updatePackage(editing, payload)
        push({ title: 'Package updated', tone: 'success' })
      }
      cancelEdit()
      load()
    } catch (e) {
      push({ title: 'Save failed', body: e.message, tone: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const toggleVisibility = async (pkg) => {
    try {
      await setPackageVisibility(pkg._id, !pkg.hidden)
      load()
    } catch (e) {
      push({ title: 'Update failed', body: e.message, tone: 'error' })
    }
  }

  const toggleFeatured = async (pkg) => {
    try {
      await setPackageFeatured(pkg._id, !pkg.featured)
      push({
        title: !pkg.featured ? 'Added to featured' : 'Removed from featured',
        tone: 'success',
      })
      load()
    } catch (e) {
      push({ title: 'Update failed', body: e.message, tone: 'error' })
    }
  }

  const remove = async (pkg) => {
    const ok = await confirm({
      title: `Delete "${pkg.name}"?`,
      message: 'This cannot be undone.',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
      tone: 'danger',
    })
    if (!ok) return
    try {
      await deletePackage(pkg._id)
      push({ title: 'Package deleted', tone: 'success' })
      load()
    } catch (e) {
      push({ title: 'Delete failed', body: e.message, tone: 'error' })
    }
  }

  const resetFilters = () => setFilters({ search: '', category: 'all', status: 'all' })

  return (
    <div className="adm-page">
      <header className="adm-page-head">
        <div>
          <h1>Packages</h1>
          <p>Manage Umrah packages. Featured packages ({featuredCount}/4) appear on the homepage.</p>
        </div>
        {editing === null && (
          <button type="button" className="adm-btn adm-btn-primary" onClick={startCreate}>
            + New package
          </button>
        )}
      </header>

      {editing !== null ? (
        <PackageForm
          form={form}
          setForm={setForm}
          onSubmit={handleSave}
          onCancel={cancelEdit}
          saving={saving}
          isNew={editing === 'new'}
          featuredCount={featuredCount}
          categoryOptions={categoryOptions}
        />
      ) : (
        <>
          <div className="adm-panel adm-filters">
            <label className="adm-field adm-filter-field adm-filter-search">
              <span>Search</span>
              <input
                value={filters.search}
                placeholder="Search by name or description…"
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </label>
            <div className="adm-field adm-filter-field">
              <span>Category</span>
              <Select
                theme="admin"
                value={filters.category}
                onChange={(v) => setFilters({ ...filters, category: v })}
                options={[
                  { value: 'all', label: 'All categories' },
                  ...categoryOptions.map(({ value, label }) => ({ value, label })),
                ]}
                ariaLabel="Filter by category"
              />
            </div>
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
            <div className="adm-filter-actions">
              <button type="button" className="adm-btn adm-btn-ghost" onClick={resetFilters}>
                Reset
              </button>
            </div>
          </div>

          {loading ? (
            <Loader label="Loading packages…" />
          ) : filtered.length === 0 ? (
            <div className="adm-panel adm-empty">
              <p>No packages match these filters.</p>
              {packages.length === 0 && (
                <button type="button" className="adm-btn adm-btn-primary" onClick={startCreate}>
                  Add your first package
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="adm-pkg-grid">
                {paged.map((pkg) => (
                  <article key={pkg._id} className={`adm-pkg-card${pkg.hidden ? ' is-hidden' : ''}`}>
                    <div className="adm-pkg-media">
                      <img
                        src={resolvePackageImage({ imageKind: pkg.imageKind, imageValue: pkg.imageValue })}
                        alt={pkg.name}
                      />
                      <div className="adm-pkg-flags">
                        {pkg.featured && <span className="adm-chip adm-chip-amber">Featured</span>}
                        {pkg.hidden && <span className="adm-chip adm-chip-gray">Hidden</span>}
                      </div>
                    </div>
                    <div className="adm-pkg-body">
                      <div className="adm-pkg-head">
                        <h3>{pkg.name}</h3>
                        <span className="adm-pkg-price">
                          {pkg.currency}{Number(pkg.price).toLocaleString()}
                        </span>
                      </div>
                      <p className="adm-pkg-meta">
                        {categoryLabels[pkg.category] || pkg.category} · {pkg.duration}
                      </p>
                      <p className="adm-pkg-desc">{pkg.shortDescription}</p>
                      <div className="adm-pkg-actions">
                        <button type="button" className="adm-btn adm-btn-ghost" onClick={() => startEdit(pkg)}>
                          Edit
                        </button>
                        <button
                          type="button"
                          className="adm-btn adm-btn-ghost"
                          onClick={() => toggleFeatured(pkg)}
                          disabled={!pkg.featured && featuredCount >= 4}
                          title={!pkg.featured && featuredCount >= 4 ? 'Maximum 4 featured packages' : ''}
                        >
                          {pkg.featured ? 'Unfeature' : 'Feature'}
                        </button>
                        <button type="button" className="adm-btn adm-btn-ghost" onClick={() => toggleVisibility(pkg)}>
                          {pkg.hidden ? 'Unhide' : 'Hide'}
                        </button>
                        <button type="button" className="adm-btn adm-btn-danger" onClick={() => remove(pkg)}>
                          Delete
                        </button>
                      </div>
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

function PackageForm({ form, setForm, onSubmit, onCancel, saving, isNew, featuredCount, categoryOptions }) {
  const update = (key) => (event) => {
    const value =
      event.target.type === 'checkbox' ? event.target.checked : event.target.value
    setForm((f) => ({ ...f, [key]: value }))
  }

  const previewImage = resolvePackageImage({
    imageKind: form.imageKind,
    imageValue: form.imageValue,
  })

  const featuredDisabled = !form.featured && featuredCount >= 4

  return (
    <form className="adm-panel adm-form" onSubmit={onSubmit}>
      <div className="adm-form-head">
        <h2>{isNew ? 'New package' : 'Edit package'}</h2>
        <p>Choose one of the four built-in images, or paste an image URL.</p>
      </div>

      <div className="adm-form-grid">
        <label className="adm-field">
          <span>Package name</span>
          <input value={form.name} onChange={update('name')} required maxLength={80} />
        </label>

        <div className="adm-field">
          <span>Category</span>
          <Select
            theme="admin"
            value={form.category}
            onChange={(v) => setForm((f) => ({ ...f, category: v }))}
            options={categoryOptions.map(({ value, label }) => ({ value, label }))}
            ariaLabel="Category"
            placeholder="Select category"
          />
        </div>

        <label className="adm-field">
          <span>Tag (optional)</span>
          <input value={form.tag} onChange={update('tag')} placeholder="e.g. Best Value" maxLength={30} />
        </label>

        <label className="adm-field">
          <span>Duration</span>
          <input value={form.duration} onChange={update('duration')} required placeholder="e.g. 10 Nights" />
        </label>

        <label className="adm-field">
          <span>Price (number)</span>
          <input
            type="number"
            min="0"
            step="1"
            value={form.price}
            onChange={update('price')}
            required
          />
        </label>

        <label className="adm-field">
          <span>Currency</span>
          <input value={form.currency} onChange={update('currency')} maxLength={3} />
        </label>

        <label className="adm-field adm-field-wide">
          <span>Short description</span>
          <textarea
            value={form.shortDescription}
            onChange={update('shortDescription')}
            rows={3}
            required
            maxLength={240}
          />
        </label>

        <fieldset className="adm-field adm-field-wide adm-fieldset">
          <legend>Package image</legend>
          <div className="adm-image-tabs">
            <label className={`adm-image-tab${form.imageKind === 'preset' ? ' is-active' : ''}`}>
              <input
                type="radio"
                name="imageKind"
                value="preset"
                checked={form.imageKind === 'preset'}
                onChange={() => setForm((f) => ({ ...f, imageKind: 'preset', imageValue: 'pkg-4star' }))}
              />
              Built-in image
            </label>
            <label className={`adm-image-tab${form.imageKind === 'url' ? ' is-active' : ''}`}>
              <input
                type="radio"
                name="imageKind"
                value="url"
                checked={form.imageKind === 'url'}
                onChange={() => setForm((f) => ({ ...f, imageKind: 'url', imageValue: '' }))}
              />
              Image URL
            </label>
          </div>

          {form.imageKind === 'preset' ? (
            <div className="adm-preset-grid">
              {PRESET_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`adm-preset${form.imageValue === opt.value ? ' is-active' : ''}`}
                  onClick={() => setForm((f) => ({ ...f, imageValue: opt.value }))}
                >
                  <img src={resolvePackageImage({ imageKind: 'preset', imageValue: opt.value })} alt={opt.label} />
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          ) : (
            <label className="adm-field">
              <span>Image URL (https://…)</span>
              <input
                type="url"
                placeholder="https://example.com/image.jpg"
                value={form.imageValue}
                onChange={update('imageValue')}
                required
              />
            </label>
          )}

          <div className="adm-image-preview">
            <span className="adm-muted">Preview</span>
            <div className="adm-image-preview-frame">
              {previewImage ? <img src={previewImage} alt="preview" /> : <span className="adm-muted">No image</span>}
            </div>
          </div>
        </fieldset>

        <label className="adm-field adm-checkbox" title={featuredDisabled ? 'Maximum 4 featured packages' : ''}>
          <input
            type="checkbox"
            checked={form.featured}
            disabled={featuredDisabled}
            onChange={update('featured')}
          />
          <span>Show on homepage (featured)</span>
        </label>

        <label className="adm-field adm-checkbox">
          <input type="checkbox" checked={form.hidden} onChange={update('hidden')} />
          <span>Hide from website</span>
        </label>

        <label className="adm-field">
          <span>Sort order</span>
          <input
            type="number"
            value={form.sortOrder}
            onChange={update('sortOrder')}
            step="1"
          />
        </label>
      </div>

      <div className="adm-form-actions">
        <button type="button" className="adm-btn adm-btn-ghost" onClick={onCancel} disabled={saving}>
          Cancel
        </button>
        <button type="submit" className="adm-btn adm-btn-primary" disabled={saving}>
          {saving ? 'Saving…' : isNew ? 'Create package' : 'Save changes'}
        </button>
      </div>
    </form>
  )
}
