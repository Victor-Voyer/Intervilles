import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import {
  getCommentsForChallenge,
  addCommentToChallenge,
  deleteCommentController,
} from '../controllers/comment.controller.js';

const router = Router();

// Récupérer les commentaires d’un challenge
router.get('/challenges/:id/comments', getCommentsForChallenge);

// Ajouter un commentaire (user connecté)
router.post('/challenges/:id/comments', authMiddleware, addCommentToChallenge);

// Supprimer un commentaire (auteur, MODO ou ADMIN)
router.delete('/comments/:commentId', authMiddleware, deleteCommentController);

export default router;
