import db from '../models/index.js';

const { Challenge, User, Category } = db;

const handleError = (res, err) => {
  console.error('Challenge controller error:', err);

  const status = err.status || 500;

  return res.status(status).json({
    success: false,
    message: err.message || 'Erreur serveur',
  });
};

export const getChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.findAll({
      include: [
        { model: User, as: 'user', attributes: ['id', 'username'] },
        { model: Category, as: 'category', attributes: ['id', 'name'] },
      ],
      order: [['created_at', 'DESC']],
    });

    return res.json({
      success: true,
      message: 'Challenges récupérés avec succès',
      data: challenges,
    });
  } catch (err) {
    return handleError(res, err);
  }
};

export const getChallenge = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID invalide',
      });
    }

    const challenge = await Challenge.findByPk(id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'username'] },
        { model: Category, as: 'category', attributes: ['id', 'name'] },
      ],
    });

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Pas de Challenge',
      });
    }

    return res.json({
      success: true,
      message: 'Récupération challenge ok',
      data: challenge,
    });
  } catch (err) {
    return handleError(res, err);
  }
};

export const createChallengeController = async (req, res) => {
  try {
    const {
      title,
      description,
      category_id,
      start_date,
      end_date,
    } = req.body;

    if (!title || !description || !category_id || !start_date || !end_date) {
      return res.status(400).json({
        success: false,
        message: 'Champs manquants pour la création du challenge',
      });
    }

    const challenge = await Challenge.create({
      title,
      description,
      category_id,
      user_id: req.user.id,
      status: 'open',
      start_date,
      end_date,
    });

    return res.status(201).json({
      success: true,
      message: 'Création challenge ok',
      data: challenge,
    });
  } catch (err) {
    return handleError(res, err);
  }
};

export const updateChallengeController = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID invalide',
      });
    }

    const challenge = await Challenge.findByPk(id);

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge non trouvé',
      });
    }

    const isAuthor = challenge.user_id === req.user.id;
    const isModerator = req.user.role === 'MODERATOR';
    const isAdmin = req.user.role === 'ADMIN';

    if (!isAuthor && !isModerator && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à modifier ce challenge',
      });
    }

    const {
      title,
      description,
      category_id,
      status,
      start_date,
      end_date,
    } = req.body;

    await challenge.update({
      title: title ?? challenge.title,
      description: description ?? challenge.description,
      category_id: category_id ?? challenge.category_id,
      status: status ?? challenge.status,
      start_date: start_date ?? challenge.start_date,
      end_date: end_date ?? challenge.end_date,
    });

    return res.json({
      success: true,
      message: 'Challenge mis à jour avec succès',
      data: challenge,
    });
  } catch (err) {
    return handleError(res, err);
  }
};

export const deleteChallengeController = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID invalide',
      });
    }

    const challenge = await Challenge.findByPk(id);

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge non trouvé',
      });
    }

    // Auteur O
    const isAuthor = challenge.user_id === req.user.id;
    const isModerator = req.user.role === 'MODERATOR';
    const isAdmin = req.user.role === 'ADMIN';

    if (!isAuthor && !isModerator && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à supprimer ce challenge',
      });
    }

    await challenge.destroy();

    return res.status(204).json({
      success: true,
      message: 'Challenge supprimé avec succès',
    });
  } catch (err) {
    return handleError(res, err);
  }
};
