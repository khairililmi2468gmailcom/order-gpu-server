import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, isAdminRoute = false, isAuthenticated, isAdmin }) => {
  const location = useLocation();

  if (!isAuthenticated) {
    // Jika tidak terotentikasi, redirect ke halaman login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isAdminRoute && !isAdmin) {
    // Jika rute admin dan bukan admin, redirect ke halaman yang tidak ditemukan atau halaman user
    return <Navigate to="/404" replace />; // Atau redirect ke '/'
  }

  return children;
};

export default ProtectedRoute;