// Middleware to restrict access to admin-only endpoints (for future use)
module.exports = function adminOnly(req, res, next) {
  // In production, check authentication and user role here
  // Example: if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admins only' });
  next();
}
