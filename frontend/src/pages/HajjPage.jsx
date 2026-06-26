import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import PageHero from '../components/pageHero/PageHero'
import { WhatsAppIcon } from '../components/navbar/icons'
import { getHajjRegistrationCopy } from '../utils/hajjYear'
import { useSettings } from '../context/SettingsContext'
import { useToast } from '../context/ToastContext'
import { submitHajj } from '../api/submissions'
import Select from '../components/ui/Select'
import { ENQUIRY_FIELD_ORDER, hasFormErrors, validateEnquiryForm } from '../utils/validateEnquiryForm'
import Seo from '../seo/Seo'
import { PAGE_META } from '../seo/pageMeta'
import { buildBreadcrumbSchema, buildOrganizationSchema } from '../seo/schema'
import './HajjPage.css'

const highlights = [
  {
    title: 'Priority updates',
    body: 'Be first to hear when Hajj packages, dates and pricing are released.',
  },
  {
    title: 'UK guidance',
    body: 'Our team helps you prepare documents, visas and travel plans step by step.',
  },
  {
    title: 'No obligation',
    body: 'Registering interest is free. You can confirm your booking when you are ready.',
  },
]

export default function HajjPage() {
  const copy = useMemo(() => getHajjRegistrationCopy(), [])
  const { whatsappLink, settings } = useSettings()
  const { push: pushToast } = useToast()
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    pilgrims: '1',
    message: '',
  })
  const [status, setStatus] = useState('idle')
  const [errors, setErrors] = useState({})

  const update = (key) => (event) => {
    const value = event.target.value
    setForm((current) => ({ ...current, [key]: value }))
    if (errors[key]) {
      setErrors((current) => ({ ...current, [key]: '' }))
    }
  }

  const submit = async (event) => {
    event.preventDefault()
    if (status === 'submitting') return

    const fieldErrors = validateEnquiryForm(form)
    if (hasFormErrors(fieldErrors)) {
      setErrors(fieldErrors)
      pushToast({
        title: 'Please complete required fields',
        body: 'Name, email and phone are required to register your interest.',
        tone: 'error',
        duration: 6000,
      })
      const first = ENQUIRY_FIELD_ORDER.find((key) => fieldErrors[key])
      if (first) {
        document.getElementById(`hajj-${first}`)?.focus()
      }
      return
    }

    setErrors({})
    setStatus('submitting')
    try {
      await submitHajj({
        name: form.name,
        email: form.email,
        phone: form.phone,
        pilgrims: form.pilgrims,
        hajjYear: copy.year,
        message: form.message,
      })
      setStatus('success')
      pushToast({
        title: `Registered for Hajj ${copy.year}`,
        body: 'You are on our priority list. We will be in touch with package details.',
        tone: 'success',
      })
      setForm({ name: '', email: '', phone: '', pilgrims: '1', message: '' })
      setTimeout(() => setStatus('idle'), 4000)
    } catch (error) {
      setStatus('idle')
      pushToast({
        title: 'Could not register',
        body: error?.message || 'Please try again or contact us on WhatsApp.',
        tone: 'error',
        duration: 7000,
      })
    }
  }

  const buttonLabel =
    status === 'submitting'
      ? 'Sending…'
      : status === 'success'
      ? copy.successMessage
      : copy.submitLabel

  const meta = PAGE_META.hajj

  return (
    <>
      <Seo
        title={meta.title}
        description={meta.description}
        keywords={meta.keywords}
        path="/hajj"
        jsonLd={[
          buildOrganizationSchema(settings),
          buildBreadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: 'Hajj Registration', url: '/hajj' },
          ]),
        ]}
      />
      <PageHero
        eyebrow={copy.heroEyebrow}
        title={copy.heroTitle}
        subtitle={copy.heroSubtitle}
        badges={['ATOL Protected', 'UK Based Support', 'Early Bird List']}
      />

      <section className="hajj">
        <div className="hajj-inner">
          <div className="hajj-grid">
            <motion.form
              className="hajj-form"
              onSubmit={submit}
              noValidate
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="hajj-form-title">{copy.formTitle}</h2>
              <p className="hajj-form-sub">{copy.formSubtitle}</p>

              <label className="hajj-field">
                <span>{copy.yearLabel}</span>
                <input
                  value={`Hajj ${copy.year}`}
                  readOnly
                  className="is-readonly"
                  aria-readonly="true"
                />
              </label>

              <div className="hajj-row">
                <label className="hajj-field" htmlFor="hajj-name">
                  <span>Full name <span className="field-required" aria-hidden="true">*</span></span>
                  <input
                    id="hajj-name"
                    name="name"
                    value={form.name}
                    onChange={update('name')}
                    placeholder="Your full name"
                    autoComplete="name"
                    className={errors.name ? 'has-error' : ''}
                    aria-invalid={errors.name ? 'true' : undefined}
                    aria-describedby={errors.name ? 'hajj-name-error' : undefined}
                  />
                  {errors.name && (
                    <p id="hajj-name-error" className="field-error" role="alert">
                      {errors.name}
                    </p>
                  )}
                </label>
                <label className="hajj-field" htmlFor="hajj-email">
                  <span>Email <span className="field-required" aria-hidden="true">*</span></span>
                  <input
                    id="hajj-email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={update('email')}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className={errors.email ? 'has-error' : ''}
                    aria-invalid={errors.email ? 'true' : undefined}
                    aria-describedby={errors.email ? 'hajj-email-error' : undefined}
                  />
                  {errors.email && (
                    <p id="hajj-email-error" className="field-error" role="alert">
                      {errors.email}
                    </p>
                  )}
                </label>
              </div>

              <div className="hajj-row">
                <label className="hajj-field" htmlFor="hajj-phone">
                  <span>Phone <span className="field-required" aria-hidden="true">*</span></span>
                  <input
                    id="hajj-phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={update('phone')}
                    placeholder="+44 ..."
                    autoComplete="tel"
                    className={errors.phone ? 'has-error' : ''}
                    aria-invalid={errors.phone ? 'true' : undefined}
                    aria-describedby={errors.phone ? 'hajj-phone-error' : undefined}
                  />
                  {errors.phone && (
                    <p id="hajj-phone-error" className="field-error" role="alert">
                      {errors.phone}
                    </p>
                  )}
                </label>
                <div className="hajj-field">
                  <span>Number of pilgrims</span>
                  <Select
                    theme="public"
                    value={form.pilgrims}
                    onChange={(v) => setForm((f) => ({ ...f, pilgrims: v }))}
                    options={[
                      { value: '1', label: '1 pilgrim' },
                      { value: '2', label: '2 pilgrims' },
                      { value: '3', label: '3 pilgrims' },
                      { value: '4', label: '4 pilgrims' },
                      { value: '5+', label: '5 or more' },
                    ]}
                    ariaLabel="Number of pilgrims"
                  />
                </div>
              </div>

              <label className="hajj-field">
                <span>Additional notes (optional)</span>
                <textarea
                  value={form.message}
                  onChange={update('message')}
                  rows="4"
                  placeholder="Any medical needs, preferred room type, or questions for our team..."
                />
              </label>

              <motion.button
                type="submit"
                className="hajj-submit"
                whileHover={status === 'submitting' ? undefined : { y: -3 }}
                whileTap={status === 'submitting' ? undefined : { scale: 0.97 }}
                disabled={status === 'submitting'}
              >
                {status === 'submitting' && <span className="hajj-spinner" aria-hidden="true" />}
                {buttonLabel}
              </motion.button>
            </motion.form>

            <motion.aside
              className="hajj-side"
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="hajj-info">
                <span className="hajj-info-label">Why register early?</span>
                <p>
                  Hajj places are limited each year. Joining our {copy.year} interest
                  list helps us reserve the right package for you as soon as details
                  are confirmed.
                </p>
              </div>

              <div className="hajj-highlights">
                {highlights.map((item, index) => (
                  <div key={item.title} className="hajj-highlight">
                    <span className="hajj-highlight-num">0{index + 1}</span>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>

              {whatsappLink && (
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hajj-whatsapp"
                >
                  <WhatsAppIcon />
                  <div>
                    <strong>Questions about Hajj {copy.year}?</strong>
                    <span>Chat with our UK team on WhatsApp</span>
                  </div>
                </a>
              )}
            </motion.aside>
          </div>
        </div>
      </section>
    </>
  )
}
