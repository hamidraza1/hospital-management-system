const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const permissionRequestSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

permissionRequestSchema.plugin(uniqueValidator);

module.exports = mongoose.model("PermissionRequest", permissionRequestSchema);
