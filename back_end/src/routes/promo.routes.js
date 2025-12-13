import { Router } from 'express';
import {
  getPromos,
  getPromo,
  createPromoController,
  deletePromoController,
} from '../controllers/promo.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/requireRoles.js';

const router = Router();

router.get('/', getPromos);
router.get('/:id', getPromo);

// pour admin only
router.post(
  '/',
  authMiddleware,
  requireRole('admin', 'ADMIN'),
  createPromoController
);

router.delete(
  '/:id',
  authMiddleware,
  requireRole('admin', 'ADMIN'),
  deletePromoController
);

export default router;