import express from "express";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv"

const prisma = new PrismaClient();

var app = express();
app.use(express.json());

dotenv.config();

// Rota para obter todos os usuários
app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany({});
  res.status(200).json(users)
});
  
// Rota para criar um novo usuário
app.post('/users', async (req, res) => {
const { name, email} = req.body;
const newUser = await prisma.user.create({
  data: { name, email},
});
res.status(201).json(newUser)
});

// Rota para pegar um usuário especifico
app.get('/user/:id', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {id: parseInt(req.params.id, 10)}
    })
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
app.delete('/user/:id', async (req, res) => {
  try {
    const user = await prisma.user.delete({
      where: {id: parseInt(req.params.id, 10)}
    })
    res.json({ message: 'Usuario deletado com sucesso', user });

  } catch (error) {
    if (error.code === 'P2025') { 
      res.status(404).json({ error: 'User not found' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});
  
app.listen(3000, () => {
  console.log('Server running on port 3000');
});