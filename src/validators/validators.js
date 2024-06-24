import { body } from 'express-validator';
import { validationResult } from 'express-validator';
import userService from '../services/userService.js';

export const getValidators = () => ({
  createUserValidator: [
    body('name', 'O nome deve ter pelo menos 3 caracteres').isLength({
      min: 3,
    }),
    body('city', 'Cidade não pode ser vazia').not().isEmpty(),
    body('state', 'Estado não pode ser vazio').not().isEmpty(),
    body('age', 'A idade deve ser um número inteiro positivo').isInt({
      min: 1,
    }),
    body('email', 'Email invalido').isEmail(),
    body('email').custom(async (email) => {
      if (email) {
        const user = await userService.findUserByEmail(email);
        if (user) {
          throw new Error('Email ja esta em uso');
        }
      }
    }),
    body(
      'password',
      'O comprimento mínimo da senha é de 6 caracteres',
    ).isLength({ min: 6 }),
  ],
  loginValidator: [
    body('email', 'Email invalido').isEmail(),
    body(
      'password',
      'O comprimento mínimo da senha é de 6 caracteres',
    ).isLength({ min: 6 }),
  ],
});

export const validator = (req) => {
  return validationResult(req);
};
