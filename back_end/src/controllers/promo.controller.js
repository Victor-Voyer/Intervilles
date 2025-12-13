import {
  findAllPromos,
  findPromoById,
  createPromo,
  deletePromoById,
} from '../services/promo.service.js';

const handleError = (res, err) => {
  console.error('Promo controller error:', err);

  return res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erreur serveur',
  });
};

export const getPromos = async (req, res) => {
  try {
    const promos = await findAllPromos();

    return res.json({
      success: true,
      message: 'Promos récupérées avec succès',
      data: promos,
    });
  } catch (err) {
    return handleError(res, err);
  }
};

export const getPromo = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID invalide',
      });
    }

    const promo = await findPromoById(id);

    if (!promo) {
      return res.status(404).json({
        success: false,
        message: 'Promo non trouvée',
      });
    }

    return res.json({
      success: true,
      message: 'Promo récupérée avec succès',
      data: promo,
    });
  } catch (err) {
    return handleError(res, err);
  }
};

export const createPromoController = async (req, res) => {
  try {
    const { name, year } = req.body;

    const promo = await createPromo({ name, year });

    return res.status(201).json({
      success: true,
      message: 'Promo créée avec succès',
      data: promo,
    });
  } catch (err) {
    return handleError(res, err);
  }
};

export const deletePromoController = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID invalide',
      });
    }

    await deletePromoById(id);

    return res.status(204).json({
      success: true,
      message: 'Promo supprimée avec succès',
    });
  } catch (err) {
    return handleError(res, err);
  }
};
