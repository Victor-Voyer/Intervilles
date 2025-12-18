import db from '../models/index.js';

const { ChatMessage, User, Promo } = db;

export const fetchChatMessages = async ({ scope, promoId, limit = 50 }) => {
  const where = { scope };

  if (scope === 'promo') {
    where.promo_id = promoId;
  }

  const rows = await ChatMessage.findAll({
    where,
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'avatar_url', 'promo_id'],
        include: [
          { model: Promo, as: 'promo', attributes: ['id', 'name', 'year'] },
        ],
      },
    ],
    order: [['created_at', 'ASC']],
    limit,
  });

  return rows;
};

export const createChatMessage = async ({ scope, promoId, userId, content }) => {
  const clean = String(content ?? '').trim();
  if (!clean) {
    const err = new Error('Message vide');
    err.status = 400;
    throw err;
  }

  if (scope === 'promo' && !promoId) {
    const err = new Error('Promo manquante pour un message promo');
    err.status = 400;
    throw err;
  }

  const msg = await ChatMessage.create({
    scope,
    promo_id: scope === 'promo' ? promoId : null,
    user_id: userId,
    content: clean,
    date: new Date(),
  });

  return ChatMessage.findByPk(msg.id, {
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'avatar_url', 'promo_id'],
        include: [{ model: Promo, as: 'promo', attributes: ['id', 'name', 'year'] }],
      },
    ],
  });
};
