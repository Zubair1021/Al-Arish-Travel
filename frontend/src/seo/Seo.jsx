import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from './constants'

function upsertMeta(name, content, { property = false } = {}) {
  if (!content) return
  const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`
  let el = document.querySelector(selector)
  if (!el) {
    el = document.createElement('meta')
    if (property) el.setAttribute('property', name)
    else el.setAttribute('name', name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel, href) {
  if (!href) return
  let el = document.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

function upsertJsonLd(id, data) {
  const existing = document.getElementById(id)
  if (existing) existing.remove()
  if (!data) return

  const payload = Array.isArray(data)
    ? { '@context': 'https://schema.org', '@graph': data }
    : data

  const script = document.createElement('script')
  script.id = id
  script.type = 'application/ld+json'
  script.textContent = JSON.stringify(payload)
  document.head.appendChild(script)
}

export default function Seo({
  title,
  description,
  keywords,
  path,
  image = DEFAULT_OG_IMAGE,
  type = 'website',
  noindex = false,
  jsonLd = null,
}) {
  const location = useLocation()
  const canonicalPath = path ?? location.pathname
  const canonical = `${SITE_URL}${canonicalPath === '/' ? '' : canonicalPath}`
  const fullTitle = title || `${SITE_NAME} | Hajj & Umrah Packages UK`

  useEffect(() => {
    document.title = fullTitle

    upsertMeta('description', description)
    upsertMeta('keywords', keywords)
    upsertMeta('author', SITE_NAME)
    upsertMeta('robots', noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large')
    upsertMeta('googlebot', noindex ? 'noindex, nofollow' : 'index, follow')
    upsertMeta('geo.region', 'GB')
    upsertMeta('geo.placename', 'United Kingdom')

    upsertMeta('og:title', fullTitle, { property: true })
    upsertMeta('og:description', description, { property: true })
    upsertMeta('og:type', type, { property: true })
    upsertMeta('og:url', canonical, { property: true })
    upsertMeta('og:site_name', SITE_NAME, { property: true })
    upsertMeta('og:locale', 'en_GB', { property: true })
    upsertMeta('og:image', image, { property: true })
    upsertMeta('og:image:alt', `${SITE_NAME} — Hajj & Umrah packages from the UK`, { property: true })

    upsertMeta('twitter:card', 'summary_large_image')
    upsertMeta('twitter:title', fullTitle)
    upsertMeta('twitter:description', description)
    upsertMeta('twitter:image', image)

    upsertLink('canonical', canonical)

    const schemas = Array.isArray(jsonLd) ? jsonLd.filter(Boolean) : jsonLd ? [jsonLd] : []
    upsertJsonLd('seo-jsonld', schemas.length ? schemas : null)

    return () => {
      const el = document.getElementById('seo-jsonld')
      if (el) el.remove()
    }
  }, [fullTitle, description, keywords, canonical, image, type, noindex, jsonLd])

  return null
}
