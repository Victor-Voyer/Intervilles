import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import {
  getChallenges,
  getChallenge,
  createChallengeController,
  updateChallengeController,
  deleteChallengeController,
} from '../controllers/challenge.controller.js';

const router = Router();

router.get('/', getChallenges);
router.get('/:id', getChallenge);

router.post('/', authMiddleware, createChallengeController);
router.put('/:id', authMiddleware, updateChallengeController);
router.delete('/:id', authMiddleware, deleteChallengeController);

export default router;
