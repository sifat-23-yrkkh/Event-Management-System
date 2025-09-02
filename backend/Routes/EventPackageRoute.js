const express = require("express");
const router = express.Router();
const {
  createEventPackage,
  updateEventPackage,
  getEventPackages,
  getEventPackageById,
  togglePackageStatus,
  getPackageCategories,
  checkBookmarkStatus,
  getDraftEventPackages,
  publishEventPackage,
  getPublishedEventPackages,
  getEventPackageDetails,
  toggleEventBookmark,
  getUserBookmarks,
  deleteEvent,
} = require("../Controller/EventPackageController");

router.get("/categories", getPackageCategories);
router.get("/published", getPublishedEventPackages);
router.get("/details/:id", getEventPackageDetails);
router.get("/events", getEventPackages);
router.get("/:id", getEventPackageById);
router.post("/", createEventPackage);
router.put("/:id", updateEventPackage);
router.patch("/:id/status", togglePackageStatus);
router.patch("/:id/publish", publishEventPackage);
// router.get("/creator/packages", getPackagesByCreator);
router.get("/drafts", getDraftEventPackages);

router.post("/bookmark", toggleEventBookmark);
router.get("/bookmarks/:userEmail", getUserBookmarks);
router.get("/check-bookmark", checkBookmarkStatus);
router.delete("/:id", deleteEvent);

module.exports = router;
