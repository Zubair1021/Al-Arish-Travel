import { apiFetch } from './client'

export function fetchPublicCategories() {
  return apiFetch('/categories/public')
}

export function fetchAdminCategories() {
  return apiFetch('/categories', { auth: true })
}

export function createCategory(payload) {
  return apiFetch('/categories', { method: 'POST', body: payload, auth: true })
}

export function updateCategory(id, payload) {
  return apiFetch(`/categories/${id}`, { method: 'PUT', body: payload, auth: true })
}

export function deleteCategory(id) {
  return apiFetch(`/categories/${id}`, { method: 'DELETE', auth: true })
}
