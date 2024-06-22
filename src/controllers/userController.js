import userService from '../services/userService.js';

export default class userController {
  static findAllUsers = async (req, res) => {
    try {
      const users = await userService.findAllUsers();
      return res.status(200).json({ users });
    } catch (err) {
      return res.status(422).json({ errors: err });
    }
  };
}
