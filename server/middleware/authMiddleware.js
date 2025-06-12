// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded.id;         // user ID from token
    req.userEmail = decoded.email; // also attach email if needed

    next();
  } catch (err) {
    return res.status(401).json({ error: 'invalid token' });
  }
};

module.exports = auth;



// This will check if the user is logged in by verifying their JWT.