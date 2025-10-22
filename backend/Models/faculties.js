const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const facultySchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  course: { type: String, required: true },
  division: { type: String, required: true },
  subject: { type: String, required: true },
  year: { type: Number, required: true },
  role: { type: String, required: true },
});

module.exports = mongoose.model("Faculty", facultySchema);
