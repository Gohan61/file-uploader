import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.TEST_DATABASE_URL,
    },
  },
});

export async function seed() {
  const testUser = await prisma.user.upsert({
    where: { username: "testing" },
    update: {},
    create: {
      id: 1,
      username: "testing",
      password: await bcrypt.hash("testing", 10),
    },
  });

  const testUser2 = await prisma.user.upsert({
    where: { username: "testing2" },
    update: {},
    create: {
      id: 2,
      username: "testing2",
      password: await bcrypt.hash("testing2", 10),
    },
  });

  const testFolder = await prisma.folder.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      title: "Test folder",
      userId: 1,
    },
  });

  const secondFolder = await prisma.folder.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      title: "Second folder",
      userId: 1,
    },
  });

  const thirdFolder = await prisma.folder.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      title: "Third folder",
      userId: 2,
    },
  });

  const testFile = await prisma.files.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      ownerId: 1,
      title: "Test file",
      link: "Link",
    },
  });
}

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
