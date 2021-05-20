const express = require("express");
const router = express.Router();

router.get("/create-doctors", (req, res, next) => {
  const doctor = [
    { id: "gb22aa", name: "ali", email: "ali@gmail.com", speciality: "heart" },
    { id: "gb21", name: "kashif", email: "ali@gmail.com", speciality: "heart" },
  ];
  res
    .status(200)
    .json({ message: "doctors fetched successfully", doctors: doctors });
});

module.exports = router;
