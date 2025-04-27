import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const UserLayout = ({ children, toggleSidebar, isSidebarOpen, languageDropdownOpen, setLanguageDropdownOpen, selectedLanguage, handleLanguageSelect, scrollToSection, isLoggedIn, onLogout }) => {
  return (
    <div>
      <Header toggleSidebar={toggleSidebar} isLoggedIn={isLoggedIn} onLogout={onLogout} />
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={toggleSidebar}
        languageDropdownOpen={languageDropdownOpen}
        setLanguageDropdownOpen={setLanguageDropdownOpen}
        selectedLanguage={selectedLanguage}
        handleLanguageSelect={handleLanguageSelect}
        scrollToSection={scrollToSection}
      />
      <div className="">
        {children}
      </div>
    </div>
  );
};

export default UserLayout;
