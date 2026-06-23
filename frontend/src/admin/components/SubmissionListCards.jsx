import { STATUS_LABELS, STATUS_TONES, TYPE_LABELS } from '../adminConstants'

function formatWhen(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function SubmissionListCards({ submissions, onOpen }) {
  return (
    <ul className="adm-sub-cards" role="list">
      {submissions.map((s) => (
        <li key={s._id}>
          <button
            type="button"
            className={`adm-sub-card${s.read ? '' : ' is-unread'}`}
            onClick={() => onOpen(s)}
          >
            <div className="adm-sub-card-top">
              <span className="adm-chip">{TYPE_LABELS[s.type] || s.type}</span>
              <span className={`adm-chip adm-chip-${STATUS_TONES[s.status] || 'gray'}`}>
                {STATUS_LABELS[s.status] || s.status}
              </span>
            </div>

            <div className="adm-sub-card-name">
              {!s.read && <span className="adm-dot" aria-label="Unread" />}
              <strong>{s.name}</strong>
            </div>

            <dl className="adm-sub-card-meta">
              <div className="adm-sub-card-row">
                <dt>Email</dt>
                <dd>{s.email}</dd>
              </div>
              {s.phone && (
                <div className="adm-sub-card-row">
                  <dt>Phone</dt>
                  <dd>{s.phone}</dd>
                </div>
              )}
              {s.packageName && (
                <div className="adm-sub-card-row">
                  <dt>Package</dt>
                  <dd>{s.packageName}</dd>
                </div>
              )}
              <div className="adm-sub-card-row">
                <dt>When</dt>
                <dd>{formatWhen(s.createdAt)}</dd>
              </div>
            </dl>
          </button>
        </li>
      ))}
    </ul>
  )
}
