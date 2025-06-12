// cron/emailCron.js
const cron = require('node-cron');
const Letter = require('../models/Letter');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

// ✅ Setup Gmail transporter using App Password (not Gmail password)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// ✅ Check if transporter is ready
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
    // ✅ Get letters that are due and not yet sent
    const lettersToSend = await Letter.find({
      deliveryDate: { $lte: now },
      sent: false
    });

    for (let letter of lettersToSend) {
      if (!letter.email || !letter.letterContent) continue;

      try {
        // ✅ Send the email
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: letter.email,
          subject: "📨 A letter from your past self!",
          text: letter.letterContent
        });

        console.log(`✅ Letter sent to: ${letter.email}`);

        // ✅ Mark the letter as sent
        letter.sent = true;
        await letter.save();
      } catch (error) {
        console.error(`❌ Failed to send email to ${letter.email}:`, error.message);
      }
    }
  } catch (err) {
    console.error('❌ Error during cron job:', err.message);
  }
});
