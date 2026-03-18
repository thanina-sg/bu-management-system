const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Token manquant' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalide ou expiré' });
  }
};

const requireRoles = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentification requise' });
  }

  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Accès interdit' });
  }

  return next();
};

module.exports = {
  authenticateToken,
  requireRoles,
};
