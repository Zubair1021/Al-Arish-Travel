export default function Loader({ size = 36, label = 'Loading…', block = true }) {
  const dim = `${size}px`
  const inner = (
    <span className="adm-loader" role="status" aria-live="polite">
      <span
        className="adm-loader-spinner"
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
            stroke="rgba(13,51,38,0.12)"
          />
          <circle
            cx="25"
            cy="25"
            r="20"
            fill="none"
            strokeWidth="4"
            strokeLinecap="round"
            stroke="url(#adm-loader-grad)"
            strokeDasharray="60 200"
          />
          <defs>
            <linearGradient id="adm-loader-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#c8a24a" />
              <stop offset="100%" stopColor="#18493a" />
            </linearGradient>
          </defs>
        </svg>
      </span>
      {label && <span className="adm-loader-label">{label}</span>}
    </span>
  )

  if (!block) return inner
  return <div className="adm-loader-block">{inner}</div>
}
