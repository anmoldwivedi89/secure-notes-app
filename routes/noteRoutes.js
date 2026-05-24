const express = require("express");
const {
  createNote,
  getMyNotes,
  getNoteById,
  updateNote,
  deleteNote,
} = require("../controllers/noteController");
const protect = require("../middleware/auth");
const noteOwnerOrAdmin = require("../middleware/noteOwnerOrAdmin");
const validate = require("../middleware/validate");
const {
  createNoteValidation,
  updateNoteValidation,
  noteIdValidation,
} = require("../middleware/validators/noteValidators");

const router = express.Router();

router.use(protect);

router.route("/").get(getMyNotes).post(createNoteValidation, validate, createNote);
router
  .route("/:id")
  .get(noteIdValidation, validate, noteOwnerOrAdmin, getNoteById)
  .put(updateNoteValidation, validate, noteOwnerOrAdmin, updateNote)
  .delete(noteIdValidation, validate, noteOwnerOrAdmin, deleteNote);

module.exports = router;

