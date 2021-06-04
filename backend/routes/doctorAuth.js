const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//
const doctorCheckAuth = require("../middleware/check.auth");

const DoctorAuth = require("../models/doctorAuth");

router.post("/signup", (req, res, next) => {
  //to hash our password
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const doctorAuth = new DoctorAuth({
      email: req.body.email,
      password: hash,
    });
    doctorAuth
      .save()
      .then((result) => {
        res.status(201).json({
          message: "Doctor has been signed Up",
          result: result,
        });
      })
      .catch((err) => {
        //when we will have have a Doctor with existing email/username
        res.status(500).json({
          err: err,
        });
      });
  });
});

router.post("/login", (req, res, next) => {
  let fetchedDoctor;
  DoctorAuth.findOne({ email: req.body.email })
    .then((doctor) => {
      //if no doctor exist with such email
      if (!doctor) {
        return res.status(401).json({ message: "Auth1 failed" });
      }
      fetchedDoctor = doctor;
      //if admin email exists, then compare passwords
      return bcrypt.compare(req.body.password, doctor.password);
    })
    .then((result) => {
      //result => true, if password was correct, otherwise false
      if (!result) {
        return res.status(401).json({ message: "Auth2 failed" });
      }
      //If everything is verified, a token will be generated, and will be sent back to frontend
      //where it will be attached to each outgoing request
      const token = jwt.sign(
        { email: fetchedDoctor.email, adminId: fetchedDoctor._id },
        "secret_doctor_this_should_be_longer",
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        doctorId: fetchedDoctor._id,
      });
    })
    .catch((err) => {
      //
      return res.status(401).json({ message: "Auth3 failed" });
    });
});

module.exports = router;
