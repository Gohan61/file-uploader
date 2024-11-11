import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import express, { Request, Response } from "express";
import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

export const newFolder = [
  body("title", "Title cannot be empty").trim().isLength({ min: 1 }),

  asyncHandler(async (req, res, next): Promise<any> => {
    const errors = validationResult(req);
    const body: { title: string } = req.body;
    const userId: number | undefined = (req.user as User).id;
    let fileName;

    if (userId) {
      fileName = await prisma.folder.findUnique({
        where: {
          title: body.title,
          userId: userId,
        },
      });
    } else {
      return res.status(404).json({ errors: "Something went wrong" });
    }

    if (!errors.isEmpty()) {
      res.status(500).json({ errors: errors.array() });
    } else if (fileName) {
      res.status(500).json({ errors: "Folder name already exists" });
    } else {
      await prisma.folder.create({
        data: {
          title: body.title,
          userId: userId,
        },
      });
      return res.status(200).json({ message: "Folder created" });
    }
  }),
];

export const getFolder = asyncHandler(async (req, res, next): Promise<any> => {
  const title: string | undefined = req.params.title;
  const userId: number | undefined = (req.user as User).id;
  let folder;

  if (userId) {
    folder = await prisma.folder.findMany({
      where: {
        title: title,
        userId: userId,
      },
      include: {
        files: true,
      },
    });
  } else {
    return res.status(404).json({ errors: "Something went wrong" });
  }

  if (!folder.length) {
    return res.status(404).json({ errors: "Could not find folder" });
  } else {
    return res.status(200).json({ folder: folder });
  }
});

export const deleteFolder = asyncHandler(
  async (req, res, next): Promise<any> => {
    const fileTitle: string = req.params.title;
    const userId: number | undefined = (req.user as User).id;
    let folder;

    if (userId) {
      folder = await prisma.folder.findUnique({
        where: {
          title: fileTitle,
        },
      });
    } else {
      return res.status(404).json({ errors: "Something went wrong" });
    }

    if (!folder) {
      return res.status(404).json({ error: "Could not find folder" });
    } else {
      await prisma.folder.delete({
        where: {
          title: fileTitle,
        },
      });
      return res.status(200).json({ message: "Folder deleted" });
    }
  }
);

export const updateFolder = [
  body("newTitle", "Title cannot be empty").trim().isLength({ min: 1 }),

  asyncHandler(async (req, res, next): Promise<any> => {
    const errors = validationResult(req);
    const body: { id: string; newTitle: string } = req.body;
    const userId: number | undefined = (req.user as User).id;
    const title: string = req.params.title;
    let file;

    if (!errors.isEmpty()) {
      res.status(500).json({ errors: errors.array() });
    }

    if (userId) {
      file = await prisma.folder.findUnique({
        where: {
          title: body.newTitle,
          userId: userId,
          NOT: {
            id: Number(body.id),
          },
        },
      });
    } else {
      return res.status(404).json({ errors: "Something went wrong" });
    }

    if (file) {
      return res.status(500).json({ message: "Folder name already exists" });
    } else {
      await prisma.folder.update({
        where: {
          id: Number(body.id),
          title: title,
          userId: userId,
        },
        data: {
          title: body.newTitle,
        },
      });

      return res.status(200).json({ message: "Folder name changed" });
    }
  }),
];

export const getAllFolders = asyncHandler(
  async (req, res, next): Promise<any> => {
    const userId: number | undefined = (req.user as User).id;
    let folders;

    if (userId) {
      folders = await prisma.folder.findMany({
        where: {
          userId: userId,
        },
      });
    } else {
      return res.status(404).json({ errors: "Something went wrong" });
    }

    if (!folders || folders.length === 0) {
      return res.status(404).json({ errors: "No folders found" });
    } else {
      return res.status(200).json({ folders: folders });
    }
  }
);
