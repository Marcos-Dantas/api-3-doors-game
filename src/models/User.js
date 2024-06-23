import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default class User {
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
