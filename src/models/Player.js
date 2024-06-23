import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default class Player {
  static async topPlayersOld(limit) {
    return await prisma.$queryRaw`SELECT * FROM "public"."Player" WHERE score IS NOT NULL ORDER BY score DESC LIMIT ${limit}`;
  }

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
}
