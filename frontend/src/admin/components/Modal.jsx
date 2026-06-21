import { useEffect } from 'react'

export default function Modal({ open, onClose, title, children, footer, size = 'md' }) {
  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', onKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="adm-modal-root" role="dialog" aria-modal="true" aria-label={title || 'Dialog'}>
      <button
        type="button"
        className="adm-modal-backdrop"
        aria-label="Close dialog"
        onClick={onClose}
        tabIndex={-1}
      />
      <div className={`adm-modal adm-modal-${size}`}>
        {(title || onClose) && (
          <header className="adm-modal-head">
            {title && <h2>{title}</h2>}
            <button
              type="button"
              className="adm-modal-close"
              aria-label="Close"
              onClick={onClose}
            >
              ×
            </button>
          </header>
        )}
        <div className="adm-modal-body">{children}</div>
        {footer && <footer className="adm-modal-foot">{footer}</footer>}
      </div>
    </div>
  )
}
