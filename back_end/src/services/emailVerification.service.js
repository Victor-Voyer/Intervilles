import nodemailer from 'nodemailer';
import db from '../models/index.js';
import { signToken, verifyToken } from '../utils/jwt.util.js';

const { User } = db;

const emailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NODEMAILER_USER,        
    pass: process.env.NODEMAILER_PASSWORD,    
  },
});


export const sendVerificationEmail = async (user) => {

  const emailToken = signToken(
    { email: user.email },
    { expiresIn: '2m' },
  );

  const PORT = process.env.PORT || 5000;
  const baseUrl = process.env.APP_URL || `http://localhost:${PORT}`;

  const verificationUrl = `${baseUrl}/api/auth/verify-email?token=${emailToken}`;

  const mailOptions = {
    from: process.env.NODEMAILER_USER || 'no-reply@intervilles.local',
    to: user.email,
    subject: 'Vérification de votre adresse e-mail',
    html: `Veuillez cliquer sur le lien suivant pour vérifier votre adresse e-mail : 
      <a href="${verificationUrl}">${verificationUrl}</a>`,
  };

  await emailTransporter.sendMail(mailOptions);
};

export const verifyEmailToken = async (token) => {
  const payload = verifyToken(token);

  const user = await User.findOne({ where: { email: payload.email } });

  if (!user) {
    const error = new Error('Utilisateur introuvable');
    error.status = 404;
    throw error;
  }

  if (user.verified_at) {
    return user;
  }

  user.verified_at = new Date();
  await user.save();

  return user;
};
