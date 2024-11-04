import express, { Router } from "express";
import {
  deleteFolder,
  getAllFolders,
  getFolder,
  newFolder,
  updateFolder,
} from "../controllers/folder-control";

export const folderRouter = express.Router();

folderRouter.post("/new", newFolder);

folderRouter.get("/", getAllFolders);

folderRouter.get("/:title", getFolder);

folderRouter.delete("/:title", deleteFolder);

folderRouter.put("/:title", updateFolder);
