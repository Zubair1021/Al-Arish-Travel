import { useId } from 'react'
import './loader.css'

export default function Loader({
  size = 40,
  label = 'Loading packages…',
  block = true,
  className = '',
}) {
  const gradId = useId().replace(/:/g, '')
  const dim = `${size}px`

  const inner = (
    <span className={`site-loader ${className}`.trim()} role="status" aria-live="polite">
      <span
        className="site-loader-spinner"
        style={{ width: dim, height: dim }}
        aria-hidden="true"
      >
        <svg viewBox="0 0 50 50" width={size} height={size}>
          <circle
            cx="25"
            cy="25"
            r="20"
            fill="none"
            strokeWidth="4"
            strokeLinecap="round"
            stroke="rgba(13, 51, 38, 0.1)"
          />
          <circle
            cx="25"
            cy="25"
            r="20"
            fill="none"
            strokeWidth="4"
            strokeLinecap="round"
            stroke={`url(#site-loader-grad-${gradId})`}
            strokeDasharray="60 200"
          />
          <defs>
            <linearGradient id={`site-loader-grad-${gradId}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#c8a24a" />
              <stop offset="100%" stopColor="#18493a" />
            </linearGradient>
          </defs>
        </svg>
      </span>
      {label && <span className="site-loader-label">{label}</span>}
    </span>
  )

  if (!block) return inner
  return <div className="site-loader-block">{inner}</div>
}
