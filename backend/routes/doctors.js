const express = require("express");
const router = express.Router();

const Doctor = require("../models/doctors");

router.post("/", (req, res, next) => {
  const doctor = new Doctor({
    name: req.body.name,
    email: req.body.email,
    speciality: req.body.speciality,
  });
  doctor.save().then((result) => {
    res
      .status(201)
      .json({ message: "doctor added successfully", doctorId: result._id });
  });
});

router.put("/:id", (req, res, next) => {
  const doctor = new Doctor({
    _id: req.body.id,
    name: req.body.name,
    email: req.body.email,
    speciality: req.body.speciality,
  });
  Doctor.updateOne({ _id: req.params.id }, doctor).then((result) => {
    res.status(200).json({ message: "doctor updated successfully" });
  });
});

router.get("/", (req, res, next) => {
  Doctor.find().then((doctors) => {
    res
      .status(200)
      .json({ message: "doctors fetched successfully", doctors: doctors });
  });
});

router.get("/:id", (req, res, next) => {
  Doctor.findById({ _id: req.params.id }).then((doctor) => {
    if (doctor) {
      res.status(200).json(doctor);
    } else {
      res.status(404).json({ message: "doctor not found" });
    }
  });
});

router.delete("/:id", (req, res, next) => {
  console.log(req.params);
  Doctor.deleteOne({ _id: req.params.id }).then((result) => {
    console.log(result);
    res.status(200).json({ message: "doctor deleted successfully" });
  });
});

module.exports = router;
