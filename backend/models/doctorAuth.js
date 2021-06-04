const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const doctorAuthSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

//we will add mongoose-unique-validator as plugin to our model, so it will check it always before saving to database
//it will validate that always a unique email is saved to DB
doctorAuthSchema.plugin(uniqueValidator);

module.exports = mongoose.model("DoctorAuth", doctorAuthSchema);
