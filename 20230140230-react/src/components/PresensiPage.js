import React, { useState, useEffect, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Fix for missing marker icons in leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

export default function PresensiPage() {

  const [coords, setCoords] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);

  const webcamRef = useRef(null);

  // ============================
  //  AMBIL LOKASI OTOMATIS
  // ============================
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      pos => {
        setCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
      },
      err => {
        console.log("ERR GEO :", err);
        setError("Izin lokasi ditolak. Aktifkan GPS.");
      }
    );
  }, []);

  // ============================
  //  FOTO SELFIE
  // ============================
  const capture = useCallback(() => {
    const img = webcamRef.current.getScreenshot();
    setImage(img);
  }, []);

  // ============================
  //  TOKEN GETTER
  // ============================
  const getToken = () => {
    return localStorage.getItem("token");
  };

  // ============================
  //  CHECK IN
  // ============================
  const handleCheckIn = async () => {
    if (!coords) return setError("Lokasi belum terdeteksi!");
    if (!image) return setError("Foto wajib diambil!");

    try {
      const blob = await (await fetch(image)).blob();

      let formData = new FormData();
      formData.append("latitude", coords.lat);
      formData.append("longitude", coords.lng);
      formData.append("buktiFoto", blob, "selfie.jpg");

      const res = await axios.post(
        "http://localhost:3001/api/presensi/check-in",
        formData,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      setMessage(res.data.message);
      setImage(null);
    } catch (err) {
      console.log("ERR CHECKIN:", err && err.response ? err.response.data : err);
      const errorMsg = err.response?.data?.error || err.message || "Kesalahan pada server. Cek backend.";
      setError(errorMsg);
    }
  };

  const handleCheckOut = async () => {
    try {
      const res = await axios.post(
        "http://localhost:3001/api/presensi/check-out",
        {},
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      setMessage(res.data.message);
    } catch (err) {
      console.log("ERR CHECKOUT:", err && err.response ? err.response.data : err);
      const errorMsg = err.response?.data?.error || err.message || "Kesalahan pada server. Cek backend.";
      setError(errorMsg);
    }
  };

  return (
    <div className="p-4" style={{ maxWidth: 900, margin: '0 auto' }}>

      <h1 style={{ textAlign: 'center', fontSize: 28, fontWeight: '700', marginBottom: 6 }}>Lakukan Presensi</h1>
      {error && <p style={{ textAlign: 'center', color: '#e53e3e', marginBottom: 12 }}>{error}</p>}

      {/* MAP */}
      <div className="mb-4" style={{ borderRadius: 8, overflow: 'hidden' }}>
        <MapContainer
          center={[coords ? coords.lat : -7.782, coords ? coords.lng : 110.367]}
          zoom={coords ? 15 : 12}
          style={{ height: '180px', width: '100%' }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {coords && (
            <Marker position={[coords.lat, coords.lng]}>
              <Popup>Lokasi Anda</Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      {/* KAMERA */}
      <div style={{ background: '#000', borderRadius: 8, padding: 18, display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ width: 260, height: 160, borderRadius: 14, overflow: 'hidden', background: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {!image ? (
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="w-full h-full object-cover"
              videoConstraints={{ facingMode: "user" }}
            />
          ) : (
            <img src={image} alt="Selfie" className="w-full h-full object-cover" />
          )}
        </div>
      </div>

      {/* BUTTON AMBIL FOTO */}
      <div className="mb-3">
        {!image ? (
          <button onClick={capture} className="bg-gray-600 text-white px-4 py-3 rounded w-full">Foto Ulangi 🔄</button>
        ) : (
          <button onClick={() => setImage(null)} className="bg-gray-600 text-white px-4 py-3 rounded w-full">Foto Ulangi 🔄</button>
        )}
      </div>

      {/* BUTTONS CHECK IN / CHECK OUT */}
      <div style={{ display: 'flex', gap: 12 }}>
        <button onClick={handleCheckIn} className="bg-blue-600 text-white px-4 py-3 rounded flex-1">Check-In</button>
        <button onClick={handleCheckOut} className="bg-red-600 text-white px-4 py-3 rounded flex-1">Check-Out</button>
      </div>

      {message && <p className="text-green-600 mt-2" style={{ textAlign: 'center' }}>{message}</p>}
    </div>
  );
}
