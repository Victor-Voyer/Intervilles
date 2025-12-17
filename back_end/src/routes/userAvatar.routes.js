import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { uploadAvatar } from '../middlewares/upload.middleware.js';
import { uploadAvatar as uploadAvatarController } from '../controllers/userAvatar.controller.js';

const router = Router();

router.post('/avatar', authMiddleware, uploadAvatar.single('avatar'), uploadAvatarController);

export default router;
