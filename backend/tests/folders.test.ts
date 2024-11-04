import request from "supertest-session";
import { SuperTest, Session } from "supertest-session";
import { beforeAll, afterAll, describe, it, expect } from "@jest/globals";
import express, { application } from "express";
import { PrismaClient } from "@prisma/client";
import { seed } from "../src/config/seed";
import middleWare from "../src/config/middleware-for-tests";

const app = express();

middleWare(app);

const databaseUrl =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_DATABASE_URL
    : process.env.DATABASE_URL;

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
});

describe("CRUD Folders", () => {
  let session: SuperTest<Session>;

  beforeAll(async () => {
    await prisma.files.deleteMany({});
    await prisma.folder.deleteMany({});
    await prisma.user.deleteMany({});

    await seed();
    session = request(app);
  });

  afterAll(async () => {
    await prisma.files.deleteMany({});
    await prisma.folder.deleteMany({});
    await prisma.user.deleteMany({});
  });

  it("Sign user in", async () => {
    await session
      .post("/signin")
      .type("form")
      .send({ username: "testing", password: "testing" })
      .then((res) => {
        expect(res.status).toBe(200);
      });
  });

  it("Succesfully creates new folder", async () => {
    await session
      .post("/folders/new")
      .type("form")
      .send({ title: "Another folder" })
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.message).not.toBeFalsy();
      });
  });

  it("Returns error on duplicate file name", async () => {
    await session
      .post("/folders/new")
      .type("form")
      .send({ title: "Test folder" })
      .then((res) => {
        expect(res.status).toBe(500);
        expect(res.body.message).not.toBeFalsy();
      });
  });

  it("Returns folder and contents", async () => {
    await session
      .get("/folders/Test folder")
      .type("form")
      .send({ title: "Test folder" })
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.folder).not.toBeFalsy();
      });
  });

  it("Returns error on non-existing folder", async () => {
    await session
      .get("/folders/non existing")
      .type("form")
      .send({ title: "non existing" })
      .then((res) => {
        expect(res.status).toBe(404);
        expect(res.error).not.toBeFalsy();
      });
  });

  it("Returns error on update to existing folder name", async () => {
    await session
      .put("/folders/Test folder")
      .type("form")
      .send({ newTitle: "Second folder", id: 1 })
      .then((res) => {
        expect(res.status).toBe(500);
        expect(res.body.message).not.toBeFalsy();
      });
  });

  it("Updates folder name", async () => {
    await session
      .put("/folders/Test folder")
      .type("form")
      .send({ newTitle: "Tested folder", id: 1 })
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.message).not.toBeFalsy();
      });
  });

  it("Returns all folders that user owns", async () => {
    await session
      .get("/folders/")
      .type("form")
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.folders.length).toBe(2);
      });
  });

  it("Returns errors deleting non-existing folder", async () => {
    await session
      .delete("/folders/non-existing")
      .type("form")
      .then((res) => {
        expect(res.status).toBe(404);
        expect(res.error).not.toBeFalsy();
      });
  });

  it("Deletes an existing folder", async () => {
    await session
      .delete("/folders/Tested folder")
      .type("form")
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.message).not.toBeFalsy();
      });
  });
});
