const express = require("express");
const { getHealth } = require("../controllers/healthController");
const userRoutes = require("./userRoutes");
const adminRoutes = require("./adminRoutes");
const noteRoutes = require("./noteRoutes");

const router = express.Router();

router.get("/health", getHealth);
router.use("/users", userRoutes);
router.use("/admin", adminRoutes);
router.use("/notes", noteRoutes);

module.exports = router;
