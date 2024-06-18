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

// Rota para criar um novo usuário
routes.post('/users', createUserValidator, async (req, res) => {
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

// Rota para login
routes.post('/user/', loginValidator, async (req, res) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    const {email, password} = req.body;
    
    const user = await prisma.user.findUnique({
      where: {email: email}
    })
    
    if (!user) {
      return res.status(404).json({ error: 'Usuario não encontrado' });
    } 
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(404).json({ error: 'Senha inválida' });
    }

    return res.json(user);

  }else {
    return res.status(422).json({errors: errors.array()})
  }
});

export default routes;
