const Note = require("../models/Note");
const AppError = require("../utils/AppError");

const createNote = async (req, res, next) => {
  try {
    const { title, content } = req.body;

    const note = await Note.create({
      title,
      content,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Note created successfully",
      data: note,
    });
  } catch (error) {
    next(error);
  }
};

const getMyNotes = async (req, res, next) => {
  try {
    const notes = await Note.find({ createdBy: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: notes.length,
      data: notes,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/notes/:id – returns a single note (owner or admin only)
const getNoteById = (req, res) => {
  // req.note is already populated by noteOwnerOrAdmin middleware
  res.status(200).json({
    success: true,
    data: req.note,
  });
};

const updateNote = async (req, res, next) => {
  try {
    const { title, content } = req.body;

    if (title) req.note.title = title;
    if (content) req.note.content = content;

    const updatedNote = await req.note.save();

    res.status(200).json({
      success: true,
      message: "Note updated successfully",
      data: updatedNote,
    });
  } catch (error) {
    next(error);
  }
};

const deleteNote = async (req, res, next) => {
  try {
    await req.note.deleteOne();

    res.status(200).json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createNote, getMyNotes, getNoteById, updateNote, deleteNote };

