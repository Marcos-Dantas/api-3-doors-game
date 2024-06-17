import express from 'express';
import { PrismaClient } from '@prisma/client';
import userController from '../controllers/userController.js';

const routes = express.Router();

const prisma = new PrismaClient();

// Rota para obter todos os usuários
routes.get('/users', async (req, res) => {
  const users = await prisma.user.findMany({});
  res.status(200).json(users);
});

// Rota para criar um novo usuário
routes.post('/users', async (req, res) => {
  const { name, email } = req.body;
  const newUser = await prisma.user.create({
    data: { name, email },
  });
  res.status(201).json(newUser);
});

// Rota para pegar um usuário especifico
routes.get('/user/:id', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.params.id, 10) },
    });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Rota para deletar um usuário
routes.delete('/user/:id', async (req, res) => {
  try {
    const user = await prisma.user.delete({
      where: { id: parseInt(req.params.id, 10) },
    });
    res.json({ message: 'Usuario deletado com sucesso', user });
  } catch (error) {
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

export default routes;
