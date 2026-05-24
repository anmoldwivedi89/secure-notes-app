const { body, param } = require("express-validator");

const createNoteValidation = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("content").trim().notEmpty().withMessage("Content is required"),
];

const updateNoteValidation = [
  param("id").isMongoId().withMessage("Invalid note ID"),
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty"),
  body("content")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Content cannot be empty"),
  body().custom((_, { req }) => {
    if (!req.body.title && !req.body.content) {
      throw new Error("Please provide title or content to update");
    }
    return true;
  }),
];

const noteIdValidation = [
  param("id").isMongoId().withMessage("Invalid note ID"),
];

module.exports = { createNoteValidation, updateNoteValidation, noteIdValidation };
