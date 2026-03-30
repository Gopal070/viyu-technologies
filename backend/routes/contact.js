const express = require('express');
const nodemailer = require('nodemailer');
const Contact = require('../models/Contact');
const auth = require('../middleware/auth');

const router = express.Router();

// ── Transporter Configuration ──
// Use environment variables for SMTP settings
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * POST /api/contact
 * Public – submit a contact / enquiry form
 */
router.post('/', async (req, res) => {
  try {
    const { name, mobile, email, city, service, message } = req.body;

    if (!name || !mobile || !message) {
      return res.status(400).json({ error: 'Name, mobile and message are required.' });
    }

    const contact = new Contact({
      name,
      mobile,
      email: email || '',
      city: city || '',
      service: service || '',
      message
    });

    await contact.save();

    // ── Send Email Notification (Async) ──
    if (process.env.EMAIL_ENABLED === 'true' && process.env.SMTP_USER && process.env.SMTP_PASS) {
      const mailOptions = {
        from: `"VIYU Web Alert" <${process.env.SMTP_USER}>`,
        to: process.env.ADMIN_EMAIL || 'info@viyutech.in',
        subject: `New Enquiry from ${name}`,
        text: `You have received a new enquiry:\n\nName: ${name}\nMobile: ${mobile}\nEmail: ${email || 'N/A'}\nCity: ${city || 'N/A'}\nService: ${service || 'General'}\nMessage: ${message}`,
        html: `
          <h3>New Enquiry Received</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Mobile:</strong> ${mobile}</p>
          <p><strong>Email:</strong> ${email || 'N/A'}</p>
          <p><strong>City:</strong> ${city || 'N/A'}</p>
          <p><strong>Service:</strong> ${service || 'General'}</p>
          <p><strong>Message:</strong> ${message}</p>
        `,
      };

      transporter.sendMail(mailOptions).catch(err => {
        console.error('Email sending failed:', err.message);
      });
    }

    res.status(201).json({ message: 'Enquiry submitted successfully! We will contact you soon.' });
  } catch (err) {
    console.error('Contact submit error:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Server error.' });
  }
});

/**
 * GET /api/contact
 * Protected – list all contact submissions (newest first)
 */
router.get('/', auth, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    console.error('Get contacts error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

/**
 * PATCH /api/contact/:id/read
 * Protected – mark a submission as read
 */
router.patch('/:id/read', auth, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!contact) return res.status(404).json({ error: 'Contact not found.' });
    res.json(contact);
  } catch (err) {
    console.error('Mark read error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

/**
 * DELETE /api/contact/:id
 * Protected – delete a submission
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ error: 'Contact not found.' });
    res.json({ message: 'Contact deleted.' });
  } catch (err) {
    console.error('Delete contact error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
