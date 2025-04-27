import React from 'react';
import { Navigate } from 'react-router-dom';

// Cek apakah sudah login
const isAuthenticated = () => {
  return localStorage.getItem('token');
};

// Cek apakah user punya role admin
const isAdmin = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.role === 'admin';
};

function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/404" />; // Belum login
  }

  if (!isAdmin()) {
    return <Navigate to="/404" />; // Login tapi bukan admin
  }

  return children;
}

export default ProtectedRoute;
