const express = require('express');
const router = express.Router();

const { addUserData } = require('../middleware/permissionMiddleware');
const { authenticateToken } = require('../middleware/authMiddleware');

const presensiController = require('../controllers/presensiController');
const { checkIn, checkOut, updatePresensi, deletePresensi, upload } = presensiController;

router.use(authenticateToken);
router.use(addUserData);

router.post("/check-in", authenticateToken, upload.single("buktiFoto"), checkIn);
router.post('/check-out', checkOut);
router.put('/:id', updatePresensi);
router.delete('/:id', deletePresensi);

module.exports = router;
