import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  createCategory,
  deleteCategory,
  fetchAdminCategories,
  updateCategory,
} from '../api/categories'
import Loader from './components/Loader'
import { useToast } from './ToastContext'
import { useConfirm } from '../context/ConfirmContext'

const EMPTY_FORM = {
  label: '',
  sortOrder: 0,
  hidden: false,
}

export default function AdminCategories() {
  const { push } = useToast()
  const confirm = useConfirm()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchAdminCategories()
      setCategories(data?.categories || [])
    } catch (e) {
      push({ title: 'Failed to load categories', body: e.message, tone: 'error' })
    } finally {
      setLoading(false)
    }
  }, [push])

  useEffect(() => {
    load()
  }, [load])

  const startCreate = () => {
    setForm({
      ...EMPTY_FORM,
      sortOrder: categories.length ? Math.max(...categories.map((c) => c.sortOrder || 0)) + 1 : 1,
    })
    setEditing('new')
  }

  const startEdit = (cat) => {
    setForm({
      label: cat.label,
      sortOrder: cat.sortOrder || 0,
      hidden: !!cat.hidden,
    })
    setEditing(cat._id)
  }

  const cancelEdit = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
  }

  const handleSave = async (event) => {
    event.preventDefault()
    if (saving) return
    setSaving(true)
    try {
      if (editing === 'new') {
        await createCategory(form)
        push({ title: 'Category created', tone: 'success' })
      } else {
        await updateCategory(editing, form)
        push({ title: 'Category updated', tone: 'success' })
      }
      cancelEdit()
      load()
    } catch (e) {
      push({ title: 'Save failed', body: e.message, tone: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const remove = async (cat) => {
    const ok = await confirm({
      title: `Delete "${cat.label}"?`,
      message:
        cat.packageCount > 0
          ? `This category is used by ${cat.packageCount} package(s). Reassign them before deleting.`
          : 'This cannot be undone.',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
      tone: 'danger',
    })
    if (!ok) return
    try {
      await deleteCategory(cat._id)
      push({ title: 'Category deleted', tone: 'success' })
      load()
    } catch (e) {
      push({ title: 'Delete failed', body: e.message, tone: 'error' })
    }
  }

  const toggleHidden = async (cat) => {
    try {
      await updateCategory(cat._id, { hidden: !cat.hidden })
      push({ title: cat.hidden ? 'Category visible' : 'Category hidden', tone: 'success' })
      load()
    } catch (e) {
      push({ title: 'Update failed', body: e.message, tone: 'error' })
    }
  }

  const sorted = useMemo(
    () => [...categories].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)),
    [categories],
  )

  return (
    <div className="adm-page">
      <header className="adm-page-head">
        <div>
          <h1>Package categories</h1>
          <p>
            Manage category tabs shown on the packages page and assign categories when creating packages.
          </p>
        </div>
        {editing === null && (
          <button type="button" className="adm-btn adm-btn-primary" onClick={startCreate}>
            + New category
          </button>
        )}
      </header>

      {editing !== null ? (
        <form className="adm-panel adm-form" onSubmit={handleSave}>
          <div className="adm-form-head">
            <h2>{editing === 'new' ? 'New category' : 'Edit category'}</h2>
            <p>Categories appear as filter tabs on the website packages page.</p>
          </div>

          <div className="adm-form-grid">
            <label className="adm-field adm-field-wide">
              <span>Display name</span>
              <input
                value={form.label}
                onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
                required
                maxLength={60}
                placeholder="e.g. 5 Star Umrah"
              />
            </label>

            <label className="adm-field">
              <span>Sort order</span>
              <input
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) || 0 }))}
                step="1"
              />
            </label>

            <label className="adm-field adm-checkbox">
              <input
                type="checkbox"
                checked={form.hidden}
                onChange={(e) => setForm((f) => ({ ...f, hidden: e.target.checked }))}
              />
              <span>Hide from website filters</span>
            </label>
          </div>

          <div className="adm-form-actions">
            <button type="button" className="adm-btn adm-btn-ghost" onClick={cancelEdit} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="adm-btn adm-btn-primary" disabled={saving}>
              {saving ? 'Saving…' : editing === 'new' ? 'Create category' : 'Save changes'}
            </button>
          </div>
        </form>
      ) : loading ? (
        <Loader label="Loading categories…" />
      ) : sorted.length === 0 ? (
        <div className="adm-panel adm-empty">
          <p>No categories yet.</p>
          <button type="button" className="adm-btn adm-btn-primary" onClick={startCreate}>
            Add your first category
          </button>
        </div>
      ) : (
        <div className="adm-panel">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Slug</th>
                <th>Packages</th>
                <th>Order</th>
                <th>Status</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {sorted.map((cat) => (
                <tr key={cat._id}>
                  <td>
                    <strong>{cat.label}</strong>
                  </td>
                  <td>
                    <code>{cat.slug}</code>
                  </td>
                  <td>{cat.packageCount || 0}</td>
                  <td>{cat.sortOrder ?? 0}</td>
                  <td>
                    {cat.hidden ? (
                      <span className="adm-chip adm-chip-gray">Hidden</span>
                    ) : (
                      <span className="adm-chip adm-chip-green">Visible</span>
                    )}
                  </td>
                  <td>
                    <div className="adm-pkg-actions">
                      <button type="button" className="adm-btn adm-btn-ghost" onClick={() => startEdit(cat)}>
                        Edit
                      </button>
                      <button type="button" className="adm-btn adm-btn-ghost" onClick={() => toggleHidden(cat)}>
                        {cat.hidden ? 'Show' : 'Hide'}
                      </button>
                      <button
                        type="button"
                        className="adm-btn adm-btn-danger"
                        onClick={() => remove(cat)}
                        disabled={cat.packageCount > 0}
                        title={cat.packageCount > 0 ? 'Reassign packages before deleting' : ''}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
