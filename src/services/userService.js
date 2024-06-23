import User from '../models/User.js';
import Player from '../models/Player.js';
import {
  NotFound,
  UnprocessableEntity,
  InternalServerError,
} from './exceptions/httpRequestError.js';

export default class userService {
  static findAllUsers = async () => {
    try {
      const users = await User.findAllUsers();
      return users;
    } catch (err) {
      throw new InternalServerError();
    }
  };

  static findRankingUsers = async () => {
    try {
      const limit = 3;
      const topPlayers = await Player.topPlayers(limit);
      if (!topPlayers || topPlayers.length === 0) {
        throw new UnprocessableEntity('Lista de Score vazia.');
      }
      let dadosUsers = [];
      topPlayers.map(async (player) => {
        dadosUsers.push({
          nome: player.user.name,
          email: player.userEmail,
          score: player.score,
        });
      });
      return dadosUsers;
    } catch (err) {
      throw new InternalServerError();
    }
  };

  static findUserByEmail = async (email) => {
    try {
      const user = await User.findByEmail(email);
      if (!user) {
        throw new NotFound('Usuário não encontrado.');
      }
      delete user.password;
      return user;
    } catch (err) {
      throw new InternalServerError();
    }
  };
}
