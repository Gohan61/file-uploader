import express, { Router } from "express";
import {
  deleteFile,
  getFile,
  newFile,
  updateFile,
} from "../controllers/file-control";
import { upload } from "../config/upload";

export const fileRouter = express.Router();

fileRouter.post("/newfile", upload.single("text"), newFile);

fileRouter.delete("/:file", deleteFile);

fileRouter.get("/:fileId", getFile);

fileRouter.put("/:fileId", updateFile);
