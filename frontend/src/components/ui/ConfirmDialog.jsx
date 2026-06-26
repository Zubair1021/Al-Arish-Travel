import { useEffect, useRef } from 'react'

function WarningIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 9v4" strokeLinecap="round" />
      <path d="M12 17h.01" strokeLinecap="round" />
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" strokeLinejoin="round" />
    </svg>
  )
}

export default function ConfirmDialog({
  theme = 'public',
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'danger',
  onConfirm,
  onCancel,
}) {
  const cancelRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') onCancel?.()
    }
    document.addEventListener('keydown', onKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    cancelRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [open, onCancel])

  if (!open) return null

  const isAdmin = theme === 'admin'
  const rootClass = isAdmin ? 'adm-confirm-root' : 'confirm-root'
  const dialogClass = isAdmin ? 'adm-confirm' : 'confirm-dialog'
  const confirmClass = isAdmin
    ? `adm-btn ${tone === 'danger' ? 'adm-btn-danger' : 'adm-btn-primary'}`
    : `confirm-btn ${tone === 'danger' ? 'confirm-btn-danger' : 'confirm-btn-primary'}`
  const cancelClass = isAdmin ? 'adm-btn adm-btn-ghost' : 'confirm-btn confirm-btn-ghost'

  return (
    <div className={rootClass} role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-message">
      <button type="button" className={isAdmin ? 'adm-confirm-backdrop' : 'confirm-backdrop'} aria-label="Cancel" onClick={onCancel} tabIndex={-1} />
      <div className={dialogClass}>
        <div className={`${isAdmin ? 'adm-confirm-icon' : 'confirm-icon'}${tone === 'danger' ? ' is-danger' : ''}`}>
          <WarningIcon />
        </div>
        <h2 id="confirm-title" className={isAdmin ? 'adm-confirm-title' : 'confirm-title'}>
          {title}
        </h2>
        {message && (
          <p id="confirm-message" className={isAdmin ? 'adm-confirm-message' : 'confirm-message'}>
            {message}
          </p>
        )}
        <div className={isAdmin ? 'adm-confirm-actions' : 'confirm-actions'}>
          <button ref={cancelRef} type="button" className={cancelClass} onClick={onCancel}>
            {cancelLabel}
          </button>
          <button type="button" className={confirmClass} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
