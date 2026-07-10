const jwt = require('jsonwebtoken');

function requireSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not configured');
  return secret;
}

exports.signToken = (payload) =>
  jwt.sign(payload, requireSecret(), { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

exports.verifyToken = (token) => jwt.verify(token, requireSecret());
