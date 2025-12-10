import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/requireRoles.js';
import {
  getUsers,
  getUser,
  updateUserController,
  deleteUserController,
} from '../controllers/user.controller.js';

const router = Router();


router.use(authMiddleware);
router.use(requireRole('admin', 'ADMIN'));

router.get('/', getUsers);
router.get('/:id', getUser);

router.put('/:id', updateUserController);

router.delete('/:id', deleteUserController);

export default router;

