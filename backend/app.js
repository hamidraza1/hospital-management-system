const express = require("express");
const app = express();

//connecting express to database
const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://hamid:pOERgvSpS81h9Ec6@cluster0.8mbn1.mongodb.net/HMS-Database?retryWrites=true&w=majority"
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

//Middleware => Beacuse of CORS error
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Request-With, Content-Type,Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS, PUT"
  );
  next();
});

const doctorsRoutes = require("./routes/doctors");

app.use("/api/doctors", doctorsRoutes);

module.exports = app;
