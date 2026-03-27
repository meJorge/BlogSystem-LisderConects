const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer '))
      return res.status(401).json({ error: 'Token no proporcionado' });
    req.user = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

const optionalAuth = (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (header && header.startsWith('Bearer '))
      req.user = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
  } catch {}
  next();
};

const isAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin')
    return res.status(403).json({ error: 'Solo administradores' });
  next();
};

module.exports = { authenticate, optionalAuth, isAdmin };
