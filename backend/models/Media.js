const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['photo', 'video'],
  },
  url: {
    type: String,
    required: true, 
    // For photo: path to image (e.g., 'assets/uploads/media/123.jpg')
    // For video: path to video file OR embed URL (e.g., YouTube)
  },
  thumbnail: {
    type: String,
    // Optional placeholder/thumbnail for videos
  },
  category: {
    type: String,
    trim: true,
  },
  siteLocation: {
    type: String,
    trim: true,
  },
  order: {
    type: Number,
    default: 0,
  },
  isPublished: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Media', mediaSchema);
