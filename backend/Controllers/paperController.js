const Paper = require("../Models/paper");
const { getGridFSBucket } = require("../config/gridfs");
const Assignment = require("../Models/assignment");

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
      .populate("assignmentId", "topic dueDate")
      .populate("comments.facultyId", "name");

    res.json(
      papers.map((p) => ({
        _id: p._id,
        topic: p.assignmentId?.topic || "General Submission",
        title: p.title,
        grade: p.grade,
        isPublic: p.isPublic,
        createdAt: p.createdAt,
        assignmentId: p.assignmentId?._id,
        downloads: p.downloads || [],
        submittedAt: p.submittedAt,
        dueDate: p.assignmentId?.dueDate,
        isLate: p.isLate,
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

    const assignment = await Assignment.findById(req.body.assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    const submittedAt = new Date();
    const isLate = submittedAt > assignment.dueDate;

    if (isLate && !assignment.allowLateSubmission) {
      return res.status(403).json({
        message: "Late submissions are not allowed for this assignment",
      });
    }

    const bucket = getGridFSBucket();
    const uploadStream = bucket.openUploadStream(req.file.originalname, {
      contentType: req.file.mimetype,
    });

    uploadStream.end(req.file.buffer);

    uploadStream.on("finish", async () => {
      const paper = new Paper({
        title: req.body.title,
        studentId: req.body.studentId,
        assignmentId: req.body.assignmentId,
        fileId: uploadStream.id,
        submittedAt,
        isLate,
        comments: isLate
          ? [{ text: "⚠️ Late submission (after deadline)" }]
          : [],
      });

      await paper.save();

      res.status(201).json({ success: true, paper });
    });
  } catch (err) {
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
    const userId = req.query.userId || null;
    const userName = req.query.userId.name || "Unknown User";

    console.log(req.query.userId.name);

    paper.downloads.push({
      userId,
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
  const paper = await Paper.findById(req.params.paperId);

  if (!paper) return res.status(404).json({ message: "Paper not found" });

  res.json(
    paper.downloads.map((d) => ({
      userId: d.userId,
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
      .populate("assignmentId", "topic dueDate ");

    res.json(
      papers.map((p) => ({
        _id: p._id,
        title: p.title,
        assignmentTopic: p.assignmentId?.topic || "General Submission",

        isLate: p.isLate,
        submittedAt: p.submittedAt,
        dueDate: p.assignmentId?.dueDate,
        downloads: p.downloads || [],

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

exports.getPublicPapers = async (req, res) => {
  try {
    const papers = await Paper.find({ isPublic: true })
      .populate("studentId", "name enrollmentNumber")
      .populate("assignmentId", "topic subject");
    res.json(
      papers.map((p) => ({
        _id: p._id,
        title: p.title,
        studentName: p.studentId?.name,
        enrollment: p.studentId?.enrollmentNumber,
        submittedAt: p.submittedAt,
        studentId: p.studentId?._id,
        subject: p.assignmentId?.subject || "General",
        topic: p.assignmentId?.topic || "General Submission",
      }))
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserManagerPapers = async (req, res) => {
  try {
    const papers = await Paper.find()
      .populate("studentId", "name enrollmentNumber division course year")
      .populate("assignmentId", "topic dueDate ");
    res.json(
      papers.map((p) => ({
        _id: p._id,
        title: p.title,
        name: p.studentId?.name,
        assignmentId: p.assignmentId?._id,
        class: p.studentId?.division,
        section: p.studentId?.year,
        course: p.studentId?.course,
        assignmentTopic: p.assignmentId?.topic || "General Submission",
        isLate: p.isLate,
        submissionDate: p.submittedAt.toDateString(),
        dueDate: p.assignmentId?.dueDate,
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

exports.downloadPaperForUserManager = async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id);
    if (!paper) {
      return res.status(404).json({ message: "Paper not found" });
    }

    const bucket = getGridFSBucket();

    const files = await bucket.find({ _id: paper.fileId }).toArray();
    if (!files.length) {
      return res.status(404).json({ message: "File not found in GridFS" });
    }

    const file = files[0];

    // log download
    paper.downloads.push({
      userId: req.query.userId || null,
      role: req.query.role || "unknown",
    });
    await paper.save();

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${file.filename}"`
    );
    res.setHeader(
      "Content-Type",
      file.contentType || "application/octet-stream"
    );

    const downloadStream = bucket.openDownloadStream(paper.fileId);
    downloadStream.pipe(res);
  } catch (err) {
    console.error("Download error:", err);
    res.status(500).json({ message: "Download failed" });
  }
};
