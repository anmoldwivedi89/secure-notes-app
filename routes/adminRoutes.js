const express = require("express");
const { getAllUsers } = require("../controllers/adminController");
const protect = require("../middleware/auth");
const admin = require("../middleware/admin");

const router = express.Router();

router.use(protect, admin);

router.get("/users", getAllUsers);

module.exports = router;
