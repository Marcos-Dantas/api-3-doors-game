import express from 'express';
import { PrismaClient } from '@prisma/client';
import userController from '../controllers/userController.js';
import getValidators from '../validators/validators.js';
import dotenv from 'dotenv';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { verifyApiKey, verifyToken } from '../middlewares/authMiddleware.js';
import { Resend } from 'resend';

const resend = new Resend(process.env.RE_KEY);
const routes = express.Router();

const SECRET_KEY = process.env.SECRET_KEY;

const prisma = new PrismaClient();
const { createUserValidator, loginValidator } = getValidators(prisma);

dotenv.config();

routes.post('/signup', verifyApiKey, createUserValidator, async (req, res) => {
  const errors = validationResult(req);

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

routes.post("/sendmail", verifyApiKey, async (req, res) => {
  try {
    const { email, message } = req.body;
    console.log(email, message);
    const { data, error } = await resend.emails.send({
      from: "3DOORS <onboarding@resend.dev>",
      to: ["3doors.suporte@gmail.com"],
      subject: "Report",
      html: `
      E-mail: ${email} <br>
      Report: ${message}
      `,
    });
    if (error) {
      return res.status(400).json({ error });
    }
    res.status(200).json({ message: "E-mail enviado com sucesso" });
  }catch (err) {
    console.error("Erro ao enviar e-mail:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
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
