import express from 'express';
import userController from '../controllers/userController.js';
import { getValidators } from '../validators/validators.js';
import dotenv from 'dotenv';
import {
  verifyApiKey,
  verifyToken,
  validateData,
} from '../middlewares/authMiddleware.js';

const routes = express.Router();

const { createUserValidator, loginValidator } = getValidators();

dotenv.config();

routes.post(
  '/signup',
  verifyApiKey,
  createUserValidator,
  validateData,
  userController.createUser,
);

routes.post(
  '/login',
  verifyApiKey,
  loginValidator,
  validateData,
  userController.login,
);

routes.post(
  '/sendmail',
  verifyApiKey,
  userController.sendEmail,
);


// rota de exemplo, apenas para testar a verificação do token de logado esta correta
// routes.post('/store-user-informations', verifyApiKey, verifyToken, async (req, res) => {
//     return res.json({resuld:'parabens!! dados do seu usuario foram armazenados'});
// });
routes.get('/users/top-ranking', verifyApiKey, userController.findTopRanking);
routes.get('/users/:email', verifyApiKey, userController.findUserByEmail);
routes.put('/users/:email', verifyApiKey, userController.atualizaDadosUser);
routes.get('/users', verifyApiKey, userController.findAllUsers);
routes.delete('/users', verifyApiKey, userController.deleteUser);



app.post('/pontuacao', async (req, res) => {
  const { email, pontos } = req.body;
  
  try {
      let playerScore = await prisma.playerScore.findUnique({
          where: { email },
      });

      if (!playerScore) {
          playerScore = await prisma.playerScore.create({
              data: {
                  email,
                  pontos,
              },
          });
      } else {
          playerScore = await prisma.playerScore.update({
              where: { email },
              data: {
                  pontos: {
                      increment: pontos,
                  },
              },
          });
      }

      res.send('Pontuação atualizada com sucesso!');
  } catch (err) {
      console.error('Erro ao atualizar pontuação:', err);
      res.status(500).send('Erro ao atualizar pontuação');
  }
});

export default routes;
