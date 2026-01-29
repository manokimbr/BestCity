const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

let notesStore = [];
let nextId = 1;

// @route    POST api/notes
// @desc     Create a new note
// @access   Public
router.post(
  '/',
  [
    check('title', 'Title is required').notEmpty(),
    check('content', 'Content is required').notEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content } = req.body;

    try {
      const newNote = {
        id: nextId++,
        title,
        content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      notesStore.push(newNote);

      res.status(201).json({
        success: true,
        message: 'Note created successfully',
        data: newNote
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

// @route    GET api/notes
// @desc     Retrieve all notes
// @access   Public
router.get('/', async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      count: notesStore.length,
      data: notesStore
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route    GET api/notes/:id
// @desc     Retrieve a specific note by ID
// @access   Public
router.get('/:id', async (req, res) => {
  try {
    const noteId = parseInt(req.params.id);
    const note = notesStore.find(n => n.id === noteId);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: `Note with ID ${noteId} not found`
      });
    }

    res.status(200).json({
      success: true,
      data: note
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route    PUT api/notes/:id
// @desc     Update an existing note
// @access   Public
router.put(
  '/:id',
  [
    check('title', 'Title cannot be empty if provided').optional().notEmpty(),
    check('content', 'Content cannot be empty if provided').optional().notEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const noteId = parseInt(req.params.id);
      const noteIndex = notesStore.findIndex(n => n.id === noteId);

      if (noteIndex === -1) {
        return res.status(404).json({
          success: false,
          message: `Note with ID ${noteId} not found`
        });
      }

      const { title, content } = req.body;

      if (title !== undefined) {
        notesStore[noteIndex].title = title;
      }
      if (content !== undefined) {
        notesStore[noteIndex].content = content;
      }

      notesStore[noteIndex].updatedAt = new Date().toISOString();

      res.status(200).json({
        success: true,
        message: 'Note updated successfully',
        data: notesStore[noteIndex]
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

// @route    DELETE api/notes/:id
// @desc     Delete a note
// @access   Public
router.delete('/:id', async (req, res) => {
  try {
    const noteId = parseInt(req.params.id);
    const noteIndex = notesStore.findIndex(n => n.id === noteId);

    if (noteIndex === -1) {
      return res.status(404).json({
        success: false,
        message: `Note with ID ${noteId} not found`
      });
    }

    const deletedNote = notesStore.splice(noteIndex, 1)[0];

    res.status(200).json({
      success: true,
      message: 'Note deleted successfully',
      data: deletedNote
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
