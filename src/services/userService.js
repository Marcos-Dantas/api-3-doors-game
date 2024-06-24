import User from '../models/User.js';
import Player from '../models/SaveFile.js';
import {
  NotFound,
  UnprocessableEntity,
  InternalServerError,
} from './exceptions/httpRequestError.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import SaveFile from '../models/SaveFile.js';

export default class userService {
  static createUser = async (newUser) => {
    try {
      const user = await User.createNewUser(newUser);
      return user;
    } catch (err) {
      throw err;
    }
  };
  static createSaveFile = async (score, timeTaken, userEmail) => {
    try {
      const saveFile = await SaveFile.createSaveFile(score, timeTaken, userEmail);
      return saveFile;
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
      const topPlayersSaveFile = await SaveFile.topPlayers(limit);
      if (!topPlayersSaveFile || topPlayersSaveFile.length === 0) {
        throw new UnprocessableEntity('Lista de Score vazia.');
      }
      let dadosUsers = [];
      topPlayersSaveFile.map(async (savefile) => {
        dadosUsers.push({
          nome: savefile.user.name,
          email: savefile.userEmail,
          score: savefile.score,
          timetaken: savefile.timeTaken // tempo em segundos
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
      await SaveFile.deleteSaveFiles(email);
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
      return { id: user.id, acess_token: token };
    } catch (err) {
      if (err instanceof NotFound) {
        throw err;
      }
      throw new InternalServerError();
    }
  };
}
