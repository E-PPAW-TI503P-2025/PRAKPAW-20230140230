import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Tentukan URL API secara terpusat
const API_URL = "http://localhost:3000/api/presensi"; 

export default function PresensiPage() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [coords, setCoords] = useState(null); // State untuk menyimpan koordinat
  const [isLoading, setIsLoading] = useState(false);
  const nav = useNavigate();

  // Fungsi utilitas untuk mendapatkan lokasi
  const getGeolocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        return reject("Geolocation tidak didukung oleh browser ini.");
      }
      // Dapatkan posisi dengan timeout 10 detik dan presisi tinggi
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (err) => {
          reject(`Gagal mendapatkan lokasi: ${err.message}. Mohon berikan izin.`);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  };

  const handlePresensi = async (endpoint) => {
    const token = localStorage.getItem("token");
    if (!token) return nav("/login");

    setIsLoading(true);
    setMessage("");
    setError("");

    try {
      // 1. Dapatkan lokasi pengguna
      const location = await getGeolocation();
      
      // 2. Kirim permintaan ke backend dengan data lokasi
      const res = await axios.post(
        `${API_URL}/${endpoint}`,
        {
          latitude: location.latitude,
          longitude: location.longitude,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage(res.data.message || `${endpoint.replace('-', ' ')} berhasil!`);
      // Simpan koordinat yang berhasil untuk tampilan opsional
      setCoords(location); 

    } catch (err) {
      // Menangkap error dari getGeolocation ATAU dari axios
      const errorMessage = err.response?.data?.message || err.message || `Gagal ${endpoint.replace('-', ' ')}`;
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi Check-In yang memanggil fungsi utama
  const handleCheckIn = () => handlePresensi("check-in");

  // Fungsi Check-Out yang memanggil fungsi utama
  const handleCheckOut = () => handlePresensi("check-out");

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Presensi</h1>
      
      {/* Tampilkan pesan loading saat mengambil lokasi atau mengirim data */}
      {isLoading && <p style={styles.loading}>Memproses... Mohon tunggu dan berikan izin lokasi.</p>}

      <div style={styles.buttonContainer}>
        <button 
          style={styles.button} 
          onClick={handleCheckIn}
          disabled={isLoading} // Nonaktifkan saat loading
        >
          Check-In
        </button>

        <button 
          style={{...styles.button, ...styles.checkoutButton}} 
          onClick={handleCheckOut}
          disabled={isLoading} // Nonaktifkan saat loading
        >
          Check-Out
        </button>
      </div>

      {coords && (
        <p style={styles.info}>
          Lokasi terakhir berhasil didapatkan: Lat {coords.latitude.toFixed(6)}, Lng {coords.longitude.toFixed(6)}
        </p>
      )}

      {message && <p style={styles.success}>{message}</p>}
      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
}

const styles = {
  container: { textAlign: "center", marginTop: 70, padding: '0 20px' },
  title: { fontSize: 32, marginBottom: 40, color: '#333' },
  buttonContainer: { display: "flex", justifyContent: "center", gap: 30 },
  button: {
    width: 200,
    height: 100,
    fontSize: 22,
    cursor: "pointer",
    borderRadius: 10,
    border: 'none',
    fontWeight: 'bold',
    transition: '0.3s',
    backgroundColor: '#4CAF50', // Hijau untuk Check-In
    color: 'white',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  checkoutButton: {
    backgroundColor: '#f44336', // Merah untuk Check-Out
  },
  loading: { marginTop: 30, fontSize: 18, color: '#2196F3', fontWeight: 'bold' },
  info: { marginTop: 15, fontSize: 14, color: '#666' },
  success: { marginTop: 30, fontSize: 18, color: 'green', fontWeight: 'bold' },
  error: { marginTop: 30, fontSize: 18, color: 'red', fontWeight: 'bold' },
};