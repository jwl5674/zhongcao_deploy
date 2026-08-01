const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Merchant = require('../models/Merchant');

// 注册
router.post('/register', async (req, res) => {
  try {
    const { phone, password, shopName } = req.body;
    const existing = await Merchant.findOne({ phone });
    if (existing) {
      return res.status(400).json({ success: false, message: '手机号已注册' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const merchant = new Merchant({ phone, password: hashedPassword, shopName });
    await merchant.save();
    res.json({ success: true, message: '注册成功' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 登录
router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;
    const merchant = await Merchant.findOne({ phone });
    if (!merchant) {
      return res.status(401).json({ success: false, message: '手机号或密码错误' });
    }
    const isValid = await bcrypt.compare(password, merchant.password);
    if (!isValid) {
      return res.status(401).json({ success: false, message: '手机号或密码错误' });
    }
    const token = jwt.sign(
      { id: merchant._id, phone: merchant.phone },
      process.env.JWT_SECRET || 'your_secret_key',
      { expiresIn: '7d' }
    );
    const merchantData = merchant.toObject();
    delete merchantData.password;
    res.json({ success: true, data: { token, merchant: merchantData } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;