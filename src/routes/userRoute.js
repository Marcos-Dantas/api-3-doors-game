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

export default routes;
