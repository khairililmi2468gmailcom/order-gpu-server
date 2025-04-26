import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Beranda from './pages/Beranda/Beranda';
import ProdukLayanan from './pages/produklayanan/ProdukLayanan';
import Sidebar from './components/Sidebar';
import NotFound from './pages/NotFound';
import AdminDashboard from './pages/admin/AdminDashboard/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/login/LoginPage'; // Import LoginPage
import RegisterPage from './pages/register/Register'; // Import RegisterPage
import LoginAdminPage from './pages/loginadmin/LoginAdmin'; // Import LoginAdminPage

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('ID');
  const [isLoggedInApp, setIsLoggedInApp] = useState(() => {
    const token = localStorage.getItem('token');
    console.log('[App] Initial token check:', token);
    return !!token;
  });
  useEffect(() => {
    const checkLoginStatus = () => {
      setIsLoggedInApp(!!localStorage.getItem('token'));
    };

    window.addEventListener('storage', checkLoginStatus);
    return () => window.removeEventListener('storage', checkLoginStatus);
  }, []);
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedInApp(false);
  };
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

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
  };

  return (
    <>
      <div>
        <Header toggleSidebar={toggleSidebar} isLoggedIn={isLoggedInApp} onLogout={handleLogout} />
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
          languageDropdownOpen={languageDropdownOpen}
          setLanguageDropdownOpen={setLanguageDropdownOpen}
          selectedLanguage={selectedLanguage}
          handleLanguageSelect={handleLanguageSelect}
          scrollToSection={scrollToSectionFromSidebar}
        />
        <Routes>
          <Route path="/" element={<Beranda />} />
          <Route path="/semua-layanan" element={<ProdukLayanan />} />
          <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} /> {/* Kirim onLoginSuccess sebagai props */}
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login-admin" element={<LoginAdminPage />} />

          {/* Route Admin: dibungkus dengan ProtectedRoute */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* 404 Fallback */}
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
}

export default App;