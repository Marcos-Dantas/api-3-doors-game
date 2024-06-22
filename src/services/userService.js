import User from '../models/User.js';

export default class userService {
  static findAllUsers = async () => {
    try {
      const users = await User.findAllUsers();
      return users;
    } catch (err) {
      return err;
    }
  };
}
