const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PaperSchema = new Schema(
  {
    title: String,
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
    assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Assignment" },
    submissionDate: { type: Date, default: Date.now },
    grade: { type: Number, default: null },
    fileId: { type: mongoose.Schema.Types.ObjectId, ref: "fs.files" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Paper", PaperSchema);
