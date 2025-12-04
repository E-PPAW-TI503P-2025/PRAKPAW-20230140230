const { Presensi } = require("../models");
const { format } = require("date-fns-tz");
const timeZone = "Asia/Jakarta";

const CheckIn = async (req, res) => {
  try {
    const { id: userId, nama: userName } = req.user;
    const waktuSekarang = new Date();
    const { latitude, longitude } = req.body;

    const existingRecord = await Presensi.findOne({
      where: { userId: userId, checkOut: null },
    });

    if (existingRecord) {
      return res
        .status(400)
        .json({ message: "Anda sudah melakukan check-in hari ini." });
    }

    const newRecord = await Presensi.create({
      userId: userId,
	  nama: userName,
      checkIn: waktuSekarang,
      latitude: latitude,
      longitude: longitude,
    });

    const formattedData = {
      userId: newRecord.userId,
      checkIn: format(newRecord.checkIn, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
      checkOut: null,
      latitude: newRecord.latitude,
      longitude: newRecord.longitude,
    };

    res.status(201).json({
      message: `Halo ${userName}, check-in Anda berhasil pada pukul ${format(
        waktuSekarang,
        "HH:mm:ss",
        { timeZone }
      )} WIB`,
      data: formattedData,
    });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

const CheckOut = async (req, res) => {
  try {
    const { id: userId, nama: userName } = req.user;
    const waktuSekarang = new Date();
    const { latitude, longitude } = req.body;

    const recordToUpdate = await Presensi.findOne({
      where: { userId: userId, checkOut: null },
    });

    if (!recordToUpdate) {
      return res.status(404).json({
        message: "Tidak ditemukan catatan check-in yang aktif untuk Anda.",
      });
    }

    recordToUpdate.checkOut = waktuSekarang;
    if (latitude) recordToUpdate.latitude = latitude;
    if (longitude) recordToUpdate.longitude = longitude;
    await recordToUpdate.save();

    const formattedData = {
      userId: recordToUpdate.userId,
      checkIn: format(recordToUpdate.checkIn, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
      checkOut: format(recordToUpdate.checkOut, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
      latitude: recordToUpdate.latitude,
      longitude: recordToUpdate.longitude,
    };

    res.json({
      message: `Selamat jalan ${userName}, check-out Anda berhasil pada pukul ${format(
        waktuSekarang,
        "HH:mm:ss",
        { timeZone }
      )} WIB`,
      data: formattedData,
    });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

const deletePresensi = async (req, res) => {
  // Isi fungsi deletePresensi Anda
  try {
    const { id: userId } = req.user;
    const presensiId = req.params.id;
    const recordToDelete = await Presensi.findByPk(presensiId);

    if (!recordToDelete) {
      return res
        .status(404)
        .json({ message: "Catatan presensi tidak ditemukan." });
    }
    // Perbaikan: gunakan triple equals (===)
    if (recordToDelete.userId !== userId) { 
      return res
        .status(403)
        .json({ message: "Akses ditolak: Anda bukan pemilik catatan ini." });
    }
    await recordToDelete.destroy();
    res.status(204).send();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

const updatePresensi = async (req, res) => {
  try {
    const presensiId = req.params.id;
    const { checkIn, checkOut, latitude, longitude } = req.body;

    if (checkIn === undefined && checkOut === undefined && latitude === undefined && longitude === undefined) {
      return res.status(400).json({
        message:
          "Request body tidak berisi data yang valid untuk diupdate (checkIn, checkOut, latitude, atau longitude).",
      });
    }
    const recordToUpdate = await Presensi.findByPk(presensiId);
    if (!recordToUpdate) {
      return res
        .status(404)
        .json({ message: "Catatan presensi tidak ditemukan." });
    }

    recordToUpdate.checkIn = checkIn || recordToUpdate.checkIn;
    recordToUpdate.checkOut = checkOut || recordToUpdate.checkOut;
    recordToUpdate.latitude = latitude !== undefined ? latitude : recordToUpdate.latitude;
    recordToUpdate.longitude = longitude !== undefined ? longitude : recordToUpdate.longitude;
    await recordToUpdate.save();

    res.json({
      message: "Data presensi berhasil diperbarui.",
      data: recordToUpdate,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

// EKSPOR SEMUA FUNGSI DI SATU TEMPAT
module.exports = {
    CheckIn,
    CheckOut,
    deletePresensi,
    updatePresensi
};