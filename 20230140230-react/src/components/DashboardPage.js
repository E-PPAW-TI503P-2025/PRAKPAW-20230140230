import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-yellow-400 to-red-500 flex items-center justify-center p-10">

      <div className="bg-white/30 backdrop-blur-xl p-10 rounded-3xl border border-white/40 shadow-2xl text-center max-w-xl">

        <h1 className="text-5xl font-extrabold text-white drop-shadow-lg mb-4 animate-bounce">
          🎉 Selamat Datang! 🎉
        </h1>

        <p className="text-white text-lg mb-10">
          ANDA BERHASIL MASUK KE DASHBOARD
        </p>

        <button
          onClick={logout}
          className="px-8 py-3 bg-white text-red-600 font-bold rounded-xl shadow-lg hover:bg-red-100 transition"
        >
          Logout
        </button>

      </div>

    </div>
  );
}