import { fetchChatMessages } from '../services/chat.service.js';

const allowedScopes = new Set(['global', 'promo']);

export const getChatMessages = async (req, res) => {
  try {
    const scope = String(req.query.scope ?? 'global');
    if (!allowedScopes.has(scope)) {
      return res.status(400).json({ success: false, message: 'Scope invalide' });
    }

    const promoId = req.user?.promo_id ? Number(req.user.promo_id) : null;

    if (scope === 'promo' && !promoId) {
      return res.status(400).json({ success: false, message: 'Aucune promo pour cet utilisateur' });
    }

    const data = await fetchChatMessages({
      scope,
      promoId,
      limit: 50,
    });

    return res.json({ success: true, data });
  } catch (err) {
    console.error('getChatMessages error:', err);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};
