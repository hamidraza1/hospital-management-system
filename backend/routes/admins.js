const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//
const permissionRequestAuth = require("../middleware/permissionRequest.auth");

const Admin = require("../models/admins");
const DoctorAuth = require("../models/doctorAuth");
const ReceptionistAuth = require("../models/receptionistAuth");
const Doctor = require("../models/doctors");

const { userInfo } = require("os");

router.post("/signup", permissionRequestAuth, (req, res, next) => {
  //to hash our password
  bcrypt.hash(req.body.password, 10).then((hash) => {
    if (req.body.role == "Signup As Admin") {
      const admin = new Admin({
        email: req.body.email,
        password: hash,
      });
      admin
        .save()
        .then((result) => {
          res.status(201).json({
            message: "Admin created",
            result: result,
          });
        })
        .catch((err) => {
          //when we will have have a admin with existing email/username
          res.status(500).json({
            err: err,
          });
        });
    } else if (req.body.role == "Signup As Doctor") {
      Doctor.findOne({ email: req.body.email }).then((result) => {
        if (result) {
          return res.status(401).json({
            message:
              "No such Doctor exist in Database, you can only signup If you have alrady been created by Admin",
          });
        }
      });
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
    } else if (req.body.role == "Signup As Receptionist") {
      const receptionistAuth = new ReceptionistAuth({
        email: req.body.email,
        password: hash,
      });
      receptionistAuth
        .save()
        .then((result) => {
          res.status(201).json({
            message: "Receptionist has been signed Up",
            result: result,
          });
        })
        .catch((err) => {
          //when we will have have a Receptionist with existing email/username
          res.status(500).json({
            err: err,
          });
        });
    }
  });
});

router.post("/login", (req, res, next) => {
  if (req.body.role == "Admin") {
    let fetchedAdmin;
    Admin.findOne({ email: req.body.email })
      .then((admin) => {
        //if no admin exist with such email
        if (!admin) {
          return res.status(401).json({ message: "Auth1 failed" });
        }
        fetchedAdmin = admin;
        //if admin email exists, then compare passwords
        return bcrypt.compare(req.body.password, admin.password);
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
            email: fetchedAdmin.email,
            adminId: fetchedAdmin._id,
            loggedInAs: req.body.role,
          },
          "secret_this_should_be_longer",
          { expiresIn: "1h" }
        );
        res.status(200).json({
          token: token,
          expiresIn: 3600,
          userId: fetchedAdmin._id,
          loggedInAs: req.body.role,
        });
      })
      .catch((err) => {
        //
        return res.status(401).json({ message: "Auth3 failed" });
      });
  } else if (req.body.role == "Doctor") {
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
          {
            email: fetchedDoctor.email,
            adminId: fetchedDoctor._id,
            loggedInAs: req.body.role,
          },
          "secret_doctor_this_should_be_longer",
          { expiresIn: "1h" }
        );
        res.status(200).json({
          token: token,
          expiresIn: 3600,
          doctorId: fetchedDoctor._id,
          loggedInAs: req.body.role,
          doctorEmail: fetchedDoctor.email,
        });
      })
      .catch((err) => {
        //
        return res.status(401).json({ message: "Auth3 failed" });
      });
  } else if (req.body.role == "Receptionist") {
    let fetchedReceptionist;
    ReceptionistAuth.findOne({ email: req.body.email })
      .then((receptionist) => {
        //if no receptionist exist with such email
        if (!receptionist) {
          return res.status(401).json({ message: "Auth1 failed" });
        }
        fetchedReceptionist = receptionist;
        //if receptionist email exists, then compare passwords
        return bcrypt.compare(req.body.password, receptionist.password);
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
            email: fetchedReceptionist.email,
            receptionistId: fetchedReceptionist._id,
            loggedInAs: req.body.role,
          },
          "secret_receptionist_this_should_be_longer",
          { expiresIn: "1h" }
        );
        res.status(200).json({
          token: token,
          expiresIn: 3600,
          receptionistId: fetchedReceptionist._id,
          loggedInAs: req.body.role,
        });
      })
      .catch((err) => {
        //
        return res.status(401).json({ message: "Auth3 failed" });
      });
  }
});

module.exports = router;
