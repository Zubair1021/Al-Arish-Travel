export default function Pagination({ page, totalPages, onPageChange, total, pageSize }) {
  if (totalPages <= 1 && !total) return null

  const goTo = (p) => onPageChange(Math.min(Math.max(1, p), totalPages))

  // Build a compact page list with ellipses (max ~7 buttons)
  const pages = []
  const add = (p) => pages.push(p)
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i += 1) add(i)
  } else {
    add(1)
    if (page > 4) add('…')
    const start = Math.max(2, page - 1)
    const end = Math.min(totalPages - 1, page + 1)
    for (let i = start; i <= end; i += 1) add(i)
    if (page < totalPages - 3) add('…')
    add(totalPages)
  }

  const start = total ? (page - 1) * pageSize + 1 : 0
  const end = total ? Math.min(total, page * pageSize) : 0

  return (
    <div className="adm-pagination">
      {total !== undefined && (
        <span className="adm-pagination-meta">
          {total === 0
            ? 'No results'
            : `Showing ${start.toLocaleString()}–${end.toLocaleString()} of ${total.toLocaleString()}`}
        </span>
      )}
      <div className="adm-pagination-controls">
        <button
          type="button"
          className="adm-pagination-btn"
          onClick={() => goTo(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
        >
          ‹
        </button>
        {pages.map((p, i) =>
          p === '…' ? (
            <span key={`e-${i}`} className="adm-pagination-ellipsis">…</span>
          ) : (
            <button
              key={p}
              type="button"
              className={`adm-pagination-btn${p === page ? ' is-active' : ''}`}
              onClick={() => goTo(p)}
              aria-current={p === page ? 'page' : undefined}
            >
              {p}
            </button>
          ),
        )}
        <button
          type="button"
          className="adm-pagination-btn"
          onClick={() => goTo(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next page"
        >
          ›
        </button>
      </div>
    </div>
  )
}
