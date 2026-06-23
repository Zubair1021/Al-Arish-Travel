const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateEnquiryForm({ name, email, phone }) {
  const errors = {}

  const trimmedName = String(name ?? '').trim()
  if (!trimmedName) {
    errors.name = 'Please enter your full name.'
  } else if (trimmedName.length < 2) {
    errors.name = 'Name must be at least 2 characters.'
  }

  const trimmedEmail = String(email ?? '').trim()
  if (!trimmedEmail) {
    errors.email = 'Please enter your email address.'
  } else if (!EMAIL_RE.test(trimmedEmail)) {
    errors.email = 'Please enter a valid email address.'
  }

  const trimmedPhone = String(phone ?? '').trim()
  const phoneDigits = trimmedPhone.replace(/\D/g, '')
  if (!trimmedPhone) {
    errors.phone = 'Please enter your phone number.'
  } else if (phoneDigits.length < 7) {
    errors.phone = 'Please enter a valid phone number (at least 7 digits).'
  }

  return errors
}

export function hasFormErrors(errors) {
  return Object.values(errors).some(Boolean)
}

export const ENQUIRY_FIELD_ORDER = ['name', 'email', 'phone']
