import { fileRouter } from "../routes/files";
import express, { Express } from "express";
import { PrismaClient } from "@prisma/client";
import "../config/passport";
import { router } from "../routes";
import session from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import passport from "passport";
import { folderRouter } from "../routes/folders";

export default function middleWare(app: Express) {
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: false }));

  app.use(
    session({
      cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000, // ms
      },
      secret: process.env.secret as string,
      resave: true,
      saveUninitialized: true,
      store: new PrismaSessionStore(new PrismaClient(), {
        checkPeriod: 2 * 60 * 1000, //ms
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }),
    })
  );
  app.use(passport.session());

  app.use("/", router);
  app.use("/files", passport.authenticate("session"), fileRouter);
  app.use("/folders", passport.authenticate("session"), folderRouter);
}
