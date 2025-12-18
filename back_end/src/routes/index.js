import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import challengeRoutes from './challenge.routes.js';
import commentRoutes from './comment.routes.js';
import profileRoutes from './profile.routes.js';
import promoRoutes from './promo.routes.js';
import chatRoutes from './chat.routes.js'

const router = Router();


router.use('/auth', authRoutes);
router.use('/users', userRoutes);

router.use('/challenges', challengeRoutes);
router.use('/', commentRoutes); 
router.use('/profile', profileRoutes);
router.use('/promos', promoRoutes); 
router.use('/chat', chatRoutes)

export default router;