import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage() {
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('mahasiswa');
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await axios.post('http://localhost:3001/api/auth/register', {
        nama, email, password, role
      });

      alert('Registrasi berhasil!');
      navigate('/login');
    } catch (err) {
      setError(err.response ? err.response.data.message : 'Registrasi gagal');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-indigo-500 to-pink-500 flex items-center justify-center p-6">
      <div className="bg-white/20 backdrop-blur-xl p-10 rounded-2xl shadow-2xl border border-white/30 max-w-md w-full">

        <h1 className="text-4xl font-extrabold text-white text-center mb-8 tracking-wide">
          Register
        </h1>

        <form onSubmit={handleRegister} className="space-y-6">

          <div>
            <label className="text-white font-semibold">Nama</label>
            <input
              type="text"
              className="w-full mt-2 p-3 rounded-lg bg-white/30 text-white placeholder-white/80 focus:ring-2 focus:ring-white"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Masukkan nama..."
            />
          </div>

          <div>
            <label className="text-white font-semibold">Email</label>
            <input
              type="email"
              className="w-full mt-2 p-3 rounded-lg bg-white/30 text-white placeholder-white/80 focus:ring-2 focus:ring-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan email..."
            />
          </div>

          <div>
            <label className="text-white font-semibold">Password</label>
            <input
              type="password"
              className="w-full mt-2 p-3 rounded-lg bg-white/30 text-white placeholder-white/80 focus:ring-2 focus:ring-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password..."
            />
          </div>

          <div>
            <label className="text-white font-semibold">Role</label>
            <select
              className="w-full mt-2 p-3 rounded-lg bg-white/30 text-white focus:ring-2 focus:ring-white"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="mahasiswa" className="text-black">Mahasiswa</option>
              <option value="admin" className="text-black">Admin</option>
            </select>
          </div>

          {error && <p className="text-red-200 text-center">{error}</p>}

          <button className="w-full py-3 bg-white text-indigo-700 font-bold rounded-xl shadow-lg hover:bg-indigo-100 transition">
            Register
          </button>
        </form>

        <p className="text-center text-white mt-6">
          Sudah punya akun? <a href="/login" className="underline">Login</a>
        </p>

      </div>
    </div>
  );
}