  const User = require('../models/user');
  const bcrypt = require('bcryptjs');
  const jwt = require('jsonwebtoken');

  const register = async (req, res) => {
    try {
      const { name, email, password } = req.body;  // Get user input from frontend (Postman for now)

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ msg: 'User already exists' });

      // Hash the password (important for security)
      const hashedPassword = await bcrypt.hash(password, 10);  // 10 is salt rounds

      // Create new user with hashed password
      const newUser = new User({ name, email, password: hashedPassword });
      await newUser.save();

      // Respond success
      res.status(201).json({ msg: 'User registered successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  // Summary:
  //  Check if email is already used → if yes, reject.
  //  Else → hash the password → save user to database → respond with success.

  const login = async (req, res) => {
    try {
      const { email, password } = req.body;  // Get email & password from frontend

      // Find user by email
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

      // Compare entered password with hashed password in DB
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

      // If credentials correct → issue JWT token (for future secure requests)
      const token = jwt.sign(
        { id: user._id ,email:user.email}, 
        process.env.JWT_SECRET, 
        { expiresIn: '1d' }
      );

      // Send token + basic user info back to frontend
      res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  // Summary:
  //  Find user by email → if not found → error.
  //  If found → compare password → if incorrect → error.
  //  If correct → generate a JWT token → send it to frontend.
  //  Token helps keep the user logged in securely.

  module.exports = { register, login };
