import React from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const nav = useNavigate();

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Dashboard</h1>

      <div style={styles.buttonContainer}>
        <button
          style={styles.button}
          onClick={() => nav("/presensi")}
        >
          Presensi
        </button>

        <button
          style={styles.button}
          onClick={() => nav("/report")}
        >
          Report
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    marginTop: 80,
  },
  title: {
    fontSize: 32,
    marginBottom: 40,
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    gap: 20,
  },
  button: {
    width: 250,
    height: 120,
    fontSize: 24,
    cursor: "pointer",
    borderRadius: 10,
    border: "2px solid #333"
  },
};
