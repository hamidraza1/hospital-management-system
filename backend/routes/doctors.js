const express = require("express");
const router = express.Router();
//multer pkg for image upload
const multer = require("multer");

//
const checkAuth = require("../middleware/check.auth");

//multer-config, where it should put file when i detect incoming file
const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + Date.now() + "." + ext);
  },
});

const Doctor = require("../models/doctors");

//multer will extract single file from the incoming req,and will try to find image prop in req body
//we will store path to the database(for that we have to construct url)
router.post(
  "/",
  checkAuth,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    if (
      req.adminData.role === "Doctor" ||
      req.adminData.role === "Receptionist"
    ) {
      return res.status(401).json({
        message: "Doctor or Receptionist can not add new Doctors",
      });
    }
    const url = req.protocol + "://" + req.get("host");
    const doctor = new Doctor({
      name: req.body.name,
      email: req.body.email,
      speciality: req.body.speciality,
      imagePath: url + "/images/" + req.file.filename,
      //we will fetch the Admin Id from the inferred token,bcs adminId was inferred while generating the token
      creator: req.adminData.id,
      assignedPatients: [],
    });
    doctor.save().then((createdDoctor) => {
      res.status(201).json({
        message: "doctor added successfully",
        doctor: {
          id: createdDoctor._id,
          ...createdDoctor,
        },
      });
    });
  }
);

router.put(
  "/:id",
  checkAuth,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    if (req.adminData.role === "Receptionist") {
      return res.status(401).json({
        message: "Receptionist can not update a Doctor",
      });
    }
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename;
    }

    const doctor = new Doctor({
      _id: req.body.id,
      name: req.body.name,
      email: req.body.email,
      speciality: req.body.speciality,
      imagePath: imagePath,
      creator: req.adminData.id,
    });
    //creator:rew.adminData.adminId => we will verify, only that admin will be able to edit the doctor who created it
    Doctor.updateOne(
      {
        $or: [
          { _id: req.params.id, creator: req.adminData.id },
          { _id: req.params.id, email: req.adminData.email },
        ],
      },
      doctor
    ).then((result) => {
      if (result.n > 0) {
        res
          .status(200)
          .json({ message: "doctor updated successfully", result: result });
      } else {
        res.status(401).json({ message: "Auth5 failed" });
      }
    });
  }
);

router.get("/", (req, res, next) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.currentPage;
  const postQuery = Doctor.find();
  let fetchedDoctors;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
    .then((documents) => {
      fetchedDoctors = documents;
      return Doctor.count();
    })
    .then((count) => {
      res.status(200).json({
        message: "doctors fetched successfully",
        doctors: fetchedDoctors,
        maxDoctors: count,
      });
    });
});

router.get("/:id", checkAuth, (req, res, next) => {
  /* if (req.adminData.role === "Receptionist") {
    return res.status(401).json({
      message: "Receptionist can not edit Doctor",
    });
  } */
  Doctor.findById({ _id: req.params.id }).then((doctor) => {
    if (doctor) {
      res.status(200).json(doctor);
    } else {
      res.status(404).json({ message: "doctor not found" });
    }
  });
});

router.delete("/:id", checkAuth, (req, res, next) => {
  if (req.adminData.role === "Receptionist") {
    return res.status(401).json({
      message: "Receptionist can not delete Doctor",
    });
  }
  //creator:rew.adminData.adminId => we will verify, only that admin will be able to edit the doctor who created it
  Doctor.deleteOne({ _id: req.params.id, creator: req.adminData.id }).then(
    (result) => {
      /*       res.status(200).json({ message: "doctor deleted successfully" }); */
      if (result.n > 0) {
        res.status(200).json({ message: "doctor deleted successfully" });
      } else {
        res.status(401).json({ message: "Auth6 failed" });
      }
    }
  );
});

module.exports = router;
