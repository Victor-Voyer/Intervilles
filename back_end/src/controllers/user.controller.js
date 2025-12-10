import {
  findAllUsers,
  findUserById,
  createUser,
  updateUserById,
  deleteUserById,
} from '../services/user.service.js';

const handleError = (res, err) => {
  console.error('User controller error:', err);

  return res.status(500).json({ 
    success: false,
    message: err.message || 'Erreur serveur',
  });
};

export const getUsers = async (req, res) => {
  try {
    const users = await findAllUsers();
    return res.json({ 
      success: true,
      message: 'Utilisateurs récupérés avec succès',
      data: users 
    });
  } catch (err) {
    return handleError(res, err);
  }
};

export const getUser = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ 
        success: false,
        message: 'ID invalide',
      });
    }

    const user = await findUserById(id);

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'Utilisateur non trouvé',
      });
    }

    return res.json({ 
      success: true,
      message: 'Utilisateur récupéré avec succès',
      data: user,
    });
  } catch (err) {
    return handleError(res, err);
  }
};

export const createUserController = async (req, res) => {
  try {
    const {
      username,
      first_name,
      last_name,
      email,
      password,
      promo_id,
      role_id,
      validated_at,
      verified_at,
    } = req.body;

    const user = await createUser({
      username,
      first_name,
      last_name,
      email,
      password,
      promo_id,
      role_id,
      validated_at,
      verified_at,
    });

    return res.status(201).json({ 
      success: true,
      message: 'Utilisateur créé avec succès',
      data: user,
    });
  } catch (err) {
    return handleError(res, err);
  }
};

export const updateUserController = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ 
        success: false,
        message: 'ID invalide',
      });
    }

    const updatedUser = await updateUserById(id, req.body);

    return res.json({ 
      success: true,
      message: 'Utilisateur mis à jour avec succès',
      data: updatedUser,
    });
  } catch (err) {
    return handleError(res, err);
  }
};

export const deleteUserController = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ 
        success: false,
        message: 'ID invalide',
      });
    }

    await deleteUserById(id);

    return res.status(204).json({ 
      success: true,
      message: 'Utilisateur supprimé avec succès',
    });
  } catch (err) {
    return handleError(res, err);
  }
};

