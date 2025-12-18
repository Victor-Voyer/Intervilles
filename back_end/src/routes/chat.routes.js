import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { getChatMessages } from '../controllers/chat.controller.js';

const router = Router();

router.get('/messages', authMiddleware, getChatMessages);

export default router;
