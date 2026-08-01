const mongoose = require('mongoose');

const TemplateSchema = new mongoose.Schema({
  shopType: { type: String, required: true },
  category: { type: String, required: true },
  rating: { type: String, enum: ['好评', '中评', '差评'], required: true },
  text: { type: String, required: true },
  tips: { type: String, default: '' },
  sortOrder: { type: Number, default: 0 },
  videoUrl: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Template', TemplateSchema);