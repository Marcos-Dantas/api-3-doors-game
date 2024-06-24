import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default class SaveFile {
    static async topPlayers(limit) {
      return await prisma.saveFile.findMany({
        where: {
          score: {
            not: 0,
            not: null
          }
        },
        orderBy: [
          { timeTaken: 'asc' },
          { score: 'desc' }
        ],
        take: limit,
        include: {
          user: { select: { name: true } },
        },
      });
    }

  static async deleteSaveFiles(email) {
    return await prisma.saveFile.delete({
      where: { userEmail: email },
    });
  }
}
