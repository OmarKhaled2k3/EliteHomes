import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, role }) {
  const { user, token } = useAuth();

  // If not logged in, redirect to login page
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // If a role requirement is specified, ensure user has it
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}
