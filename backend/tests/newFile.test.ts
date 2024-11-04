import request from "supertest-session";
import { SuperTest, Session } from "supertest-session";
import { beforeAll, afterAll, describe, it, expect } from "@jest/globals";
import express from "express";
import { PrismaClient } from "@prisma/client";
import "../src/config/passport";
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

describe("User can upload files", () => {
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

  it("sign user in", async () => {
    await session
      .post("/signin")
      .type("form")
      .send({ username: "testing", password: "testing" })
      .then((res) => {
        expect(res.status).toBe(200);
      });
  });

  it("Returns on no file", async () => {
    await session
      .post("/files/newFile")
      .type("form")
      .send({ name: "text" })
      .then((res) => {
        expect(res.status).toBe(500);
        expect(res.error).not.toBeFalsy();
      });
  });

  it("Returns on no file delete route", async () => {
    await session
      .delete("/files/12")
      .type("form")
      .then((res) => {
        expect(res.status).toBe(500);
        expect(res.error).not.toBeFalsy();
      });
  });

  it("Returns details of file", async () => {
    await session
      .get("/files/1")
      .type("form")
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.file).not.toBeFalsy();
      });
  });

  it("Returns error on non-existing file", async () => {
    await session
      .get("/files/13")
      .type("form")
      .then((res) => {
        expect(res.status).toBe(404);
        expect(res.error).not.toBeFalsy();
      });
  });

  it("Updates file name + folder", async () => {
    await session
      .put("/files/1")
      .type("form")
      .send({ newFolder: "Second folder", newTitle: "New Title" })
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.message).not.toBeFalsy();
      });
  });

  it("Returns error on non-existing folder", async () => {
    await session
      .put("/files/1")
      .type("form")
      .send({ newFolder: "Third folder" })
      .then((res) => {
        expect(res.status).toBe(500);
        expect(res.error).not.toBeFalsy();
      });
  });

  it("Succesfully returns on delete file", async () => {
    await session
      .delete("/files/1")
      .type("form")
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.message).not.toBeFalsy();
      });
  });
});
