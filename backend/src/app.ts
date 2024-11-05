import express, {
  Express,
  Request,
  Response,
  Application,
  NextFunction,
} from "express";
import cors from "cors";
import dotenv from "dotenv";
import { router } from "./routes/index";
import { fileRouter } from "./routes/files";
import { folderRouter } from "./routes/folders";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { PrismaClient } from "@prisma/client";
import session from "express-session";
import passport from "passport";
import "./config/passport";

export const app: Application = express();

app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
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

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status | 500);
  res.send({ error: err });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
