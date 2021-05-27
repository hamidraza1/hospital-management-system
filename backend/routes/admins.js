const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Admin = require("../models/admins");
const { userInfo } = require("os");

router.post("/signup", (req, res, next) => {
  //to hash our password
  bcrypt.hash(req.body.password, 10).then((hash) => {
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
  });
});

router.post("/login", (req, res, next) => {
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
        { email: fetchedAdmin.email, adminId: fetchedAdmin._id },
        "secret_this_should_be_longer",
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
      });
    })
    .catch((err) => {
      //
      return res.status(401).json({ message: "Auth3 failed" });
    });
});

module.exports = router;
