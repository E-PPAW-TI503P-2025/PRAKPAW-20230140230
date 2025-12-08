import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ReportPage() {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReports(""); 
  }, []);

  const fetchReports = async (query = "", tanggalMulai = "", tanggalSelesai = "") => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      let url = "http://localhost:3001/api/reports/daily";
      const params = [];

      if (query) {
        params.push(`nama=${encodeURIComponent(query)}`);
      }

      if (tanggalMulai && tanggalSelesai) {
        params.push(`tanggalMulai=${encodeURIComponent(tanggalMulai)}`);
        params.push(`tanggalSelesai=${encodeURIComponent(tanggalSelesai)}`);
      }

      if (params.length > 0) {
        url += "?" + params.join("&");
      }

      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setReports(res.data.data);
      setError(null);
    } catch (err) {
      setReports([]);
      setError(
        err.response ? err.response.data.message : "Gagal mengambil data"
      );
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchReports(searchTerm, startDate, endDate);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setStartDate("");
    setEndDate("");
    fetchReports("", "", "");
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-bold text-blue-800">LAPORAN PRESENSI</h1>
        <button
          onClick={() => fetchReports(searchTerm, startDate, endDate)}
          className="bg-blue-800 text-white px-4 py-2 rounded shadow"
        >
          🔄 Refresh Data
        </button>
      </div>

      <form onSubmit={handleSearchSubmit} className="mb-6 space-y-4 bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cari Nama
            </label>
            <input
              type="text"
              placeholder="Cari berdasarkan nama..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tanggal Mulai
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tanggal Selesai
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            type="submit"
            className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700"
          >
            Cari
          </button>
          <button
            type="button"
            onClick={handleClearFilters}
            className="py-2 px-4 bg-gray-400 text-white font-semibold rounded-md shadow-sm hover:bg-gray-500"
          >
            Reset
          </button>
        </div>
      </form>

      {error && (
        <p className="text-red-600 bg-red-100 p-4 rounded-md mb-4">{error}</p>
      )}

      {!error && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden p-4">
          <div className="border-2 border-gray-200 p-6 bg-white">
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="bg-purple-100 text-sm text-purple-800">
                  <th className="border px-4 py-3">No</th>
                  <th className="border px-4 py-3">Nama</th>
                  <th className="border px-4 py-3">Foto</th>
                  <th className="border px-4 py-3">Masuk</th>
                  <th className="border px-4 py-3">Lokasi</th>
                  <th className="border px-4 py-3">Keluar</th>
                  <th className="border px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {reports.length > 0 ? (
                  reports.map((presensi, idx) => {
                    // Build proper image URL
                    let fotoUrl = null;
                    if (presensi.buktiFoto) {
                      let path = presensi.buktiFoto.replace(/\\/g, '/');
                      if (!path.startsWith('/uploads/')) {
                        path = '/uploads/' + path.replace(/^\/?uploads\/?/, '').replace(/^\//,'');
                      }
                      fotoUrl = `http://localhost:3001${path}`;
                      console.log('buktiFoto:', presensi.buktiFoto, '-> fotoUrl:', fotoUrl);
                    }
                    
                    return (
                    <tr key={presensi.id} className="text-sm">
                      <td className="border px-4 py-3 text-center align-top">{idx + 1}.</td>
                      <td className="border px-4 py-3 align-top font-medium">{presensi.dataValues?.displayNama || presensi.user?.nama || presensi.nama || 'N/A'}</td>
                      <td className="border px-4 py-3 align-top">
                        {fotoUrl ? (
                          <img 
                            src={fotoUrl}
                            alt="foto" 
                            className="w-16 h-16 object-cover rounded border-2 border-red-500 cursor-pointer hover:opacity-75"
                            onClick={() => setSelectedPhoto(fotoUrl)}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              const errorDiv = document.createElement('div');
                              errorDiv.style.width = '64px';
                              errorDiv.style.height = '64px';
                              errorDiv.style.backgroundColor = '#f3f4f6';
                              errorDiv.style.borderRadius = '4px';
                              errorDiv.style.display = 'flex';
                              errorDiv.style.alignItems = 'center';
                              errorDiv.style.justifyContent = 'center';
                              errorDiv.textContent = 'Error';
                              e.target.parentElement.appendChild(errorDiv);
                            }}
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">-</div>
                        )}
                      </td>
                      <td className="border px-4 py-3 align-top text-blue-700">
                        {presensi.checkIn ? new Date(presensi.checkIn).toLocaleString('id-ID') : '-'}
                      </td>
                      <td className="border px-4 py-3 align-top text-center text-sm text-gray-600">
                        {presensi.latitude && presensi.longitude ? `${parseFloat(presensi.latitude).toFixed(5)}, ${parseFloat(presensi.longitude).toFixed(5)}` : '-'}
                      </td>
                      <td className="border px-4 py-3 align-top text-red-600">
                        {presensi.checkOut ? new Date(presensi.checkOut).toLocaleString('id-ID') : '-'}
                      </td>
                      <td className="border px-4 py-3 align-top italic text-gray-700">{presensi.checkOut ? 'Selesai' : 'Berlangsung'}</td>
                    </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="border px-4 py-6 text-center text-gray-500">Tidak ada data yang ditemukan.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL FOTO FULLSCREEN */}
      {selectedPhoto && (
        <div 
          onClick={() => setSelectedPhoto(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            cursor: 'pointer'
          }}
        >
          <div onClick={e => e.stopPropagation()} style={{ position: 'relative', maxWidth: '90%', maxHeight: '90%' }}>
            <img 
              src={selectedPhoto} 
              alt="fullscreen" 
              style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: 8 }}
            />
            <button
              onClick={() => setSelectedPhoto(null)}
              style={{
                position: 'absolute',
                top: 10,
                right: 10,
                background: '#fff',
                border: 'none',
                borderRadius: '50%',
                width: 40,
                height: 40,
                fontSize: 24,
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReportPage;
