import { registerUser, authenticateUser, createAuthToken } from '../services/auth.service.js';
import { sendVerificationEmail, verifyEmailToken } from '../services/emailVerification.service.js';

export const register = async (req, res) => {
  try {
    const { username, first_name, last_name, email, password, promo_id } = req.body;

    const user = await registerUser({
      username,
      first_name,
      last_name,
      email,
      password,
      promo_id,
    });

    await sendVerificationEmail(user);

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

    const user = await authenticateUser({ email, password });

    const { token, roleName } = createAuthToken(user);

    return res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: roleName,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: 'Token manquant' });
    }

    const user = await verifyEmailToken(token);

    return res.json({
      message: 'Email vérifié',
      user: {
        id: user.id,
        email: user.email,
        verified_at: user.verified_at,
      },
    });
  } catch (err) {
    console.error('Verify email error:', err);
    const status = err.status || 500;
    const message = err.message || 'Erreur serveur';
    return res.status(status).json({ message });
  }
};
