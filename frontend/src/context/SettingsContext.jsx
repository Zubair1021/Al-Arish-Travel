import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { fetchPublicSettings } from '../api/settings'

const DEFAULT_SETTINGS = {
  siteName: 'Al Arish Travel',
  tagline:
    'Trusted UK-based specialists helping pilgrims experience a stress-free and spiritual journey to the Holy Cities.',
  email: 'info@alarishtravel.co.uk',
  phone: '+44 20 1234 5678',
  address: '123 High Street, London, UK',
  businessHours: 'Mon-Sat, 9am-9pm GMT',
  whatsappNumber: '923000000000',
  whatsappMessage:
    "Assalamu Alaikum, I'd like to know more about Al Arish Travel Hajj & Umrah packages.",
  socials: { facebook: '', instagram: '', twitter: '', youtube: '' },
}

const SettingsContext = createContext({
  settings: DEFAULT_SETTINGS,
  loading: true,
  refresh: () => {},
  whatsappLink: '',
  phoneHref: '',
  emailHref: '',
})

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      const data = await fetchPublicSettings()
      if (data?.settings) {
        setSettings({ ...DEFAULT_SETTINGS, ...data.settings, socials: { ...DEFAULT_SETTINGS.socials, ...(data.settings.socials || {}) } })
      }
    } catch {
      /* keep defaults */
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const value = useMemo(() => {
    const number = (settings.whatsappNumber || '').replace(/[^0-9]/g, '')
    const message = encodeURIComponent(settings.whatsappMessage || '')
    const whatsappLink = number ? `https://wa.me/${number}${message ? `?text=${message}` : ''}` : ''
    const phoneHref = settings.phone ? `tel:${settings.phone.replace(/[^+0-9]/g, '')}` : ''
    const emailHref = settings.email ? `mailto:${settings.email}` : ''
    return { settings, loading, refresh, whatsappLink, phoneHref, emailHref }
  }, [settings, loading, refresh])

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export function useSettings() {
  return useContext(SettingsContext)
}
