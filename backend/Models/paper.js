const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PaperSchema = new Schema(
  {
    title: String,

    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
    assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Assignment" },

    fileId: { type: mongoose.Schema.Types.ObjectId, ref: "fs.files" },

    grade: { type: Number, default: null },

    submittedAt: {
      type: Date,
      default: Date.now,
    },

    isLate: {
      type: Boolean,
      default: false,
    },

    comments: [
      {
        facultyId: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty" },
        text: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],

    downloads: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId },
        role: { type: String, enum: ["student", "faculty"] },
        downloadedAt: { type: Date, default: Date.now },
      },
    ],

    isPublic: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Paper", PaperSchema);
