import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (error) {
        console.error('Token decoding failed:', error);
        localStorage.removeItem('token');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-pink-600 text-white p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex space-x-6">
          <Link to="/dashboard" className="font-semibold hover:bg-blue-700 px-3 py-2 rounded">
            Dashboard
          </Link>
          <Link to="/presensi" className="font-semibold hover:bg-blue-700 px-3 py-2 rounded">
            Presensi
          </Link>
          {user && user.role === 'admin' && (
            <Link to="/reports" className="font-semibold hover:bg-blue-700 px-3 py-2 rounded">
              Laporan Admin
            </Link>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {user && <span className="font-semibold">{user.nama} {user.role}</span>}
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded font-semibold transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;