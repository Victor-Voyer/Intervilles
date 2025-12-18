import jwt from 'jsonwebtoken';
import db from '../models/index.js';
import { createChatMessage } from '../services/chat.service.js';

const { User, Role, Promo } = db;

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

const allowedScopes = new Set(['global', 'promo']);

const getRoomName = (scope, promoId) => {
  if (scope === 'promo') return `promo:${promoId}`;
  return 'global';
};

export const initSocket = (io) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake?.auth?.token;
      if (!token) return next(new Error('Token manquant'));

      const decoded = jwt.verify(token, JWT_SECRET);

      const user = await User.findByPk(decoded.id, {
        attributes: ['id', 'username', 'promo_id', 'avatar_url'],
        include: [
          { model: Role, as: 'role', attributes: ['id', 'name'] },
          { model: Promo, as: 'promo', attributes: ['id', 'name', 'year'] },
        ],
      });

      if (!user) return next(new Error('Utilisateur introuvable'));

      socket.user = {
        id: user.id,
        username: user.username,
        promo_id: user.promo_id,
        avatar_url: user.avatar_url ?? null,
        role: user.role?.name ?? null,
      };

      next();
    } catch (e) {
      next(new Error('Token invalide'));
    }
  });

  io.on('connection', (socket) => {
    socket.join('global');
    if (socket.user?.promo_id) {
      socket.join(`promo:${socket.user.promo_id}`);
    }

    io.to('global').emit('chat:user-joined', {
      scope: 'global',
      username: socket.user.username,
    });

    if (socket.user?.promo_id) {
      io.to(`promo:${socket.user.promo_id}`).emit('chat:user-joined', {
        scope: 'promo',
        username: socket.user.username,
        promo_id: socket.user.promo_id,
      });
    }

    socket.on('chat:typing', (payload) => {
      const scope = String(payload?.scope ?? 'global');
      if (!allowedScopes.has(scope)) return;

      if (scope === 'promo' && !socket.user?.promo_id) return;

      const room = getRoomName(scope, socket.user?.promo_id);
      socket.to(room).emit('chat:typing', {
        scope,
        username: socket.user.username,
        promo_id: scope === 'promo' ? socket.user.promo_id : null,
      });
    });

    socket.on('chat:send', async (payload) => {
      try {
        const scope = String(payload?.scope ?? 'global');
        if (!allowedScopes.has(scope)) return;

        if (scope === 'promo' && !socket.user?.promo_id) return;

        const content = payload?.content;

        const created = await createChatMessage({
          scope,
          promoId: scope === 'promo' ? socket.user.promo_id : null,
          userId: socket.user.id,
          content,
        });

        const room = getRoomName(scope, socket.user?.promo_id);

        io.to(room).emit('chat:message', {
          id: created.id,
          scope: created.scope,
          promo_id: created.promo_id,
          content: created.content,
          date: created.date,
          created_at: created.created_at,
          user: created.user,
        });
      } catch (err) {
        socket.emit('chat:error', { message: err.message || 'Erreur envoi message' });
      }
    });

    socket.on('disconnect', () => {
      io.to('global').emit('chat:user-left', {
        scope: 'global',
        username: socket.user?.username ?? 'User',
      });

      if (socket.user?.promo_id) {
        io.to(`promo:${socket.user.promo_id}`).emit('chat:user-left', {
          scope: 'promo',
          username: socket.user?.username ?? 'User',
          promo_id: socket.user.promo_id,
        });
      }
    });
  });
};
