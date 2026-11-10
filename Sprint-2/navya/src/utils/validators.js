/**
 * Client-Side Form Validation Utilities
 * Author: NAVYA R (PES2UG24CS308)
 */

export function isValidEmail(email) {
  return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function isValidUSN(usn) {
  if (!usn || typeof usn !== 'string') return false;
  return /^PES[12]UG\d{2}[A-Z]{2}\d{3}$/i.test(usn.trim());
}

export function isValidCGPA(cgpa) {
  const num = Number(cgpa);
  return !Number.isNaN(num) && num >= 0 && num <= 10;
}

export function isValidPassword(password) {
  return typeof password === 'string' && password.length >= 6;
}

export function isValidUrl(url) {
  if (!url) return true;
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

export function formatCurrencyINR(amount) {
  const num = Number(amount) || 0;
  return `₹${num.toLocaleString('en-IN')}/mo`;
}
