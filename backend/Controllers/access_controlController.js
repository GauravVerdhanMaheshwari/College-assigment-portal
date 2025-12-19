const AccessControl = require("../Models/access_control");
const Paper = require("../Models/paper");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

exports.grantAccess = async (req, res) => {
  try {
    const { paperId, userId } = req.body;
    const accessControl = new AccessControl({
      paperId: ObjectId(paperId),
      userId: ObjectId(userId),
      accessStatus: "granted",
    });
    await accessControl.save();
    res.status(201).json({ message: "Access granted successfully" });
  } catch (err) {
    console.error("Error granting access:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.revokeAccess = async (req, res) => {
  try {
    const { paperId, userId } = req.body;
    const accessControl = new AccessControl({
      paperId: ObjectId(paperId),
      userId: ObjectId(userId),
      accessStatus: "revoked",
    });
    await accessControl.save();
    res.status(201).json({ message: "Access revoked successfully" });
  } catch (err) {
    console.error("Error revoking access:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.checkAccess = async (req, res) => {
  try {
    const { paperId, userId } = req.params;
    const accessRecord = await AccessControl.findOne({
      paperId: ObjectId(paperId),
      userId: ObjectId(userId),
    }).sort({ createdAt: -1 });
    if (!accessRecord || accessRecord.accessStatus === "revoked") {
      return res.status(403).json({ hasAccess: false });
    }
    res.status(200).json({ hasAccess: true });
  } catch (err) {
    console.error("Error checking access:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAccessiblePapers = async (req, res) => {
  try {
    const { userId } = req.params;
    const accessRecords = await AccessControl.find({
      userId: ObjectId(userId),
      accessStatus: "granted",
    }).select("paperId -_id");
    const paperIds = accessRecords.map((record) => record.paperId);
    const papers = await Paper.find({ _id: { $in: paperIds } });
    res.status(200).json(papers);
  } catch (err) {
    console.error("Error fetching accessible papers:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
