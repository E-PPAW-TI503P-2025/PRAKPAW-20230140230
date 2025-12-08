const multer = require("multer");
const path = require("path");
const { Presensi, User } = require("../models");

// ==========================
//  SETUP MULTER
// ==========================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Hanya file gambar yang diperbolehkan!"), false);
  }
};

// 👉 INI YANG PENTING
exports.upload = multer({ storage, fileFilter });

// ==========================
//     CHECK-IN
// ==========================
exports.checkIn = async (req, res) => {
  try {
    const { id: userId, nama } = req.user || {};
    let { latitude, longitude } = req.body || {};

    const buktiFoto = req.file ? req.file.path : null;

    // Ensure latitude/longitude are numbers if provided
    if (latitude !== undefined) latitude = parseFloat(latitude);
    if (longitude !== undefined) longitude = parseFloat(longitude);

    // If token does not contain nama, read from DB as fallback
    let finalNama = nama;
    if (!finalNama) {
      try {
        const usr = await User.findByPk(userId);
        finalNama = usr ? usr.nama : null;
      } catch (e) {
        console.error('Failed to fetch user for nama fallback', e && e.message ? e.message : e);
        finalNama = null;
      }
    }

    // include nama because model requires it (allowNull: false)
    const newRecord = await Presensi.create({
      userId,
      nama: finalNama,
      checkIn: new Date(),
      latitude,
      longitude,
      buktiFoto,
    });

    res.status(201).json({
      message: "Check-In berhasil",
      data: newRecord,
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// ==========================
//     CHECK-OUT
// ==========================
exports.checkOut = async (req, res) => {
  try {
    const { id: userId } = req.user;

    const record = await Presensi.findOne({
      where: { userId, checkOut: null },
    });

    if (!record) {
      return res.status(404).json({ message: "Anda belum Check-In!" });
    }

    record.checkOut = new Date();
    await record.save();

    res.json({ message: "Check-Out berhasil!", data: record });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// ==========================
// UPDATE & DELETE
// ==========================
exports.updatePresensi = async (req, res) => {
  try {
    await Presensi.update(req.body, { where: { id: req.params.id } });
    res.json({ message: "Update berhasil" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deletePresensi = async (req, res) => {
  try {
    await Presensi.destroy({ where: { id: req.params.id } });
    res.json({ message: "Delete berhasil" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
