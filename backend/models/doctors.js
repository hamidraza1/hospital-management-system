const mongoose = require("mongoose");

const doctorSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  speciality: { type: String, required: true },
  imagePath: { type: String, required: true },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
  },
  assignedPatients: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Patient",
  },
});

module.exports = mongoose.model("Doctor", doctorSchema);
