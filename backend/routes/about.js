const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sanitizeHtml = require('sanitize-html');
const AboutUs = require('../models/AboutUs');
const protect = require('../middleware/auth');

// Setup multer for team & general about images
const storage = multer.diskStorage({
  destination(req, file, cb) {
    const dir = path.join(__dirname, '../../assets/uploads/about');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename(req, file, cb) {
    cb(null, `about-${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });

// Helper to ensure singleton exists
async function getSingleton() {
  let doc = await AboutUs.findOne();
  if (!doc) {
    doc = await AboutUs.create({});
  }
  return doc;
}

// GET about
router.get('/', async (req, res) => {
  try {
    const doc = await getSingleton();
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT update about details
router.put('/', protect, async (req, res) => {
  try {
    const doc = await getSingleton();
    
    // Sanitize rich text description
    if (req.body.description) {
      req.body.description = sanitizeHtml(req.body.description, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat([ 'img' ])
      });
    }

    // Merge straightforward fields
    const fields = ['companyName', 'tagline', 'description', 'mission', 'vision', 'contactInfo', 'socialLinks', 'stats'];
    fields.forEach(f => {
      if (req.body[f] !== undefined) doc[f] = req.body[f];
    });

    await doc.save();
    res.json(doc);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Update failed' });
  }
});

// POST append team member with photo
router.post('/team', protect, upload.single('image'), async (req, res) => {
  try {
    const doc = await getSingleton();
    const { name, designation, bio } = req.body;
    let imageUrl = '';
    if (req.file) {
      imageUrl = `assets/uploads/about/${req.file.filename}`;
    }
    
    doc.teamMembers.push({ name, designation, bio, image: imageUrl });
    await doc.save();
    res.json(doc.teamMembers);
  } catch (err) {
    res.status(400).json({ error: 'Failed to add team member' });
  }
});

// DELETE team member
router.delete('/team/:memberId', protect, async (req, res) => {
  try {
    const doc = await getSingleton();
    doc.teamMembers = doc.teamMembers.filter(m => m._id.toString() !== req.params.memberId);
    await doc.save();
    res.json(doc.teamMembers);
  } catch (err) {
    res.status(400).json({ error: 'Failed to remove team member' });
  }
});

// POST append general image gallery
router.post('/images', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No image provided' });
    const doc = await getSingleton();
    const imageUrl = `assets/uploads/about/${req.file.filename}`;
    doc.images.push(imageUrl);
    await doc.save();
    res.json(doc.images);
  } catch (err) {
    res.status(400).json({ error: 'Failed to upload image' });
  }
});

// DELETE general image
router.delete('/images', protect, async (req, res) => {
  try {
    const doc = await getSingleton();
    doc.images = doc.images.filter(img => img !== req.body.imageUrl);
    await doc.save();
    res.json(doc.images);
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete image' });
  }
});

module.exports = router;
