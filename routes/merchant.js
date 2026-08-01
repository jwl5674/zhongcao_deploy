const express = require('express');
const router = express.Router();
const Merchant = require('../models/Merchant');
const Template = require('../models/Template');
const auth = require('../middleware/auth');

// 获取商家公开信息（前台用）
router.get('/:id', async (req, res) => {
  try {
    const merchant = await Merchant.findById(req.params.id).select('-password -__v');
    if (!merchant) {
      return res.status(404).json({ success: false, message: '商家不存在' });
    }
    if (merchant.status === 'disabled') {
      return res.status(403).json({ success: false, message: '该商家已停用' });
    }
    res.json({ success: true, data: merchant });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: '商家不存在' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

// 获取推荐文案
router.get('/:id/recommend', async (req, res) => {
  try {
    const merchant = await Merchant.findById(req.params.id);
    if (!merchant) {
      return res.status(404).json({ success: false, message: '商家不存在' });
    }
    const template = await Template.findOne({
      shopType: merchant.shopType,
      category: merchant.category
    }).sort({ sortOrder: 1 });
    res.json({ success: true, data: template });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 获取当前登录商家信息
router.get('/profile/me', auth, async (req, res) => {
  try {
    const merchant = await Merchant.findById(req.merchant.id).select('-password -__v');
    if (!merchant) {
      return res.status(404).json({ success: false, message: '商家不存在' });
    }
    res.json({ success: true, data: merchant });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 更新商家配置
router.put('/profile/me', auth, async (req, res) => {
  try {
    const { shopName, shopLogo, shopType, category, tags, avgPrice, dianpingShopId, videoUrl, mediaList } = req.body;
    const merchant = await Merchant.findById(req.merchant.id);
    if (!merchant) {
      return res.status(404).json({ success: false, message: '商家不存在' });
    }
    if (shopName !== undefined) merchant.shopName = shopName;
    if (shopLogo !== undefined) merchant.shopLogo = shopLogo;
    if (shopType !== undefined) merchant.shopType = shopType;
    if (category !== undefined) merchant.category = category;
    if (tags !== undefined) merchant.tags = tags;
    if (avgPrice !== undefined) merchant.avgPrice = avgPrice;
    if (dianpingShopId !== undefined) merchant.dianpingShopId = dianpingShopId;
    if (videoUrl !== undefined) merchant.videoUrl = videoUrl;
    if (mediaList !== undefined) merchant.mediaList = mediaList;
    await merchant.save();
    const updated = await Merchant.findById(req.merchant.id).select('-password -__v');
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;