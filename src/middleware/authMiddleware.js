const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key';

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(400).json({ message: 'Token de autorização ausente ou mal formatado' });
  }

  const token = authHeader.slice(7).trim();

  if (!token) {
    return res.status(400).json({ message: 'Token de autorização não informado' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(400).json({ message: 'Token de autorização inválido ou expirado' });
  }
}

module.exports = authMiddleware;