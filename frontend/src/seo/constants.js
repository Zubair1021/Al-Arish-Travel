export const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://alarishtravel.co.uk').replace(/\/$/, '')

export const SITE_NAME = 'Al Arish Travel'

export const DEFAULT_OG_IMAGE = `${SITE_URL}/favicons/web-app-manifest-512x512.png`

export const DEFAULT_KEYWORDS = [
  'Umrah packages UK',
  'Hajj packages UK',
  'Umrah travel agency',
  'Hajj travel agency',
  'ATOL protected Umrah',
  'Umrah from UK',
  'Hajj from UK',
  'Makkah packages',
  'Madinah packages',
  'Al Arish Travel',
].join(', ')

export const PUBLIC_ROUTES = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/packages', changefreq: 'weekly', priority: '0.9' },
  { path: '/hajj', changefreq: 'weekly', priority: '0.9' },
  { path: '/about', changefreq: 'monthly', priority: '0.8' },
  { path: '/contact', changefreq: 'monthly', priority: '0.8' },
  { path: '/privacy', changefreq: 'yearly', priority: '0.3' },
  { path: '/terms', changefreq: 'yearly', priority: '0.3' },
  { path: '/atol', changefreq: 'yearly', priority: '0.4' },
]
