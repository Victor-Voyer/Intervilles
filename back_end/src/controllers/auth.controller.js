import { registerUser, authenticateUser, createAuthToken } from '../services/auth.service.js';

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
