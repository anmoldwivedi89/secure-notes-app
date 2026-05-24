const AppError = require("../utils/AppError");

const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }

  next(new AppError("Not authorized, admin access required", 403));
};

module.exports = admin;
