import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer'; // Import komponen Footer

const UserLayout = ({ children, toggleSidebar, isSidebarOpen, languageDropdownOpen, setLanguageDropdownOpen, selectedLanguage, handleLanguageSelect, scrollToSection, isLoggedIn, onLogout ,user}) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header toggleSidebar={toggleSidebar} isLoggedIn={isLoggedIn} onLogout={onLogout} user={user} />
      <div className="">
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
      <Footer /> 
    </div>
  );
};

export default UserLayout;