const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

const router = express.Router();

// ── Multer config for image uploads ──
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', '..', 'assets', 'images');
    // Ensure directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Unique filename: timestamp-originalname
    const uniqueName = Date.now() + '-' + file.originalname.replace(/\s+/g, '_');
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) cb(null, true);
    else cb(new Error('Only image files (jpg, png, gif, webp) are allowed.'));
  }
});

/**
 * GET /api/products
 * Public – list products, optionally filtered by category
 * Query params: ?category=cctv&limit=10
 */
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) {
      filter.category = req.query.category;
    }
    if (req.query.subcategory) {
      filter.subcategory = req.query.subcategory;
    }

    let query = Product.find(filter).sort({ createdAt: -1 });

    if (req.query.limit) {
      query = query.limit(parseInt(req.query.limit));
    }

    const products = await query;
    res.json(products);
  } catch (err) {
    console.error('Get products error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

/**
 * GET /api/products/:id
 * Public – get single product by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found.' });
    res.json(product);
  } catch (err) {
    console.error('Get product error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

/**
 * POST /api/products
 * Protected – create a new product (with optional image upload)
 */
router.post('/', auth, upload.single('imageFile'), async (req, res) => {
  try {
    const { name, category, subcategory, description, price, image, features, tags, enquiryLabel } = req.body;

    const productData = {
      name,
      category,
      subcategory: subcategory || '',
      description,
      price: price || 'Contact for price',
      image: image || '',
      features: features ? (typeof features === 'string' ? JSON.parse(features) : features) : [],
      tags: tags || '',
      enquiryLabel: enquiryLabel || 'Enquire Now'
    };

    // If an image file was uploaded, set image path
    if (req.file) {
      productData.image = 'assets/images/' + req.file.filename;
    }

    const product = new Product(productData);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error('Create product error:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Server error.' });
  }
});

/**
 * PUT /api/products/:id
 * Protected – update a product
 */
router.put('/:id', auth, upload.single('imageFile'), async (req, res) => {
  try {
    const updates = { ...req.body };

    // Parse features if it's a JSON string
    if (updates.features && typeof updates.features === 'string') {
      try { updates.features = JSON.parse(updates.features); } catch (e) { /* leave as-is */ }
    }

    // If new image uploaded, update path
    if (req.file) {
      updates.image = 'assets/images/' + req.file.filename;
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!product) return res.status(404).json({ error: 'Product not found.' });
    res.json(product);
  } catch (err) {
    console.error('Update product error:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Server error.' });
  }
});

/**
 * DELETE /api/products/:id
 * Protected – delete a product
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found.' });
    res.json({ message: 'Product deleted successfully.' });
  } catch (err) {
    console.error('Delete product error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router;
