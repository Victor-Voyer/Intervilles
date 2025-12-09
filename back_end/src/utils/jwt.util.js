import jwt from 'jsonwebtoken';

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET n\'est pas défini dans les variables d\'environnement');
  }
  return secret;
};

export const signToken = (payload, options = {}) => {
  const secret = getJwtSecret();
  const defaultOptions = { expiresIn: '7d' };
  return jwt.sign(payload, secret, { ...defaultOptions, ...options });
};

export const verifyToken = (token) => {
  const secret = getJwtSecret();
  return jwt.verify(token, secret);
};

export default {
  signToken,
  verifyToken,
};

