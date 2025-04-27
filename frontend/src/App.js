import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Beranda from './pages/Beranda/Beranda';
import ProdukLayanan from './pages/produklayanan/ProdukLayanan';
import NotFound from './pages/NotFound';
import AdminDashboard from './pages/admin/AdminDashboard/AdminDashboard';
import LoginPage from './pages/login/LoginPage';
import RegisterPage from './pages/register/Register';
import LoginAdminPage from './pages/loginadmin/LoginAdmin';

import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';
import AdminOrders from './pages/admin/AdminOrders/AdminOrders';
import AdminPackages from './pages/admin/adminPackages/AdminPackages';
import { setNavigator } from './hooks/apiClient'; // Pastikan path ini benar
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute

function App() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('ID');
  const [isLoggedInApp, setIsLoggedInApp] = useState(() => !!localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAdmin = user?.role === 'admin';
  const navigate = useNavigate();

  useEffect(() => {
    setNavigator(navigate);
    const checkLoginStatus = () => {
      setIsLoggedInApp(!!localStorage.getItem('token'));
      const updatedUser = localStorage.getItem('user');
      setUser(updatedUser ? JSON.parse(updatedUser) : null);
    };
    window.addEventListener('storage', checkLoginStatus);
    return () => window.removeEventListener('storage', checkLoginStatus);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedInApp(false);
    setUser(null);
    navigate('/login'); // Redirect ke login setelah logout
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const handleLanguageSelect = (lang) => {
    setSelectedLanguage(lang);
    setLanguageDropdownOpen(false);
  };
  const scrollToSectionFromSidebar = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const handleLoginSuccess = () => {
    setIsLoggedInApp(true);
    const updatedUser = localStorage.getItem('user');
    setUser(updatedUser ? JSON.parse(updatedUser) : null);
  };

  return (
    <>
      {isAdminRoute ? (
        <AdminLayout>
          <Routes>
            <Route
              path="/admin"
              element={
                <ProtectedRoute
                  isAuthenticated={isLoggedInApp}
                  isAdmin={isAdmin}
                  isAdminRoute={true}
                >
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <ProtectedRoute
                  isAuthenticated={isLoggedInApp}
                  isAdmin={isAdmin}
                  isAdminRoute={true}
                >
                  <AdminOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/packages"
              element={
                <ProtectedRoute
                  isAuthenticated={isLoggedInApp}
                  isAdmin={isAdmin}
                  isAdminRoute={true}
                >
                  <AdminPackages />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AdminLayout>
      ) : (
        <UserLayout
          toggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
          languageDropdownOpen={languageDropdownOpen}
          setLanguageDropdownOpen={setLanguageDropdownOpen}
          selectedLanguage={selectedLanguage}
          handleLanguageSelect={handleLanguageSelect}
          scrollToSection={scrollToSectionFromSidebar}
          isLoggedIn={isLoggedInApp}
          onLogout={handleLogout}
          user={user}
        >
          <Routes>
            <Route path="/" element={<Beranda />} />
            <Route path="/semua-layanan" element={<ProdukLayanan />} />
            <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login-admin" element={<LoginAdminPage />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </UserLayout>
      )}
    </>
  );
}

export default App;