import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { fetchPublicPackages } from '../api/packages'
import { DEFAULT_CATEGORIES, hydratePackage } from '../components/packages/packageData'

const PackagesContext = createContext({
  packages: [],
  categories: DEFAULT_CATEGORIES,
  loading: true,
  error: null,
  refresh: () => {},
})

export function PackagesProvider({ children }) {
  const [packages, setPackages] = useState([])
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refresh = useCallback(async () => {
    setError(null)
    try {
      const data = await fetchPublicPackages()
      const hydrated = (data?.packages || []).map(hydratePackage)
      setPackages(hydrated)
      if (Array.isArray(data?.categories) && data.categories.length) {
        setCategories(data.categories)
      }
    } catch (e) {
      setError(e?.message || 'Failed to load packages')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const value = useMemo(
    () => ({ packages, categories, loading, error, refresh }),
    [packages, categories, loading, error, refresh],
  )

  return <PackagesContext.Provider value={value}>{children}</PackagesContext.Provider>
}

export function usePackages() {
  return useContext(PackagesContext)
}
