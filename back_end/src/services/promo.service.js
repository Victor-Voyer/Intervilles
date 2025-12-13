import db from '../models/index.js';

const { Promo } = db;

export const findAllPromos = async () => {
  return Promo.findAll({
    order: [['year', 'ASC'], ['name', 'ASC']],
  });
};

export const findPromoById = async (id) => {
  return Promo.findByPk(id);
};

export const createPromo = async ({ name, year }) => {
  if (!name || !year) {
    const error = new Error('Nom et année de promo requis');
    error.status = 400;
    throw error;
  }

  const existing = await Promo.findOne({ where: { name, year } });
  if (existing) {
    const error = new Error('Cette promo existe déjà');
    error.status = 409;
    throw error;
  }

  const promo = await Promo.create({ name, year });
  return promo;
};

export const deletePromoById = async (id) => {
  const promo = await Promo.findByPk(id);

  if (!promo) {
    const error = new Error('Promo non trouvée');
    error.status = 404;
    throw error;
  }

  await promo.destroy();
  return true;
};
