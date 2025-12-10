const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PaperSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    facultyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Faculty",
      required: true,
    },
    class: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    dueDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Assignment", PaperSchema);
