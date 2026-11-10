/**
 * Reusable Fetch API Helper with Auth Injection
 * Author: NAVYA R (PES2UG24CS308)
 */

const BASE_URL = process.env.REACT_APP_API_URL || '';

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('portal_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(payload.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.data = payload;
    throw error;
  }

  return payload;
}
