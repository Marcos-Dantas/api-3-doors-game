import User from '../models/User.js';
import Player from '../models/Player.js';
import { UnprocessableEntity } from './exceptions/httpRequestError.js';

export default class userService {
  static findAllUsers = async () => {
    try {
      const users = await User.findAllUsers();
      return users;
    } catch (err) {
      return err;
    }
  };

  static findRankingUsers = async () => {
    try {
      const limit = 3;
      const topPlayers = await Player.topPlayers(limit);
      if (!topPlayers || topPlayers.length === 0) {
        throw new UnprocessableEntity('Lista de Players Vazia.');
      }
      const dadosUsers = [];
      topPlayers.map(async (player) => {
        dadosUsers.push({
          email: player.userEmail,
          score: player.score,
        });
      });
      return dadosUsers;
    } catch (err) {
      throw err;
    }
  };
}
