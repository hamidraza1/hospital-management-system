const express = require("express");
const app = express();
const path = require("path");

//connecting express to database
const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://hamid:pOERgvSpS81h9Ec6@cluster0.8mbn1.mongodb.net/HMS-Database"
  )
  .then(() => {
    console.log("connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });

//To extarct data, which is coming with post request
const bodyParser = require("body-parser");
app.use(express.json());

//any request targeting 'images' folder will continue,and fetch files from there
app.use("/images", express.static("backend/images"));

//Middleware => Beacuse of CORS error
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Request-With, Content-Type,Accept,Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS, PUT"
  );
  next();
});

const doctorsRoutes = require("./routes/doctors");
const adminsRoutes = require("./routes/admins");
const patientsRoutes = require("./routes/patients");
const doctorAuthRoutes = require("./routes/doctorAuth");
const permissionRequestRoutes = require("./routes/permissionRequest");

app.use("/api/doctors", doctorsRoutes);
app.use("/api/admin", adminsRoutes);
app.use("/api/patients", patientsRoutes);
app.use("/api/doctorAuth", doctorAuthRoutes);
app.use("/api/permission-request", permissionRequestRoutes);

module.exports = app;
