const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const PermissionRequest = require("../models/permissionRequest");

router.post("/login", (req, res, next) => {
  let fetchedAdminOrDoc;
  PermissionRequest.findOne({ email: req.body.email })
    .then((fetched) => {
      //if no admin exist with such email
      if (!fetched) {
        return res.status(401).json({ message: "Auth1 failed" });
      }

      fetchedAdminOrDoc = fetched;
      //if admin email exists, then compare passwords
      return bcrypt.compare(req.body.password, fetched.password);
    })
    .then((result) => {
      //result => true, if password was correct, otherwise false
      if (!result) {
        return res.status(401).json({ message: "Auth2 failed" });
      }
      //If everything is verified, a token will be generated, and will be sent back to frontend
      //where it will be attached to each outgoing request
      const token = jwt.sign(
        { email: fetchedAdminOrDoc.email, AdminOrDocId: fetchedAdminOrDoc._id },
        "secret_fetchedAdminOrDoc_this_should_be_longer",
        { expiresIn: "1h" }
      );

      res.status(200).json({
        token: token,
        fetchedAdminOrDoc: fetchedAdminOrDoc,
      });
    })
    .catch((err) => {
      //
      return res.status(401).json({ message: "Auth3 failed" });
    });
});

module.exports = router;
