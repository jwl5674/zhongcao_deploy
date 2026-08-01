const mongoose = require('mongoose');

const MerchantSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  shopName: { type: String, default: '' },
  shopLogo: { type: String, default: '' },
  shopType: { type: String, default: '' },
  category: { type: String, default: '' },
  tags: { type: [String], default: [] },
  avgPrice: { type: Number, default: 0 },
  dianpingShopId: { type: String, default: '' },
  videoUrl: { type: String, default: '' },
  mediaList: { type: Array, default: [] },
  status: { type: String, enum: ['active', 'disabled'], default: 'active' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Merchant', MerchantSchema);