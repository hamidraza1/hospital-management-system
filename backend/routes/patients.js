const express = require("express");
const router = express.Router();

const checkPatientAuth = require("../middleware/patient.auth");
const checkAdminPatientAuth = require("../middleware/adminOrPatient.auth");
const checkAuth = require("../middleware/check.auth");

const Patient = require("../models/patients");
const Doctor = require("../models/doctors");

router.post("/datePicked", (req, res, next) => {
  Patient.find({ date: req.body.date })
    .then((patientsWithSpecificDate) => {
      res.status(200).json({ patients: patientsWithSpecificDate });
    })
    .catch((err) => console.log(error));
});

router.post("/", checkPatientAuth, (req, res, next) => {
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
  Patient.findOne({ date: req.body.date, time: req.body.time }).then(
    (result) => {
      Patient.findOne({ email: req.body.email }).then((response) => {
        if (response) {
          console.log("a");
          return res.status(401).json({
            messgae: "Appointment has already been booked by this patient",
          });
        } else {
          if (result == null) {
            patient.save().then((createdPatient) => {
              res
                .status(201)
                .json({ message: "Appointment Booked Successfully" });
            });
          } else {
            res.status(500).json({ message: "Appointment Already booked" });
          }
        }
      });
    }
  );
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

//checkAdminPatientAuth disabled because Receptionist wants to get details
router.get(
  "/:id",
  /* checkAdminPatientAuth, */ (req, res, next) => {
    if (req.adminData && req.adminData.role === "Doctor") {
      return res.status(401).json({
        message: "Doctor can not edit a Patient",
      });
    }
    Patient.findOne({ _id: req.params.id }).then((patient) => {
      res.status(200).json({ patient: patient });
    });
  }
);

router.get("/patient-email/:email", checkPatientAuth, (req, res, next) => {
  Patient.findOne({ email: req.params.email }).then((patient) => {
    res.status(200).json({ patient: patient });
  });
});

router.put("/:id", checkAdminPatientAuth, (req, res, next) => {
  if (req.adminData && req.adminData.role === "Doctor") {
    return res.status(401).json({
      message: "Doctor can not edit a Patient",
    });
  }
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

router.delete("/:id", checkAdminPatientAuth, (req, res, next) => {
  if (req.adminData && req.adminData.role === "Doctor") {
    return res.status(401).json({
      message: "Doctor can not edit a Patient",
    });
  }
  const patientId = req.params.id;
  console.log(patientId);
  Patient.deleteOne({ _id: patientId }).then((result) => {
    console.log(result);
    if (result.n > 0) {
      res.status(200).json({ message: "doctor deleted successfully" });
    } else {
      res.status(401).json({ message: "Auth7 failed" });
    }
  });
});

router.put("/assign/doctor-to-patient", (req, res, next) => {
  Patient.updateOne(
    { _id: req.body.patientId },
    { $set: { assignedDoctor: req.body.doctorId } }
  )
    .then((result) => {
      if (result.n > 0) {
        res
          .status(200)
          .json({ message: "doctor assigned to patient successfully" });
      } else {
        res.status(401).json({ message: "Auth8 failed" });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

router.put("/assign/patients-to-doctor", (req, res, next) => {
  patientId = req.body.patientId;

  //If patient is transferred from one Doc1 to Doc2, He will be deleted first from Doc1 assignedPatients Array.
  Doctor.find().then((doctors) => {
    doctors.map((doctor) => {
      if (
        doctor.assignedPatients &&
        doctor.assignedPatients.indexOf(req.body.patientId) !== -1
      ) {
        console.log(doctor._id);
        Doctor.updateOne(
          { _id: doctor._id },
          { $pull: { assignedPatients: patientId } }
        ).then((result) => {
          if (result.n > 0) {
            res.status(200).json({ message: "patient unassigned from doctor" });
          }
        });
      }
    });
  });

  //Then He will be assigned to Doc2
  Doctor.updateOne(
    { _id: req.body.doctorId },
    { $addToSet: { assignedPatients: patientId } }
  ).then((result) => {
    if (result.n > 0) {
      res
        .status(200)
        .json({ message: "patient assigned to doctor successfully" });
    } else {
      res.status(401).json({ message: "Auth9 failed" });
    }
  });
});

module.exports = router;
