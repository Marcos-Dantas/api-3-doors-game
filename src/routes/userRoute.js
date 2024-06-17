import express from 'express';
import { PrismaClient } from '@prisma/client';
import userController from '../controllers/userController.js';
import {loginValidator, createUserValidator} from '../validators/validators.js';
import dotenv from "dotenv"
import {validationResult} from "express-validator";

const routes = express.Router();

const prisma = new PrismaClient();

dotenv.config();

// Rota para criar um novo usuário
routes.post('/users', createUserValidator, async (req, res) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    const { name, email, password, city, state, age} = req.body;
    const newUser = await prisma.user.create({
      data: {
        email: email,
        name: name, 
        password: password, 
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
    res.status(201).json(newUser)
  }else {
    res.status(422).json({errors: errors.array()})
  }
});

// Rota para login
routes.post('/user/', loginValidator, async (req, res) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    const {email, password} = req.body;
    const user = await prisma.user.findUnique({
      where: {email: email, password: password}
    })
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'Usuario não encontrado' });
    }
  }else {
    res.status(422).json({errors: errors.array()})
  }
});

export default routes;
