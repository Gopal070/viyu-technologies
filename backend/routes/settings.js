const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const SiteSettings = require('../models/SiteSettings');
const protect = require('../middleware/auth');

// Setup multer for banner backgrounds
const storage = multer.diskStorage({
  destination(req, file, cb) {
    const dir = path.join(__dirname, '../../assets/uploads/settings');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename(req, file, cb) {
    cb(null, `banner-bg-${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });

async function getSingleton() {
  let doc = await SiteSettings.findOne();
  if (!doc) doc = await SiteSettings.create({});
  return doc;
}

// GET settings
router.get('/', async (req, res) => {
  try {
    const doc = await getSingleton();
    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT update settings
router.put('/', protect, upload.single('bannerBackgroundImage'), async (req, res) => {
  try {
    const doc = await getSingleton();
    
    // Convert string booleans if necessary
    const parseBool = (val) => val === 'true' || val === true;

    if (req.body.whatsappNumber) doc.whatsappNumber = req.body.whatsappNumber;
    if (req.body.whatsappMessage !== undefined) doc.whatsappMessage = req.body.whatsappMessage;
    if (req.body.bannerType) doc.bannerType = req.body.bannerType;
    if (req.body.bannerBackground) doc.bannerBackground = req.body.bannerBackground;
    if (req.body.showGalleryPreview !== undefined) doc.showGalleryPreview = parseBool(req.body.showGalleryPreview);
    if (req.body.galleryPreviewCount !== undefined) doc.galleryPreviewCount = parseInt(req.body.galleryPreviewCount) || 4;
    if (req.body.isActive !== undefined) doc.isActive = parseBool(req.body.isActive);

    if (req.file) {
      doc.bannerBackground = `assets/uploads/settings/${req.file.filename}`;
    }

    await doc.save();
    res.json(doc);
  } catch (err) {
    res.status(400).json({ error: 'Update failed' });
  }
});

module.exports = router;
