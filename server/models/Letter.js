const mongoose = require('mongoose');

const letterSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  email: { type: String },
  letterContent: { type: String, required: true },
  deliveryDate: { type: Date, required: true },
  sent: { type: Boolean, default: false }
}, { timestamps: true });

// Prevent OverwriteModelError
module.exports = mongoose.models.Letter || mongoose.model('Letter', letterSchema);




//  Explanation:
// email: Who is the letter for.
// letterContent: What’s inside the letter.
// deliveryDate: When the letter should be sent.
// sent: A boolean to track if the letter was already sent (for cron job later).
// timestamps: Automatically stores createdAt and updatedAt
