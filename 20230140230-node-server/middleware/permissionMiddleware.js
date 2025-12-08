const jwt = require("jsonwebtoken");

exports.addUserData = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token hilang" });

    const decoded = jwt.verify(token, "INI_ADALAH_KUNCI_RAHASIA_ANDA_YANG_SANGAT_AMAN");
    req.user = decoded; // => berisi id, nama, role

    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Token tidak valid" });
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Akses ditolak: Admin saja" });
  }
};
