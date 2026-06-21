import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { fetchAdminMe, loginAdmin } from '../api/auth'
import { getToken, setToken } from '../api/client'

const AdminAuthContext = createContext({
  admin: null,
  ready: false,
  loading: false,
  error: '',
  login: async () => {},
  logout: () => {},
  refresh: async () => {},
})

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [ready, setReady] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    if (!getToken()) {
      setAdmin(null)
      setReady(true)
      return
    }
    try {
      const data = await fetchAdminMe()
      setAdmin(data?.admin || null)
    } catch {
      setToken(null)
      setAdmin(null)
    } finally {
      setReady(true)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const login = useCallback(async ({ email, password }) => {
    setError('')
    setLoading(true)
    try {
      const data = await loginAdmin({ email, password })
      setToken(data?.token || null)
      setAdmin(data?.admin || null)
      return data?.admin
    } catch (err) {
      const message = err?.message || 'Login failed'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setAdmin(null)
  }, [])

  const value = useMemo(
    () => ({ admin, ready, loading, error, login, logout, refresh }),
    [admin, ready, loading, error, login, logout, refresh],
  )

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}

export function useAdminAuth() {
  return useContext(AdminAuthContext)
}
