import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export default class User {
  static async createNewUser(newUser) {
    const saltRounds = 10;
    newUser.password = await bcrypt.hash(newUser.password, saltRounds);
    return await prisma.user.create({
      data: {
        ...newUser,
        player: { create: {} },
      },
      include: {
        player: true,
      },
    });
  }

  static async findAllUsers() {
    return await prisma.user.findMany();
  }

  static async findByEmail(email) {
    return await prisma.user.findUnique({
      where: { email: email },
    });
  }

  static async deleteUser(email) {
    return await prisma.user.delete({
      where: { email },
    });
  }

  static async updateUser(email, data) {
    return await prisma.user.update({
      where: { email },
      data: {
        ...data,
      },
    });
  }
}
