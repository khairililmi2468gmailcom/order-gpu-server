import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, isAdminRoute = false, isAuthenticated, isAdmin }) => {
  const location = useLocation();

  // Kondisi untuk rute yang memerlukan autentikasi (baik admin maupun user)
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Kondisi khusus untuk rute admin yang memerlukan peran admin
  if (isAdminRoute && !isAdmin) {
    return <Navigate to="/404" replace />;
  }

  // Jika autentikasi berhasil dan (jika rute admin) peran sesuai, render children
  return children;
};

export default ProtectedRoute;