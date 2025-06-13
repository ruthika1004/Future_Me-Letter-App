const express = require('express');
const router = express.Router();
const { saveLetter, getLetters } = require('../controllers/letterController');
const auth = require('../middleware/authMiddleware');
const Letter = require('../models/Letter');

// ✅ Route to save a letter (requires auth)
router.post('/save', auth, saveLetter);

// ✅ Route to get all letters for logged-in user (used in frontend)
router.get('/my', auth, async (req, res) => {
  try {
    const letters = await Letter.find({ user: req.user.id }).sort({ deliveryDate: 1 });
    res.json(letters);
  } catch (err) {
    console.error('Fetch user letters failed:', err);
    res.status(500).json({ error: 'Server error fetching letters' });
  }
});

// ✅ Optional: Get all letters in DB (for dev/test)
router.get('/all', async (req, res) => {
  try {
    const letters = await Letter.find();
    res.json(letters);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch letters' });
  }
});

module.exports = router;
