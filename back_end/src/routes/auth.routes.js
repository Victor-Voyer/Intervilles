import { Router } from 'express';
import { register, login, verifyEmail } from '../controllers/auth.controller.js';
import { registerValidation, loginValidation } from '../middlewares/validators/auth.validator.js';

const router = Router();

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/verify-email', verifyEmail);

export default router;
