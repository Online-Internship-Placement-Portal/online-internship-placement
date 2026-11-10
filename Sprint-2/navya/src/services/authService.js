/**
 * Authentication API Service
 * Author: NAVYA R (PES2UG24CS308)
 */

import { apiRequest } from './api';

export function loginUser(email, password) {
  return apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
}

export function registerStudent(formData) {
  return apiRequest('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ ...formData, role: 'student' })
  });
}

export function fetchCurrentUser() {
  return apiRequest('/api/auth/me');
}
