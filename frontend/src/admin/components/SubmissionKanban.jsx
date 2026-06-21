import { useState } from 'react'
import { STATUS_OPTIONS, STATUS_TONES, TYPE_LABELS } from '../adminConstants'

function timeAgo(iso) {
  if (!iso) return ''
  const diff = Date.now() - new Date(iso).getTime()
  if (diff < 60_000) return 'just now'
  if (diff < 3600_000) return `${Math.floor(diff / 60_000)}m`
  if (diff < 86_400_000) return `${Math.floor(diff / 3600_000)}h`
  return `${Math.floor(diff / 86_400_000)}d`
}

export default function SubmissionKanban({ submissions, onCardClick, onStatusChange }) {
  const [dragging, setDragging] = useState(null)
  const [dropTarget, setDropTarget] = useState(null)

  const grouped = STATUS_OPTIONS.reduce((acc, status) => {
    acc[status.value] = submissions.filter((s) => s.status === status.value)
    return acc
  }, {})

  const handleDragStart = (event, sub) => {
    setDragging(sub._id)
    event.dataTransfer.setData('text/plain', sub._id)
    event.dataTransfer.effectAllowed = 'move'
  }
  const handleDragEnd = () => {
    setDragging(null)
    setDropTarget(null)
  }
  const handleDragOver = (event, status) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
    if (dropTarget !== status) setDropTarget(status)
  }
  const handleDragLeave = (status) => {
    if (dropTarget === status) setDropTarget(null)
  }
  const handleDrop = (event, status) => {
    event.preventDefault()
    const id = event.dataTransfer.getData('text/plain')
    setDropTarget(null)
    setDragging(null)
    if (!id) return
    const sub = submissions.find((s) => s._id === id)
    if (!sub || sub.status === status) return
    onStatusChange?.(id, status)
  }

  return (
    <div className="adm-kanban" role="list">
      {STATUS_OPTIONS.map((status) => {
        const list = grouped[status.value] || []
        return (
          <section
            key={status.value}
            role="listitem"
            className={`adm-kanban-col${dropTarget === status.value ? ' is-drop' : ''}`}
            onDragOver={(e) => handleDragOver(e, status.value)}
            onDragLeave={() => handleDragLeave(status.value)}
            onDrop={(e) => handleDrop(e, status.value)}
            aria-label={`${status.label} column`}
          >
            <header className="adm-kanban-head">
              <h3>
                <span
                  className={`adm-dot adm-dot-${STATUS_TONES[status.value] || 'gray'}`}
                  aria-hidden="true"
                />
                {status.label}
              </h3>
              <span className="adm-kanban-count">{list.length}</span>
            </header>
            <div className="adm-kanban-list">
              {list.length === 0 ? (
                <p className="adm-kanban-empty">Drop submissions here</p>
              ) : (
                list.map((sub) => (
                  <article
                    key={sub._id}
                    className={`adm-kanban-card${dragging === sub._id ? ' is-dragging' : ''}${sub.read ? '' : ' is-unread'}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, sub)}
                    onDragEnd={handleDragEnd}
                    onClick={() => onCardClick?.(sub)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        onCardClick?.(sub)
                      }
                    }}
                  >
                    <div className="adm-kanban-card-top">
                      <span className="adm-kanban-card-name">{sub.name}</span>
                      <span className="adm-chip">{TYPE_LABELS[sub.type] || sub.type}</span>
                    </div>
                    <div className="adm-kanban-card-meta">
                      <span>{sub.email}</span>
                      {sub.phone && <span>{sub.phone}</span>}
                    </div>
                    {sub.packageName && (
                      <div className="adm-kanban-card-meta">
                        <span>📦 {sub.packageName}</span>
                      </div>
                    )}
                    {sub.message && <p className="adm-kanban-card-msg">{sub.message}</p>}
                    <div className="adm-kanban-card-foot">
                      <span>{timeAgo(sub.createdAt)} ago</span>
                      {sub.adminNotes && <span title={sub.adminNotes}>📝 Notes</span>}
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>
        )
      })}
    </div>
  )
}
