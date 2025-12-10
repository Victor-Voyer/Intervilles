import bcrypt from 'bcrypt';
import db from '../models/index.js';
import { signToken } from '../utils/jwt.util.js';

const { User, Role } = db;

const SALT_ROUNDS = 10;

export const registerUser = async ({ username, first_name, last_name, email, password, promo_id }) => {
  // Vérifier email déjà utilisé
  const existing = await User.findOne({ where: { email } });
  if (existing) {
    const error = new Error('Email déjà utilisé');
    error.status = 409;
    throw error;
  }

  // Vérifier username déjà utilisé
  const existingUsername = await User.findOne({ where: { username } });
  if (existingUsername) {
    const error = new Error('Username déjà utilisé');
    error.status = 409;
    throw error;
  }

  const hashed = await bcrypt.hash(password, SALT_ROUNDS);

  const role = await Role.findOne({ where: { name: 'USER' } });

  const user = await User.create({
    username,
    first_name,
    last_name,
    email,
    password: hashed,
    promo_id,
    role_id: role ? role.id : null,
    validated_at: null,
    verified_at: null,
  });

  return user;
};

export const authenticateUser = async ({ email, password }) => {
  const user = await User.findOne({
    where: { email },
    include: [{ model: Role, as: 'role' }],
  });

  if (!user) {
    const error = new Error('Identifiants invalides');
    error.status = 401;
    throw error;
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    const error = new Error('Identifiants invalides');
    error.status = 401;
    throw error;
  }

  // valid modo
  if (!user.validated_at) {
    const error = new Error('Compte en attente de validation');
    error.status = 403;
    throw error;
  }

  return user;
};

export const createAuthToken = (user) => {
  const roleName = user.role ? user.role.name : 'USER';

  const token = signToken({
    id: user.id,
    role: roleName,
  });

  return { token, roleName };
};
