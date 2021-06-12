const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const patientAuthSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

patientAuthSchema.plugin(uniqueValidator);

module.exports = mongoose.model("PatientAuth", patientAuthSchema);
