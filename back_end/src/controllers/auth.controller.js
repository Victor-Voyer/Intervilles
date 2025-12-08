import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../models/index.js';

const { User, Role, Promo } = db;

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const SALT_ROUNDS = 10;

export const register = async (req, res) => {
  try {
    const { username, first_name, last_name, email, password, promo_id } = req.body;

    if (!username || !email || !password || !promo_id) {
      return res.status(400).json({ message: 'Champs manquants' });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'Email déjà utilisé' });
    }

    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
      return res.status(409).json({ message: 'Username déjà utilisé' });
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

    return res.status(201).json({
      id: user.id,
      username: user.username,
      email: user.email,
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    }

    const user = await User.findOne({
      where: { email },
      include: [{ model: Role, as: 'role' }],
    });

    if (!user) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    // valid modo
    if (!user.validated_at) {
      return res.status(403).json({ message: 'Compte en attente de validation' });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role ? user.role.name : 'USER',
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role ? user.role.name : 'USER',
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};
