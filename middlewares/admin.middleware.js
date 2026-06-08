const adminMiddleware = (req, res, next) => {
  try {
    const { role } = req.userInfo;
    if (role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admins only.",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error occurred while validating admin access.",
    });
  }
};

module.exports = adminMiddleware;
