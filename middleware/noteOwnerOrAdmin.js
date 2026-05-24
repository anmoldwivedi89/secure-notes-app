const Note = require("../models/Note");
const AppError = require("../utils/AppError");

const noteOwnerOrAdmin = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return next(new AppError("Note not found", 404));
    }

    const isOwner = note.createdBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return next(new AppError("Not authorized to modify this note", 403));
    }

    req.note = note;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = noteOwnerOrAdmin;
