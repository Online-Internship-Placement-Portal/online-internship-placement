/**
 * Aptitude Tests, Student Profile, Progress & Admin API Service
 * Author: NAVYA R (PES2UG24CS308)
 */

import { apiRequest } from './api';

export function getMyProfile() {
  return apiRequest('/api/profile/me');
}

export function updateMyProfile(profileData) {
  return apiRequest('/api/profile/me', {
    method: 'PUT',
    body: JSON.stringify(profileData)
  });
}

export function getAptitudeTests() {
  return apiRequest('/api/tests');
}

export function getAptitudeTestById(testId) {
  return apiRequest(`/api/tests/${testId}`);
}

export function submitAptitudeTest(testId, answers, durationTakenSeconds) {
  return apiRequest(`/api/tests/${testId}/submit`, {
    method: 'POST',
    body: JSON.stringify({ answers, durationTakenSeconds })
  });
}

export function getTestHistory() {
  return apiRequest('/api/tests/history/me');
}

export function getMyProgress() {
  return apiRequest('/api/progress/me');
}

export function updateTopicProgress(topic, completed, score) {
  return apiRequest('/api/progress/me', {
    method: 'PUT',
    body: JSON.stringify({ topic, completed, score })
  });
}

export function getAdminMetrics() {
  return apiRequest('/api/admin/metrics');
}

export function getAdminUsers() {
  return apiRequest('/api/admin/users');
}

export function toggleUserStatus(userId) {
  return apiRequest(`/api/admin/users/${userId}/toggle`, { method: 'PATCH' });
}
