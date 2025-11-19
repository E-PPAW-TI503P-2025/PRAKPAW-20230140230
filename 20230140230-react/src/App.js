import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import DashboardPage from './components/DashboardPage';
import PresensiPage from './components/PresensiPage';   // <--- TAMBAHKAN
import ReportPage from './components/ReportPage';       // <--- OPTIONAL (nanti)
 
function App() {
  return (
    <Router>

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/presensi" element={<PresensiPage />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/" element={<LoginPage />} />
      </Routes>

    </Router>
  );
}

export default App;
