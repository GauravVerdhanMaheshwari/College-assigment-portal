const express = require("express");
const multer = require("multer");
const paperController = require("../Controllers/paperController");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", upload.single("file"), paperController.uploadPaperFile);
router.get("/:id/download", paperController.downloadPaperFile);

router.get("/", paperController.getAllPapers);
router.get("/:id", paperController.getPaperById);
router.put("/:id", upload.single("file"), paperController.updatePaperById);
router.delete("/:id", paperController.deletePaperById);

module.exports = router;
