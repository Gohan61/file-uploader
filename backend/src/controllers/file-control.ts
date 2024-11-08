import asyncHandler from "express-async-handler";
import { body, validationResult } from "express-validator";
import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { User } from "@prisma/client";
import { format, formatDistance, formatRelative, subDays } from "date-fns";

const prisma = new PrismaClient();

export const newFile = [
  body("title").trim().isLength({ min: 1 }),

  asyncHandler(async (req: Request, res: Response, next): Promise<any> => {
    let file;
    const body: { folderId: string; sendTime: string } = req.body;
    const user = req.user as User | undefined;

    if (req.file && user) {
      const uploadTimeSeconds = Math.round(
        (Date.now() - Number(body.sendTime)) / 1000
      );
      const sizeInMB =
        (Number(req.file?.size) / (1024 * 1024)).toFixed(2) + " MB";
      const ownerId = Number(user.id);
      const folderId = Number(body.folderId);
      const createdAt = format(new Date(), "PPPP");
      const fileName: string = req.file.filename;

      file = await prisma.files.create({
        data: {
          title: fileName,
          ownerId: ownerId,
          folderId: folderId,
          createdAt: createdAt,
          size: sizeInMB,
          uploadTime: uploadTimeSeconds,
          link: "test",
        },
      });

      if (file) {
        return res.status(200).json({ message: "File uploaded" });
      }
    } else {
      return res.status(500).json({ error: "Something went wrong" });
    }
  }),
];

export const deleteFile = asyncHandler(
  async (req: Request, res: Response, next): Promise<any> => {
    const fileId: number = Number(req.params.file);
    const file = await prisma.files.findUnique({
      where: {
        id: fileId,
      },
    });

    if (!file) {
      return res.status(500).json({ error: "File not found" });
    }

    await prisma.files.delete({
      where: {
        id: file.id,
      },
    });

    return res.status(200).json({ message: "File deleted" });
  }
);

export const getFile = asyncHandler(async (req, res, next): Promise<any> => {
  const fileId = Number(req.params.fileId);
  const file = await prisma.files.findUnique({
    where: {
      id: fileId,
    },
  });

  if (!file) {
    return res.status(404).json({ error: "File not found" });
  } else {
    return res.status(200).json({ file: file });
  }
});

export const updateFile = [
  body("newTitle", "Title cannot be empty").trim().isLength({ min: 1 }),
  body("newFolder", "Folder name cannot be empty").trim().isLength({ min: 1 }),

  asyncHandler(async (req, res, next): Promise<any> => {
    const errors = validationResult(req);
    const fileId = Number(req.params.fileId);
    const file = await prisma.files.findUnique({
      where: {
        id: fileId,
      },
    });

    const newFolder = await prisma.folder.findUnique({
      where: {
        title: req.body.newFolder,
      },
    });

    if (!errors.isEmpty()) {
      return res.status(500).json({ errors: errors.array() });
    } else if (!file || !newFolder) {
      return res.status(500).json({ error: "Folder or file does not exist" });
    } else {
      const updateFile = await prisma.files.update({
        where: {
          id: fileId,
        },
        data: {
          title: req.body.newTitle,
          folderId: newFolder.id,
        },
      });

      return res.status(200).json({ message: "File updated" });
    }
  }),
];
