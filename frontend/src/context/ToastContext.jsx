import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import './toast.css'

const ToastContext = createContext({ push: () => {}, dismiss: () => {}, toasts: [] })

let counter = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((t) => t.id !== id))
  }, [])

  const push = useCallback(
    ({ title, body, tone = 'info', duration = 5000 }) => {
      const id = ++counter
      setToasts((current) => [...current, { id, title, body, tone, duration }])
      return id
    },
    [],
  )

  const value = useMemo(() => ({ push, dismiss, toasts }), [push, dismiss, toasts])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}

function ToneIcon({ tone }) {
  const common = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2.2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  }
  switch (tone) {
    case 'success':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="10" />
          <path d="m8 12 3 3 5-6" />
        </svg>
      )
    case 'error':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4" />
          <path d="M12 16h.01" />
        </svg>
      )
    case 'warning':
      return (
        <svg {...common}>
          <path d="m12 3 10 18H2L12 3z" />
          <path d="M12 10v4" />
          <path d="M12 18h.01" />
        </svg>
      )
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>
      )
  }
}

function Toast({ toast, onDismiss }) {
  const { id, title, body, tone, duration } = toast
  const [paused, setPaused] = useState(false)
  const remainingRef = useRef(duration)
  const startedAtRef = useRef(Date.now())
  const timerRef = useRef(null)

  useEffect(() => {
    if (!duration || duration <= 0) return undefined
    if (paused) {
      if (timerRef.current) clearTimeout(timerRef.current)
      remainingRef.current = Math.max(
        0,
        remainingRef.current - (Date.now() - startedAtRef.current),
      )
      return undefined
    }
    startedAtRef.current = Date.now()
    timerRef.current = setTimeout(() => onDismiss(id), remainingRef.current)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [paused, duration, id, onDismiss])

  return (
    <div
      className={`pub-toast pub-toast-${tone}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      role="alert"
    >
      <span className="pub-toast-icon">
        <ToneIcon tone={tone} />
      </span>
      <div className="pub-toast-body">
        {title && <strong>{title}</strong>}
        {body && <span>{body}</span>}
      </div>
      <button
        type="button"
        className="pub-toast-close"
        aria-label="Dismiss notification"
        onClick={() => onDismiss(id)}
      >
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
          <path d="M6 6l12 12" />
          <path d="M18 6l-12 12" />
        </svg>
      </button>
      {duration > 0 && (
        <span
          className="pub-toast-bar"
          aria-hidden="true"
          style={{
            animationDuration: `${duration}ms`,
            animationPlayState: paused ? 'paused' : 'running',
          }}
        />
      )}
    </div>
  )
}

function ToastViewport({ toasts, onDismiss }) {
  return (
    <div className="pub-toast-wrap" aria-live="polite" aria-atomic="false">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
