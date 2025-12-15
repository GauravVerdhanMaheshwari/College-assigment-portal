const Paper = require("../Models/paper");
const { getGridFSBucket } = require("../config/gridfs");

// Get all papers
exports.getAllPapers = async (req, res) => {
  try {
    const papers = await Paper.find();
    res.status(200).json(papers);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a paper by ID
exports.getPaperById = async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id);
    if (!paper) {
      return res.status(404).json({ message: "Paper not found" });
    }
    res.status(200).json(paper);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a paper by ID
exports.updatePaperById = async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id);
    if (!paper) {
      return res.status(404).json({ message: "Paper not found" });
    }

    // Update metadata
    paper.title = req.body.title ?? paper.title;
    paper.grade = req.body.grade ?? paper.grade;

    // If new file uploaded
    if (req.file) {
      const bucket = getGridFSBucket();

      // delete old file
      await bucket.delete(paper.fileId);

      // upload new file
      const uploadStream = bucket.openUploadStream(req.file.originalname, {
        contentType: req.file.mimetype,
      });

      uploadStream.end(req.file.buffer);

      paper.fileId = uploadStream.id;
    }

    await paper.save();
    res.status(200).json(paper);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a paper by ID
exports.deletePaperById = async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id);
    if (!paper) return res.status(404).json({ message: "Paper not found" });

    const bucket = getGridFSBucket();
    await bucket.delete(paper.fileId);

    await paper.deleteOne();

    res.json({
      message: "Paper deleted",
      assignmentId: paper.assignmentId,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Search papers by student ID
exports.getPapersByStudentId = async (req, res) => {
  try {
    const papers = await Paper.find({ studentId: req.params.studentId });
    res.json(papers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search papers by assignment ID
exports.getPapersByAssignmentId = async (req, res) => {
  try {
    const papers = await Paper.find({ assignmentId: req.params.assignmentId });
    res.status(200).json(papers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Grade a paper
exports.gradePaper = async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id);
    if (!paper) {
      return res.status(404).json({ message: "Paper not found" });
    }
    paper.grade = req.body.grade;
    await paper.save();
    res.status(200).json(paper);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all graded papers
exports.getGradedPapers = async (req, res) => {
  try {
    const papers = await Paper.find({ grade: { $ne: null } });
    res.status(200).json(papers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get ungraded papers
exports.getUngradedPapers = async (req, res) => {
  try {
    const papers = await Paper.find({ grade: null });
    res.status(200).json(papers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get papers submitted within a date range
exports.getPapersByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const papers = await Paper.find({
      submissionDate: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    });
    res.status(200).json(papers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upload a paper file
exports.uploadPaperFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const bucket = getGridFSBucket();

    const uploadStream = bucket.openUploadStream(req.file.originalname, {
      contentType: req.file.mimetype,
    });

    uploadStream.end(req.file.buffer); // ✅ FIX HERE

    uploadStream.on("error", (err) => {
      console.error(err);
      res.status(500).json({ message: "Upload failed" });
    });

    uploadStream.on("finish", async () => {
      const paper = new Paper({
        title: req.body.title,
        studentId: req.body.studentId,
        assignmentId: req.body.assignmentId,
        fileId: uploadStream.id,
      });

      await paper.save();

      res.status(201).json({
        success: true,
        paper,
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Download a paper file
exports.downloadPaper = async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id);
    if (!paper) return res.status(404).json({ message: "Paper not found" });

    const bucket = getGridFSBucket();

    // Fetch the file info from GridFS
    const files = await bucket.find({ _id: paper.fileId }).toArray();
    if (!files || files.length === 0) {
      return res.status(404).json({ message: "File not found in GridFS" });
    }

    const file = files[0];

    // Set headers for download
    res.set({
      "Content-Type": "application/pdf", // force PDF type
      "Content-Disposition": `attachment; filename="${file.filename}"`,
    });

    // Stream the file
    bucket.openDownloadStream(paper.fileId).pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.getMySubmissions = async (req, res) => {
  const { studentId } = req.params;
  const papers = await Paper.find({ studentId });
  res.status(200).json(papers);
};

exports.toggleVisibility = async (req, res) => {
  const paper = await Paper.findById(req.params.id);
  paper.isPublic = !paper.isPublic;
  paper.visibilityUpdatedAt = new Date();
  await paper.save({ timestamps: false });
  res.json(paper);
};
