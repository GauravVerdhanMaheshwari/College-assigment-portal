const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AccessControlSchema = new Schema(
  {
    paperId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Paper",
      required: true,
    },

    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student", // ✅ FIXED
      required: true,
    },

    requestedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student", // or Faculty later
      required: true,
    },

    accessStatus: {
      type: String,
      enum: ["requested", "granted", "revoked"],
      default: "requested",
    },

    requestedAt: Date,
    grantedAt: Date,
    revokedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("AccessControl", AccessControlSchema);
