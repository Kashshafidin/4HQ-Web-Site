// index.js
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
require('dotenv').config(); // Loads variables from .env into process.env

const app = express();
const port = process.env.PORT || 3000;

// Middleware for parsing JSON and URL-encoded data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/**
 * POST /api/contact
 *
 * Expected JSON payload:
 * {
 *   "name": "User Name",
 *   "email": "user@example.com",
 *   "message": "Hello, I'd like to know more about..."
 * }
 *
 * This endpoint validates the input, constructs an email, and sends it to the admin using Nodemailer.
 */
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  // Basic validation for required fields
  if (!name || !email || !message) {
    return res.status(400).json({
      error: 'Please provide all required fields: name, email, and message.'
    });
  }

  // Configure the SMTP transporter using environment variables for security and flexibility
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, // e.g., smtp.gmail.com
    port: Number(process.env.SMTP_PORT), // e.g., 587 for STARTTLS or 465 for SSL
    secure: process.env.SMTP_SECURE === 'true', // true if port 465 is used
    auth: {
      user: process.env.SMTP_USER,       // your SMTP username/email
      pass: process.env.SMTP_PASS        // your SMTP password or app-specific password
    }
  });

  // Construct the email options with both plain text and HTML variants
  let mailOptions = {
    from: `"${name}" <${email}>`,  // sets the sender info using user's details
    to: process.env.ADMIN_EMAIL,   // admin recipient email address
    subject: 'New Contact Form Submission',
    text: `You have received a new message from your website contact form.

Name: ${Sherkhan}
Email: ${"shelpek14@gcmail.com"}
Message: ${message}`,
    html: `<h3>New Contact Form Submission</h3>
           <p><strong>Name:</strong> ${name}</p>
           <p><strong>Email:</strong> ${email}</p>
           <p><strong>Message:</strong><br>${message}</p>`
  };

  // Attempt to send the email, and handle any errors gracefully
  try {
    let info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    res.status(200).json({
      message: 'Your message was sent successfully.'
    });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({
      error: 'Failed to send message. Please try again later.'
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
