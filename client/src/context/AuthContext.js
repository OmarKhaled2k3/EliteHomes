import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API_BASE_URL from '../config';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('eh_token'));
  const [loading, setLoading] = useState(true);

  // Initialize and check user details if token exists
  useEffect(() => {
    async function checkUser() {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
        } else {
          // Token expired or invalid
          localStorage.removeItem('eh_token');
          setToken(null);
          setUser(null);
        }
      } catch (err) {
        console.error('Failed to verify token:', err);
      } finally {
        setLoading(false);
      }
    }

    checkUser();
  }, [token]);

  // Login handler
  const login = useCallback(async (email, password) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem('eh_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    } else {
      return { success: false, message: data.message || 'Login failed.' };
    }
  }, []);

  // Logout handler
  const logout = useCallback(() => {
    localStorage.removeItem('eh_token');
    setToken(null);
    setUser(null);
  }, []);

  // Authenticated fetch wrapper
  const authFetch = useCallback(async (url, options = {}) => {
    const headers = options.headers || {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const mergedOptions = { ...options, headers };

    const res = await fetch(url, mergedOptions);
    
    // Auto-logout if unauthorized (token expired/revoked)
    if (res.status === 401) {
      logout();
    }
    
    return res;
  }, [token, logout]);

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    authFetch,
    setUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
