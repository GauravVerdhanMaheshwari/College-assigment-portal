// Models/Report.js
const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },
    paperId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Paper",
      required: true,
    },
    reporterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Report", ReportSchema);
