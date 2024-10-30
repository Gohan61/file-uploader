import request from "supertest";
import express from "express";
import { PrismaClient } from "@prisma/client";
import "../src/config/passport";
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

beforeAll(async () => {
  await seed();
});

afterAll(async () => {
  await prisma.user.deleteMany({});
  await prisma.files.deleteMany({});
});

describe("User can upload files", () => {
  it("sign user in", async () => {
    const res = await request(app)
      .post("/signin")
      .type("form")
      .send({ username: "testing", password: "testing" })
      .then((res) => {
        expect(res.status).toBe(200);
      });
  });

  it("Returns on no file", async () => {
    const res = await request(app)
      .post("/files/newFile")
      .type("form")
      .send({ name: "text" })
      .then((res) => {
        expect(res.status).toBe(500);
        expect(res.error).not.toBeFalsy();
      });
  });

  it("Returns on no file delete route", async () => {
    const res = await request(app)
      .delete("/files/12")
      .type("form")
      .then((res) => {
        expect(res.status).toBe(500);
        expect(res.error).not.toBeFalsy();
      });
  });

  it("Returns details of file", async () => {
    const res = await request(app)
      .get("/files/1")
      .type("form")
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.file).not.toBeFalsy();
      });
  });

  it("Returns error on non-existing file", async () => {
    const res = await request(app)
      .get("/files/13")
      .type("form")
      .then((res) => {
        expect(res.status).toBe(404);
        expect(res.error).not.toBeFalsy();
      });
  });

  it("Updates file name + folder", async () => {
    const res = await request(app)
      .put("/files/1")
      .type("form")
      .send({ newFolder: "Second folder", newTitle: "New Title" })
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.message).not.toBeFalsy();
      });
  });

  it("Returns error on non-existing folder", async () => {
    const res = await request(app)
      .put("/files/1")
      .type("form")
      .send({ newFolder: "Third folder" })
      .then((res) => {
        expect(res.status).toBe(500);
        expect(res.error).not.toBeFalsy();
      });
  });

  it("Succesfully returns on delete file", async () => {
    const res = await request(app)
      .delete("/files/1")
      .type("form")
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.message).not.toBeFalsy();
      });
  });
});
