import bcrypt from 'bcrypt';
import db from '../models/index.js';

const { User, Role, Promo } = db;

const SALT_ROUNDS = 10;

export const findAllUsers = async () => {
  return User.findAll({
    attributes: { exclude: ['password'] },
    include: [
      { model: Role, as: 'role', attributes: ['id', 'name'] },
      { model: Promo, as: 'promo', attributes: ['id', 'name', 'year'] },
    ],
    order: [['id', 'ASC']],
  });
};

export const findUserById = async (id) => {
  return User.findByPk(id, {
    attributes: { exclude: ['password'] },
    include: [
      { model: Role, as: 'role', attributes: ['id', 'name'] },
      { model: Promo, as: 'promo', attributes: ['id', 'name', 'year'] },
      {
        model: User.sequelize.models.Participation,
        as: 'participations',
        include: [
          {
            model: User.sequelize.models.Challenge,
            as: 'challenge',
            include: [{ model: User.sequelize.models.Category, as: 'category', attributes: ['id', 'name'] }],
          },
        ],
      },
      {
        model: User.sequelize.models.Challenge,
        as: 'created_challenges',
        include: [{ model: User.sequelize.models.Category, as: 'category', attributes: ['id', 'name'] }],
      },
    ],
  });
};

export const createUser = async ({
  username,
  first_name,
  last_name,
  email,
  password,
  promo_id,
  role_id,
  validated_at = null,
  verified_at = null,
}) => {
  if (!username || !first_name || !last_name || !email || !password || !promo_id) {
    const error = new Error('Champs requis manquants pour la création de l’utilisateur');
    error.status = 400;
    throw error;
  }

  const existingEmail = await User.findOne({ where: { email } });
  if (existingEmail) {
    const error = new Error('Email déjà utilisé');
    error.status = 409;
    throw error;
  }

  const existingUsername = await User.findOne({ where: { username } });
  if (existingUsername) {
    const error = new Error('Username déjà utilisé');
    error.status = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  let finalRoleId = role_id ?? null;
  if (!finalRoleId) {
    const defaultRole = await Role.findOne({ where: { name: 'USER' } });
    finalRoleId = defaultRole ? defaultRole.id : null;
  }

  const user = await User.create({
    username,
    first_name,
    last_name,
    email,
    password: hashedPassword,
    promo_id,
    role_id: finalRoleId,
    validated_at,
    verified_at,
  });

  // On recharge pour bénéficier des associations et sans le password
  return findUserById(user.id);
};

export const updateUserById = async (id, updates) => {
  const user = await User.findByPk(id);

  if (!user) {
    const error = new Error('Utilisateur non trouvé');
    error.status = 404;
    throw error;
  }

  const {
    username,
    first_name,
    last_name,
    email,
    password,
    promo_id,
    role_id,
    validated_at,
    verified_at,
  } = updates;

  if (email && email !== user.email) {
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      const error = new Error('Email déjà utilisé');
      error.status = 409;
      throw error;
    }
  }

  if (username && username !== user.username) {
    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
      const error = new Error('Username déjà utilisé');
      error.status = 409;
      throw error;
    }
  }

  if (username !== undefined) user.username = username;
  if (first_name !== undefined) user.first_name = first_name;
  if (last_name !== undefined) user.last_name = last_name;
  if (email !== undefined) user.email = email;
  if (promo_id !== undefined) user.promo_id = promo_id;
  if (role_id !== undefined) user.role_id = role_id;
  if (validated_at !== undefined) user.validated_at = validated_at;
  if (verified_at !== undefined) user.verified_at = verified_at;

  if (password !== undefined) {
    user.password = await bcrypt.hash(password, SALT_ROUNDS);
  }

  await user.save();

  return findUserById(user.id);
};

export const deleteUserById = async (id) => {
  const user = await User.findByPk(id);

  if (!user) {
    const error = new Error('Utilisateur non trouvé');
    error.status = 404;
    throw error;
  }

  await user.destroy();

  return true;
};

