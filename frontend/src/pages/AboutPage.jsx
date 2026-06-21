import { motion } from 'framer-motion'
import Features from '../components/features/Features'
import Journey from '../components/journey/Journey'
import Trust from '../components/trust/Trust'
import Testimonials from '../components/testimonials/Testimonials'
import Cta from '../components/cta/Cta'
import PageHero from '../components/pageHero/PageHero'
import './AboutPage.css'

const values = [
  {
    title: 'Faith-Centred Service',
    body: 'Every detail is designed so you can focus entirely on your worship, not the logistics.',
  },
  {
    title: 'UK Hands-On Team',
    body: 'Real people in the UK who know your journey by name from enquiry to safe return.',
  },
  {
    title: 'Total Transparency',
    body: 'No hidden costs, no surprises. Clear pricing and honest advice, every single time.',
  },
]

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Story"
        title="About Al Arish Travel"
        subtitle="A UK-based Hajj and Umrah specialist trusted by thousands of pilgrim families to plan a sacred, stress-free journey."
        badges={['ATOL Protected', 'IATA Approved', '10+ Years']}
      />

      <section className="about-story">
        <div className="about-inner">
          <motion.div
            className="about-grid"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
          >
            <div className="about-text">
              <span className="about-eyebrow">Who We Are</span>
              <h2 className="about-title">
                Crafting sacred journeys, one pilgrim at a time.
              </h2>
              <p>
                Al Arish Travel was founded with a single mission: to make the
                journey of a lifetime simple, dignified and deeply spiritual for
                pilgrim families across the United Kingdom.
              </p>
              <p>
                Over the past decade, our team has guided thousands of guests
                through Umrah and Hajj, blending modern hospitality with the
                timeless traditions of these holy lands.
              </p>
            </div>

            <div className="about-values">
              {values.map((v, i) => (
                <motion.div
                  key={v.title}
                  className="about-value"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <span className="about-value-num">0{i + 1}</span>
                  <div>
                    <h3>{v.title}</h3>
                    <p>{v.body}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <Features />
      <Journey />
      <Trust />
      <Testimonials />
      <Cta />
    </>
  )
}
