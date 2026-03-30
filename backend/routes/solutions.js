const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Solution = require('../models/Solution');
const protect = require('../middleware/auth');

// Setup multer for solution images
const storage = multer.diskStorage({
  destination(req, file, cb) {
    const dir = path.join(__dirname, '../../assets/uploads/solutions');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename(req, file, cb) {
    cb(null, `solution-${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });

// GET all
router.get('/', async (req, res) => {
  try {
    const filter = req.query.all === 'true' ? {} : { isPublished: true };
    const solutions = await Solution.find(filter).sort({ order: 1, createdAt: -1 });
    res.json(solutions);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET single
router.get('/:id', async (req, res) => {
  try {
    const solution = await Solution.findById(req.params.id);
    if (!solution) return res.status(404).json({ error: 'Not found' });
    res.json(solution);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST new
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    let { title, description, features, isPublished } = req.body;
    let imageUrl = '';
    
    if (req.file) {
      imageUrl = `assets/uploads/solutions/${req.file.filename}`;
    }

    let parsedFeatures = [];
    if (features) {
      if (typeof features === 'string') {
        try { parsedFeatures = JSON.parse(features); } catch (e) { parsedFeatures = [features]; }
      } else {
        parsedFeatures = features;
      }
    }

    const count = await Solution.countDocuments();
    const sol = await Solution.create({
      title,
      description,
      features: parsedFeatures,
      image: imageUrl,
      isPublished: isPublished === 'true' || isPublished === true,
      order: count
    });
    res.status(201).json(sol);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Error creating solution' });
  }
});

// PUT update
router.put('/:id', protect, upload.single('image'), async (req, res) => {
  try {
    let { title, description, features, isPublished } = req.body;
    const updateData = { title, description };
    
    if (isPublished !== undefined) {
      updateData.isPublished = isPublished === 'true' || isPublished === true;
    }
    
    if (features !== undefined) {
      if (typeof features === 'string') {
        try { updateData.features = JSON.parse(features); } catch(e) { updateData.features = [features]; }
      } else {
        updateData.features = features;
      }
    }

    if (req.file) {
      updateData.image = `assets/uploads/solutions/${req.file.filename}`;
    }

    const sol = await Solution.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(sol);
  } catch (error) {
    res.status(400).json({ error: 'Error updating solution' });
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
    await Solution.bulkWrite(bulkOps);
    res.json({ message: 'Reordered' });
  } catch (error) {
    res.status(500).json({ error: 'Error reordering' });
  }
});

// DELETE
router.delete('/:id', protect, async (req, res) => {
  try {
    await Solution.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting' });
  }
});

module.exports = router;
