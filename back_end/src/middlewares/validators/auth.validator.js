import { z } from 'zod';
import { validateBody } from './zodValidate.js';

const passwordSchema = z
  .string({ required_error: 'Mot de passe requis' })
  .min(
    8,
    'Mot de passe trop faible (minimum 8 caractères, avec au moins une lettre, un chiffre et un caractère spécial)'
  )
  .regex(/[A-Za-z]/, 'Le mot de passe doit contenir au moins une lettre')
  .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre')
  .regex(
    /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/,
    'Le mot de passe doit contenir au moins un caractère spécial'
  );

const registerSchema = z.object({
  email: z.string({ required_error: 'Email requis' }).email('Email invalide'),
  password: passwordSchema,
  username: z
    .string({ required_error: 'Nom d’utilisateur requis' })
    .min(1, 'Nom d’utilisateur requis'),
  first_name: z
    .string({ required_error: 'Prénom requis' })
    .min(1, 'Prénom requis'),
  last_name: z.string({ required_error: 'Nom requis' }).min(1, 'Nom requis'),
  promo_id: z.union([
    z.number({ invalid_type_error: 'Promo requise' }),
    z
      .string()
      .regex(/^\d+$/, 'Promo requise')
      .transform((val) => Number(val)),
  ]),
});

const loginSchema = z.object({
  email: z.string({ required_error: 'Email requis' }).email('Email invalide'),
  password: z
    .string({ required_error: 'Mot de passe requis' })
    .min(1, 'Mot de passe requis'),
});

// On garde la même API qu’avant pour les routes
export const registerValidation = [validateBody(registerSchema)];
export const loginValidation = [validateBody(loginSchema)];
