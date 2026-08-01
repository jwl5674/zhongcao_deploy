const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ success: false, message: '请先登录' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
    req.merchant = { id: decoded.id, phone: decoded.phone };
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token 无效或已过期' });
  }
};