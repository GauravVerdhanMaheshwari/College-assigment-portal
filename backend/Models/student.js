const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const studentSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  enrollmentNumber: { type: Number, required: true, unique: true },
  course: { type: String, required: true },
  division: { type: String, required: true },
  year: { type: Number, required: true },
  role: { type: String, required: true }
});

module.exports = mongoose.model("Student", studentSchema);
