import userService from '../services/userService.js';
import {
  BadRequest,
  NotFound,
} from '../services/exceptions/httpRequestError.js';

import { Resend } from 'resend';
const resend = new Resend(process.env.RE_KEY);

export default class userController {
  static createUser = async (req, res) => {
    try {
      const newUser = await userService.createUser(req.body);
      return res.status(201).json({ status: 201, message: 'Usuário criado.' });
    } catch (err) {
      return res.status(err.status || 500).json({
        status: err.status || 500,
        message: err.message || 'Internal Error',
      });
    }
  };

  static login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await userService.loginUser(email, password);
      return res.status(200).json({ id: user.id, acess_token: user.acess_token });
    } catch (err) {
      res.status(400).json(err);
    }
  };

  static sendEmail = async (req, res) => {
    try {
      const { email, message } = req.body;
      const { data, error } = await resend.emails.send({
        from: '3DOORS <onboarding@resend.dev>',
        to: ['3doors.suporte@gmail.com'],
        subject: 'Report',
        html: `
        E-mail: ${email} <br>
        Report: ${message}
        `,
      });
      if (error) {
        return res.status(400).json({ error });
      }
      res.status(200).json({ message: 'E-mail enviado com sucesso' });
    } catch (err) {
      res.status(500).json({ error: 'Erro interno do servidor: ' + err });
    }
  };

  static storeUserInfo = async (req, res) => {
    try {
      const { score, timeTaken } = req.body;
      const user = await userService.createSaveFile(score, timeTaken, req.user.email);
      return res.status(200).json({message: 'Pontuação atualizada com sucesso.' });
    } catch (err) {
      return res.status(err.status || 500).json({
        status: err.status || 500,
        message: err.message || 'Internal Error',
      });
    }
  };

  static findAllUsers = async (req, res) => {
    try {
      const users = await userService.findAllUsers();
      return res.status(200).json(users);
    } catch (err) {
      return res.status(err.status || 500).json({
        status: err.status || 500,
        message: err.message || 'Internal Error',
      });
    }
  };

  static findTopRanking = async (req, res) => {
    try {
      const rankingUsers = await userService.findRankingUsers();
      return res.status(200).json(rankingUsers);
    } catch (err) {
      return res.status(err.status || 500).json({
        status: err.status || 500,
        message: err.message || 'Internal Error',
      });
    }
  };

  static findUserByEmail = async (req, res) => {
    try {
      const user = await userService.findUserByEmail(req.params.email);
      if (!user) {
        throw new NotFound('Usuário não encontrado.');
      }
      return res.status(200).json(user);
    } catch (err) {
      return res.status(err.status || 500).json({
        status: err.status || 500,
        message: err.message || 'Internal Error',
      });
    }
  };

  static deleteUser = async (req, res) => {
    try {
      await userService.deleteUser(req.body.email);
      return res.status(200).json({ message: 'Usuário deletado.' });
    } catch (err) {
      return res.status(err.status || 500).json({
        status: err.status || 500,
        message: err.message || 'Internal Error',
      });
    }
  };

  static atualizaDadosUser = async (req, res) => {
    try {
      const userAtualizado = await userService.atualizaDadosUser(
        req.params.email,
        req.body,
      );
      return res.status(200).json(userAtualizado);
    } catch (err) {
      return res.status(err.status || 500).json({
        status: err.status || 500,
        message: err.message || 'Internal Error',
      });
    }
  };
}
