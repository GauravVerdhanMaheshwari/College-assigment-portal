const AccessControl = require("../Models/access_control");
const Paper = require("../Models/paper");
const mongoose = require("mongoose");

exports.grantAccess = async (req, res) => {
  try {
    const { paperId, userId } = req.body;

    await AccessControl.findOneAndUpdate(
      {
        paperId: new mongoose.Types.ObjectId(paperId),
        requestedBy: new mongoose.Types.ObjectId(userId),
      },
      {
        accessStatus: "granted",
        grantedAt: new Date(),
      },
      { new: true }
    );

    res.status(200).json({ message: "Access granted successfully" });
  } catch (err) {
    console.error("Error granting access:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.revokeAccess = async (req, res) => {
  try {
    const { paperId, requestedBy } = req.body;

    await AccessControl.findOneAndUpdate(
      {
        paperId: new mongoose.Types.ObjectId(paperId),
        requestedBy: new mongoose.Types.ObjectId(requestedBy),
      },
      {
        accessStatus: "revoked",
        revokedAt: new Date(),
      }
    );

    res.status(200).json({ message: "Access revoked successfully" });
  } catch (err) {
    console.error("Error revoking access:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.requestAccess = async (req, res) => {
  try {
    const { paperId, requestedBy, requestedTo } = req.body;

    await AccessControl.findOneAndUpdate(
      {
        paperId: new mongoose.Types.ObjectId(paperId),
        requestedBy: new mongoose.Types.ObjectId(requestedBy),
      },
      {
        requestedTo: new mongoose.Types.ObjectId(requestedTo),
        accessStatus: "requested",
        requestedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: "Access requested successfully" });
  } catch (err) {
    console.error("Error requesting access:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.checkAccess = async (req, res) => {
  try {
    const { paperId, requestedBy } = req.params;

    const record = await AccessControl.findOne({
      paperId: new mongoose.Types.ObjectId(paperId),
      requestedBy: new mongoose.Types.ObjectId(requestedBy),
    });

    if (!record) {
      return res.status(200).json({ hasAccess: "none" });
    }

    res.status(200).json({ hasAccess: record.accessStatus });
  } catch (err) {
    console.error("Error checking access:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAccessRequests = async (req, res) => {
  try {
    const { ownerId } = req.params;
    const requests = await AccessControl.find({
      requestedTo: new mongoose.Types.ObjectId(ownerId),
    });

    res.status(200).json(requests);
  } catch (err) {
    console.error("Error fetching access requests:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
