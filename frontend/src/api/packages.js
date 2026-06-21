import { apiFetch } from './client'

export function fetchPublicPackages() {
  return apiFetch('/packages/public')
}

export function fetchAdminPackages() {
  return apiFetch('/packages', { auth: true })
}

export function createPackage(payload) {
  return apiFetch('/packages', { method: 'POST', body: payload, auth: true })
}

export function updatePackage(id, payload) {
  return apiFetch(`/packages/${id}`, { method: 'PUT', body: payload, auth: true })
}

export function setPackageVisibility(id, hidden) {
  return apiFetch(`/packages/${id}/visibility`, {
    method: 'PATCH',
    body: { hidden },
    auth: true,
  })
}

export function setPackageFeatured(id, featured) {
  return apiFetch(`/packages/${id}/featured`, {
    method: 'PATCH',
    body: { featured },
    auth: true,
  })
}

export function deletePackage(id) {
  return apiFetch(`/packages/${id}`, { method: 'DELETE', auth: true })
}
