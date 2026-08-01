const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Merchant = require('../models/Merchant');
const Template = require('../models/Template');

// 获取所有商家
router.get('/merchants', async (req, res) => {
  try {
    const merchants = await Merchant.find().select('-password -__v').sort({ createdAt: -1 });
    res.json({ success: true, data: merchants });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 切换商家状态
router.put('/merchants/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['active', 'disabled'].includes(status)) {
      return res.status(400).json({ success: false, message: '状态值无效' });
    }
    const merchant = await Merchant.findById(req.params.id);
    if (!merchant) {
      return res.status(404).json({ success: false, message: '商家不存在' });
    }
    merchant.status = status;
    await merchant.save();
    res.json({ success: true, data: { id: merchant.id, status: merchant.status } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 获取所有模板
router.get('/templates', async (req, res) => {
  try {
    const templates = await Template.find().sort({ sortOrder: 1, createdAt: -1 });
    res.json({ success: true, data: templates });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 创建模板
router.post('/templates', async (req, res) => {
  try {
    const { shopType, category, rating, text, tips, sortOrder, videoUrl } = req.body;
    if (!shopType || !category || !rating || !text) {
      return res.status(400).json({ success: false, message: '请填写完整信息' });
    }
    const template = new Template({ shopType, category, rating, text, tips: tips || '', sortOrder: sortOrder || 0, videoUrl: videoUrl || '' });
    await template.save();
    res.json({ success: true, data: template });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 删除模板
router.delete('/templates/:id', async (req, res) => {
  try {
    const template = await Template.findByIdAndDelete(req.params.id);
    if (!template) {
      return res.status(404).json({ success: false, message: '模板不存在' });
    }
    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;