const express = require("express");
const router = express.Router();

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
  let isAppointmentAvailable = false;
  patient.save().then((createdPatient) => {
    res.status(201).json({ message: "Appointment Booked Successfully" });
  });
  /* Patient.findOne({ date: req.body.date, time: req.body.time }).then(
    (result) => {
      isAppointmentAvailable = !result;
      if (isAppointmentAvailable) {
        patient.save().then((createdPatient) => {
          res.status(201).json({ message: "Appointment Booked Successfully" });
        });
      } else {
        res.status(201).json({ message: "not Appointment available" });
      }
    }
  ); */
});

router.get("/", (req, res, next) => {
  Patient.find().then((patients) => {
    res.status(200).json({ patients: patients });
  });
});

router.get("/:id", (req, res, next) => {
  Patient.findOne({ _id: req.params.id }).then((patient) => {
    res.status(200).json({ patient: patient });
  });
});

module.exports = router;
