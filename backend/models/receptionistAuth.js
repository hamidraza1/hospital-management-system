const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const receptionistAuthSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

//we will add mongoose-unique-validator as plugin to our model, so it will check it always before saving to database
//it will validate that always a unique email is saved to DB
receptionistAuthSchema.plugin(uniqueValidator);

module.exports = mongoose.model("ReceptionistAuth", receptionistAuthSchema);
