import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import challengeRoutes from './challenge.routes.js';
import commentRoutes from './comment.routes.js';
import profileRoutes from './profile.routes.js';

const router = Router();


router.use('/auth', authRoutes);
router.use('/users', userRoutes);

router.use('/challenges', challengeRoutes);
router.use('/', commentRoutes); 
router.use('/profile', profileRoutes);

export default router;