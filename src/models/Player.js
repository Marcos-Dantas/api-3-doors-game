import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default class Player {
  static async topPlayers(limit) {
    return await prisma.player.findMany({
      where: { score: { not: null } },
      orderBy: { score: 'desc' },
      take: limit,
      include: {
        user: { select: { name: true } },
      },
    });
  }

  static async getAllPlayers() {
    return await prisma.player.findMany();
  }

  static async deletePlayer(email) {
    return await prisma.player.delete({
      where: { userEmail: email },
    });
  }
}
