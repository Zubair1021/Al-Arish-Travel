import { lazy, Suspense } from 'react'
import Hero from '../components/hero/Hero'
import Packages from '../components/packages/Packages'
import Features from '../components/features/Features'
import Journey from '../components/journey/Journey'
import Trust from '../components/trust/Trust'
import Faq from '../components/faq/Faq'
import Seo from '../seo/Seo'
import { PAGE_META } from '../seo/pageMeta'
import {
  buildFaqSchema,
  buildOrganizationSchema,
  buildWebSiteSchema,
} from '../seo/schema'
import { useSettings } from '../context/SettingsContext'

const Testimonials = lazy(() => import('../components/testimonials/Testimonials'))
const Cta = lazy(() => import('../components/cta/Cta'))

export default function HomePage() {
  const { settings } = useSettings()
  const meta = PAGE_META.home

  return (
    <>
      <Seo
        title={meta.title}
        description={meta.description}
        keywords={meta.keywords}
        path="/"
        jsonLd={[
          buildOrganizationSchema(settings),
          buildWebSiteSchema(),
          buildFaqSchema(),
        ]}
      />
      <Hero />
      <Packages
        eyebrow="Featured Packages"
        title="Popular Umrah Packages"
        subtitle="Handpicked, all-inclusive packages with flights, hotels and transport arranged by our UK-based team."
        featuredOnly
      />
      <Features />
      <Journey />
      <Suspense fallback={null}>
        <Testimonials />
      </Suspense>
      <Trust />
      <Faq />
      <Suspense fallback={null}>
        <Cta />
      </Suspense>
    </>
  )
}
