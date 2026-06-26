import { SITE_NAME, SITE_URL } from './constants'
import { faqs } from '../components/faq/faqData'

function stripHtml(text) {
  return String(text || '').replace(/\s+/g, ' ').trim()
}

export function buildOrganizationSchema(settings = {}) {
  const sameAs = Object.values(settings.socials || {}).filter(Boolean)
  return {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    '@id': `${SITE_URL}/#organization`,
    name: settings.siteName || SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/favicons/web-app-manifest-512x512.png`,
    image: `${SITE_URL}/favicons/web-app-manifest-512x512.png`,
    description: settings.tagline || 'Trusted UK-based Hajj and Umrah travel specialists.',
    telephone: settings.phone || undefined,
    email: settings.email || undefined,
    address: settings.address
      ? {
          '@type': 'PostalAddress',
          streetAddress: settings.address,
          addressCountry: 'GB',
        }
      : undefined,
    areaServed: {
      '@type': 'Country',
      name: 'United Kingdom',
    },
    priceRange: '££',
    sameAs: sameAs.length ? sameAs : undefined,
  }
}

export function buildWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    publisher: { '@id': `${SITE_URL}/#organization` },
    inLanguage: 'en-GB',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/packages`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function buildFaqSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: stripHtml(faq.answer),
      },
    })),
  }
}

export function buildBreadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url ? `${SITE_URL}${item.url}` : undefined,
    })),
  }
}

export function buildPackagesItemListSchema(packages = []) {
  if (!packages.length) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Umrah Packages',
    itemListElement: packages.map((pkg, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: pkg.name,
        description: pkg.shortDescription,
        offers: {
          '@type': 'Offer',
          price: String(pkg.price),
          priceCurrency: pkg.currency === '£' ? 'GBP' : 'GBP',
          availability: 'https://schema.org/InStock',
          url: `${SITE_URL}/contact?package=${encodeURIComponent(pkg.id || pkg.name)}`,
        },
      },
    })),
  }
}
