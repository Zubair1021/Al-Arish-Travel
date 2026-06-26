import { motion } from 'framer-motion'
import Packages from '../components/packages/Packages'
import Features from '../components/features/Features'
import Cta from '../components/cta/Cta'
import PageHero from '../components/pageHero/PageHero'
import Seo from '../seo/Seo'
import { PAGE_META } from '../seo/pageMeta'
import { buildBreadcrumbSchema, buildOrganizationSchema, buildPackagesItemListSchema } from '../seo/schema'
import { usePackages } from '../context/PackagesContext'
import { useSettings } from '../context/SettingsContext'

export default function PackagesPage() {
  const { packages } = usePackages()
  const { settings } = useSettings()
  const meta = PAGE_META.packages

  return (
    <>
      <Seo
        title={meta.title}
        description={meta.description}
        keywords={meta.keywords}
        path="/packages"
        jsonLd={[
          buildOrganizationSchema(settings),
          buildBreadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: 'Umrah Packages', url: '/packages' },
          ]),
          buildPackagesItemListSchema(packages),
        ].filter(Boolean)}
      />
      <PageHero
        eyebrow="All Inclusive Pilgrimage"
        title="Umrah Packages"
        subtitle="Choose from our curated 4-star, 5-star, Ramadan and family-friendly Umrah packages. Every package includes flights, hotels and transport."
        badges={['Flights included', 'Hotels near Haram', 'UK based support']}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <Packages
          eyebrow="Pick Your Package"
          title="All Umrah Packages"
          subtitle="Compare every package below. Tap View Details to chat with our team and customise your trip."
          showViewAll={false}
          showFilters
        />
      </motion.div>

      <Features />
      <Cta />
    </>
  )
}
