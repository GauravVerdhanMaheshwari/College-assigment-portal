const express = require("express");
const router = express.Router();
const studentController = require("../Controllers/studentController");

// Routes for student operations
router.post("/", studentController.createStudent);
router.get("/", studentController.getAllStudents);
router.get("/:id", studentController.getStudentById);
router.get("/email/:email", studentController.getStudentByEmail);
router.get(
  "/enrollment/:enrollmentNumber",
  studentController.getStudentByEnrollmentNumber
);
router.put("/:id", studentController.updateStudentById);
router.put("/email/:email", studentController.updateStudentByEmail);
router.put(
  "/enrollment/:enrollmentNumber",
  studentController.updateStudentByEnrollmentNumber
);
router.delete("/:id", studentController.deleteStudentById);
router.delete("/email/:email", studentController.deleteStudentByEmail);
router.delete(
  "/enrollment/:enrollmentNumber",
  studentController.deleteStudentByEnrollmentNumber
);

module.exports = router;
