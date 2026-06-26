import { Link } from 'react-router-dom'
import Seo from '../seo/Seo'
import { PAGE_META } from '../seo/pageMeta'
import './NotFoundPage.css'

export default function NotFoundPage() {
  const meta = PAGE_META.notFound

  return (
    <>
      <Seo
        title={meta.title}
        description={meta.description}
        noindex
      />

      <section className="not-found">
        <div className="not-found-inner">
          <p className="not-found-code">404</p>
          <h1>Page not found</h1>
          <p>The page you are looking for may have moved or no longer exists.</p>
          <div className="not-found-actions">
            <Link to="/" className="btn btn-primary">Back to home</Link>
            <Link to="/packages" className="btn btn-ghost">View packages</Link>
          </div>
        </div>
      </section>
    </>
  )
}
