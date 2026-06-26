import Hero from '../components/hero/Hero'
import Packages from '../components/packages/Packages'
import Features from '../components/features/Features'
import Journey from '../components/journey/Journey'
import Testimonials from '../components/testimonials/Testimonials'
import Trust from '../components/trust/Trust'
import Faq from '../components/faq/Faq'
import Cta from '../components/cta/Cta'
import Seo from '../seo/Seo'
import { PAGE_META } from '../seo/pageMeta'
import {
  buildFaqSchema,
  buildOrganizationSchema,
  buildWebSiteSchema,
} from '../seo/schema'
import { useSettings } from '../context/SettingsContext'

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
      <Testimonials />
      <Trust />
      <Faq />
      <Cta />
    </>
  )
}
