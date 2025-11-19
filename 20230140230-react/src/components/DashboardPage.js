import React from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function DashboardPage() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // Jika tidak ada token, kembali ke login
  if (!token) {
    navigate("/login");
    return null;
  }

  // Decode token
  const user = jwtDecode(token);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-yellow-400 to-red-500 p-6">

      {/* Navbar */}
      <div className="flex justify-between items-center bg-white/30 backdrop-blur-md px-6 py-4 rounded-xl shadow-lg border border-white/40">
        <h2 className="text-white text-xl font-bold">
          Halo, {user.nama} 👋
        </h2>

        <button
          onClick={logout}
          className="px-5 py-2 bg-red-500 text-white font-bold rounded-lg shadow-md hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center mt-20">

        <h1 className="text-4xl font-extrabold text-white drop-shadow-lg mb-10">
          Dashboard Presensi
        </h1>

        <div className="flex flex-col gap-6 w-full max-w-md">
          
          {/* Tombol menuju Presensi */}
          <button
            onClick={() => navigate("/presensi")}
            className="w-full py-4 bg-white text-green-700 font-bold rounded-2xl shadow-xl hover:bg-green-100 text-xl transition"
          >
            📍 Pergi ke Presensi
          </button>

          {/* Tombol menuju Report hanya jika admin */}
          {user.role === "admin" && (
            <button
              onClick={() => navigate("/report")}
              className="w-full py-4 bg-white text-blue-700 font-bold rounded-2xl shadow-xl hover:bg-blue-100 text-xl transition"
            >
              📊 Laporan (Admin)
            </button>
          )}

        </div>

      </div>
    </div>
  );
}
