const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

var express = require("express");
var app = express();
app.use(express.json());

var checkForApiToken = require("./checkForApiToken");

require('dotenv').config();

// Rota para obter todos os usuários
app.get('/users', checkForApiToken, async (req, res) => {
  try {
    console.log('here232323')
    const users = await prisma.user.findMany();
    
    console.log('hereteste')
    res.json(users);
  } catch (error) {
    console.log('entrou aqui')
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
  
// Rota para criar um novo usuário
app.post('/users', checkForApiToken, async (req, res) => {
const { name, email, password } = req.body;
try {
    const newUser = await prisma.user.create({
    data: { name, email, password },
    });
    res.json(newUser);
} catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
}
});

// Rota para pegar um usuário especifico
app.get('/user/:id', checkForApiToken, async (req, res) => {
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
app.delete('/user/:id', checkForApiToken, async (req, res) => {
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