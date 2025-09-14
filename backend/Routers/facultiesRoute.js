const express = require("express");
const router = express.Router();
const facultyController = require("../Controllers/facultiesController");

// Routes for faculty operations
router.post("/", facultyController.createFaculty);
router.get("/", facultyController.getAllFaculties);
router.get("/:id", facultyController.getFacultyById);
router.get("/email/:email", facultyController.getFacultyByEmail);
router.put("/:id", facultyController.updateFacultyById);
router.delete("/:id", facultyController.deleteFacultyById);
router.put("/email/:email", facultyController.updateFacultyByEmail);
router.delete("/email/:email", facultyController.deleteFacultyByEmail);

module.exports = router;
