import { Link } from 'react-router-dom'
import PageHero from '../components/pageHero/PageHero'
import Seo from '../seo/Seo'
import { PAGE_META } from '../seo/pageMeta'
import { buildBreadcrumbSchema } from '../seo/schema'
import { LEGAL_PAGES } from './legalContent'
import './LegalPage.css'

const META_KEYS = {
  privacy: 'privacy',
  terms: 'terms',
  atol: 'atol',
}

export default function LegalPage({ slug }) {
  const page = LEGAL_PAGES[slug]
  const metaKey = META_KEYS[slug]

  if (!page || !metaKey) {
    return null
  }

  const meta = PAGE_META[metaKey]

  return (
    <>
      <Seo
        title={meta.title}
        description={meta.description}
        keywords={meta.keywords}
        path={`/${slug}`}
        jsonLd={[
          buildBreadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: page.title, url: `/${slug}` },
          ]),
        ]}
      />

      <PageHero eyebrow={page.eyebrow} title={page.title} subtitle={page.intro} />

      <section className="legal">
        <div className="legal-inner">
          {page.sections.map((section) => (
            <article key={section.heading} className="legal-block">
              <h2>{section.heading}</h2>
              <p>{section.body}</p>
            </article>
          ))}

          <p className="legal-back">
            <Link to="/contact">Contact our team</Link> if you have questions about this page.
          </p>
        </div>
      </section>
    </>
  )
}
