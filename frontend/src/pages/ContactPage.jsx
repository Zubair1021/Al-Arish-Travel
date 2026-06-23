import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageHero from '../components/pageHero/PageHero'
import Faq from '../components/faq/Faq'
import { WhatsAppIcon } from '../components/navbar/icons'
import { findPackageBySlug } from '../components/packages/packageData'
import { usePackages } from '../context/PackagesContext'
import { useSettings } from '../context/SettingsContext'
import { useToast } from '../context/ToastContext'
import { submitQuote } from '../api/submissions'
import Select from '../components/ui/Select'
import { ENQUIRY_FIELD_ORDER, hasFormErrors, validateEnquiryForm } from '../utils/validateEnquiryForm'
import './ContactPage.css'

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  package: '',
  duration: '',
  price: '',
  message: '',
}

function buildPackageForm(pkg) {
  return {
    name: '',
    email: '',
    phone: '',
    package: pkg.name,
    duration: pkg.duration,
    price: `${pkg.currency}${pkg.price.toLocaleString()} per person`,
    message: '',
  }
}

export default function ContactPage() {
  const [searchParams] = useSearchParams()
  const packageSlug = searchParams.get('package')
  const { packages } = usePackages()
  const { settings, whatsappLink, phoneHref, emailHref } = useSettings()
  const { push: pushToast } = useToast()

  const selectedPackage = useMemo(
    () => (packageSlug ? findPackageBySlug(packages, packageSlug) : undefined),
    [packageSlug, packages],
  )

  const [form, setForm] = useState(() =>
    selectedPackage
      ? buildPackageForm(selectedPackage)
      : { ...emptyForm, package: packages[0]?.name || 'Custom enquiry' },
  )
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (selectedPackage) {
      setForm(buildPackageForm(selectedPackage))
      return
    }
    setForm({ ...emptyForm, package: packages[0]?.name || 'Custom enquiry' })
  }, [selectedPackage, packages])

  const update = (key) => (e) => {
    const value = e.target.value
    setForm((f) => ({ ...f, [key]: value }))
    if (errors[key]) {
      setErrors((current) => ({ ...current, [key]: '' }))
    }
  }

  const channels = useMemo(
    () => [
      {
        label: 'Call us',
        value: settings.phone,
        href: phoneHref || '#',
        note: settings.businessHours,
      },
      {
        label: 'Email',
        value: settings.email,
        href: emailHref || '#',
        note: 'Replies within 1 working hour',
      },
      {
        label: 'Visit',
        value: settings.address,
        href: '#',
        note: 'By appointment',
      },
    ],
    [settings, phoneHref, emailHref],
  )

  const submit = async (e) => {
    e.preventDefault()
    if (status === 'submitting') return

    const fieldErrors = validateEnquiryForm(form)
    if (hasFormErrors(fieldErrors)) {
      setErrors(fieldErrors)
      pushToast({
        title: 'Please complete required fields',
        body: 'Name, email and phone are required to submit your quote.',
        tone: 'error',
        duration: 6000,
      })
      const first = ENQUIRY_FIELD_ORDER.find((key) => fieldErrors[key])
      if (first) {
        document.getElementById(`contact-${first}`)?.focus()
      }
      return
    }

    setErrors({})
    setStatus('submitting')
    try {
      await submitQuote({
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: form.message,
        packageSlug: selectedPackage?.id,
        packageName: form.package,
        packageDuration: form.duration,
        packagePrice: form.price,
      })
      setStatus('success')
      pushToast({
        title: 'Quote request received',
        body: 'Our UK team will reply within one working hour.',
        tone: 'success',
      })
      setForm((f) => ({ ...f, name: '', email: '', phone: '', message: '' }))
      setTimeout(() => setStatus('idle'), 4000)
    } catch (error) {
      setStatus('idle')
      pushToast({
        title: 'Could not send your request',
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
      ? 'Thank you! We will be in touch.'
      : 'Submit a Quote'

  return (
    <>
      <PageHero
        eyebrow={selectedPackage ? 'Package Enquiry' : "We're Here To Help"}
        title={selectedPackage ? selectedPackage.name : 'Get In Touch'}
        subtitle={
          selectedPackage
            ? `Request a personalised quote for ${selectedPackage.name}. Our UK team will confirm availability and tailor your trip.`
            : 'Tell us about your journey and our UK-based team will reply with a personalised quote within one working hour.'
        }
        badges={['UK Based Support', 'Free Quote', '24/7 WhatsApp']}
      />

      <section className="contact">
        <div className="contact-inner">
          <div className="contact-grid">
            <motion.form
              className="contact-form"
              onSubmit={submit}
              noValidate
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {selectedPackage && (
                <motion.div
                  className="contact-pkg-summary"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  <div className="contact-pkg-media">
                    <img src={selectedPackage.image} alt={selectedPackage.name} />
                    {selectedPackage.tag && (
                      <span className="contact-pkg-tag">{selectedPackage.tag}</span>
                    )}
                  </div>
                  <div className="contact-pkg-info">
                    <span className="contact-pkg-label">Selected package</span>
                    <h3 className="contact-pkg-name">{selectedPackage.name}</h3>
                    <p className="contact-pkg-desc">{selectedPackage.shortDescription}</p>
                    <div className="contact-pkg-meta">
                      <span>{selectedPackage.duration}</span>
                      <span className="contact-pkg-dot" aria-hidden="true" />
                      <span>
                        From {selectedPackage.currency}
                        {selectedPackage.price.toLocaleString()} / person
                      </span>
                    </div>
                    <Link to="/packages" className="contact-pkg-change">
                      Choose a different package
                    </Link>
                  </div>
                </motion.div>
              )}

              <h2 className="contact-form-title">
                {selectedPackage ? 'Your Details' : 'Request a Free Quote'}
              </h2>
              <p className="contact-form-sub">
                {selectedPackage
                  ? 'Package details are filled in below. Just add your personal information and we will send your quote.'
                  : "Share a few details and we'll be in touch with your tailored package."}
              </p>

              <div className="contact-row">
                <label className="contact-field" htmlFor="contact-name">
                  <span>Full name <span className="field-required" aria-hidden="true">*</span></span>
                  <input
                    id="contact-name"
                    name="name"
                    value={form.name}
                    onChange={update('name')}
                    placeholder="Your full name"
                    autoComplete="name"
                    className={errors.name ? 'has-error' : ''}
                    aria-invalid={errors.name ? 'true' : undefined}
                    aria-describedby={errors.name ? 'contact-name-error' : undefined}
                  />
                  {errors.name && (
                    <p id="contact-name-error" className="field-error" role="alert">
                      {errors.name}
                    </p>
                  )}
                </label>
                <label className="contact-field" htmlFor="contact-email">
                  <span>Email <span className="field-required" aria-hidden="true">*</span></span>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={update('email')}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className={errors.email ? 'has-error' : ''}
                    aria-invalid={errors.email ? 'true' : undefined}
                    aria-describedby={errors.email ? 'contact-email-error' : undefined}
                  />
                  {errors.email && (
                    <p id="contact-email-error" className="field-error" role="alert">
                      {errors.email}
                    </p>
                  )}
                </label>
              </div>

              <div className="contact-row">
                <label className="contact-field" htmlFor="contact-phone">
                  <span>Phone <span className="field-required" aria-hidden="true">*</span></span>
                  <input
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={update('phone')}
                    placeholder="+44 ..."
                    autoComplete="tel"
                    className={errors.phone ? 'has-error' : ''}
                    aria-invalid={errors.phone ? 'true' : undefined}
                    aria-describedby={errors.phone ? 'contact-phone-error' : undefined}
                  />
                  {errors.phone && (
                    <p id="contact-phone-error" className="field-error" role="alert">
                      {errors.phone}
                    </p>
                  )}
                </label>
                {selectedPackage ? (
                  <label className="contact-field">
                    <span>Package</span>
                    <input value={form.package} readOnly className="is-readonly" aria-readonly="true" />
                  </label>
                ) : (
                  <div className="contact-field">
                    <span>Package</span>
                    <Select
                      theme="public"
                      value={form.package}
                      onChange={(v) => setForm((f) => ({ ...f, package: v }))}
                      options={[
                        ...packages.map((pkg) => ({ value: pkg.name, label: pkg.name })),
                        { value: 'Custom enquiry', label: 'Custom enquiry' },
                      ]}
                      ariaLabel="Package"
                    />
                  </div>
                )}
              </div>

              {selectedPackage && (
                <div className="contact-row">
                  <label className="contact-field">
                    <span>Duration</span>
                    <input value={form.duration} readOnly className="is-readonly" aria-readonly="true" />
                  </label>
                  <label className="contact-field">
                    <span>Guide price</span>
                    <input value={form.price} readOnly className="is-readonly" aria-readonly="true" />
                  </label>
                </div>
              )}

              <label className="contact-field">
                <span>{selectedPackage ? 'Additional notes (optional)' : 'Message'}</span>
                <textarea
                  value={form.message}
                  onChange={update('message')}
                  rows="4"
                  placeholder={
                    selectedPackage
                      ? 'Preferred travel dates, group size, room preferences, or any special requirements...'
                      : 'Travel dates, group size, any special requirements...'
                  }
                />
              </label>

              <motion.button
                type="submit"
                className="contact-submit"
                whileHover={status === 'submitting' ? undefined : { y: -3 }}
                whileTap={status === 'submitting' ? undefined : { scale: 0.97 }}
                disabled={status === 'submitting'}
              >
                {status === 'submitting' && <span className="contact-spinner" aria-hidden="true" />}
                {buttonLabel}
              </motion.button>
            </motion.form>

            <motion.div
              className="contact-side"
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="contact-channels">
                {channels.map((c) => (
                  <a key={c.label} href={c.href} className="contact-channel">
                    <span className="contact-channel-label">{c.label}</span>
                    <span className="contact-channel-value">{c.value}</span>
                    <span className="contact-channel-note">{c.note}</span>
                  </a>
                ))}
              </div>

              {whatsappLink && (
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-whatsapp"
                >
                  <WhatsAppIcon />
                  <div>
                    <strong>Chat on WhatsApp</strong>
                    <span>Instant reply from our UK team</span>
                  </div>
                </a>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      <Faq />
    </>
  )
}
