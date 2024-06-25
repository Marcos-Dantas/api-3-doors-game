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

const { createUserValidator, loginValidator, storeUserInfoValidator } = getValidators();

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

routes.post(
  '/store-user-info',
  verifyApiKey,
  verifyToken,
  storeUserInfoValidator,
  validateData,
  userController.storeUserInfo,
);

routes.get('/users/top-ranking', verifyApiKey, userController.findTopRanking);
routes.get('/users/:email', verifyApiKey, userController.findUserByEmail);
routes.put('/users/:email', verifyApiKey, userController.atualizaDadosUser);
routes.get('/users', verifyApiKey, userController.findAllUsers);
routes.delete('/users', verifyApiKey, userController.deleteUser);

export default routes;
