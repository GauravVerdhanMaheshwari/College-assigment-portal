const Assignment = require("../Models/assignment");
const { getGridFSBucket } = require("../config/gridfs");

// Create a new assignment
exports.createAssignment = async (req, res) => {
  try {
    const assignment = new Assignment(req.body);
    await assignment.save();
    res.status(201).json(assignment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.uploadAssignmentFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    if (req.file.mimetype !== "application/pdf") {
      return res.status(400).json({
        message: "Only PDF files are allowed",
      });
    }

    const bucket = getGridFSBucket();

    if (!bucket) {
      return res.status(500).json({
        message: "GridFS bucket not initialized",
      });
    }

    const uploadStream = bucket.openUploadStream(req.file.originalname, {
      contentType: req.file.mimetype,
      metadata: { type: "assignment" },
    });

    // ✅ attach listeners FIRST
    uploadStream.on("error", (err) => {
      console.error("GridFS upload error:", err);
      return res.status(500).json({
        message: "Upload failed",
        error: err.message,
      });
    });

    uploadStream.on("finish", () => {
      return res.status(201).json({
        success: true,
        fileId: uploadStream.id,
        fileName: req.file.originalname,
      });
    });

    uploadStream.end(req.file.buffer);
  } catch (err) {
    console.error("Upload controller error:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.updateAssignmentFile = async (req, res) => {
  try {
    const { id } = req.params;
    const { fileName } = req.body;

    const assignment = await Assignment.findById(id);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    const bucket = getGridFSBucket();

    let newFileId = assignment.fileId;
    let newFileName = assignment.fileName;

    /* ✅ if new PDF uploaded */
    if (req.file) {
      if (req.file.mimetype !== "application/pdf") {
        return res.status(400).json({ message: "Only PDF allowed" });
      }

      // 🔥 delete old file
      if (assignment.fileId) {
        try {
          await bucket.delete(new mongoose.Types.ObjectId(assignment.fileId));
        } catch (err) {
          console.warn("Old file delete failed:", err.message);
        }
      }

      // 🔥 upload new file
      const uploadStream = bucket.openUploadStream(req.file.originalname, {
        contentType: req.file.mimetype,
        metadata: { type: "assignment" },
      });

      uploadStream.end(req.file.buffer);

      await new Promise((resolve, reject) => {
        uploadStream.on("finish", resolve);
        uploadStream.on("error", reject);
      });

      newFileId = uploadStream.id;
      newFileName = req.file.originalname;
    }

    /* ✅ if only title changed */
    if (fileName) {
      newFileName = fileName;
    }

    assignment.fileId = newFileId;
    assignment.fileName = newFileName;

    await assignment.save();

    res.json({
      success: true,
      message: "Assignment file updated",
      fileId: newFileId,
      fileName: newFileName,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Get all assignments
exports.getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find();
    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get assignment by ID
exports.getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }
    res.status(200).json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update assignment by ID
exports.updateAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }
    res.status(200).json(assignment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete assignment by ID
exports.deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndDelete(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }
    res.status(200).json({ message: "Assignment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get assignments by faculty ID
exports.getAssignmentsByFacultyId = async (req, res) => {
  try {
    const assignments = await Assignment.find({ facultyId: req.params.id });
    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.toggleLateSubmission = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    assignment.allowLateSubmission = !assignment.allowLateSubmission;
    await assignment.save();

    res.json({
      allowLateSubmission: assignment.allowLateSubmission,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
