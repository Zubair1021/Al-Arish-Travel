import { apiFetch } from './client'

export function loginAdmin({ email, password }) {
  return apiFetch('/auth/login', { method: 'POST', body: { email, password } })
}

export function fetchAdminMe() {
  return apiFetch('/auth/me', { auth: true })
}

export function changeAdminPassword({ currentPassword, newPassword }) {
  return apiFetch('/auth/change-password', {
    method: 'POST',
    body: { currentPassword, newPassword },
    auth: true,
  })
}
