const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userManagerSchema = new Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

module.exports = mongoose.model("UserManager", userManagerSchema);
