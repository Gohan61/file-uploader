import request from "supertest";
import { beforeAll, afterAll, describe, it, expect } from "@jest/globals";
import express from "express";
import { PrismaClient } from "@prisma/client";
import "../src/config/passport";
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
  await prisma.files.deleteMany({});
  await prisma.folder.deleteMany({});
  await prisma.user.deleteMany({});
});

afterAll(async () => {
  await prisma.files.deleteMany({});
  await prisma.folder.deleteMany({});
  await prisma.user.deleteMany({});
});

describe("post requests", () => {
  it("user can sign up", async () => {
    const res = await request(app)
      .post("/signup")
      .type("form")
      .send({ username: "testing", password: "testing" })
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.message).not.toBeFalsy();
      });
  });

  it("returns validation errors", async () => {
    const res = await request(app)
      .post("/signin")
      .type("form")
      .send({ username: "", password: "" })
      .then((res) => {
        expect(res.body.message).not.toBeFalsy();
        expect(res.status).toBe(404);
      });
  });

  it("returns user not found", async () => {
    const res = await request(app)
      .post("/signin")
      .type("form")
      .send({ username: "manfried", password: "manfried" })
      .then((res) => {
        expect(res.error).not.toBeFalsy();
        expect(res.status).toBe(404);
      });
  });

  it("signs user in", async () => {
    const res = await request(app)
      .post("/signin")
      .type("form")
      .send({ username: "testing", password: "testing" })
      .then((res) => {
        expect(res.status).toBe(200);
      });
  });
});
