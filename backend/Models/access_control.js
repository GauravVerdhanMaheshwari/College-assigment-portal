const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AccessControlSchema = new Schema(
  {
    paperId: { type: mongoose.Schema.Types.ObjectId, ref: "Paper" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    accessStatus: {
      type: String,
      enum: ["granted", "revoked", "requested"],
      default: "requested",
    },
    grantedAt: {
      type: Date,
      default: Date.now,
    },
    revokedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AccessControl", AccessControlSchema);
