const Assignment = require("../Models/assignment");
const express = require("express");
const router = express.Router();

const assignmentController = require("../Controllers/assignmentController");

// Post a new assignment
router.post("/", assignmentController.createAssignment);
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
