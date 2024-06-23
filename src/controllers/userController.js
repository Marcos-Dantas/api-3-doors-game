import userService from '../services/userService.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

export default class userController {
  static findAllUsers = async (req, res) => {
    try {
      const users = await userService.findAllUsers();
      return res.status(200).json({ users });
    } catch (err) {
      return res.status(422).json({ errors: err });
    }
  };

  static findTopRanking = async (req, res) => {
    try {
      const rankingUsers = await userService.findRankingUsers();
      return res.status(200).json({ rankingUsers });
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
      return res.status(200).json({ user });
    } catch (err) {
      return res.status(err.status || 500).json({
        status: err.status || 500,
        message: err.message || 'Internal Error',
      });
    }
  };
}
