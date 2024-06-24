import express from 'express';
import userController from '../controllers/userController.js';
import { getValidators } from '../validators/validators.js';
import dotenv from 'dotenv';
import {
  verifyApiKey,
  verifyToken,
  validateData,
} from '../middlewares/authMiddleware.js';
import { Resend } from 'resend';

const resend = new Resend(process.env.RE_KEY);
const routes = express.Router();

const { createUserValidator, loginValidator } = getValidators();

dotenv.config();

routes.post(
  '/signup',
  verifyApiKey,
  createUserValidator,
  validateData,
  userController.createUser,
);

routes.post(
  '/login',
  verifyApiKey,
  loginValidator,
  validateData,
  userController.login,
);

routes.post('/sendmail', verifyApiKey, async (req, res) => {
  try {
    const { email, message } = req.body;
    console.log(email, message);
    const { data, error } = await resend.emails.send({
      from: '3DOORS <onboarding@resend.dev>',
      to: ['3doors.suporte@gmail.com'],
      subject: 'Report',
      html: `
      E-mail: ${email} <br>
      Report: ${message}
      `,
    });
    if (error) {
      return res.status(400).json({ error });
    }
    res.status(200).json({ message: 'E-mail enviado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro interno do servidor: ' + err });
  }
});

// rota de exemplo, apenas para testar a verificação do token de logado esta correta
// routes.post('/store-user-informations', verifyApiKey, verifyToken, async (req, res) => {
//     return res.json({resuld:'parabens!! dados do seu usuario foram armazenados'});
// });
routes.get('/users/top-ranking', verifyApiKey, userController.findTopRanking);
routes.get('/users/:email', verifyApiKey, userController.findUserByEmail);
routes.put('/users/:email', verifyApiKey, userController.atualizaDadosUser);
routes.get('/users', verifyApiKey, userController.findAllUsers);
routes.delete('/users', verifyApiKey, userController.deleteUser);

export default routes;
