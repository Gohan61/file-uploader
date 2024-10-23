import express, { Router } from "express";
import { newFile } from "../controllers/file-control";
import { upload } from "../config/upload";

export const fileRouter = express.Router();

fileRouter.post("/newfile", upload.single("text"), newFile);
