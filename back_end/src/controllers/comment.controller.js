import db from '../models/index.js';

const { Comment, User, Challenge } = db;

const handleError = (res, err) => {
  console.error('Comment controller error:', err);

  const status = err.status || 500;

  return res.status(status).json({
    success: false,
    message: err.message || 'Erreur serveur',
  });
};

export const getCommentsForChallenge = async (req, res) => {
  try {
    const challengeId = Number(req.params.id);
    if (Number.isNaN(challengeId)) {
      return res.status(400).json({
        success: false,
        message: 'ID de challenge invalide',
      });
    }

    const challenge = await Challenge.findByPk(challengeId);
    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge non trouvé',
      });
    }

    const comments = await Comment.findAll({
      where: { challenge_id: challengeId },
      include: [
        { model: User, as: 'user', attributes: ['id', 'username'] },
      ],
      order: [['created_at', 'ASC']],
    });

    return res.json({
      success: true,
      message: 'Commentaires récupérés avec succès',
      data: comments,
    });
  } catch (err) {
    return handleError(res, err);
  }
};

export const addCommentToChallenge = async (req, res) => {
  try {
    const challengeId = Number(req.params.id);
    if (Number.isNaN(challengeId)) {
      return res.status(400).json({
        success: false,
        message: 'ID de challenge invalide',
      });
    }

    const challenge = await Challenge.findByPk(challengeId);
    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge non trouvé',
      });
    }

    const { content } = req.body;
    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Contenu du commentaire requis',
      });
    }

    const comment = await Comment.create({
      content,
      user_id: req.user.id,
      challenge_id: challengeId,
    });

    return res.status(201).json({
      success: true,
      message: 'Commentaire ajouté avec succès',
      data: comment,
    });
  } catch (err) {
    return handleError(res, err);
  }
};

export const deleteCommentController = async (req, res) => {
  try {
    const commentId = Number(req.params.commentId);
    if (Number.isNaN(commentId)) {
      return res.status(400).json({
        success: false,
        message: 'ID de commentaire invalide',
      });
    }

    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Commentaire non trouvé',
      });
    }

    const isAuthor = comment.user_id === req.user.id;
    const isModerator = req.user.role === 'MODERATOR';
    const isAdmin = req.user.role === 'ADMIN';

    if (!isAuthor && !isModerator && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à supprimer ce commentaire',
      });
    }

    await comment.destroy();

    return res.status(204).json({
      success: true,
      message: 'Commentaire supprimé avec succès',
    });
  } catch (err) {
    return handleError(res, err);
  }
};
