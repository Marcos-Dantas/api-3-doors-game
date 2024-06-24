import User from '../models/User.js';
import Player from '../models/Player.js';
import {
  NotFound,
  UnprocessableEntity,
  InternalServerError,
} from './exceptions/httpRequestError.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

export default class userService {
  static createUser = async (newUser) => {
    try {
      const user = await User.createNewUser(newUser);
      return user;
    } catch (err) {
      throw err;
    }
  };

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
      if (err instanceof UnprocessableEntity) {
        throw err;
      }
      throw new InternalServerError();
    }
  };

  static findUserByEmail = async (email) => {
    try {
      const user = await User.findByEmail(email);
      if (!user) {
        return false;
      }
      delete user.password;
      return user;
    } catch (err) {
      throw new InternalServerError();
    }
  };

  static deleteUser = async (email) => {
    try {
      await Player.deletePlayer(email);
      await User.deleteUser(email);
      return true;
    } catch (err) {
      throw new InternalServerError();
    }
  };

  static atualizaDadosUser = async (email, dados) => {
    try {
      const userUpdated = User.updateUser(email, dados);
      return userUpdated;
    } catch (err) {
      throw err;
    }
  };

  static loginUser = async (email, password) => {
    try {
      const user = await User.findByEmail(email);
      if (!user) {
        throw new NotFound('Email ou senha incorretos.');
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        throw new NotFound('Email ou senha incorretos.');
      }
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.SECRET_KEY,
      );
      return { id: user.id, token: token };
    } catch (err) {
      if (err instanceof NotFound) {
        throw err;
      }
      throw new InternalServerError();
    }
  };
}
