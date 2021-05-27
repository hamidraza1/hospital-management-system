const mongoose = require("mongoose");

const doctorSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  speciality: { type: String, required: true },
  imagePath: { type: String, required: true },
});

module.exports = mongoose.model("doctor", doctorSchema);
