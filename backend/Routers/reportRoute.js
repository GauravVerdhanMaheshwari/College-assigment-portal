// Routes/reportRoutes.js
const express = require("express");
const router = express.Router();
const reportController = require("../Controllers/reporController");

// Create report
router.post("/create", reportController.createReport);

// Get all reports for a paper
router.get("/paper/:paperId", reportController.getReportsForPaper);

// 🔥 Get reports by BOTH paper + student
router.get(
  "/paper/:paperId/student/:studentId",
  reportController.getReportsByPaperAndStudent,
);

// Delete report
router.delete("/:reportId", reportController.deleteReport);

module.exports = router;
