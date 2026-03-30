const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Service = require('../models/Service');
const protect = require('../middleware/auth');

// Setup multer for service images
const storage = multer.diskStorage({
  destination(req, file, cb) {
    const dir = path.join(__dirname, '../../assets/uploads/services');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename(req, file, cb) {
    cb(null, `service-${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });

// GET all published services (or all if admin)
router.get('/', async (req, res) => {
  try {
    const filter = req.query.all === 'true' ? {} : { isPublished: true };
    const services = await Service.find(filter).sort({ order: 1, createdAt: -1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching services' });
  }
});

// GET single service
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ error: 'Not found' });
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST new service
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    const { title, description, icon, isPublished } = req.body;
    let imageUrl = '';
    if (req.file) {
      imageUrl = `assets/uploads/services/${req.file.filename}`;
    }

    const count = await Service.countDocuments();
    const service = await Service.create({
      title,
      description,
      icon,
      image: imageUrl,
      isPublished: isPublished === 'true' || isPublished === true,
      order: count
    });
    res.status(201).json(service);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Error creating service' });
  }
});

// PUT update service
router.put('/:id', protect, upload.single('image'), async (req, res) => {
  try {
    const { title, description, icon, isPublished } = req.body;
    const updateData = { title, description, icon };
    
    if (isPublished !== undefined) {
      updateData.isPublished = isPublished === 'true' || isPublished === true;
    }

    if (req.file) {
      updateData.image = `assets/uploads/services/${req.file.filename}`;
    }

    const service = await Service.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(service);
  } catch (error) {
    res.status(400).json({ error: 'Error updating service' });
  }
});

// PATCH reorder
router.patch('/reorder', protect, async (req, res) => {
  try {
    const { orderedIds } = req.body;
    if (!orderedIds || !Array.isArray(orderedIds)) {
      return res.status(400).json({ error: 'Invalid data format' });
    }
    const bulkOps = orderedIds.map((id, index) => ({
      updateOne: { filter: { _id: id }, update: { order: index } }
    }));
    await Service.bulkWrite(bulkOps);
    res.json({ message: 'Services reordered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error reordering' });
  }
});

// DELETE
router.delete('/:id', protect, async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: 'Service deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting' });
  }
});

module.exports = router;
