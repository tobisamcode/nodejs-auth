const express = require("express");

const adminMiddleware = require("../middlewares/admin.middleware");

const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/", authMiddleware, adminMiddleware, (req, res) => {
  res.status(200).json({
    message: "Welcome to the Admin Dashboard",
  });
});

module.exports = router;
