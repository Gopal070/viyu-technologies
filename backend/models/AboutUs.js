const mongoose = require('mongoose');

const aboutUsSchema = new mongoose.Schema({
  companyName: { type: String, default: 'VIYU TECHNOLOGIES LLP' },
  tagline: { type: String, default: '' },
  description: { type: String, default: '' },
  mission: { type: String, default: '' },
  vision: { type: String, default: '' },
  teamMembers: [{
    name: String,
    designation: String,
    image: String,
    bio: String
  }],
  contactInfo: {
    phone: String,
    email: String,
    address: String,
    whatsappNumber: String
  },
  socialLinks: {
    facebook: String,
    twitter: String,
    linkedin: String,
    instagram: String
  },
  stats: [{
    label: String,
    value: String
  }],
  images: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('AboutUs', aboutUsSchema);
