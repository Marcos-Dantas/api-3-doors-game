import express from 'express';
import { PrismaClient } from '@prisma/client';
import userController from '../controllers/userController.js';
import getValidators from '../validators/validators.js';
import dotenv from "dotenv"
import {validationResult} from "express-validator";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const routes = express.Router();
const SECRET_KEY = 'kGGD2QvloDQd4dAqoINspvMKIzPTNshG';
const API_KEY = 'b3c8e11b-1701-475e-bfd2-89b4517257e1';
const prisma = new PrismaClient();
const { createUserValidator, loginValidator } = getValidators(prisma);

dotenv.config();

const verifyApiKey = async (req, res, next) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return res.status(403).json({ error: 'API Key não fornecida' });
  }

  const user = await prisma.user.findUnique({
    where: { apiKey: apiKey }
  });

  if (!user) {
    return res.status(401).json({ error: 'API Key inválida' });
  }

  req.user = user;
  next();
}

// Rota para criar um novo usuário
routes.post('/signup', verifyApiKey, createUserValidator, async (req, res) => {
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
routes.post('/login', loginValidator, async (req, res) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    const {email, password} = req.body;
    
    const user = await prisma.user.findUnique({
      where: {email: email}
    })
    
    if (!user || !(bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }else {

      const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });

      return res.json({ token });
    } 

  }else {
    return res.status(422).json({errors: errors.array()})
  }
});

export default routes;
