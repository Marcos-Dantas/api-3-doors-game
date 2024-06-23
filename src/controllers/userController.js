import userService from '../services/userService.js';
import { verifyApiKey } from '../middlewares/authMiddleware.js';

export default class userController {
  static findAllUsers = async (req, res) => {
    try {
      const users = await userService.findAllUsers();
      return res.status(200).json(users);
    } catch (err) {
      return res.status(422).json({ errors: err });
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
