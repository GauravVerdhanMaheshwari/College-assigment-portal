const AccessControl = require("../Models/access_control");
const Paper = require("../Models/paper");
const mongoose = require("mongoose");

exports.grantAccess = async (req, res) => {
  try {
    const { paperId, requestedBy } = req.body;

    if (!paperId || !requestedBy) {
      return res.status(400).json({ error: "Missing parameters" });
    }

    const updated = await AccessControl.findOneAndUpdate(
      {
        paperId,
        requestedBy,
      },
      {
        accessStatus: "granted",
        grantedAt: new Date(),
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Access request not found" });
    }

    res.status(200).json(updated);
  } catch (err) {
    console.error("Error granting access:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.revokeAccess = async (req, res) => {
  try {
    const { paperId, requestedBy } = req.body;

    const updated = await AccessControl.findOneAndUpdate(
      { paperId, requestedBy },
      {
        accessStatus: "revoked",
        revokedAt: new Date(),
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Access request not found" });
    }

    res.status(200).json(updated);
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
      requestedTo: ownerId,
    })
      .populate({
        path: "paperId",
        select: "title subject assignmentId",
        populate: {
          path: "assignmentId",
          select: "title subject",
        },
      })
      .populate({
        path: "requestedBy",
        select: "name email enrollmentNumber",
      })
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (err) {
    console.error("Error fetching access requests:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getStudentAccessRequests = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ error: "Invalid student ID" });
    }

    const requests = await AccessControl.find({
      requestedBy: studentId,
    })
      .populate({
        path: "paperId",
        select: "title subject assignmentId",
        populate: {
          path: "assignmentId",
          select: "topic subject",
        },
      })
      .populate({
        path: "requestedTo",
        select: "name email",
      })
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (err) {
    console.error("Error fetching student access requests:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
