const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const paperController = require("../Controllers/paperController");

// Create a new paper
router.post("/upload", upload.single("file"), paperController.uploadPaperFile);
// Get all papers
router.get("/", paperController.getAllPapers);
// Get a paper by ID
router.get("/:id", paperController.getPaperById);
// Update a paper by ID
router.put("/:id", paperController.updatePaperById);
// Delete a paper by ID
router.delete("/:id", paperController.deletePaperById);

module.exports = router;
