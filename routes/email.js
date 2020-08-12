const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

const User = require('../models/User');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'notekeeperapi@gmail.com',
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

router.post('/requestmessage', async (req, res) => {
  try {
    const user = await User.findById(req.query.k);
    // Developing Return Values
    let newMessageArr = JSON.stringify(req.body.messageRequest)
      .replace(/\\n/gi, '<br />')
      .trim()
      .split('');
    newMessageArr.pop();
    newMessageArr.shift();
    let newMessageRequest = newMessageArr.join('');
    // Mail Options
    const mailOptions = {
      from: 'Articlez Request',
      to: 'dylancaldwell35@gmail.com',
      subject: 'New Articlez Request',
      html: `
        New request from <b>${user.username}</b> Email <b>${user.email}</b>
        <hr />
        ${newMessageRequest}
        `,
    };
    transporter.sendMail(mailOptions, (err, data) => {
      if (err) return console.error(err);
    });
    res.json({
      success: true,
    });
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
