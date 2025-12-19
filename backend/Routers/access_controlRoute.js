const express = require("express");
const router = express.Router();
const accessControlController = require("../Controllers/access_controlController");

router.post("/grant", accessControlController.grantAccess);
router.post("/revoke", accessControlController.revokeAccess);
router.get("/check/:paperId/:userId", accessControlController.checkAccess);
router.get("/accessible/:userId", accessControlController.getAccessiblePapers);

module.exports = router;
