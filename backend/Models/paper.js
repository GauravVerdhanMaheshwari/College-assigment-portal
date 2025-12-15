const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PaperSchema = new Schema(
  {
    title: String,
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
    assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Assignment" },

    fileId: { type: mongoose.Schema.Types.ObjectId, ref: "fs.files" },

    grade: { type: Number, default: null },

    isPublic: { type: Boolean, default: false },
    visibilityUpdatedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Paper", PaperSchema);
