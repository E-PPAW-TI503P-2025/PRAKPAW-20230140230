const { Presensi, User } = require("../models");
const { Op } = require("sequelize");
const sequelize = require("sequelize");

exports.getDailyReport = async (req, res) => {
  try {
    const { nama } = req.query;
    let options = { 
      where: {},
      include: [{ model: User, as: 'user', attributes: ['id', 'nama', 'email'] }],
      attributes: {
        include: [
          [sequelize.fn('COALESCE', sequelize.col('Presensi.nama'), sequelize.col('user.nama')), 'displayNama']
        ]
      }
    };

    if (nama) {
      options.where[Op.or] = [
        { nama: { [Op.like]: `%${nama}%` } },
        sequelize.where(sequelize.col('user.nama'), Op.like, `%${nama}%`)
      ];
    }

    const records = await Presensi.findAll(options);

    res.json({
      reportDate: new Date().toLocaleDateString(),
      data: records,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal mengambil laporan", error: error.message });
  }
};
