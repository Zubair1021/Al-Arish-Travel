import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { fetchPublicTestimonials } from '../api/testimonials'

const TestimonialsContext = createContext({
  testimonials: [],
  loading: true,
  error: null,
  refresh: () => {},
})

export function TestimonialsProvider({ children }) {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchPublicTestimonials()
      setTestimonials(data?.testimonials || [])
    } catch (e) {
      setError(e?.message || 'Failed to load testimonials')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const value = useMemo(
    () => ({ testimonials, loading, error, refresh }),
    [testimonials, loading, error, refresh],
  )

  return (
    <TestimonialsContext.Provider value={value}>{children}</TestimonialsContext.Provider>
  )
}

export function useTestimonials() {
  return useContext(TestimonialsContext)
}
