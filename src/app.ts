import express, { Express, Request, Response, Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { router } from "./routes/index";

const app: Application = express();
const port = process.env.PORT || 3000;

app.use("/", router);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
