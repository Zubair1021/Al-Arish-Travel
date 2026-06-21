import { useEffect, useState } from 'react'
import { STATUS_OPTIONS, STATUS_TONES, TYPE_LABELS } from '../adminConstants'
import Select from '../../components/ui/Select'

function Field({ label, children, wide = false }) {
  return (
    <div className={`adm-sub-field${wide ? ' adm-sub-field-wide' : ''}`}>
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  )
}

export default function SubmissionDetail({ submission, onStatusChange, onSaveNotes, onDelete }) {
  const [noteDraft, setNoteDraft] = useState(submission?.adminNotes || '')
  const [savingNotes, setSavingNotes] = useState(false)

  useEffect(() => {
    setNoteDraft(submission?.adminNotes || '')
  }, [submission?._id, submission?.adminNotes])

  if (!submission) return null

  const handleSaveNotes = async () => {
    setSavingNotes(true)
    try {
      await onSaveNotes?.(submission._id, noteDraft)
    } finally {
      setSavingNotes(false)
    }
  }

  return (
    <div>
      <div className="adm-sub-detail-head">
        <div>
          <span className="adm-chip">{TYPE_LABELS[submission.type] || submission.type}</span>
          <h2>{submission.name}</h2>
          <p className="adm-muted">{new Date(submission.createdAt).toLocaleString()}</p>
        </div>
        <button type="button" className="adm-btn adm-btn-danger" onClick={() => onDelete?.(submission._id)}>
          Delete
        </button>
      </div>

      <dl className="adm-sub-fields">
        <Field label="Email">
          <a href={`mailto:${submission.email}`}>{submission.email}</a>
        </Field>
        {submission.phone && (
          <Field label="Phone">
            <a href={`tel:${submission.phone}`}>{submission.phone}</a>
          </Field>
        )}
        {submission.packageName && <Field label="Package">{submission.packageName}</Field>}
        {submission.packageDuration && <Field label="Duration">{submission.packageDuration}</Field>}
        {submission.packagePrice && <Field label="Guide price">{submission.packagePrice}</Field>}
        {submission.pilgrims && <Field label="Pilgrims">{submission.pilgrims}</Field>}
        {submission.hajjYear && <Field label="Hajj year">{submission.hajjYear}</Field>}
        {submission.message && (
          <Field label="Message" wide>
            <span style={{ whiteSpace: 'pre-wrap' }}>{submission.message}</span>
          </Field>
        )}
      </dl>

      <div className="adm-form-grid">
        <div className="adm-field">
          <span>Status</span>
          <Select
            theme="admin"
            value={submission.status}
            onChange={(v) => onStatusChange?.(submission._id, v)}
            options={STATUS_OPTIONS}
            ariaLabel="Submission status"
          />
        </div>
        <div className="adm-field">
          <span>Current status</span>
          <div>
            <span className={`adm-chip adm-chip-${STATUS_TONES[submission.status] || 'gray'}`}>
              {STATUS_OPTIONS.find((o) => o.value === submission.status)?.label || submission.status}
            </span>
          </div>
        </div>
      </div>

      <label className="adm-field" style={{ marginTop: '0.85rem' }}>
        <span>Internal notes</span>
        <textarea
          rows={4}
          value={noteDraft}
          onChange={(e) => setNoteDraft(e.target.value)}
          placeholder="Track follow-ups, quoted price, next steps…"
        />
      </label>
      <div className="adm-form-actions">
        <button
          type="button"
          className="adm-btn adm-btn-primary"
          onClick={handleSaveNotes}
          disabled={savingNotes}
        >
          {savingNotes ? 'Saving…' : 'Save notes'}
        </button>
      </div>
    </div>
  )
}
