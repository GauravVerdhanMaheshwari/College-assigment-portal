const express = require("express");
const router = express.Router();
const adminController = require("../Controllers/adminController");

// Routes for admin operations
router.post("/", adminController.createAdmin);
router.get("/", adminController.getAllAdmins);
router.get("/:id", adminController.getAdminById);
router.put("/:id", adminController.updateAdminById);
router.delete("/:id", adminController.deleteAdminById);
router.post("/login", adminController.adminLogin);

module.exports = router;
