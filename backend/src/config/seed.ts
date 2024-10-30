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
  const testFolder = await prisma.folder.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      title: "Test folder",
    },
  });

  const secondFolder = await prisma.folder.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      title: "Second folder",
    },
  });

  const testUser = await prisma.user.upsert({
    where: { username: "testing" },
    update: {},
    create: {
      id: 1,
      username: "testing",
      password: await bcrypt.hash("testing", 10),
      files: {
        create: [{ id: 1, title: "Test file", link: "Link", folderId: 1 }],
      },
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
