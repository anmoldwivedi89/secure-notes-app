const express = require("express");
const {
  registerUser,
  loginUser,
  getProfile,
} = require("../controllers/userController");
const protect = require("../middleware/auth");
const validate = require("../middleware/validate");
const {
  registerValidation,
  loginValidation,
} = require("../middleware/validators/userValidators");

const router = express.Router();

router.post("/register", registerValidation, validate, registerUser);
router.post("/login", loginValidation, validate, loginUser);
router.get("/profile", protect, getProfile);

module.exports = router;
