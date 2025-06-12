// server.js
// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
const authRoutes = require('./routes/authRoutes');
const letterRoutes = require('./routes/letterRoutes');

app.use('/api/auth', authRoutes);         // Auth routes
app.use('/api/letters', letterRoutes);    // Letter routes (protected)

// Test route
app.get('/', (req, res) => {
  res.send('Future Me Letter App API running 🚀');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Start the cron job
require('./cron/emailCron');
// Now your cron job will start automatically when you run your server
