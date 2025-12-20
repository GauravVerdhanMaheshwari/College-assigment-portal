const express = require("express");
const router = express.Router();
const accessControlController = require("../Controllers/access_controlController");

router.put("/grant", accessControlController.grantAccess);
router.put("/revoke", accessControlController.revokeAccess);
router.put("/request", accessControlController.requestAccess);
router.get("/check/:paperId/:requestedBy", accessControlController.checkAccess);
router.get("/accessible/:userId", accessControlController.getAccessiblePapers);

// router.get("/requests/:ownerId", accessControlController.getAccessRequests);

module.exports = router;
