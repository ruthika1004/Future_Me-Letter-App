// controllers/letterController.js

const Letter = require('../models/Letter');

// Save a letter
const saveLetter = async (req, res) => {
  try {
    const { letterContent, deliveryDate } = req.body;

    // Save with user ID and user's email (from auth middleware)
    const newLetter = new Letter({
      user: req.user,
      email: req.userEmail, // make sure email is included in JWT token
      letterContent,
      deliveryDate
    });

    await newLetter.save();

    res.status(201).json({ msg: 'Letter saved successfully', letter: newLetter });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all letters for logged-in user
const getLetters = async (req, res) => {
  try {
    const letters = await Letter.find({ user: req.user }).sort({ createdAt: -1 });
    res.json(letters);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { saveLetter, getLetters };
