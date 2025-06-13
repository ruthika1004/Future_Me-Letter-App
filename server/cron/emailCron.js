// cron/emailCron.js
const cron = require('node-cron');
const Letter = require('../models/Letter');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

// ✅ Setup Gmail transporter using App Password
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// ✅ Verify transporter
transporter.verify((error, success) => {
  if (error) {
    console.log('❌ Email transporter failed:', error.message);
  } else {
    console.log('✅ Email transporter is ready');
  }
});

// ⏰ Cron job - runs every minute
cron.schedule('* * * * *', async () => {
  console.log('📬 Checking for letters to send...');
  const now = new Date();
  console.log('🕒 Server UTC time:', now.toISOString());

  try {
    const lettersToSend = await Letter.find({
      deliveryDate: { $lte: now },
      sent: false
    }).populate('user', 'email');

    for (let letter of lettersToSend) {
      if (!letter.user?.email || !letter.letterContent) continue;

      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: letter.user.email,
          subject: "📨 A letter from your past self!",
          text: letter.letterContent
        });

        console.log(`✅ Letter sent to: ${letter.user.email}`);

        letter.sent = true;
        await letter.save();
      } catch (error) {
        console.error(`❌ Failed to send email to ${letter.user.email}:`, error.message);
      }
    }
  } catch (err) {
    console.error('❌ Error during cron job:', err.message);
  }
});
