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
    const url = req.protocol + "://" + req.get("host");
    const doctor = new Doctor({
      name: req.body.name,
      email: req.body.email,
      speciality: req.body.speciality,
      imagePath: url + "/images/" + req.file.filename,
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
    });
    Doctor.updateOne({ _id: req.params.id }, doctor).then((result) => {
      res
        .status(200)
        .json({ message: "doctor updated successfully", result: result });
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

router.get("/:id", (req, res, next) => {
  Doctor.findById({ _id: req.params.id }).then((doctor) => {
    if (doctor) {
      res.status(200).json(doctor);
    } else {
      res.status(404).json({ message: "doctor not found" });
    }
  });
});

router.delete("/:id", checkAuth, (req, res, next) => {
  console.log(req.params);
  Doctor.deleteOne({ _id: req.params.id }).then((result) => {
    console.log(result);
    res.status(200).json({ message: "doctor deleted successfully" });
  });
});

module.exports = router;
