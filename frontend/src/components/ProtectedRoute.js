import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, isAdminRoute = false, isAuthenticated, isAdmin }) => {
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isAdminRoute && !isAdmin) {
    return <Navigate to="/404" replace />;
  }

  return children;
};

export default ProtectedRoute;