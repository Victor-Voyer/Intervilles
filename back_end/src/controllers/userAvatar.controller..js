import db from '../models/index.js';

export const uploadAvatar = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Aucun fichier envoyé' });
  }

  const avatarUrl = `/uploads/avatars/${req.file.filename}`;

  await db.User.update(
    { avatar_url: avatarUrl },
    { where: { id: req.user.id } }
  );

  return res.json({
    data: { avatar_url: avatarUrl },
  });
};
