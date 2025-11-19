import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import Dashboard from "./components/Dashboard";
import PresensiPage from "./components/PresensiPage";
import ReportPage from "./components/ReportPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/presensi" element={<PresensiPage />} />
        <Route path="/report" element={<ReportPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
