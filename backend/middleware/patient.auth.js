const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.patientauthorization.split(" ")[1];

    const decodedToken = jwt.verify(
      token,
      "secret_fetchedPatient_this_should_be_longer"
    );

    next();
  } catch {
    res.status(401).json({ message: "Auth4! failed" });
  }
};
