import express from 'express';
import { PrismaClient } from '@prisma/client';
import userController from '../controllers/userController.js';
import getValidators from '../validators/validators.js';
import dotenv from 'dotenv';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { verifyApiKey, verifyToken } from '../middlewares/authMiddleware.js';

const routes = express.Router();

const SECRET_KEY = process.env.SECRET_KEY;

const prisma = new PrismaClient();
const { createUserValidator, loginValidator } = getValidators(prisma);

dotenv.config();

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Cria um novo usuário
 *     tags:
 *       - Usuários
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               age:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 city:
 *                   type: string
 *                 state:
 *                   type: string
 *                 age:
 *                   type: string
 *       422:
 *         description: Erros de validação
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                       param:
 *                         type: string
 *                       location:
 *                         type: string
 *                         example: body
 */
routes.post('/signup', verifyApiKey, createUserValidator, async (req, res) => {
  const errors = validationResult(req)

  if (errors.isEmpty()) {
    const { name, email, password, city, state, age } = req.body;
    // Gerar o hash da senha
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await prisma.user.create({
      data: {
        email: email,
        name: name,
        password: hashedPassword,
        city: city,
        state: state,
        age: parseInt(age),
      },
    });
    const newPlayer = await prisma.player.create({
      data: {
        userEmail: newUser.email,
      },
    });
    return res.status(201).json(newUser);
  } else {
    return res.status(422).json({ errors: errors.array() });
  }
});

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Autentica um usuário existente
 *     tags:
 *       - Autenticação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Autenticação bem-sucedida
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 email:
 *                   type: string
 *       401:
 *         description: Credenciais inválidas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
routes.post('/login', verifyApiKey, loginValidator, async (req, res) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!user || !passwordMatch) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }else {

      const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY);

      return res.json({ id: user.id, token: token });
    } 

  }else {
    return res.status(422).json({errors: errors.array()})
  }
});

// rota de exemplo, apenas para testar a verificação do token de logado esta correta 
// routes.post('/store-user-informations', verifyApiKey, verifyToken, async (req, res) => {
//     return res.json({resuld:'parabens!! dados do seu usuario foram armazenados'});
// });

routes.get('/users/top-ranking', userController.findTopRanking);

export default routes;
