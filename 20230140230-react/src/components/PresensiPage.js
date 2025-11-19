import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function PresensiPage() {
  const [message, setMessage] = useState("");
  const nav = useNavigate();

  const handleCheckIn = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      nav("/login");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:3000/api/presensi/checkin",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage(res.data.message || "Check-in berhasil!");
    } catch (err) {
      setMessage(
        err.response ? err.response.data.message : "Gagal check-in"
      );
    }
  };

  const handleCheckOut = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      nav("/login");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:3000/api/presensi/checkout",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage(res.data.message || "Check-out berhasil!");
    } catch (err) {
      setMessage(
        err.response ? err.response.data.message : "Gagal check-out"
      );
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Presensi</h1>

      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={handleCheckIn}>
          Check-In
        </button>

        <button style={styles.button} onClick={handleCheckOut}>
          Check-Out
        </button>
      </div>

      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
}

const styles = {
  container: { textAlign: "center", marginTop: 70 },
  title: { fontSize: 32, marginBottom: 40 },
  buttonContainer: { display: "flex", justifyContent: "center", gap: 30 },
  button: {
    width: 200,
    height: 100,
    fontSize: 22,
    cursor: "pointer",
    borderRadius: 10,
  },
  message: { marginTop: 30, fontSize: 18 },
};
