import { apiFetch } from './client'

export function submitQuote(payload) {
  return apiFetch('/submissions/quote', { method: 'POST', body: payload })
}

export function submitContact(payload) {
  return apiFetch('/submissions/contact', { method: 'POST', body: payload })
}

export function submitHajj(payload) {
  return apiFetch('/submissions/hajj', { method: 'POST', body: payload })
}

export function fetchSubmissions(query = {}) {
  const search = new URLSearchParams()
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') search.set(k, v)
  })
  const qs = search.toString()
  return apiFetch(`/submissions${qs ? `?${qs}` : ''}`, { auth: true })
}

export function fetchSubmissionsSummary() {
  return apiFetch('/submissions/summary', { auth: true })
}

export function fetchRecentSubmissions(after) {
  const qs = after ? `?after=${encodeURIComponent(after)}` : ''
  return apiFetch(`/submissions/recent${qs}`, { auth: true })
}

export function updateSubmissionStatus(id, status) {
  return apiFetch(`/submissions/${id}/status`, {
    method: 'PATCH',
    body: { status },
    auth: true,
  })
}

export function updateSubmissionNotes(id, adminNotes) {
  return apiFetch(`/submissions/${id}/notes`, {
    method: 'PATCH',
    body: { adminNotes },
    auth: true,
  })
}

export function markAllRead() {
  return apiFetch('/submissions/mark-all-read', { method: 'POST', auth: true })
}

export function deleteSubmission(id) {
  return apiFetch(`/submissions/${id}`, { method: 'DELETE', auth: true })
}
