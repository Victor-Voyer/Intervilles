import db from '../models/index.js';

// Bloque les actions sensibles si le compte n'est pas validé ET vérifié
export const requireActiveUser = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }

    const user = await db.User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }

    if (!user.validated_at || !user.verified_at) {
      return res.status(403).json({ message: 'Compte non validé ou email non vérifié' });
    }

    next();
  } catch (err) {
    console.error('requireActiveUser error:', err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};
