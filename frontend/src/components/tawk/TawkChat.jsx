import { useEffect } from 'react'

const TAWK_SRC = 'https://embed.tawk.to/6a4104bd762a271d420a045e/1js6vl1c2'

export default function TawkChat() {
  useEffect(() => {
    if (document.querySelector(`script[src="${TAWK_SRC}"]`)) return

    window.Tawk_API = window.Tawk_API || {}
    window.Tawk_LoadStart = new Date()

    const script = document.createElement('script')
    script.async = true
    script.src = TAWK_SRC
    script.charset = 'UTF-8'
    script.crossOrigin = 'anonymous'
    document.body.appendChild(script)
  }, [])

  return null
}
