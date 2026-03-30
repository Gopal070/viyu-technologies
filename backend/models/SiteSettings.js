const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema({
  whatsappNumber: { type: String, default: '+917785931010' },
  whatsappMessage: { type: String, default: 'Hi, I would like to know more about your services.' },
  bannerType: {
    type: String,
    enum: ['floatingButton', 'bottomBanner'],
    default: 'floatingButton'
  },
  bannerBackground: { type: String, default: '#25D366' },
  showGalleryPreview: { type: Boolean, default: true },
  galleryPreviewCount: { type: Number, default: 4 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
