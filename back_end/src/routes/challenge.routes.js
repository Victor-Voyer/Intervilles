import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { requireActiveUser } from '../middlewares/requireActiveUser.js';
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

router.post('/', authMiddleware, requireActiveUser, createChallengeController);
router.put('/:id', authMiddleware, requireActiveUser, updateChallengeController);
router.delete('/:id', authMiddleware, requireActiveUser, deleteChallengeController);

export default router;
