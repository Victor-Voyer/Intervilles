import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { getMe } from '../controllers/profile.controller.js';

const router = Router();

router.get('/', authMiddleware, getMe);

export default router;
