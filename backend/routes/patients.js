const express = require("express");
const router = express.Router();

const checkAuth = require("../middleware/check.auth");

const Patient = require("../models/patients");

router.post("/datePicked", (req, res, next) => {
  Patient.find({ date: req.body.date }).then((patientsWithSpecificDate) => {
    res.status(200).json({ patients: patientsWithSpecificDate });
  });
});

router.post("/", (req, res, next) => {
  const patient = new Patient({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    category: req.body.category,
    profession: req.body.profession,
    date: req.body.date,
    time: req.body.time,
    description: req.body.description,
  });
  Patient.findOne({ date: req.body.date, time: req.body.time })
    .then((result) => {
      return result;
    })
    .then((result) => {
      if (result == null) {
        patient.save().then((createdPatient) => {
          res.status(201).json({ message: "Appointment Booked Successfully" });
        });
      } else {
        res.status(500).json({ message: "Appointment Already booked" });
      }
    });
});

router.get("/", (req, res, next) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.currentPage;
  const patientQuery = Patient.find();
  let fetchedPatients;
  if (pageSize && currentPage) {
    patientQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  patientQuery
    .then((documents) => {
      fetchedPatients = documents;
      return Patient.count();
    })
    .then((count) => {
      res.status(200).json({
        message: "patients fetched successfully",
        patients: fetchedPatients,
        maxPatients: count,
      });
    });
});

router.get("/:id", (req, res, next) => {
  Patient.findOne({ _id: req.params.id }).then((patient) => {
    res.status(200).json({ patient: patient });
  });
});

router.put("/:id", checkAuth, (req, res, next) => {
  const patient = new Patient({
    _id: req.body.id,
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    category: req.body.category,
    profession: req.body.profession,
    date: req.body.date,
    time: req.body.time,
    description: req.body.description,
  });

  Patient.updateOne({ _id: req.body.id }, patient).then((result) => {
    if (result.n > 0) {
      res
        .status(200)
        .json({ message: "patient updated successfully", result: result });
    } else {
      res.status(401).json({ message: "Auth6 failed" });
    }
  });
});

router.delete("/:id", checkAuth, (req, res, next) => {
  const patientId = req.params.id;
  console.log(patientId);
  Patient.deleteOne({ _id: patientId }).then((result) => {
    if (result.n > 0) {
      res.status(200).json({ message: "doctor deleted successfully" });
    } else {
      res.status(401).json({ message: "Auth7 failed" });
    }
  });
});

module.exports = router;
