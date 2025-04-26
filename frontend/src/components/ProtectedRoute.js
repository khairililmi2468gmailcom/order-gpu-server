import React from 'react';
import { Navigate } from 'react-router-dom';

// Simulasi cek login (nanti bisa diganti cek token atau state auth)
const isAuthenticated = () => {
  return localStorage.getItem('token'); // Contoh simple pakai token di localStorage
};

function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/404" />; // Kalau belum login, lempar ke 404
  }
  return children;
}

export default ProtectedRoute;
