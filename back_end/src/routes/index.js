import { Router } from 'express';
import authRoutes from './auth.routes.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/requireRoles.js';

const router = Router();

// Les routes /auth (register/login) restent publiques.
router.use('/auth', authRoutes);

export default router; 