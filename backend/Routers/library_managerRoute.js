const express = require("express");
const router = express.Router();
const libraryManagerController = require("../Controllers/library_managerController");

// Routes for library manager operations
router.post("/", libraryManagerController.createLibraryManager);
router.get("/", libraryManagerController.getAllLibraryManagers);
router.get("/:id", libraryManagerController.getLibraryManagerById);
router.get("/email/:email", libraryManagerController.getLibraryManagerByEmail);
router.put("/:id", libraryManagerController.updateLibraryManagerById);
router.delete("/:id", libraryManagerController.deleteLibraryManagerById);
router.delete(
  "/email/:email",
  libraryManagerController.deleteLibraryManagerByEmail
);
router.post("/login", libraryManagerController.checkLoginCredentials);

module.exports = router;
