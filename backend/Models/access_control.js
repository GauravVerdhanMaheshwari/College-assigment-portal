const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AccessControlSchema = new Schema(
  {
    paperId: { type: mongoose.Schema.Types.ObjectId, ref: "Paper" },
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // User requesting access
    requestedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Owner of the paper
    accessStatus: {
      type: String,
      enum: ["granted", "revoked", "requested"],
      default: "requested",
    },
    requestedAt: {
      type: Date,
      default: Date.now,
    },
    grantedAt: {
      type: Date,
      default: null,
    },
    revokedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AccessControl", AccessControlSchema);
