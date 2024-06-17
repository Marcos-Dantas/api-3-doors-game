import express from "express";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv"
import {body, validationResult} from "express-validator";

export const createUserValidator = [
  body('email', 'Email não pode ser vazio').not().isEmpty(),
  body('name', 'Nome não pode ser vazio').not().isEmpty(),
  body('city', 'Cidade não pode ser vazio').not().isEmpty(),
  body('state', 'Estado não pode ser vazio').not().isEmpty(),
  body('age', 'Idade não pode ser vazio').not().isEmpty(),
  body('email', 'Email invalido').isEmail(),
  body('email').custom(async (email) => {
    const user = await prisma.user.findUnique({
      where: {email: email}
    })
    if (user) {
      throw new Error('Email ja esta em uso')
    } 
  }),
  body('password', 'password não pode ser vazio').not().isEmpty(),
  body('password', 'O comprimento mínimo da senha é de 6 caracteres').isLength({min: 6}),
]

export const loginValidator = [
  body('email', 'Email não pode ser vazio').not().isEmpty(),
  body('email', 'Email invalido').isEmail(),
  body('password', 'password não pode ser vazio').not().isEmpty(),
  body('password', 'O comprimento mínimo da senha é de 6 caracteres').isLength({min: 6}),
]
const prisma = new PrismaClient();

var app = express();
app.use(express.json());

dotenv.config();

// Rota para criar um novo usuário
app.post('/users', createUserValidator, async (req, res) => {
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
    res.status(201).json(newUser)
  }else {
    res.status(422).json({errors: errors.array()})
  }
});

// Rota para login
app.post('/user/', loginValidator, async (req, res) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    const {email, password} = req.body;
    const user = await prisma.user.findUnique({
      where: {email: email, password: password}
    })
    if (user) {
      const newPlayer = await prisma.player.create({
        data: {
          userEmail: user.email, 
        },
      });
      res.json(user);
    } else {
      res.status(404).json({ error: 'Usuario não encontrado' });
    }
  }else {
    res.status(422).json({errors: errors.array()})
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});