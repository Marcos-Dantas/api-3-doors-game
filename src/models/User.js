import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default class User {
  static async findAllUsers() {
    return await prisma.user.findMany();
  }
}
