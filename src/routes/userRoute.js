import express from 'express';
import { PrismaClient } from '@prisma/client';
import userController from '../controllers/userController.js';
import getValidators from '../validators/validators.js';
import dotenv from "dotenv"
import {validationResult} from "express-validator";
import bcrypt from 'bcrypt';

const routes = express.Router();

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
 *                 description: Nome do usuário
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 description: Email do usuário
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 description: Senha do usuário
 *                 example: mypassword
 *               city:
 *                 type: string
 *                 description: Cidade do usuário
 *                 example: São Paulo
 *               state:
 *                 type: string
 *                 description: Estado do usuário
 *                 example: SP
 *               age:
 *                 type: integer
 *                 description: Idade do usuário
 *                 example: 30
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       422:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *     security:
 *       - bearerAuth: []
 */
routes.post('/signup', createUserValidator, async (req, res) => {
  const errors = validationResult(req)

  if (errors.isEmpty()) {
    const { name, email, password, city, state, age} = req.body;
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
    return res.status(201).json(newUser)
  }else {
    return res.status(422).json({errors: errors.array()})
  }
});


routes.post('/login', loginValidator, async (req, res) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    const {email, password} = req.body;
    
    const user = await prisma.user.findUnique({
      where: {email: email}
    })
    
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!user || !passwordMatch) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }else {
      return res.json({ id: user.id, email: user.email});
    } 

  }else {
    return res.status(422).json({errors: errors.array()})
  }
});

export default routes;
