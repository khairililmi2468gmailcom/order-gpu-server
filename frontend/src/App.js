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
import AdminPackages from './pages/admin/adminPackages/AdminPackages';
import { setNavigator } from './hooks/apiClient';
import ProtectedRoute from './components/ProtectedRoute';
import AdminPayments from './pages/admin/AdminPayments/AdminPayments';
import AdminOrders from './pages/admin/AdminOrders/AdminOrders';
import AdminSettings from './pages/admin/AdminSettings/AdminSettings';
import AdminUbahPassword from './pages/admin/AdminUbahPassword/AdminUbahPassword';
import FormPengisian from './pages/produklayanan/formPengisian/FormPengisian';
import ListOrders from './pages/produklayanan/listOrder/ListOrders';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('ID');
  const [isLoggedInApp, setIsLoggedInApp] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // <<<<<<<<<<<<<< ini tambahan
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    setNavigator(navigate);

    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      setIsLoggedInApp(!!token);
      setUser(storedUser ? JSON.parse(storedUser) : null);
      setIsLoading(false);
    };

    checkLoginStatus(); // Jalankan pertama kali
    window.addEventListener('storage', checkLoginStatus);

    const handleAdminLogout = () => {
      setIsLoggedInApp(false);
      setUser(null);
      navigate('/login');
    };
    window.addEventListener('adminLogout', handleAdminLogout);

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
      window.removeEventListener('adminLogout', handleAdminLogout);
    };
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedInApp(false);
    setUser(null);
    navigate('/login');
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

  if (isLoading) {
    // Tampilkan loading kosong / spinner / atau bahkan return null
    return null;
  }

  return (
    <>
      {isAdminRoute ? (
        <AdminLayout>
          <Routes>
            <Route path="/admin/*" element={
              <ProtectedRoute isAdminRoute isAuthenticated={isLoggedInApp} isAdmin={isAdmin}>
                <Routes>
                  <Route path="" element={<AdminDashboard />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="payments" element={< AdminPayments />} />
                  <Route path="packages" element={<AdminPackages />} />
                  <Route path="settings" element={<AdminSettings />} />
                  <Route path="ubahpassword" element={<AdminUbahPassword />} />
                </Routes>
              </ProtectedRoute>
            } />
            <Route path="/404" element={<NotFound />} />
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
            <Route path="/form-pengisian" element={
              <ProtectedRoute isAuthenticated={isLoggedInApp}>
                <FormPengisian />
              </ProtectedRoute>
            } />
            <Route path="/listorders" element={
              <ProtectedRoute isAuthenticated={isLoggedInApp}>
                <ListOrders />
              </ProtectedRoute>
            } />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </UserLayout>
      )}
    </>
  );
}

export default App;
