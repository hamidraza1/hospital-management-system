const mongoose = require("mongoose");

const doctorSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  speciality: { type: String, required: true },
  imagePath: { type: String, required: true },
  experience: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  englishLevel: { type: String, required: true },
  deutschLevel: { type: String, required: true },
  arabicLevel: { type: String, required: true },
  description: { type: String, required: true },
  specialityDegree: { type: String, required: true },
  specialityDegreeCompleteion: { type: String, required: true },
  specialityDegreeInstitute: { type: String, required: true },
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
