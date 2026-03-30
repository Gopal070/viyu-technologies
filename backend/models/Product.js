const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'cctv', 'fire', 'biometric', 'pa', 'gps', 'it',
      'boom-tyre', 'bollards-gate', 'signal-network',
      'intercom-epabx', 'smart-digital'
    ]
  },
  subcategory: {
    type: String,
    trim: true,
    default: ''
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  price: {
    type: String,  // String to support "Contact for price", "₹12,000" etc.
    default: 'Contact for price'
  },
  image: {
    type: String,  // path relative to site root, e.g. "assets/images/photo.jpg"
    default: ''
  },
  features: {
    type: [String],
    default: []
  },
  tags: {
    type: String,   // comma-separated tag line like "2 MP · IP · PoE"
    default: ''
  },
  enquiryLabel: {
    type: String,
    default: 'Enquire Now'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for fast category queries
productSchema.index({ category: 1 });

module.exports = mongoose.model('Product', productSchema);
