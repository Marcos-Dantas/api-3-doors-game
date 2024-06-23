import express from 'express';
import { PrismaClient } from '@prisma/client';
import userController from '../controllers/userController.js';
import { getValidators } from '../validators/validators.js';
import dotenv from 'dotenv';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
  verifyApiKey,
  verifyToken,
  validateData,
} from '../middlewares/authMiddleware.js';

const routes = express.Router();

const SECRET_KEY = process.env.SECRET_KEY;

const prisma = new PrismaClient();
const { createUserValidator, loginValidator } = getValidators();

dotenv.config();

routes.post(
  '/signup',
  verifyApiKey,
  createUserValidator,
  validateData,
  userController.createUser,
);

routes.post('/login', verifyApiKey, loginValidator, async (req, res) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!user || !passwordMatch) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    } else {
      const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY);

      return res.json({ id: user.id, token: token });
    }
  } else {
    return res.status(422).json({ errors: errors.array() });
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
