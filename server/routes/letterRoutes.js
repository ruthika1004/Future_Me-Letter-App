// const express = require('express');
// const router = express.Router();
// const { saveLetter } = require('../controllers/letterController');

// // Route to save letter
// router.post('/', saveLetter);

// module.exports = router;

// // Explanation:
// // POST /api/letters will call the saveLetter function you just made.

// // routes/letterRoutes.js
// const express = require('express');
// const router = express.Router();
// const { saveLetter, getLetters } = require('../controllers/letterController');
// const auth = require('../middleware/authMiddleware');

// // Routes
// router.post('/save', auth, saveLetter);     // Save letter
// router.get('/', auth, getLetters);          // Get letters

// module.exports = router;


const express = require('express');
const router = express.Router();
const { saveLetter, getLetters } = require('../controllers/letterController');
const auth = require('../middleware/authMiddleware');
const Letter = require('../models/Letter'); // ✅ Add this

// Routes
router.post('/save', auth, saveLetter);     // Save letter
router.get('/', auth, getLetters);          // Get letters

// Debug route - get all letters (for dev/testing only)
router.get('/all', async (req, res) => {
  try {
    const letters = await Letter.find();
    res.json(letters);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch letters' });
  }
});

module.exports = router;

// http://localhost:5000/api/letters/all

module.exports = router;
