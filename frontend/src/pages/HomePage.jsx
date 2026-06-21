import Hero from '../components/hero/Hero'
import Packages from '../components/packages/Packages'
import Features from '../components/features/Features'
import Journey from '../components/journey/Journey'
import Testimonials from '../components/testimonials/Testimonials'
import Trust from '../components/trust/Trust'
import Faq from '../components/faq/Faq'
import Cta from '../components/cta/Cta'

export default function HomePage() {
  return (
    <>
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
