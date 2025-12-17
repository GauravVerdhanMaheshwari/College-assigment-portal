const express = require("express");
const multer = require("multer");
const paperController = require("../Controllers/paperController");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", upload.single("file"), paperController.uploadPaperFile);

router.get("/:id/downloads", paperController.getDownloadHistory);
router.get("/:id/download", paperController.downloadPaper);

router.get("/student/:studentId", paperController.getPapersByStudentId);
router.get("/faculty", paperController.getFacultyPapers);

router.patch("/:id/toggle-visibility", paperController.toggleVisibility);
router.patch("/:id/grade", paperController.gradePaper);

router.post("/:id/comment", paperController.addComment);
router.patch("/:paperId/comment/:commentId", paperController.updateComment);
router.delete("/:paperId/comment/:commentId", paperController.deleteComment);

router.get("/", paperController.getAllPapers);
router.get("/:id", paperController.getPaperById); // ⚠️ KEEP LAST
router.put("/:id", upload.single("file"), paperController.updatePaperById);
router.delete("/:id", paperController.deletePaperById);

module.exports = router;
