const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3001;
const morgan = require("morgan");
const path = require('path');

// Impor router
const presensiRoutes = require("./routes/presensi");
const reportRoutes = require("./routes/reports");
const authRoutes = require('./routes/auth');
const iotRoutes = require("./routes/iot");

// Middleware - CORS dan JSON parser HARUS di awal
app.use("/api/iot", iotRoutes);
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Static files - HARUS sebelum rute lain
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), { 
  maxAge: '1h',
  etag: false 
}));
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});
app.get("/", (req, res) => {
  res.send("Home Page for API");
});
const ruteBuku = require("./routes/books");
app.use("/api/books", ruteBuku);
app.use("/api/presensi", presensiRoutes);
app.use("/api/reports", reportRoutes);
app.use('/api/auth', authRoutes);
app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}/`);
});
