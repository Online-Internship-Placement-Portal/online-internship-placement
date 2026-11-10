/**
 * Custom Authentication Session Hook
 * Author: NAVYA R (PES2UG24CS308)
 */

import { useState, useEffect, useCallback } from 'react';

export function useAuth() {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('portal_token') || null);

  useEffect(() => {
    const savedUser = localStorage.getItem('portal_user');
    if (savedUser && token) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (err) {
        localStorage.removeItem('portal_user');
        localStorage.removeItem('portal_token');
        setToken(null);
      }
    }
  }, [token]);

  const login = useCallback((user, jwtToken) => {
    setCurrentUser(user);
    setToken(jwtToken);
    localStorage.setItem('portal_token', jwtToken);
    localStorage.setItem('portal_user', JSON.stringify(user));
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem('portal_token');
    localStorage.removeItem('portal_user');
  }, []);

  return {
    currentUser,
    token,
    isAuthenticated: Boolean(currentUser && token),
    login,
    logout
  };
}
