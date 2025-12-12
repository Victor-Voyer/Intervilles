import { findUserById } from '../services/user.service.js';

export const getMe = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Non authentifié' });
    }

    const user = await findUserById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }

    return res.json({
      success: true,
      data: user,
    });
  } catch (err) {
    console.error('Profile me error:', err);
    const status = err.status || 500;
    return res.status(status).json({ message: err.message || 'Erreur serveur' });
  }
};
