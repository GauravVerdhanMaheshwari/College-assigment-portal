const express = require("express");
const multer = require("multer");
const paperController = require("../Controllers/paperController");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("file"), paperController.uploadPaperFile);

router.get("/", paperController.getAllPapers);
router.get("/:id", paperController.getPaperById);
router.put("/:id", paperController.updatePaperById);
router.delete("/:id", paperController.deletePaperById);

module.exports = router;
