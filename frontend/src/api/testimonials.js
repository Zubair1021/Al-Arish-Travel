import { apiFetch } from './client'

export function fetchPublicTestimonials() {
  return apiFetch('/testimonials/public')
}

export function fetchAdminTestimonials() {
  return apiFetch('/testimonials', { auth: true })
}

export function createTestimonial(payload) {
  return apiFetch('/testimonials', { method: 'POST', body: payload, auth: true })
}

export function updateTestimonial(id, payload) {
  return apiFetch(`/testimonials/${id}`, { method: 'PUT', body: payload, auth: true })
}

export function setTestimonialVisibility(id, hidden) {
  return apiFetch(`/testimonials/${id}/visibility`, {
    method: 'PATCH',
    body: { hidden },
    auth: true,
  })
}

export function deleteTestimonial(id) {
  return apiFetch(`/testimonials/${id}`, { method: 'DELETE', auth: true })
}
