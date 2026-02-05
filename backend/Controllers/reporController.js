// Controllers/reportController.js
const Report = require("../Models/reports");

exports.createReport = async (req, res) => {
  try {
    const { description, paperId, reporterId } = req.body;

    if (!description || !paperId || !reporterId) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const report = new Report({
      description,
      paperId,
      reporterId,
    });

    await report.save();

    res.status(201).json({
      message: "Report created successfully",
      report,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create report" });
  }
};

exports.getReportsByPaperAndStudent = async (req, res) => {
  try {
    const { paperId, studentId } = req.params;

    const reports = await Report.find({
      paperId,
      reporterId: studentId,
    })
      .populate("paperId", "title studentName course")
      .populate("reporterId", "name email");

    res.status(200).json(reports);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch reports" });
  }
};

exports.getReportsForPaper = async (req, res) => {
  try {
    const { paperId } = req.params;

    const reports = await Report.find({ paperId })
      .populate("reporterId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(reports);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch reports" });
  }
};

exports.deleteReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    await Report.findByIdAndDelete(reportId);
    res.status(200).json({ message: "Report deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete report" });
  }
};
