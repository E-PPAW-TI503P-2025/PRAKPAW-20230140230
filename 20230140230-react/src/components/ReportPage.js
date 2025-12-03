import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { Clock } from 'lucide-react'; // Menggunakan Lucide icons

// Pastikan port ini sudah 3001 sesuai konfigurasi server.js Anda
const API_URL = "http://localhost:3001/api/reports"; 

export default function ReportPage() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        
        // --- LOGIKA OTORISASI ADMIN (PENTING!) ---
        if (!token) {
            // Jika tidak ada token, langsung redirect ke login
            console.error('Token tidak ditemukan. Mengarahkan ke halaman Login.');
            navigate('/login');
            return;
        }

        let isAdmin = false;
        try {
            const decoded = jwtDecode(token);
            if (decoded.role === 'admin') {
                isAdmin = true;
            } else {
                // Jika token ada tapi role bukan admin, redirect ke dashboard (akses ditolak)
                console.error('Akses ditolak: Pengguna bukan Admin. Mengarahkan ke Dashboard.');
                navigate('/dashboard'); 
                return;
            }
        } catch (err) {
            console.error('Token invalid atau decoding gagal:', err);
            localStorage.removeItem('token');
            navigate('/login');
            return;
        }

        // --- PENGAMBILAN DATA (Hanya jika admin) ---
        if (isAdmin) {
            const fetchReports = async () => {
                try {
                    const res = await axios.get(API_URL, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setReports(res.data.data); // Asumsi data laporan ada di res.data.data
                    setError(null);
                } catch (err) {
                    setError(err.response?.data?.message || 'Gagal mengambil data laporan dari server.');
                    // Jika fetch gagal (misal server 401/403), cek apakah token masih valid
                    if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                        navigate('/login'); // Redirect jika token ditolak server
                    }
                } finally {
                    setLoading(false);
                }
            };
            fetchReports();
        } else {
             // Jika ada skenario yang terlewat, tetap berhenti loading di sini.
            setLoading(false);
        }
    }, [navigate]);

    if (loading) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center text-gray-600">
                <Clock className="w-6 h-6 animate-spin mr-2" />
                Memuat data laporan...
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center flex-col p-8 bg-red-50 rounded-xl m-4">
                <p className="text-red-600 font-bold mb-2">Error Pengambilan Data:</p>
                <p className="text-sm text-red-500 text-center">{error}</p>
                <p className="text-xs mt-3 text-gray-500">Pastikan server Node.js Anda berjalan dan endpoint '/api/reports' sudah siap.</p>
            </div>
        );
    }

    const formatDateTime = (dateTime) => {
        if (!dateTime) return '-';
        return new Date(dateTime).toLocaleString('id-ID', {
            dateStyle: 'short',
            timeStyle: 'medium',
        });
    };

    return (
        <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">Laporan Presensi Admin</h1>
            
            <div className="shadow-lg rounded-xl overflow-x-auto bg-white">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-pink-600 text-white">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Nama</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Waktu Masuk</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Lokasi Masuk (Lat/Lng)</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Waktu Keluar</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Lokasi Keluar (Lat/Lng)</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {reports.length > 0 ? (
                            reports.map((report, index) => (
                                <tr key={index} className="hover:bg-pink-50 transition duration-150">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {report.nama}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDateTime(report.checkIn)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {report.lat_in && report.lng_in ? `${report.lat_in.toFixed(5)}, ${report.lng_in.toFixed(5)}` : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDateTime(report.checkOut)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {report.lat_out && report.lng_out ? `${report.lat_out.toFixed(5)}, ${report.lng_out.toFixed(5)}` : '-'}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                    Belum ada data presensi.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
        </div>
    );
}