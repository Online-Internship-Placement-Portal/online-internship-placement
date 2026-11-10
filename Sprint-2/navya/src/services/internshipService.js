/**
 * Internships & Applications API Service
 * Author: NAVYA R (PES2UG24CS308)
 */

import { apiRequest } from './api';

export function getInternships(filters = {}) {
  const params = new URLSearchParams();
  if (filters.search) params.set('search', filters.search);
  if (filters.role) params.set('role', filters.role);
  if (filters.location) params.set('location', filters.location);

  const query = params.toString() ? `?${params.toString()}` : '';
  return apiRequest(`/api/internships${query}`);
}

export function createInternship(internshipData) {
  return apiRequest('/api/internships', {
    method: 'POST',
    body: JSON.stringify(internshipData)
  });
}

export function applyToInternship(internshipId, coverNote) {
  return apiRequest(`/api/applications/apply/${internshipId}`, {
    method: 'POST',
    body: JSON.stringify({ coverNote })
  });
}

export function getMyApplications() {
  return apiRequest('/api/applications/me');
}

export function getAllApplications() {
  return apiRequest('/api/applications');
}

export function updateApplicationStatus(applicationId, status, recruiterFeedback) {
  return apiRequest(`/api/applications/${applicationId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status, recruiterFeedback })
  });
}
