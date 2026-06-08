const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const adminMiddleware = require("../middlewares/admin.middleware");
const uploadMiddleware = require("../middlewares/upload.middleware");
const {
  uploadImage,
  fetchImages,
  deleteImage,
} = require("../controllers/image.controllers");

const router = express.Router();

// upload the Image
router.post(
  "/upload",
  authMiddleware,
  adminMiddleware,
  uploadMiddleware.single("image"),
  uploadImage,
);

router.get("/fetch", authMiddleware, fetchImages);

router.delete("/delete/:id", authMiddleware, adminMiddleware, deleteImage);

module.exports = router;
