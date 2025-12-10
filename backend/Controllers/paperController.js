const Paper = require("../Models/paper");

// Create a new paper
const fs = require("fs");
const { getGfs } = require("./../config/gridfs");

exports.uploadPaperFile = async (req, res) => {
  try {
    const gfs = getGfs();

    const writeStream = gfs.createWriteStream({
      filename: req.file.originalname,
      content_type: req.file.mimetype,
    });

    fs.createReadStream(req.file.path).pipe(writeStream);

    writeStream.on("close", async (file) => {
      // Create the paper with file reference
      const paper = new Paper({
        ...req.body,
        fileId: file._id,
      });

      await paper.save();

      res.status(201).json({
        message: "File uploaded and paper created",
        paper,
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

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
    const paper = await Paper.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!paper) {
      return res.status(404).json({ message: "Paper not found" });
    }
    res.status(200).json(paper);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a paper by ID
exports.deletePaperById = async (req, res) => {
  try {
    const paper = await Paper.findByIdAndDelete(req.params.id);
    if (!paper) {
      return res.status(404).json({ message: "Paper not found" });
    }
    res.status(200).json({ message: "Paper deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search papers by student ID
exports.getPapersByStudentId = async (req, res) => {
  try {
    const papers = await Paper.find({ studentId: req.params.studentId });
    res.status(200).json(papers);
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
