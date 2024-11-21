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
      fileName = await prisma.folder.findMany({
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
    } else if (fileName.length !== 0) {
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
  const folderId: number | undefined = Number(req.params.folderId);
  const userId: number | undefined = (req.user as User).id;
  let folder;

  if (userId) {
    folder = await prisma.folder.findMany({
      where: {
        id: folderId,
        userId: userId,
      },
      include: {
        files: {
          select: {
            id: true,
            title: true,
            ownerId: true,
            createdAt: true,
            updatedAt: true,
            size: true,
            uploadTime: true,
            link: false,
            folderId: true,
          },
        },
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
    const folderId: number = Number(req.params.folderId);
    const userId: number | undefined = (req.user as User).id;
    let folder;

    if (userId) {
      folder = await prisma.folder.findUnique({
        where: {
          id: folderId,
        },
        include: {
          _count: {
            select: { files: true },
          },
        },
      });
    } else {
      return res.status(404).json({ errors: "Something went wrong" });
    }

    if (!folder) {
      return res.status(404).json({ errors: "Could not find folder" });
    } else if (folder.title === "main") {
      return res
        .status(500)
        .json({ errors: "Can't delete default folder main" });
    } else if (folder._count.files !== 0) {
      return res.status(500).json({
        errors: "Folder is not empty, please move or delete files first",
      });
    } else {
      await prisma.folder.delete({
        where: {
          id: folderId,
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
      return res.status(500).json({ errors: errors.array()[0].msg });
    }

    if (userId) {
      file = await prisma.folder.findMany({
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

    if (file.length !== 0) {
      return res.status(500).json({ message: "Folder name already exists" });
    } else if (title === "main") {
      return res
        .status(500)
        .json({ errors: "Cannot change default folder name" });
    } else {
      await prisma.folder.update({
        where: {
          id: Number(body.id),
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
