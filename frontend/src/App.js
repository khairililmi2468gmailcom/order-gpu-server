import React, { useCallback, useEffect, useState } from 'react';
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
import UbahPassword from './pages/ubahpassword/UbahPassword';
import Profile from './pages/profile/Profile';
import ForgotPasswordPage from './pages/login/ForgotPasswordPage';
import ResetPasswordPage from './pages/login/ResetPasswordPage';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('ID');
  const [isLoggedInApp, setIsLoggedInApp] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAdmin = user?.role === 'admin';


  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedInApp(false);
    setUser(null);
    navigate('/login');
  }, [navigate]);
  const refreshToken = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      handleLogout();
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/refresh`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      localStorage.setItem('token', response.data.token);
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userObject = JSON.parse(storedUser);
        localStorage.setItem('user', JSON.stringify({ ...userObject, token: response.data.token }));
        setUser({ ...userObject, token: response.data.token });
      }
      console.log('Token diperbarui.');
      setLastActivity(Date.now()); // Perbarui waktu aktivitas setelah refresh berhasil
    } catch (error) {
      console.error('Gagal memperbarui token:', error);
      handleLogout();
    }
  }, [handleLogout]);

  useEffect(() => {
    setNavigator(navigate);

    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const currentTime = Math.floor(Date.now() / 1000);
          if (decodedToken.exp < currentTime) {
            console.log('Token kedaluwarsa, silakan login kembali.');
            handleLogout();
          } else {
            // Token masih valid
            setIsLoggedInApp(true);
            setUser(storedUser ? JSON.parse(storedUser) : null);
          }
        } catch (error) {
          // Token tidak valid atau tidak dapat didekode
          console.error('Error mendekode token:', error);
          handleLogout();
        }
      } else {
        setIsLoggedInApp(false);
        setUser(null);
      }
      setIsLoading(false);
    };

    checkLoginStatus();
    window.addEventListener('storage', checkLoginStatus);

    const handleAdminLogout = () => {
      setIsLoggedInApp(false);
      setUser(null);
      navigate('/login');
    };
    window.addEventListener('adminLogout', handleAdminLogout);

    // Inactivity Timeout Logic
    let inactivityTimer;
    const inactivityTimeout = 10 * 60 * 1000; // 10 menit dalam milidetik

    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(handleLogout, inactivityTimeout);
    };

    const activityEvents = ['mousemove', 'keydown', 'scroll', 'click'];
    activityEvents.forEach(event => {
      window.addEventListener(event, resetInactivityTimer);
    });

    // Set timer awal saat komponen mount dan setiap kali ada perubahan route (sebagai indikasi aktivitas)
    resetInactivityTimer();
    // navigate(location.pathname); 

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
      window.removeEventListener('adminLogout', handleAdminLogout);
      activityEvents.forEach(event => {
        window.removeEventListener(event, resetInactivityTimer);
      });
      clearTimeout(inactivityTimer);
    };
  }, [navigate, handleLogout, location.pathname]);

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
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
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
            <Route path="ubahpassword" element={
              <ProtectedRoute isAuthenticated={isLoggedInApp}>
                <UbahPassword />
              </ProtectedRoute>
            } />
            <Route path="profile" element={
              <ProtectedRoute isAuthenticated={isLoggedInApp}>
                <Profile />
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
