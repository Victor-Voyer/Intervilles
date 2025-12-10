import { body } from 'express-validator';

const isPasswordStrongEnough = (password) => {
  if (typeof password !== 'string') {
    throw new Error('Mot de passe requis');
  }

  const minLength = 8;
  const hasMinLength = password.length >= minLength;
  const hasLetter = /[A-Za-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  if (!hasMinLength || !hasLetter || !hasNumber || !hasSpecialChar) {
    throw new Error(
      'Mot de passe trop faible (minimum 8 caractères, avec au moins une lettre, un chiffre et un caractère spécial)',
    );
  }

  return true;
};

// Validation d'enregistrement
export const registerValidation = [
  body('email').notEmpty().withMessage('Email requis').bail()
    .isEmail().withMessage('Email invalide'),
  body('password')
    .notEmpty().withMessage('Mot de passe requis')
    .bail()
    .custom(isPasswordStrongEnough),
  body('username').notEmpty().withMessage('Nom d’utilisateur requis'),
  body('promo_id').notEmpty().withMessage('Promo requise'),
];

// Validation de connexion
export const loginValidation = [
  body('email').notEmpty().withMessage('Email requis').bail()
    .isEmail().withMessage('Email invalide'),
  body('password').notEmpty().withMessage('Mot de passe requis'),
];