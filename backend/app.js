const express = require("express");

const app = express();

const doctorsRoutes = require("./routes/doctors");

app.use("/api", doctorsRoutes);

module.exports = app;
