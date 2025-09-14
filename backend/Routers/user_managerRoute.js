const express = require("express");
const router = express.Router();
const userManagerController = require("../Controllers/user_managerController");

// Routes for user manager operations
router.post("/", userManagerController.createUserManager);
router.get("/", userManagerController.getAllUserManagers);
router.get("/:id", userManagerController.getUserManagerById);
router.get("/email/:email", userManagerController.getUserManagerByEmail);
router.put("/:id", userManagerController.updateUserManager);
router.delete("/:id", userManagerController.deleteUserManager);
router.post("/login", userManagerController.loginUserManager);

module.exports = router;
