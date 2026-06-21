import { apiFetch } from './client'

export function fetchPublicSettings() {
  return apiFetch('/settings/public')
}

export function fetchAdminSettings() {
  return apiFetch('/settings', { auth: true })
}

export function updateSettings(payload) {
  return apiFetch('/settings', { method: 'PUT', body: payload, auth: true })
}
