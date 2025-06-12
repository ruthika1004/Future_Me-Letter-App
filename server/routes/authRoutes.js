const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// Define routes:
router.post('/register', register);   // POST /api/auth/register → calls register()
router.post('/login', login);         // POST /api/auth/login → calls login()

module.exports = router;

// Summary:
//  When you hit:

// /api/auth/register → it will call register function.

// /api/auth/login → it will call login function.