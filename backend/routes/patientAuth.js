const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const PatientAuth = require("../models/patientAuth");

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then((hashedPassword) => {
    const patientAuth = new PatientAuth({
      email: req.body.email,
      password: hashedPassword,
    });
    patientAuth
      .save()
      .then((result) => {
        res.status(201).json({
          message: "Patient Signed up",
          result: result,
        });
      })
      .catch((err) => {
        //when we will have have a Patient with existing email/username
        res.status(500).json({
          err: err,
        });
      });
  });
});

router.post("/login", (req, res, next) => {
  let fetchedPatient;
  PatientAuth.findOne({ email: req.body.email })
    .then((patient) => {
      //if no admin exist with such email
      if (!patient) {
        return res.status(401).json({ message: "Auth1 failed" });
      }
      fetchedPatient = patient;
      //if admin email exists, then compare passwords
      return bcrypt.compare(req.body.password, patient.password);
    })
    .then((result) => {
      //result => true, if password was correct, otherwise false
      if (!result) {
        return res.status(401).json({ message: "Auth2 failed" });
      }
      //If everything is verified, a token will be generated, and will be sent back to frontend
      //where it will be attached to each outgoing request
      const token = jwt.sign(
        {
          email: fetchedPatient.email,
          adminId: fetchedPatient._id,
        },
        "secret_fetchedPatient_this_should_be_longer"
      );
      res.status(200).json({
        token: token,
        patientId: fetchedPatient._id,
        patient: fetchedPatient,
      });
    })
    .catch((err) => {
      //
      return res.status(401).json({ message: "Auth3 failed" });
    });
});

module.exports = router;
