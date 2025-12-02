import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await axios.post('http://localhost:3001/api/auth/login', {
        email, password
      });

      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response ? err.response.data.message : 'Login gagal');
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="bg-bwhite/20 backdrop-blur-xl p-10 rounded-2xl shadow-2xl border border-white/30 max-w-md w-full">
        
        <h1 className="text-4xl font-extrabold text-black text-center mb-8 tracking-wide">
          Login
        </h1>

        <form onSubmit={handleLogin} className="space-y-6">
          
          <div>
            <label className="text-black font-bold">Email</label>
            <input
              type="email"
              className="w-full mt-2 p-3 rounded-lg bg-black/30 text-black placeholder-white/80 focus:ring-2 focus:ring-white focus:outline-none"
              placeholder="Masukkan email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-black font-bold">Password</label>
            <input
              type="password"
              className="w-full mt-2 p-3 rounded-lg bg-black/30 text-black placeholder-white/80 focus:ring-2 focus:ring-white focus:outline-none"
              placeholder="Masukkan password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-red-200 text-center">{error}</p>}

          <button className="w-full py-3 bg-white text-blue-700 font-bold rounded-xl shadow-lg hover:bg-blue-100 transition">
            Login
          </button>
        </form>

        <p className="text-center text-black mt-6">
          Belum punya akun? <a href="/register" className="underline">Register</a>
        </p>
      </div>
    </div>
  );
}