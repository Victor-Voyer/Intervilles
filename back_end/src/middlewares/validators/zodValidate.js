import { ZodError } from 'zod';

export const validateBody = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    return next();
  } catch (err) {
    if (err instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: err.issues.map((e) => ({
          path: e.path.join('.'),
          message: e.message,
        })),
      });
    }

    console.error('Erreur de validation Zod:', err);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la validation',
    });
  }
};

