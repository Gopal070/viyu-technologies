const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Media = require('../models/Media');
const auth = require('../middleware/auth');

// Setup multer for media uploads (saving to parent dir /assets/uploads/media)
const uploadDir = path.join(__dirname, '../../assets/uploads/media');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'media-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit to allow small video uploads
});

// GET /api/media (Public)
// Fetch all published media. Accepts query params ?type=photo, ?category=xyz, etc.
router.get('/', async (req, res) => {
  try {
    const filter = { isPublished: true };
    if (req.query.type) filter.type = req.query.type;
    if (req.query.category) filter.category = req.query.category;
    if (req.query.siteLocation) filter.siteLocation = req.query.siteLocation;
    
    // Sort by order descending (or ascending based on client preference, usually 0 is highest or lowest)
    // Let's use ascending so items can be dragged into 0, 1, 2...
    const media = await Media.find(filter).sort({ order: 1, createdAt: -1 });
    res.json(media);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/media/all (Protected - for Admin)
// Fetch ALL media including unpublished ones
router.get('/all', auth, async (req, res) => {
  try {
    const media = await Media.find().sort({ order: 1, createdAt: -1 });
    res.json(media);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/media/:id (Public)
router.get('/:id', async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media || !media.isPublished) return res.status(404).json({ message: 'Media not found' });
    res.json(media);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/media (Protected)
// Upload single file in 'file' field and/or accept 'url' in body (for youtube embeds)
router.post('/', auth, upload.single('file'), async (req, res) => {
  try {
    let mediaUrl = req.body.url;
    
    // If a file was uploaded, generate the relative path to be served
    if (req.file) {
      mediaUrl = 'assets/uploads/media/' + req.file.filename;
    }

    if (!mediaUrl) {
      return res.status(400).json({ message: 'Media URL or file upload is required' });
    }

    // Determine highest current order value to append to the end
    const lastMedia = await Media.findOne().sort('-order');
    const newOrder = lastMedia ? lastMedia.order + 1 : 0;

    const newMedia = new Media({
      title: req.body.title,
      description: req.body.description || '',
      type: req.body.type,
      url: mediaUrl,
      thumbnail: req.body.thumbnail || '',
      category: req.body.category || 'General',
      siteLocation: req.body.siteLocation || '',
      isPublished: req.body.isPublished !== 'false',
      order: newOrder
    });

    const savedMedia = await newMedia.save();
    res.status(201).json(savedMedia);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create media', error: err.message });
  }
});

// PUT /api/media/:id (Protected)
router.put('/:id', auth, upload.single('file'), async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    if (req.file) {
      updateData.url = 'assets/uploads/media/' + req.file.filename;
    }

    const updatedMedia = await Media.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );

    if (!updatedMedia) return res.status(404).json({ message: 'Media not found' });
    res.json(updatedMedia);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update media', error: err.message });
  }
});

// DELETE /api/media/:id (Protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const deletedMedia = await Media.findByIdAndDelete(req.params.id);
    if (!deletedMedia) return res.status(404).json({ message: 'Media not found' });
    res.json({ message: 'Media deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /api/media/reorder (Protected)
// Expects body: { "orderMap": [{ id: "mongo-id", order: 0 }, { id: "mongo-id2", order: 1 }] }
router.patch('/reorder', auth, async (req, res) => {
  try {
    const { orderMap } = req.body;
    if (!orderMap || !Array.isArray(orderMap)) {
      return res.status(400).json({ message: 'orderMap array is required' });
    }

    // Use bulkWrite for efficient updates
    const bulkOps = orderMap.map(item => ({
      updateOne: {
        filter: { _id: item.id },
        update: { $set: { order: item.order } }
      }
    }));

    await Media.bulkWrite(bulkOps);
    res.json({ message: 'Media reordered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to reorder', error: err.message });
  }
});

module.exports = router;
