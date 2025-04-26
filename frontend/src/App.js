// import logo from './logo.svg';
import './App.css';
import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Remove BrowserRouter import
import Header from './components/Header';
import Beranda from './pages/Beranda/Beranda';
// import SemuaLayanan from './pages/SemuaLayanan';

function App() {
  return (
    <>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<Beranda />} />
          {/* <Route path="/semua-layanan" element={<SemuaLayanan />} /> */}

          {/* <Route path="/connectivity" element={<ConnectivityPage />} /> */}
          {/* <Route path="/data-center" element={<DataCenterPage />} /> */}
          {/* Definisikan rute-rute lainnya di sini */}
        </Routes>
      </div>
    </>
  );
}

export default App;