const Assignment = require("../Models/assignment");
const express = require("express");
const multer = require("multer");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const assignmentController = require("../Controllers/assignmentController");

// Post a new assignment
router.post("/", assignmentController.createAssignment);

router.post(
  "/upload",
  upload.single("file"),
  assignmentController.uploadAssignmentFile,
);
router.get("/file/:fileId", assignmentController.downloadAssignmentFile);
router.put(
  "/:id/file",
  upload.single("file"),
  assignmentController.updateAssignmentFile,
);
// Get all assignments
router.get("/", assignmentController.getAllAssignments);
// Get assignment by ID
router.get("/:id", assignmentController.getAssignmentById);
// Update assignment by ID
router.put("/:id", assignmentController.updateAssignment);
// Delete assignment by ID
router.delete("/:id", assignmentController.deleteAssignment);
router.patch("/:id/toggle-late", assignmentController.toggleLateSubmission);

module.exports = router;
