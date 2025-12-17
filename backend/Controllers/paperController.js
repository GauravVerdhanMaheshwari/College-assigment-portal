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

    if (!paper) {
      return res.status(404).json({ message: "Paper not found" });
    }

    // 🚫 BLOCK deletion if graded
    if (paper.grade !== null && paper.grade !== undefined) {
      return res.status(403).json({
        message: "This paper has been graded and cannot be deleted",
      });
    }

    await paper.deleteOne();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Search papers by student ID
exports.getPapersByStudentId = async (req, res) => {
  try {
    const papers = await Paper.find({ studentId: req.params.studentId })
      .populate("assignmentId", "title")
      .populate("comments.facultyId", "name"); // ✅ POPULATE FACULTY NAME

    res.json(
      papers.map((p) => ({
        _id: p._id,
        title: p.assignmentId?.title || "Untitled Assignment",
        grade: p.grade,
        isPublic: p.isPublic,
        createdAt: p.createdAt,
        assignmentId: p.assignmentId?._id,
        comments: p.comments.map((c) => ({
          _id: c._id,
          text: c.text,
          facultyName: c.facultyId?.name || "Faculty",
          createdAt: c.createdAt,
        })),
      }))
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
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
  const { grade } = req.body;

  if (grade < 0 || grade > 100)
    return res.status(400).json({ message: "Grade must be 0–100" });

  const paper = await Paper.findById(req.params.id);
  if (!paper) return res.status(404).json({ message: "Paper not found" });

  paper.grade = grade;
  await paper.save();

  res.json({ grade });
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

    const files = await bucket.find({ _id: paper.fileId }).toArray();
    if (!files.length) {
      return res.status(404).json({ message: "File not found in GridFS" });
    }

    const file = files[0];
    const role = req.query.role || "unknown";

    paper.downloads.push({
      userId: req.user ? req.user._id : null,
      role,
    });
    await paper.save();

    res.set({
      "Content-Type": file.contentType || "application/pdf",
      "Content-Disposition": `attachment; filename="${file.filename}"`,
    });

    const stream = bucket.openDownloadStream(paper.fileId);

    stream.on("error", (err) => {
      console.error(err);
      res.status(500).json({ message: "Download error" });
    });

    stream.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.getDownloadHistory = async (req, res) => {
  const paper = await Paper.findById(req.params.id).populate(
    "downloads.userId",
    "name email"
  );

  if (!paper) return res.status(404).json({ message: "Paper not found" });

  res.json(
    paper.downloads.map((d) => ({
      name: d.userId?.name || "Unknown",
      role: d.role,
      downloadedAt: d.downloadedAt,
    }))
  );
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

exports.getFacultyPapers = async (req, res) => {
  try {
    const papers = await Paper.find()
      .populate("studentId", "name enrollmentNumber division course year")
      .populate("assignmentId", "title");

    res.json(
      papers.map((p) => ({
        _id: p._id,
        title: p.assignmentId?.title || "Untitled Assignment",
        studentName: p.studentId?.name,
        enrollment: p.studentId?.enrollmentNumber,
        division: p.studentId?.division,
        course: p.studentId?.course,
        semester: p.studentId?.year,
        grade: p.grade,
        comments: p.comments,
      }))
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addComment = async (req, res) => {
  const { facultyId, text } = req.body;
  const { id } = req.params;

  const paper = await Paper.findById(id);
  if (!paper) return res.status(404).json({ message: "Paper not found" });

  paper.comments.push({ facultyId, text });
  await paper.save();

  res.status(201).json(paper.comments.at(-1));
};

exports.deleteComment = async (req, res) => {
  const { paperId, commentId } = req.params;

  const paper = await Paper.findById(paperId);
  if (!paper) return res.status(404).json({ message: "Paper not found" });

  paper.comments = paper.comments.filter((c) => c._id.toString() !== commentId);

  await paper.save();
  res.json({ success: true, commentId });
};

exports.updateComment = async (req, res) => {
  const { paperId, commentId } = req.params;
  const { text } = req.body;

  const paper = await Paper.findById(paperId);
  if (!paper) return res.status(404).json({ message: "Paper not found" });

  const comment = paper.comments.id(commentId);
  if (!comment) return res.status(404).json({ message: "Comment not found" });

  comment.text = text;
  await paper.save();

  res.json(comment);
};
